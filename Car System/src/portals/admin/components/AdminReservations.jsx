import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { CalendarRange, ShieldAlert, XCircle, CheckCircle, Clock } from 'lucide-react';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchReservations = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/reservations')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setReservations(json.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch reservations:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = (resId, nextStatus) => {
    fetch(`http://localhost:5000/api/reservations/${resId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Hold status updated to: ${nextStatus.toUpperCase()}`);
          fetchReservations();
        }
      });
  };

  if (isLoading) return <TableSkeleton rows={4} cols={5} />;

  return (
    <div className="space-y-6 text-left">
      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border-hairline pb-4">
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Hold Bookings</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Active Vehicle Reservations
        </h2>
      </div>

      {/* Table */}
      <div className="bg-white border border-border-hairline shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4 font-semibold">Vehicle</th>
              <th className="py-3 px-4 font-semibold">Customer / Lead</th>
              <th className="py-3 px-4 font-semibold">Deposit Amount</th>
              <th className="py-3 px-4 font-semibold">Hold Expires At</th>
              <th className="py-3 px-4 text-right font-semibold">Status / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {reservations.map(res => {
              const hoursLeft = (new Date(res.hold_expires_at) - new Date()) / (1000 * 60 * 60);
              const isUrgent = hoursLeft > 0 && hoursLeft < 12 && res.status === 'confirmed';

              return (
                <tr key={res.id} className="hover:bg-neutral-50/50">
                  <td className="py-3.5 px-4 text-left">
                    <span className="font-display font-bold uppercase text-[11px] block text-charcoal">
                      {res.vehicles?.make} {res.vehicles?.model}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 block uppercase mt-0.5">
                      Year: {res.vehicles?.year} | Location: {res.vehicles?.location}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-left">
                    <span className="font-display font-bold uppercase text-[11px] block text-charcoal">
                      {res.leads?.name}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">
                      {res.leads?.email}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-500">
                    ${Number(res.deposit_amount).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-neutral-600">
                        {new Date(res.hold_expires_at).toLocaleDateString()}
                      </span>
                      {isUrgent && (
                        <span className="text-[8px] font-mono uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1 py-0.5 rounded-xs mt-1 self-start inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Expiring soon
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={res.status}
                        onChange={e => handleUpdateStatus(res.id, e.target.value)}
                        className="bg-transparent border border-neutral-200 text-xs py-1 px-2 outline-hidden cursor-pointer font-mono font-bold uppercase text-[9px]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
            {reservations.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-neutral-400 font-sans">
                  No active vehicle reservations logged in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
