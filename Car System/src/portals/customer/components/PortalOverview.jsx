import React from 'react';
import { Link } from 'react-router-dom';
import { useMockData } from '../../../hooks/useMockData';
import { DashboardSkeleton } from '../../../components/Skeletons';
import { 
  Car, 
  FileText, 
  Heart, 
  History, 
  ArrowRight, 
  User,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function PortalOverview() {
  const { data: activeOrders, isLoading: ordersLoading } = useMockData('orders');
  const { data: purchases, isLoading: purchasesLoading } = useMockData('purchaseHistory');
  const { data: customer, isLoading: customerLoading } = useMockData('customerProfile');

  const isLoading = ordersLoading || purchasesLoading || customerLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Pre-calculate statistics
  const activeOrdersCount = activeOrders?.length || 0;
  const reservationsCount = activeOrders?.filter(o => o.currentStage === 'Reserved').length || 0;
  const pastPurchasesCount = purchases?.length || 0;
  const wishlistCount = customer?.savedVehicleIds?.length || 0;

  // Stages array for stepper comparison
  const stages = ['Reserved', 'Invoiced', 'Paid', 'Shipped', 'Delivered'];

  // Mock activity feed data
  const activities = [
    { id: 1, text: 'Escrow payment verified for Mercedes-Benz GLE', time: '2h ago', type: 'payment' },
    { id: 2, text: 'Invoice generated for order ord-3029', time: '1d ago', type: 'doc' },
    { id: 3, text: 'Reservation held for Range Rover Sport', time: '2d ago', type: 'hold' },
    { id: 4, text: 'Alexander Sterling profile address updated', time: '3d ago', type: 'profile' }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome banner */}
      <div>
        <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block mb-1">// Customer Area</span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-charcoal uppercase">
          Welcome back, {customer?.name.split(' ')[0]}
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Monitor your active orders, inspect document logs, and browse saved configurations.
        </p>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Orders */}
        <div className="bg-white border border-border-hairline p-5 flex flex-col justify-between h-24">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Active Orders</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-display font-black text-charcoal">{activeOrdersCount}</span>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 uppercase tracking-wide">In Progress</span>
          </div>
        </div>

        {/* Card 2: Reservations */}
        <div className="bg-white border border-border-hairline p-5 flex flex-col justify-between h-24">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">VIN Reservations</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-display font-black text-charcoal">{reservationsCount}</span>
            <span className="text-[10px] font-mono bg-amber-50 text-amber-600 px-1.5 py-0.5 uppercase tracking-wide">Locks Active</span>
          </div>
        </div>

        {/* Card 3: Past Purchases */}
        <div className="bg-white border border-border-hairline p-5 flex flex-col justify-between h-24">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Total Purchases</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-display font-black text-charcoal">{pastPurchasesCount}</span>
            <span className="text-[10px] font-mono bg-green-50 text-green-600 px-1.5 py-0.5 uppercase tracking-wide">Delivered</span>
          </div>
        </div>

        {/* Card 4: Wishlist */}
        <div className="bg-white border border-border-hairline p-5 flex flex-col justify-between h-24">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Wishlist Vehicles</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-display font-black text-charcoal">{wishlistCount}</span>
            <span className="text-[10px] font-mono bg-neutral-50 text-neutral-600 px-1.5 py-0.5 uppercase tracking-wide">Saved</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Active Orders & Sidebar Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Order Steppers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-hairline p-6 shadow-xs flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">
                Active Operations Tracking
              </span>
              <Link to="/portal/orders" className="text-neutral-400 hover:text-brand-red text-xs flex items-center gap-1">
                <span>All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeOrders && activeOrders.length > 0 ? (
              <div className="space-y-8">
                {activeOrders.slice(0, 2).map((order) => {
                  const currentIdx = stages.indexOf(order.currentStage);
                  
                  return (
                    <div key={order.id} className="border border-neutral-100 p-5 rounded-xs">
                      {/* Title block */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-neutral-100 text-charcoal px-2 py-0.5 rounded-sm uppercase tracking-wide font-bold">
                            {order.id}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono tracking-wider">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Link 
                          to={`/portal/orders/${order.id}`}
                          className="text-xs text-brand-red hover:underline font-semibold flex items-center gap-0.5"
                        >
                          <span>Track details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Stepper progress indicator */}
                      <div className="relative flex justify-between items-center w-full py-4 mt-2">
                        {/* Stepper bar line */}
                        <div className="absolute left-4 right-4 h-0.5 bg-neutral-100 top-1/2 -translate-y-1/2 z-0" />
                        <div 
                          className="absolute left-4 h-0.5 bg-brand-red top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{ width: `calc(${(currentIdx / (stages.length - 1)) * 100}% - 8px)` }}
                        />

                        {stages.map((stage, idx) => {
                          const isCompleted = idx < currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <div key={stage} className="flex flex-col items-center relative z-10">
                              
                              {/* Step circle */}
                              <div 
                                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                                  isCompleted 
                                    ? 'bg-brand-red border-brand-red text-white' 
                                    : isCurrent
                                      ? 'bg-white border-brand-red text-brand-red ring-4 ring-brand-red/10 scale-110'
                                      : 'bg-white border-neutral-200 text-neutral-400'
                                }`}
                              >
                                {idx + 1}
                              </div>

                              {/* Step tag */}
                              <span className={`absolute -bottom-6 text-[8px] uppercase tracking-wider font-mono font-bold whitespace-nowrap ${
                                isCurrent ? 'text-brand-red' : isCompleted ? 'text-charcoal' : 'text-neutral-400'
                              }`}>
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 text-xs font-sans">
                No active orders found. Start your buying journey in the inventory catalog.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: User Profile Card & Activities */}
        <div className="flex flex-col gap-6">
          
          {/* User Profile Card */}
          <div className="bg-white border border-border-hairline p-6 text-center flex flex-col justify-between items-center h-[200px]">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 border border-border-hairline">
              <img
                src={customer?.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm uppercase text-charcoal mt-2">{customer?.name}</h3>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-0.5">{customer?.email}</p>
            </div>
            <Link 
              to="/portal/profile" 
              className="text-xs font-bold uppercase tracking-wider text-brand-red hover:underline mt-2 inline-flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Account Settings</span>
            </Link>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white border border-border-hairline p-6 flex-1 text-left flex flex-col justify-between">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
              Recent Workspace Log
            </span>
            
            <div className="flex flex-col gap-3.5">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs leading-relaxed">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-neutral-700 font-semibold">{act.text}</span>
                    <span className="text-[9px] font-mono text-neutral-400 mt-0.5 uppercase">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white border border-border-hairline p-6">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
          Workspace Quick Links
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          
          <Link
            to="/"
            className="border border-neutral-100 hover:border-brand-red hover:bg-neutral-50/50 p-4 transition-all text-center flex flex-col items-center justify-center gap-2"
          >
            <Car className="w-5 h-5 text-brand-red" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal font-bold">Browse Inventory</span>
          </Link>

          <Link
            to="/portal/orders"
            className="border border-neutral-100 hover:border-brand-red hover:bg-neutral-50/50 p-4 transition-all text-center flex flex-col items-center justify-center gap-2"
          >
            <Car className="w-5 h-5 text-brand-red" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal font-bold">Track Orders</span>
          </Link>

          <Link
            to="/portal/documents"
            className="border border-neutral-100 hover:border-brand-red hover:bg-neutral-50/50 p-4 transition-all text-center flex flex-col items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5 text-brand-red" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal font-bold">Transaction Docs</span>
          </Link>

          <Link
            to="/portal/profile"
            className="border border-neutral-100 hover:border-brand-red hover:bg-neutral-50/50 p-4 transition-all text-center flex flex-col items-center justify-center gap-2"
          >
            <User className="w-5 h-5 text-brand-red" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal font-bold">Account Settings</span>
          </Link>

        </div>
      </div>

    </div>
  );
}
