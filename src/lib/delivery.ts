/**
 * Shared delivery timeline options. Values are stored on products (and copied
 * onto cart lines / orders) while labels are safe to change at any time.
 */
export const DELIVERY_OPTIONS = [
  { value: 'same-day', label: 'Same day', short: 'Same day' },
  { value: '1-2d', label: '1–2 business days', short: '1–2 days' },
  { value: '3-5d', label: '3–5 business days', short: '3–5 days' },
  { value: '1-2w', label: '1–2 weeks', short: '1–2 weeks' },
  { value: '2-4w', label: '2–4 weeks', short: '2–4 weeks' },
  { value: 'contact', label: 'Contact us for timeline', short: 'Contact us' },
] as const;

export type DeliveryEstimate = (typeof DELIVERY_OPTIONS)[number]['value'];

export function getDeliveryOption(value?: string | null) {
  if (!value) return null;
  return DELIVERY_OPTIONS.find((option) => option.value === value) ?? null;
}

/** Human-readable label, or null when the product has no timeline set. */
export function getDeliveryLabel(value?: string | null): string | null {
  return getDeliveryOption(value)?.label ?? null;
}

/** Compact label for tight spaces (product cards). */
export function getDeliveryShortLabel(value?: string | null): string | null {
  return getDeliveryOption(value)?.short ?? null;
}
