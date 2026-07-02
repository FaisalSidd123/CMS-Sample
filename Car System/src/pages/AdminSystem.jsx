import React, { useState, useEffect } from 'react';
import { useMockData } from '../hooks/useMockData';
import { TableSkeleton } from '../components/Skeletons';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Sliders, 
  Search, 
  SlidersHorizontal,
  History
} from 'lucide-react';

export default function AdminSystem({ sharedAudit = [], onUpdateAudit }) {
  const { data: initialAdmins, isLoading: adminsLoading } = useMockData('adminUsers');
  const { data: initialAudits, isLoading: auditsLoading } = useMockData('adminAuditLog');

  const isLoading = adminsLoading || auditsLoading;

  // Local synced states
  const [admins, setAdmins] = useState([]);
  const [audits, setAudits] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  // Form to add admin user
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Support');

  // Filters
  const [adminFilter, setAdminFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  // Sync initial mock sets
  useEffect(() => {
    if (initialAdmins) setAdmins(initialAdmins);
  }, [initialAdmins]);

  useEffect(() => {
    if (sharedAudit.length > 0) {
      setAudits(sharedAudit);
    } else if (initialAudits) {
      setAudits(initialAudits);
    }
  }, [sharedAudit, initialAudits]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Toggle checkbox permission matrices
  const handleTogglePermission = (adminId, moduleKey) => {
    const updated = admins.map(adm => {
      if (adm.id === adminId) {
        return {
          ...adm,
          permissions: {
            ...adm.permissions,
            [moduleKey]: !adm.permissions[moduleKey]
          }
        };
      }
      return adm;
    });

    setAdmins(updated);
    triggerToast(`Modified ${moduleKey} permission flag.`);
  };

  // Toggle user status
  const handleToggleStatus = (adminId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updated = admins.map(adm => adm.id === adminId ? { ...adm, status: nextStatus } : adm);
    setAdmins(updated);
    triggerToast(`Admin access set to: ${nextStatus}`);
  };

  // Add new admin user
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const newAdmin = {
      id: `adm-${Math.floor(10 + Math.random() * 90)}`,
      name,
      email,
      role,
      status: 'Active',
      joinedDate: new Date().toISOString(),
      permissions: {
        inventory: role === 'Super Admin' || role === 'Manager',
        customers: true,
        transactions: role === 'Super Admin' || role === 'Manager',
        documents: true,
        reports: role === 'Super Admin'
      }
    };

    setAdmins([...admins, newAdmin]);
    setShowAddForm(false);
    setName('');
    setEmail('');
    triggerToast(`Created administrative console role: ${name}.`);
  };

  if (isLoading) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  // Filter audit logs
  const filteredAudits = audits.filter(log => {
    const matchesAdmin = adminFilter === 'All' || log.adminId === adminFilter;
    const matchesAction = actionFilter === 'All' || log.actionTaken === actionFilter;
    return matchesAdmin && matchesAction;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-hairline pb-4">
        <div>
          <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block mb-0.5">// Roles Oversight</span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-charcoal uppercase leading-none">
            System & Roles
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Manage admin users, configure permission matrices, and audit system action trails.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer border border-slate-800"
        >
          <Plus className="w-4 h-4 text-brand-red" />
          <span>New User</span>
        </button>
      </div>

      {/* Add Admin form */}
      {showAddForm && (
        <div className="bg-white border border-border-hairline p-6 shadow-md max-w-xl">
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">User Name</label>
              <input required type="text" placeholder="e.g. Robert Vance" value={name} onChange={(e) => setName(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Email Address</label>
              <input required type="email" placeholder="robert.vance@vanguard.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-light-bg border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">System Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-white border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer">
                <option value="Super Admin">Super Admin</option>
                <option value="Manager">Manager</option>
                <option value="Support">Support specialist</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-widest py-3 cursor-pointer transition-colors shadow-xs">
              Confirm role creation
            </button>
          </form>
        </div>
      )}

      {/* System Admin Users Roster & Permission Matrices */}
      <div className="bg-white border border-border-hairline p-5 shadow-xs text-left">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block flex items-center gap-1.5">
          <ShieldCheck className="w-4.5 h-4.5 text-neutral-400" />
          <span>Console Admin Users & Permission Matrix</span>
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-border-hairline text-[8px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                <th className="py-3 px-4 font-semibold">Admin User</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 text-center font-semibold">Inventory</th>
                <th className="py-3 px-4 text-center font-semibold">Customers</th>
                <th className="py-3 px-4 text-center font-semibold">Transactions</th>
                <th className="py-3 px-4 text-center font-semibold">Documents</th>
                <th className="py-3 px-4 text-center font-semibold">Reports</th>
                <th className="py-3 px-4 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-neutral-50/50">
                  {/* Identity */}
                  <td className="py-4 px-4 font-display font-bold uppercase text-[11px] text-charcoal">
                    {adm.name}
                    <span className="text-[8px] font-mono text-neutral-400 block uppercase mt-0.5">{adm.email}</span>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4 font-mono text-neutral-500 uppercase text-[9px] font-bold">
                    {adm.role}
                  </td>

                  {/* Permissions checkboxes */}
                  {['inventory', 'customers', 'transactions', 'documents', 'reports'].map((moduleKey) => (
                    <td key={moduleKey} className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={adm.permissions[moduleKey]}
                        onChange={() => handleTogglePermission(adm.id, moduleKey)}
                        disabled={adm.role === 'Super Admin'} // Super admins always have full access
                        className="w-3.5 h-3.5 border-neutral-300 focus:ring-0 cursor-pointer accent-brand-red"
                      />
                    </td>
                  ))}

                  {/* Status Toggle */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(adm.id, adm.status)}
                      disabled={adm.id === 'adm-01'} // CEO cannot be deactivated
                      className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded-xs cursor-pointer ${
                        adm.status === 'Inactive' 
                          ? 'border-red-200 text-red-600 hover:bg-red-50' 
                          : 'border-neutral-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {adm.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trails log */}
      <div className="bg-white border border-border-hairline p-5 shadow-xs text-left">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-4 block flex items-center gap-1.5">
          <History className="w-4.5 h-4.5 text-neutral-400" />
          <span>System Audit Trail Log</span>
        </span>

        {/* Audit filters */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6 pb-4 border-b border-neutral-100">
          
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Admin Filter</span>
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="bg-white border border-neutral-200 px-2.5 py-1 text-xs outline-hidden cursor-pointer"
            >
              <option value="All">All Admins</option>
              <option value="adm-01">CEO</option>
              <option value="adm-02">Robert Vance</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Action Filter</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-white border border-neutral-200 px-2.5 py-1 text-xs outline-hidden cursor-pointer"
            >
              <option value="All">All Actions</option>
              <option value="Role Permission Update">Permission Updates</option>
              <option value="Customer Reassigned">Reassignments</option>
              <option value="Inventory Created">Inventory CRUD</option>
              <option value="Approved Invoice Request">Approvals</option>
            </select>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                <th className="pb-3 px-2 font-semibold">Admin Account</th>
                <th className="pb-3 px-2 font-semibold">Action Vector</th>
                <th className="pb-3 px-2 font-semibold">Description Log</th>
                <th className="pb-3 px-2 text-right font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map(log => (
                <tr key={log.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                  <td className="py-3 px-2 font-display font-bold uppercase text-[11px] text-charcoal">{log.adminName}</td>
                  <td className="py-3 px-2 text-neutral-400 font-mono uppercase text-[9px]">{log.actionTaken}</td>
                  <td className="py-3 px-2 text-neutral-600 font-sans max-w-sm truncate">{log.target}</td>
                  <td className="py-3 px-2 text-right font-mono text-neutral-400">
                    {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
