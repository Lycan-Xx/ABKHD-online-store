export interface CartItem {
  cartId: string;
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export type ShippingCity = 'Yola' | 'Jimeta';

export const SHIPPING_FEES: Record<ShippingCity, number> = {
  Yola: 1000,
  Jimeta: 2000,
};
