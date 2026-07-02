export const orders = [
  {
    id: 'ord-3029',
    vehicleId: 2, // Mercedes-Benz GLE
    orderDate: '2026-06-25T14:32:00Z',
    currentStage: 'Paid', // Stages: Reserved -> Invoiced -> Paid -> Shipped -> Delivered
    stageHistory: [
      {
        stage: 'Reserved',
        date: '2026-06-25T14:32:00Z',
        note: 'Vehicle held platform-wide. VIN record locked for buyer allocation.'
      },
      {
        stage: 'Invoiced',
        date: '2026-06-26T09:15:00Z',
        note: 'Pro-forma transaction logs generated. Sent to buyer for wire review.'
      },
      {
        stage: 'Paid',
        date: '2026-06-27T11:40:00Z',
        note: 'Escrow wire payment received and cleared. Registration logs prepared.'
      }
    ],
    agent: {
      name: 'Sarah Connor',
      contact: 'sarah.connor@vanguardmotors.com'
    }
  },
  {
    id: 'ord-4190',
    vehicleId: 7, // Range Rover Sport
    orderDate: '2026-07-01T10:05:00Z',
    currentStage: 'Reserved',
    stageHistory: [
      {
        stage: 'Reserved',
        date: '2026-07-01T10:05:00Z',
        note: 'Hold deposit received. Advisor assigned to review trade-in options.'
      }
    ],
    agent: {
      name: 'Thomas Miller',
      contact: 'thomas.miller@vanguardmotors.com'
    }
  }
];
