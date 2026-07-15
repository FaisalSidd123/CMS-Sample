import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { UploadCloud, FileSpreadsheet, Check } from 'lucide-react';

export default function AdminImports() {
  const [importLogs, setImportLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bulkUploadedData, setBulkUploadedData] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchImportLogs = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/imports')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setImportLogs(json.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch import logs:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchImportLogs();
  }, []);

  const handleSimulateDragOver = (e) => {
    e.preventDefault();
  };

  const handleSimulateDrop = (e) => {
    e.preventDefault();
    setBulkUploadedData([
      { make: 'Audi', model: 'R8 Coupe', year: 2022, price: 145000, mileage: 8400, bodyType: 'Coupe', color: 'Ara Blue', location: 'Miami Depot', status: 'available' },
      { make: 'Porsche', model: 'Taycan 4S', year: 2023, price: 105000, mileage: 4200, bodyType: 'Coupe', color: 'Frozen Blue', location: 'Vanguard HQ', status: 'available' },
      { make: 'BMW', model: 'M4 Competition', year: 2021, price: 74000, mileage: 12900, bodyType: 'Coupe', color: 'Alpine White', location: 'Jersey Storage', status: 'available' }
    ]);
    triggerToast(`CSV sheet parsed. Previewing 3 records.`);
  };

  const handleConfirmImport = () => {
    if (!bulkUploadedData) return;

    // 1. Post vehicles to database
    const vehiclePromises = bulkUploadedData.map(car => {
      return fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          bodyType: car.bodyType,
          color: car.color,
          location: car.location,
          status: car.status,
          specs: ['Verified Registry', 'Mechanical Clean'],
          conditionNotes: 'Bulk spreadsheet imports checked.',
          thumbnailImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
          images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80']
        })
      }).then(r => r.json());
    });

    // 2. Post import log audit to database
    Promise.all(vehiclePromises)
      .then(results => {
        const successes = results.filter(r => r.success).length;
        
        fetch('http://localhost:5000/api/imports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: 'bulk_inventory_import_2026.csv',
            row_count: successes,
            status: 'success',
            imported_by: 'admin@vanguard.com'
          })
        })
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              triggerToast(`Successfully imported ${successes} vehicles to registry database!`);
              setBulkUploadedData(null);
              fetchImportLogs();
            }
          });
      })
      .catch(err => {
        console.error('Error importing vehicles in bulk:', err);
        triggerToast('Failed to complete bulk inventory import.');
      });
  };

  if (isLoading) return <TableSkeleton rows={4} cols={4} />;

  return (
    <div className="space-y-6 text-left">
      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border-hairline pb-4">
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Operations</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          CSV Bulk Inventory Imports
        </h2>
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div 
            onDragOver={handleSimulateDragOver}
            onDrop={handleSimulateDrop}
            className="border-2 border-dashed border-neutral-200 hover:border-brand-red bg-white p-8 flex flex-col items-center justify-center transition-colors min-h-48 cursor-pointer select-none text-center"
          >
            <UploadCloud className="w-10 h-10 text-neutral-400 mb-2.5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal block">Drag and Drop CSV files</span>
            <span className="text-[9px] font-mono text-neutral-400 uppercase mt-1">Accepts .csv spreadsheet templates</span>
          </div>

          {bulkUploadedData && (
            <div className="bg-white border border-border-hairline p-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">CSV Document Preview</span>
                <button 
                  onClick={handleConfirmImport}
                  className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Confirm Imports
                </button>
              </div>
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                      <th className="pb-2">Make</th>
                      <th className="pb-2">Model</th>
                      <th className="pb-2">Year</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Mileage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkUploadedData.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-50 last:border-none">
                        <td className="py-2 font-semibold text-charcoal">{row.make}</td>
                        <td className="py-2">{row.model}</td>
                        <td className="py-2 font-mono">{row.year}</td>
                        <td className="py-2 font-mono font-bold">${row.price.toLocaleString()}</td>
                        <td className="py-2 font-mono text-neutral-400">{row.mileage.toLocaleString()} mi</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar logs */}
        <div className="bg-white border border-border-hairline p-5 shadow-xs">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-neutral-400" />
            <span>Upload Auditing Logs</span>
          </span>

          <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto">
            {importLogs.map(log => (
              <div key={log.id} className="p-3 bg-light-bg border border-border-hairline text-left leading-relaxed">
                <span className="text-[10px] font-display font-bold text-charcoal block truncate uppercase">{log.filename}</span>
                <div className="flex justify-between items-center mt-1.5 text-[8px] font-mono text-neutral-400 uppercase tracking-wider">
                  <span>Rows: {log.row_count}</span>
                  <span className="text-green-600 font-bold">{log.status}</span>
                </div>
                <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider block mt-0.5">
                  By: {log.imported_by}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
