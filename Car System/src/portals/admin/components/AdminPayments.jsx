import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { DollarSign, Search, Check, FileCheck, Landmark, Calendar } from 'lucide-react';

export default function AdminPayments() {
  const [reservations, setReservations] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected reservation to allocate payment
  const [selectedRes, setSelectedRes] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Escrow Transfer');
  const [dueDate, setDueDate] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchAllocationsAndReservations = () => {
    setIsLoading(true);
    // 1. Fetch active reservations
    const fetchRes = fetch('http://localhost:5000/api/reservations').then(r => r.json());
    // 2. Fetch past payment ledger records
    const fetchPay = fetch('http://localhost:5000/api/payments').then(r => r.json());

    Promise.all([fetchRes, fetchPay])
      .then(([resJson, payJson]) => {
        if (resJson.success) {
          // Filter only active reservations (confirmed or pending)
          const activeHolds = resJson.data.filter(r => r.status === 'confirmed' || r.status === 'pending');
          setReservations(activeHolds);
        }
        if (payJson.success) {
          setPaymentsList(payJson.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load ledger sets:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAllocationsAndReservations();
  }, []);

  const handleSelectReservation = (res) => {
    setSelectedRes(res);
    // Autofill values based on selected vehicle/reservation
    // Default amount: extract number from price (e.g. "$112,000" -> 112000)
    const rawPrice = res.vehicles?.price;
    const cleanPrice = rawPrice ? parseInt(rawPrice.replace(/[^0-9]/g, '')) : 50000;
    setAmount(cleanPrice);
    
    // Set default due date to 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setDueDate(nextWeek.toISOString().split('T')[0]);
  };

  const handleAllocatePayment = (e) => {
    e.preventDefault();
    if (!selectedRes || !amount || !dueDate) return;

    const payload = {
      vehicle_id: selectedRes.vehicle_id,
      lead_id: selectedRes.lead_id,
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      payment_status: 'completed', // Direct allocation sets it paid
      due_date: new Date(dueDate).toISOString(),
      paid_at: new Date().toISOString(),
      reservation_id: selectedRes.id
    };

    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch('http://localhost:5000/api/payments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Payment allocated. Vehicle marked as SOLD.`);
          
          // Also set the reservation status to confirmed/completed (i.e. released/settled)
          fetch(`http://localhost:5000/api/reservations/${selectedRes.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'confirmed' })
          });

          setSelectedRes(null);
          fetchAllocationsAndReservations();
        } else {
          triggerToast(`Allocation error: ${json.error}`);
        }
      })
      .catch(err => triggerToast('Connection error allocating payments.'));
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.vehicles?.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.vehicles?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.leads?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) return <TableSkeleton rows={4} cols={5} />;

  return (
    <div className="space-y-8 text-left">
      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border-hairline pb-4">
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Allocations Ledger</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Escrow Payments & Allocations
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Reserved Vehicles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-hairline p-4 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">Reserved Fleet Registry</span>
              <div className="relative w-48">
                <input
                  type="text"
                  placeholder="Search reserved..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-light-bg border border-border-hairline pl-8 pr-3 py-1.5 text-xs outline-hidden focus:border-brand-red"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                    <th className="py-2.5 px-3 font-semibold">Vehicle Specs</th>
                    <th className="py-2.5 px-3 font-semibold">Hold Holder</th>
                    <th className="py-2.5 px-3 font-semibold">Hold Expiry</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredReservations.map(res => (
                    <tr key={res.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3">
                        <span className="font-display font-bold uppercase text-[11px] block text-charcoal">
                          {res.vehicles?.make} {res.vehicles?.model}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400">
                          Price: {res.vehicles?.price} | Year: {res.vehicles?.year}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-display font-semibold text-[11px] block text-charcoal">{res.leads?.name}</span>
                        <span className="text-[9px] font-mono text-neutral-400">{res.leads?.email}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-neutral-500">
                        {new Date(res.hold_expires_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button 
                          onClick={() => handleSelectReservation(res)}
                          className="bg-brand-red hover:bg-brand-red-hover text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 cursor-pointer transition-colors"
                        >
                          Collect Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReservations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-neutral-400 font-sans">
                        No reserved vehicles currently awaiting payment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allocation History Ledger */}
          <div className="bg-white border border-border-hairline p-4 shadow-xs space-y-4">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal block">Recent Ledger Settlements</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                    <th className="py-2.5 px-3 font-semibold">Receipt</th>
                    <th className="py-2.5 px-3 font-semibold">Settled Asset</th>
                    <th className="py-2.5 px-3 font-semibold">Payment Split</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paymentsList.map(pay => (
                    <tr key={pay.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3 font-mono text-neutral-400">#pay-{pay.id}</td>
                      <td className="py-3 px-3">
                        <span className="font-display font-semibold uppercase text-[11px] block text-charcoal">
                          {pay.vehicles?.make} {pay.vehicles?.model}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400">Buyer: {pay.leads?.name}</span>
                      </td>
                      <td className="py-3 px-3 leading-tight">
                        <div className="font-mono font-bold text-neutral-600">${Number(pay.amount).toLocaleString()}</div>
                        <div className="text-[8px] font-mono uppercase text-green-600 font-semibold">{pay.payment_method}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-400 text-[10px]">
                        {new Date(pay.paid_at || pay.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Columns - Payment Allocation Panel */}
        <div className="lg:col-span-1">
          {selectedRes ? (
            <form onSubmit={handleAllocatePayment} className="bg-white border border-border-hairline p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">Allocate Funds</span>
                <button type="button" onClick={() => setSelectedRes(null)} className="text-neutral-400 hover:text-brand-red cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-1 bg-neutral-50 p-3 border border-neutral-100 text-xs">
                <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 block">// Allocation Target</span>
                <span className="font-display font-extrabold uppercase text-charcoal block">
                  {selectedRes.vehicles?.make} {selectedRes.vehicles?.model}
                </span>
                <div className="text-[9px] font-mono text-neutral-500">
                  Hold Holder: {selectedRes.leads?.name}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Payment Amount ($ USD)</label>
                <input 
                  required 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" 
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                  className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer"
                >
                  <option value="Escrow Transfer">Escrow Transfer</option>
                  <option value="Bank Wire">Bank Wire</option>
                  <option value="Credit Ledger">Credit Ledger</option>
                  <option value="Financed Agreement">Financed Agreement</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Settlement Deadline</label>
                <input 
                  required 
                  type="date" 
                  value={dueDate} 
                  onChange={e => setDueDate(e.target.value)} 
                  className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-3 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Confirm Settlement</span>
              </button>
            </form>
          ) : (
            <div className="bg-white border border-border-hairline border-dashed p-8 text-center text-neutral-400 select-none flex flex-col items-center justify-center min-h-60">
              <Landmark className="w-10 h-10 text-neutral-300 mb-2" />
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal block">No Asset Selected</span>
              <span className="text-[9px] font-mono text-neutral-400 uppercase mt-1">Select a reserved vehicle on the left to allocate payment.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Inline helper for closing panel
function X({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
