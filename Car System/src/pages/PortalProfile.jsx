import React, { useState, useEffect } from 'react';
import { useMockData } from '../hooks/useMockData';
import { TableSkeleton } from '../components/Skeletons';
import { User, Phone, Mail, MapPin, Camera, Save } from 'lucide-react';

export default function PortalProfile() {
  const { data: customer, isLoading } = useMockData('customerProfile');
  
  // Local state for profile details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Sync state when mock data loads
  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
      setAddress(customer.shippingAddress);
      setAvatar(customer.avatarUrl);
    }
  }, [customer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastMsg('Account parameters updated successfully.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Mock avatar change triggers
  const handleAvatarMock = () => {
    setToastMsg('Avatar uploading mock UI triggered.');
    setTimeout(() => setToastMsg(''), 2000);
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={2} />;
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
        <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block mb-1">// Identity registry</span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-charcoal uppercase">
          Profile Settings
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Coordinate shipping logs, contact nodes, and authentication details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column: Avatar uploading UI */}
        <div className="bg-white border border-border-hairline p-8 text-center flex flex-col items-center justify-center gap-6 shadow-xs">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal block self-start pb-2 border-b border-border-hairline w-full text-left">
            Avatar Node
          </span>

          <div className="relative w-28 h-28 rounded-full overflow-hidden border border-neutral-100 group">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80'}
              alt="Avatar Profile"
              className="w-full h-full object-cover"
            />
            {/* Hover Camera icon overlay */}
            <div 
              onClick={handleAvatarMock}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
            >
              <Camera className="w-6 h-6" />
            </div>
          </div>

          <div className="text-left w-full space-y-1 text-center">
            <button
              type="button"
              onClick={handleAvatarMock}
              className="border border-neutral-200 hover:border-brand-red hover:bg-brand-red/5 px-4 py-2 text-[10px] font-mono uppercase tracking-widest font-bold text-charcoal hover:text-brand-red transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
            <p className="text-[10px] text-neutral-400 mt-2 block">
              Format: PNG, JPG. Max weight: 2MB.
            </p>
          </div>
        </div>

        {/* Right Columns: Profile Form */}
        <div className="lg:col-span-2 bg-white border border-border-hairline p-8 shadow-xs">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal block pb-4 border-b border-border-hairline w-full mb-6">
            Account Details
          </span>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>

              {/* Email Address (read only representation) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span>Email Node</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-400 outline-hidden cursor-not-allowed font-mono"
                />
              </div>

              {/* Phone Node */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>

            </div>

            {/* Shipping Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>Default Shipping Address</span>
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end pt-4 border-t border-border-hairline">
              <button
                type="submit"
                className="w-full sm:w-auto bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Parameters</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
