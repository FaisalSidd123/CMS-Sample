export const adminUsers = [
  {
    id: 'adm-01',
    name: 'Chief Executive Operator',
    email: 'admin@vanguard.com',
    role: 'Super Admin', // Super Admin / Manager / Support
    status: 'Active',
    joinedDate: '2022-01-10T09:00:00Z',
    permissions: {
      inventory: true,
      customers: true,
      transactions: true,
      documents: true,
      reports: true
    }
  },
  {
    id: 'adm-02',
    name: 'Robert Vance',
    email: 'robert.vance@vanguard.com',
    role: 'Manager',
    status: 'Active',
    joinedDate: '2023-05-14T09:00:00Z',
    permissions: {
      inventory: true,
      customers: true,
      transactions: true,
      documents: true,
      reports: false
    }
  },
  {
    id: 'adm-03',
    name: 'James Logan',
    email: 'james.logan@vanguard.com',
    role: 'Support',
    status: 'Active',
    joinedDate: '2024-11-20T10:00:00Z',
    permissions: {
      inventory: false,
      customers: true,
      transactions: false,
      documents: true,
      reports: false
    }
  }
];
export const roleDefaultPermissions = {
  'Super Admin': { inventory: true, customers: true, transactions: true, documents: true, reports: true },
  'Manager': { inventory: true, customers: true, transactions: true, documents: true, reports: false },
  'Support': { inventory: false, customers: true, transactions: false, documents: true, reports: false }
};
