# ABKHD Online Store - Astro Refactoring Project Plan

**Project:** ABKHD Online Store - E-commerce platform  
**Current State:** React/Vite → Astro 5 migration (B- grade, needs refactoring)  
**Target State:** Production-ready Astro 5 ecommerce with full best practices  
**Plan Date:** 2026-04-04  
**Reference:** [Astro 5 Documentation](https://docs.astro.build/en/getting-started/)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Phase 1: Cleanup - Remove Unused Dependencies](#2-phase-1-cleanup---remove-unused-dependencies)
3. [Phase 2: Project Structure Refactoring](#3-phase-2-project-structure-refactoring)
4. [Phase 3: Centralized State Management](#4-phase-3-centralized-state-management)
5. [Phase 4: Cart System Overhaul](#5-phase-4-cart-system-overhaul)
6. [Phase 5: Astro Best Practices Compliance](#5-phase-5-astro-best-practices-compliance)
7. [Phase 6: API Design & Error Handling](#6-phase-6-api-design--error-handling)
8. [Phase 7: CSS Architecture](#7-phase-7-css-architecture)
9. [Phase 8: Type Safety](#8-phase-8-type-safety)
10. [Implementation Order & Timeline](#9-implementation-order--timeline)

---

## 1. Executive Summary

### Current Problems
- Memory leaks from event listener accumulation
- Duplicate cart and dark mode logic across 3-5 files
- Unused React dependencies inflating bundle
- No centralized state management
- Deviating from Astro 5 patterns (using deprecated `astro:page-load`)
- Scattered TypeScript types with `any` overuse
- No proper error handling patterns
- Inconsistent CSS (inline `<style>` blocks in components)

### Target Architecture

```
src/
├── actions/              # Astro 5 actions for form handling
├── components/
│   ├── cart/            # NEW: Cart-specific components
│   ├── checkout/        # NEW: Checkout-specific components
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   └── ui/              # Reusable UI primitives
├── env.d.ts             # Type-safe environment variables
├── lib/
│   ├── appwrite.ts      # Appwrite client (optimized)
│   ├── cart.ts          # NEW: Centralized cart utilities
│   ├── dark-mode.ts     # NEW: Centralized dark mode
│   ├── squad.ts         # Squad REST API client
│   ├── stock.ts         # Stock management
│   └── upload.ts        # Upload with caching
├── pages/
│   ├── api/             # REST endpoints
│   ├── admin/           # Admin panel
│   └── products/        # Product pages
├── stores/
│   └── cart.ts          # Nano Stores for cart state
├── styles/
│   └── global.css       # Design tokens + base styles
└── types/
    ├── cart.ts           # Cart type definitions
    ├── product.ts        # Product type definitions
    └── order.ts          # Order type definitions
```

---

## 2. Phase 1: Cleanup - Remove Unused Dependencies

### 2.1 Remove React Dependencies

**Reference:** [Astro Integrations](https://docs.astro.build/en/guides/integrations-guide/)

**Packages to Remove:**
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.13.1",
  "@types/react": "^18.3.12",
  "@types/react-dom": "^18.3.1"
}
```

**Files to Modify:**
- `package.json` - Remove dependencies
- `astro.config.mjs` - Remove React integration
- `tsconfig.json` - Remove React JSX settings

**Steps:**
```bash
# 1. Remove from package.json
yarn remove react react-dom react-router-dom @types/react @types/react-dom

# 2. Remove React integration from astro.config.mjs
# Before:
import react from '@astrojs/react';
export default defineConfig({
  integrations: [react(), tailwind({...})],
});

# After:
export default defineConfig({
  integrations: [tailwind({...})],
});

# 3. Update tsconfig.json
# Remove: "jsx": "react-jsx" and "jsxImportSource": "react"
```

### 2.2 Remove Other Unused Dependencies

**Packages to Remove:**
```json
{
  "lucide-react": "^0.263.1",
  "@squadco/js": "^1.3.7"  # Using REST API instead
}
```

**Packages to Add:**
```json
{
  "nanostores": "^0.10.0",    # For centralized state
  "zod": "^3.22.0"           # For API validation
}
```

### 2.3 Remove Stale Code

**Files to Delete:**
- `src/pages/HomePage.jsx` - Unused React component

**Comments to Update:**
```typescript
// products/[id].astro:394
// Before: // Add to cart functionality - dispatch event to React cart
// After:  // Add to cart functionality - dispatch event for cart update

// products/[id].astro:484
// Before: // Dispatch custom event for React cart
// After:  // Dispatch custom event for cart drawer

// ProductCard.astro:125
// Before: // Dispatch event for React cart
// After:  // Dispatch event for cart drawer
```

---

## 3. Phase 2: Project Structure Refactoring

### 3.1 Create New Directory Structure

**Reference:** [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/)

```
# Create new directories
mkdir -p src/components/cart
mkdir -p src/components/checkout
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/stores
mkdir -p src/types
```

### 3.2 Move and Refactor Components

| Current Location | New Location | Purpose |
|-----------------|---------------|---------|
| `CartDrawer.astro` | `src/components/cart/CartDrawer.astro` | Cart drawer UI |
| `ProductCard.astro` | `src/components/ui/ProductCard.astro` | Product display |
| `ProductGrid.astro` | `src/components/ui/ProductGrid.astro` | Product grid |
| `Header.astro` | `src/components/layout/Header.astro` | Site header |
| `Footer.astro` | `src/components/layout/Footer.astro` | Site footer |
| `MobileMenu.astro` | `src/components/layout/MobileMenu.astro` | Mobile nav |
| `CertificationFlow.astro` | `src/components/ui/CertificationFlow.astro` | Trust badges |

### 3.3 Centralize Type Definitions

**Reference:** [TypeScript in Astro](https://docs.astro.build/en/guides/typescript/)

**Create `src/types/cart.ts`:**
```typescript
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
```

**Create `src/types/product.ts`:**
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Computers' | 'Mobile Phones' | 'Accessories';
  description: string;
  image: string;
  images: string[];
  videos?: string[];
  stock: number;
  verified: boolean;
  brand?: string;
  featured: boolean;
  sizes?: string[];
  colors?: string[];
  createdAt?: string;
}
```

**Create `src/types/order.ts`:**
```typescript
import type { CartItem } from './cart';

export interface Order {
  $id: string;
  customer: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: string; // JSON stringified CartItem[]
  total: number;
  totalAmount: number;
  paymentRef: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  paymentMethod: 'card' | 'bank' | 'ussd' | 'transfer';
  createdAt: string;
}
```

**Create `src/types/index.ts`:**
```typescript
export * from './cart';
export * from './product';
export * from './order';
```

---

## 4. Phase 3: Centralized State Management

### 4.1 Install Nano Stores

**Reference:** [Nano Stores](https://docs.astro.build/en/recipes/sharing-state-islands/)

```bash
yarn add nanostores
```

### 4.2 Create Cart Store

**Create `src/stores/cart.ts`:**
```typescript
import { atom, map } from 'nanostores';
import type { CartItem } from '../types/cart';

// Core cart state
export const $cartItems = map<Record<string, CartItem>>({});
export const $isCartOpen = atom<boolean>(false);

// Computed values (these are functions, not stores)
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
  
  // Persist to localStorage
  persistCart();
}

export function removeFromCart(cartId: string): void {
  const entries = Object.entries($cartItems.get());
  const key = entries.find(([, item]) => item.cartId === cartId)?.[0];
  if (key) {
    const { [key]: _, ...rest } = $cartItems.get();
    $cartItems.set(rest);
    persistCart();
  }
}

export function updateQuantity(cartId: string, delta: number): void {
  const entries = Object.entries($cartItems.get());
  const key = entries.find(([, item]) => item.cartId === cartId)?.[0];
  if (!key) return;
  
  const existing = $cartItems.get()[key];
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
  // Dispatch event for cross-component sync
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export function loadCartFromStorage(): void {
  try {
    const stored = localStorage.getItem('cart');
    if (!stored) return;
    
    const items: CartItem[] = JSON.parse(stored);
    const map: Record<string, CartItem> = {};
    items.forEach(item => {
      const key = `${item.id}-${item.size || 'default'}-${item.color || 'default'}`;
      map[key] = item;
    });
    $cartItems.set(map);
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
  }
}

// Initialize cart on load
if (typeof window !== 'undefined') {
  loadCartFromStorage();
  
  // Listen for storage changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
      loadCartFromStorage();
    }
  });
  
  // Listen for add-to-cart events from other components
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
```

### 4.3 Create Dark Mode Store

**Create `src/stores/dark-mode.ts`:**
```typescript
import { atom } from 'nanostores';

export const $isDarkMode = atom<boolean>(false);

export function initDarkMode(): void {
  // Check localStorage first
  const stored = localStorage.getItem('darkMode');
  if (stored !== null) {
    $isDarkMode.set(stored === 'true');
  } else {
    // Check system preference
    $isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  
  // Apply to document
  applyDarkMode();
}

export function toggleDarkMode(): void {
  const newValue = !$isDarkMode.get();
  $isDarkMode.set(newValue);
  localStorage.setItem('darkMode', String(newValue));
  applyDarkMode();
}

export function applyDarkMode(): void {
  if ($isDarkMode.get()) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Listen for changes and apply
$isDarkMode.subscribe(() => {
  applyDarkMode();
});
```

---

## 5. Phase 4: Cart System Overhaul

### 5.1 Remove Duplicate Cart Logic

**Files to modify:**
- `src/components/cart/CartDrawer.astro` - Use store
- `src/pages/checkout.astro` - Use store
- `src/components/layout/Header.astro` - Use store for count

### 5.2 Create Cart Utility Module

**Create `src/lib/cart.ts`:**
```typescript
import type { CartItem, ShippingCity } from '../types/cart';
import { SHIPPING_FEES } from '../types/cart';

export function formatPrice(price: number): string {
  return '₦' + price.toLocaleString('en-NG');
}

export function getCartFromStorage(): CartItem[] {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  localStorage.setItem('cart', JSON.stringify(items));
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateShipping(items: CartItem[], city: ShippingCity | ''): number {
  if (!city) return 0;
  return SHIPPING_FEES[city] ?? 0;
}

export function calculateTotal(items: CartItem[], city: ShippingCity | ''): number {
  return calculateSubtotal(items) + calculateShipping(items, city);
}

export function buildWhatsAppMessage(items: CartItem[], city: ShippingCity | '', total: number): string {
  if (!items.length) return '';
  
  let msg = 'Hello ABKHD, I want to order:%0A%0A';
  items.forEach(i => {
    msg += `- ${i.name} x${i.quantity} = ${formatPrice(i.price * i.quantity)}%0A`;
  });
  msg += `%0AShipping: ${calculateShipping(items, city) ? formatPrice(calculateShipping(items, city)) : 'TBD'}`;
  msg += `%0ATotal: ${formatPrice(total)}%0A%0APlease confirm availability.`;
  return msg;
}
```

### 5.3 Update Components to Use Store

**Example: `src/components/layout/Header.astro`**
```astro
---
import CartDrawer from '../cart/CartDrawer.astro';
import MobileMenu from './MobileMenu.astro';
---

<!-- Remove duplicate dark mode and cart count logic -->

<script>
  import { initDarkMode } from '../../stores/dark-mode';
  import { $isCartOpen, openCart, $cartItems, getCartCount } from '../../stores/cart';
  
  // Initialize dark mode once
  initDarkMode();
  
  // Update cart count reactively
  function updateCartBadge() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
      const count = getCartCount();
      cartCountEl.textContent = count.toString();
      cartCountEl.classList.toggle('hidden', count === 0);
    }
  }
  
  // Initial update
  updateCartBadge();
  
  // Subscribe to cart changes
  $cartItems.subscribe(() => updateCartBadge());
  
  // Cart toggle
  document.getElementById('cart-toggle')?.addEventListener('click', () => {
    openCart();
  });
</script>
```

---

## 6. Phase 5: Astro Best Practices Compliance

### 6.1 Fix Event Listener Pattern

**Reference:** [View Transitions](https://docs.astro.build/en/guides/view-transitions/)

**CORRECT Pattern for Astro 5:**
```typescript
// Use astro:after-swap (fires after DOM swap, before renders)
document.addEventListener('astro:after-swap', () => {
  // Re-initialize component-specific listeners here
  initComponent();
});

// Do NOT use DOMContentLoaded or astro:page-load for repeated initialization
```

**WRONG Pattern (current - causes memory leaks):**
```typescript
// DO NOT DO THIS - listeners accumulate on each navigation
document.addEventListener('DOMContentLoaded', () => { init(); });
document.addEventListener('astro:page-load', () => { init(); });
```

### 6.2 Create Reusable Initialization Helper

**Create `src/lib/init.ts`:**
```typescript
/**
 * Initializes a component on the client side.
 * Handles both initial page load and view transitions.
 * 
 * @param initFn - Function to run on initialization
 * @returns Cleanup function to be called on astro:before-swap
 */
export function createInitializer(initFn: () => void | (() => void)): void {
  let cleanup: void | (() => void);
  
  const setup = () => {
    if (cleanup) cleanup(); // Clean up previous if exists
    cleanup = initFn() as void | (() => void);
  };
  
  // Run on initial load and after each swap
  document.addEventListener('astro:after-swap', setup);
  
  // Also run now if document is already ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setup();
  }
}

/**
 * Initialize on first swap only (for one-time setup)
 */
export function initOnce(initFn: () => void): void {
  const wrapper = () => {
    initFn();
    document.removeEventListener('astro:after-swap', wrapper);
  };
  document.addEventListener('astro:after-swap', wrapper);
  
  // Run now if ready
  if (document.readyState !== 'loading') {
    wrapper();
  }
}
```

### 6.3 Update All Components

**Pattern to apply across all interactive components:**

```typescript
// BEFORE (WRONG):
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});
document.addEventListener('astro:page-load', () => {
  setupEventListeners(); // Memory leak!
});

// AFTER (CORRECT):
import { createInitializer } from '../../lib/init';

createInitializer(() => {
  setupEventListeners();
  
  // Return cleanup function
  return () => {
    removeEventListeners();
  };
});
```

---

## 7. Phase 6: API Design & Error Handling

### 7.1 Squad REST API Client

**Create `src/lib/squad.ts`:**
```typescript
import { z } from 'zod';

const SQUAD_ENV = import.meta.env.PROD 
  ? 'https://api-d.squadco.com'
  : 'https://sandbox-api-d.squadco.com';

const PUBLIC_KEY = import.meta.env.PUBLIC_SQUAD_PUBLIC_KEY;
const SECRET_KEY = import.meta.env.SQUAD_SECRET_KEY;

// Validation schemas
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

export interface WebhookPayload {
  transaction_ref: string;
  transaction_status: 'success' | 'failed' | 'pending';
  transaction_amount: number;
  email: string;
}

export class SquadAPI {
  private publicKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    if (!PUBLIC_KEY || !SECRET_KEY) {
      throw new Error('Squad API keys not configured');
    }
    this.publicKey = PUBLIC_KEY;
    this.secretKey = SECRET_KEY;
    this.baseUrl = SQUAD_ENV;
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<PaymentResponse> {
    const validated = InitiatePaymentSchema.parse(input);
    
    const response = await fetch(`${this.baseUrl}/transaction/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': this.secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validated.email,
        amount: Math.round(validated.amount * 100), // Convert to kobo
        initiate_type: 'inline',
        currency: 'NGN',
        customer_name: validated.customerName,
        callback_url: `${new URL(request.url).origin}/checkout`,
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
    
    if (data.status === false) {
      return {
        success: false,
        message: data.message || 'Payment initiation failed',
      };
    }

    return {
      success: true,
      message: 'Payment initiated successfully',
      data: {
        checkout_url: data.data.checkout_url,
        transaction_ref: data.data.transaction_ref,
      },
    };
  }
}

// Singleton instance
let squadInstance: SquadAPI | null = null;

export function getSquadAPI(): SquadAPI {
  if (!squadInstance) {
    squadInstance = new SquadAPI();
  }
  return squadInstance;
}
```

### 7.2 Update API Endpoint

**Refactor `src/pages/api/squad-initiate.ts`:**
```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSquadAPI, InitiatePaymentSchema } from '../../lib/squad';
import { APPWRITE_DB_ID, APPWRITE_ORDERS_COLLECTION_ID, databases, ID } from '../../lib/appwrite';
import { reduceMultipleProductsStock } from '../../lib/stock';

const CreateOrderSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  customerName: z.string().min(1),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string().optional(),
  items: z.array(z.any()),
  transactionRef: z.string(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = CreateOrderSchema.parse(body);
    
    const squad = getSquadAPI();
    const paymentResult = await squad.initiatePayment({
      email: validated.email,
      amount: validated.amount,
      customerName: validated.customerName,
      phone: validated.phone,
      address: validated.address,
      city: validated.city,
      state: validated.state,
      postalCode: validated.postalCode,
      items: validated.items,
      transactionRef: validated.transactionRef,
    });

    if (!paymentResult.success || !paymentResult.data) {
      return new Response(JSON.stringify({ 
        error: paymentResult.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      checkoutUrl: paymentResult.data.checkout_url 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Squad payment error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request data',
        details: error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Payment initialization failed' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### 7.3 Appwrite Client Optimization

**Refactor `src/lib/appwrite.ts`:**
```typescript
import { Client, Databases, Storage, Teams, Account, ID } from 'appwrite';

// Initialize client
export const client = new Client()
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID || '');

// Services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export const account = new Account(client);

// Constants
export const APPWRITE_DB_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
export const APPWRITE_PRODUCTS_COLLECTION_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_PRODUCTS || 'products';
export const APPWRITE_ORDERS_COLLECTION_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_ORDERS || 'orders';
export const APPWRITE_IMAGES_BUCKET_ID = import.meta.env.PUBLIC_APPWRITE_BUCKET_IMAGES || 'product-images';

// Development-only ping (remove in production)
if (import.meta.env.DEV) {
  client.ping()
    .then(() => console.log('✅ Appwrite connected'))
    .catch((err) => console.error('❌ Appwrite connection failed:', err));
}

export { ID };
```

### 7.4 Error Handling Patterns

**Create `src/lib/errors.ts`:**
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'PAYMENT_ERROR', 402, details);
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTH_ERROR', 401);
  }
}

export function handleAPIError(error: unknown): Response {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return new Response(JSON.stringify({
      error: error.message,
      code: error.code,
      details: error.details,
    }), {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (error instanceof Error) {
    return new Response(JSON.stringify({
      error: 'An unexpected error occurred',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({
    error: 'An unknown error occurred',
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 8. Phase 7: CSS Architecture

### 8.1 Centralized CSS Strategy

**Reference:** [Astro Styles](https://docs.astro.build/en/guides/styling/)

**Philosophy:** Use Tailwind for component-level utility classes. Use a centralized `global.css` for:
- CSS custom properties (design tokens)
- Base element styles
- Tailwind layer configurations

### 8.2 Refactor `src/styles/global.css`

```css
/* src/styles/global.css */

/* ===========================
   TAILWIND BASE CONFIGURATION
   =========================== */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===========================
   DESIGN TOKENS (CSS VARS)
   =========================== */
:root {
  /* Primary brand colors */
  --color-primary: 220 90% 56%;
  --color-primary-foreground: 0 0% 100%;
  
  /* Semantic colors */
  --color-background: 0 0% 100%;
  --color-foreground: 222 47% 11%;
  --color-card: 0 0% 100%;
  --color-muted: 210 40% 96%;
  --color-muted-foreground: 215 16% 47%;
  --color-border: 214 32% 91%;
  
  /* Verification badge */
  --color-verified: 142 71% 45%;
  
  /* Warning/Alert */
  --color-warning: 38 92% 50%;
  
  /* Radius tokens */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark mode overrides */
.dark {
  --color-background: 222 47% 11%;
  --color-foreground: 210 40% 98%;
  --color-card: 222 47% 14%;
  --color-muted: 217 33% 17%;
  --color-muted-foreground: 215 20% 65%;
  --color-border: 217 33% 20%;
}

/* ===========================
   BASE STYLES
   =========================== */
@layer base {
  *,
  *::before,
  *::after {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  /* Focus styles */
  :focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
  }
}

/* ===========================
   COMPONENT CLASSES
   =========================== */
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3;
    @apply bg-primary text-primary-foreground font-semibold rounded-md;
    @apply transition-all duration-200;
    @apply hover:opacity-90 hover:-translate-y-0.5;
    @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
  }
  
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 px-6 py-3;
    @apply border border-border bg-card text-foreground font-medium rounded-md;
    @apply transition-all duration-200;
    @apply hover:border-primary hover:bg-primary/5;
  }
  
  .card {
    @apply bg-card border border-border rounded-lg shadow-sm;
  }
  
  .input {
    @apply w-full px-4 py-3;
    @apply border border-border rounded-md bg-background;
    @apply transition-colors duration-200;
    @apply focus:border-primary focus:ring-2 focus:ring-primary/20;
  }
  
  .verified-badge {
    @apply inline-flex items-center gap-1 px-2 py-0.5;
    @apply bg-verified/10 text-verified text-xs font-semibold rounded-full;
  }
}

/* ===========================
   ANIMATIONS
   =========================== */
@layer utilities {
  .animate-fade-up {
    animation: fadeUp 0.3s ease-out forwards;
  }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
}
```

### 8.3 Update Tailwind Config

**Reference:** [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)**

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
        verified: 'hsl(var(--color-verified))',
        warning: 'hsl(var(--color-warning))',
        border: 'hsl(var(--color-border))',
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### 8.4 Remove Inline Component Styles

After centralizing CSS, remove all `<style>` blocks from components except for:
- Component-specific animations
- Complex selectors that can't be done with Tailwind
- Scoped styles that shouldn't leak

**Pattern:**
```astro
---
// Component without inline styles (use Tailwind classes)
import Button from './Button.astro';
---

<Button class="btn-primary">Click me</Button>

<!-- Styles moved to global.css -->
```

---

## 9. Phase 8: Type Safety

### 9.1 Update TypeScript Config

**Reference:** [Astro TypeScript](https://docs.astro.build/en/guides/typescript/)

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@lib/*": ["src/lib/*"],
      "@stores/*": ["src/stores/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

### 9.2 Update env.d.ts

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APPWRITE_ENDPOINT: string;
  readonly PUBLIC_APPWRITE_PROJECT_ID: string;
  readonly PUBLIC_APPWRITE_DATABASE_ID: string;
  readonly PUBLIC_APPWRITE_COLLECTION_PRODUCTS: string;
  readonly PUBLIC_APPWRITE_COLLECTION_ORDERS: string;
  readonly PUBLIC_APPWRITE_BUCKET_IMAGES: string;
  readonly PUBLIC_SQUAD_PUBLIC_KEY: string;
  readonly SQUAD_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 10. Implementation Order & Timeline

### Phase 1: Cleanup (Day 1)
- [ ] Remove React dependencies from package.json
- [ ] Remove React integration from astro.config.mjs
- [ ] Update tsconfig.json
- [ ] Delete src/pages/HomePage.jsx
- [ ] Update stale comments referencing React

### Phase 2: Structure & Types (Day 1-2)
- [ ] Create new directory structure
- [ ] Create centralized type definitions
- [ ] Update tsconfig.json with path aliases

### Phase 3: State Management (Day 2-3)
- [ ] Install nanostores
- [ ] Create cart store
- [ ] Create dark mode store
- [ ] Refactor CartDrawer to use store
- [ ] Refactor Header to use store

### Phase 4: CSS Architecture (Day 3)
- [ ] Refactor global.css with design tokens
- [ ] Update tailwind.config.js
- [ ] Remove inline component styles (where possible)

### Phase 5: Best Practices (Day 3-4)
- [ ] Create src/lib/init.ts helper
- [ ] Update all components to use correct event pattern
- [ ] Fix memory leaks in CartDrawer, Header, MobileMenu, AdminLayout

### Phase 6: API & Error Handling (Day 4-5)
- [ ] Create src/lib/squad.ts API client
- [ ] Refactor squad-initiate endpoint
- [ ] Create src/lib/errors.ts
- [ ] Add proper error handling to all API endpoints
- [ ] Optimize Appwrite client (remove production ping)

### Phase 7: Final Polish (Day 5)
- [ ] Verify all functionality works
- [ ] Run type check
- [ ] Run build
- [ ] Test on preview deployment

---

## References

| Topic | URL |
|-------|-----|
| Astro Documentation | https://docs.astro.build |
| Astro Project Structure | https://docs.astro.build/en/basics/project-structure/ |
| Astro View Transitions | https://docs.astro.build/en/guides/view-transitions/ |
| Astro Integrations | https://docs.astro.build/en/guides/integrations-guide/ |
| Astro TypeScript | https://docs.astro.build/en/guides/typescript/ |
| Astro Actions | https://docs.astro.build/en/guides/actions/ |
| Nano Stores | https://docs.astro.build/en/recipes/sharing-state-islands/ |
| Tailwind CSS | https://tailwindcss.com/docs |
| Zod Validation | https://zod.dev |
| Squad API Docs | https://docs.squadco.com |

---

## Appendix: File Change Summary

### New Files to Create
```
src/
├── lib/
│   ├── cart.ts          # Cart utilities
│   ├── squad.ts         # Squad API client
│   ├── errors.ts        # Error handling
│   └── init.ts          # Initialization helpers
├── stores/
│   ├── cart.ts          # Nano store for cart
│   └── dark-mode.ts     # Nano store for dark mode
├── types/
│   ├── cart.ts
│   ├── product.ts
│   ├── order.ts
│   └── index.ts
└── styles/
    └── global.css       # Refactored with design tokens
```

### Files to Modify
```
src/
├── astro.config.mjs     # Remove React integration
├── tailwind.config.js   # Update with design tokens
├── tsconfig.json        # Add path aliases
├── env.d.ts            # Add env types
└── components/
    ├── cart/CartDrawer.astro    # Use store
    ├── layout/Header.astro      # Use store
    └── ... (all components)    # Fix event patterns
```

### Files to Delete
```
src/pages/HomePage.jsx
```

---

*Plan created: 2026-04-04*
*Last updated: 2026-04-04*
