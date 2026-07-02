export const transactions = [
  {
    id: 'txn-7001',
    orderId: 'ord-3029', // Mercedes GLE
    customerId: 'cust-9428', // Alexander Sterling
    agentId: 'agent-101', // Sarah Connor
    vehicleId: 2,
    amount: '$68,000',
    paymentStatus: 'Paid', // Paid / Partially Paid / Pending / Overdue
    paymentDate: '2026-06-27T11:40:00Z',
    dueDate: '2026-06-27T11:40:00Z'
  },
  {
    id: 'txn-7002',
    orderId: 'ord-4190', // Range Rover Sport
    customerId: 'cust-004', // Diana Prince
    agentId: 'agent-101',
    vehicleId: 7,
    amount: '$94,000',
    paymentStatus: 'Pending',
    paymentDate: null,
    dueDate: '2026-07-05T12:00:00Z'
  },
  {
    id: 'txn-7003',
    orderId: 'ord-hold-01', // Land Cruiser hold (expired/overdue)
    customerId: 'cust-001', // Bruce Wayne
    agentId: 'agent-101',
    vehicleId: 5,
    amount: '$82,000',
    paymentStatus: 'Overdue',
    paymentDate: null,
    dueDate: '2026-06-28T18:00:00Z'
  },
  {
    id: 'txn-7004',
    orderId: 'ord-hold-02', // Porsche 911 Stark hold
    customerId: 'cust-002', // Tony Stark
    agentId: 'agent-101',
    vehicleId: 3,
    amount: '$112,000',
    paymentStatus: 'Partially Paid',
    paymentDate: '2026-07-02T10:45:00Z',
    dueDate: '2026-07-10T12:00:00Z'
  }
];
