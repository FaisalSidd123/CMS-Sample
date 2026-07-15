import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useMockData } from '../../../hooks/useMockData';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  CalendarRange, 
  Car, 
  User, 
  Clock, 
  Check, 
  X, 
  Plus, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FolderLock
} from 'lucide-react';

export default function AgentReservations({ 
  sharedReservations = [], 
  onUpdateReservations, 
  sharedVehicles = [],
  onUpdateVehicles
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isReserveFlow = location.pathname === '/agent/reserve';

  // Load client and base datasets
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');
  const { data: initialRes, isLoading: resLoading } = useMockData('reservations');

  const isLoading = clientsLoading || vehiclesLoading || resLoading;

  // Local state synchronization
  const [resList, setResList] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  
  // Form states
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [holdDuration, setHoldDuration] = useState('48');

  // Load state parameters if redirected with pre-selected client
  useEffect(() => {
    if (location.state?.preselectedClientId) {
      setSelectedClient(location.state.preselectedClientId);
    }
  }, [location.state]);

  // Sync holds list
  useEffect(() => {
    if (sharedReservations.length > 0) {
      setResList(sharedReservations);
    } else if (initialRes) {
      setResList(initialRes);
    }
  }, [sharedReservations, initialRes]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Status badges colors mapping
  const getStatusColor = (status, isExpiring) => {
    if (isExpiring) return 'bg-red-50 text-red-600 border-red-200 ring-2 ring-red-500/10';
    if (status === 'Pending') return 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'Confirmed') return 'bg-blue-50 text-blue-600 border-blue-200';
    if (status === 'Converted to Sale') return 'bg-purple-50 text-purple-600 border-purple-200';
    return 'bg-neutral-50 text-neutral-400 border-neutral-200';
  };

  const checkExpiring = (res) => {
    if (res.status !== 'Pending' && res.status !== 'Confirmed') return false;
    const hoursLeft = (new Date(res.holdExpiresAt) - new Date()) / (1000 * 60 * 60);
    return hoursLeft > 0 && hoursLeft < 6;
  };

  // Actions
  const handleConvert = (resId, vehicleId) => {
    // 1. Update reservation status
    const updated = resList.map(r => r.id === resId ? { ...r, status: 'Converted to Sale' } : r);
    setResList(updated);
    onUpdateReservations(updated);

    // 2. Set vehicle status as sold in global state
    const currentVehicles = vehiclesList || sharedVehicles;
    const updatedVehicles = currentVehicles.map(v => v.id === vehicleId ? { ...v, status: 'sold' } : v);
    onUpdateVehicles(updatedVehicles);

    triggerToast(`Hold ${resId} converted to sale. VIN status marked Sold.`);
  };

  const handleCancel = (resId, vehicleId) => {
    // 1. Update reservation status to expired
    const updated = resList.map(r => r.id === resId ? { ...r, status: 'Expired' } : r);
    setResList(updated);
    onUpdateReservations(updated);

    // 2. Restore vehicle to available in global state
    const currentVehicles = vehiclesList || sharedVehicles;
    const updatedVehicles = currentVehicles.map(v => v.id === vehicleId ? { ...v, status: 'available' } : v);
    onUpdateVehicles(updatedVehicles);

    triggerToast(`Hold ${resId} cancelled. Vehicle returned to catalog.`);
  };

  const handleExtend = (resId) => {
    const updated = resList.map(r => {
      if (r.id === resId) {
        const currentExpiry = new Date(r.holdExpiresAt);
        const newExpiry = new Date(currentExpiry.getTime() + 24 * 60 * 60 * 1000).toISOString();
        return { ...r, holdExpiresAt: newExpiry, holdDurationHours: r.holdDurationHours + 24 };
      }
      return r;
    });
    setResList(updated);
    onUpdateReservations(updated);
    triggerToast(`Hold ${resId} extended by 24 hours.`);
  };

  // Form submit
  const handlePlaceHold = (e) => {
    e.preventDefault();
    if (!selectedClient || !selectedVehicle) return;

    const vehicleId = parseInt(selectedVehicle);
    const durationHours = parseInt(holdDuration);
    
    // Create new reservation
    const newResId = `res-${Math.floor(4000 + Math.random() * 9000)}`;
    const newRes = {
      id: newResId,
      clientId: selectedClient,
      vehicleId: vehicleId,
      assignedAgentId: 'agent-101',
      status: 'Pending',
      createdDate: new Date().toISOString(),
      holdDurationHours: durationHours,
      holdExpiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
    };

    // Update global holding lists
    const updatedReservations = [newRes, ...resList];
    setResList(updatedReservations);
    onUpdateReservations(updatedReservations);

    // Set vehicle status to reserved in global state
    const currentVehicles = vehiclesList || sharedVehicles;
    const updatedVehicles = currentVehicles.map(v => v.id === vehicleId ? { ...v, status: 'reserved' } : v);
    onUpdateVehicles(updatedVehicles);

    triggerToast(`VIN locked under client file. Hold ID: ${newResId}`);
    setTimeout(() => {
      navigate('/agent/reservations');
    }, 1200);
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  // 1. PLACE RESERVATION FLOW
  if (isReserveFlow) {
    const currentVehicles = vehiclesList || sharedVehicles;
    const availableVehicles = currentVehicles.filter(v => v.status === 'available');

    return (
      <div className="space-y-8 text-left max-w-xl mx-auto">
        {toastMsg && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
            {toastMsg}
          </div>
        )}

        {/* Back navigation */}
        <div>
          <button 
            onClick={() => navigate('/agent/reservations')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-brand-red transition-colors font-mono uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Reservations</span>
          </button>
        </div>

        {/* Header */}
        <div className="pb-4 border-b border-border-hairline">
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Lock Operations</span>
          <h2 className="text-xl font-display font-extrabold text-charcoal uppercase leading-none">
            Place VIN Hold
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Reserve a vehicle from catalog inventory and allocate it to a client lead folder.
          </p>
        </div>

        {/* Form panel */}
        <div className="bg-white border border-border-hairline p-6 shadow-xs">
          <form onSubmit={handlePlaceHold} className="space-y-6">
            
            {/* Step 1: Select Client */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-300" />
                <span>1. Select Client Folder</span>
              </label>
              <select
                required
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="">-- Choose Client --</option>
                {clientsList?.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Available Vehicle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-neutral-300" />
                <span>2. Select Available Vehicle</span>
              </label>
              <select
                required
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="">-- Choose Vehicle --</option>
                {currentVehicles.map(v => (
                  <option 
                    key={v.id} 
                    value={v.id} 
                    disabled={v.status !== 'available'}
                  >
                    {v.model} ({v.year}) - {v.price} {v.status !== 'available' ? `[${v.status.toUpperCase()}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Hold Duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-300" />
                <span>3. Configure Hold Duration</span>
              </label>
              <select
                value={holdDuration}
                onChange={(e) => setHoldDuration(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="24">24 Hours (1 Day)</option>
                <option value="48">48 Hours (2 Days)</option>
                <option value="72">72 Hours (3 Days)</option>
                <option value="168">168 Hours (7 Days)</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <FolderLock className="w-4 h-4" />
              <span>Confirm hold lock</span>
            </button>

          </form>
        </div>

      </div>
    );
  }

  // 2. RESERVATIONS LIST VIEW
  const currentVehicles = vehiclesList || sharedVehicles;

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
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Reservation Ledger</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Hold Registrations
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Track hold countdowns, extend reservation deadlines, or convert active locks to sales.
          </p>
        </div>
        <Link
          to="/agent/reserve"
          className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors inline-flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Hold</span>
        </Link>
      </div>

      {/* Grid List representation */}
      {resList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {resList.map((res) => {
            const client = clientsList?.find(c => c.id === res.clientId);
            const vehicle = currentVehicles.find(v => v.id === res.vehicleId);
            const isExpiring = checkExpiring(res);
            
            // Expiry countdown calculations
            const expTime = new Date(res.holdExpiresAt);
            const hoursLeft = Math.max(0, (expTime - new Date()) / (1000 * 60 * 60));

            return (
              <div 
                key={res.id} 
                className={`border bg-white p-5 flex flex-col justify-between h-[230px] transition-all shadow-xs ${
                  isExpiring 
                    ? 'border-red-300 ring-2 ring-red-500/5 bg-red-50/10' 
                    : 'border-border-hairline'
                }`}
              >
                <div>
                  {/* Header metadata row */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono bg-neutral-100 text-charcoal px-2 py-0.5 font-bold uppercase tracking-wider">
                      {res.id}
                    </span>
                    
                    {/* Status Badge */}
                    <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-xs ${
                      getStatusColor(res.status, isExpiring)
                    }`}>
                      {isExpiring ? 'Expiring Soon' : res.status}
                    </span>
                  </div>

                  {/* Main specs info */}
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">Client Lead</span>
                      <Link 
                        to={`/agent/clients/${client?.id}`}
                        className="font-display font-bold text-xs uppercase text-charcoal hover:text-brand-red hover:underline block truncate mt-0.5"
                      >
                        {client?.name || 'Allocating client...'}
                      </Link>
                    </div>

                    <div>
                      <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">Allocated VIN</span>
                      <span className="font-mono font-bold text-xs text-charcoal block truncate mt-0.5">
                        {vehicle?.model || 'Allocating vehicle...'}
                      </span>
                    </div>
                  </div>

                  {/* Expiration and time indicator */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    {res.status === 'Pending' || res.status === 'Confirmed' ? (
                      <span className={`font-mono text-[10px] font-semibold ${isExpiring ? 'text-red-600 font-bold' : ''}`}>
                        Expires in: {hoursLeft.toFixed(1)} hours ({expTime.toLocaleDateString()})
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-neutral-400 uppercase">
                        Expired / Closed Log: {expTime.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Operations buttons */}
                {(res.status === 'Pending' || res.status === 'Confirmed') && (
                  <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                    <button
                      onClick={() => handleConvert(res.id, res.vehicleId)}
                      className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white text-[9px] font-mono font-bold uppercase py-2 cursor-pointer transition-colors text-center"
                    >
                      Convert to Sale
                    </button>
                    <button
                      onClick={() => handleExtend(res.id)}
                      className="flex-1 border border-neutral-200 hover:border-charcoal hover:bg-neutral-50 text-charcoal text-[9px] font-mono font-bold uppercase py-2 cursor-pointer transition-all text-center"
                    >
                      Extend hold
                    </button>
                    <button
                      onClick={() => handleCancel(res.id, res.vehicleId)}
                      className="p-2 border border-neutral-200 hover:border-red-500 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all cursor-pointer flex items-center justify-center"
                      title="Cancel Hold"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-border-hairline bg-white p-16 text-center text-neutral-400 font-sans text-xs">
          No hold registrations currently logged.
        </div>
      )}

    </div>
  );
}
