// Helper to generate relative time dates
const getDaysAgo = (d) => {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
};

const getHoursAgo = (h) => {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
};

export const activityLog = [
  {
    id: 'act-201',
    clientId: 'cust-9428', // Alexander Sterling
    agentId: 'agent-101',
    type: 'Status Change',
    description: 'Reservation payment confirmed for Mercedes-Benz GLE.',
    timestamp: getHoursAgo(2)
  },
  {
    id: 'act-202',
    clientId: 'cust-002', // Tony Stark
    agentId: 'agent-101',
    type: 'Call',
    description: 'Briefed Tony Stark on Porsche 911 specs and vehicle history records.',
    timestamp: getHoursAgo(4)
  },
  {
    id: 'act-203',
    clientId: 'cust-002', // Tony Stark
    agentId: 'agent-101',
    type: 'Status Change',
    description: 'Temporary lock hold placed on Porsche 911 (res-3002).',
    timestamp: getHoursAgo(5)
  },
  {
    id: 'act-204',
    clientId: 'cust-004', // Diana Prince
    agentId: 'agent-101',
    type: 'Meeting',
    description: 'Reviewed Range Rover Sport purchase timeline at local agency depot.',
    timestamp: getDaysAgo(1)
  },
  {
    id: 'act-205',
    clientId: 'cust-9428', // Alexander Sterling
    agentId: 'agent-101',
    type: 'Note',
    description: 'Customer mentioned preferring transport logistics inside an enclosed carrier.',
    timestamp: getDaysAgo(2)
  },
  {
    id: 'act-206',
    clientId: 'cust-001', // Bruce Wayne
    agentId: 'agent-101',
    type: 'Email',
    description: 'Dispatched custom pricing sheets for Toyota Land Cruiser models.',
    timestamp: getDaysAgo(3)
  },
  {
    id: 'act-207',
    clientId: 'cust-005', // Selina Kyle
    agentId: 'agent-101',
    type: 'Status Change',
    description: 'Hold res-3005 converted to sale. Mustang GT VIN flagged as Sold.',
    timestamp: getDaysAgo(5)
  },
  {
    id: 'act-208',
    clientId: 'cust-003', // Arthur Dent
    agentId: 'agent-101',
    type: 'Call',
    description: 'Reviewed ship-out documents for the completed Civic purchase.',
    timestamp: getDaysAgo(8)
  }
];
