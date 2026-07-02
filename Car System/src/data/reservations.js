// Helper to generate dynamic dates relative to current time
const getHoursFromNow = (h) => {
  return new Date(Date.now() + h * 60 * 60 * 1000).toISOString();
};

const getDaysAgo = (d) => {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
};

export const reservations = [
  {
    id: 'res-3001',
    clientId: 'cust-9428', // Alexander Sterling
    vehicleId: 2, // Mercedes-Benz GLE
    assignedAgentId: 'agent-101',
    status: 'Confirmed', // Pending / Confirmed / Expired / Converted to Sale
    createdDate: getDaysAgo(7),
    holdDurationHours: 168, // 7 days
    holdExpiresAt: getHoursFromNow(48) // 2 days left
  },
  {
    id: 'res-3002',
    clientId: 'cust-002', // Tony Stark
    vehicleId: 3, // Porsche 911
    assignedAgentId: 'agent-101',
    status: 'Pending',
    createdDate: getDaysAgo(1),
    holdDurationHours: 24,
    holdExpiresAt: getHoursFromNow(3.5) // Expiring soon (<6 hours left) - triggers alert highlight!
  },
  {
    id: 'res-3003',
    clientId: 'cust-004', // Diana Prince
    vehicleId: 7, // Range Rover Sport
    assignedAgentId: 'agent-101',
    status: 'Pending',
    createdDate: getDaysAgo(2),
    holdDurationHours: 72,
    holdExpiresAt: getHoursFromNow(20)
  },
  {
    id: 'res-3004',
    clientId: 'cust-001', // Bruce Wayne
    vehicleId: 5, // Toyota Land Cruiser
    assignedAgentId: 'agent-101',
    status: 'Expired',
    createdDate: getDaysAgo(15),
    holdDurationHours: 48,
    holdExpiresAt: getDaysAgo(13)
  },
  {
    id: 'res-3005',
    clientId: 'cust-005', // Selina Kyle
    vehicleId: 9, // Ford Mustang GT
    assignedAgentId: 'agent-101',
    status: 'Converted to Sale',
    createdDate: getDaysAgo(10),
    holdDurationHours: 72,
    holdExpiresAt: getDaysAgo(7)
  }
];
