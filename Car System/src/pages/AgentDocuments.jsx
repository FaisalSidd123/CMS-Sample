import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMockData } from '../hooks/useMockData';
import { TableSkeleton } from '../components/Skeletons';
import { 
  FileCheck, 
  Plus, 
  Upload, 
  FileText, 
  Download, 
  Check, 
  Clock, 
  AlertTriangle,
  FolderOpen,
  Send
} from 'lucide-react';

export default function AgentDocuments() {
  const location = useLocation();

  // Load documents, reservations, clients, and invoice requests
  const { data: initialDocs, isLoading: docsLoading } = useMockData('agentDocuments');
  const { data: initialRes, isLoading: resLoading } = useMockData('reservations');
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: initialInvoices, isLoading: invoicesLoading } = useMockData('invoiceRequests');

  const isLoading = docsLoading || resLoading || clientsLoading || invoicesLoading;

  // Local synced states
  const [docsList, setDocsList] = useState([]);
  const [invoiceReqs, setInvoiceReqs] = useState([]);
  const [activeTab, setActiveTab] = useState('documents');
  const [toastMsg, setToastMsg] = useState('');

  // Form states
  const [invoiceResId, setInvoiceResId] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');

  const [uploadClientId, setUploadClientId] = useState('');
  const [uploadDocType, setUploadDocType] = useState('ID Verification');
  const [uploadFileName, setUploadFileName] = useState('');

  // Sync initial mock data
  useEffect(() => {
    if (initialDocs) setDocsList(initialDocs);
    if (initialInvoices) setInvoiceReqs(initialInvoices);
  }, [initialDocs, initialInvoices]);

  // Handle redirects from client actions
  useEffect(() => {
    if (location.state?.preselectedClientId && location.state?.requestInvoice) {
      setActiveTab('invoices');
      // pre-fill reservation if any
      const matchingRes = initialRes?.find(r => r.clientId === location.state.preselectedClientId);
      if (matchingRes) setInvoiceResId(matchingRes.id);
    }
  }, [location.state, initialRes]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Status colors helpers
  const getDocStatusColor = (status) => {
    if (status === 'Approved') return 'bg-green-50 text-green-600 border-green-200';
    return 'bg-amber-50 text-amber-600 border-amber-200';
  };

  const getInvoiceStatusColor = (status) => {
    if (status === 'Approved') return 'bg-green-50 text-green-600 border-green-200';
    if (status === 'Rejected') return 'bg-red-50 text-red-600 border-red-200';
    return 'bg-amber-50 text-amber-600 border-amber-200';
  };

  // Forms submit
  const handleRequestInvoice = (e) => {
    e.preventDefault();
    if (!invoiceResId || !invoiceAmount) return;

    const reservation = initialRes?.find(r => r.id === invoiceResId);
    if (!reservation) return;

    const newRequest = {
      id: `inv-req-${Math.floor(600 + Math.random() * 400)}`,
      reservationId: invoiceResId,
      clientId: reservation.clientId,
      amount: `$${parseFloat(invoiceAmount.replace(/[$,]/g, '')).toLocaleString()}`,
      notes: invoiceNotes,
      status: 'Pending Admin Approval',
      createdDate: new Date().toISOString()
    };

    setInvoiceReqs(prev => [newRequest, ...prev]);
    setInvoiceAmount('');
    setInvoiceNotes('');
    triggerToast(`Invoice request logged. Status: Pending Admin Approval.`);
  };

  const handleUploadMock = (e) => {
    e.preventDefault();
    if (!uploadClientId || !uploadFileName) return;

    const newDoc = {
      id: `adoc-${Math.floor(50 + Math.random() * 50)}`,
      clientId: uploadClientId,
      type: uploadDocType,
      fileName: uploadFileName.split('\\').pop() || 'uploaded_document.pdf',
      uploadDate: new Date().toISOString(),
      status: 'Pending Review'
    };

    setDocsList(prev => [newDoc, ...prev]);
    setUploadFileName('');
    triggerToast(`File scan registered under buyer file.`);
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

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
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Documents Ledger</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Documents & Invoices
        </h2>
        <p className="text-[11px] text-neutral-400 font-sans mt-1">
          Review document verifications, upload paper logs, or dispatch escrow invoicing queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left pane: Tables log */}
        <div className="lg:col-span-2 bg-white border border-border-hairline p-5 shadow-xs min-h-[400px]">
          
          {/* Tabs toggle */}
          <div className="flex border-b border-neutral-100 mb-6 gap-6 select-none">
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-3 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'documents' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
              }`}
            >
              Uploaded Scans ({docsList.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`pb-3 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'invoices' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
              }`}
            >
              Invoice Requests ({invoiceReqs.length})
            </button>
          </div>

          {/* TAB: Documents */}
          {activeTab === 'documents' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">File Type</th>
                    <th className="pb-3 font-semibold">File Name</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {docsList.map((doc) => {
                    const client = clientsList?.find(c => c.id === doc.clientId);
                    return (
                      <tr key={doc.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">{client?.name}</td>
                        <td className="py-3 text-neutral-400 font-mono uppercase text-[9px]">{doc.type}</td>
                        <td className="py-3 text-neutral-600 font-mono break-all">{doc.fileName}</td>
                        <td className="py-3 text-right">
                          <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-xs ${
                            getDocStatusColor(doc.status)
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: Invoice Requests */}
          {activeTab === 'invoices' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Hold ID</th>
                    <th className="pb-3 font-semibold">Invoiced Value</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceReqs.map((req) => {
                    const client = clientsList?.find(c => c.id === req.clientId);
                    return (
                      <tr key={req.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">{client?.name}</td>
                        <td className="py-3 text-neutral-400 font-mono uppercase text-[9px]">{req.reservationId}</td>
                        <td className="py-3 text-brand-red font-display font-bold">{req.amount}</td>
                        <td className="py-3 text-right">
                          <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-xs ${
                            getInvoiceStatusColor(req.status)
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Right pane: Side action Forms */}
        <div className="space-y-6">
          
          {/* Form: Upload Document */}
          {activeTab === 'documents' && (
            <div className="bg-white border border-border-hairline p-5 shadow-xs">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
                Register Document Scan
              </span>

              <form onSubmit={handleUploadMock} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Client Folder</label>
                  <select
                    required
                    value={uploadClientId}
                    onChange={(e) => setUploadClientId(e.target.value)}
                    className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
                  >
                    <option value="">-- Choose Client --</option>
                    {clientsList?.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Document Node Type</label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                    className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
                  >
                    <option value="ID Verification">ID Verification</option>
                    <option value="Payment Proof">Payment Proof</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Select File</label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-mono file:uppercase file:tracking-widest file:font-bold file:bg-charcoal file:text-white hover:file:bg-neutral-800 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-charcoal hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Register Scan</span>
                </button>
              </form>
            </div>
          )}

          {/* Form: Request Invoice */}
          {activeTab === 'invoices' && (
            <div className="bg-white border border-border-hairline p-5 shadow-xs">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
                Generate Invoicing Query
              </span>

              <form onSubmit={handleRequestInvoice} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Active Hold Lock</label>
                  <select
                    required
                    value={invoiceResId}
                    onChange={(e) => setInvoiceResId(e.target.value)}
                    className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
                  >
                    <option value="">-- Choose Hold Reference --</option>
                    {initialRes?.filter(r => r.status === 'Pending' || r.status === 'Confirmed').map(r => {
                      const client = clientsList?.find(c => c.id === r.clientId);
                      return (
                        <option key={r.id} value={r.id}>{r.id} ({client?.name})</option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Invoice Amount ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 68000"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Transaction Notes</label>
                  <textarea
                    rows={3}
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    placeholder="Escrow parameters, wire codes..."
                    className="bg-white border border-border-hairline p-3 text-xs text-charcoal outline-hidden focus:border-brand-red transition-all resize-none placeholder:text-neutral-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Invoicing</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
