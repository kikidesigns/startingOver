// Zaprite API configuration
const ZAPRITE_API_URL = 'https://api.zaprite.com/v1';

interface ZapriteContact {
  id: string;
  email: string;
  balance: number;
  address: string;
  lnAddress?: string;
}

interface ZapritePayment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'bitcoin' | 'lightning';
  createdAt: string;
  completedAt?: string;
}

interface CreatePaymentRequest {
  amount: number;
  description?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export class ZapriteService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${ZAPRITE_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Zaprite API error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  // Get contact/wallet information
  async getContactInfo(): Promise<ZapriteContact> {
    return await this.fetchApi('/contact');
  }

  // Create a new payment request
  async createPayment(data: CreatePaymentRequest): Promise<{
    id: string;
    checkoutUrl: string;
    btcAddress?: string;
    lightningInvoice?: string;
  }> {
    return await this.fetchApi('/payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get payment details
  async getPayment(paymentId: string): Promise<ZapritePayment> {
    return await this.fetchApi(`/payment/${paymentId}`);
  }

  // List recent payments
  async listPayments(params: {
    limit?: number;
    offset?: number;
    status?: 'pending' | 'completed' | 'failed';
  } = {}): Promise<{
    payments: ZapritePayment[];
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.status) queryParams.append('status', params.status);

    return await this.fetchApi(`/payment?${queryParams.toString()}`);
  }

  // Get Bitcoin address
  async getBitcoinAddress(): Promise<string> {
    const contact = await this.getContactInfo();
    return contact.address;
  }

  // Get Lightning address if available
  async getLightningAddress(): Promise<string | undefined> {
    const contact = await this.getContactInfo();
    return contact.lnAddress;
  }

  // Get current balance
  async getBalance(): Promise<number> {
    const contact = await this.getContactInfo();
    return contact.balance;
  }
}

// Helper function to format satoshis to BTC
export function formatSats(sats: number): string {
  return (sats / 100000000).toFixed(8);
}

// Helper function to format BTC to satoshis
export function formatBTC(btc: number): number {
  return Math.round(btc * 100000000);
}