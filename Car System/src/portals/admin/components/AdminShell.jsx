import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Car, 
  Users, 
  DollarSign, 
  FolderOpen, 
  FileSpreadsheet, 
  Sliders, 
  LogOut, 
  Menu, 
  X,
  UserCheck,
  UploadCloud,
  Wrench,
  CalendarRange
} from 'lucide-react';
import { adminUsers } from '../../../data/adminUsers';

export default function AdminShell({ children, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAdmin = adminUsers[0]; // Chief Executive Operator

  const navItems = [
    { label: 'Dashboard', id: 'dashboard', icon: Sliders },
    { label: 'Inventory', id: 'inventory', icon: Car, hasSubmenu: true },
    { label: 'Leads', id: 'leads', icon: Users, badge: 9 },
    { label: 'Reservations', id: 'reservations', icon: CalendarRange },
    { label: 'Imports', id: 'imports', icon: UploadCloud, badge: 7 },
    { label: 'Payments', id: 'payments', icon: DollarSign, badge: 6 },
    { label: 'Service', id: 'service', icon: Wrench, badge: 6 },
    { label: 'Sales Team', id: 'salesteam', icon: UserCheck },
    { label: 'Documents', id: 'documents', icon: FolderOpen }
  ];

  const getHeaderTitle = () => {
    const current = navItems.find(item => item.id === activeTab);
    return current ? current.label : 'Master Admin Console';
  };

  return (
    <div className="min-h-screen bg-light-bg flex flex-col md:flex-row text-charcoal">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-[#0F172A] text-white shrink-0 p-5 border-r border-slate-800">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 font-display font-extrabold tracking-widest text-xs uppercase mb-8 pb-3 border-b border-slate-800">
            <span>Vanguard</span>
            <span className="text-brand-red font-semibold">Master</span>
          </Link>

          {/* Admin profile card */}
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xs mb-8">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center text-white">
              <UserCheck className="w-4 h-4 text-brand-red" />
            </div>
            <div className="text-left leading-tight truncate">
              <h4 className="text-[10px] font-display font-bold uppercase text-white truncate">{activeAdmin.name}</h4>
              <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider block truncate">{activeAdmin.role}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.id} className="w-full">
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`
                    flex items-center justify-between px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 w-full cursor-pointer
                    ${activeTab === item.id 
                      ? 'bg-brand-red text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4.5 h-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[9px] font-mono bg-white/10 text-slate-300 px-1.5 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Submenu for Inventory items */}
                {item.id === 'inventory' && activeTab === 'inventory' && (
                  <div className="pl-6 pr-2 py-2 flex flex-col gap-1.5 border-l border-slate-800 bg-black/10 select-none text-[9px] font-mono text-slate-400 uppercase">
                    <div className="flex justify-between items-center py-0.5">
                      <span>All Vehicles</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">25</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span>Available</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">14</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span>Reserved</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">5</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span>Sold</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">6</span>
                    </div>
                    <div className="py-0.5 hover:text-white cursor-pointer">
                      <span>Reporting</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 px-3 py-2 text-[10px] text-slate-400 hover:text-white transition-colors uppercase font-mono tracking-widest cursor-pointer text-left w-full"
          >
            <LogOut className="w-4.5 h-4.5 text-brand-red" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER BAR */}
      <header className="md:hidden bg-[#0F172A] text-white h-16 px-6 flex justify-between items-center border-b border-slate-800 shrink-0 relative z-30">
        <Link to="/" className="flex items-center gap-1 font-display font-extrabold tracking-widest text-xs uppercase">
          <span>Vanguard</span>
          <span className="text-brand-red">Master</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-brand-red cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 3. MOBILE MENU DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed top-16 left-0 w-full bg-[#0F172A] text-white border-b border-slate-800 z-20 md:hidden p-6 flex flex-col gap-4 text-left">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors w-full text-left cursor-pointer
                  ${activeTab === item.id ? 'text-brand-red bg-white/5 border-l-2 border-brand-red' : 'text-slate-400'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[9px] font-mono bg-white/10 text-slate-300 px-1.5 py-0.5 rounded-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <div className="h-[1px] bg-slate-800 my-2" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 text-[10px] text-slate-400 hover:text-white uppercase font-mono tracking-widest cursor-pointer text-left"
            >
              <LogOut className="w-4.5 h-4.5 text-brand-red" />
              <span>Sign Out</span>
            </button>
          </nav>
        </>
      )}


      {/* 4. MAIN APP CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Header bar */}
        <header className="hidden md:flex bg-white border-b border-border-hairline h-14 px-8 justify-between items-center relative z-10 shrink-0">
          <h1 className="font-display font-extrabold text-[11px] uppercase tracking-wider text-charcoal">
            {getHeaderTitle()}
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span>CEO Session active (Oversight mode)</span>
            </div>
          </div>
        </header>

        {/* Content Body Pane */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </div>

      </main>

    </div>
  );
}
