import React, { useState } from 'react';
import { useMockData } from '../../../hooks/useMockData';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function PortalDocuments() {
  const { data: documentsList, isLoading } = useMockData('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [downloadToast, setDownloadToast] = useState('');

  // Filter types available
  const types = ['All', 'Invoice', 'Inspection Report', 'Bill of Lading'];

  const triggerDownload = (fileName) => {
    setDownloadToast(`Starting download: ${fileName}`);
    setTimeout(() => setDownloadToast(''), 3000);
  };

  // Filter logic
  const filteredDocs = documentsList?.filter((doc) => {
    const matchesSearch = 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || doc.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 text-left relative">
      
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {downloadToast}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block mb-1">// Document Manager</span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-charcoal uppercase">
          Transaction Documents
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Access invoices, inspection certificates, and shipping contracts associated with your orders.
        </p>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white border border-border-hairline p-4 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by filename or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-light-bg border border-border-hairline rounded-sm pl-9 pr-4 py-2.5 text-xs outline-hidden focus:border-brand-red transition-all text-charcoal placeholder:text-neutral-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Type Filter pills */}
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-brand-red border-brand-red text-white shadow-xs'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* Documents Table */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : filteredDocs && filteredDocs.length > 0 ? (
        <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-border-hairline text-[10px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                  <th className="py-4 px-6 font-semibold">Document Type</th>
                  <th className="py-4 px-6 font-semibold">File Name</th>
                  <th className="py-4 px-6 font-semibold">Order Reference</th>
                  <th className="py-4 px-6 font-semibold">Issue Date</th>
                  <th className="py-4 px-6 font-semibold">File Size</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-xs">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50/50 transition-colors">
                    
                    {/* Document Type Icon + Name */}
                    <td className="py-4 px-6 font-medium text-charcoal flex items-center gap-2.5">
                      {doc.type === 'Invoice' ? (
                        <FileSpreadsheet className="w-4.5 h-4.5 text-blue-600" />
                      ) : (
                        <FileText className="w-4.5 h-4.5 text-brand-red" />
                      )}
                      <span className="font-display font-bold uppercase tracking-wider text-[11px]">
                        {doc.type}
                      </span>
                    </td>

                    {/* File Name */}
                    <td className="py-4 px-6 text-neutral-600 font-mono tracking-tight break-all">
                      {doc.fileName}
                    </td>

                    {/* Order reference */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm font-bold uppercase">
                        {doc.orderId}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-neutral-500 font-mono">
                      {new Date(doc.issueDate).toLocaleDateString()}
                    </td>

                    {/* File Size */}
                    <td className="py-4 px-6 text-neutral-400 font-mono">
                      {doc.fileSizeLabel}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => triggerDownload(doc.fileName)}
                        className="p-2 border border-neutral-200 hover:border-brand-red hover:bg-brand-red/5 text-charcoal hover:text-brand-red transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono uppercase tracking-widest font-bold hidden sm:inline">Download</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border border-border-hairline bg-white p-16 text-center text-neutral-400 font-sans text-xs flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-6 h-6 text-neutral-300" />
          <span>No documents match your query parameters.</span>
        </div>
      )}

    </div>
  );
}
