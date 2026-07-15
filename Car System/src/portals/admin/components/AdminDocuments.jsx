import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  FolderOpen, 
  Check, 
  X, 
  FileText, 
  Download, 
  Clock, 
  Send
} from 'lucide-react';

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Form states
  const [selectedLead, setSelectedLead] = useState('');
  const [docType, setDocType] = useState('Invoice');
  const [title, setTitle] = useState('');
  
  // File state
  const [selectedFileBase64, setSelectedFileBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchDocsAndLeads = () => {
    setIsLoading(true);
    const fetchDocs = fetch('http://localhost:5000/api/documents').then(r => r.json());
    const fetchLeads = fetch('http://localhost:5000/api/leads').then(r => r.json());

    Promise.all([fetchDocs, fetchLeads])
      .then(([docJson, leadJson]) => {
        if (docJson.success) setDocs(docJson.data);
        if (leadJson.success) setLeads(leadJson.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load documents registry:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDocsAndLeads();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.split('.')[0]);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFileBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIssueDocument = async (e) => {
    e.preventDefault();
    if (!selectedLead || !selectedFileBase64 || !title) return;

    setIsUploading(true);
    let uploadedFileUrl = '';

    try {
      // 1. Upload to Cloudinary via backend
      const uploadRes = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: selectedFileBase64,
          folder: 'vanguard_documents',
          resourceType: 'auto' // handles PDFs, images, raw files
        })
      }).then(r => r.json());

      if (uploadRes.success) {
        uploadedFileUrl = uploadRes.url;
      } else {
        triggerToast(`Cloudinary error: ${uploadRes.error}`);
        setIsUploading(false);
        return;
      }
    } catch (err) {
      console.error('Failed to upload file to Cloudinary:', err);
      triggerToast('Network error uploading document.');
      setIsUploading(false);
      return;
    }

    // 2. Save document record to DB
    const payload = {
      title,
      document_type: docType,
      file_url: uploadedFileUrl,
      lead_id: parseInt(selectedLead),
      status: 'active'
    };

    fetch('http://localhost:5000/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(json => {
        setIsUploading(false);
        if (json.success) {
          triggerToast('Document uploaded to Cloudinary & registered successfully.');
          setTitle('');
          setSelectedLead('');
          setSelectedFileBase64('');
          setFileName('');
          fetchDocsAndLeads();
        } else {
          triggerToast(`Database save error: ${json.error}`);
        }
      })
      .catch(err => {
        setIsUploading(false);
        triggerToast('Failed to save document in registry database.');
      });
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  return (
    <div className="space-y-8 text-left relative">
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
          Upload cleared invoices, buyer agreements, or bill of lading records directly to Cloudinary storage.
        </p>
      </div>

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
              <tbody className="divide-y divide-neutral-100">
                {docs.map((doc) => (
                  <tr key={doc.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">
                      {doc.leads?.name || 'Vanguard Escrow'}
                    </td>
                    <td className="py-3 text-neutral-400 font-mono uppercase text-[9px]">{doc.document_type}</td>
                    <td className="py-3 text-neutral-600 font-mono break-all">{doc.title}</td>
                    <td className="py-3 text-neutral-400 font-mono">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="py-3 text-right">
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 border border-neutral-200 text-neutral-400 hover:text-brand-red cursor-pointer flex items-center justify-center rounded-2xs inline-flex"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-neutral-400 font-sans">
                      No documents currently archived in database registry.
                    </td>
                  </tr>
                )}
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
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                className="bg-white border border-neutral-200 px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="">-- Choose Lead --</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
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
                <option value="Contract">Agreement Contract</option>
              </select>
            </div>

            {/* Document Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Document Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Cleared_Escrow_Receipt_Vanguard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red transition-all"
              />
            </div>

            {/* File upload selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Upload File (PDF/Image/etc)</label>
              <input
                type="file"
                required
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red w-full cursor-pointer"
              />
              {fileName && (
                <div className="text-[8px] font-mono text-green-600 mt-1">
                  ✓ File: {fileName} loaded. Ready to stream to Cloudinary.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-brand-red hover:bg-brand-red-hover disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <span>{isUploading ? 'Streaming to Cloudinary...' : 'Issue Document'}</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
