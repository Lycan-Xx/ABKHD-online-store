# ABKHD Store - Checkout Redesign: Modification & Refactor Specification (Draft)

| | |
|---|---|
| **Spec version** | 1.0 (draft) |
| **Date** | 2026-11-07 |
| **Design source** | docs/SPEC-showroom-ui-redesign.md plus mockup checkout deltas |
| **Target app** | ABKHD-online-store (Astro 5 + Appwrite + Squad, Cloudflare) |
| **Status** | Draft - pending owner sign-off |

---

## 1. Purpose and Scope

Draft spec for a new redesign of the /checkout page that adopts the showroom design
language shipped under feat/showroom-ui-redesign (achromatic tokens, glass, pill geometry,
micro-labels, motion) while keeping every commerce behavior byte-for-byte intact.

In scope: visual language of the 3-step wizard, cart pane, forms, payment, success, empty state.

Out of scope (protected): Squad initiation, order creation, stock decrement, webhook logic,
wizard step state machine, form validation, cart rendering logic, IDs, data attributes.

---

## 2. Locked Decisions

| # | Decision | Choice |
|---|----------|--------|
| D1 | Color system | Checkout presentation goes fully achromatic. Retired green success/payment accents are replaced by showroom foreground/muted tokens. |
| D2 | Radius | Mockup radii adopted: inputs 20px, cards 24px, CTAs/buttons 9999px (pill). |
| D3 | Micro-labels | Wizard panel headers adopt the showroom micro-label pattern: em-dash Shipping, em-dash Payment, em-dash Confirmed. |
| D4 | Motion | Panel transitions use the showroom expo-out ease cubic-bezier(0.22, 1, 0.36, 1), 0.45s. |
| D5 | Presentation only | No markup or behavior changes to forms, steps, or payment flow. |

---

## 3. Design Deltas

### 3.1 Tokens and radii (scoped co-* layer)

- --co-r: 10px to 20px (input / subtle control radius).
- --co-rl: 14px to 24px (card radius, wizard plus cart pane).
- Primary CTA (.co-cta) and ghost button (.co-ghost-btn) to border-radius 9999px.

### 3.2 Cards

- .co-wizard, .co-cart-box: radius via --co-rl (now 24px), border 1px solid var(--cobr),
  soft showroom shadow.

### 3.3 Micro-labels

- .co-panel-eyebrow: text-xs uppercase tracking-[0.2em], muted foreground, em-dash prefix.
- .co-panel-title: semibold, tighter tracking.

### 3.4 Steps

- Done step circle, line, label to monochrome foreground token.

### 3.5 Status accents

- Delivery note, paid banner, success ring/icon, next steps, WhatsApp CTA, cart success item:
  monochrome tokens.

### 3.6 Controls

- Qty stepper buttons to pill (9999px), neutral background, foreground content.

### 3.7 Motion

- .co-panel enter animation to expo-out ease, 0.45s.

### 3.8 Type

- .co-desk-title to semibold (700) for showroom heading rhythm.

---

## 4. Component Coverage

| Area | Change |
|---|---|
| Wizard pane | Card radius/shadow, micro-label, panel motion. |
| Step bar | Monochrome done and active states. |
| Details form | Tokens and radii; delivery note monochrome. |
| Payment | Micro-label, payment cards, trust badges, WhatsApp, paid banner. |
| Confirmed | Micro-label, success monochrome. |
| Cart pane | Card radius/shadow, qty pill, success item. |
| Empty state | Uses pill CTA. |
| Mobile header | Reuses monochrome tokens (progress). |

---

## 5. File Change Manifest

| File | Change |
|---|---|
| src/pages/checkout.astro | Scoped CSS token, radius, button, step, success, control, motion updates; additive micro-label markup. |

---

## 6. Regression Checklist (pre-merge, sandbox)

- Add to cart, drawer and checkout renders.
- Qty plus minus, remove.
- Proceed to payment, details validation.
- Squad init, redirect, payment return, order save, stock.

---

## 7. Risks and Mitigations

| # | Risk | Mitigation |
|---|------|------------|
| R1 | CSS specificity regressions on co-* overrides | Keep is:global plus scoped selectors, run E2E. |
| R2 | Micro-label markup colliding with JS hooks | Additive elements only, JS hooks unchanged. |

---

## 8. Acceptance

- astro build green.
- Checkout passes sandbox E2E before merge.
- No commerce logic touched.