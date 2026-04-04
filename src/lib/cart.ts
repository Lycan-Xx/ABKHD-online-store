import type { CartItem, ShippingCity } from '../types/cart';
import { SHIPPING_FEES } from '../types/cart';

export function formatPrice(price: number): string {
  return '₦' + price.toLocaleString('en-NG');
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateShipping(city: ShippingCity | ''): number {
  if (!city) return 0;
  return SHIPPING_FEES[city as ShippingCity] ?? 0;
}

export function calculateTotal(items: CartItem[], city: ShippingCity | ''): number {
  return calculateSubtotal(items) + calculateShipping(city);
}

export function buildWhatsAppMessage(items: CartItem[], city: ShippingCity | '', total: number): string {
  if (!items.length) return '';

  let msg = 'Hello ABKHD, I want to order:%0A%0A';
  items.forEach(i => {
    msg += `- ${i.name} x${i.quantity} = ${formatPrice(i.price * i.quantity)}%0A`;
  });
  const shipping = calculateShipping(city);
  msg += `%0AShipping: ${shipping ? formatPrice(shipping) : 'TBD'}`;
  msg += `%0ATotal: ${formatPrice(total)}%0A%0APlease confirm availability.`;
  return msg;
}
