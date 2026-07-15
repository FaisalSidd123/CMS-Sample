import React, { useState } from 'react';
import AgentShell from './components/AgentShell';
import AgentOverview from './components/AgentOverview';
import AgentClients from './components/AgentClients';
import AgentReservations from './components/AgentReservations';
import AgentPipeline from './components/AgentPipeline';
import AgentDocuments from './components/AgentDocuments';
import AgentActivityLog from './components/AgentActivityLog';

export default function AgentDashboardPage({
  sharedReservations,
  onUpdateReservations,
  sharedVehicles,
  onUpdateVehicles,
  sharedActivities,
  onUpdateActivities
}) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AgentOverview />;
      case 'clients':
        return <AgentClients />;
      case 'reservations':
        return (
          <AgentReservations 
            sharedReservations={sharedReservations}
            onUpdateReservations={onUpdateReservations}
            sharedVehicles={sharedVehicles}
            onUpdateVehicles={onUpdateVehicles}
          />
        );
      case 'pipeline':
        return <AgentPipeline />;
      case 'documents':
        return <AgentDocuments />;
      case 'activity':
        return (
          <AgentActivityLog 
            sharedActivities={sharedActivities}
            onUpdateActivities={onUpdateActivities}
          />
        );
      default:
        return <AgentOverview />;
    }
  };

  return (
    <AgentShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AgentShell>
  );
}
