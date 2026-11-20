import { z } from 'zod';
import { pickEnv } from './runtime-env';

const SQUAD_BASE_URL_PROD = 'https://api-d.squadco.com';
const SQUAD_BASE_URL_DEV = 'https://sandbox-api-d.squadco.com';

/**
 * Resolve the Squad secret key from the environment.
 * Kept in this module so the initiate, verify and webhook routes share it.
 */
export function getSquadSecretKey(): string | null {
  const candidates = [
    // Runtime bindings first (works for encrypted secrets), then build-time values.
    pickEnv('SQUAD_SECRET_KEY'),
    pickEnv('PUBLIC_SQUAD_SECRET_KEY'),
    // @ts-ignore Cloudflare Pages exposes server vars via import.meta.env
    import.meta.env?.PUBLIC_SQUAD_SECRET_KEY,
    // @ts-ignore
    import.meta.env?.SQUAD_SECRET_KEY,
  ];

  for (const value of candidates) {
    if (value && typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  return null;
}

export function isProductionHost(hostname: string): boolean {
  return (
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('192.168.')
  );
}

export const InitiatePaymentSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  customerName: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  items: z.array(z.any()).optional(),
  transactionRef: z.string(),
});

export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    checkout_url: string;
    transaction_ref: string;
  };
}

export interface VerifyResult {
  verified: boolean;
  status: string;
  reference?: string;
  amount?: number;
  message?: string;
}

export class SquadAPI {
  private secretKey: string;
  private baseUrl: string;

  constructor(secretKey: string, isProd: boolean) {
    this.secretKey = secretKey;
    
    // Use the isProd parameter to determine environment
    if (isProd) {
      this.baseUrl = SQUAD_BASE_URL_PROD;
    } else {
      this.baseUrl = SQUAD_BASE_URL_DEV;
    }
    
    // Log for debugging (masked for security)
    const maskedKey = secretKey.length > 6 ? 
      `${secretKey.substring(0, 3)}***${secretKey.substring(secretKey.length - 3)}` : 
      '***';
    console.log(`SquadAPI initialized - Production: ${isProd}, Base URL: ${this.baseUrl}, Key: ${maskedKey}`);
  }

  async initiatePayment(input: InitiatePaymentInput, callbackUrl: string): Promise<PaymentResponse> {
    const validated = InitiatePaymentSchema.parse(input);

    const response = await fetch(`${this.baseUrl}/transaction/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validated.email,
        amount: Math.round(validated.amount * 100), // Convert to kobo
        initiate_type: 'inline',
        currency: 'NGN',
        customer_name: validated.customerName,
        callback_url: callbackUrl,
        transaction_ref: validated.transactionRef,
        metadata: {
          customer_phone: validated.phone,
          address: validated.address,
          city: validated.city,
          state: validated.state,
          postal_code: validated.postalCode,
          items: JSON.stringify(validated.items),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Squad API error response:', response.status, response.statusText, errorText);
      return {
        success: false,
        message: `Payment initiation failed: ${response.status} ${response.statusText} - ${errorText}`,
      };
    }

    const data = await response.json();

    if (data.status === false || data.success === false || (data.status !== 200 && data.status !== 'success')) {
      return {
        success: false,
        message: data.message || 'Payment initiation failed',
      };
    }

    if (!data.data || !data.data.checkout_url) {
      return {
        success: false,
        message: 'Payment initiation failed: invalid response format',
      };
    }

    return {
      success: true,
      message: 'Payment initiated successfully',
      data: {
        checkout_url: data.data.checkout_url,
        transaction_ref: data.data.transaction_ref || validated.transactionRef,
      },
    };
  }

  /**
   * Ask Squad whether a transaction actually succeeded.
   * GET /transaction/verify/{transaction_ref}
   */
  async verifyTransaction(reference: string): Promise<VerifyResult> {
    if (!reference) {
      return { verified: false, status: 'missing', message: 'Missing reference' };
    }

    const endpoint = `${this.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Squad verify request failed:', error);
      return {
        verified: false,
        status: 'unreachable',
        reference,
        message: 'Could not reach the payment provider',
      };
    }

    const text = await response.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      console.error('Squad verify error:', response.status, text.slice(0, 500));
      return {
        verified: false,
        status: `http_${response.status}`,
        reference,
        message: 'Payment provider rejected the verification request',
      };
    }

    const data = payload?.data ?? payload ?? {};
    const status = String(
      data.transaction_status ?? data.status ?? payload?.message ?? 'Unknown'
    );

    const verified = /^(success|successful|completed|paid)$/i.test(status.trim());

    return {
      verified,
      status,
      reference: data.transaction_ref ?? reference,
      amount:
        data.transaction_amount != null ? Number(data.transaction_amount) : undefined,
      message: payload?.message,
    };
  }
}
