import { atom, map } from 'nanostores';
import type { CartItem } from '../types/cart';

// Core cart state
export const $cartItems = map<Record<string, CartItem>>({});
export const $isCartOpen = atom<boolean>(false);

// Computed values
export function getCartItemsArray(): CartItem[] {
  return Object.values($cartItems.get());
}

export function getCartCount(): number {
  return getCartItemsArray().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(): number {
  return getCartItemsArray().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Actions
export function addToCart(item: Omit<CartItem, 'cartId'>): void {
  const key = `${item.id}-${item.size || 'default'}-${item.color || 'default'}`;
  const existing = $cartItems.get()[key];

  if (existing) {
    $cartItems.setKey(key, { ...existing, quantity: existing.quantity + item.quantity });
  } else {
    const cartId = `${key}-${Date.now()}`;
    $cartItems.setKey(key, { ...item, cartId });
  }

  persistCart();
}

export function removeFromCart(cartId: string): void {
  const entries = Object.entries($cartItems.get());
  const entry = entries.find(([, item]) => item.cartId === cartId);
  if (entry) {
    const current = { ...$cartItems.get() };
    delete current[entry[0]];
    $cartItems.set(current);
    persistCart();
  }
}

export function updateQuantity(cartId: string, delta: number): void {
  const entries = Object.entries($cartItems.get());
  const entry = entries.find(([, item]) => item.cartId === cartId);
  if (!entry) return;

  const [key, existing] = entry;
  const newQty = Math.max(1, existing.quantity + delta);
  $cartItems.setKey(key, { ...existing, quantity: newQty });
  persistCart();
}

export function clearCart(): void {
  $cartItems.set({});
  persistCart();
}

export function openCart(): void {
  $isCartOpen.set(true);
}

export function closeCart(): void {
  $isCartOpen.set(false);
}

export function toggleCart(): void {
  $isCartOpen.set(!$isCartOpen.get());
}

// Persistence
function persistCart(): void {
  localStorage.setItem('cart', JSON.stringify(getCartItemsArray()));
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export function loadCartFromStorage(): void {
  try {
    const stored = localStorage.getItem('cart');
    if (!stored) return;

    const items: CartItem[] = JSON.parse(stored);
    const record: Record<string, CartItem> = {};
    items.forEach(item => {
      const key = `${item.id}-${item.size || 'default'}-${item.color || 'default'}`;
      record[key] = item;
    });
    $cartItems.set(record);
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
  }
}

// Initialize cart on load
if (typeof window !== 'undefined') {
  loadCartFromStorage();

  // Cross-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
      loadCartFromStorage();
    }
  });

  // Listen for add-to-cart events from components
  window.addEventListener('add-to-cart', ((e: CustomEvent) => {
    const { product, quantity = 1, size = null, color = null } = e.detail || {};
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0] || '',
      quantity,
      size,
      color,
    });
  }) as EventListener);
}
