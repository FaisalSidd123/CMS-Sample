import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMockData } from '../hooks/useMockData';
import { CardSkeleton, DetailSkeleton } from '../components/Skeletons';
import { 
  Car, 
  ArrowLeft, 
  Check, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

export default function PortalOrders() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch active orders and vehicles lists
  const { data: ordersList, isLoading: ordersLoading } = useMockData('orders');
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');

  const isLoading = ordersLoading || vehiclesLoading;

  // Stages definition
  const stages = ['Reserved', 'Invoiced', 'Paid', 'Shipped', 'Delivered'];

  // Status color codes
  const getStageColorClass = (stage, isCurrent) => {
    if (isCurrent) {
      if (stage === 'Reserved') return 'bg-amber-50 text-amber-600 border-amber-200';
      if (stage === 'Invoiced') return 'bg-blue-50 text-blue-600 border-blue-200';
      if (stage === 'Paid') return 'bg-green-50 text-green-600 border-green-200';
      if (stage === 'Shipped') return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
    return 'bg-neutral-50 text-neutral-400 border-neutral-100';
  };

  // Render Order Details View
  if (id) {
    if (isLoading) {
      return <DetailSkeleton />;
    }

    const order = ordersList?.find(o => o.id === id);
    const vehicle = vehiclesList?.find(v => v.id === order?.vehicleId);

    if (!order) {
      return (
        <div className="border border-border-hairline bg-white p-12 text-center text-neutral-400 font-sans text-xs">
          <AlertTriangle className="w-8 h-8 text-brand-red mx-auto mb-3" />
          <span>Active order record not found.</span>
          <Link to="/portal/orders" className="block text-brand-red font-semibold hover:underline mt-4">
            Return to Active Orders List
          </Link>
        </div>
      );
    }

    const currentStageIndex = stages.indexOf(order.currentStage);

    return (
      <div className="space-y-8 text-left">
        {/* Back navigation */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/portal/orders')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-brand-red transition-colors font-mono uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Active Orders</span>
          </button>
        </div>

        {/* Header summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 border-b border-border-hairline gap-4">
          <div>
            <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block mb-1">// Transaction tracking</span>
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase flex items-center gap-3">
              <span>Order Details</span>
              <span className="text-xs font-mono bg-neutral-100 text-neutral-500 border border-neutral-200 px-2 py-0.5 font-bold">
                {order.id}
              </span>
            </h2>
          </div>
          <div className="flex gap-4 font-mono text-[10px] text-neutral-400">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Filed: {new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Detail page Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Columns (timeline details) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white border border-border-hairline p-6 shadow-xs">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-8 block">
                Operation Pipeline Status
              </span>

              {/* Vertical Timeline */}
              <div className="relative pl-10 flex flex-col gap-10">
                {/* Timeline vertical bar */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-neutral-100" />
                <div 
                  className="absolute left-4 top-2 w-0.5 bg-brand-red transition-all duration-700" 
                  style={{ height: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                />

                {stages.map((stage, idx) => {
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const historyRecord = order.stageHistory.find(h => h.stage === stage);
                  
                  return (
                    <div key={stage} className="relative flex flex-col gap-1.5">
                      
                      {/* Timeline point */}
                      <span className={`absolute left-[-35px] top-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${
                        isCompleted 
                          ? 'bg-brand-red border-brand-red text-white' 
                          : isCurrent
                            ? 'bg-white border-brand-red text-brand-red ring-4 ring-brand-red/10 scale-105'
                            : 'bg-white border-neutral-200 text-neutral-400'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                        )}
                      </span>

                      {/* Header block */}
                      <div className="flex items-center gap-3">
                        <h4 className={`text-xs font-display font-bold uppercase tracking-wider ${
                          isCurrent ? 'text-brand-red' : isCompleted ? 'text-charcoal' : 'text-neutral-400'
                        }`}>
                          {stage}
                        </h4>
                        {historyRecord && (
                          <span className="text-[9px] font-mono text-neutral-400 uppercase">
                            {new Date(historyRecord.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Note block */}
                      <p className={`text-xs leading-relaxed font-sans max-w-md ${
                        isCurrent 
                          ? 'text-charcoal font-medium' 
                          : isCompleted 
                            ? 'text-neutral-500' 
                            : 'text-neutral-300 opacity-50'
                      }`}>
                        {historyRecord 
                          ? historyRecord.note
                          : `Status awaiting preceding stages. Next scheduled checkpoint.`
                        }
                      </p>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Columns (vehicle details & agent card) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Vehicle Summary Panel */}
            {vehicle && (
              <div className="bg-white border border-border-hairline p-5 shadow-xs">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
                  Vehicle Allocated
                </span>
                
                <div className="aspect-16/9 bg-light-bg rounded-xs overflow-hidden flex items-center justify-center mb-4">
                  {vehicle.thumbnailImage ? (
                    <img
                      src={vehicle.thumbnailImage}
                      alt={vehicle.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-neutral-300" />
                  )}
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-extrabold text-xs uppercase text-charcoal">{vehicle.model}</h3>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-1 block">
                      {vehicle.year} • {vehicle.mileage}
                    </span>
                  </div>
                  <span className="text-sm font-display font-black text-brand-red tracking-tight">{vehicle.price}</span>
                </div>
              </div>
            )}

            {/* Agent Contact Card */}
            <div className="bg-white border border-border-hairline p-5 shadow-xs">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
                Assigned Specialist
              </span>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neutral-100 border border-border-hairline flex items-center justify-center font-display font-extrabold text-charcoal uppercase tracking-widest text-xs shrink-0">
                  {order.agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-display font-bold uppercase text-charcoal">{order.agent.name}</h4>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Advisors Node</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                <a 
                  href={`mailto:${order.agent.contact}`}
                  className="flex items-center gap-2 hover:text-brand-red transition-colors pb-2 border-b border-neutral-100"
                >
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>{order.agent.contact}</span>
                </a>
                <div className="flex items-center gap-2 pt-1">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>+1 (800) 555-0199 ext. 294</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // Render Orders List View
  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block mb-1">// Transaction logs</span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-charcoal uppercase">
          Active Operations
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Monitor status changes and pipeline steps for your currently reserved vehicles.
        </p>
      </div>

      {isLoading ? (
        <CardSkeleton count={2} />
      ) : ordersList && ordersList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ordersList.map((order) => {
            const vehicle = vehiclesList?.find(v => v.id === order.vehicleId);
            return (
              <div 
                key={order.id} 
                className="premium-card flex flex-col justify-between bg-white border border-border-hairline p-5 h-[340px]"
              >
                <div>
                  {/* Image container */}
                  <div className="aspect-16/9 bg-light-bg rounded-xs overflow-hidden flex items-center justify-center relative mb-4">
                    {vehicle?.thumbnailImage ? (
                      <img
                        src={vehicle.thumbnailImage}
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-neutral-300" />
                    )}
                    {/* Status badge overlay */}
                    <span className="absolute top-3 left-3 bg-charcoal text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1">
                      {order.id}
                    </span>
                  </div>

                  {/* Title details */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-display font-extrabold text-xs uppercase text-charcoal leading-tight">
                        {vehicle?.model || 'Allocating vehicle...'}
                      </h3>
                      <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mt-1.5">
                        Filed: {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Color coded status badge */}
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 border rounded-xs shrink-0 ${
                      getStageColorClass(order.currentStage, true)
                    }`}>
                      {order.currentStage}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-hairline flex items-center justify-between">
                  <Link
                    to={`/portal/orders/${order.id}`}
                    className="text-xs font-bold uppercase tracking-wider text-charcoal hover:text-brand-red flex items-center gap-1.5 group transition-colors"
                  >
                    <span>Track Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-border-hairline bg-white p-16 text-center text-neutral-400 font-sans text-xs">
          No active operations on record.
        </div>
      )}

    </div>
  );
}
