import React, { useState, useEffect } from 'react';
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

export default function AdminShell({ 
  children, 
  activeTab, 
  onTabChange,
  inventoryFilter = 'all',
  onFilterChange
}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Real-time counts
  const [totalCars, setTotalCars] = useState(0);
  const [availableCars, setAvailableCars] = useState(0);
  const [reservedCars, setReservedCars] = useState(0);
  const [soldCars, setSoldCars] = useState(0);

  const activeAdmin = adminUsers[0]; // Chief Executive Operator

  const fetchCounts = () => {
    fetch(window.API_BASE_URL + '/vehicles')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          const list = json.data;
          setTotalCars(list.length);
          setAvailableCars(list.filter(v => v.status === 'available').length);
          setReservedCars(list.filter(v => v.status === 'reserved').length);
          setSoldCars(list.filter(v => v.status === 'sold').length);
        }
      })
      .catch(err => console.error('Failed to get real sidebar stats:', err));
  };

  useEffect(() => {
    fetchCounts();
    // Refresh counts every 10 seconds to keep counts in sync
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Dashboard', id: 'dashboard', icon: Sliders },
    { label: 'Inventory', id: 'inventory', icon: Car, hasSubmenu: true },
    { label: 'Leads', id: 'leads', icon: Users, badge: 9 },
    { label: 'Reservations', id: 'reservations', icon: CalendarRange },
    { label: 'Payments', id: 'payments', icon: DollarSign, badge: 6 },
    { label: 'Service', id: 'service', icon: Wrench, badge: 6 },
    { label: 'Sales Team', id: 'salesteam', icon: UserCheck },
    { label: 'Documents', id: 'documents', icon: FolderOpen }
  ];

  const getHeaderTitle = () => {
    const current = navItems.find(item => item.id === activeTab);
    return current ? current.label : 'Master Admin Console';
  };

  const handleSubfilterSelect = (filterVal) => {
    onTabChange('inventory');
    if (onFilterChange) {
      onFilterChange(filterVal);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg flex flex-col md:flex-row text-charcoal w-full">
      
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
                  onClick={() => {
                    onTabChange(item.id);
                    if (item.id === 'inventory' && onFilterChange) {
                      onFilterChange('all'); // default to all when inventory is clicked directly
                    }
                  }}
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
                  {item.badge !== undefined && item.id !== 'inventory' && (
                    <span className="text-[9px] font-mono bg-white/10 text-slate-300 px-1.5 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Submenu for Inventory items */}
                {item.id === 'inventory' && activeTab === 'inventory' && (
                  <div className="pl-6 pr-2 py-2 flex flex-col gap-1.5 border-l border-slate-800 bg-black/10 select-none text-[9px] font-mono text-slate-400 uppercase">
                    
                    <button 
                      onClick={() => handleSubfilterSelect('all')}
                      className={`flex justify-between items-center py-1 w-full text-left transition-colors cursor-pointer ${inventoryFilter === 'all' ? 'text-white font-bold' : 'hover:text-white'}`}
                    >
                      <span>All Vehicles</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">{totalCars}</span>
                    </button>

                    <button 
                      onClick={() => handleSubfilterSelect('available')}
                      className={`flex justify-between items-center py-1 w-full text-left transition-colors cursor-pointer ${inventoryFilter === 'available' ? 'text-white font-bold' : 'hover:text-white'}`}
                    >
                      <span>Available</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">{availableCars}</span>
                    </button>

                    <button 
                      onClick={() => handleSubfilterSelect('reserved')}
                      className={`flex justify-between items-center py-1 w-full text-left transition-colors cursor-pointer ${inventoryFilter === 'reserved' ? 'text-white font-bold' : 'hover:text-white'}`}
                    >
                      <span>Reserved</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">{reservedCars}</span>
                    </button>

                    <button 
                      onClick={() => handleSubfilterSelect('sold')}
                      className={`flex justify-between items-center py-1 w-full text-left transition-colors cursor-pointer ${inventoryFilter === 'sold' ? 'text-white font-bold' : 'hover:text-white'}`}
                    >
                      <span>Sold</span>
                      <span className="bg-slate-800 text-slate-400 px-1 rounded-sm">{soldCars}</span>
                    </button>

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
      <header className="md:hidden bg-[#0F172A] text-white h-16 px-6 flex justify-between items-center border-b border-slate-800 shrink-0 relative z-30 w-full">
        <Link to="/" className="flex items-center gap-1 font-display font-extrabold tracking-widest text-xs uppercase">
          <span>Vanguard</span>
          <span className="text-brand-red">Master</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#0F172A] border-b border-slate-800 p-6 flex flex-col gap-4 z-20 text-left">
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    onTabChange(item.id);
                    if (item.id === 'inventory' && onFilterChange) {
                      onFilterChange('all');
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between
                    ${activeTab === item.id ? 'text-brand-red' : 'text-slate-300'}
                  `}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.id !== 'inventory' && (
                    <span className="text-[8px] font-mono bg-white/10 text-slate-300 px-1.5 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Submenu on mobile */}
                {item.id === 'inventory' && activeTab === 'inventory' && (
                  <div className="pl-6 py-2 flex flex-col gap-2 border-l border-slate-800 bg-black/10 text-[9px] font-mono text-slate-400 uppercase">
                    <button onClick={() => { handleSubfilterSelect('all'); setMobileMenuOpen(false); }} className={`w-full text-left py-0.5 ${inventoryFilter === 'all' ? 'text-white font-bold' : ''}`}>
                      All Vehicles ({totalCars})
                    </button>
                    <button onClick={() => { handleSubfilterSelect('available'); setMobileMenuOpen(false); }} className={`w-full text-left py-0.5 ${inventoryFilter === 'available' ? 'text-white font-bold' : ''}`}>
                      Available ({availableCars})
                    </button>
                    <button onClick={() => { handleSubfilterSelect('reserved'); setMobileMenuOpen(false); }} className={`w-full text-left py-0.5 ${inventoryFilter === 'reserved' ? 'text-white font-bold' : ''}`}>
                      Reserved ({reservedCars})
                    </button>
                    <button onClick={() => { handleSubfilterSelect('sold'); setMobileMenuOpen(false); }} className={`w-full text-left py-0.5 ${inventoryFilter === 'sold' ? 'text-white font-bold' : ''}`}>
                      Sold ({soldCars})
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button 
              onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              className="text-left py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white mt-4 border-t border-slate-800 pt-4 flex items-center gap-3"
            >
              <LogOut className="w-4 h-4 text-brand-red" />
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-full">
        {children}
      </main>

    </div>
  );
}
