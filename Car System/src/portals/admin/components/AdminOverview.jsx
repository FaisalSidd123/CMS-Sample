import React, { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../../components/Skeletons';
import { 
  Car, 
  CalendarCheck, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Briefcase
} from 'lucide-react';

export default function AdminOverview() {
  const [vehicles, setVehicles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchVehicles = fetch('http://localhost:5000/api/vehicles').then(r => r.json());
    const fetchLeads = fetch('http://localhost:5000/api/leads').then(r => r.json());
    const fetchReservations = fetch('http://localhost:5000/api/reservations').then(r => r.json());
    const fetchAgents = fetch('http://localhost:5000/api/agents').then(r => r.json());
    const fetchPayments = fetch('http://localhost:5000/api/payments').then(r => r.json());

    Promise.all([fetchVehicles, fetchLeads, fetchReservations, fetchAgents, fetchPayments])
      .then(([vJson, lJson, resJson, aJson, pJson]) => {
        if (vJson.success) setVehicles(vJson.data);
        if (lJson.success) setLeads(lJson.data);
        if (resJson.success) setReservations(resJson.data);
        if (aJson.success) setAgents(aJson.data);
        if (pJson.success) setPayments(pJson.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard metric sets:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Active reservations count
  const activeResCount = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;

  // Calculate platform sales revenue from database payment allocations
  const totalSalesVal = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  // Calculate Net Dealer Profit: final payment price - vehicle wholesale base price
  const totalProfitVal = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => {
      const vehicle = vehicles.find(v => v.id === p.vehicle_id);
      if (vehicle) {
        const salePrice = parseFloat(p.amount) || 0;
        const rawBase = vehicle.basePrice || vehicle.base_price || 0;
        const basePrice = typeof rawBase === 'number'
          ? rawBase
          : parseFloat(rawBase.toString().replace(/[$,]/g, '')) || 0;
        return sum + (salePrice - basePrice);
      }
      return sum;
    }, 0);

  // Group performance metrics dynamically: map payments to their respective assigned agents via reservations/leads
  const agentPerformance = agents.map(agent => {
    // Find all won leads or reservations matching this agent's ID
    const agentReservations = reservations.filter(r => r.agent_id === agent.id);
    const reservationIds = agentReservations.map(r => r.id);

    // Filter payments settled for this agent's reservations
    const agentSettled = payments.filter(p => p.payment_status === 'completed' && reservationIds.includes(p.reservation_id));
    const totalRev = agentSettled.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return {
      name: agent.name,
      email: agent.email,
      closed: agentSettled.length,
      revenue: totalRev
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Fallback if no agents have sales yet
  const displayRoster = agentPerformance.length > 0 ? agentPerformance : [
    { name: 'Sarah Connor', email: 'sarah@vanguard.com', closed: 0, revenue: 0 }
  ];

  // Dynamic activity logger feed showing recent reservations, leads, and settlements
  const recentActivities = [
    ...payments.map(p => ({
      id: `pay-${p.id}`,
      description: `Escrow payment of $${Number(p.amount).toLocaleString()} cleared for vehicle ${p.vehicles?.make || ''}`,
      timestamp: p.created_at,
      origin: 'Settlement'
    })),
    ...reservations.map(r => ({
      id: `res-${r.id}`,
      description: `Vehicle hold requested for ${r.vehicles?.make || ''} ${r.vehicles?.model || ''} by ${r.leads?.name || ''}`,
      timestamp: r.created_at,
      origin: 'Hold Booking'
    })),
    ...leads.map(l => ({
      id: `lead-${l.id}`,
      description: `New lead generated for ${l.name} via ${l.source}`,
      timestamp: l.created_at,
      origin: 'Acquisition'
    }))
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
          Real-time database metrics, agent sales performance leaders, and administrative audit trails.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* KPI: Total Inventory */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Inventory</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{vehicles.length}</span>
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
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Total sales value</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-display font-black text-brand-red">${totalSalesVal.toLocaleString()}</span>
            <DollarSign className="w-3.5 h-3.5 text-brand-red" />
          </div>
        </div>

        {/* KPI: Net Profit */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Dealer Net Profit</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-display font-black text-emerald-600">${totalProfitVal.toLocaleString()}</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

        {/* KPI: Leads count */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Total Leads</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{leads.length}</span>
            <Users className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

        {/* KPI: Agents */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Sales Agents</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{agents.length}</span>
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
                  {displayRoster.map((agent, idx) => (
                    <tr key={agent.name} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-neutral-400">#0{idx + 1}</td>
                      <td className="py-3 font-display font-bold uppercase text-[11px] text-charcoal">{agent.name}</td>
                      <td className="py-3 text-center font-mono font-bold text-neutral-600">{agent.closed}</td>
                      <td className="py-3 text-right font-display font-bold text-brand-red">${Number(agent.revenue).toLocaleString()}</td>
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
              {recentActivities.slice(0, 7).map((act) => (
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
              {recentActivities.length === 0 && (
                <div className="py-8 text-center text-neutral-400 font-sans text-xs">
                  No platform log events recorded in database yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
