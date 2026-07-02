import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMockData } from '../hooks/useMockData';
import { DetailSkeleton } from '../components/Skeletons';
import { 
  ArrowLeft, 
  Car, 
  Layers, 
  Fuel, 
  Users, 
  Heart, 
  Check, 
  Lock, 
  Mail, 
  MapPin, 
  ShieldAlert,
  Calendar
} from 'lucide-react';

export default function VehicleDetails({ vehicles = [], onReserve, savedVehicleIds = [], onToggleSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find vehicle in props or loading hook
  const { data: mockVehicle, isLoading: hookLoading } = useMockData('vehicles', id);
  const [vehicle, setVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState(false);

  // Sync component state with source data
  useEffect(() => {
    const localCar = vehicles.find(v => v.id.toString() === id?.toString());
    if (localCar) {
      setVehicle(localCar);
      setActiveImage(localCar.images?.[0] || localCar.thumbnailImage || '');
    } else if (mockVehicle) {
      setVehicle(mockVehicle);
      setActiveImage(mockVehicle.images?.[0] || mockVehicle.thumbnailImage || '');
    }
  }, [id, vehicles, mockVehicle]);

  if (hookLoading && !vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 text-left">
        <DetailSkeleton />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 text-center text-neutral-400 font-sans text-xs">
        <ShieldAlert className="w-8 h-8 text-brand-red mx-auto mb-3" />
        <span>Vehicle specification not found in active inventory.</span>
        <Link to="/" className="block text-brand-red font-semibold hover:underline mt-4">
          Return to Storefront Catalog
        </Link>
      </div>
    );
  }

  const isSaved = savedVehicleIds.includes(vehicle.id);
  const isAvailable = vehicle.status === 'available';

  const handleReserveClick = () => {
    if (!isAvailable) return;
    setReserveSuccess(true);
    setTimeout(() => {
      // Trigger global reservation handler
      onReserve(vehicle.id);
      // Navigate to portal orders page
      navigate('/portal/orders');
    }, 1500);
  };

  const getStatusBadge = () => {
    if (vehicle.status === 'available') {
      return (
        <span className="bg-green-50 text-green-600 border border-green-200 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-sm">
          Active Stock
        </span>
      );
    }
    if (vehicle.status === 'reserved') {
      return (
        <span className="bg-amber-50 text-amber-600 border border-amber-200 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-sm">
          VIN Reserved
        </span>
      );
    }
    return (
      <span className="bg-neutral-50 text-neutral-400 border border-neutral-200 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-sm">
        sold
      </span>
    );
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 text-left">
      
      {/* 1. Breadcrumb/Back row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <Link 
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-brand-red transition-colors font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>

      {/* Success reservation overlay */}
      {reserveSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-white p-8 max-w-sm text-center shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-display font-extrabold text-sm uppercase text-charcoal">VIN Lock Confirmed</h4>
            <p className="text-xs text-neutral-500 font-sans mt-2">
              Holding vehicle under buyer registry. Redirecting to workspace pipeline...
            </p>
          </div>
        </div>
      )}

      {/* 2. Main details Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Image frame */}
          <div className="aspect-16/10 bg-light-bg overflow-hidden flex items-center justify-center rounded-xs border border-neutral-100">
            {activeImage ? (
              <img
                src={activeImage}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-neutral-300 flex flex-col items-center gap-1.5 select-none">
                <ImageIcon className="w-10 h-10 stroke-[1.25]" />
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-24 aspect-16/10 bg-neutral-100 rounded-xs overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImage === img ? 'border-brand-red ring-2 ring-brand-red/10' : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt={`${vehicle.model} - thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Spec Panel (Span 5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Heading Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {getStatusBadge()}
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {vehicle.location || 'Miami Depot'}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-black text-charcoal uppercase leading-tight">
              {vehicle.model}
            </h2>
            
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-2xl font-display font-black text-brand-red tracking-tight">
                {vehicle.price}
              </span>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                {vehicle.mileage}
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-border-hairline" />

          {/* Specs Table */}
          <div className="space-y-4">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">
              Technical Specifications
            </span>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-light-bg p-3.5 flex items-center gap-3 border border-neutral-100">
                <Car className="w-4 h-4 text-neutral-400" />
                <div className="text-left">
                  <span className="text-[8px] text-neutral-400 uppercase block font-semibold">Body Type</span>
                  <span className="text-charcoal uppercase font-bold">{vehicle.bodyType}</span>
                </div>
              </div>
              <div className="bg-light-bg p-3.5 flex items-center gap-3 border border-neutral-100">
                <Layers className="w-4 h-4 text-neutral-400" />
                <div className="text-left">
                  <span className="text-[8px] text-neutral-400 uppercase block font-semibold">Transmission</span>
                  <span className="text-charcoal uppercase font-bold">{vehicle.specs?.transmission || 'Automatic'}</span>
                </div>
              </div>
              <div className="bg-light-bg p-3.5 flex items-center gap-3 border border-neutral-100">
                <Fuel className="w-4 h-4 text-neutral-400" />
                <div className="text-left">
                  <span className="text-[8px] text-neutral-400 uppercase block font-semibold">Engine Fuel</span>
                  <span className="text-charcoal uppercase font-bold">{vehicle.specs?.fuelType || 'Petrol'}</span>
                </div>
              </div>
              <div className="bg-light-bg p-3.5 flex items-center gap-3 border border-neutral-100">
                <Users className="w-4 h-4 text-neutral-400" />
                <div className="text-left">
                  <span className="text-[8px] text-neutral-400 uppercase block font-semibold">Seats Allocation</span>
                  <span className="text-charcoal uppercase font-bold">{vehicle.specs?.seats || 5} Seats</span>
                </div>
              </div>
            </div>

            {/* Spec detail logs */}
            <div className="border border-neutral-100 p-4 text-xs leading-relaxed text-neutral-500 font-sans">
              <span className="font-semibold text-charcoal font-display block uppercase tracking-wider text-[9px] mb-1">Engine Unit:</span>
              {vehicle.specs?.engine || '2.0L TwinPower Turbocharged In-line 4 Cylinder'}
            </div>
          </div>

          {/* Condition Notes */}
          <div className="space-y-3">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal block">
              Inspection Notes
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans bg-light-bg border border-border-hairline p-4 rounded-xs">
              {vehicle.conditionNotes || 'No structural reports on record. Authorized mechanical logs cached in directory.'}
            </p>
          </div>

          <div className="w-full h-[1px] bg-border-hairline" />

          {/* Interactive CTAs */}
          <div className="flex gap-4">
            
            {/* Primary Action Button */}
            {isAvailable ? (
              <button
                onClick={handleReserveClick}
                className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-4.5 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300 shadow-sm"
              >
                <span>Reserve This Vehicle</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <a
                href="mailto:advisors@vanguardmotors.com"
                className="flex-1 bg-charcoal text-white text-xs font-bold uppercase tracking-widest py-4.5 flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <span>Contact Advisor</span>
                <Mail className="w-4 h-4" />
              </a>
            )}

            {/* Save wish heart button */}
            <button
              onClick={() => onToggleSave(vehicle.id)}
              className={`px-5 py-4 border-2 transition-all cursor-pointer flex items-center justify-center ${
                isSaved 
                  ? 'bg-brand-red/10 border-brand-red text-brand-red' 
                  : 'bg-white border-neutral-200 hover:border-brand-red text-neutral-400 hover:text-brand-red'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
