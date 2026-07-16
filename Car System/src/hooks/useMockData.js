import { useState, useEffect } from 'react';
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

    if (category === 'vehicles') {
      const url = id !== null 
        ? `${window.API_BASE_URL}/vehicles/${id}`
        : window.API_BASE_URL + '/vehicles';
      
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(json => {
          if (json.success) {
            setData(json.data);
          } else {
            console.error('Failed to load vehicles from Supabase API:', json.error);
            setData(null);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('API Connection Error: Failed to fetch from database server at:', url, err);
          setData(id !== null ? null : []);
          setIsLoading(false);
        });
      return;
    }

    // Default mock behavior for other assets
    const timer = setTimeout(() => {
      const source = dataMap[category];
      if (id !== null && Array.isArray(source)) {
        const item = source.find(x => x.id.toString() === id.toString());
        setData(item || null);
      } else {
        setData(source || null);
      }
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [category, id]);

  return { data, isLoading };
}
