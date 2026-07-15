import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  GitBranch, 
  FileCheck, 
  Activity, 
  LogOut, 
  AlertTriangle,
  Menu,
  X,
  User
} from 'lucide-react';
import { mockCurrentAgent } from '../../../data/agents';
import { reservations } from '../../../data/reservations';

export default function AgentShell({ children, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor hold urgencies for the header notification warning
  const expiringSoonCount = reservations.filter(r => {
    if (r.status !== 'Pending' && r.status !== 'Confirmed') return false;
    const hoursLeft = (new Date(r.holdExpiresAt) - new Date()) / (1000 * 60 * 60);
    return hoursLeft > 0 && hoursLeft < 6;
  }).length;

  const navItems = [
    { label: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { label: 'My Clients', id: 'clients', icon: Users },
    { label: 'Reservations', id: 'reservations', icon: CalendarRange },
    { label: 'Deal Pipeline', id: 'pipeline', icon: GitBranch },
    { label: 'Documents & Invoices', id: 'documents', icon: FileCheck },
    { label: 'Activity Log', id: 'activity', icon: Activity }
  ];

  const getHeaderTitle = () => {
    const current = navItems.find(item => item.id === activeTab);
    return current ? current.label : 'Agent Console';
  };

  return (
    <div className="min-h-screen bg-light-bg flex flex-col md:flex-row text-charcoal">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-charcoal text-white shrink-0 p-5 border-r border-neutral-800">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 font-display font-extrabold tracking-widest text-xs uppercase mb-8 pb-3 border-b border-white/5">
            <span>Vanguard</span>
            <span className="text-brand-red font-semibold">Console</span>
          </Link>

          {/* User profile capsule in sidebar */}
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xs mb-8">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
              <img
                src={mockCurrentAgent.avatarUrl}
                alt={mockCurrentAgent.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left leading-tight truncate">
              <h4 className="text-[11px] font-display font-bold uppercase text-white">{mockCurrentAgent.name}</h4>
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block truncate">{mockCurrentAgent.email}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 w-full text-left cursor-pointer
                  ${activeTab === item.id 
                    ? 'bg-brand-red text-white' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer links */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
          {expiringSoonCount > 0 && (
            <button 
              onClick={() => onTabChange('reservations')} 
              className="flex items-center gap-2 px-3 py-2 text-[9px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 w-full text-left cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{expiringSoonCount} Hold expiring soon</span>
            </button>
          )}

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 px-3 py-2 text-[10px] text-neutral-400 hover:text-white transition-colors uppercase font-mono tracking-widest cursor-pointer text-left w-full"
          >
            <LogOut className="w-4.5 h-4.5 text-brand-red" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER BAR */}
      <header className="md:hidden bg-charcoal text-white h-16 px-6 flex justify-between items-center border-b border-neutral-800 shrink-0 relative z-30">
        <Link to="/" className="flex items-center gap-1 font-display font-extrabold tracking-widest text-xs uppercase">
          <span>Vanguard</span>
          <span className="text-brand-red">Console</span>
        </Link>

        <div className="flex items-center gap-4">
          {expiringSoonCount > 0 && (
            <button onClick={() => onTabChange('reservations')} className="text-amber-400 relative cursor-pointer">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </button>
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-brand-red cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 3. MOBILE MENU DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed top-16 left-0 w-full bg-charcoal text-white border-b border-neutral-800 z-20 md:hidden p-6 flex flex-col gap-4 text-left">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors w-full text-left cursor-pointer
                  ${activeTab === item.id ? 'text-brand-red bg-white/5 border-l-2 border-brand-red' : 'text-neutral-400'}
                `}
              >
                <item.icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="h-[1px] bg-white/5 my-2" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 text-[10px] text-neutral-400 hover:text-white uppercase font-mono tracking-widest cursor-pointer text-left"
            >
              <LogOut className="w-4.5 h-4.5 text-brand-red" />
              <span>Sign Out</span>
            </button>
          </nav>
        </>
      )}

      {/* 4. MAIN APP CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Header bar (compact styling) */}
        <header className="hidden md:flex bg-white border-b border-border-hairline h-14 px-8 justify-between items-center relative z-10 shrink-0">
          <h1 className="font-display font-extrabold text-[11px] uppercase tracking-wider text-charcoal flex items-center gap-2">
            <span>{getHeaderTitle()}</span>
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Sarah Connor (Console Session active)</span>
            </div>
          </div>
        </header>

        {/* Content Body Pane (Dense CRM layout) */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </div>

      </main>

    </div>
  );
}
