import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  Plus, 
  X, 
  Trash2, 
  Eye, 
  EyeOff, 
  UploadCloud, 
  FileSpreadsheet, 
  FileText,
  Edit2
} from 'lucide-react';

export default function AdminInventory({ inventoryFilter = 'all' }) {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Add form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [bodyType, setBodyType] = useState('Coupe');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');
  const [specs, setSpecs] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Edit form states
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [editMake, setEditMake] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMileage, setEditMileage] = useState('');
  const [editBodyType, setEditBodyType] = useState('Coupe');
  const [editColor, setEditColor] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editConditionNotes, setEditConditionNotes] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newEditImages, setNewEditImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Sheet parser states
  const [bulkUploadedData, setBulkUploadedData] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchVehicles = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/vehicles')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setVehicles(json.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load fleet:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewEditImages([]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEditImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!make || !model || !price || !mileage) return;

    setIsUploading(true);
    let uploadedUrls = [];

    try {
      const uploadPromises = selectedImages.map(imgBase64 => {
        return fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: imgBase64,
            folder: 'vanguard_vehicles',
            resourceType: 'image'
          })
        }).then(r => r.json());
      });

      const uploadResults = await Promise.all(uploadPromises);
      uploadedUrls = uploadResults.filter(res => res.success).map(res => res.url);
    } catch (err) {
      console.error('Cloudinary upload failure:', err);
    }

    const thumbnail = uploadedUrls.length > 0 
      ? uploadedUrls[0] 
      : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80';

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
      thumbnailImage: thumbnail,
      images: uploadedUrls.length > 0 ? uploadedUrls : [thumbnail]
    };

    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch('http://localhost:5000/api/vehicles', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newVehicleData)
    })
      .then(res => res.json())
      .then(json => {
        setIsUploading(false);
        if (json.success && json.data) {
          setVehicles([json.data, ...vehicles]);
          setShowAddForm(false);
          setMake(''); setModel(''); setPrice(''); setMileage(''); setColor(''); setLocation(''); setSpecs(''); setConditionNotes('');
          setSelectedImages([]);
          triggerToast(`Added vehicle: ${make} ${model} to database.`);
        } else {
          triggerToast(`Failed to register vehicle: ${json.error}`);
        }
      })
      .catch(err => {
        setIsUploading(false);
        triggerToast('Failed to connect to backend server catalog.');
      });
  };

  const handleEditClick = (v) => {
    setEditVehicleId(v.id);
    setEditMake(v.make);
    setEditModel(v.model);
    setEditYear(v.year.toString());
    setEditPrice(v.price ? v.price.toString().replace(/[^0-9]/g, '') : '');
    setEditMileage(v.mileage ? v.mileage.toString().replace(/[^0-9]/g, '') : '');
    setEditBodyType(v.bodyType || 'Coupe');
    setEditColor(v.color || '');
    setEditLocation(v.location || '');
    setEditSpecs(v.specs ? v.specs.join(', ') : '');
    setEditConditionNotes(v.conditionNotes || '');
    setExistingImages(v.images || [v.thumbnailImage]);
    setNewEditImages([]);
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    if (!editMake || !editModel || !editPrice || !editMileage) return;

    setIsEditing(true);
    let uploadedUrls = [];

    try {
      const uploadPromises = newEditImages.map(imgBase64 => {
        return fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: imgBase64,
            folder: 'vanguard_vehicles',
            resourceType: 'image'
          })
        }).then(r => r.json());
      });

      const uploadResults = await Promise.all(uploadPromises);
      uploadedUrls = uploadResults.filter(res => res.success).map(res => res.url);
    } catch (err) {
      console.error('Cloudinary upload failure:', err);
    }

    const mergedImages = [...existingImages, ...uploadedUrls];
    const finalPrice = `$${Number(editPrice).toLocaleString()}`;
    const finalMileage = `${Number(editMileage).toLocaleString()} mi`;

    const updatedVehicleData = {
      make: editMake,
      model: editModel,
      year: parseInt(editYear),
      price: finalPrice,
      mileage: finalMileage,
      bodyType: editBodyType,
      color: editColor,
      location: editLocation,
      specs: editSpecs ? editSpecs.split(',').map(s => s.trim()) : [],
      conditionNotes: editConditionNotes,
      thumbnailImage: mergedImages[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
      images: mergedImages
    };

    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch(`http://localhost:5000/api/vehicles/${editVehicleId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedVehicleData)
    })
      .then(res => res.json())
      .then(json => {
        setIsEditing(false);
        if (json.success && json.data) {
          setVehicles(vehicles.map(v => v.id === editVehicleId ? json.data : v));
          setEditVehicleId(null);
          triggerToast('Vehicle updated successfully.');
        } else {
          triggerToast(`Failed to update vehicle: ${json.error}`);
        }
      })
      .catch(err => {
        setIsEditing(false);
        triggerToast('Failed to update vehicle: Server connection error');
      });
  };

  const handleStatusChange = (id, newStatus) => {
    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch(`http://localhost:5000/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setVehicles(vehicles.map(v => v.id === id ? { ...v, status: newStatus } : v));
          triggerToast(`Vehicle status modified to: ${newStatus.toUpperCase()}`);
        }
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this vehicle from registry inventory?')) return;

    const token = sessionStorage.getItem('vanguard_admin_token');

    fetch(`http://localhost:5000/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setVehicles(vehicles.filter(v => v.id !== id));
          triggerToast('Vehicle purged successfully.');
        }
      });
  };

  const handleSimulateDragOver = (e) => {
    e.preventDefault();
  };

  const handleSimulateDrop = (e) => {
    e.preventDefault();
    setBulkUploadedData([
      { id: 45, make: 'Ferrari', model: 'SF90 Stradale', year: 2021, price: '$512,000', mileage: '940 mi', status: 'available' },
      { id: 48, make: 'Lamborghini', model: 'Huracan Evo', year: 2022, price: '$284,000', mileage: '2,400 mi', status: 'available' },
      { id: 50, make: 'McLaren', model: '720S Spider', year: 2020, price: '$269,000', mileage: '4,100 mi', status: 'available' }
    ]);
  };

  const handleConfirmImport = () => {
    if (!bulkUploadedData) return;
    const formattedImports = bulkUploadedData.map(v => ({
      ...v,
      specs: ['Laser Headlights', 'Carbon Package'],
      conditionNotes: 'Import scan verified.',
      thumbnailImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80']
    }));

    onUpdateVehicles([...formattedImports, ...vehicles]);
    setBulkUploadedData(null);
    triggerToast(`Imported 3 vehicles from sheet parser.`);
  };

  if (isLoading) return <TableSkeleton rows={4} cols={4} />;

  return (
    <div className="space-y-8 text-left relative">
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

            <div className="flex flex-col gap-1 md:col-span-3">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Upload Vehicle Photos (Multiple)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red w-full cursor-pointer" 
              />
              {selectedImages.length > 0 && (
                <div className="text-[8px] font-mono text-green-600 mt-1">
                  ✓ {selectedImages.length} images queued for Cloudinary upload.
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="md:col-span-3 bg-charcoal hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-widest py-3 cursor-pointer transition-colors text-center shadow-xs"
            >
              {isUploading ? 'Uploading to Cloudinary...' : 'Confirm registration'}
            </button>
          </form>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editVehicleId && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4 bg-black/60">
          <form onSubmit={handleUpdateVehicle} className="relative w-full max-w-2xl bg-white border border-border-hairline p-6 shadow-2xl text-left space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">Edit Vehicle Details</span>
              <button type="button" onClick={() => setEditVehicleId(null)} className="text-neutral-400 hover:text-brand-red cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Make</label>
                <input required type="text" value={editMake} onChange={e => setEditMake(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Model</label>
                <input required type="text" value={editModel} onChange={e => setEditModel(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Year</label>
                <input required type="number" value={editYear} onChange={e => setEditYear(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Price ($ USD)</label>
                <input required type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Mileage (Miles)</label>
                <input required type="number" value={editMileage} onChange={e => setEditMileage(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Body Type</label>
                <select value={editBodyType} onChange={e => setEditBodyType(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer">
                  <option value="Coupe">Coupe</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Supercar">Supercar</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Color</label>
                <input type="text" value={editColor} onChange={e => setEditColor(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Location</label>
                <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Specs (comma-separated)</label>
                <input type="text" value={editSpecs} onChange={e => setEditSpecs(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Condition Remarks</label>
                <textarea rows={2} value={editConditionNotes} onChange={e => setEditConditionNotes(e.target.value)} className="bg-light-bg border border-border-hairline p-3 text-xs text-charcoal outline-hidden focus:border-brand-red resize-none" />
              </div>

              {/* Edit Existing Images list & upload option */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">Add More Vehicle Photos</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleEditImageChange} 
                  className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red w-full cursor-pointer" 
                />
                
                {/* Existing Images preview */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {existingImages.map((url, idx) => (
                    <div key={idx} className="relative w-16 h-12 bg-neutral-100 border border-neutral-200">
                      <img src={url} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newEditImages.length > 0 && (
                    <div className="text-[8px] font-mono text-green-600 self-center">
                      + {newEditImages.length} new photos pending upload.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isEditing}
              className="w-full bg-brand-red hover:bg-brand-red-hover disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-widest py-3 cursor-pointer transition-colors"
            >
              {isEditing ? 'Uploading images to Cloudinary & Saving...' : 'Save Fleet Updates'}
            </button>
          </form>
        </div>
      )}

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
              {vehicles
                .filter(v => {
                  if (inventoryFilter === 'all') return true;
                  return v.status === inventoryFilter;
                })
                .map((v) => {
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

                      {/* Read-Only Status Badge */}
                      <td className="py-4 px-6">
                        {v.status === 'available' && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-sm">
                            Available
                          </span>
                        )}
                        {v.status === 'reserved' && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-sm">
                            Reserved
                          </span>
                        )}
                        {v.status === 'sold' && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded-sm">
                            Sold
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right flex items-center justify-end gap-2.5 h-16">
                        <button
                          onClick={() => handleEditClick(v)}
                          className="p-1.5 border border-neutral-200 text-neutral-400 hover:text-brand-red hover:bg-neutral-50 cursor-pointer flex items-center justify-center"
                          title="Edit Vehicle Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
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

                            {/* Additional Photos gallery */}
                            <div>
                              <span className="font-display font-bold text-[9px] uppercase tracking-wider text-charcoal mb-2.5 block">
                                Photo Gallery Archive ({v.images?.length || 0})
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {v.images?.map((url, index) => (
                                  <a key={index} href={url} target="_blank" rel="noreferrer" className="w-16 h-12 bg-neutral-100 rounded-xs overflow-hidden border border-neutral-200 hover:border-brand-red transition-all">
                                    <img src={url} className="w-full h-full object-cover" />
                                  </a>
                                ))}
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
