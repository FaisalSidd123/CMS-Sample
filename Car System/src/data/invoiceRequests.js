export const invoiceRequests = [
  {
    id: 'inv-req-501',
    reservationId: 'res-3001', // Alexander Sterling GLE
    clientId: 'cust-9428',
    amount: '$68,000',
    notes: 'Escrow wiring details verified. Hold converted to invoicing log.',
    status: 'Approved', // Pending Admin Approval / Approved / Rejected
    createdDate: '2026-06-26T09:15:00Z'
  },
  {
    id: 'inv-req-502',
    reservationId: 'res-3002', // Tony Stark Porsche
    clientId: 'cust-002',
    amount: '$112,000',
    notes: 'Invoice generated immediately upon customer deposit confirm.',
    status: 'Pending Admin Approval',
    createdDate: '2026-07-02T11:00:00Z'
  },
  {
    id: 'inv-req-503',
    reservationId: 'res-3004', // Bruce Wayne Land Cruiser
    clientId: 'cust-001',
    amount: '$82,000',
    notes: 'Invoicing request filed on hold. Hold subsequently expired.',
    status: 'Rejected',
    createdDate: '2026-06-18T14:20:00Z'
  }
];
export const mockAgentDocuments = [
  {
    id: 'adoc-01',
    clientId: 'cust-9428',
    type: 'ID Verification',
    fileName: 'Alexander_Sterling_Drivers_License.pdf',
    uploadDate: '2026-06-25T14:40:00Z',
    status: 'Approved'
  },
  {
    id: 'adoc-02',
    clientId: 'cust-002',
    type: 'Payment Proof',
    fileName: 'Escrow_Wire_Receipt_Porsche_911.pdf',
    uploadDate: '2026-07-02T10:45:00Z',
    status: 'Pending Review'
  },
  {
    id: 'adoc-03',
    clientId: 'cust-004',
    type: 'ID Verification',
    fileName: 'Diana_Prince_Passport_Scan.pdf',
    uploadDate: '2026-07-01T11:00:00Z',
    status: 'Approved'
  }
];
