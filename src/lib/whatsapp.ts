import { formatPrice } from './utils';
import type { ShowroomProduct } from './showroom';

/** Digits-only WhatsApp number, with the store line as a fallback. */
export function getWhatsAppNumber(): string {
  const configured = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const digits = String(configured).replace(/\D/g, '');
  return digits || '2348085657927';
}

export interface AvailabilityMessageOptions {
  size?: string | null;
  color?: string | null;
  /** Defaults to the current origin in the browser. */
  origin?: string;
}

/** Human-readable availability request sent to the store on WhatsApp. */
export function buildAvailabilityMessage(
  product: ShowroomProduct,
  options: AvailabilityMessageOptions = {}
): string {
  const origin =
    options.origin ??
    (typeof window !== 'undefined' ? window.location.origin : '');

  const priceLine = product.priceIsEstimate
    ? `Estimated ${formatPrice(product.price)}`
    : formatPrice(product.price);

  const variant = [options.color, options.size].filter(Boolean).join(', ');

  const lines = [
    `Hi ABKHD Store, I'd like to check availability for this product:`,
    '',
    `• Name: ${product.name}`,
    `• Category: ${product.category}`,
    `• Price: ${priceLine}`,
  ];

  if (variant) lines.push(`• Option: ${variant}`);
  lines.push(`• Product ID: ${product.id}`);
  if (origin) lines.push(`• Link: ${origin.replace(/\/$/, '')}/products/${product.id}`);
  lines.push('', 'Is it available?');

  return lines.join('\n');
}

export function buildAvailabilityUrl(
  product: ShowroomProduct,
  options: AvailabilityMessageOptions = {}
): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(
    buildAvailabilityMessage(product, options)
  )}`;
}

/** Opens WhatsApp with a prefilled availability request. */
export function openAvailabilityWhatsApp(
  product: ShowroomProduct,
  options: AvailabilityMessageOptions = {}
): void {
  if (typeof window === 'undefined') return;
  window.location.href = buildAvailabilityUrl(product, options);
}
