import React, { useState } from 'react';
import PortalShell from './components/PortalShell';
import PortalOverview from './components/PortalOverview';
import PortalOrders from './components/PortalOrders';
import PortalDocuments from './components/PortalDocuments';
import PortalPurchases from './components/PortalPurchases';
import PortalWishlist from './components/PortalWishlist';
import PortalProfile from './components/PortalProfile';

export default function PortalDashboardPage({
  savedVehicleIds,
  onToggleSave,
  vehicles,
  orders,
  onUpdateOrders,
  reservations,
  onUpdateReservations,
  activities,
  onUpdateActivities
}) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <PortalOverview 
            vehicles={vehicles}
            savedVehicleIds={savedVehicleIds}
            onToggleSave={onToggleSave}
            orders={orders}
            reservations={reservations}
            activities={activities}
          />
        );
      case 'orders':
        return (
          <PortalOrders 
            orders={orders}
            onUpdateOrders={onUpdateOrders}
            reservations={reservations}
            onUpdateReservations={onUpdateReservations}
            activities={activities}
            onUpdateActivities={onUpdateActivities}
          />
        );
      case 'documents':
        return <PortalDocuments />;
      case 'purchases':
        return <PortalPurchases />;
      case 'wishlist':
        return (
          <PortalWishlist 
            vehicles={vehicles}
            savedVehicleIds={savedVehicleIds}
            onToggleSave={onToggleSave}
          />
        );
      case 'profile':
        return <PortalProfile />;
      default:
        return (
          <PortalOverview 
            vehicles={vehicles}
            savedVehicleIds={savedVehicleIds}
            onToggleSave={onToggleSave}
            orders={orders}
            reservations={reservations}
            activities={activities}
          />
        );
    }
  };

  return (
    <PortalShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </PortalShell>
  );
}
