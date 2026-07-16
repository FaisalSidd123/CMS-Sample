import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { Plus, X, Wrench, Clipboard, CheckCircle, Clock } from 'lucide-react';

export default function AdminService({ sharedVehicles = [] }) {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [vehicles, setVehicles] = useState(sharedVehicles);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Add service record
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehicleId, setVehicleId] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [scheduledDate, setScheduledDate] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchServiceRecords = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/service')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setServiceRecords(json.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch service records:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchServiceRecords();
    if (sharedVehicles.length === 0) {
      fetch('http://localhost:5000/api/vehicles')
        .then(res => res.json())
        .then(json => {
          if (json.success) setVehicles(json.data);
        });
    }
  }, [sharedVehicles]);

  const handleAddService = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch('http://localhost:5000/api/service', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vehicle_id: parseInt(vehicleId),
        description,
        cost: cost ? parseFloat(cost) : 0,
        status,
        scheduled_date: scheduledDate || new Date().toISOString()
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast('Service log added to database.');
          fetchServiceRecords();
          setShowAddForm(false);
          setVehicleId(''); setDescription(''); setCost(''); setScheduledDate('');
        }
      });
  };

  const handleUpdateStatus = (recordId, nextStatus) => {
    const token = sessionStorage.getItem('vanguard_admin_token');
    const body = { status: nextStatus };
    if (nextStatus === 'completed') {
      body.completed_date = new Date().toISOString();
    }

    fetch(`http://localhost:5000/api/service/${recordId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Service record status set to ${nextStatus.toUpperCase()}`);
          fetchServiceRecords();
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
      <div className="flex justify-between items-center border-b border-border-hairline pb-4">
        <div>
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Fleet Care</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Vehicle Detailing & Service
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Log</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddService} className="bg-white border border-border-hairline p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Select Vehicle</label>
            <select required value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer">
              <option value="">Choose vehicle...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Repair / Detailing Cost ($)</label>
            <input type="number" placeholder="e.g. 450" value={cost} onChange={e => setCost(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Scheduled Date</label>
            <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Initial Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer">
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Service Description</label>
            <input required type="text" placeholder="Detailing prep, mechanical check, engine spark plugs replacement..." value={description} onChange={e => setDescription(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2.5 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <button type="submit" className="md:col-span-2 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest py-3 cursor-pointer">Log Maintenance Record</button>
        </form>
      )}

      {/* Table */}
      <div className="bg-white border border-border-hairline shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4 font-semibold">Vehicle</th>
              <th className="py-3 px-4 font-semibold">Care Description</th>
              <th className="py-3 px-4 font-semibold">Repair Cost</th>
              <th className="py-3 px-4 font-semibold">Scheduled / Closed</th>
              <th className="py-3 px-4 text-right font-semibold">Service Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {serviceRecords.map(rec => (
              <tr key={rec.id} className="hover:bg-neutral-50/50">
                <td className="py-3.5 px-4 text-left">
                  <span className="font-display font-bold uppercase text-[11px] block text-charcoal">
                    {rec.vehicles?.make} {rec.vehicles?.model}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase mt-0.5">
                    Year: {rec.vehicles?.year}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-neutral-600 max-w-sm truncate">
                  {rec.description}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-neutral-500">
                  ${Number(rec.cost).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-mono text-[10px] text-neutral-400">
                  <div>Scheduled: {new Date(rec.scheduled_date).toLocaleDateString()}</div>
                  {rec.completed_date && <div className="text-green-600">Closed: {new Date(rec.completed_date).toLocaleDateString()}</div>}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <select
                    value={rec.status}
                    onChange={e => handleUpdateStatus(rec.id, e.target.value)}
                    className="bg-transparent border border-neutral-200 text-xs py-1 px-2 outline-hidden cursor-pointer font-mono font-bold uppercase text-[9px]"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
