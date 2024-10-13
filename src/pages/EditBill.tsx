import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface BillItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const EditBill: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<BillItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (billId === 'new') {
      const extractedData = JSON.parse(localStorage.getItem('extractedBillData') || '{}');
      const newItems = extractedData.items?.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })) || [];
      setItems(newItems);
      calculateTotal(newItems);
    } else {
      // TODO: Fetch actual bill data from API for existing bills
      const mockItems: BillItem[] = [
        { id: 1, name: 'Burger', quantity: 2, price: 10.99 },
        { id: 2, name: 'Fries', quantity: 1, price: 3.99 },
        { id: 3, name: 'Soda', quantity: 2, price: 1.99 },
      ];
      setItems(mockItems);
      calculateTotal(mockItems);
    }
  }, [billId]);

  // ... rest of the component remains the same
};

export default EditBill;