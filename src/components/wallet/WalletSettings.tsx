import { useState, useEffect } from 'react';
import { ZapriteService, formatSats } from '../../lib/zaprite';
import { getUserPayments } from '../../lib/db-bridge';
import { Loading } from '../common/Loading';
import { Alert } from '../common/Alert';

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
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      
      // Load payments from local DB via Tauri bridge
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

  // ... rest of the component remains the same ...

  if (loading) {
    return <Loading message="Loading wallet data..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
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

      {/* ... rest of the JSX remains the same ... */}
    </div>
  );
};