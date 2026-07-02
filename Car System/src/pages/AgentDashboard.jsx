import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockData } from '../hooks/useMockData';
import { DashboardSkeleton } from '../components/Skeletons';
import { 
  Users, 
  CalendarClock, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { data: agent, isLoading: agentLoading } = useMockData('agents');
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: reservationsList, isLoading: resLoading } = useMockData('reservations');
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');
  const { data: activityList, isLoading: activityLoading } = useMockData('activityLog');

  const isLoading = agentLoading || clientsLoading || resLoading || vehiclesLoading || activityLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Filter reservations relevant to agent-101
  const agentReservations = reservationsList?.filter(r => r.assignedAgentId === 'agent-101') || [];
  const activeResCount = agentReservations.filter(r => r.status === 'Pending' || r.status === 'Confirmed').length;
  
  // Expiration soon holds (< 24 hours left)
  const closingSoon = agentReservations
    .filter(r => {
      if (r.status !== 'Pending' && r.status !== 'Confirmed') return false;
      const timeLeftHours = (new Date(r.holdExpiresAt) - new Date()) / (1000 * 60 * 60);
      return timeLeftHours > 0 && timeLeftHours < 24;
    })
    .sort((a, b) => new Date(a.holdExpiresAt) - new Date(b.holdExpiresAt));

  // Closed sales count
  const closedCount = agent?.dealsClosedCount || 0;

  // Custom SVG Bar Chart calculation details
  const chartData = agent?.monthlySalesTrend || [];
  const maxVal = Math.max(...chartData.map(d => d.sales)) || 1;

  return (
    <div className="space-y-8 text-left">
      
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// CRM Console</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Sarah's Workspace
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Monitor client pipeline activities, expiring holdings, and commission metrics.
          </p>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Clients */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Active Clients</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{clientsList?.length || 0}</span>
            <Users className="w-4 h-4 text-neutral-300" />
          </div>
        </div>

        {/* Card 2: Active Reservations */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Active holds</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{activeResCount}</span>
            <span className="text-[9px] font-mono bg-blue-50 text-blue-600 px-1 py-0.5 uppercase tracking-wide">Reserved</span>
          </div>
        </div>

        {/* Card 3: Completed Sales */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Month Completed</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{closedCount}</span>
            <span className="text-[9px] font-mono bg-green-50 text-green-600 px-1 py-0.5 uppercase tracking-wide">Closed</span>
          </div>
        </div>

        {/* Card 4: Monthly Commission */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Commission MTD</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-brand-red">{agent?.totalCommissionEarned}</span>
            <DollarSign className="w-4 h-4 text-brand-red" />
          </div>
        </div>

      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Performance Graph & Holds Expiration */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Performance Summary Graph (Custom Responsive SVG) */}
          <div className="bg-white border border-border-hairline p-5 shadow-xs text-left">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-3">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-brand-red" />
                <span>Operational Sales Volume</span>
              </span>
              <span className="text-[9px] font-mono text-neutral-400 uppercase">Current Month: {agent?.totalSalesThisMonth}</span>
            </div>

            {/* Custom Responsive SVG Bar Chart */}
            <div className="w-full h-44 mt-4">
              <svg viewBox="0 0 500 160" width="100%" height="100%" className="overflow-visible font-mono text-[9px] text-neutral-400">
                {/* Horizontal grid lines */}
                <line x1="30" y1="10" x2="480" y2="10" stroke="#F1F1F1" strokeWidth="1" />
                <line x1="30" y1="65" x2="480" y2="65" stroke="#F1F1F1" strokeWidth="1" />
                <line x1="30" y1="120" x2="480" y2="120" stroke="#F1F1F1" strokeWidth="1" />

                {/* Y-Axis Label */}
                <text x="5" y="15" fill="#A3A3A3" textAnchor="start">Max</text>
                <text x="5" y="125" fill="#A3A3A3" textAnchor="start">$0</text>

                {/* Rendering Bars */}
                {chartData.map((d, idx) => {
                  const x = 50 + idx * 72;
                  const barHeight = (d.sales / maxVal) * 110;
                  const y = 120 - barHeight;
                  
                  return (
                    <g key={d.month} className="group">
                      {/* Interactive Bar */}
                      <rect
                        x={x}
                        y={y}
                        width="28"
                        height={barHeight}
                        fill="#C0392B"
                        className="hover:fill-brand-red-hover transition-colors duration-200"
                        rx="1"
                      />
                      {/* Value tooltip label on hover */}
                      <text
                        x={x + 14}
                        y={y - 6}
                        fill="#1A1A1A"
                        textAnchor="middle"
                        className="font-bold opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[8px]"
                      >
                        ${(d.sales / 1000).toFixed(0)}k
                      </text>
                      {/* Month Label */}
                      <text
                        x={x + 14}
                        y="136"
                        fill="#737373"
                        textAnchor="middle"
                        className="uppercase font-semibold text-[9px]"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}
                {/* Baseline */}
                <line x1="30" y1="120" x2="480" y2="120" stroke="#1A1A1A" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Expiring Holds Table */}
          <div className="bg-white border border-border-hairline p-5 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <CalendarClock className="w-4.5 h-4.5 text-brand-red" />
                <span>Deals Closing Soon</span>
              </span>
              {closingSoon.length > 0 && (
                <span className="text-[9px] font-mono bg-amber-50 text-amber-600 px-1.5 py-0.5 uppercase tracking-wider font-bold">
                  {closingSoon.length} urgent hold{closingSoon.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {closingSoon.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                      <th className="pb-3 font-semibold">Client</th>
                      <th className="pb-3 font-semibold">Vehicle</th>
                      <th className="pb-3 font-semibold">Time Remaining</th>
                      <th className="pb-3 font-semibold text-right font-mono">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closingSoon.map((res) => {
                      const client = clientsList?.find(c => c.id === res.clientId);
                      const vehicle = vehiclesList?.find(v => v.id === res.vehicleId);
                      const hoursLeft = (new Date(res.holdExpiresAt) - new Date()) / (1000 * 60 * 60);
                      
                      return (
                        <tr key={res.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">{client?.name}</td>
                          <td className="py-3 text-neutral-500 font-mono font-bold uppercase">{vehicle?.model}</td>
                          <td className="py-3 text-brand-red font-mono font-bold uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{hoursLeft.toFixed(1)} hours left</span>
                          </td>
                          <td className="py-3 text-right">
                            <Link 
                              to="/agent/reservations"
                              className="text-[9px] font-mono uppercase tracking-widest text-brand-red hover:underline font-bold"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-400 text-xs font-sans">
                No holds are nearing expiration logs. Excellent pipe parameters.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Recent activities */}
        <div className="bg-white border border-border-hairline p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
              Recent Workspace Log
            </span>

            <div className="flex flex-col gap-4">
              {activityList?.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs leading-relaxed">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                  <div className="flex-1 flex flex-col text-left">
                    <span className="text-neutral-700 font-semibold">{act.description}</span>
                    <span className="text-[8px] font-mono text-neutral-400 mt-0.5 uppercase">
                      {new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/agent/activity"
            className="text-xs font-bold uppercase tracking-widest text-charcoal hover:text-brand-red flex items-center gap-1 mt-6 border-t border-neutral-100 pt-4 cursor-pointer"
          >
            <span>View Full activity feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
