import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api';
import { ZapriteService, formatSats } from '../../lib/zaprite';
import { getUserPayments } from '../../lib/db-bridge';
import { Loading } from '../common/Loading';
import { Alert } from '../common/Alert';
import { Card } from '../common/Card';

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
      setLoading(true);
      setError(null);

      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      
      // Load payments from local DB via Tauri bridge
      const userPayments = await getUserPayments(userId);
      if (userPayments) {
        setPayments(userPayments as Payment[]);
      }
      
      // If we have an API key, fetch Zaprite data
      if (zapriteKey) {
        const zapriteService = new ZapriteService(zapriteKey);
        const walletData = await zapriteService.getWalletInfo();
        setWalletInfo(walletData);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setError('Failed to load wallet data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Save API key to user settings
      await invoke('save_zaprite_key', { key: zapriteKey });
      
      setSuccessMessage('API key saved successfully');
      await loadWalletData();
    } catch (error) {
      console.error('Error saving API key:', error);
      setError('Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading wallet data..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Wallet & Payments</h1>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Zaprite Integration</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="password"
              value={zapriteKey}
              onChange={(e) => setZapriteKey(e.target.value)}
              placeholder="Enter your Zaprite API key"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSaveKey}
              disabled={loading || !zapriteKey}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Save Key
            </button>
          </div>
        </div>
      </Card>

      {walletInfo && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Balance</label>
              <p className="text-2xl font-bold">{formatSats(walletInfo.balance)} sats</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bitcoin Address</label>
              <p className="font-mono text-sm break-all">{walletInfo.address}</p>
            </div>
            {walletInfo.lnAddress && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Lightning Address</label>
                <p className="font-mono text-sm break-all">{walletInfo.lnAddress}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <div className="space-y-4">
          {payments.length > 0 ? (
            <div className="divide-y">
              {payments.map((payment) => (
                <div key={payment.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{formatSats(payment.amount)} sats</p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No payment history available</p>
          )}
        </div>
      </Card>
    </div>
  );
};