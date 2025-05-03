import { useState } from 'react';
import { ZapriteService, formatSats, formatBTC } from '../../lib/zaprite';

interface ZapriteButtonProps {
  recipientId: string;
  apiKey?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: Error) => void;
}

export const ZapriteButton = ({
  recipientId,
  apiKey,
  onSuccess,
  onError
}: ZapriteButtonProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{
    checkoutUrl?: string;
    btcAddress?: string;
    lightningInvoice?: string;
  } | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
    setPaymentData(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAmount(0);
    setError(null);
    setPaymentData(null);
  };

  const handleCreatePayment = async () => {
    if (!amount || !apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const zaprite = new ZapriteService(apiKey);
      const payment = await zaprite.createPayment({
        amount: formatBTC(amount), // Convert BTC to sats
        description: `Support payment via POD`,
        metadata: {
          recipientId,
          podPayment: 'true'
        }
      });

      setPaymentData(payment);
      
      // Start polling for payment status
      pollPaymentStatus(zaprite, payment.id);
    } catch (err) {
      console.error('Payment creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      onError?.(err instanceof Error ? err : new Error('Payment creation failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (zaprite: ZapriteService, paymentId: string) => {
    const checkStatus = async () => {
      try {
        const status = await zaprite.getPayment(paymentId);
        if (status.status === 'completed') {
          onSuccess?.(paymentId);
          handleCloseModal();
          return;
        }
        if (status.status === 'failed') {
          setError('Payment failed');
          return;
        }
        // Continue polling if pending
        setTimeout(checkStatus, 5000);
      } catch (error) {
        console.error('Payment status check error:', error);
      }
    };

    checkStatus();
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Support with Bitcoin ⚡
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Support with Bitcoin</h3>

            {!paymentData ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (BTC)
                  </label>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    step="0.00000001"
                    min="0.00000001"
                    className="w-full p-2 border rounded"
                    placeholder="0.00000000"
                  />
                  {amount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ≈ {formatSats(formatBTC(amount))} sats
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreatePayment}
                  disabled={!amount || isLoading}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:bg-orange-300"
                >
                  {isLoading ? 'Creating payment...' : 'Continue'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentData.btcAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitcoin Address
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={paymentData.btcAddress}
                        readOnly
                        className="flex-1 p-2 bg-gray-50 border rounded"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(paymentData.btcAddress!)}
                        className="p-2 text-blue-500 hover:text-blue-600"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {paymentData.lightningInvoice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lightning Invoice
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={paymentData.lightningInvoice}
                        readOnly
                        className="flex-1 p-2 bg-gray-50 border rounded"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(paymentData.lightningInvoice!)}
                        className="p-2 text-blue-500 hover:text-blue-600"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {paymentData.checkoutUrl && (
                  <a
                    href={paymentData.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Open Checkout Page
                  </a>
                )}
              </div>
            )}

            {error && (
              <p className="mt-4 text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              onClick={handleCloseModal}
              className="mt-4 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};