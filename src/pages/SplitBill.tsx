import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface BillItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  assignedTo: number[];
}

interface Person {
  id: number;
  name: string;
  total: number;
}

const SplitBill: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<BillItem[]>([]);
  const [people, setPeople] = useState<Person[]>([{ id: 1, name: 'Person 1', total: 0 }]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // TODO: Fetch actual bill data from API
    const mockItems: BillItem[] = [
      { id: 1, name: 'Burger', quantity: 2, price: 10.99, assignedTo: [] },
      { id: 2, name: 'Fries', quantity: 1, price: 3.99, assignedTo: [] },
      { id: 3, name: 'Soda', quantity: 2, price: 1.99, assignedTo: [] },
    ];
    setItems(mockItems);
    calculateTotal(mockItems);
  }, [billId]);

  const calculateTotal = (items: BillItem[]) => {
    const newTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(newTotal);
  };

  const handleAddPerson = () => {
    const newPerson: Person = {
      id: people.length + 1,
      name: `Person ${people.length + 1}`,
      total: 0,
    };
    setPeople([...people, newPerson]);
  };

  const handlePersonNameChange = (id: number, name: string) => {
    setPeople(people.map(person =>
      person.id === id ? { ...person, name } : person
    ));
  };

  const handleItemAssignment = (itemId: number, personId: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const assignedTo = item.assignedTo.includes(personId)
          ? item.assignedTo.filter(id => id !== personId)
          : [...item.assignedTo, personId];
        return { ...item, assignedTo };
      }
      return item;
    }));
  };

  const calculateSplitTotals = () => {
    const newPeople = people.map(person => ({ ...person, total: 0 }));
    items.forEach(item => {
      const splitCount = item.assignedTo.length || 1;
      const splitAmount = (item.price * item.quantity) / splitCount;
      item.assignedTo.forEach(personId => {
        const personIndex = newPeople.findIndex(p => p.id === personId);
        if (personIndex !== -1) {
          newPeople[personIndex].total += splitAmount;
        }
      });
    });
    setPeople(newPeople);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateSplitTotals();
    // TODO: Send split bill data to API
    console.log('Saving split bill:', { billId, items, people });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Split Bill</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">People</h2>
          <button
            type="button"
            onClick={handleAddPerson}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Person
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {people.map(person => (
            <div key={person.id} className="flex flex-col">
              <input
                type="text"
                value={person.name}
                onChange={(e) => handlePersonNameChange(person.id, e.target.value)}
                className="p-2 border rounded mb-2"
              />
              <div className="text-sm font-semibold">
                Total: ${person.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name} (x{item.quantity})</td>
                <td className="p-2">${(item.price * item.quantity).toFixed(2)}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    {people.map(person => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => handleItemAssignment(item.id, person.id)}
                        className={`px-2 py-1 text-sm rounded ${
                          item.assignedTo.includes(person.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {person.name}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right text-xl font-bold">
          Total: ${total.toFixed(2)}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/edit/${billId}`)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Back to Edit
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Calculate Split
          </button>
        </div>
      </form>
    </div>
  );
};

export default SplitBill;