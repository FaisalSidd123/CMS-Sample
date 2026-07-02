import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Mock Data
import { vehicles as initialVehicles } from './data/vehicles';
import { orders as initialOrders } from './data/orders';
import { documents as initialDocuments } from './data/documents';
import { customerProfile, customerRoster as initialClients } from './data/clients';
import { reservations as initialReservations } from './data/reservations';
import { activityLog as initialActivities } from './data/activityLog';
import { agentsRoster as initialAgents } from './data/agents';
import { invoiceRequests as initialInvoices, mockAgentDocuments as initialDocs } from './data/invoiceRequests';
import { adminAuditLog as initialAudits } from './data/adminAuditLog';
import { transactions as initialTransactions } from './data/transactions';

// Components & Shells
import Navbar from './components/Navbar';
import PortalShell from './components/PortalShell';
import AgentShell from './components/AgentShell';
import AdminShell from './components/AdminShell';

// Pages
import LandingPage from './pages/LandingPage';
import VehicleDetails from './pages/VehicleDetails';
import PortalDashboard from './pages/PortalDashboard';
import PortalOrders from './pages/PortalOrders';
import PortalDocuments from './pages/PortalDocuments';
import PortalPurchases from './pages/PortalPurchases';
import PortalWishlist from './pages/PortalWishlist';
import PortalProfile from './pages/PortalProfile';
import Login from './pages/Login';

// Agent Pages
import AgentDashboard from './pages/AgentDashboard';
import AgentClients from './pages/AgentClients';
import AgentReservations from './pages/AgentReservations';
import AgentPipeline from './pages/AgentPipeline';
import AgentDocuments from './pages/AgentDocuments';
import AgentActivityLog from './pages/AgentActivityLog';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminInventory from './pages/AdminInventory';
import AdminUsers from './pages/AdminUsers';
import AdminTransactions from './pages/AdminTransactions';
import AdminDocuments from './pages/AdminDocuments';
import AdminReports from './pages/AdminReports';
import AdminSystem from './pages/AdminSystem';

gsap.registerPlugin(ScrollTrigger);

// Helper Scroll-to-Top Component synced with Lenis
function ScrollToTop({ lenisInstance }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenisInstance]);

  return null;
}

// Reusable Visual Footer for Public Pages
function Footer() {
  return (
    <footer id="contact" className="bg-[#1A1A1A] text-white pt-20 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-16">
        
        {/* Column 1: Brand Logo & Description */}
        <div>
          <span className="font-display font-extrabold tracking-widest text-lg uppercase block mb-4">
            Vanguard <span className="text-brand-red">Motors</span>
          </span>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-6">
            Curated luxury and performance vehicle procurement pipelines. Delivered straight to your coordinates.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="p-2 bg-neutral-800 hover:bg-brand-red transition-colors text-white flex items-center justify-center">
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="p-2 bg-neutral-800 hover:bg-brand-red transition-colors text-white flex items-center justify-center">
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="p-2 bg-neutral-800 hover:bg-brand-red transition-colors text-white flex items-center justify-center">
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-5 text-neutral-300">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2.5 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
            <li><a href="/#" className="hover:text-brand-red transition-colors">Home</a></li>
            <li><a href="/#inventory" className="hover:text-brand-red transition-colors">Inventory</a></li>
            <li><a href="/#about-us" className="hover:text-brand-red transition-colors">About Us</a></li>
            <li><a href="/#contact" className="hover:text-brand-red transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-5 text-neutral-300">
            Services
          </h4>
          <ul className="flex flex-col gap-2.5 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
            <li><a href="/#inventory" className="hover:text-brand-red transition-colors">Browse Cars</a></li>
            <li><a href="/#inventory" className="hover:text-brand-red transition-colors">Reserve a Vehicle</a></li>
            <li><a href="/#" className="hover:text-brand-red transition-colors">Book Test Drive</a></li>
            <li><a href="/#about-us" className="hover:text-brand-red transition-colors">Delivery Info</a></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-5 text-neutral-300">
            Contact Info
          </h4>
          <ul className="flex flex-col gap-3 font-sans text-xs text-neutral-400">
            <li>
              <span className="font-mono text-[9px] uppercase tracking-wider block text-neutral-500 mb-0.5">Phone</span>
              <span>+1 (800) 555-0199</span>
            </li>
            <li>
              <span className="font-mono text-[9px] uppercase tracking-wider block text-neutral-500 mb-0.5">Email</span>
              <span>advisors@vanguardmotors.com</span>
            </li>
            <li>
              <span className="font-mono text-[9px] uppercase tracking-wider block text-neutral-500 mb-0.5">Address</span>
              <span>400 Vanguard Way, Suite 800<br />Miami, FL 33101</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
        <span>© 2026 VANGUARD MOTORS. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-brand-red transition-colors">Terms of Purchase</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [lenis, setLenis] = useState(null);

  // Shared Global States
  const [vehiclesList, setVehiclesList] = useState(initialVehicles);
  const [savedVehicleIds, setSavedVehicleIds] = useState(customerProfile.savedVehicleIds);
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [reservationsList, setReservationsList] = useState(initialReservations);
  const [activitiesList, setActivitiesList] = useState(initialActivities);
  const [clientsList, setClientsList] = useState(initialClients);
  const [agentsList, setAgentsList] = useState(initialAgents);
  const [invoicesList, setInvoicesList] = useState(initialInvoices);
  const [docsList, setDocsList] = useState(initialDocs);
  const [adminAuditList, setAdminAuditList] = useState(initialAudits);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Handler to toggle vehicle save/wishlist
  const handleToggleSave = (vehicleId) => {
    setSavedVehicleIds((prev) => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Handler to reserve a vehicle and dynamically place a hold transaction
  const handleReserveVehicle = (vehicleId) => {
    // 1. Mark vehicle status as 'reserved' in state
    setVehiclesList((prev) => 
      prev.map(v => v.id === vehicleId ? { ...v, status: 'reserved' } : v)
    );

    // 2. Generate a mock active order log
    const newOrderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      vehicleId: vehicleId,
      orderDate: new Date().toISOString(),
      currentStage: 'Reserved',
      stageHistory: [
        { 
          stage: 'Reserved', 
          date: new Date().toISOString(), 
          note: 'Hold deposit confirmed. VIN locked under customer workspace.' 
        }
      ],
      agent: {
        name: 'Sarah Connor',
        contact: 'sarah.connor@vanguardmotors.com'
      }
    };

    setOrdersList((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen text-charcoal bg-white">
      
      {/* Scroll to Top Sync Listener */}
      <ScrollToTop lenisInstance={lenis} />

      <Routes>
        
        {/* A. PUBLIC PAGES ROUTING */}
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <LandingPage 
                  vehicles={vehiclesList} 
                  savedVehicleIds={savedVehicleIds}
                  onToggleSave={handleToggleSave}
                />
              </main>
              <Footer />
            </>
          } 
        />

        <Route 
          path="/inventory/:id" 
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <VehicleDetails 
                  vehicles={vehiclesList}
                  savedVehicleIds={savedVehicleIds}
                  onToggleSave={handleToggleSave}
                  onReserve={handleReserveVehicle}
                />
              </main>
              <Footer />
            </>
          } 
        />

        {/* B. PRIVATE CUSTOMER PORTAL WORKSPACE */}
        <Route 
          path="/portal/*" 
          element={
            <PortalShell>
              <Routes>
                <Route path="/" element={<PortalDashboard />} />
                <Route path="/orders" element={<PortalOrders />} />
                <Route path="/orders/:id" element={<PortalOrders />} />
                <Route path="/documents" element={<PortalDocuments />} />
                <Route path="/purchases" element={<PortalPurchases />} />
                <Route path="/wishlist" element={<PortalWishlist />} />
                <Route path="/profile" element={<PortalProfile />} />
              </Routes>
            </PortalShell>
          } 
        />

        {/* C. AUTH ROUTING */}
        <Route 
          path="/login" 
          element={<Login />} 
        />

        {/* D. PRIVATE SALES AGENT PORTAL */}
        <Route 
          path="/agent/*" 
          element={
            <AgentShell>
              <Routes>
                <Route path="/" element={<AgentDashboard />} />
                <Route path="/clients" element={<AgentClients />} />
                <Route path="/clients/:id" element={<AgentClients />} />
                <Route 
                  path="/reservations" 
                  element={
                    <AgentReservations 
                      sharedReservations={reservationsList} 
                      onUpdateReservations={setReservationsList}
                      sharedVehicles={vehiclesList}
                      onUpdateVehicles={setVehiclesList}
                    />
                  } 
                />
                <Route 
                  path="/reserve" 
                  element={
                    <AgentReservations 
                      sharedReservations={reservationsList} 
                      onUpdateReservations={setReservationsList}
                      sharedVehicles={vehiclesList}
                      onUpdateVehicles={setVehiclesList}
                    />
                  } 
                />
                <Route path="/pipeline" element={<AgentPipeline />} />
                <Route path="/documents" element={<AgentDocuments />} />
                <Route 
                  path="/activity" 
                  element={
                    <AgentActivityLog 
                      sharedActivities={activitiesList}
                      onUpdateActivities={setActivitiesList}
                    />
                  } 
                />
              </Routes>
            </AgentShell>
          } 
        />

        {/* E. MASTER ADMIN PORTAL */}
        <Route 
          path="/admin/*" 
          element={
            <AdminShell>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route 
                  path="/inventory" 
                  element={
                    <AdminInventory 
                      sharedVehicles={vehiclesList} 
                      onUpdateVehicles={setVehiclesList} 
                    />
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <AdminUsers 
                      sharedClients={clientsList} 
                      onUpdateClients={setClientsList} 
                      sharedAgents={agentsList} 
                      onUpdateAgents={setAgentsList}
                      sharedReservations={reservationsList}
                      sharedActivities={activitiesList}
                    />
                  } 
                />
                <Route path="/transactions" element={<AdminTransactions />} />
                <Route 
                  path="/documents" 
                  element={
                    <AdminDocuments 
                      sharedInvoices={invoicesList} 
                      onUpdateInvoices={setInvoicesList}
                      sharedDocs={docsList}
                      onUpdateDocs={setDocsList}
                      sharedAudit={adminAuditList}
                      onUpdateAudit={setAdminAuditList}
                    />
                  } 
                />
                <Route path="/reports" element={<AdminReports />} />
                <Route 
                  path="/system" 
                  element={
                    <AdminSystem 
                      sharedAudit={adminAuditList} 
                      onUpdateAudit={setAdminAuditList} 
                    />
                  } 
                />
              </Routes>
            </AdminShell>
          } 
        />

      </Routes>

    </div>
  );
}
