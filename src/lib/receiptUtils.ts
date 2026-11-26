import type { Order } from '../types/order';
import type { CartItem } from '../types/cart';
import { isPromoRef } from './promo';
import type {
  PaymentConfirmationStatus,
  ReceiptBadgeStatus,
  ReceiptData,
  ReceiptLineItem,
} from '../components/receipt/receipt.types';

/** FNV-1a 32-bit hash. Deterministic, dependency free. */
function hashSeed(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function dateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Derive a stable receipt number from the payment reference, so the checkout
 * screen, the stored order and the webhook all agree on the same number.
 * Format: ABKHD-RCPT-YYYYMMDD-XXXX
 */
export function deriveReceiptNumber(paymentRef: string, date = new Date()): string {
  const suffix = String(hashSeed(`abkhd:${paymentRef}`) % 10000).padStart(4, '0');
  return `ABKHD-RCPT-${dateStamp(date)}-${suffix}`;
}

/** Backwards compatible alias used by older imports. */
export function generateReceiptNumber(date = new Date()): string {
  return deriveReceiptNumber(`seed:${date.getTime()}`, date);
}

/**
 * Format a receipt number for the header, e.g. #ABKHD-20261114-3287
 */
export function formatReceiptNumberForHeader(receiptNumber: string): string {
  if (receiptNumber.startsWith('#')) return receiptNumber;

  const match = receiptNumber.match(/ABKHD-RCPT-(\d{8})-(\S+)/);
  if (match) return `#ABKHD-${match[1]}-${match[2]}`;

  return `#${receiptNumber}`;
}

export interface ReceiptMappingOptions {
  /** Persisted receipt id; derived from the payment ref when absent. */
  receiptId?: string;
  /** Delivery fee actually charged. */
  deliveryFee?: number;
  /** Decimal tax rate, e.g. 0.075. Defaults to 0 (checkout does not charge VAT). */
  vatRate?: number;
  paymentStatus?: PaymentConfirmationStatus;
  badgeStatus?: ReceiptBadgeStatus;
  location?: { city: string; state: string };
}

function toReceiptItems(items: CartItem[]): ReceiptLineItem[] {
  return items.map((item, index) => ({
    id: item.cartId || `item-${index}`,
    name: item.name,
    variant:
      item.size || item.color
        ? [item.size, item.color].filter(Boolean).join(', ')
        : undefined,
    imageUrl: item.image,
    quantity: item.quantity,
    unitPrice: item.price,
  }));
}

/**
 * Warranty depends on what was bought: mobile phones and accessories carry
 * 2 days, laptops/computers carry 7 days. Mixed or unknown carts get a
 * receipt line that states both.
 */
function resolveWarranty(items: CartItem[]): { title: string; subtitle: string } {
  const categories = items
    .map((item) => (item.category || '').toLowerCase())
    .filter(Boolean);

  if (categories.length === 0) {
    return {
      title: '2 / 7-Day Warranty',
      subtitle: '2 days mobile & accessories · 7 days laptops',
    };
  }

  const isComputer = (category: string) =>
    category.includes('computer') ||
    category.includes('laptop') ||
    category.includes('desktop');

  const computers = categories.filter(isComputer).length;
  const others = categories.length - computers;

  if (computers > 0 && others === 0) {
    return { title: '7-Day Warranty', subtitle: 'laptops & computers' };
  }

  if (others > 0 && computers === 0) {
    return { title: '2-Day Warranty', subtitle: 'mobile & accessories' };
  }

  return {
    title: '2 / 7-Day Warranty',
    subtitle: '2 days mobile & accessories · 7 days laptops',
  };
}

/**
 * Map a stored order + cart items into the receipt component's data model.
 */
export function mapOrderToReceipt(
  order: Partial<Order>,
  cartItems: CartItem[],
  options: ReceiptMappingOptions = {}
): ReceiptData {
  let orderItems: CartItem[] = cartItems;
  if (order.items) {
    try {
      orderItems =
        typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch (error) {
      console.error('Failed to parse order items:', error);
    }
  }

  const receiptItems = toReceiptItems(orderItems);
  const subtotal = receiptItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const vatRate = options.vatRate ?? 0;
  const vatAmount = Math.round(subtotal * vatRate);

  // Promo event orders use a free-text address and no city-based delivery fee.
  const promo = isPromoRef(order.paymentRef);

  const deliveryFee =
    options.deliveryFee ??
    (promo ? 0 : order.city === 'Jimeta' ? 2000 : order.city ? 1000 : 0);

  const totalAmount = subtotal + deliveryFee + vatAmount;
  const warranty = resolveWarranty(orderItems);

  const paymentRef = order.paymentRef || '';
  const receiptId =
    options.receiptId || order.receiptId || deriveReceiptNumber(paymentRef || 'unknown');

  const paid = order.status === 'paid';
  const paymentStatus: PaymentConfirmationStatus =
    options.paymentStatus ?? (paid ? 'Confirmed' : 'Pending');
  const badgeStatus: ReceiptBadgeStatus =
    options.badgeStatus ?? (paid ? 'PAID' : 'PENDING');

  return {
    receiptNumber: formatReceiptNumberForHeader(receiptId),
    footerReceiptNumber: receiptId,
    badgeStatus,
    customer: {
      name: order.customerName || 'Customer',
      email: order.customerEmail || '',
      phone: order.customerPhone || '',
    },
    deliveryAddress: {
      street: order.address || '',
      city: order.city || '',
      stateCountry: promo ? 'Nigeria' : `${order.state || 'Adamawa'}, Nigeria`,
    },
    location: options.location ?? {
      city: order.city || 'Yola',
      state: order.state || 'Adamawa',
    },
    items: receiptItems,
    deliveryAreaLabel: promo ? 'arranged on delivery' : order.city || 'Yola',
    deliveryFee,
    vatRate,
    currencySymbol: '₦',
    payment: {
      method:
        order.paymentMethod === 'transfer'
          ? 'Bank Transfer'
          : order.paymentMethod === 'bank'
            ? 'Bank Transfer'
            : order.paymentMethod === 'ussd'
              ? 'USSD'
              : order.paymentMethod === 'cash'
                ? 'Cash'
                : order.paymentMethod === 'manual'
                  ? 'Manual / Other'
                  : 'Squad Payment Gateway',
      transactionReference: order.paymentRef || 'Pending',
      status: paymentStatus,
    },
    store: {
      brandPrimary: 'ABKHD',
      brandAccent: 'Store',
      subtitle: 'Premium Tech Electronics',
      tagline: 'SMARTER TECH. BETTER LIVING.',
      hoursLine1: 'Mon – Sat: 9AM – 8PM',
      hoursLine2: 'Sun: 10AM – 6PM',
      warrantyTitle: warranty.title,
      warrantySubtitle: warranty.subtitle,
      returnsTitle: 'Returns within',
      returnsSubtitle: '7 days',
      supportMessage: 'Questions? Message us on our store for support.',
    },
    subtotalOverride: subtotal,
    vatAmountOverride: vatAmount,
    totalAmountOverride: totalAmount,
  };
}

/**
 * Build receipt data straight from checkout form values + cart items.
 * Totals mirror exactly what the customer was charged.
 */
export function buildReceiptFromCheckout(
  formData: Record<string, any>,
  cartItems: CartItem[],
  paymentRef: string,
  options: ReceiptMappingOptions & { paymentStatus?: 'paid' | 'pending' } = {}
): ReceiptData {
  const paid = (options.paymentStatus ?? 'paid') === 'paid';

  const mockOrder: Partial<Order> = {
    customerName: formData.fullName || '',
    customerEmail: formData.email || '',
    customerPhone: formData.phone || '',
    address: formData.address || '',
    city: formData.city || 'Yola',
    state: formData.state || 'Adamawa',
    postalCode: formData.postalCode || '',
    paymentRef,
    paymentMethod: 'card',
    status: paid ? 'paid' : 'pending',
    receiptId: options.receiptId,
  };

  return mapOrderToReceipt(mockOrder, cartItems, {
    ...options,
    paymentStatus: paid ? 'Confirmed' : 'Pending',
    badgeStatus: paid ? 'PAID' : 'PENDING',
  });
}
