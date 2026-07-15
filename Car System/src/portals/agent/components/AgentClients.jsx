import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMockData } from '../../../hooks/useMockData';
import { TableSkeleton } from '../../../components/Skeletons';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Mail, 
  Phone, 
  FileText, 
  Car, 
  History, 
  Plus, 
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function AgentClients() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load clients, reservations, vehicles, and activity logs
  const { data: initialClients, isLoading: clientsLoading } = useMockData('clients');
  const { data: initialReservations, isLoading: resLoading } = useMockData('reservations');
  const { data: initialVehicles, isLoading: vehiclesLoading } = useMockData('vehicles');
  const { data: initialActivities, isLoading: actLoading } = useMockData('activityLog');

  const isLoading = clientsLoading || resLoading || vehiclesLoading || actLoading;

  // Local states to handle live additions
  const [clientsList, setClientsList] = useState([]);
  const [activities, setActivities] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('notes');
  const [toastMsg, setToastMsg] = useState('');

  // Sync state with source mock data
  useEffect(() => {
    if (initialClients) setClientsList(initialClients);
    if (initialActivities) setActivities(initialActivities);
  }, [initialClients, initialActivities]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote = {
      id: `act-${Math.floor(300 + Math.random() * 700)}`,
      clientId: id,
      agentId: 'agent-101',
      type: 'Note',
      description: noteText,
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [newNote, ...prev]);
    setNoteText('');
    setToastMsg('Internal CRM note logged.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getStatusColor = (status) => {
    if (status === 'Active Lead') return 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'In Progress') return 'bg-blue-50 text-blue-600 border-blue-200';
    return 'bg-green-50 text-green-600 border-green-200';
  };

  // 1. CLIENT DETAIL VIEW
  if (id) {
    if (isLoading) {
      return <TableSkeleton rows={4} cols={3} />;
    }

    const client = clientsList.find(c => c.id === id);
    if (!client) {
      return (
        <div className="border border-border-hairline bg-white p-12 text-center text-neutral-400 font-sans text-xs">
          <AlertCircle className="w-8 h-8 text-brand-red mx-auto mb-3" />
          <span>Client record not found.</span>
          <Link to="/agent/clients" className="block text-brand-red font-semibold hover:underline mt-4">
            Return to Leads Catalog
          </Link>
        </div>
      );
    }

    // Filter holds, purchases, and logs belonging to this client
    const clientReservations = initialReservations?.filter(r => r.clientId === id) || [];
    const clientActivities = activities.filter(a => a.clientId === id);
    const clientNotes = clientActivities.filter(a => a.type === 'Note');

    return (
      <div className="space-y-8 text-left relative">
        {toastMsg && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl">
            {toastMsg}
          </div>
        )}

        {/* Back link */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/agent/clients')}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-brand-red transition-colors font-mono uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Clients</span>
          </button>
        </div>

        {/* Client identity banner */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white border border-border-hairline p-6 gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
              <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-md uppercase text-charcoal">{client.name}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                <span>Ref: {client.id}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 border rounded-xs ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/agent/reserve"
              state={{ preselectedClientId: client.id }}
              className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors"
            >
              Reserve Vehicle
            </Link>
            <Link
              to="/agent/documents"
              state={{ preselectedClientId: client.id, requestInvoice: true }}
              className="border border-neutral-200 hover:border-charcoal hover:bg-neutral-50 text-charcoal text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors"
            >
              Request Invoice
            </Link>
          </div>
        </div>

        {/* Content Tabs & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left panel tabs: Hold history & purchase lists */}
          <div className="lg:col-span-2 bg-white border border-border-hairline p-6 shadow-xs min-h-[300px]">
            
            {/* Tabs toggle */}
            <div className="flex border-b border-neutral-100 mb-6 gap-6 select-none">
              <button
                onClick={() => setActiveTab('reservations')}
                className={`pb-3 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'reservations' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
                }`}
              >
                Holds ({clientReservations.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'history' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
                }`}
              >
                Purchase History ({client.purchaseHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'notes' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
                }`}
              >
                CRM Notes ({clientNotes.length})
              </button>
            </div>

            {/* TAB: Reservations */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {clientReservations.length > 0 ? (
                  clientReservations.map(res => {
                    const vehicle = initialVehicles?.find(v => v.id === res.vehicleId);
                    return (
                      <div key={res.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-neutral-100 gap-4">
                        <div className="flex items-center gap-3">
                          <Car className="w-5 h-5 text-neutral-400" />
                          <div className="text-left">
                            <span className="font-display font-bold text-xs uppercase text-charcoal">{vehicle?.model}</span>
                            <span className="text-[9px] font-mono text-neutral-400 block uppercase mt-0.5">Hold ID: {res.id}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right font-mono text-[9px] uppercase tracking-wider">
                          <span className="text-neutral-400 block">Expiry Date</span>
                          <span className="text-charcoal font-bold">{new Date(res.holdExpiresAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-neutral-400 text-xs font-sans">No holds found for this lead.</div>
                )}
              </div>
            )}

            {/* TAB: Purchase History */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {client.purchaseHistory.length > 0 ? (
                  client.purchaseHistory.map(purId => {
                    return (
                      <div key={purId} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-neutral-100 gap-4">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-green-600" />
                          <div className="text-left">
                            <span className="font-display font-bold text-xs uppercase text-charcoal">Acquisition ID: {purId}</span>
                            <span className="text-[9px] font-mono text-neutral-400 block uppercase mt-0.5">Ledger complete</span>
                          </div>
                        </div>
                        <Link 
                          to="/agent/documents"
                          className="text-[9px] font-mono text-brand-red uppercase font-bold hover:underline"
                        >
                          Invoice Log
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-neutral-400 text-xs font-sans">No completed purchases.</div>
                )}
              </div>
            )}

            {/* TAB: CRM Notes list */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                {clientNotes.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {clientNotes.map(note => (
                      <div key={note.id} className="p-4 bg-light-bg border border-neutral-100 rounded-xs">
                        <div className="flex justify-between items-center mb-2 border-b border-neutral-200/50 pb-1.5 font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                          <span className="font-bold text-charcoal">Sarah Connor</span>
                          <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed font-sans">{note.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-400 text-xs font-sans">No notes logged yet.</div>
                )}
              </div>
            )}

          </div>

          {/* Right panel side-cards: Contact & Add Note Form */}
          <div className="space-y-6">
            
            {/* Contact details */}
            <div className="bg-white border border-border-hairline p-5 shadow-xs text-xs">
              <span className="font-display font-bold uppercase tracking-wider text-charcoal mb-4 block">
                Contact Parameters
              </span>
              <div className="space-y-4 font-mono text-[10px] uppercase text-neutral-500 tracking-wider">
                <a href={`mailto:${client.email}`} className="flex items-center gap-2.5 hover:text-brand-red transition-colors pb-2.5 border-b border-neutral-100">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>{client.email}</span>
                </a>
                <div className="flex items-center gap-2.5 pt-1.5 pb-1">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>

            {/* Add note Form */}
            <div className="bg-white border border-border-hairline p-5 shadow-xs">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block">
                Log Internal CRM Remark
              </span>

              <form onSubmit={handleAddNote} className="space-y-4">
                <textarea
                  required
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record customer preferences, options requests, or meeting summaries..."
                  className="w-full bg-light-bg border border-border-hairline p-3 text-xs text-charcoal outline-hidden focus:border-brand-red transition-all resize-none placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  className="w-full bg-charcoal hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Note</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // 2. CLIENTS LIST VIEW
  const filteredClients = clientsList.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || client.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// CRM Registry</span>
        <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
          My Clients
        </h2>
        <p className="text-[11px] text-neutral-400 font-sans mt-1">
          Search and query customer files and operations logs assigned to you.
        </p>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-border-hairline p-4 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search clients by name or reference ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-light-bg border border-border-hairline rounded-sm pl-9 pr-4 py-2.5 text-xs outline-hidden focus:border-brand-red transition-all text-charcoal placeholder:text-neutral-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {['All', 'Active Lead', 'In Progress', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-brand-red border-brand-red text-white shadow-xs'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Clients Table List */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : filteredClients.length > 0 ? (
        <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-border-hairline text-[9px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                  <th className="py-4 px-6 font-semibold">Client Name</th>
                  <th className="py-4 px-6 font-semibold">Contact Email</th>
                  <th className="py-4 px-6 font-semibold">Hold count</th>
                  <th className="py-4 px-6 font-semibold">Last Interaction</th>
                  <th className="py-4 px-6 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-xs">
                {filteredClients.map((client) => {
                  const clientReservations = initialReservations?.filter(r => r.clientId === client.id) || [];
                  return (
                    <tr 
                      key={client.id} 
                      onClick={() => navigate(`/agent/clients/${client.id}`)}
                      className="hover:bg-neutral-50/50 transition-colors cursor-pointer"
                    >
                      {/* Name */}
                      <td className="py-4 px-6 font-medium text-charcoal flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-display font-bold uppercase tracking-wider text-[11px]">
                            {client.name}
                          </span>
                          <span className="text-[8px] font-mono text-neutral-400 block uppercase mt-0.5">Ref: {client.id}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-neutral-500 font-mono">
                        {client.email}
                      </td>

                      {/* Active hold count */}
                      <td className="py-4 px-6 font-mono text-neutral-400 font-bold">
                        {clientReservations.length} active
                      </td>

                      {/* Last Activity */}
                      <td className="py-4 px-6 text-neutral-400 font-mono">
                        {new Date(client.lastActivityDate).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-right">
                        <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-xs ${
                          getStatusColor(client.status)
                        }`}>
                          {client.status}
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
        <div className="border border-border-hairline bg-white p-16 text-center text-neutral-400 font-sans text-xs">
          No assigned clients match your search criteria.
        </div>
      )}

    </div>
  );
}
