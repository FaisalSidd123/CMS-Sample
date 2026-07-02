import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { TableSkeleton } from '../components/Skeletons';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Calendar, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function AdminReports() {
  const { data: vehiclesList, isLoading: vehiclesLoading } = useMockData('vehicles');
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: transactionsList, isLoading: txLoading } = useMockData('transactions');
  const { data: agentsList, isLoading: agentsLoading } = useMockData('agents');

  const isLoading = vehiclesLoading || clientsLoading || txLoading || agentsLoading;

  const [activeReport, setActiveReport] = useState('sales'); // sales / inventory / performance / customers
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Roster comparison array
  const roster = [
    { name: 'Ellen Ripley', email: 'ellen.ripley@vanguardmotors.com', closed: 5, revenue: '$492,000', status: 'Active' },
    { name: 'Sarah Connor', email: 'sarah.connor@vanguardmotors.com', closed: 4, revenue: '$384,500', status: 'Active' },
    { name: 'John Connor', email: 'john.connor@vanguardmotors.com', closed: 2, revenue: '$184,000', status: 'Active' },
    { name: 'Kyle Reese', email: 'kyle.reese@vanguardmotors.com', closed: 1, revenue: '$89,000', status: 'Active' }
  ];

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleExport = (format) => {
    triggerToast(`Exporting ${activeReport.toUpperCase()} report as ${format.toUpperCase()}...`);
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  // Render Table depending on selection
  const renderReportTable = () => {
    if (activeReport === 'sales') {
      const filtered = (transactionsList || []).filter(tx => {
        const client = clientsList?.find(c => c.id === tx.customerId);
        return client?.name.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      });

      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4">Tx ID</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => {
              const client = clientsList?.find(c => c.id === tx.customerId);
              return (
                <tr key={tx.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-neutral-400">{tx.id}</td>
                  <td className="py-3 px-4 font-display font-bold uppercase text-[11px] text-charcoal">{client?.name}</td>
                  <td className="py-3 px-4 font-display font-bold text-brand-red">{tx.amount}</td>
                  <td className="py-3 px-4 font-mono text-neutral-400">{new Date(tx.paymentDate || tx.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right font-mono uppercase text-[9px] font-bold text-neutral-500">{tx.paymentStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    if (activeReport === 'inventory') {
      const filtered = (vehiclesList || []).filter(v => 
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) || v.make.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4">Ref VIN</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Mileage</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                <td className="py-3 px-4 font-mono font-bold text-neutral-400">VIN-{v.id}</td>
                <td className="py-3 px-4 font-display font-bold uppercase text-[11px] text-charcoal">{v.make} {v.model}</td>
                <td className="py-3 px-4 font-display font-bold text-brand-red">{v.price}</td>
                <td className="py-3 px-4 font-mono text-neutral-500">{v.mileage}</td>
                <td className="py-3 px-4 text-right font-mono uppercase text-[9px] font-bold text-green-600">{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeReport === 'performance') {
      const filtered = roster.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4">Agent Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4 text-center">Deals Closed</th>
              <th className="py-3 px-4 text-right">Closed Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.name} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                <td className="py-3 px-4 font-display font-bold uppercase text-[11px] text-charcoal">{a.name}</td>
                <td className="py-3 px-4 font-mono text-neutral-500">{a.email}</td>
                <td className="py-3 px-4 text-center font-mono font-bold text-neutral-600">{a.closed}</td>
                <td className="py-3 px-4 text-right font-display font-bold text-brand-red">{a.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeReport === 'customers') {
      const filtered = (clientsList || []).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const agentName = roster.find(r => r.email.includes(c.assignedAgentId))?.name || 'Sarah Connor';
              return (
                <tr key={c.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                  <td className="py-3 px-4 font-display font-bold uppercase text-[11px] text-charcoal">{c.name}</td>
                  <td className="py-3 px-4 font-mono text-neutral-500">{c.email}</td>
                  <td className="py-3 px-4 font-display font-bold text-neutral-400 uppercase text-[10px]">{agentName}</td>
                  <td className="py-3 px-4 text-right font-mono uppercase text-[9px] font-bold text-neutral-500">{c.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return null;
  };

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
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Analysis Center</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Reports Dashboard
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Generate and preview operational sales reports, agent summaries, and buyer ledger matrices.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleExport('csv')}
            className="border border-neutral-200 hover:border-charcoal bg-white text-charcoal text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-border-hairline p-4 shadow-xs">
        
        {/* Report selection tabs */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          <button
            onClick={() => { setActiveReport('sales'); setSearchTerm(''); }}
            className={`px-3 py-1.5 uppercase border cursor-pointer ${
              activeReport === 'sales' ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => { setActiveReport('inventory'); setSearchTerm(''); }}
            className={`px-3 py-1.5 uppercase border cursor-pointer ${
              activeReport === 'inventory' ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
            }`}
          >
            Inventory Report
          </button>
          <button
            onClick={() => { setActiveReport('performance'); setSearchTerm(''); }}
            className={`px-3 py-1.5 uppercase border cursor-pointer ${
              activeReport === 'performance' ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
            }`}
          >
            Agent Performance
          </button>
          <button
            onClick={() => { setActiveReport('customers'); setSearchTerm(''); }}
            className={`px-3 py-1.5 uppercase border cursor-pointer ${
              activeReport === 'customers' ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
            }`}
          >
            Customer Roster
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search report parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-light-bg border border-border-hairline rounded-sm pl-9 pr-4 py-2 text-xs outline-hidden focus:border-brand-red transition-all text-charcoal placeholder:text-neutral-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

      </div>

      {/* Date Range selectors (mock) */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white border border-border-hairline p-4 text-xs">
        <span className="font-display font-bold uppercase tracking-wider text-charcoal shrink-0 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span>Report parameters bounds</span>
        </span>
        <div className="flex gap-2 items-center flex-1">
          <input type="date" defaultValue="2026-06-01" className="bg-light-bg border border-neutral-200 px-3 py-1.5 text-xs text-charcoal outline-hidden" />
          <span className="text-neutral-400">to</span>
          <input type="date" defaultValue="2026-07-02" className="bg-light-bg border border-neutral-200 px-3 py-1.5 text-xs text-charcoal outline-hidden" />
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-border-hairline flex justify-between items-center select-none">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Report Preview</span>
        </div>
        <div className="p-4">
          {renderReportTable()}
        </div>
      </div>

    </div>
  );
}
