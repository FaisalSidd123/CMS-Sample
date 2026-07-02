import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { TableSkeleton } from '../components/Skeletons';
import {
  DollarSign,
  Search,
  AlertTriangle,
  FileText,
  Calendar,
  TrendingUp,
  User,
  Car,
  SlidersHorizontal,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function AdminTransactions() {
  const { data: initialTx, isLoading: txLoading } = useMockData('transactions');
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');
  const { data: agentsList, isLoading: agentsLoading } = useMockData('agents');

  const isLoading = txLoading || clientsLoading || vehiclesLoading || agentsLoading;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [ledgerTab, setLedgerTab] = useState('agents');

  // Hardcode summary financial values
  const financialSummary = {
    totalRevenue: '$1,149,500',
    outstanding: '$50,000',
    overdue: '$82,000',
    avgDeal: '$88,950'
  };

  // Precomputed breakdown lists replacing Recharts graphs
  const revenueByAgent = [
    { agent: 'Ellen Ripley', closed: 5, value: '$492,000' },
    { agent: 'Sarah Connor', closed: 4, value: '$384,500' },
    { agent: 'John Connor', closed: 2, value: '$184,000' },
    { agent: 'Kyle Reese', closed: 1, value: '$89,000' }
  ];

  const revenueByCategory = [
    { category: 'Supercars & Sports', sold: 5, value: '$565,000' },
    { category: 'Premium SUVs', sold: 4, value: '$384,500' },
    { category: 'Executive Sedans', sold: 3, value: '$200,000' }
  ];

  const getStatusColor = (status) => {
    if (status === 'Paid') return 'bg-green-50 text-green-600 border-green-200';
    if (status === 'Partially Paid') return 'bg-blue-50 text-blue-600 border-blue-200';
    if (status === 'Pending') return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-red-50 text-red-600 border-red-200';
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  // Filter logs
  const filteredTx = (initialTx || []).filter(tx => {
    const client = clientsList?.find(c => c.id === tx.customerId);
    const vehicle = vehiclesList?.find(v => v.id === tx.vehicleId);

    const clientName = client?.name || '';
    const vehicleModel = vehicle?.model || '';

    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || tx.paymentStatus === statusFilter;
    const matchesAgent = agentFilter === 'All' || tx.agentId === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  return (
    <div className="space-y-8 text-left relative">

      {/* Header */}
      <div>
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Escrow Logs</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Transactions & Payments
        </h2>
        <p className="text-[11px] text-neutral-400 font-sans mt-1">
          Monitor payment clearing timelines, identify overdue balances, and inspect regional financial performance breakdown.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* KPI: Total Revenue */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Total Revenue Closed</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-brand-red">{financialSummary.totalRevenue}</span>
            <DollarSign className="w-4 h-4 text-brand-red animate-pulse" />
          </div>
        </div>

        {/* KPI: Outstanding Balance */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Outstanding Escrow</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{financialSummary.outstanding}</span>
            <Clock className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

        {/* KPI: Overdue Amount */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Overdue Balance</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-red-600">{financialSummary.overdue}</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
        </div>

        {/* KPI: Avg Deal Size */}
        <div className="bg-white border border-border-hairline p-4 flex flex-col justify-between h-20 shadow-xs">
          <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">Avg. Deal size</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-display font-black text-charcoal">{financialSummary.avgDeal}</span>
            <TrendingUp className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

      </div>

      {/* Main control table and breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left pane: Transactions list */}
        <div className="lg:col-span-2 space-y-6">

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-border-hairline p-4 shadow-xs">

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-light-bg border border-border-hairline rounded-sm pl-9 pr-4 py-2 text-xs outline-hidden focus:border-brand-red transition-all text-charcoal placeholder:text-neutral-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Filter controls dropdowns */}
            <div className="flex gap-2 text-[10px] font-mono">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-neutral-200 px-2 py-1 text-xs outline-hidden cursor-pointer"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>

              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="bg-white border border-neutral-200 px-2 py-1 text-xs outline-hidden cursor-pointer"
              >
                <option value="All">All Agents</option>
                <option value="agent-101">Sarah Connor</option>
              </select>
            </div>

          </div>

          {/* Table */}
          {filteredTx.length > 0 ? (
            <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                      <th className="py-3 px-4 font-semibold">Tx ID</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Vehicle</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Due Date</th>
                      <th className="py-3 px-4 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-hairline">
                    {filteredTx.map((tx) => {
                      const client = clientsList?.find(c => c.id === tx.customerId);
                      const vehicle = vehiclesList?.find(v => v.id === tx.vehicleId);
                      const isOverdue = tx.paymentStatus === 'Overdue';

                      return (
                        <tr
                          key={tx.id}
                          className={`hover:bg-neutral-50/50 transition-colors ${isOverdue ? 'border-l-4 border-l-brand-red bg-brand-red/5' : ''
                            }`}
                        >
                          {/* ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">
                            {tx.id}
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-4 font-display font-bold uppercase text-[11px] text-charcoal">
                            {client?.name}
                          </td>

                          {/* Vehicle */}
                          <td className="py-3.5 px-4 font-mono text-neutral-500 uppercase text-[10px]">
                            {vehicle?.model}
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-4 font-display font-bold text-brand-red">
                            {tx.amount}
                          </td>

                          {/* Due Date */}
                          <td className="py-3.5 px-4 font-mono text-neutral-400">
                            {new Date(tx.dueDate).toLocaleDateString()}
                          </td>

                          {/* Status badge */}
                          <td className="py-3.5 px-4 text-right">
                            <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-xs ${getStatusColor(tx.paymentStatus)
                              }`}>
                              {tx.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-border-hairline bg-white p-12 text-center text-neutral-400 font-sans text-xs">
              No transactions matching selection.
            </div>
          )}

        </div>

        {/* Right pane: Simple, clean Revenue Ledgers (replacing graphs) */}
        <div className="bg-white border border-border-hairline p-5 shadow-xs flex flex-col justify-between min-h-[350px]">
          <div>
            {/* Header Tabs */}
            <div className="flex border-b border-neutral-100 pb-2 mb-4 gap-4 select-none">
              <button
                onClick={() => setLedgerTab('agents')}
                className={`text-[10px] font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${ledgerTab === 'agents' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
                  }`}
              >
                By Agent
              </button>
              <button
                onClick={() => setLedgerTab('categories')}
                className={`text-[10px] font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${ledgerTab === 'categories' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
                  }`}
              >
                By Category
              </button>
            </div>

            {/* TAB: By Agent */}
            {ledgerTab === 'agents' && (
              <div className="space-y-3">
                {revenueByAgent.map((item) => (
                  <div key={item.agent} className="flex justify-between items-center text-xs pb-2 border-b border-neutral-50 last:border-0">
                    <span className="font-display font-bold uppercase text-charcoal">{item.agent}</span>
                    <div className="flex items-center gap-4 font-mono text-[10px]">
                      <span className="text-neutral-400">{item.closed} deals</span>
                      <span className="text-brand-red font-bold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: By Category */}
            {ledgerTab === 'categories' && (
              <div className="space-y-3">
                {revenueByCategory.map((item) => (
                  <div key={item.category} className="flex justify-between items-center text-xs pb-2 border-b border-neutral-50 last:border-0">
                    <span className="font-display font-bold uppercase text-charcoal">{item.category}</span>
                    <div className="flex items-center gap-4 font-mono text-[10px]">
                      <span className="text-neutral-400">{item.sold} sold</span>
                      <span className="text-brand-red font-bold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
            <span>Escrow wiring check: Active</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        </div>

      </div>

    </div>
  );
}
