export const purchaseHistory = [
  {
    id: 'pur-8420',
    vehicleId: 6, // Tesla Model S (marked 'sold' in inventory)
    vehicleName: 'Tesla Model S',
    vehicleDetails: {
      make: 'Tesla',
      model: 'Tesla Model S',
      year: 2023,
      price: '$89,000',
      type: 'Sedan',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    },
    purchaseDate: '2026-02-10T11:20:00Z',
    finalPrice: '$89,000',
    deliveryDate: '2026-02-15T15:30:00Z',
    stageHistory: [
      { stage: 'Reserved', date: '2026-02-10T11:20:00Z', note: 'Vehicle reserved.' },
      { stage: 'Invoiced', date: '2026-02-11T09:00:00Z', note: 'Invoice issued.' },
      { stage: 'Paid', date: '2026-02-12T10:15:00Z', note: 'Payment cleared.' },
      { stage: 'Shipped', date: '2026-02-13T14:00:00Z', note: 'Enclosed delivery dispatched.' },
      { stage: 'Delivered', date: '2026-02-15T15:30:00Z', note: 'Vehicle dropped off at buyer residence.' }
    ]
  },
  {
    id: 'pur-1904',
    vehicleId: 8, // Honda Civic
    vehicleName: 'Honda Civic',
    vehicleDetails: {
      make: 'Honda',
      model: 'Honda Civic',
      year: 2023,
      price: '$28,000',
      type: 'Sedan',
      image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80'
    },
    purchaseDate: '2025-08-04T15:45:00Z',
    finalPrice: '$27,500',
    deliveryDate: '2025-08-09T12:00:00Z',
    stageHistory: [
      { stage: 'Reserved', date: '2025-08-04T15:45:00Z', note: 'Held.' },
      { stage: 'Invoiced', date: '2025-08-05T09:30:00Z', note: 'Invoiced.' },
      { stage: 'Paid', date: '2025-08-05T14:50:00Z', note: 'Paid.' },
      { stage: 'Shipped', date: '2025-08-07T08:00:00Z', note: 'Shipped.' },
      { stage: 'Delivered', date: '2025-08-09T12:00:00Z', note: 'Delivered.' }
    ]
  }
];
