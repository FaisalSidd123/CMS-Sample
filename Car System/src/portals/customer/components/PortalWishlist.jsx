import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMockData } from '../../../hooks/useMockData';
import { CardSkeleton } from '../../../components/Skeletons';
import { 
  Heart, 
  Trash2, 
  Car, 
  Layers, 
  Fuel, 
  ArrowRight,
  HeartCrack,
  Image as ImageIcon
} from 'lucide-react';

export default function PortalWishlist() {
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');
  const { data: customer, isLoading: customerLoading } = useMockData('customerProfile');

  const [wishlistIds, setWishlistIds] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Sync wishlist IDs once customer loads
  useEffect(() => {
    if (customer?.savedVehicleIds) {
      setWishlistIds(customer.savedVehicleIds);
    }
  }, [customer]);

  const isLoading = vehiclesLoading || customerLoading;

  // Filter vehicles that are saved in local state
  const wishlistCars = vehiclesList?.filter(car => wishlistIds.includes(car.id)) || [];

  const handleRemove = (carId, carName) => {
    setWishlistIds(prev => prev.filter(id => id !== carId));
    setFeedbackMsg(`Removed: ${carName}`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Badge helper
  const getStatusBadgeClass = (status) => {
    if (status === 'available') return 'bg-green-50 text-green-600 border-green-200';
    if (status === 'reserved') return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-neutral-50 text-neutral-400 border-neutral-100';
  };

  return (
    <div className="space-y-8 text-left relative">
      
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {feedbackMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block mb-1">// Saved configurations</span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-charcoal uppercase">
          My Wishlist
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Review saved vehicles. VIN configurations are refreshed automatically from active stocks.
        </p>
      </div>

      {/* Wishlist Grid */}
      {isLoading ? (
        <CardSkeleton count={2} />
      ) : wishlistCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistCars.map((car) => (
            <div 
              key={car.id} 
              className="premium-card flex flex-col justify-between h-full bg-white border border-border-hairline p-5"
            >
              <div>
                {/* Image frame */}
                <div className="aspect-16/9 w-full bg-light-bg overflow-hidden flex items-center justify-center relative mb-5 rounded-sm">
                  {car.thumbnailImage ? (
                    <img
                      src={car.thumbnailImage}
                      alt={car.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-neutral-400 select-none">
                      <ImageIcon className="w-8 h-8 stroke-[1.25]" />
                    </div>
                  )}

                  {/* Status Badge overlay */}
                  <span className={`absolute top-3 left-3 text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 border rounded-xs ${
                    getStatusBadgeClass(car.status)
                  }`}>
                    {car.status}
                  </span>

                  {/* Remove heart button */}
                  <button 
                    onClick={() => handleRemove(car.id, car.model)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/95 border border-neutral-100 hover:border-brand-red text-neutral-400 hover:text-brand-red transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Car details */}
                <div className="flex justify-between items-start gap-4">
                  <div className="text-left">
                    <h3 className="font-display font-extrabold text-xs uppercase text-charcoal leading-tight">
                      {car.model}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-1 block">
                      {car.year} • {car.mileage}
                    </span>
                  </div>
                  <span className="text-sm font-display font-black text-brand-red tracking-tight shrink-0">
                    {car.price}
                  </span>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-border-hairline my-4" />

                {/* Technical Specifications */}
                <div className="grid grid-cols-3 gap-2 py-1 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase">
                    <Car className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{car.bodyType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase justify-center">
                    <Layers className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{car.specs.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase justify-end">
                    <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{car.specs.fuelType}</span>
                  </div>
                </div>

              </div>

              {/* View details */}
              <div className="mt-6 pt-4 border-t border-border-hairline flex items-center justify-between">
                <Link
                  to={car.status === 'available' ? '/' : '#'}
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group transition-colors ${
                    car.status === 'available'
                      ? 'text-charcoal hover:text-brand-red'
                      : 'text-neutral-300 cursor-not-allowed'
                  }`}
                >
                  <span>{car.status === 'available' ? 'Inspect & Reserve' : 'Record locked'}</span>
                  {car.status === 'available' && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border-hairline bg-white p-20 text-center text-neutral-400 font-sans text-xs flex flex-col items-center justify-center gap-4">
          <HeartCrack className="w-10 h-10 text-neutral-300 stroke-[1.25]" />
          <div>
            <h3 className="font-display font-bold uppercase text-charcoal text-sm">No saved vehicles</h3>
            <p className="mt-1 text-neutral-500">Your configuration wishlist is currently empty.</p>
          </div>
          <Link
            to="/"
            className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-colors mt-2"
          >
            Explore Search Directory
          </Link>
        </div>
      )}

    </div>
  );
}
