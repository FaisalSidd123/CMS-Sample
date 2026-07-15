import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  FileText, 
  Truck, 
  Shield, 
  Download, 
  Upload, 
  CheckCircle,
  FileCheck
} from 'lucide-react';

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Selected vehicle context to show the checklist slots
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  // Target upload slot context
  const [uploadingCategory, setUploadingCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchDependencies = () => {
    setIsLoading(true);
    const fetchDocs = fetch('http://localhost:5000/api/documents').then(r => r.json());
    const fetchLeads = fetch('http://localhost:5000/api/leads').then(r => r.json());
    const fetchVehicles = fetch('http://localhost:5000/api/vehicles').then(r => r.json());

    Promise.all([fetchDocs, fetchLeads, fetchVehicles])
      .then(([docJson, leadJson, vehicleJson]) => {
        if (docJson.success) setDocs(docJson.data);
        if (leadJson.success) setLeads(leadJson.data);
        if (vehicleJson.success) setVehicles(vehicleJson.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load document dependencies:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  // Defined checklist slots from user screenshot
  const documentCategories = [
    { 
      id: 'invoice', 
      name: 'Invoice', 
      icon: FileCheck, 
      color: 'text-amber-600 bg-amber-50 border-amber-100' 
    },
    { 
      id: 'atj_inspection_report', 
      name: 'ATJ Inspection Report', 
      icon: FileText, 
      color: 'text-blue-600 bg-blue-50 border-blue-100' 
    },
    { 
      id: 'bill_of_lading', 
      name: 'Bill of Lading (BL)', 
      icon: Truck, 
      color: 'text-orange-500 bg-orange-50 border-orange-100' 
    },
    { 
      id: 'export_certificate_english', 
      name: 'Export Certificate (English)', 
      icon: Shield, 
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100' 
    },
    { 
      id: 'export_certificate_japanese', 
      name: 'Export Certificate (Japanese)', 
      icon: Shield, 
      color: 'text-red-500 bg-red-50 border-red-100' 
    },
    { 
      id: 'surrendered_bil', 
      name: 'Surrendered BIL', 
      icon: Truck, 
      color: 'text-blue-500 bg-blue-50 border-blue-100' 
    }
  ];

  const handleFileUpload = async (e, categoryId) => {
    const file = e.target.files[0];
    if (!file || !selectedVehicleId) return;

    setIsUploading(true);
    setUploadingCategory(categoryId);

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result;

      try {
        // 1. Upload to Cloudinary via backend upload API
        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64Data,
            folder: 'vanguard_documents',
            resourceType: 'auto'
          })
        }).then(r => r.json());

        if (!uploadRes.success) {
          triggerToast(`Upload failed: ${uploadRes.error}`);
          setIsUploading(false);
          setUploadingCategory(null);
          return;
        }

        // 2. Save document link in our Supabase DB
        const payload = {
          title: file.name,
          document_type: categoryId, // atj_inspection_report, bill_of_lading, etc.
          file_url: uploadRes.url,
          vehicle_id: parseInt(selectedVehicleId),
          status: 'completed'
        };

        const dbRes = await fetch('http://localhost:5000/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json());

        setIsUploading(false);
        setUploadingCategory(null);

        if (dbRes.success) {
          triggerToast(`Successfully uploaded ${file.name} to Cloudinary!`);
          fetchDependencies();
        } else {
          triggerToast(`DB save failed: ${dbRes.error}`);
        }

      } catch (err) {
        console.error('File stream error:', err);
        triggerToast('Network error during file upload.');
        setIsUploading(false);
        setUploadingCategory(null);
      }
    };
  };

  if (isLoading) return <TableSkeleton rows={4} cols={4} />;

  const activeVehicle = vehicles.find(v => v.id === parseInt(selectedVehicleId));

  return (
    <div className="space-y-6 text-left relative">
      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border-hairline pb-4">
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Documents Hub</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Registry Checklist & Clearance
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side - Selection and Category Checklist Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-hairline p-5 shadow-xs space-y-4">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">Select Vehicle Portfolio</label>
            <select
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
            >
              <option value="">-- Choose a Vehicle to view Checklist --</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year}) - VIN-{v.id}</option>
              ))}
            </select>
          </div>

          {activeVehicle ? (
            <div className="bg-white border border-border-hairline p-6 shadow-xs space-y-6">
              <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
                <div>
                  <span className="font-display font-extrabold uppercase text-xs text-charcoal block">
                    {activeVehicle.make} {activeVehicle.model} ({activeVehicle.year})
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase mt-0.5">Status: {activeVehicle.status} | Location: {activeVehicle.location}</span>
                </div>
                <span className="text-[8px] font-mono bg-neutral-100 text-neutral-600 px-2 py-1 uppercase tracking-wider font-semibold">Checks List</span>
              </div>

              {/* Dynamic checklist slots */}
              <div className="space-y-4">
                {documentCategories.map(cat => {
                  // Check if this vehicle has an uploaded document matching this category ID
                  const uploadedDoc = docs.find(d => d.vehicle_id === activeVehicle.id && d.document_type === cat.id);
                  const IconComp = cat.icon;
                  const isThisUploading = isUploading && uploadingCategory === cat.id;

                  return (
                    <div 
                      key={cat.id} 
                      className="flex items-center justify-between p-4 border border-neutral-100 rounded-md bg-neutral-50/30 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-md border ${cat.color}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-xs text-charcoal block">{cat.name}</span>
                          {uploadedDoc ? (
                            <span className="text-[9px] font-mono text-neutral-400 block truncate max-w-xs mt-0.5">
                              File: {uploadedDoc.title}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">Not Uploaded</span>
                          )}
                        </div>
                      </div>

                      <div>
                        {uploadedDoc ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono bg-green-50 text-green-600 border border-green-100 px-2 py-1 uppercase tracking-wider font-bold inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Uploaded
                            </span>
                            <a 
                              href={uploadedDoc.file_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-1.5 border border-neutral-200 text-neutral-400 hover:text-brand-red hover:bg-white flex items-center justify-center rounded-2xs"
                              title="Download Asset"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <label className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 text-[9px] font-bold uppercase tracking-wider px-3 py-2 cursor-pointer transition-colors inline-flex items-center gap-1.5 rounded-sm select-none">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isThisUploading ? 'Uploading...' : 'Upload File'}</span>
                            <input 
                              type="file" 
                              disabled={isUploading}
                              accept="application/pdf,image/*" 
                              onChange={(e) => handleFileUpload(e, cat.id)} 
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-border-hairline border-dashed p-10 text-center text-neutral-400 select-none flex flex-col items-center justify-center min-h-60">
              <FileCheck className="w-12 h-12 text-neutral-300 mb-2.5 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal block">No Vehicle Portfolio Selected</span>
              <span className="text-[9px] font-mono text-neutral-400 uppercase mt-1">Select a car portfolio above to review ATJ and Export certification check documents.</span>
            </div>
          )}
        </div>

        {/* Right Side - Archive Log list of all documents */}
        <div className="bg-white border border-border-hairline p-5 shadow-xs space-y-4">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal block">Overall Clearance Ledger</span>
          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {docs.map(doc => (
              <div key={doc.id} className="p-3 bg-neutral-50/50 border border-neutral-100 text-left leading-relaxed text-xs">
                <span className="text-[9px] font-mono uppercase bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-2xs inline-block mb-1">
                  {doc.document_type.replace(/_/g, ' ')}
                </span>
                <span className="font-display font-bold text-charcoal block truncate">{doc.title}</span>
                <div className="flex justify-between items-center mt-1.5 font-mono text-[8px] text-neutral-400 uppercase">
                  <span>Linked Car: {doc.vehicles?.make} {doc.vehicles?.model}</span>
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-brand-red font-bold hover:underline">Download</a>
                </div>
              </div>
            ))}
            {docs.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-[10px] uppercase font-mono">
                No files registered.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
