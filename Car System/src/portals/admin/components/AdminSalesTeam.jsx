import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../../components/Skeletons';
import { Plus, X, User, DollarSign, Mail, Phone, Shield } from 'lucide-react';

export default function AdminSalesTeam() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Add agent
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commission, setCommission] = useState('2.5');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchAgents = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/agents')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setAgents(json.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch agents:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAddAgent = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        status: 'active',
        role: 'Sales Agent',
        commission_rate: parseFloat(commission),
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80'
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Agent profile set up for ${name}.`);
          fetchAgents();
          setShowAddForm(false);
          setName(''); setEmail(''); setPhone('');
        }
      });
  };

  const handleToggleStatus = (agentId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    fetch(`http://localhost:5000/api/agents/${agentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          triggerToast(`Agent workspace set to ${nextStatus.toUpperCase()}`);
          fetchAgents();
        }
      });
  };

  if (isLoading) return <TableSkeleton rows={3} cols={4} />;

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
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Personnel Control</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            Sales Team Console
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddAgent} className="bg-white border border-border-hairline p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Agent Name</label>
            <input required type="text" placeholder="Sarah Connor" value={name} onChange={e => setName(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Email Address</label>
            <input required type="email" placeholder="sarah@vanguard.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Phone Number</label>
            <input type="text" placeholder="+1 (555) 019-2819" value={phone} onChange={e => setPhone(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Commission Split (%)</label>
            <input type="number" step="0.1" value={commission} onChange={e => setCommission(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2 text-xs text-charcoal focus:border-brand-red outline-hidden" />
          </div>
          <button type="submit" className="md:col-span-2 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest py-3 cursor-pointer">Register Representative</button>
        </form>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white border border-border-hairline p-5 shadow-xs flex flex-col justify-between h-48">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 border border-border-hairline shrink-0">
                <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left leading-relaxed">
                <span className="font-display font-extrabold uppercase text-[12px] block text-charcoal">{agent.name}</span>
                <span className="text-[8px] font-mono uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-xs mt-1 inline-block">
                  {agent.role}
                </span>
                <div className="mt-2 text-[9px] font-mono text-neutral-400 space-y-0.5">
                  <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{agent.email}</div>
                  {agent.phone && <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{agent.phone}</div>}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-3 flex justify-between items-center">
              <span className="text-[9px] font-mono uppercase text-neutral-400 tracking-wider">
                Split: <span className="font-bold text-charcoal">{agent.commission_rate}%</span>
              </span>
              <button
                onClick={() => handleToggleStatus(agent.id, agent.status)}
                className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-xs cursor-pointer ${
                  agent.status === 'inactive' 
                    ? 'border-red-200 text-red-600 hover:bg-red-50' 
                    : 'border-neutral-200 text-green-600 hover:bg-green-50'
                }`}
              >
                {agent.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
