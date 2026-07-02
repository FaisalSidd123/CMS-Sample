import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { TableSkeleton } from '../components/Skeletons';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  ArrowRight, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';

export default function AdminUsers({ 
  sharedClients = [], 
  onUpdateClients, 
  sharedAgents = [], 
  onUpdateAgents,
  sharedReservations = [],
  sharedActivities = []
}) {
  const { data: initialClients, isLoading: clientsLoading } = useMockData('clients');
  const { data: initialAgents, isLoading: agentsLoading } = useMockData('agents');

  const clients = sharedClients.length > 0 ? sharedClients : (initialClients || []);
  // Make sure to use roster if agentsList is passed
  const agents = sharedAgents.length > 0 ? sharedAgents : (initialAgents?.roster || []);

  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Reassign agent
  const handleReassignAgent = (clientId, newAgentId) => {
    const updated = clients.map(c => c.id === clientId ? { ...c, assignedAgentId: newAgentId } : c);
    onUpdateClients(updated);
    const agentName = agents.find(a => a.id === newAgentId)?.name || newAgentId;
    triggerToast(`Customer reassigned to Agent ${agentName}.`);
  };

  // Toggle Customer status
  const handleToggleCustomerStatus = (clientId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updated = clients.map(c => c.id === clientId ? { ...c, status: nextStatus } : c);
    onUpdateClients(updated);
    triggerToast(`Customer account set to: ${nextStatus}`);
  };

  // Toggle Agent status
  const handleToggleAgentStatus = (agentId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updated = agents.map(a => a.id === agentId ? { ...a, status: nextStatus } : a);
    onUpdateAgents(updated);
    triggerToast(`Agent account set to: ${nextStatus}`);
  };

  const getClientStatusColor = (status) => {
    if (status === 'Active Lead' || status === 'Active') return 'bg-green-50 text-green-600 border-green-200';
    if (status === 'In Progress') return 'bg-blue-50 text-blue-600 border-blue-200';
    return 'bg-neutral-50 text-neutral-400 border-neutral-200';
  };

  // Filtering
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = clientsLoading || agentsLoading;

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
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
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// User Registers</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Customers & Agents
        </h2>
        <p className="text-[11px] text-neutral-400 font-sans mt-1">
          Perform administrative reassignments of client folders, monitor agent counts, or toggle system accounts access.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white border border-border-hairline p-4 shadow-xs">
        
        {/* Toggle */}
        <div className="flex gap-4 border-b md:border-b-0 border-neutral-100 select-none pb-2 md:pb-0">
          <button
            onClick={() => { setActiveTab('customers'); setExpandedRowId(null); setSearchTerm(''); }}
            className={`pb-2 md:pb-0 text-xs font-display font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'customers' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400'
            }`}
          >
            Customers ({clients.length})
          </button>
          <button
            onClick={() => { setActiveTab('agents'); setExpandedRowId(null); setSearchTerm(''); }}
            className={`pb-2 md:pb-0 text-xs font-display font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'agents' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400'
            }`}
          >
            Sales Agents ({agents.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={activeTab === 'customers' ? "Search customers by name..." : "Search agents by name..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-light-bg border border-border-hairline rounded-sm pl-9 pr-4 py-2 text-xs outline-hidden focus:border-brand-red transition-all text-charcoal placeholder:text-neutral-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

      </div>

      {/* CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-border-hairline text-[9px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                  <th className="py-4 px-6 font-semibold">Customer</th>
                  <th className="py-4 px-6 font-semibold">Contact</th>
                  <th className="py-4 px-6 font-semibold">Assigned Sales Agent</th>
                  <th className="py-4 px-6 font-semibold">Joined Date</th>
                  <th className="py-4 px-6 font-semibold">Holds Count</th>
                  <th className="py-4 px-6 font-semibold text-right">Oversight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-xs">
                {filteredClients.map((client) => {
                  const isExpanded = expandedRowId === client.id;
                  const clientHolds = sharedReservations.filter(r => r.clientId === client.id) || [];
                  const activeHoldsCount = clientHolds.filter(r => r.status === 'Pending' || r.status === 'Confirmed').length;

                  return (
                    <React.Fragment key={client.id}>
                      <tr className="hover:bg-neutral-50/50 transition-colors">
                        {/* Identity */}
                        <td className="py-4 px-6 font-medium text-charcoal flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                            <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-display font-bold uppercase tracking-wider text-[11px] block">{client.name}</span>
                            <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider block mt-0.5">Ref: {client.id}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-6 text-neutral-500 font-mono">
                          {client.email}
                        </td>

                        {/* Assigned Agent Re-assignment Dropdown */}
                        <td className="py-4 px-6">
                          <select
                            value={client.assignedAgentId}
                            onChange={(e) => handleReassignAgent(client.id, e.target.value)}
                            className="bg-white border border-neutral-200 px-2 py-1 text-[10px] font-mono uppercase tracking-wider cursor-pointer text-neutral-700 outline-hidden focus:border-brand-red"
                          >
                            {agents.map(a => (
                              <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                          </select>
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-6 text-neutral-400 font-mono">
                          {new Date(client.joinedDate || '2024-01-01').toLocaleDateString()}
                        </td>

                        {/* Active holds count */}
                        <td className="py-4 px-6 font-mono text-neutral-500 font-bold">
                          {activeHoldsCount} Active
                        </td>

                        {/* Row actions */}
                        <td className="py-4 px-6 text-right flex items-center justify-end gap-2 h-16">
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : client.id)}
                            className="p-1.5 border border-neutral-200 text-neutral-400 hover:text-charcoal hover:bg-neutral-50 cursor-pointer flex items-center justify-center"
                            title="Inspect Buyer Profile"
                          >
                            {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleToggleCustomerStatus(client.id, client.status === 'Inactive' ? 'Inactive' : 'Active')}
                            className={`p-1.5 border cursor-pointer flex items-center justify-center ${
                              client.status === 'Inactive' 
                                ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                : 'border-neutral-200 text-green-600 hover:bg-green-50'
                            }`}
                            title={client.status === 'Inactive' ? "Activate Account" : "Suspend Account"}
                          >
                            {client.status === 'Inactive' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Detail Subview Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-neutral-50/50 p-6 border-b border-border-hairline text-left">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                              
                              {/* Contact */}
                              <div className="bg-white border border-neutral-100 p-4 rounded-xs">
                                <span className="font-display font-bold text-[9px] uppercase tracking-wider text-charcoal mb-2.5 block">Client Contact</span>
                                <div className="space-y-2 font-mono text-[9px] uppercase text-neutral-500">
                                  <div>Phone: {client.phone}</div>
                                  <div>Account Status: {client.status}</div>
                                </div>
                              </div>

                              {/* Purchase ledger */}
                              <div className="bg-white border border-neutral-100 p-4 rounded-xs">
                                <span className="font-display font-bold text-[9px] uppercase tracking-wider text-charcoal mb-2.5 block">Purchase Records</span>
                                {client.purchaseHistory?.length > 0 ? (
                                  <div className="space-y-1 font-mono text-[9px] text-neutral-600">
                                    {client.purchaseHistory.map(purId => (
                                      <div key={purId}>• Ledger Reference: {purId}</div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-neutral-400 font-mono text-[9px]">No purchases registered.</div>
                                )}
                              </div>

                              {/* Note history logs */}
                              <div className="bg-white border border-neutral-100 p-4 rounded-xs">
                                <span className="font-display font-bold text-[9px] uppercase tracking-wider text-charcoal mb-2.5 block">CRM interaction history</span>
                                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                  {sharedActivities.filter(a => a.clientId === client.id).slice(0, 3).map(act => (
                                    <div key={act.id} className="text-[10px] text-neutral-500 font-sans border-b border-neutral-50 pb-1 last:border-0">
                                      <span className="font-semibold text-charcoal block leading-snug">{act.description}</span>
                                      <span className="text-[8px] font-mono text-neutral-400 uppercase mt-0.5 block">{new Date(act.timestamp).toLocaleDateString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AGENTS TAB */}
      {activeTab === 'agents' && (
        <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-border-hairline text-[9px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                  <th className="py-4 px-6 font-semibold">Agent Name</th>
                  <th className="py-4 px-6 font-semibold">Email</th>
                  <th className="py-4 px-6 font-semibold">Assigned Leads</th>
                  <th className="py-4 px-6 font-semibold">Monthly Closed Sales</th>
                  <th className="py-4 px-6 font-semibold">Revenue Volume</th>
                  <th className="py-4 px-6 font-semibold text-right">Oversight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-xs">
                {filteredAgents.map((agent) => {
                  const isExpanded = expandedRowId === agent.id;
                  const agentClients = clients.filter(c => c.assignedAgentId === agent.id);
                  const agentHolds = sharedReservations.filter(r => r.assignedAgentId === agent.id);
                  const activeHoldsCount = agentHolds.filter(r => r.status === 'Pending' || r.status === 'Confirmed').length;

                  return (
                    <React.Fragment key={agent.id}>
                      <tr className="hover:bg-neutral-50/50 transition-colors">
                        {/* Name */}
                        <td className="py-4 px-6 font-medium text-charcoal flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                            <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-display font-bold uppercase tracking-wider text-[11px] block">{agent.name}</span>
                            <span className="text-[8px] font-mono text-neutral-400 block uppercase mt-0.5">Ref: {agent.id}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-6 text-neutral-500 font-mono">
                          {agent.email}
                        </td>

                        {/* Leads */}
                        <td className="py-4 px-6 font-mono text-neutral-500 font-bold">
                          {agentClients.length} folders
                        </td>

                        {/* Closed */}
                        <td className="py-4 px-6 font-mono text-neutral-500 text-center font-bold">
                          {agent.dealsClosedCount} closed
                        </td>

                        {/* Sales */}
                        <td className="py-4 px-6 font-display font-bold text-brand-red">
                          {agent.salesValue}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right flex items-center justify-end gap-2 h-16">
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : agent.id)}
                            className="p-1.5 border border-neutral-200 text-neutral-400 hover:text-charcoal hover:bg-neutral-50 cursor-pointer flex items-center justify-center"
                            title="Inspect Agent Pipeline"
                          >
                            {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleToggleAgentStatus(agent.id, agent.status)}
                            className={`p-1.5 border cursor-pointer flex items-center justify-center ${
                              agent.status === 'Inactive' 
                                ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                : 'border-neutral-200 text-green-600 hover:bg-green-50'
                            }`}
                            title={agent.status === 'Inactive' ? "Activate Agent" : "Suspend Agent"}
                          >
                            {agent.status === 'Inactive' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Detail Expand Subview */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-neutral-50/50 p-6 border-b border-border-hairline text-left">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                              
                              {/* Pipeline read-only metrics */}
                              <div className="bg-white border border-neutral-100 p-4 rounded-xs col-span-3">
                                <span className="font-display font-bold text-[9px] uppercase tracking-wider text-charcoal mb-4 block flex items-center gap-1.5">
                                  <Briefcase className="w-4 h-4 text-neutral-400" />
                                  <span>Active Pipeline Folders</span>
                                </span>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="p-3 bg-light-bg border border-neutral-200/50 rounded-2xs">
                                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">Active holds</span>
                                    <span className="text-md font-display font-black text-charcoal block mt-0.5">{activeHoldsCount} holds</span>
                                  </div>
                                  <div className="p-3 bg-light-bg border border-neutral-200/50 rounded-2xs">
                                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">Leads assigned</span>
                                    <span className="text-md font-display font-black text-charcoal block mt-0.5">{agentClients.length} clients</span>
                                  </div>
                                  <div className="p-3 bg-light-bg border border-neutral-200/50 rounded-2xs">
                                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">Agent Phone</span>
                                    <span className="text-xs font-mono text-neutral-600 block mt-1 truncate">{agent.phone}</span>
                                  </div>
                                  <div className="p-3 bg-light-bg border border-neutral-200/50 rounded-2xs">
                                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest block">Agent Status</span>
                                    <span className="text-xs font-mono text-green-600 font-bold block mt-1 uppercase">{agent.status}</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
