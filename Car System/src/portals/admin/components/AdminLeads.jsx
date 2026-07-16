import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Plus, 
  Edit, 
  X, 
  Mail, 
  Phone, 
  FileText 
} from 'lucide-react';

export default function AdminLeads({ sharedAgents = [] }) {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState(sharedAgents);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMsg, setToastMsg] = useState('');

  // Add lead form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('website');
  const [agentId, setAgentId] = useState('');
  const [notes, setNotes] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchLeads = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/leads')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setLeads(json.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch leads from API:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
    if (sharedAgents.length === 0) {
      fetch('http://localhost:5000/api/agents')
        .then(res => res.json())
        .then(json => {
          if (json.success) setAgents(json.data);
        });
    }
  }, [sharedAgents]);

  const handleAddLead = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('vanguard_admin_token') || sessionStorage.getItem('vanguard_agent_token');

    fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        source,
        assigned_agent_id: agentId ? parseInt(agentId) : null,
        notes,
        status: 'new'
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Lead successfully generated for ${name}`);
          fetchLeads();
          setShowAddForm(false);
          setName(''); setEmail(''); setPhone(''); setNotes(''); setAgentId('');
        } else {
          triggerToast(`Error generating lead: ${json.error}`);
        }
      })
      .catch(err => triggerToast('Connection error adding lead.'));
  };

  const handleUpdateStatus = (leadId, nextStatus) => {
    const token = sessionStorage.getItem('vanguard_admin_token') || sessionStorage.getItem('vanguard_agent_token');

    fetch(`http://localhost:5000/api/leads/${leadId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Lead status updated to ${nextStatus.toUpperCase()}`);
          fetchLeads();
        }
      });
  };

  const handleReassignAgent = (leadId, newAgentId) => {
    const token = sessionStorage.getItem('vanguard_admin_token') || sessionStorage.getItem('vanguard_agent_token');

    fetch(`http://localhost:5000/api/leads/${leadId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ assigned_agent_id: newAgentId ? parseInt(newAgentId) : null })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast('Agent reassigned successfully.');
          fetchLeads();
        }
      });
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <TableSkeleton rows={5} cols={5} />;

  return (
    <div className="space-y-6 text-left">
      {toastMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center border-b border-border-hairline pb-4">
        <div>
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Customer Acquisition</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Active Leads Registry
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead</span>
        </button>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <form onSubmit={handleAddLead} className="bg-white border border-border-hairline p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Lead Name</label>
            <input required type="text" placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Email Address</label>
            <input required type="email" placeholder="john.doe@example.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Phone Number</label>
            <input type="text" placeholder="+1 (555) 019-2831" value={phone} onChange={e => setPhone(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Source</label>
            <select value={source} onChange={e => setSource(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer">
              <option value="website">Website</option>
              <option value="walk-in">Walk-in</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Assign Agent</label>
            <select value={agentId} onChange={e => setAgentId(e.target.value)} className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden cursor-pointer">
              <option value="">Unassigned</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Interaction Notes</label>
            <textarea placeholder="Specify vehicle interest or budget bounds..." value={notes} onChange={e => setNotes(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden h-20 resize-none" />
          </div>
          <button type="submit" className="md:col-span-3 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest py-3 cursor-pointer">Confirm Lead Registry</button>
        </form>
      )}

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-border-hairline p-4 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search leads name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-light-bg border border-border-hairline pl-9 pr-4 py-2 text-xs outline-hidden focus:border-brand-red"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[9px] font-mono uppercase text-neutral-400 tracking-wider font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-border-hairline px-2.5 py-1.5 text-xs outline-hidden cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="working">Working</option>
            <option value="contact_established">Contact Established</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-border-hairline shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
              <th className="py-3 px-4 font-semibold">Lead Details</th>
              <th className="py-3 px-4 font-semibold">Acquisition Source</th>
              <th className="py-3 px-4 font-semibold">Assigned Agent</th>
              <th className="py-3 px-4 font-semibold">Current Status</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-neutral-50/50">
                <td className="py-3.5 px-4 text-left">
                  <span className="font-display font-bold uppercase text-[11px] block text-charcoal">{lead.name}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-neutral-400 text-[9px] font-mono">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono uppercase text-[9px] text-neutral-500">{lead.source}</td>
                <td className="py-3.5 px-4">
                  <select
                    value={lead.assigned_agent_id || ''}
                    onChange={e => handleReassignAgent(lead.id, e.target.value)}
                    className="bg-transparent border border-neutral-200 text-xs py-1 px-2 outline-hidden cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={lead.status}
                    onChange={e => handleUpdateStatus(lead.id, e.target.value)}
                    className="bg-transparent border border-neutral-200 text-xs py-1 px-2 outline-hidden cursor-pointer font-bold uppercase text-[9px] tracking-wider"
                  >
                    <option value="new">New</option>
                    <option value="working">Working</option>
                    <option value="contact_established">Contact Established</option>
                    <option value="lost">Lost</option>
                    <option value="won">Won</option>
                  </select>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={() => {
                      if (lead.notes) alert(`Lead Notes:\n${lead.notes}`);
                      else alert('No notes registered for this lead.');
                    }}
                    className="p-1.5 text-neutral-400 hover:text-brand-red cursor-pointer"
                  >
                    <FileText className="w-4.5 h-4.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
