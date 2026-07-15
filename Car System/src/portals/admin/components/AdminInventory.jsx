import React, { useState } from 'react';
import { useMockData } from '../../../hooks/useMockData';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  Car, 
  Plus, 
  Trash2, 
  Edit, 
  FileText, 
  UploadCloud, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminInventory({ sharedVehicles = [], onUpdateVehicles }) {
  const { data: initialVehicles, isLoading } = useMockData('vehicles');

  const vehicles = sharedVehicles.length > 0 ? sharedVehicles : (initialVehicles || []);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2023');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [bodyType, setBodyType] = useState('Coupe');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');
  const [specs, setSpecs] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');

  // Bulk Upload state
  const [bulkUploadedData, setBulkUploadedData] = useState(null);

  // Expands details per row
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Inline status dropdown handler
  const handleStatusChange = (vehicleId, newStatus) => {
    fetch(`http://localhost:5000/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          const updated = vehicles.map(v => v.id === vehicleId ? json.data : v);
          onUpdateVehicles(updated);
          triggerToast(`VIN status updated inline to: ${newStatus.toUpperCase()}`);
        } else {
          triggerToast(`Failed to update status: ${json.error || 'Server error'}`);
        }
      })
      .catch(err => {
        console.error('Error updating vehicle status:', err);
        triggerToast('Failed to update status: Server connection error');
      });
  };

  // Delete
  const handleDelete = (vehicleId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle from the inventory database?");
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/vehicles/${vehicleId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const updated = vehicles.filter(v => v.id !== vehicleId);
          onUpdateVehicles(updated);
          triggerToast(`Vehicle removed from catalog.`);
        } else {
          triggerToast(`Failed to delete vehicle: ${json.error || 'Server error'}`);
        }
      })
      .catch(err => {
        console.error('Error deleting vehicle:', err);
        triggerToast('Failed to delete vehicle: Server connection error');
      });
  };

  // Submit Add form
  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!make || !model || !price || !mileage) return;

    const newVehicleData = {
      make,
      model,
      year: parseInt(year),
      price: parseInt(price),
      mileage: parseInt(mileage),
      bodyType,
      color,
      location,
      status: 'available',
      specs: specs ? specs.split(',').map(s => s.trim()) : ['Premium Package', 'Verified History'],
      conditionNotes: conditionNotes || 'No major issues, verified mechanical condition.',
      thumbnailImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'
      ]
    };

    fetch('http://localhost:5000/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newVehicleData)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          onUpdateVehicles([json.data, ...vehicles]);
          setShowAddForm(false);
          // Clear inputs
          setMake(''); setModel(''); setPrice(''); setMileage(''); setColor(''); setLocation(''); setSpecs(''); setConditionNotes('');
          triggerToast(`Added vehicle: ${make} ${model} to database.`);
        } else {
          triggerToast(`Failed to add vehicle: ${json.error || 'Server error'}`);
        }
      })
      .catch(err => {
        console.error('Error creating vehicle:', err);
        triggerToast('Failed to add vehicle: Server connection error');
      });
  };

  // Bulk Upload simulation
  const handleSimulateDragOver = (e) => {
    e.preventDefault();
  };

  const handleSimulateDrop = (e) => {
    e.preventDefault();
    // Simulate parsing spreadsheet columns
    setBulkUploadedData([
      { id: 901, make: 'Audi', model: 'R8 Coupe', year: 2022, price: '$145,000', mileage: '8,400 mi', status: 'available' },
      { id: 902, make: 'Porsche', model: 'Taycan 4S', year: 2023, price: '$105,000', mileage: '4,200 mi', status: 'available' },
      { id: 903, make: 'BMW', model: 'M4 Competition', year: 2021, price: '$74,000', mileage: '12,900 mi', status: 'available' }
    ]);
    triggerToast(`CSV sheet parsed. Previewing 3 records.`);
  };

  const handleConfirmImport = () => {
    if (!bulkUploadedData) return;

    const formattedImports = bulkUploadedData.map(item => ({
      ...item,
      bodyType: 'Coupe',
      color: 'Midnight Black',
      location: 'Miami Depot',
      dateAdded: new Date().toISOString(),
      specs: ['Laser Headlights', 'Carbon Package'],
      conditionNotes: 'Import scan verified.',
      thumbnailImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80']
    }));

    onUpdateVehicles([...formattedImports, ...vehicles]);
    setBulkUploadedData(null);
    triggerToast(`Imported 3 vehicles from sheet parser.`);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-hairline pb-4">
        <div>
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Fleet Controls</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Inventory Registry
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Perform vehicle CRUD updates, edit inline status dropdowns, or simulate bulk CSV uploads.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Add vehicle form panel */}
      {showAddForm && (
        <div className="bg-white border border-border-hairline p-6 shadow-md max-w-3xl">
          <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-3">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">Log new vehicle spec sheet</span>
            <button onClick={() => setShowAddForm(false)} className="text-neutral-400 hover:text-brand-red cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Make</label>
              <input required type="text" placeholder="e.g. Porsche" value={make} onChange={(e) => setMake(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Model</label>
              <input required type="text" placeholder="e.g. 911 Carrera" value={model} onChange={(e) => setModel(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Year</label>
              <input required type="number" min="1990" max="2027" value={year} onChange={(e) => setYear(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Price ($ USD)</label>
              <input required type="number" placeholder="e.g. 112000" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Mileage (Miles)</label>
              <input required type="number" placeholder="e.g. 1200" value={mileage} onChange={(e) => setMileage(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Body Type</label>
              <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer">
                <option value="Coupe">Coupe</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Supercar">Supercar</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Color</label>
              <input type="text" placeholder="e.g. Guards Red" value={color} onChange={(e) => setColor(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Showroom Location</label>
              <input type="text" placeholder="e.g. Miami Depot" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1 md:col-span-3">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Specs / Packages (comma-separated)</label>
              <input type="text" placeholder="e.g. Sport Chrono, Aerokit, Burmester Sound System" value={specs} onChange={(e) => setSpecs(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1 md:col-span-3">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Condition Remarks</label>
              <textarea rows={2} placeholder="Inspect notes..." value={conditionNotes} onChange={(e) => setConditionNotes(e.target.value)} className="bg-light-bg border border-border-hairline p-3 text-xs text-charcoal outline-hidden focus:border-brand-red resize-none" />
            </div>

            <button type="submit" className="md:col-span-3 bg-charcoal hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-3 cursor-pointer transition-colors text-center shadow-xs">
              Confirm registration
            </button>
          </form>
        </div>
      )}

      {/* Bulk spreadsheet upload simulator */}
      <div className="bg-white border border-border-hairline p-5 shadow-xs text-left">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-3 block flex items-center gap-1.5">
          <FileSpreadsheet className="w-4.5 h-4.5 text-neutral-400" />
          <span>Spreadsheet Bulk Import Console</span>
        </span>

        {!bulkUploadedData ? (
          <div 
            onDragOver={handleSimulateDragOver}
            onDrop={handleSimulateDrop}
            onClick={handleSimulateDrop}
            className="border-2 border-dashed border-neutral-200 hover:border-brand-red bg-light-bg/40 p-8 text-center rounded-xs cursor-pointer transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <span className="text-xs text-neutral-400 block font-sans">
              Drag and drop vehicle CSV spreadsheet here or <span className="text-brand-red font-semibold hover:underline">Click to simulate upload</span>
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-amber-50 text-amber-800 border border-amber-200 p-3 rounded-xs text-xs font-sans">
              <span>Previewing parsed sheet records. Verify values before bulk insert.</span>
              <button onClick={() => setBulkUploadedData(null)} className="text-neutral-500 hover:text-brand-red">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Vehicle</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Mileage</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkUploadedData.map(row => (
                    <tr key={row.id} className="border-b border-neutral-50 last:border-0 font-mono text-[10px]">
                      <td className="py-2">#{row.id}</td>
                      <td className="py-2 text-charcoal font-semibold">{row.make} {row.model} ({row.year})</td>
                      <td className="py-2 text-brand-red font-semibold">{row.price}</td>
                      <td className="py-2 text-neutral-500">{row.mileage}</td>
                      <td className="py-2 text-right text-green-600 font-bold uppercase">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setBulkUploadedData(null)} className="border border-neutral-200 hover:bg-neutral-50 text-neutral-500 text-[10px] font-mono uppercase tracking-widest px-4 py-2 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleConfirmImport} className="bg-brand-red hover:bg-brand-red-hover text-white text-[10px] font-mono uppercase tracking-widest px-5 py-2 cursor-pointer shadow-xs">
                Import 3 Vehicles
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inventory table */}
      <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-border-hairline text-[9px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                <th className="py-4 px-6 font-semibold">Thumbnail</th>
                <th className="py-4 px-6 font-semibold">Vehicle</th>
                <th className="py-4 px-6 font-semibold">Price</th>
                <th className="py-4 px-6 font-semibold">Mileage</th>
                <th className="py-4 px-6 font-semibold">Status Dropdown</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-xs">
              {vehicles.map((v) => {
                const isExpanded = expandedRowId === v.id;
                return (
                  <React.Fragment key={v.id}>
                    <tr className="hover:bg-neutral-50/50 transition-colors">
                      {/* Image */}
                      <td className="py-4 px-6">
                        <div className="w-12 h-8 bg-neutral-100 rounded-sm overflow-hidden shrink-0 border border-neutral-200/50">
                          <img src={v.thumbnailImage} alt={v.model} className="w-full h-full object-cover" />
                        </div>
                      </td>

                      {/* Info */}
                      <td className="py-4 px-6 font-medium text-charcoal">
                        <span className="font-display font-bold uppercase tracking-wider text-[11px] block">
                          {v.make} {v.model}
                        </span>
                        <span className="text-[8px] font-mono text-neutral-400 block uppercase mt-0.5">Year: {v.year} | Ref: VIN-{v.id}</span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-display font-bold text-brand-red text-xs">
                        {v.price}
                      </td>

                      {/* Mileage */}
                      <td className="py-4 px-6 font-mono text-neutral-500">
                        {v.mileage}
                      </td>

                      {/* Editable Inline Status Dropdown */}
                      <td className="py-4 px-6">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className="bg-white border border-neutral-200 px-2 py-1 text-[10px] font-mono uppercase tracking-wider cursor-pointer text-neutral-700 outline-hidden focus:border-brand-red"
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Sold</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right flex items-center justify-end gap-2.5 h-16">
                        <button
                          onClick={() => setExpandedRowId(isExpanded ? null : v.id)}
                          className="p-1.5 border border-neutral-200 text-neutral-400 hover:text-charcoal hover:bg-neutral-50 cursor-pointer flex items-center justify-center"
                          title="Inspect Documents & Specs"
                        >
                          {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 border border-neutral-200 text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer flex items-center justify-center"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Expand Detail Subview Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-neutral-50/50 p-6 border-b border-border-hairline text-left">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                            
                            {/* Specs list */}
                            <div>
                              <span className="font-display font-bold text-[9px] uppercase tracking-wider text-charcoal mb-2.5 block">
                                Specifications checklist
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {v.specs?.map((spec) => (
                                  <span key={spec} className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-600 rounded-sm text-[9px] font-mono uppercase">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                              <span className="text-[9px] text-neutral-400 font-mono block mt-4 uppercase">Condition notes</span>
                              <p className="text-neutral-600 italic font-sans mt-1">{v.conditionNotes}</p>
                            </div>

                            {/* Mock photos / inspection logs */}
                            <div>
                              <span className="font-display font-bold text-[9px] uppercase tracking-wider text-charcoal mb-2.5 block">
                                Files & Asset checks
                              </span>
                              
                              <div className="space-y-2 font-mono text-[9px] uppercase text-neutral-500 tracking-wider">
                                <div className="flex justify-between items-center bg-white border border-neutral-100 p-2 rounded-2xs">
                                  <span className="flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>Vanguard_Inspection_Certificate.pdf</span>
                                  </span>
                                  <span className="text-green-600 font-bold">Approved</span>
                                </div>
                                <div className="flex justify-between items-center bg-white border border-neutral-100 p-2 rounded-2xs">
                                  <span className="flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>Clear_Title_Verification.pdf</span>
                                  </span>
                                  <span className="text-green-600 font-bold">Approved</span>
                                </div>
                              </div>

                              <div className="mt-3.5 flex gap-2">
                                <button onClick={() => triggerToast('Mock asset log registered.')} className="border border-neutral-200 hover:border-charcoal bg-white text-charcoal text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 cursor-pointer">
                                  Add Document Scan
                                </button>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
