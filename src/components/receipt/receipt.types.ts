export type ReceiptBadgeStatus = 'PAID' | 'PENDING' | 'UNPAID' | 'REFUNDED';

export type PaymentConfirmationStatus =
  | 'Confirmed'
  | 'Pending'
  | 'Failed'
  | 'Refunded';

export interface ReceiptLineItem {
  id: string;
  name: string;
  variant?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  /** Optional explicit line total; defaults to quantity * unitPrice */
  totalOverride?: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  stateCountry: string;
}

export interface StoreLocation {
  city: string;
  state: string;
}

export interface PaymentDetails {
  method: string;
  transactionReference: string;
  status: PaymentConfirmationStatus;
}

export interface StoreBrandingConfig {
  brandPrimary: string;
  brandAccent: string;
  subtitle: string;
  tagline: string;
  logoUrl?: string;
  hoursLine1: string;
  hoursLine2: string;
  warrantyTitle: string;
  warrantySubtitle: string;
  returnsTitle: string;
  returnsSubtitle: string;
  supportMessage: string;
}

export interface ReceiptData {
  receiptNumber: string;
  /** Optional footer receipt ID; e.g. "ABKHD-RCPT-20261114-3287" */
  footerReceiptNumber?: string;
  badgeStatus: ReceiptBadgeStatus;
  customer: CustomerDetails;
  deliveryAddress: DeliveryAddress;
  location: StoreLocation;
  items: ReceiptLineItem[];
  deliveryAreaLabel: string;
  deliveryFee: number;
  /** Decimal tax rate, e.g. 0.075 for 7.5% */
  vatRate: number;
  currencySymbol?: string;
  payment: PaymentDetails;
  store?: Partial<StoreBrandingConfig>;
  /** Optional manual overrides if pre-calculated by backend */
  subtotalOverride?: number;
  vatAmountOverride?: number;
  totalAmountOverride?: number;
}
