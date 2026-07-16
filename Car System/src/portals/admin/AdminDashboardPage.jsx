import React, { useState } from 'react';
import AdminShell from './components/AdminShell';
import AdminOverview from './components/AdminOverview';
import AdminInventory from './components/AdminInventory';
import AdminLeads from './components/AdminLeads';
import AdminReservations from './components/AdminReservations';
import AdminImports from './components/AdminImports';
import AdminPayments from './components/AdminPayments';
import AdminSalesTeam from './components/AdminSalesTeam';
import AdminDocuments from './components/AdminDocuments';

export default function AdminDashboardPage({
  sharedVehicles,
  onUpdateVehicles,
  sharedClients,
  onUpdateClients,
  sharedAgents,
  onUpdateAgents,
  sharedReservations,
  sharedActivities,
  sharedInvoices,
  onUpdateInvoices,
  sharedDocs,
  onUpdateDocs,
  sharedAudit,
  onUpdateAudit
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventoryFilter, setInventoryFilter] = useState('all');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminOverview />;
      case 'inventory':
        return (
          <AdminInventory 
            sharedVehicles={sharedVehicles} 
            onUpdateVehicles={onUpdateVehicles} 
            inventoryFilter={inventoryFilter}
          />
        );
      case 'leads':
        return <AdminLeads />;
      case 'reservations':
        return <AdminReservations />;
      case 'payments':
        return <AdminPayments />;
      case 'salesteam':
        return <AdminSalesTeam />;
      case 'documents':
        return (
          <AdminDocuments 
            sharedInvoices={sharedInvoices}
            onUpdateInvoices={onUpdateInvoices}
            sharedDocs={sharedDocs}
            onUpdateDocs={onUpdateDocs}
            sharedAudit={sharedAudit}
            onUpdateAudit={onUpdateAudit}
          />
        );
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminShell 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      inventoryFilter={inventoryFilter}
      onFilterChange={setInventoryFilter}
    >
      {renderContent()}
    </AdminShell>
  );
}
