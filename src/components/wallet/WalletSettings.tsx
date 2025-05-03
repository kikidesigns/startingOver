import { useState, useEffect } from 'react';
import { getUserPayments } from '../../lib/db';

interface Payment {
  id: string;
  amount: number;
  zapritePaymentId: string;
  date: Date;
}

export const WalletSettings = () => {
  const [zapriteKey, setZapriteKey] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      
      // Load payments from local DB
      const userPayments = await getUserPayments(userId);
      setPayments(userPayments);

      // Fetch wallet info from Zaprite
      if (zapriteKey) {
        const response = await fetch('https://api.zaprite.com/v1/contact', {
          headers: {
            'Authorization': `Bearer ${zapriteKey}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setWalletInfo(data);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async () => {
    try {
      // TODO: Save Zaprite key to user profile in DB
      console.log('Saving Zaprite key:', zapriteKey);
      await loadWalletData();
    } catch (error) {
      console.error('Error saving Zaprite key:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Wallet & Payments</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Zaprite Settings</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zaprite API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={zapriteKey}
              onChange={(e) => setZapriteKey(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter your Zaprite API key"
            />
            <button
              onClick={handleSaveKey}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>

        {walletInfo && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Wallet Info</h3>
            <div className="text-sm text-gray-600">
              <p>Balance: {walletInfo.balance} sats</p>
              <p>Address: {walletInfo.address}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{payment.amount} sats</p>
                <p className="text-sm text-gray-500">
                  {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                ID: {payment.zapritePaymentId}
              </div>
            </div>
          ))}
        </div>

        {payments.length === 0 && (
          <p className="text-gray-500 text-center">No transactions yet</p>
        )}
      </div>
    </div>
  );
};