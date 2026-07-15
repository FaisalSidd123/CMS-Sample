import React, { useState } from 'react';
import { useMockData } from '../../../hooks/useMockData';
import { DashboardSkeleton } from '../../../components/Skeletons';
import { 
  GitBranch, 
  ChevronRight, 
  ChevronLeft, 
  DollarSign, 
  User, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function AgentPipeline() {
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');

  const isLoading = clientsLoading || vehiclesLoading;

  // Stages array representing columns
  const stages = ['Early Discussion', 'Reserved', 'Payment Pending', 'Payment Confirmed', 'Closed'];

  // Local state for interactive pipeline deals
  const [deals, setDeals] = useState([
    { id: 'dl-1', clientName: 'Bruce Wayne', vehicleName: 'Toyota Land Cruiser', value: '$82,000', stage: 'Early Discussion' },
    { id: 'dl-2', clientName: 'Tony Stark', vehicleName: 'Porsche 911', value: '$112,000', stage: 'Reserved' },
    { id: 'dl-3', clientName: 'Alexander Sterling', vehicleName: 'Mercedes-Benz GLE', value: '$68,000', stage: 'Payment Pending' },
    { id: 'dl-4', clientName: 'Diana Prince', vehicleName: 'Range Rover Sport', value: '$94,000', stage: 'Reserved' },
    { id: 'dl-5', clientName: 'Selina Kyle', vehicleName: 'Ford Mustang GT', value: '$52,000', stage: 'Closed' },
    { id: 'dl-6', clientName: 'Jane Smith', vehicleName: 'Audi Q7', value: '$58,500', stage: 'Early Discussion' }
  ]);

  const [toastMsg, setToastMsg] = useState('');

  const moveDeal = (dealId, direction) => {
    setDeals(prevDeals => prevDeals.map(deal => {
      if (deal.id === dealId) {
        const currentIdx = stages.indexOf(deal.stage);
        const nextIdx = currentIdx + direction;
        
        if (nextIdx >= 0 && nextIdx < stages.length) {
          const nextStage = stages[nextIdx];
          setToastMsg(`Moved ${deal.clientName} to ${nextStage}`);
          setTimeout(() => setToastMsg(''), 2000);
          return { ...deal, stage: nextStage };
        }
      }
      return deal;
    }));
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Pre-calculate sums for header
  const pipelineValueSum = deals.reduce((acc, curr) => {
    if (curr.stage === 'Closed') return acc; // Exclude closed sales from active pipeline
    const val = parseInt(curr.value.replace(/[$,]/g, '')) || 0;
    return acc + val;
  }, 0);

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
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Operations Pipeline</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Deal Pipeline
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Track active acquisitions, check escrow clearing statuses, and manage closing stages.
          </p>
        </div>
        <div className="bg-white border border-border-hairline px-4 py-3 flex flex-col font-mono text-right shrink-0">
          <span className="text-[8px] text-neutral-400 uppercase tracking-wider font-semibold">Active Pipe Value</span>
          <span className="text-md font-display font-black text-brand-red">${(pipelineValueSum / 1000).toFixed(0)}k</span>
        </div>
      </div>

      {/* Kanban Layout - Scrollable horizontal columns */}
      <div className="flex gap-6 overflow-x-auto pb-4 items-start select-none">
        
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage);
          
          return (
            <div 
              key={stage} 
              className="w-72 bg-white border border-border-hairline p-4 shrink-0 shadow-xs flex flex-col h-[520px] justify-between"
            >
              <div>
                {/* Column header */}
                <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-2.5">
                  <h3 className="font-display font-bold text-[10px] uppercase tracking-wider text-charcoal truncate max-w-[180px]">
                    {stage}
                  </h3>
                  <span className="text-[9px] font-mono bg-neutral-100 text-charcoal px-2 py-0.5 rounded-sm font-bold">
                    {stageDeals.length}
                  </span>
                </div>

                {/* Deal Cards Container */}
                <div className="space-y-3.5 overflow-y-auto max-h-[410px] pr-1">
                  {stageDeals.map((deal) => {
                    const currentIdx = stages.indexOf(deal.stage);
                    const canMovePrev = currentIdx > 0;
                    const canMoveNext = currentIdx < stages.length - 1;
                    
                    return (
                      <div 
                        key={deal.id}
                        className="bg-light-bg border border-neutral-200/60 p-4 shadow-2xs hover:border-brand-red transition-colors flex flex-col justify-between h-[130px] rounded-xs"
                      >
                        <div>
                          {/* Client */}
                          <div className="flex items-center gap-1.5 text-xs text-charcoal font-semibold">
                            <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{deal.clientName}</span>
                          </div>

                          {/* Vehicle */}
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mt-1 truncate">
                            {deal.vehicleName}
                          </span>
                        </div>

                        {/* Bottom value & movement actions */}
                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-neutral-200/50">
                          <span className="text-[11px] font-display font-black text-brand-red tracking-tight">
                            {deal.value}
                          </span>

                          <div className="flex items-center gap-1">
                            {/* Move Prev */}
                            {canMovePrev && (
                              <button
                                onClick={() => moveDeal(deal.id, -1)}
                                className="p-1 border border-neutral-200 hover:border-charcoal hover:bg-white text-neutral-400 hover:text-charcoal cursor-pointer flex items-center justify-center rounded-xs"
                                title="Move Back"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            
                            {/* Move Next */}
                            {canMoveNext && (
                              <button
                                onClick={() => moveDeal(deal.id, 1)}
                                className="p-1 border border-neutral-200 hover:border-brand-red hover:bg-brand-red/5 text-neutral-400 hover:text-brand-red cursor-pointer flex items-center justify-center rounded-xs"
                                title="Move Forward"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                  {stageDeals.length === 0 && (
                    <div className="text-center py-20 text-neutral-300 text-[10px] font-mono uppercase tracking-wider">
                      Empty Stage
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
