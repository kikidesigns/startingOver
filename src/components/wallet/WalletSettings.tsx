import { useState, useEffect } from 'react';
import { ZapriteService, formatSats } from '../../lib/zaprite';
import { getUserPayments } from '../../lib/db';

interface WalletInfo {
  balance: number;
  address: string;
  lnAddress?: string;
}

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'bitcoin' | 'lightning';
  createdAt: string;
  completedAt?: string;
}

export const WalletSettings = () => {
  const [zapriteKey, setZapriteKey] = useState('');
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      // TODO: Get actual user ID and API key from auth context
      const userId = 'current-user-id';
      
      // Load payments from local DB
      const userPayments = await getUserPayments(userId);
      
      // If we have an API key, fetch Zaprite data
      if (zapriteKey) {
        await fetchZapriteData();
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const fetchZapriteData = async () => {
    try {
      const zaprite = new ZapriteService(zapriteKey);
      
      // Get wallet info
      const contact = await zaprite.getContactInfo();
      setWalletInfo({
        balance: contact.balance,
        address: contact.address,
        lnAddress: contact.lnAddress
      });

      // Get recent payments
      const { payments } = await zaprite.listPayments({
        limit: 10,
        status: 'completed'
      });
      setPayments(payments);

      setError(null);
    } catch (error) {
      console.error('Error fetching Zaprite data:', error);
      setError('Failed to fetch wallet data from Zaprite');
      setWalletInfo(null);
    }
  };

  const handleSaveKey = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Verify the API key works by fetching data
      const zaprite = new ZapriteService(zapriteKey);
      await zaprite.getContactInfo();

      // TODO: Save API key securely
      // For MVP, we could store in local storage
      localStorage.setItem('zapriteKey', zapriteKey);

      await fetchZapriteData();
      setSuccessMessage('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      setError('Invalid API key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage('Copied to clipboard');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Wallet & Payments</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Zaprite Settings</h2>
        
        <div className="mb-6">
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
              disabled={!zapriteKey.trim() || loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {walletInfo && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Wallet Info</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Balance</label>
                <p className="text-xl font-medium">
                  {formatSats(walletInfo.balance)} BTC
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-500">Bitcoin Address</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={walletInfo.address}
                    readOnly
                    className="flex-1 p-2 bg-gray-50 border rounded"
                  />
                  <button
                    onClick={() => copyToClipboard(walletInfo.address)}
                    className="p-2 text-blue-500 hover:text-blue-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {walletInfo.lnAddress && (
                <div>
                  <label className="block text-sm text-gray-500">Lightning Address</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={walletInfo.lnAddress}
                      readOnly
                      className="flex-1 p-2 bg-gray-50 border rounded"
                    />
                    <button
                      onClick={() => copyToClipboard(walletInfo.lnAddress!)}
                      className="p-2 text-blue-500 hover:text-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="mt-4 text-sm text-green-500">
            {successMessage}
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-medium">
                  {formatSats(payment.amount)} BTC
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                  {payment.completedAt && ` • Completed`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  payment.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
                <span className="text-gray-500 text-sm">
                  {payment.type}
                </span>
              </div>
            </div>
          ))}

          {payments.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No transactions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};