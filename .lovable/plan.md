

## ABKHD Store - Astro Refactoring Plan

This plan implements the refactoring document you provided, adapted to the actual current state of the codebase. Some items from your plan (like deleting `HomePage.jsx`) are already done or unnecessary.

---

### Phase 1: Cleanup (Est. 30 min)

**Remove unused dependencies** from `package.json`:
- `react`, `react-dom`, `react-router-dom`, `@types/react`, `@types/react-dom` -- not imported anywhere in `.astro`/`.ts` files
- `lucide-react` -- unused (project uses Bootstrap Icons)
- `@squadco/js` -- will be replaced with REST API client

**Remove React integration** from `astro.config.mjs` (remove `@astrojs/react` import and from integrations array). Remove `vite.optimizeDeps.exclude` for `lucide-react`.

**Update `tsconfig.json`**: Remove `"jsx": "react-jsx"` and `"jsxImportSource": "react"`.

**Add new dependencies**: `nanostores` (state management), `zod` (API validation).

**Fix existing build errors** in `scripts/` files (3 TypeScript errors in check-appwrite-permissions, migrate, update-bucket-settings).

**Note**: `HomePage.jsx` does not exist -- no deletion needed.

---

### Phase 2: Project Structure & Types (Est. 45 min)

**Create directories**: `src/components/cart/`, `src/components/layout/`, `src/components/ui/`, `src/stores/`, `src/types/`

**Move components** to organized subdirectories:
- `CartDrawer.astro` → `components/cart/`
- `Header.astro`, `Footer.astro`, `MobileMenu.astro` → `components/layout/`
- `ProductCard.astro`, `ProductGrid.astro`, `CertificationFlow.astro` → `components/ui/`

**Update all import paths** in layouts and pages referencing moved components.

**Create type definition files**: `src/types/cart.ts`, `src/types/product.ts`, `src/types/order.ts`, `src/types/index.ts` with the interfaces from your plan.

---

### Phase 3: Centralized State Management (Est. 1 hr)

**Create `src/stores/cart.ts`** using Nano Stores (`atom`, `map`) with:
- Cart state (`$cartItems`, `$isCartOpen`)
- Actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `openCart`, `closeCart`
- localStorage persistence and cross-tab sync
- `add-to-cart` custom event listener for backward compatibility

**Create `src/stores/dark-mode.ts`** using Nano Stores:
- `$isDarkMode` atom with localStorage + system preference detection
- `toggleDarkMode()` and `applyDarkMode()` functions

**Create `src/lib/cart.ts`** with shared utilities: `formatPrice`, `calculateSubtotal`, `calculateShipping`, `calculateTotal`, `buildWhatsAppMessage`.

**Refactor components** to use stores instead of duplicated inline logic:
- `Header.astro` -- subscribe to `$cartItems` for count, use dark mode store
- `CartDrawer.astro` -- subscribe to `$cartItems` and `$isCartOpen`
- `checkout.astro` -- use cart store and utilities

---

### Phase 4: Fix Event Listener Pattern (Est. 45 min)

**Create `src/lib/init.ts`** with `createInitializer()` helper that properly handles cleanup on navigation.

**Refactor all 3 components** (`Header.astro`, `CartDrawer.astro`, `MobileMenu.astro`) that currently use the broken `DOMContentLoaded` + `astro:page-load` double-registration pattern. Replace with proper `astro:after-swap` pattern with cleanup functions to prevent memory leaks.

---

### Phase 5: API & Error Handling (Est. 1 hr)

**Create `src/lib/squad.ts`** -- REST API client replacing `@squadco/js` SDK. Uses `fetch()` directly against Squad API with Zod validation.

**Create `src/lib/errors.ts`** -- Centralized error classes (`AppError`, `ValidationError`, `NotFoundError`, `PaymentError`) and `handleAPIError()` utility.

**Refactor `src/pages/api/squad-initiate.ts`** to use new Squad client and Zod validation.

**Refactor `src/pages/api/squad-webhook.ts`** to use error handling utilities.

**Optimize `src/lib/appwrite.ts`** -- remove hardcoded project ID fallback, make ping dev-only.

---

### Phase 6: CSS & Config Polish (Est. 30 min)

**Refactor `src/styles/global.css`** -- the existing file is already well-structured with design tokens. Minor additions: focus-visible styles, additional component classes (`card`, `input`), animation utilities.

**Update `tailwind.config.js`** -- switch to ESM export, clean up config. Keep existing color system (it works well).

**Update `src/env.d.ts`** with correct Appwrite/Squad env var types (replace old `VITE_` prefixed vars).

**Update `tsconfig.json`** with additional path aliases (`@components/*`, `@lib/*`, `@stores/*`, `@types/*`).

---

### Technical Details

**Files to create** (10 new files):
- `src/types/cart.ts`, `src/types/product.ts`, `src/types/order.ts`, `src/types/index.ts`
- `src/stores/cart.ts`, `src/stores/dark-mode.ts`
- `src/lib/cart.ts`, `src/lib/squad.ts`, `src/lib/errors.ts`, `src/lib/init.ts`

**Files to modify** (~12 files):
- `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`
- `src/styles/global.css`, `tailwind.config.js`
- `src/components/Header.astro`, `src/components/CartDrawer.astro`, `src/components/MobileMenu.astro`
- `src/pages/api/squad-initiate.ts`, `src/pages/api/squad-webhook.ts`
- `src/lib/appwrite.ts`
- All pages/layouts with updated import paths after component moves

**Files to delete**: None (HomePage.jsx doesn't exist)

**Stale comment updates**: References to "React cart" in `products/[id].astro` and `ProductCard.astro` will be updated.

