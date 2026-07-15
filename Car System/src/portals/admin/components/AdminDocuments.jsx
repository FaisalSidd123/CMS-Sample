import React, { useState, useEffect } from 'react';
import { useMockData } from '../../../hooks/useMockData';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  FolderOpen, 
  Plus, 
  Check, 
  X, 
  FileText, 
  Download, 
  Clock, 
  AlertTriangle,
  Send,
  User,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminDocuments({ 
  sharedInvoices = [], 
  onUpdateInvoices,
  sharedDocs = [],
  onUpdateDocs,
  sharedAudit = [],
  onUpdateAudit
}) {
  const { data: initialInvoices, isLoading: invoicesLoading } = useMockData('invoiceRequests');
  const { data: initialDocs, isLoading: docsLoading } = useMockData('agentDocuments');
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');

  const isLoading = invoicesLoading || docsLoading || clientsLoading;

  // Local synced states
  const [invoices, setInvoices] = useState([]);
  const [docs, setDocs] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  // Form states
  const [selectedClient, setSelectedClient] = useState('');
  const [docType, setDocType] = useState('Invoice');
  const [fileName, setFileName] = useState('');
  const [docNotes, setDocNotes] = useState('');

  // Sync initial mock sets
  useEffect(() => {
    if (sharedInvoices.length > 0) {
      setInvoices(sharedInvoices);
    } else if (initialInvoices) {
      setInvoices(initialInvoices);
    }

    if (sharedDocs.length > 0) {
      setDocs(sharedDocs);
    } else if (initialDocs) {
      setDocs(initialDocs);
    }
  }, [sharedInvoices, initialInvoices, sharedDocs, initialDocs]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Invoice Approve / Reject
  const handleActionInvoice = (invoiceId, action) => {
    const updatedStatus = action === 'approve' ? 'Approved' : 'Rejected';
    const updated = invoices.map(inv => inv.id === invoiceId ? { ...inv, status: updatedStatus } : inv);
    
    setInvoices(updated);
    onUpdateInvoices(updated);

    // If approved, create a corresponding file scan in the documents archive automatically!
    if (action === 'approve') {
      const targetInvoice = invoices.find(i => i.id === invoiceId);
      if (targetInvoice) {
        const client = clientsList?.find(c => c.id === targetInvoice.clientId);
        const newDoc = {
          id: `adoc-${Math.floor(80 + Math.random() * 20)}`,
          clientId: targetInvoice.clientId,
          type: 'Invoice',
          fileName: `Vanguard_Escrow_Invoice_${targetInvoice.reservationId}.pdf`,
          uploadDate: new Date().toISOString(),
          status: 'Approved'
        };
        const updatedDocs = [newDoc, ...docs];
        setDocs(updatedDocs);
        onUpdateDocs(updatedDocs);
      }
    }

    // Add administrative audit entry
    const newAudit = {
      id: `aud-${Math.floor(900 + Math.random() * 99)}`,
      adminId: 'adm-01',
      adminName: 'Chief Executive Operator',
      actionTaken: action === 'approve' ? 'Approved Invoice Request' : 'Rejected Invoice Request',
      target: `${action === 'approve' ? 'Approved' : 'Rejected'} invoice request ${invoiceId}.`,
      timestamp: new Date().toISOString()
    };
    onUpdateAudit([newAudit, ...sharedAudit]);

    triggerToast(`Invoice request ${invoiceId} ${updatedStatus.toLowerCase()} successfully.`);
  };

  // Issue new document
  const handleIssueDocument = (e) => {
    e.preventDefault();
    if (!selectedClient || !fileName) return;

    const newDoc = {
      id: `adoc-${Math.floor(100 + Math.random() * 900)}`,
      clientId: selectedClient,
      type: docType,
      fileName: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
      uploadDate: new Date().toISOString(),
      status: 'Approved'
    };

    const updatedDocs = [newDoc, ...docs];
    setDocs(updatedDocs);
    onUpdateDocs(updatedDocs);

    // Add audit entry
    const newAudit = {
      id: `aud-${Math.floor(900 + Math.random() * 99)}`,
      adminId: 'adm-01',
      adminName: 'Chief Executive Operator',
      actionTaken: 'Issued Document',
      target: `Issued ${docType} to client ${selectedClient}: ${fileName}.`,
      timestamp: new Date().toISOString()
    };
    onUpdateAudit([newAudit, ...sharedAudit]);

    setSelectedClient('');
    setFileName('');
    setDocNotes('');
    triggerToast("Document issued. Client files updated.");
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending Admin Approval');

  return (
    <div className="space-y-8 text-left relative">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Operations Files</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Document Issuance & Control
        </h2>
        <p className="text-[11px] text-neutral-400 font-sans mt-1">
          Approve agent invoice requests, issue invoices and bills of lading, and audit buyers documentation logs.
        </p>
      </div>

      {/* Top section: Pending Requests */}
      <div className="bg-white border border-border-hairline p-5 shadow-xs">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block flex items-center gap-1.5">
          <Clock className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
          <span>Pending Invoice Requests ({pendingInvoices.length})</span>
        </span>

        {pendingInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 text-[8px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                  <th className="pb-3 font-semibold">Req ID</th>
                  <th className="pb-3 font-semibold">Client Folder</th>
                  <th className="pb-3 font-semibold">Hold ID</th>
                  <th className="pb-3 font-semibold">Invoice Value</th>
                  <th className="pb-3 font-semibold">Request Notes</th>
                  <th className="pb-3 font-semibold text-right">Oversight</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvoices.map((inv) => {
                  const client = clientsList?.find(c => c.id === inv.clientId);
                  return (
                    <tr key={inv.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-neutral-400">{inv.id}</td>
                      <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">{client?.name}</td>
                      <td className="py-3 text-neutral-400 font-mono uppercase text-[9px]">{inv.reservationId}</td>
                      <td className="py-3 text-brand-red font-display font-bold">{inv.amount}</td>
                      <td className="py-3 text-neutral-500 font-sans max-w-xs truncate">{inv.notes}</td>
                      <td className="py-3 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleActionInvoice(inv.id, 'approve')}
                          className="p-1 border border-neutral-200 text-green-600 hover:border-green-500 hover:bg-green-50 cursor-pointer flex items-center justify-center rounded-2xs"
                          title="Approve Invoicing"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <button
                          onClick={() => handleActionInvoice(inv.id, 'reject')}
                          className="p-1 border border-neutral-200 text-red-600 hover:border-red-500 hover:bg-red-50 cursor-pointer flex items-center justify-center rounded-2xs"
                          title="Reject Invoicing"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400 text-xs font-sans">
            No pending invoice requests in queue.
          </div>
        )}
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left pane: File Repository */}
        <div className="lg:col-span-2 bg-white border border-border-hairline p-5 shadow-xs min-h-[300px]">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block flex items-center gap-1.5">
            <FolderOpen className="w-4.5 h-4.5 text-neutral-400" />
            <span>Documents Repository Archive</span>
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 text-[8px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                  <th className="pb-3 font-semibold">Client Folder</th>
                  <th className="pb-3 font-semibold">File Type</th>
                  <th className="pb-3 font-semibold">File Name</th>
                  <th className="pb-3 font-semibold">Issued Date</th>
                  <th className="pb-3 font-semibold text-right">Download</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => {
                  const client = clientsList?.find(c => c.id === doc.clientId);
                  return (
                    <tr key={doc.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">{client?.name}</td>
                      <td className="py-3 text-neutral-400 font-mono uppercase text-[9px]">{doc.type}</td>
                      <td className="py-3 text-neutral-600 font-mono break-all">{doc.fileName}</td>
                      <td className="py-3 text-neutral-400 font-mono">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => triggerToast(`Simulating download: ${doc.fileName}`)}
                          className="p-1 border border-neutral-200 text-neutral-400 hover:text-brand-red cursor-pointer flex items-center justify-center rounded-2xs inline-block"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right pane: Issue Document form */}
        <div className="bg-white border border-border-hairline p-5 shadow-xs">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block flex items-center gap-1.5">
            <Send className="w-4 h-4 text-neutral-400" />
            <span>Issue Official Document</span>
          </span>

          <form onSubmit={handleIssueDocument} className="space-y-4">
            
            {/* Select Client */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Select Buyer File</label>
              <select
                required
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-white border border-neutral-200 px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="">-- Choose Client --</option>
                {clientsList?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Select Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="bg-white border border-neutral-200 px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="Invoice">Escrow Invoice</option>
                <option value="Receipt">Cleared Receipt</option>
                <option value="Bill of Lading">Bill of Lading</option>
              </select>
            </div>

            {/* File Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Document Filename</label>
              <input
                type="text"
                required
                placeholder="e.g. Bill_Of_Lading_Miami_Depot"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red transition-all"
              />
            </div>

            {/* Note details */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Issuing notes</label>
              <textarea
                rows={2}
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
                placeholder="Log internal details..."
                className="bg-white border border-border-hairline p-3 text-xs text-charcoal outline-hidden focus:border-brand-red transition-all resize-none placeholder:text-neutral-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <span>Issue Document</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
