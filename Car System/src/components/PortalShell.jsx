import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  FileText,
  History,
  Heart,
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X,

} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function PortalShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Notification local state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Escrow payment verified for Mercedes-Benz GLE.', time: '2h ago', unread: true },
    { id: 2, text: 'Bill of Lading document generated for ord-3029.', time: '1d ago', unread: false },
    { id: 3, text: 'Vanguard registration parameters established.', time: '3d ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const navItems = [
    { label: 'My Dashboard', path: '/portal', icon: LayoutDashboard },
    { label: 'My Orders', path: '/portal/orders', icon: Car },
    { label: 'Documents', path: '/portal/documents', icon: FileText },
    { label: 'Purchase History', path: '/portal/purchases', icon: History },
    { label: 'Wishlist', path: '/portal/wishlist', icon: Heart },
    { label: 'Profile Settings', path: '/portal/profile', icon: User }
  ];

  // Helper to determine active route header title
  const getHeaderTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    if (current) return current.label;
    if (location.pathname.startsWith('/portal/orders/')) return 'Order Details';
    return 'Customer Workspace';
  };

  return (
    <div className="min-h-screen bg-light-bg flex flex-col md:flex-row text-charcoal">

      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-charcoal text-white shrink-0 p-6 border-r border-neutral-800">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 font-display font-extrabold tracking-widest text-md uppercase mb-10 pb-4 border-b border-white/5">
            <span>Vanguard</span>
            <span className="text-brand-red">Motors</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/portal'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200
                  ${isActive
                    ? 'bg-brand-red text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
          {/* Browse Inventory Link back to landing page */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 border border-white/20 hover:border-brand-red hover:bg-brand-red/10 text-white text-[10px] font-mono uppercase tracking-widest py-3 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Inventory</span>
          </Link>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors uppercase font-mono tracking-widest cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-brand-red" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">

        {/* Top Header */}
        <header className="bg-white border-b border-border-hairline h-16 px-6 md:px-10 flex justify-between items-center relative z-30">

          {/* Header Left Title */}
          <h1 className="font-display font-extrabold text-sm md:text-md uppercase tracking-wider text-charcoal">
            {getHeaderTitle()}
          </h1>

          {/* Header Right Actions */}
          <div className="flex items-center gap-6">

            {/* Search bar mockup */}
            <div className="relative hidden lg:block w-64">
              <input
                type="text"
                placeholder="Search portal logs..."
                className="w-full bg-light-bg border border-border-hairline rounded-sm pl-9 pr-4 py-1.5 text-xs outline-hidden focus:border-brand-red transition-all"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 text-neutral-500 hover:text-brand-red relative transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-red animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-red flex items-center justify-center text-[7px] text-white font-bold font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-border-hairline shadow-2xl z-50 p-4 text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-border-hairline mb-3">
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[9px] font-mono text-brand-red uppercase tracking-wider hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => toggleRead(n.id)}
                            className={`p-2.5 border-l-2 transition-colors cursor-pointer flex flex-col gap-1 ${n.unread
                              ? 'bg-brand-red/5 border-l-brand-red'
                              : 'bg-transparent border-l-neutral-200 hover:bg-neutral-50'
                              }`}
                          >
                            <span className={`text-[11px] leading-relaxed ${n.unread ? 'text-charcoal font-semibold' : 'text-neutral-500'}`}>
                              {n.text}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Trigger link to settings */}
            <Link to="/portal/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 border border-border-hairline group-hover:border-brand-red transition-colors shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-charcoal group-hover:text-brand-red transition-colors">
                Alexander
              </span>
            </Link>

          </div>
        </header>

        {/* Content Body Pane */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </div>

      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 w-full bg-charcoal text-white h-16 border-t border-neutral-800 z-30 flex md:hidden items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/portal'}
            className={({ isActive }) => `
              flex flex-col items-center gap-1.5 py-1 px-3 text-[9px] font-bold uppercase tracking-wider transition-colors
              ${isActive ? 'text-brand-red' : 'text-neutral-400 hover:text-white'}
            `}
          >
            <item.icon className="w-4.5 h-4.5" />
            <span className="truncate max-w-[60px]">{item.label.split(' ')[0] || item.label}</span>
          </NavLink>
        ))}
        {/* Mobile Inventory Anchor */}
        <Link
          to="/"
          className="flex flex-col items-center gap-1.5 py-1 px-3 text-[9px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white"
        >
          <Search className="w-4.5 h-4.5" />
          <span>Browse</span>
        </Link>
      </nav>

    </div>
  );
}
