import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { DollarSign, Search, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchPayments = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/payments')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setPayments(json.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch payments:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = (paymentId, nextStatus) => {
    fetch(`http://localhost:5000/api/payments/${paymentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status: nextStatus })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Payment status marked as ${nextStatus.toUpperCase()}`);
          fetchPayments();
        }
      });
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.leads?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.vehicles?.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Ledger Logs</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Escrow Payments & Billing
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-border-hairline p-4 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search buyer or vehicle..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-light-bg border border-border-hairline pl-9 pr-4 py-2 text-xs outline-hidden focus:border-brand-red"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[9px] font-mono uppercase text-neutral-400 tracking-wider font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-border-hairline px-2.5 py-1.5 text-xs outline-hidden cursor-pointer"
          >
            <option value="All">All Invoices</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border-hairline shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4 font-semibold">Payment ID</th>
              <th className="py-3 px-4 font-semibold">Transaction Details</th>
              <th className="py-3 px-4 font-semibold">Closing Amount</th>
              <th className="py-3 px-4 font-semibold">Due Date</th>
              <th className="py-3 px-4 text-right font-semibold">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {filteredPayments.map(p => {
              const isOverdue = p.payment_status === 'overdue';

              return (
                <tr 
                  key={p.id} 
                  className={`hover:bg-neutral-50/50 ${isOverdue ? 'border-l-4 border-l-brand-red bg-brand-red/5' : ''}`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">
                    tx-{p.id}
                  </td>
                  <td className="py-3.5 px-4 text-left">
                    <span className="font-display font-bold uppercase text-[11px] block text-charcoal">
                      {p.vehicles?.make} {p.vehicles?.model}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 block uppercase mt-0.5">
                      Buyer: {p.leads?.name} ({p.leads?.email})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-500">
                    ${Number(p.amount).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-400">
                    {new Date(p.due_date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={p.payment_status}
                      onChange={e => handleUpdateStatus(p.id, e.target.value)}
                      className="bg-transparent border border-neutral-200 text-xs py-1 px-2 outline-hidden cursor-pointer font-mono font-bold uppercase text-[9px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
