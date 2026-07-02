// Helper to generate dates relative to current time
const getDaysAgo = (d) => {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
};

const getHoursAgo = (h) => {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
};

export const adminAuditLog = [
  {
    id: 'aud-001',
    adminId: 'adm-01',
    adminName: 'Chief Executive Operator',
    actionTaken: 'Role Permission Update',
    target: 'Support role permission checkbox modified.',
    timestamp: getHoursAgo(1.5)
  },
  {
    id: 'aud-002',
    adminId: 'adm-01',
    adminName: 'Chief Executive Operator',
    actionTaken: 'Customer Reassigned',
    target: 'Client Bruce Wayne reassigned to Agent Sarah Connor.',
    timestamp: getHoursAgo(4)
  },
  {
    id: 'aud-003',
    adminId: 'adm-02',
    adminName: 'Robert Vance',
    actionTaken: 'Inventory Created',
    target: 'Added new vehicle record: Tesla Model Y ($62,000).',
    timestamp: getDaysAgo(1)
  },
  {
    id: 'aud-004',
    adminId: 'adm-02',
    adminName: 'Robert Vance',
    actionTaken: 'Approved Invoice Request',
    target: 'Approved invoice request inv-req-501 for Alexander Sterling.',
    timestamp: getDaysAgo(3)
  },
  {
    id: 'aud-005',
    adminId: 'adm-01',
    adminName: 'Chief Executive Operator',
    actionTaken: 'Role Deactivated',
    target: 'Deactivated manager account: robert.vance@vanguard.com.',
    timestamp: getDaysAgo(5)
  }
];
