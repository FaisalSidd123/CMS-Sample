import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { Plus, X, Clock, AlertTriangle, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Add reservation form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehicleId, setVehicleId] = useState('');
  const [leadId, setLeadId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [deposit, setDeposit] = useState('');
  const [holdExpiresAt, setHoldExpiresAt] = useState('');

  // Cancellation Modal/Prompt State
  const [cancelResId, setCancelResId] = useState(null);
  const [cancelReasonText, setCancelReasonText] = useState('');

  // Invoice Generation State
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchDependenciesAndReservations = () => {
    setIsLoading(true);
    const fetchRes = fetch(window.API_BASE_URL + '/reservations').then(r => r.json());
    const fetchVehicles = fetch(window.API_BASE_URL + '/vehicles').then(r => r.json());
    const fetchLeads = fetch(window.API_BASE_URL + '/leads').then(r => r.json());
    const fetchAgents = fetch(window.API_BASE_URL + '/agents').then(r => r.json());

    Promise.all([fetchRes, fetchVehicles, fetchLeads, fetchAgents])
      .then(([resJson, vJson, lJson, aJson]) => {
        if (resJson.success) setReservations(resJson.data);
        if (vJson.success) {
          const availableCars = vJson.data.filter(c => c.status === 'available');
          setVehicles(availableCars);
        }
        if (lJson.success) setLeads(lJson.data);
        if (aJson.success) setAgents(aJson.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load reservation registry datasets:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDependenciesAndReservations();
  }, []);

  const handleCreateReservation = (e) => {
    e.preventDefault();
    if (!vehicleId || !leadId || !deposit || !holdExpiresAt) return;

    const payload = {
      vehicle_id: parseInt(vehicleId),
      lead_id: parseInt(leadId),
      agent_id: agentId ? parseInt(agentId) : null,
      deposit_amount: parseFloat(deposit),
      status: 'confirmed',
      hold_expires_at: new Date(holdExpiresAt).toISOString(),
      cancellation_reason: null,
      invoice: null
    };

    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch(window.API_BASE_URL + '/reservations', {
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
          triggerToast('Reservation created. Vehicle status changed to RESERVED.');
          setShowAddForm(false);
          setVehicleId(''); setLeadId(''); setAgentId(''); setDeposit(''); setHoldExpiresAt('');
          fetchDependenciesAndReservations();
        } else {
          triggerToast(`Failed to hold vehicle: ${json.error}`);
        }
      })
      .catch(err => triggerToast('Connection error creating reservation.'));
  };

  const handleUpdateStatus = (resId, nextStatus) => {
    if (nextStatus === 'cancelled') {
      setCancelResId(resId);
      setCancelReasonText('');
      return;
    }

    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch(`${window.API_BASE_URL}/reservations/${resId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus, cancellation_reason: null })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Hold status updated to: ${nextStatus.toUpperCase()}`);
          fetchDependenciesAndReservations();
        }
      });
  };

  const submitCancellation = (e) => {
    e.preventDefault();
    if (!cancelResId || !cancelReasonText) return;

    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch(`${window.API_BASE_URL}/reservations/${cancelResId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'cancelled', cancellation_reason: cancelReasonText })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast('Hold cancelled with logged reason.');
          setCancelResId(null);
          fetchDependenciesAndReservations();
        }
      });
  };

  const handleGenerateInvoice = (res) => {
    if (res.invoice) {
      triggerToast('Invoice already exists for this reservation.');
      return;
    }

    setIsGenerating(true);
    const invoiceId = `INV-${res.id}-${Math.floor(100 + Math.random() * 900)}`;

    // Initialize jsPDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Header styling
    doc.setFont('courier', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38); // Vanguard Red
    doc.text("VANGUARD MOTORS - ESCROW INVOICE", 20, 20);

    // Divider Line
    doc.setLineWidth(0.4);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 24, 190, 24);

    // Metadata Section
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice Reference: ${invoiceId}`, 20, 32);
    doc.text(`Issue Date:        ${new Date().toLocaleDateString()}`, 20, 38);
    doc.text(`Client File Name:  ${res.leads?.name || 'Escrow Account'}`, 20, 44);
    doc.text(`Client Email:      ${res.leads?.email || 'N/A'}`, 20, 50);

    doc.line(20, 56, 190, 56);

    // Specifications Section
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text("VEHICLE PORTFOLIO SPECIFICATIONS", 20, 64);
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.text(`Asset Description:       ${res.vehicles?.year} ${res.vehicles?.make} ${res.vehicles?.model}`, 20, 72);
    doc.text(`Reference VIN:           VIN-${res.vehicles?.id}`, 20, 78);
    doc.text(`Final Decided Price:     $${Number(res.deposit_amount).toLocaleString()}`, 20, 84);

    doc.setFont('courier', 'bold');
    doc.text(`TOTAL OUTSTANDING COST:  $${Number(res.deposit_amount).toLocaleString()}`, 20, 94);

    doc.line(20, 102, 190, 102);
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    // Generate PDF as a native binary Blob
    const pdfBlob = doc.output('blob');

    // Convert Blob to perfect Base64 Data URL natively in the browser
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = () => {
      const cleanPdfDataUri = reader.result;

      // 1. Upload generated PDF to Cloudinary
      fetch(window.API_BASE_URL + '/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: cleanPdfDataUri,
          folder: 'vanguard_invoices',
          resourceType: 'image'
        })
      })
        .then(r => r.json())
      .then(uploadRes => {
        if (!uploadRes.success) {
          triggerToast(`Upload failure: ${uploadRes.error}`);
          setIsGenerating(false);
          return;
        }

        const secureUrl = uploadRes.url;

        const token = sessionStorage.getItem('vanguard_admin_token');

        // 2. Save this URL to the reservations table invoice column
        const updateRes = fetch(`${window.API_BASE_URL}/reservations/${res.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ invoice: secureUrl })
        }).then(r => r.json());

        // 3. Also log it inside the documents table under 'invoice' type
        const createDoc = fetch(window.API_BASE_URL + '/documents', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: `Vanguard_Invoice_${invoiceId}.pdf`,
            document_type: 'invoice',
            file_url: secureUrl,
            vehicle_id: res.vehicle_id,
            lead_id: res.lead_id,
            status: 'completed'
          })
        }).then(r => r.json());

        Promise.all([updateRes, createDoc])
          .then(([resUpdateJson, docJson]) => {
            setIsGenerating(false);
            if (resUpdateJson.success) {
              triggerToast('Official PDF Invoice generated and archived!');
              fetchDependenciesAndReservations();
            } else {
              triggerToast(`Failed to link invoice: ${resUpdateJson.error}`);
            }
          });
      })
      .catch(err => {
        console.error('Invoice generation error:', err);
        setIsGenerating(false);
        triggerToast('Network error generating invoice.');
      });
    };
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
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Hold Bookings</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Active Vehicle Reservations
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Hold</span>
        </button>
      </div>

      {/* Add Hold Form */}
      {showAddForm && (
        <form onSubmit={handleCreateReservation} className="bg-white border border-border-hairline p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Select Vehicle</label>
            <select required value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer">
              <option value="">Available vehicles...</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year}) - {v.price}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Select Customer / Lead</label>
            <select required value={leadId} onChange={e => setLeadId(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer">
              <option value="">Leads list...</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Assign Sales Agent</label>
            <select value={agentId} onChange={e => setAgentId(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer">
              <option value="">No assignment</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Final Decided Price ($ USD)</label>
            <input required type="number" placeholder="e.g. 85000" value={deposit} onChange={e => setDeposit(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Expiry Date</label>
            <input required type="date" value={holdExpiresAt} onChange={e => setHoldExpiresAt(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <button type="submit" className="md:col-span-3 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest py-3 cursor-pointer">
            Confirm Hold Booking
          </button>
        </form>
      )}

      {/* Cancellation Prompt Modal Overlay */}
      {cancelResId && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setCancelResId(null)} />
          <form onSubmit={submitCancellation} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-border-hairline p-6 shadow-2xl z-50 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">Log Cancellation Reason</span>
              <button type="button" onClick={() => setCancelResId(null)} className="text-neutral-400 hover:text-brand-red cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Why is this hold being cancelled?</label>
              <textarea 
                required
                value={cancelReasonText} 
                onChange={e => setCancelReasonText(e.target.value)}
                placeholder="e.g. Customer financing fell through, lead cancelled transaction..." 
                className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden h-24 resize-none"
              />
            </div>
            <button type="submit" className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-3 cursor-pointer">
              Confirm Hold Cancellation
            </button>
          </form>
        </>
      )}

      {/* Table */}
      <div className="bg-white border border-border-hairline shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4 font-semibold">Vehicle</th>
              <th className="py-3 px-4 font-semibold">Customer / Lead</th>
              <th className="py-3 px-4 font-semibold">Final Agreed Price</th>
              <th className="py-3 px-4 font-semibold">Hold Expires At</th>
              <th className="py-3 px-4 text-right font-semibold">Status / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {reservations.map(res => {
              const hoursLeft = (new Date(res.hold_expires_at) - new Date()) / (1000 * 60 * 60);
              const isUrgent = hoursLeft > 0 && hoursLeft < 12 && res.status === 'confirmed';
              const isCancelled = res.status === 'cancelled';

              return (
                <React.Fragment key={res.id}>
                  <tr className="hover:bg-neutral-50/50">
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
                    <td className="py-3.5 px-4 text-left">
                       <span className="font-mono font-bold text-neutral-600 block">
                         ${Number(res.deposit_amount).toLocaleString()}
                       </span>
                       {res.vehicles?.base_price !== undefined && res.vehicles?.base_price !== null && (
                         <span className="text-[9px] font-mono text-emerald-600 block mt-0.5 uppercase font-medium">
                           Profit: ${Number(parseFloat(res.deposit_amount) - parseFloat(res.vehicles.base_price)).toLocaleString()}
                         </span>
                       )}
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
                      <div className="flex items-center justify-end gap-3">
                        {res.invoice ? (
                          <a 
                            href={res.invoice} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-green-600 hover:bg-green-700 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1.5 cursor-pointer inline-flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3 h-3" /> View Invoice
                          </a>
                        ) : (
                          <button
                            disabled={isGenerating}
                            onClick={() => handleGenerateInvoice(res)}
                            className="bg-charcoal hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 cursor-pointer inline-flex items-center gap-1 transition-colors"
                          >
                            <FileText className="w-3 h-3" /> Generate Invoice
                          </button>
                        )}

                        <select
                          value={res.status}
                          onChange={e => handleUpdateStatus(res.id, e.target.value)}
                          className="bg-transparent border border-neutral-200 text-xs py-1.5 px-2 outline-hidden cursor-pointer font-mono font-bold uppercase text-[9px]"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="expired">Expired</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  {/* Render Cancellation Reason Row if it is cancelled */}
                  {isCancelled && res.cancellation_reason && (
                    <tr className="bg-red-50/20">
                      <td colSpan="5" className="py-2.5 px-6 border-l-4 border-l-brand-red text-left">
                        <div className="flex items-center gap-2 text-red-600 text-[10px] font-mono uppercase tracking-wider font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 text-brand-red" />
                          <span>Cancellation Reason Logged:</span>
                        </div>
                        <p className="text-xs text-neutral-500 italic mt-0.5 pl-5">
                          "{res.cancellation_reason}"
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
