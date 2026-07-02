import { useState, useEffect } from 'react';
import { vehicles } from '../data/vehicles';
import { orders } from '../data/orders';
import { documents } from '../data/documents';
import { purchaseHistory } from '../data/purchaseHistory';
import { customerProfile } from '../data/customer';

const dataMap = {
  vehicles,
  orders,
  documents,
  purchaseHistory,
  customerProfile
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
