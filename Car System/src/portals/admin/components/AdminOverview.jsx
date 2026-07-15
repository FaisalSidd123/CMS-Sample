import React from 'react';
import { useMockData } from '../../../hooks/useMockData';
import { DashboardSkeleton } from '../../../components/Skeletons';
import { 
  Car, 
  CalendarCheck, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  DollarSign,
  ArrowUpRight,
  Clock,
  Briefcase
} from 'lucide-react';

export default function AdminOverview() {
  // Load full sets
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: reservationsList, isLoading: resLoading } = useMockData('reservations');
  const { data: agentsList, isLoading: agentsLoading } = useMockData('agents'); // roster inside
  const { data: activityList, isLoading: activityLoading } = useMockData('activityLog');
  const { data: auditList, isLoading: auditLoading } = useMockData('adminAuditLog');
  const { data: transactionsList, isLoading: txLoading } = useMockData('transactions');

  const isLoading = vehiclesLoading || clientsLoading || resLoading || agentsLoading || activityLoading || auditLoading || txLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Hardcode values corresponding to our mock roster data in agents.js
  const roster = [
    { name: 'Ellen Ripley', email: 'ellen.ripley@vanguardmotors.com', closed: 5, revenue: '$492,000' },
    { name: 'Sarah Connor', email: 'sarah.connor@vanguardmotors.com', closed: 4, revenue: '$384,500' },
    { name: 'John Connor', email: 'john.connor@vanguardmotors.com', closed: 2, revenue: '$184,000' },
    { name: 'Kyle Reese', email: 'kyle.reese@vanguardmotors.com', closed: 1, revenue: '$89,000' }
  ];

  // Active reservations count
  const activeResCount = reservationsList?.filter(r => r.status === 'Pending' || r.status === 'Confirmed').length || 0;

  // Total platform revenue count
  const totalRevenueVal = '$1,149,500';

  // Merge general activity and admin audit logs for a single master control timeline feed
  const unifiedActivities = [
    ...(activityList || []).map(a => ({ ...a, origin: 'Agent Portal' })),
    ...(auditList || []).map(a => ({ id: a.id, description: `${a.adminName} (${a.actionTaken}): ${a.target}`, timestamp: a.timestamp, origin: 'Audit Log' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome header */}
      <div>
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Operations Center</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Command Center Overview
        </h2>
        <p className="text-[11px] text-neutral-400 font-sans mt-1">
          Real-time platform metrics, agent sales performance leaders, and administrative audit trails.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* KPI: Total Inventory */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Inventory</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{vehiclesList?.length || 0}</span>
            <Car className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

        {/* KPI: Active holds */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Active holds</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{activeResCount}</span>
            <CalendarCheck className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

        {/* KPI: Total Revenue */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs lg:col-span-2">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Total sales value</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-display font-black text-brand-red">{totalRevenueVal}</span>
            <DollarSign className="w-4 h-4 text-brand-red" />
          </div>
        </div>

        {/* KPI: Clients */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Customers</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{clientsList?.length || 0}</span>
            <Users className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

        {/* KPI: Agents */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Sales Agents</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{roster.length}</span>
            <Briefcase className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

      </div>

      {/* Leaderboard and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Columns: Agent Leaderboard */}
        <div className="lg:col-span-3 bg-white border border-border-hairline p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-brand-red" />
                <span>Agent Performance Leaderboard</span>
              </span>
              <span className="text-[9px] font-mono text-neutral-400 uppercase">Sales Month-To-Date</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                    <th className="pb-3 font-semibold">Rank</th>
                    <th className="pb-3 font-semibold">Agent Name</th>
                    <th className="pb-3 font-semibold text-center">Deals Closed</th>
                    <th className="pb-3 font-semibold text-right">Revenue Closed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {roster.map((agent, idx) => (
                    <tr key={agent.name} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-neutral-400">#0{idx + 1}</td>
                      <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">{agent.name}</td>
                      <td className="py-3 text-center font-mono font-bold text-neutral-600">{agent.closed}</td>
                      <td className="py-3 text-right font-display font-bold text-brand-red">{agent.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Columns: Platform Activity timeline */}
        <div className="lg:col-span-2 bg-white border border-border-hairline p-5 shadow-xs flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <Clock className="w-4.5 h-4.5 text-brand-red" />
                <span>Unified Platform Activity</span>
              </span>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[250px] pr-1">
              {unifiedActivities.slice(0, 7).map((act) => (
                <div key={act.id} className="flex items-start gap-2 text-xs leading-relaxed text-left border-b border-neutral-50/60 pb-2 last:border-0">
                  <div className="flex-1 flex flex-col">
                    <span className="text-neutral-700 font-semibold">{act.description}</span>
                    <div className="flex justify-between items-center mt-1 font-mono text-[8px] text-neutral-400 uppercase">
                      <span>Ref: {act.id}</span>
                      <span>{act.origin}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
