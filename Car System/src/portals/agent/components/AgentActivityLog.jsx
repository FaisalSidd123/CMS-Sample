import React, { useState, useEffect } from 'react';
import { useMockData } from '../../../hooks/useMockData';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  Activity, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Users, 
  Layers, 
  FileText, 
  Clock,
  MessageSquare
} from 'lucide-react';

export default function AgentActivityLog({ sharedActivities = [], onUpdateActivities }) {
  const { data: clientsList, isLoading: clientsLoading } = useMockData('clients');
  const { data: initialAct, isLoading: actLoading } = useMockData('activityLog');

  const isLoading = clientsLoading || actLoading;

  // Local synced log state
  const [logsList, setLogsList] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  // Form states
  const [selectedClient, setSelectedClient] = useState('');
  const [activityType, setActivityType] = useState('Call');
  const [description, setDescription] = useState('');

  // Filters
  const [clientFilter, setClientFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Sync initial log
  useEffect(() => {
    if (sharedActivities.length > 0) {
      setLogsList(sharedActivities);
    } else if (initialAct) {
      setLogsList(initialAct);
    }
  }, [sharedActivities, initialAct]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getActivityIcon = (type) => {
    if (type === 'Call') return <Phone className="w-4 h-4 text-blue-500 shrink-0" />;
    if (type === 'Email') return <Mail className="w-4 h-4 text-indigo-500 shrink-0" />;
    if (type === 'Meeting') return <Users className="w-4 h-4 text-purple-500 shrink-0" />;
    if (type === 'Status Change') return <Layers className="w-4 h-4 text-amber-500 shrink-0" />;
    return <FileText className="w-4 h-4 text-neutral-500 shrink-0" />;
  };

  const handleLogActivity = (e) => {
    e.preventDefault();
    if (!selectedClient || !description) return;

    const newLog = {
      id: `act-${Math.floor(800 + Math.random() * 200)}`,
      clientId: selectedClient,
      agentId: 'agent-101',
      type: activityType,
      description: description,
      timestamp: new Date().toISOString()
    };

    const updated = [newLog, ...logsList];
    setLogsList(updated);
    onUpdateActivities(updated);

    setDescription('');
    triggerToast(`Activity logged under client file.`);
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={3} />;
  }

  // Filter logs
  const filteredLogs = logsList.filter(log => {
    const matchesClient = clientFilter === 'All' || log.clientId === clientFilter;
    const matchesType = typeFilter === 'All' || log.type === typeFilter;
    return matchesClient && matchesType;
  });

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
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Interaction Logs</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          Activity Log
        </h2>
        <p className="text-[11px] text-neutral-400 font-sans mt-1">
          Chronological index of client calls, wire clearing checks, holds, and internal annotations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Log Feed */}
        <div className="lg:col-span-2 bg-white border border-border-hairline p-5 shadow-xs min-h-[400px]">
          
          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6 pb-4 border-b border-neutral-100">
            
            {/* Client Select Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Client Filter</span>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="bg-white border border-border-hairline px-2.5 py-1 text-xs text-charcoal outline-hidden cursor-pointer"
              >
                <option value="All">All Clients</option>
                {clientsList?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Type Select Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Type Filter</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-border-hairline px-2.5 py-1 text-xs text-charcoal outline-hidden cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Call">Calls</option>
                <option value="Email">Emails</option>
                <option value="Meeting">Meetings</option>
                <option value="Status Change">Status Changes</option>
                <option value="Note">Internal Notes</option>
              </select>
            </div>

          </div>

          {/* Feed List */}
          {filteredLogs.length > 0 ? (
            <div className="flex flex-col divide-y divide-neutral-100">
              {filteredLogs.map((log) => {
                const client = clientsList?.find(c => c.id === log.clientId);
                return (
                  <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 text-xs leading-relaxed">
                    
                    {/* Activity Type Icon */}
                    <div className="w-8 h-8 rounded-full bg-light-bg flex items-center justify-center border border-neutral-100 shrink-0">
                      {getActivityIcon(log.type)}
                    </div>

                    <div className="flex-1 flex flex-col text-left">
                      <div className="flex justify-between items-baseline gap-4">
                        <span className="font-display font-bold uppercase tracking-wider text-[11px] text-charcoal">
                          {client?.name || 'Vanguard Administration'}
                        </span>
                        <span className="font-mono text-[8px] text-neutral-400 uppercase">
                          {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-500 font-sans mt-1">{log.description}</p>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-400 text-xs font-sans">
              No matching activity records logged in workspace.
            </div>
          )}

        </div>

        {/* Right Column: Log Activity Form */}
        <div className="bg-white border border-border-hairline p-5 shadow-xs">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
            Log New Activity Node
          </span>

          <form onSubmit={handleLogActivity} className="space-y-4">
            
            {/* Select Client */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Client Folder</label>
              <select
                required
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="">-- Choose Client --</option>
                {clientsList?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Select Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Activity Type</label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
              >
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Meeting">Meeting</option>
                <option value="Note">Internal Note</option>
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Description Log</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Log details: call summary, email inquiries, specific request notes..."
                className="bg-white border border-border-hairline p-3 text-xs text-charcoal outline-hidden focus:border-brand-red transition-all resize-none placeholder:text-neutral-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-charcoal hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Activity</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
