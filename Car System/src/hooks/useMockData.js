import { useState, useEffect } from 'react';
import { vehicles } from '../data/vehicles';
import { orders } from '../data/orders';
import { documents } from '../data/documents';
import { purchaseHistory } from '../data/purchaseHistory';
import { customerProfile } from '../data/customer';
import { mockCurrentAgent } from '../data/agents';
import { clients } from '../data/clients';
import { reservations } from '../data/reservations';
import { activityLog } from '../data/activityLog';
import { invoiceRequests, mockAgentDocuments } from '../data/invoiceRequests';
import { transactions } from '../data/transactions';
import { adminUsers } from '../data/adminUsers';
import { adminAuditLog } from '../data/adminAuditLog';

const dataMap = {
  vehicles,
  orders,
  documents,
  purchaseHistory,
  customerProfile,
  agents: mockCurrentAgent,
  clients,
  reservations,
  activityLog,
  invoiceRequests,
  agentDocuments: mockAgentDocuments,
  transactions,
  adminUsers,
  adminAuditLog
};

export function useMockData(category, id = null) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const source = dataMap[category];
      if (id !== null && Array.isArray(source)) {
        const item = source.find(x => x.id.toString() === id.toString());
        setData(item || null);
      } else {
        setData(source || null);
      }
      setIsLoading(false);
    }, 400); // 400ms delay to simulate network latency

    return () => clearTimeout(timer);
  }, [category, id]);

  return { data, isLoading };
}
