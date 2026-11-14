# ABKHD Store — "Showroom" UI Redesign: Modification & Refactor Specification

| | |
|---|---|
| **Spec version** | 1.0 |
| **Date** | 2026-11-06 |
| **Branch** | `feat/showroom-ui-redesign` (branched from `main`) |
| **Design source** | `Lycan-Xx/curated-showroom` ("Stuffus" mockup) — copied **exactly**: motion, colors, layout, product detail pattern |
| **Target app** | `Lycan-Xx/ABKHD-online-store` (Astro 5 + Appwrite + Squad, Cloudflare) |
| **Status** | Approved for implementation pending owner sign-off |

---

## 1. Purpose & Scope

This document specifies every change required to restyle the ABKHD storefront so that its user interface **matches the curated-showroom mockup exactly** — layout, monochrome palette, typography, iconography, motion language, and page composition — **without altering any backend behavior**:

- Appwrite (database, storage, auth) integration remains byte-for-byte identical in behavior.
- Squad Co payment flow, order creation, and stock management are untouched logically.
- Admin panel keeps 100% of its functionality; it receives only a token-level reskin.
- Cart, checkout, login, and webhook flows must pass the full regression checklist (§13) before merge.

### 1.1 Locked decisions (owner-confirmed)

| # | Decision | Choice |
|---|----------|--------|
| D1 | Color system | Mockup **monochrome** (oklch near-black on white). ABKHD teal (`173 58% 39%`) is **discarded** everywhere. |
| D2 | Dark mode | **Removed entirely.** Light-only, like the mockup as-shipped. |
| D3 | Ratings & reviews | **Dropped.** No star/review rows anywhere; no Appwrite schema changes. |
| D4 | Search | **Wired to real Appwrite queries** (new `/api/search` endpoint + search UI). |
| D5 | Icons | **Lucide** (`lucide-react` in islands, `lucide-static` in `.astro` components). Bootstrap Icons fully removed. |
| D6 | Branching | All work on `feat/showroom-ui-redesign`. |

### 1.2 Non-goals

- No migration off Astro, no switch to TanStack Start, no change of hosting/adapter.
- No Appwrite schema, index, attribute, bucket, or permission changes.
- No changes to Squad API usage, order lifecycle, or stock-decrement logic.
- No new commerce features (wishlists, accounts for shoppers, etc.) beyond search.

---

## 2. Current State (baseline analysis)

### 2.1 ABKHD (target app)

- **Stack:** Astro `^5.7` (`output: 'server'`), `@astrojs/cloudflare` adapter, Tailwind CSS `3.4.19` (via `@astrojs/tailwind`, `applyBaseStyles: false`), TypeScript.
- **State:** `nanostores` — `src/stores/cart.ts` (cart map + persistence) and `src/stores/dark-mode.ts` (to be removed).
- **Backend:** Appwrite SDK (`src/lib/appwrite.ts`) — products/orders collections, `product-images` bucket, account/teams for admin auth. All product fetching happens **server-side in `.astro` frontmatter** (SSR).
- **Payments:** Squad Co (`src/lib/squad.ts` + `src/pages/api/squad-initiate.ts`, `squad-webhook.ts`, `src/lib/stock-manager.ts`).
- **Styling:** shadcn-style HSL CSS variables in `src/styles/global.css`, mapped in `tailwind.config.js` via `hsl(var(--x))`. Component classes (`.btn-primary`, `.card`, `.product-card`, …) in `@layer components`. Bootstrap Icons via CDN + npm package.
- **Pages:** `/` (hero + featured + certification flow), `/shop` (SSR fetch, category pills, client filter), `/products/[id]` (SSR product + related), `/checkout` (3-step wizard, own scoped `co-*` CSS, 1,329 lines), `/login`, `/about`, `/contact`, `/admin/*` (dashboard, products CRUD, orders), `/api/*`.
- **Theme toggle:** dark-mode inline scripts in `Layout.astro`, `AdminLayout.astro`, `Header.astro`, `MobileMenu.astro` + `stores/dark-mode.ts`.

### 2.2 Mockup (design source)

- **Stack:** TanStack Start, React 19, Tailwind 4 (oklch `@theme` tokens), shadcn/ui components (mostly unused scaffolding), **Framer Motion 12**, lucide-react. No backend; 12 hardcoded products in `src/lib/products.ts`.
- **Design language ("quiet editorial minimalism")** — detailed in §5.
- **What it does NOT have** (we must design in the mockup's language, not copy code): cart, checkout, payments, auth, admin, search backend, real stock/variants, dark mode in practice.

### 2.3 Key architectural facts driving this spec

1. Both apps use **identical shadcn semantic token names** (`background`, `foreground`, `card`, `muted`, `border`, …) — the reskin is largely token-level.
2. Mockup interactivity (filtering, drawers, floats) is Framer-Motion-based; ABKHD has no React. Astro supports **React islands**, so the exact mockup components can run inside ABKHD pages while data still comes from Astro SSR frontmatter.
3. ABKHD's checkout and admin read theme colors through CSS variables — changing `:root` tokens restyles them automatically with zero logic risk.

---

## 3. Target Architecture

### 3.1 Strategy: Astro-first + React islands ("exact copy" mode)

All pages remain **Astro pages with SSR Appwrite fetches in frontmatter** (unchanged pattern). Interactive/mockup-identical components are mounted as **React islands** using `@astrojs/react` + `framer-motion` + `lucide-react`. Static chrome (navbar shell, footer, hero, CTA banner) is ported to plain `.astro` + CSS animations to keep JS weight low.

**Island inventory:**

| Island component | File | Hydration | Used on | Replaces (mockup) |
|---|---|---|---|---|
| `ShowroomExperience` | `src/components/showroom/ShowroomExperience.tsx` | `client:load` | `/`, `/shop` | `ProductExperience.tsx` |
| `ProductCard` | `src/components/showroom/ProductCard.tsx` | (child of above) | grids | `ProductCard.tsx` |
| `RecommendationsRail` | `src/components/showroom/RecommendationsRail.tsx` | `client:visible` | `/`, `/shop`, `/products/[id]` | `Recommendations.tsx` |
| `ProductDetail` | `src/components/showroom/ProductDetail.tsx` | `client:load` | `/products/[id]` | `product.$id.tsx` info column + mobile bar |
| `ProductStage` | `src/components/showroom/ProductStage.tsx` | `client:visible` | `/products/[id]` | `product.$id.tsx` image stage |
| `SearchOverlay` | `src/components/showroom/SearchOverlay.tsx` | `client:idle` | all pages (via Header) | — (new, mockup-styled) |
| `MobileNav` | `src/components/showroom/MobileNav.tsx` | `client:idle` | all pages (via Header) | `Navbar.tsx` mobile drawer |
| `DrawerPanel` | `src/components/showroom/DrawerPanel.tsx` | (child) | `MobileNav`, `ShowroomExperience` | `DrawerPanel.tsx` |

**Rules for islands:**
- Props must be **plain serializable objects** (see mapping §8). No Appwrite SDK objects cross the island boundary; islands may import `stores/cart.ts` (nanostores) directly — it is client-side by design.
- Islands must be SSR-safe (Framer Motion `initial` props render fine server-side; the Astro React renderer executes the component on the server for initial HTML — no `typeof window` guards needed except in effects, matching mockup code which already complies).
- One React runtime is shared by all islands on a page (Astro deduplicates).

**Non-island (pure Astro + CSS/vanilla) components:** floating navbar shell + scroll shrink, `Hero`, `CtaBanner`, `Footer`, `CartDrawer` (restyle of existing), `404`, contact/about/login/admin shells.

### 3.2 Dependency changes (`package.json`)

**Add:**
- `@astrojs/react` (via `npx astro add react`)
- `react`, `react-dom` (v19, matching mockup), `@types/react`, `@types/react-dom`
- `framer-motion` `^12`
- `lucide-react` `^0.575`
- `lucide-static` (SVG icons for `.astro` components)

**Remove:**
- `bootstrap-icons`

**Keep untouched:** `appwrite`, `nanostores`, `zod`, `tailwind-merge`, `clsx`, `class-variance-authority`, `@tailwindcss/typography`, `tailwindcss-animate` (admin still uses animate classes), `node-appwrite` (scripts), all dev tooling.

### 3.3 `astro.config.mjs`

Add `react()` to `integrations` (after `tailwind`). Nothing else changes — adapter, `output: 'server'`, image service stay identical.

---

## 4. Design System — Tokens & Utilities (exact values)

### 4.1 Color tokens

The mockup defines colors in **oklch**. Tailwind 3 alpha modifiers (`bg-background/85`, `border-border/70`) require RGB-space values, so tokens are converted to sRGB and stored as **space-separated RGB triplets** mapped via `rgb(var(--x) / <alpha-value>)`. Conversions are exact sRGB gamut mappings (grays are lossless; tinted ambients are within gamut).

**New `:root` block for `src/styles/global.css` (replaces existing, `.dark` block deleted):**

```css
:root {
  --background: 255 255 255;          /* oklch(1 0 0)        #ffffff */
  --foreground: 18 18 18;             /* oklch(0.18 0 0)     #121212 */
  --card: 255 255 255;                /* oklch(1 0 0)        #ffffff */
  --card-foreground: 18 18 18;        /* oklch(0.18 0 0)     #121212 */
  --popover: 255 255 255;             /* oklch(1 0 0)        #ffffff */
  --popover-foreground: 18 18 18;     /* oklch(0.18 0 0)     #121212 */
  --primary: 6 6 6;                   /* oklch(0.12 0 0)     #060606 */
  --primary-foreground: 252 252 252;  /* oklch(0.99 0 0)     #fcfcfc */
  --secondary: 245 245 245;           /* oklch(0.97 0 0)     #f5f5f5 */
  --secondary-foreground: 18 18 18;   /* oklch(0.18 0 0)     #121212 */
  --muted: 243 243 243;               /* oklch(0.965 0 0)    #f3f3f3 */
  --muted-foreground: 99 99 99;       /* oklch(0.5 0 0)      #636363 */
  --accent: 242 242 242;              /* oklch(0.96 0 0)     #f2f2f2 */
  --accent-foreground: 18 18 18;      /* oklch(0.18 0 0)     #121212 */
  --destructive: 231 0 11;            /* oklch(0.577 0.245 27.325) #e7000b */
  --destructive-foreground: 248 250 252; /* oklch(0.984 0.003 247.858) */
  --border: 228 228 228;              /* oklch(0.92 0 0)     #e4e4e4 */
  --input: 228 228 228;               /* oklch(0.92 0 0)     #e4e4e4 */
  --ring: 158 158 158;                /* oklch(0.7 0 0)      #9e9e9e */
  --radius: 1rem;                     /* mockup --radius     16px */

  /* Ambient stage tints (see §4.5) — kept in oklch, used raw in CSS */
  --ambient-warm: oklch(0.965 0.012 70);
  --ambient-cool: oklch(0.975 0.008 250);
  --ambient-deep: oklch(0.94 0.01 60);
  --ambient-spot: oklch(0.99 0.005 80 / 0.55);
}
```

**Tailwind color mapping change** (`tailwind.config.js`): every `hsl(var(--x))` becomes `rgb(var(--x) / <alpha-value>)`. Semantic names stay identical, so existing utility classes (`bg-background`, `text-muted-foreground`, …) keep working everywhere, including checkout and admin.

**Retired tokens:** `--verified`, `--warning` (green/amber semantics clash with the achromatic system). The "Verified" product signal is restyled as a **monochrome glass chip** with lucide `BadgeCheck` (see §7.4). Error/success states keep `--destructive` red; success toasts use foreground/black.

### 4.2 Radius scale

Mockup base radius `1rem` with a full scale. Extend `tailwind.config.js`:

```
borderRadius: sm: calc(var(--radius) - 4px), md: calc(var(--radius) - 2px),
lg: var(--radius), xl: calc(var(--radius) + 4px), 2xl: calc(var(--radius) + 8px),
3xl: calc(var(--radius) + 12px), 4xl: calc(var(--radius) + 16px)
```

(Existing `rounded-xl`/`rounded-2xl`/`rounded-3xl` usages in checkout/admin silently upgrade to the mockup's softer radii — intended.)

### 4.3 Typography

- **Font:** Inter, weights **300–900** (current link loads 300–700; add 800 & 900 to the Google Fonts URL in both layouts).
- **Body:** `font-feature-settings: 'cv11', 'ss01'`; `-webkit-font-smoothing: antialiased` (already present).
- **Signature type patterns (Tailwind classes used verbatim from mockup):**
  - Editorial giant word: `font-extrabold leading-none tracking-[-0.06em]` with `font-size: clamp(3.75rem, 18vw, 16rem)`, `mix-blend-overlay` on hero.
  - Micro-labels: `text-xs uppercase tracking-[0.2em] text-muted-foreground` prefixed with `—` (em-dash), e.g. `— Collection`, `— Curated for you`.
  - Headings: `font-semibold tracking-tight` at `text-2xl → md:text-4xl`.
  - Page statement (about/contact): `text-balance text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight`.
- Add `text-balance` utility class (`text-wrap: balance`) to global.css (Tailwind 3 lacks it natively).

### 4.4 Layout container

New components use the mockup container: `mx-auto max-w-[1240px] px-3 sm:px-4` (not the old `.container`). The `.container` class is retained only because checkout/admin still use it; new pages use the 1240px pattern. Both may coexist during migration; no conflict.

### 4.5 Utility classes to port into `global.css` (verbatim from mockup `styles.css`)

```css
.glass        { background: color-mix(in oklab, white 70%, transparent);
                backdrop-filter: saturate(180%) blur(20px); }
.glass-strong { background: color-mix(in oklab, white 88%, transparent);
                backdrop-filter: saturate(180%) blur(24px); }
.nav-shape    { border-radius: 9999px; }
.text-balance { text-wrap: balance; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Ambient stage — cursor-follow spotlight + category tint (see §7.2) */
.ambient-stage { position: relative; isolation: isolate;
  --ambient-x: 50%; --ambient-y: 30%;
  --ambient-tint: var(--ambient-warm); --ambient-spot: oklch(0.99 0.005 80 / 0.55); }
.ambient-stage::before { content: ""; position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(900px 600px at var(--ambient-x) var(--ambient-y), var(--ambient-spot), transparent 60%),
    linear-gradient(180deg, var(--ambient-tint), var(--background) 90%);
  transition: background 800ms ease; pointer-events: none; }
.ambient-stage > * { position: relative; z-index: 1; }
@media (prefers-reduced-motion: reduce) { .ambient-stage::before { transition: none; } }
```

`color-mix(in oklab, …)` is supported by all modern browsers (Chrome 111+, Safari 16.2+, Firefox 113+). Acceptance target: evergreen browsers, same as mockup.

### 4.6 Iconography (D5)

- **Islands:** `lucide-react` (identical imports to mockup: `Search`, `ShoppingBag`, `Menu`, `X`, `ChevronLeft/Right/Down`, `Star` (unused — ratings dropped), `ArrowLeft/Right`, `Minus`, `Plus`, `SlidersHorizontal`, `Sparkles`, `Trophy`, `Tag`, `BadgeCheck`, `Play`, `Trash2`, `CircleCheck`, `CircleX`, `CircleAlert` …).
- **`.astro` components:** `lucide-static` — import SVGs and inline them (small helper `Icon.astro` that renders an SVG string with `set:html`, applying `class` for sizing).
- **Bootstrap → Lucide mapping for existing usages:**

| Bootstrap (current) | Lucide (new) | Locations |
|---|---|---|
| `bi-list` | `menu` | Header mobile |
| `bi-bag` | `shopping-bag` | Header, empty states |
| `bi-x-lg` / `bi-x` | `x` | drawers |
| `bi-stars` | `sparkles` | nav "Featured" |
| `bi-chevron-right` | `chevron-right` | breadcrumbs, sidebar |
| `bi-arrow-left(-short)` | `arrow-left` | back links |
| `bi-arrow-right` | `arrow-right` | CTAs |
| `bi-search` | `search` | search UI |
| `bi-trash` | `trash-2` | cart items |
| `bi-laptop` / `bi-phone` / `bi-headphones` | `laptop` / `smartphone` / `headphones` | category pills |
| `bi-grid-3x3-gap-fill` | `layout-grid` | "All" filter |
| `bi-shield-check` | `shield-check` | trust rows |
| `bi-eye` / `bi-eye-slash` | `eye` / `eye-off` | login password toggle |
| `bi-patch-check-fill` | `badge-check` | Verified chip |
| `bi-play-fill` | `play` | video badge |
| `bi-check-circle-fill` | `circle-check` | stock/admin |
| `bi-exclamation-circle-fill` | `circle-alert` | stock-low/errors |
| `bi-x-circle-fill` | `circle-x` | out-of-stock |
| `bi-grid-1x2-fill` / `bi-box-seam-fill` / `bi-bag-check-fill` | `layout-dashboard` / `package` / `shopping-bag-check`* | admin nav |
| `bi-person-fill` | `user` | admin user chip |
| `bi-box-arrow-right` | `log-out` | admin logout |
| `bi-whatsapp` / `bi-facebook` | keep custom inline SVGs (lucide has no brand icons) | footer |

\* verify exact export name at implementation (`shopping-bag-check` exists in lucide ≥0.400).

**Removal:** Bootstrap Icons CDN `<link>` from `Layout.astro` + `AdminLayout.astro`, the `@import` in `global.css`, and the npm dependency. A repo-wide grep for `class="bi ` / `class="bi-` / `bi bi-` must return **zero** results before merge (acceptance criterion).

### 4.7 Motion system (exact values)

**Easing token** — the mockup uses a single expo-out curve everywhere:

- Framer (islands): `export const EASE = [0.22, 1, 0.36, 1] as const;`
- CSS (astro components): `--ease-showroom: cubic-bezier(0.22, 1, 0.36, 1);`

**Duration inventory (from mockup source, to be replicated exactly):**

| Animation | Duration | Delay | Ease |
|---|---|---|---|
| Hero image scale-in `1.08 → 1` | 1.6s | 0 | EASE |
| Hero headline fade-up (`y:40→0`) | 0.9s | 0 | EASE |
| Hero search panel fade-up (`y:24→0`) | 0.7s | 0.25s | EASE |
| Product card enter (`y:16→0`) / exit (`y:0→-8`) | 0.5s | 0 | EASE |
| Card hover lift `y:-4px` (whileHover) | spring | — | — |
| Card image hover scale `1 → 1.04` | 700ms | — | ease-out |
| Drawer panel in (`y:-16, scale .98→1`) | 0.45s | 0 | EASE |
| Drawer overlay fade | 0.3s | 0 | linear |
| Navbar `glass→glass-strong` + shrink h-14→h-12 | 500ms | 0 | ease-out |
| PDP image column fade-up (`y:20→0`) | 0.7s | 0 | EASE |
| PDP info column fade-up | 0.7s | 0.1s | EASE |
| PDP product image float loop `y:[0,-8,0]` | 6s infinite | 0 | easeInOut |
| Ambient tint/spotlight background shift | 800ms | 0 | ease |
| Recommendations rail scroll | native `scrollBy` smooth | — | — |

**Reduced motion:** every Framer element wrapped so `useReducedMotion()` disables transforms (mockup already does this for the ambient stage; we extend the same policy). CSS animations get `@media (prefers-reduced-motion: reduce)` no-op overrides.

**Astro-side implementation:** hero/CTA/footer entrance animations are CSS keyframes (`fade-up`) with the shared cubic-bezier, triggered on load via `animation-fill-mode: both`. No JS for static entrances.

---

## 5. Global Shell Changes

### 5.1 `src/layouts/Layout.astro`

| Change | Detail |
|---|---|
| Fonts | Google Fonts URL → `Inter:wght@300;400;500;600;700;800;900` |
| Icons | Remove bootstrap-icons CDN `<link>` |
| Dark mode | Delete the inline `darkMode` init script; add a one-time cleanup `localStorage.removeItem('darkMode')` (prevents any stale value affecting anything later); remove `class="dark"` possibility |
| `theme-color` meta | `#0A2540` → `#ffffff` |
| Body class | none needed; `html { scroll-behavior: smooth; }` added in CSS base layer (mockup) |
| Cloudflare beacon | **keep** (functional analytics, untouched) |
| Slot structure | unchanged (header/main/footer) |

### 5.2 Header → floating pill navbar (exact mockup `Navbar.tsx`)

Replace `src/components/layout/Header.astro` contents with the mockup pattern, adapted:

```
<div class="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
  <nav class="glass nav-shape flex items-center gap-8 border border-border/60
       shadow-[0_8px_30px_rgb(0_0_0/0.04)] transition-all duration-500 ease-out
       h-14 px-5 sm:px-7 max-w-[960px] w-full">
    … logo … links … actions …
  </nav>
</div>
```

- **Logo:** mockup mark = `h-6 w-6 rounded-full bg-foreground text-[10px] font-bold text-background` containing **"A"**, followed by `ABKHD` (`text-[15px] font-semibold tracking-tight`). (Replaces "ABKHD Store" two-tone wordmark; keeps brand name.)
- **Links (desktop, centered):** `Home /` `Featured → Shop` decision: keep current IA — **Home, Shop, About, Contact** (mockup's exact link set). Active state: `font-semibold text-foreground`, inactive `text-muted-foreground hover:text-foreground` (no icons in links, matching mockup).
- **Actions (right):**
  - Search icon button (`h-8 w-8 rounded-full`) → mounts/opens `SearchOverlay` island.
  - Cart button with **real count** (functionality preservation): mockup's dot becomes a count badge — `absolute right-1 top-1 h-4 min-w-4 rounded-full bg-foreground text-background text-[10px]` shown only when count > 0 (from `$cartItems`).
  - Mobile: `menu` button (≤md) → opens `MobileNav` island.
- **Scroll behavior:** vanilla script toggles `scrolled` (window.scrollY > 24): swaps `glass h-14 max-w-[960px] px-7` → `glass-strong h-12 max-w-[820px] px-5`. Exact mockup values.
- **Because the navbar is `fixed` + floating, every page's first section needs top padding** (`pt-20/pt-24` like mockup pages; handled per-page in §7).
- `CartDrawer` stays mounted below the nav (restyle §5.5).

### 5.3 Mobile navigation — `MobileNav` island

Replaces `src/components/layout/MobileMenu.astro` (deleted). Exact mockup pattern: `DrawerPanel` slide-down sheet (`fixed inset-x-4 top-20 z-50 origin-top rounded-3xl bg-background/95 backdrop-blur-xl`), containing:

- Nav links as `rounded-2xl px-4 py-3.5` rows, active = `bg-muted font-semibold shadow-[inset_0_0_0_1px_var(--border)]`.
- Divider, then two pill buttons: **Search** (opens overlay) and **Cart** (opens cart drawer).
- Auto-close on navigation (island listens to `astro:page-load`), scroll-lock while open (mockup behavior).
- The old dark-mode toggle block is deleted (D2).

### 5.4 Footer (mockup pattern, ABKHD content)

4-column grid `grid-cols-2 md:grid-cols-[1fr_auto_auto_auto]` inside `max-w-[1240px]`, `border-t`:

1. Brand block: "A" mark + **ABKHD** + line: *"Premium tech at smarter prices. Every device tested & certified. Jimeta, Yola — Nigeria."*
2. **About:** Blog→`/about`, Meet the Team→`/about`, Contact Us→`/contact`.
3. **Support:** Contact Us→`/contact`, Shipping→`/about#shipping`, Returns→`/about#returns`, FAQ→`/contact`. (Anchor targets added on About — §7.8.)
4. **Social:** WhatsApp + Facebook as mockup-style pill buttons (`h-8 w-8 rounded-full bg-foreground text-background`), using custom inline SVGs with the **existing real links** (`wa.me/${VITE_WHATSAPP_NUMBER}`, current Facebook URL). 
5. Bottom row: `© {year} ABKHD. All rights reserved.` + Terms / Privacy placeholders (mockup parity).

### 5.5 CartDrawer — restyle only (functionality preserved)

Keep `src/components/cart/CartDrawer.astro` structure, nanostores wiring, `renderCart()`, and all IDs **exactly** (other scripts depend on them). Visual changes only:

- Panel: `max-w-md bg-background` → add `rounded-l-3xl` (or full `rounded-3xl inset-y-3 right-3` floating sheet) + `border border-border/70` + softer shadow `0_30px_80px_-30px_rgb(0_0_0/0.25)`.
- Overlay: `bg-black/50` → `bg-foreground/20 backdrop-blur-[2px]` (mockup).
- Item rows: `rounded-lg` → `rounded-2xl border-border/70`, image `rounded-xl`, remove button → `h-9 w-9 rounded-full hover:bg-muted`.
- Header/footer: micro-label "— Your Cart" (`text-xs uppercase tracking-[0.2em]`), close button `rounded-full`.
- Checkout CTA: `.btn-primary` becomes mockup pill: `rounded-full bg-foreground text-background px-6 py-3 hover:opacity-90`. `Trash2` icon replaces `bi-trash`.
- Empty state: `ShoppingBag` lucide icon, "Your cart is empty", pill ghost button "Browse the showroom" → `/shop`.

### 5.6 Dark mode removal plan (D2)

| Item | Action |
|---|---|
| `src/stores/dark-mode.ts` | **delete file** |
| `Layout.astro` + `AdminLayout.astro` inline init scripts | delete; add one-time `localStorage.removeItem('darkMode')` |
| `Header.astro` desktop toggle, `MobileMenu.astro` toggle | removed with those components' rewrites |
| `global.css` `.dark { … }` block | delete |
| `tailwind.config.js` `darkMode: 'class'` | remove the key |
| `lib/utils.ts` `initializeDarkMode()` | delete function + call sites (grep: `login.astro`, possibly others — verify with `rg initializeDarkMode`) |
| `<meta name="theme-color">` | `#ffffff` |
| Any `dark:` utility classes remaining | grep `dark:` → remove (checkout/admin may contain some) |

---

## 6. Component-Level Specifications

### 6.1 `Hero.astro` (new, exact mockup)

Props: `word` (default `"Shop"`), `eyebrow`, `subtitle`, `image` (src). Home: `word="ABKHD"`, eyebrow "Give All You Need" → **"Premium Tech. Smarter Prices."**, subtitle from current hero copy. Structure (mockup-identical):

- Outer: `relative mx-auto mt-20 max-w-[1240px] overflow-hidden rounded-[28px] px-3 sm:mt-24 sm:px-4` (the `mt-20` compensates the fixed navbar).
- Inner: `h-[52vh] min-h-[420px] md:h-[58vh] md:min-h-[460px] rounded-[24px] sm:rounded-[28px] overflow-hidden`.
- `<img>`: CSS animation `hero-zoom` (scale 1.08→1, 1.6s, EASE) — no island needed.
- Gradient scrim: `bg-gradient-to-b from-background/40 via-background/10 to-background/80`.
- Giant word: absolutely positioned `top-[18%]`, `mix-blend-overlay`, `text-background`, `clamp(3.75rem, 18vw, 16rem)`, fade-up 0.9s.
- Bottom panel: `absolute inset-x-3 bottom-3 … rounded-2xl bg-background/85 backdrop-blur p-4→md:p-6`; contains eyebrow `text-xs uppercase tracking-[0.2em]` + headline + subtitle + **search form**.
- **Search form (D4):** real `<form method="get" action="/shop">` with `<input name="q">` (pill input + `bg-foreground text-background` pill submit with `arrow-right` icon). Zero JS; lands on `/shop?q=…` (§7.3).
- **Hero image asset:** new `src/assets/hero-bg.jpg` — owner to supply brand photography (dark tech flat-lay, ≥1920px). Interim: keep a placeholder from the existing public assets; flagged in PR description.

### 6.2 `ShowroomExperience.tsx` island (exact mockup `ProductExperience.tsx`)

Props: `products: ShowroomProduct[]`, `deep?: boolean`, `initialCategory?`, `initialQuery?`.

- Section gets `ambient-stage` + cursor-follow spotlight effect (desktop, fine pointer, reduced-motion-gated) and per-category tint via CSS var — copied verbatim.
- Header block: `— Collection` micro-label, `The Showroom` H2, "Now browsing · {category}" status line, mobile `Filter` pill button.
- Desktop grid: `md:grid-cols-[260px_1fr]` with sticky (`top-24`) `CategorySidebar`.
- **`CategorySidebar` (adapted data, exact styling):** pill rows `rounded-xl`, active = `bg-foreground text-background`; lucide icons `Sparkles/Trophy/Tag` for flags. Categories:

  | Sidebar entry | Source |
  |---|---|
  | All Products | — |
  | Computers | `category === 'Computers'` |
  | Mobile Phones | `category === 'Mobile Phones'` |
  | Accessories | `category === 'Accessories'` |
  | **New Arrival** (flag) | `$createdAt` within 30 days (computed at SSR, passed as `isNew`) |
  | **Best Seller** (flag) | `featured === true` |
  | **On Discount** (flag) | `originalPrice > price` |

  Category tint mapping: All → warm default; Computers → `oklch(0.965 0.01 240)`; Mobile Phones → `oklch(0.965 0.012 200)`; Accessories → `oklch(0.965 0.012 100)`.
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5`, cards inside `<AnimatePresence mode="popLayout">` — **this is why the grid is an island**.
- Pagination: exact mockup (Previous/Next text buttons + `h-8 w-8` pill number buttons, active `bg-foreground text-background`), `PER_PAGE = 6`.
- Mobile filter `DrawerPanel` with Reset/Apply pill buttons — exact mockup.
- `deep` prop: on `/shop`, raise `PER_PAGE` to 9 and drop the mockup's list-duplication hack (real catalog is large enough).

### 6.3 `ProductCard.tsx` island (exact mockup, ABKHD data)

Mockup card structure verbatim (`rounded-2xl border border-border/70 bg-card p-3`, hover lift, image scale 1.04/700ms, category chip top-right, title/price row, dual pill CTAs) minus the ratings row (D3). Data mapping (full table §8). Behavior wiring:

- **Add to Cart:** if `sizes`/`colors` exist → navigate to PDP (variant must be chosen there); else `addToCart({id, name, price, image, quantity: 1})` and open drawer. Stock 0 → both buttons disabled (`opacity-40 pointer-events-none`), chip shows "Out of stock".
- **Buy Now:** same guard, then `addToCart(...)` + `location.href = '/checkout'`.
- **Extra chips vs mockup (functionality preservation, mockup styling):** Verified (`badge-check` glass chip, top-left), `-N%` discount chip (bottom-left) replacing mockup's category chip position conflict — category chip stays top-right exactly as mockup; verified/discount chips use the same `rounded-full border border-border/70 bg-background/90 backdrop-blur` treatment.
- Whole image and title are links to `/products/{id}` (mockup behavior).

### 6.4 `RecommendationsRail.tsx` island

Exact mockup: `— Curated for you` label, heading "Explore our recommendations", `h-10 w-10` pill arrow buttons, `no-scrollbar snap-x snap-mandatory` rail, 280–320px cards with the same hover treatment. Props: `products`, `title?`, `eyebrow?`. On PDP reused for "From the same room" related rail (mockup PDP pattern).

### 6.5 `ProductDetail.tsx` + `ProductStage.tsx` islands (PDP)

Split mockup `product.$id.tsx` into two islands around SSR-fetched product:

**`ProductStage` (left column):** `rounded-3xl bg-secondary/50 p-6 md:p-10` stage with radial spotlight `radial-gradient(60% 50% at 50% 35%, oklch(1 0 0 / 0.7), transparent 70%)`, floating image (`y:[0,-8,0]`, 6s loop, disabled under reduced motion), `aspect-square max-w-[520px] rounded-2xl`. Thumbnail rail from `product.images` (hidden when < 2 images; active thumb `border-foreground`). **Video support (ABKHD-only extension):** if `product.video`, a `play` chip toggles `<video>` into the stage in place of the image; video poster uses `videoThumbnail`.

**`ProductDetail` (right column + mobile bar):** exact mockup layout — category micro-label, `text-3xl→5xl font-semibold tracking-tight` title, **stock line replacing ratings** (`In stock` / `Only N left` / `Out of stock`, dot separator), price `text-3xl md:text-4xl`, description paragraph, **variants**:

- `colors` → "Finish" pill group (mockup styling: active `border-foreground bg-foreground text-background`).
- `sizes` → "Size" pill group (same styling, only if present).
- Qty stepper (exact mockup `QtyStepper`: pill border, `h-9 w-9` round buttons, min 1, max = stock).
- Desktop actions row: Add to Cart (outline pill) / Buy Now (filled pill), both wired to existing cart store incl. selected variant; disabled at stock 0.
- Accordion (Details / Shipping / Returns): mockup exact (`border-t`, chevron rotate-180). Content: Details = `parseDescription(product.description)` (existing rich text); Shipping + Returns = current store policy text sourced from about page copy (owner to confirm final wording; defaults provided in PR).
- **Sticky mobile action bar** (`fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur-xl md:hidden`) with compact stepper + both CTAs — exact mockup.

SSR page (`products/[id].astro`) keeps: Appwrite fetch + related fetch (existing queries verbatim), OG meta generation, `Astro.redirect('/404')` on miss, back link (`arrow-left` "Back to Showroom" — mockup pattern).

### 6.6 `SearchOverlay.tsx` island (new, mockup-styled — D4)

Opened from navbar search button and mobile nav. Design in mockup language:

- `DrawerPanel`-style top sheet (`inset-x-4 top-20 rounded-3xl bg-background/95 backdrop-blur-xl`) with `search` icon + underline input (`field-input` pattern from mockup contact: transparent, `border-bottom 1px var(--border)`, focus → foreground).
- Debounced (250ms) `fetch('/api/search?q=' + encodeURIComponent(q))` with `AbortController`; triggers at ≥ 2 chars.
- Results: `rounded-2xl` rows (image `rounded-xl h-14 w-14`, name, category micro-label, `formatPrice`), max 8, link to PDP; states: idle hint ("Type at least 2 characters"), loading skeleton rows (`animate-pulse` mockup-style), empty ("No products found for “{q}”"), error ("Search is unavailable — try again").
- `Esc` closes; overlay click closes; focus returns to trigger; basic arrow-key navigation.

### 6.7 `CtaBanner.astro` (exact mockup)

`rounded-3xl bg-foreground text-background` split panel: "Ready to get our new stuff?" → **"Ready for your next device?"**; email pill form inside `bg-background/10 ring-1 ring-background/20` (visual parity; submit is intentionally decorative for now — no backend exists for newsletter; noted in PR as future work, button gives inline "Thank you" state like mockup's `setEmail("")` no-op).

---

## 7. Page-by-Page Specifications

### 7.1 Home `/` (rebuild to mockup composition)

Keep SSR featured-products fetch (existing query verbatim). New structure:

1. `Hero` (§6.1)
2. `ShowroomExperience` island with featured products (`deep=false`) — replaces current hero-blob section + featured grid + category strip.
3. `RecommendationsRail` — items: featured list rotated (or newest 8 via second SSR query `orderDesc($createdAt) limit 8`; choose newest to always fill).
4. `CtaBanner`
5. `Footer`

Retired sections: gradient-blob hero, trust strip, category strip, **CertificationFlow** (its content moves to About §7.8; component file deleted after migration).

### 7.2 Shop `/shop`

Keep SSR fetch (isActive/isArchived/orderDesc/limit 200 — verbatim). New structure: `Hero word="Shop" eyebrow="The Full Showroom" subtitle="Every device, curated. Filter by space and discover your next essential."` + `ShowroomExperience deep products={...} initialCategory={categoryParam}` + `RecommendationsRail` + `CtaBanner` + `Footer`.

- Existing `?category=` param maps to `initialCategory` (sidebar active state) — URL contract preserved.
- **New: `?q=` param** (§9): when present, SSR pre-filters the product list with the same matcher as the API, shows a "— Search results for “{q}”" status line + clear chip, and syncs the query into the overlay-free experience (no island text input needed on shop page).
- Retired: sticky pill filter bar, `shop-count-text`, product count line (mockup shows "Now browsing · X" instead).

### 7.3 Search (new) — see §9 for endpoint spec.

### 7.4 Product `/products/[id]`

Composition: back link → `md:grid-cols-2 md:gap-14` → `ProductStage` + `ProductDetail` → related `RecommendationsRail` (title "From the same room", eyebrow "— You may also like") → `Footer`. All data fetching, meta tags, redirect behavior preserved (§6.5).

### 7.5 Checkout `/checkout` — **restyle-only, hard rules**

The 3-step wizard, all form logic, Squad initiation (`squad-initiate`), stock management, order creation, validation, and every element ID stay **byte-identical**. Because its scoped `co-*` CSS reads `hsl(var(--primary))` etc., the token swap restyles it automatically. Allowed targeted edits (CSS/class-level only):

- `hsl(var(--x))` references in its `<style>` block → `rgb(var(--x))` (mechanical).
- Buttons/CTAs → pill (`border-radius: 9999px`), primary = `bg-foreground text-background`.
- Step circles/pills → `rounded-full` monochrome (active `bg-foreground text-background`).
- Inputs → keep bordered style but `rounded-xl`, focus ring → `--ring`.
- Any `dark:` classes → removed.
- Icons: its inline SVGs are already lucide-style strokes — keep (no bootstrap dependency here).

**Verification:** full E2E walkthrough on the Squad sandbox must pass before merge (§13).

### 7.6 Login `/login`

Restyle only: card → `rounded-3xl border-border/70` + mockup shadow; "— Sign in" micro-label; pill submit button; `eye/eye-off` toggle via lucide; underline-style or bordered inputs per mockup contact pattern; Appwrite `account` logic untouched.

### 7.7 Contact `/contact`

Adopt mockup's split layout: left = `— Contact` micro-label, `Say hello.` statement (`text-5xl md:text-6xl`), copy, contact rows (WhatsApp number `text-foreground`, "Mon–Fri · 9:00–18:00" → keep current business hours from existing page content); right = `rounded-3xl border bg-card p-6 md:p-8` form with `field-input` underline fields (exact mockup CSS) + pill submit + "Sent — Thank you." success state. **Existing form submission handler is preserved verbatim** (whatever transport it currently uses).

### 7.8 About `/about`

Mockup editorial skeleton with ABKHD's existing story content preserved:

1. `— About` + giant statement: **"We've been cheated too."** / "That's exactly why ABKHD exists." (`text-5xl md:text-7xl`, story paragraph below).
2. Mockup 3-pillar grid (`Curated / Quiet / Considered` pattern) → **Tested / Disclosed / Warranted** with copy lifted from current Non-Negotiables + CertificationFlow.
3. Comparison table ("Typical Sellers" vs "ABKHD") retained, restyled (`rounded-2xl` card, monochrome check/x lucide icons).
4. `id="shipping"` and `id="returns"` anchors added (footer links) with policy summary cards.
5. Team block (existing team images/copy) restyled as `rounded-2xl` cards.

### 7.9 Admin `/admin/*` — **token-level reskin only**

- `AdminLayout.astro`: remove dark-mode init script; bootstrap CDN link → lucide-static icons in nav (mapping §4.6); active nav item `text-primary bg-primary/10` becomes `bg-foreground text-background` (rounded-full pill); loading spinner border → `border-foreground border-t-transparent`.
- `admin/index.astro` (dashboard), `admin/products.astro` (CRUD, 1,306 lines), `admin/orders.astro`: **logic untouched**; mechanical class swaps only (teal `text-primary` accents → monochrome; `rounded-lg` → `rounded-xl`+; badge colors for status chips may keep semantic greens/reds for operational clarity — documented exception to strict monochrome, flagged for owner: *recommend keeping status colors in admin for usability*).
- Keep all `console.log` debugging as-is (out of scope; zero-risk policy).

### 7.10 404 — new `src/pages/404.astro`

Mockup pattern: centered, `404` micro-label, "Page not found" `text-3xl font-semibold`, pill button "Go home". (Store currently has no dedicated 404 page; product-miss redirect target exists after this.)

---

## 8. Data Mapping (mockup `Product` → ABKHD `Product`)

Islands receive a **plain `ShowroomProduct`** shaped in the `.astro` frontmatter (or a small `src/lib/showroom.ts` mapper) so props stay serializable:

```ts
// src/lib/showroom.ts
export interface ShowroomProduct {
  id: string;            // product.$id
  name: string;          // name
  category: string;      // category ('Computers' | 'Mobile Phones' | 'Accessories')
  price: number;         // price  (displayed via formatPrice → ₦)
  originalPrice?: number;// originalPrice (for discount chip + flag)
  image: string;         // images[0] || image || videoThumbnail
  images: string[];      // images (PDP rail)
  video?: string;        // video
  stock: number;         // stock
  verified: boolean;     // verified
  featured: boolean;     // featured  → "Best Seller" flag
  isNew: boolean;        // computed: $createdAt >= now - 30d → "New Arrival" flag
  hasVariants: boolean;  // !!(sizes?.length || colors?.length)
  sizes?: string[];      // sizes
  colors?: string[];     // colors
  description?: string;  // description (PDP only)
  brand?: string;        // brand
}
```

| Mockup field/element | ABKHD source | Notes |
|---|---|---|
| `title` | `name` | |
| `price` (`$X.toFixed(2)`) | `price` via `formatPrice` | **₦ NGN**, never `$` |
| `image` | `images[0] \|\| image \|\| videoThumbnail` | fallback chain preserved |
| `category` chip | `category` | exact mockup chip styling |
| `rating` / `reviews` | **— dropped (D3)** | row removed from cards + PDP |
| `tags: "new"` | `isNew` (computed) | 30-day window constant `NEW_WINDOW_DAYS = 30` |
| `tags: "best"` | `featured === true` | honest signal; order-count is a future enhancement (needs new query, out of scope) |
| `tags: "sale"` | `originalPrice > price` | discount % via existing `calculateDiscount` |
| `VARIANTS` (Onyx/Stone/Bone) | `colors` (Finish) + `sizes` (Size) | real data; groups hidden when empty |
| Related rail (same category) | existing related query (verbatim) | |
| `In stock` | `stock > 0 ? 'In stock' : stock <= 5 ? 'Only N left' : 'In stock'` | ABKHD-only enrichment, mockup styling |

`$createdAt` is available on Appwrite documents; `isNew` is computed at SSR time in the mapper.

---

## 9. Search Implementation (D4) — `/api/search`

### 9.1 Endpoint — `src/pages/api/search.ts` (new)

```
GET /api/search?q=<term>&limit=8
→ 200 { query, count, results: ShowroomProduct[] (card fields only) }
→ 400 { error: 'Provide a search term (min 2 characters).' }
```

Logic (server-side, runs on Cloudflare worker via existing SSR runtime):

1. Validate `q`: trimmed, length ≥ 2, ≤ 100 chars; `limit` clamped 1–12 (default 8).
2. **No schema/index changes** (constraint §1.1). Query Appwrite exactly like `/shop` does:
   `listDocuments(db, products, [Query.equal('isActive', true), Query.equal('isArchived', false), Query.orderDesc('$createdAt'), Query.limit(200)])`.
3. In-memory match (case-insensitive) against `name`, `brand`, `category`, and `description`; fields boosted in that order for ranking (simple weighted scoring: name×5, brand×3, category×2, description×1; word-boundary matches score higher than substring).
4. Map hits through the `ShowroomProduct` mapper, slice to `limit`.
5. `Cache-Control: public, max-age=30` (cheap response caching; catalog is small).

**Documented ceiling:** matches within the newest 200 active products — identical to the existing `/shop` page behavior, so search never returns less than the shop already shows. If the catalog exceeds ~200 SKUs, the follow-up is a fulltext index on `name` (`Query.search`) — **explicitly deferred** because it requires an Appwrite attribute index change (violates the no-backend-change constraint); noted as future work.

### 9.2 Consumers

- `Hero` form → `GET /shop?q=…` (server renders filtered grid; shareable URL).
- `SearchOverlay` island → live endpoint (§6.6).
- `/shop?q=` handling → §7.2.

### 9.3 Match rules shared by both paths

One matcher module `src/lib/search-match.ts` (pure function: `(product, term) => score | 0`) used by the API **and** by the shop page SSR pre-filter, guaranteeing identical results in overlay and shop page.

---

## 10. Protected Code Inventory (must remain functionally identical)

The following are **out of bounds for logic changes**; any PR touching them beyond what's listed will be rejected in review:

| Path | Why protected |
|---|---|
| `src/lib/appwrite.ts` | Backend client + collection IDs |
| `src/lib/squad.ts`, `src/pages/api/squad-initiate.ts`, `src/pages/api/squad-webhook.ts` | Payment initiation + webhook |
| `src/lib/stock-manager.ts` | Stock decrement on order |
| `src/lib/upload-cache.ts`, `scripts/check-*.ts` | Admin upload pipeline + schema tooling |
| `src/stores/cart.ts` | Cart state machine (islands only *call* it) |
| `src/pages/checkout.astro` — all `<script>` logic, form IDs, Squad flow | Payment integrity (CSS-only edits allowed, §7.5) |
| `src/pages/admin/*.astro` — all scripts, CRUD, auth | Admin integrity (class-only edits allowed, §7.9) |
| `src/layouts/AdminLayout.astro` — auth check script | Admin auth |
| `src/lib/init.ts` (`createInitializer`) | Astro lifecycle helper used by cart drawer |
| `.env` / `PUBLIC_APPWRITE_*` / `VITE_WHATSAPP_NUMBER` contracts | Deployment config |
| Cloudflare adapter config, `wrangler`/Pages settings | Infra |

Explicitly **allowed** to change: anything in `src/styles/`, `src/components/` (except logic noted above), page markup/class attributes, `tailwind.config.js`, `package.json` (deps per §3.2), both layouts' `<head>` (per §5.1).

---

## 11. File Change Manifest

### Added
| File | Purpose |
|---|---|
| `docs/SPEC-showroom-ui-redesign.md` | This document |
| `src/components/showroom/DrawerPanel.tsx` | Shared animated sheet (menu/filter) |
| `src/components/showroom/MobileNav.tsx` | Mobile nav island |
| `src/components/showroom/SearchOverlay.tsx` | Live search island |
| `src/components/showroom/ShowroomExperience.tsx` | Filters + grid + pagination island |
| `src/components/showroom/ProductCard.tsx` | React product card |
| `src/components/showroom/RecommendationsRail.tsx` | Horizontal rail island |
| `src/components/showroom/ProductDetail.tsx` | PDP info column + mobile bar island |
| `src/components/showroom/ProductStage.tsx` | PDP image/video stage island |
| `src/components/showroom/Hero.astro` | SSR hero |
| `src/components/showroom/CtaBanner.astro` | SSR CTA banner |
| `src/components/showroom/Icon.astro` | lucide-static SVG helper |
| `src/lib/showroom.ts` | `ShowroomProduct` mapper + constants |
| `src/lib/search-match.ts` | Shared search matcher |
| `src/pages/api/search.ts` | Search endpoint |
| `src/pages/404.astro` | Mockup-style 404 |
| `src/assets/hero-bg.jpg` | Hero imagery (owner-supplied) |

### Modified
| File | Nature of change |
|---|---|
| `package.json` | deps per §3.2 |
| `astro.config.mjs` | add `react()` integration |
| `tailwind.config.js` | `rgb(var(--x)/<alpha-value>)` mapping, radius scale, keyframes, remove `darkMode` |
| `src/styles/global.css` | new tokens (§4.1), utilities (§4.5), remove `.dark` + bootstrap import, `scroll-behavior` |
| `src/layouts/Layout.astro` | fonts/icons/theme-color/dark-mode per §5.1 |
| `src/layouts/AdminLayout.astro` | dark-mode removal, lucide icons, pill nav styling |
| `src/components/layout/Header.astro` | rewritten as floating pill navbar |
| `src/components/layout/Footer.astro` | rewritten to mockup pattern |
| `src/components/cart/CartDrawer.astro` | restyle only (IDs/logic frozen) |
| `src/pages/index.astro` | new composition §7.1 |
| `src/pages/shop.astro` | new composition §7.2 + `?q=` |
| `src/pages/products/[id].astro` | new composition §7.4 |
| `src/pages/about.astro` | editorial restructure §7.8 |
| `src/pages/contact.astro` | mockup layout §7.7 |
| `src/pages/login.astro` | restyle only |
| `src/pages/checkout.astro` | CSS/class-only edits §7.5 |
| `src/pages/admin/index.astro`, `admin/products.astro`, `admin/orders.astro` | class-only edits §7.9 |
| `src/lib/utils.ts` | remove `initializeDarkMode` (rest untouched) |

### Deleted
| File | Reason |
|---|---|
| `src/stores/dark-mode.ts` | D2 |
| `src/components/layout/MobileMenu.astro` | replaced by `MobileNav` |
| `src/components/ui/ProductCard.astro` | replaced by React card |
| `src/components/ui/ProductGrid.astro` | replaced by island grid |
| `src/components/ui/CertificationFlow.astro` | content merged into About |

---

## 12. Implementation Phases & Acceptance Criteria

Work proceeds as stacked commits on `feat/showroom-ui-redesign`, one phase per PR-able unit. Each phase must leave `astro build` green and the app deployable.

**Phase 0 — Foundations** (deps, tokens, utilities, icon infra)
✅ `astro build` succeeds; app renders in monochrome (teal eliminated — verified by screenshot diff of key pages); `rg "bi bi-|bootstrap-icons" src` → 0 after full Phase 5; Inter 300–900 loads; glass/ambient utilities present; dark-mode code fully removed (`rg "darkMode|dark-mode|\.dark\b" src` → only allowed hits).

**Phase 1 — Shell** (navbar, mobile nav, footer, cart drawer restyle, 404)
✅ Floating navbar shrinks on scroll (24px threshold); mobile drawer opens/closes with exact motion; cart count updates live; cart drawer opens with items persisting from localStorage; 404 renders.

**Phase 2 — Home**
✅ Hero (image zoom, overlay word, search form submits to `/shop?q=`); showroom island filters + paginates featured products; ambient spotlight follows cursor on desktop; recommendations rail scrolls with arrows; CTA banner renders.

**Phase 3 — Shop + Search**
✅ `/shop` matches mockup layout; `?category=` still works (URL contract); `?q=` filters server-side; `/api/search` returns ranked results; overlay debounces, aborts stale requests, keyboard-navigable; empty/loading/error states correct.

**Phase 4 — Product Detail**
✅ Exact mockup PDP layout; variants from real `colors`/`sizes` add to cart with correct variant keys; qty stepper respects stock; video toggles in stage; related rail populated; mobile action bar works; 404 redirect on bad ID.

**Phase 5 — Secondary pages + Admin reskin**
✅ About/Contact/Login restyled with content preserved; admin CRUD passes manual smoke test (create/edit/archive product, mark featured, view order); admin icons all lucide; bootstrap fully removed.

**Phase 6 — Checkout reskin + polish + QA**
✅ Checkout passes full sandbox E2E (§13); motion polish pass; `prefers-reduced-motion` verified; Lighthouse (home): Performance ≥ 85 mobile, no CLS regressions > 0.05; contrast AA on all text.

---

## 13. Regression Checklist (pre-merge, sandbox environment)

**Commerce core (highest priority)**
- [ ] Add to cart (simple product) → drawer shows item, count, ₦ subtotal
- [ ] Add to cart (variant product) from card → routes to PDP; from PDP with color+size → correct variant key (`id-size-color`)
- [ ] Cart persistence across reload (localStorage), quantity update, remove
- [ ] Checkout wizard 3 steps complete with valid data → Squad sandbox checkout URL opens
- [ ] Order document created in Appwrite with correct items/amounts
- [ ] Squad webhook (sandbox) → order marked paid, stock decremented correctly for multi-qty and variant lines
- [ ] Out-of-stock product: cannot add, Buy Now disabled, PDP chip correct
- [ ] Buy Now: adds item and lands on `/checkout`

**Search (new)**
- [ ] Hero search → `/shop?q=` shows matching products + status chip; clear chip restores full grid
- [ ] Navbar overlay: results match shop page results for same term (shared matcher)
- [ ] ≥2 char gate, debounce, abort-on-type, Escape/overlay close, empty state

**Admin**
- [ ] Login gate: non-admin redirected; admin sees dashboard
- [ ] Product create with image upload (bucket) + edit + archive; featured flag drives "Best Seller" chip on storefront
- [ ] Orders list renders; status changes persist

**Platform**
- [ ] Dark mode gone: no flash, no toggle, stale `darkMode` localStorage cleaned
- [ ] All nav links + footer links resolve (incl. `/about#shipping`, `#returns`)
- [ ] Mobile: 375px — navbar, drawers, PDP sticky bar, checkout wizard usable
- [ ] `prefers-reduced-motion`: floats/spotlight/transitions disabled
- [ ] OG tags on home/shop/PDP render correct product images (₦, titles)
- [ ] No console errors on any page; Appwrite connection ping OK in dev

---

## 14. Risks & Mitigations

| # | Risk | Likelihood | Mitigation |
|---|---|---|---|
| R1 | React + Framer island payload (~90KB gz) hurts LCP on shop/home | Medium | Islands hydrate `client:idle`/`client:visible` where possible; SSR HTML renders instantly (Astro renders islands server-side); mockup parity accepted as trade-off; monitor Lighthouse in Phase 6 |
| R2 | Astro 5 + React 19 + framer-motion 12 integration quirks (SSR of `AnimatePresence`) | Low | `AnimatePresence` renders fine SSR (children render, exit animations are client-only); fallback: `client:only="react"` for `ShowroomExperience` (costs SSR HTML for grid — avoid) |
| R3 | Checkout regression breaks payments | Low (CSS-only edits) | Hard rule §7.5 (IDs/logic frozen) + mandatory sandbox E2E before merge |
| R4 | Missed `dark:` class or dark-mode script causes flash/regression | Low | Acceptance grep in Phase 0 + checklist item |
| R5 | Search result quality (200-doc ceiling, no index) | Medium | Documented ceiling; shared matcher keeps overlay/shop consistent; deferred fulltext index is a config-only follow-up |
| R6 | Tailwind 3 lacks mockup's TW4 utilities (e.g. `text-balance`, `size-*`) | Low | Hand-ported utilities §4.5; audit island classNames for TW4-only utilities (`size-`, `text-balance`, `rounded-4xl`) and add equivalents to config |
| R7 | Hero/imagery not supplied yet blocks visual sign-off | Medium | Placeholder image shipped first; owner supplies brand photo before production deploy |
| R8 | Admin status colors vs strict monochrome (§7.9) | Low | Owner decision at Phase 5 review; default keeps semantic colors in admin only |

---

## 15. Branch, Review & Rollout Plan

1. **Branch:** `feat/showroom-ui-redesign` (already created from `main`). All work committed here; phases as logical commits (`phase-0: tokens & foundations`, …).
2. **Preview deploys:** Cloudflare Pages/GitHub integration gives per-branch preview URLs — owner reviews each phase on the preview before the next begins.
3. **Squad testing:** sandbox (`SQUAD_BASE_URL_DEV`) until final sign-off; production cutover is a config flag already in place (`isProd`).
4. **Merge:** single PR `feat/showroom-ui-redesign → main` after Phase 6 checklist is fully green, or phase-by-phase PRs if owner prefers smaller reviews (recommended given checkout is in scope).
5. **Post-merge follow-ups (explicitly out of scope):** fulltext search index, newsletter backend for CTA form, order-count-based "Best Seller", optional storefront View Transitions.

---

*End of specification. Any deviation discovered during implementation must be recorded as an amendment in this file (new `## Amendments` section) before the code lands.*

## Amendments

### Phase 5 (secondary pages + admin reskin)

1. **`admin/products/new.astro` + `admin/products/[id].astro` also reskinned (icon swaps + mechanical class edits only).** Not listed in §11 (legacy duplicate form pages superseded by the slide-in panel in `admin/products.astro`), but the Phase 0/5 acceptance grep (`bi bi-`/`bootstrap-icons` → 0 across `src/`) requires them to be converted. No logic changes.
2. **Icon substitutions where lucide-static 1.69 lacks a 1:1 bootstrap equivalent:** `currency-naira` → `banknote` (no naira glyph in lucide); `bag-check` / `bag-x` → `package-check` / `package-x` (`shopping-bag-check` not published in lucide-static 1.69 — SPEC §4.6 footnote anticipated this).
3. **Admin status colors retained** (greens/yellows/reds for stat icons, status chips, destructive actions) per §7.9 / R8 recommendation — flagged for owner at review.
4. **Contact form success state:** the previous simulated handler ended in `alert()`. Per §7.7 ("'Sent — Thank you.' success state") the transport (simulated `setTimeout`) and form ids are preserved verbatim, but the alert is replaced by the mockup success panel. The collapsible-form toggle buttons were dropped (mockup layout has the form permanently visible).
5. **Login page:** its `is:global` style block became a scoped block and the duplicate bordered `.field-input` definition was removed — the page now uses the global underline `.field-input` utility (§7.6 "underline-style … per mockup contact pattern"). Appwrite logic, element ids and redirect behavior untouched; the eye/arrow-repeat icon swaps are driven by a new tiny client helper `src/lib/lucideIcons.ts` (generated from lucide-static via `scripts` outside the repo; usage mirrors `Icon.astro`).
6. **`CertificationFlow` animations removed from `global.css`** together with the component (§7.1/§11: content migrated to About as static markup).
7. **Shipping/Returns policy copy:** §7.8 requires `#shipping`/`#returns` summary cards but no policy copy existed in the repo. Shipping card states the verified delivery fees from `checkout.astro` (Yola ₦1,000 / Jimeta ₦2,000); Returns card summarizes the existing warranty commitments without inventing return windows or durations — owner should review the wording.
