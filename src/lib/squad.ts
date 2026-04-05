import { z } from 'zod';

const SQUAD_BASE_URL_PROD = 'https://api-d.squadco.com';
const SQUAD_BASE_URL_DEV = 'https://sandbox-api-d.squadco.com';

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
      const error = await response.text();
      return {
        success: false,
        message: `Payment initiation failed: ${error}`,
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
}
