/**
 * Shared (client + server safe) definitions for the promo event feature.
 *
 * The promo page lives behind an unguessable token (shared as a QR code on a
 * flyer). Promo items are kept in their own admin-only collections so they
 * can never leak through /shop, /api/search or the public products reads.
 */

export const PROMO_EVENTS_COLLECTION = 'promo_events';
export const PROMO_ITEMS_COLLECTION = 'promo_items';
export const PROMO_CLAIMS_COLLECTION = 'promo_claims';

/** How long a buyer holds an item while they are on the payment screen. */
export const HOLD_MINUTES = 10;

/** Promo payment references start with this so the webhook can route them. */
export const PROMO_REF_PREFIX = 'ABKHD-PROMO-';

export function isPromoRef(ref: string | undefined | null): boolean {
  return typeof ref === 'string' && ref.startsWith(PROMO_REF_PREFIX);
}

export interface PromoEvent {
  $id: string;
  title: string;
  token: string;
  startsAt?: string | null;
  endsAt?: string | null;
  active: boolean;
}

export interface PromoItem {
  $id: string;
  eventId: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  images?: string[];
  originalPrice: number;
  promoPrice: number;
  sortOrder?: number;
  /**
   * Units available. Blank/null keeps the original one-of-a-kind behaviour
   * (exactly one sale); a positive number allows that many claims.
   */
  stock?: number | null;
}

export interface PromoClaim {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  itemId: string;
  eventId: string;
  gen: number;
  status: 'reserved' | 'paid' | 'refund_due';
  reservedUntil: string;
  paymentRef: string;
  email?: string;
}

export type PromoItemState = 'available' | 'reserved' | 'claimed';

/** What the public page is allowed to know about an item. */
export interface PublicPromoItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  originalPrice: number;
  promoPrice: number;
  state: PromoItemState;
  /** Total units offered (1 for legacy one-of-a-kind items). */
  stock: number;
  /** Units still available to buy. */
  remaining: number;
}

export type EventPhase = 'upcoming' | 'live' | 'ended';

export function eventPhase(event: PromoEvent, now = Date.now()): EventPhase {
  if (!event.active) return 'ended';
  if (event.startsAt && Date.parse(event.startsAt) > now) return 'upcoming';
  if (event.endsAt && Date.parse(event.endsAt) < now) return 'ended';
  return 'live';
}

export function isHoldLive(claim: PromoClaim, now = Date.now()): boolean {
  return claim.status === 'reserved' && Date.parse(claim.reservedUntil) > now;
}

/**
 * Derive an item's state from every claim ever made on it.
 * - any paid claim            -> claimed (permanent)
 * - newest claim holding live -> reserved
 * - otherwise                 -> available (expired holds just lapse)
 */
export function itemState(claims: PromoClaim[], now = Date.now()): PromoItemState {
  if (claims.some((c) => c.status === 'paid')) return 'claimed';
  if (claims.some((c) => isHoldLive(c, now))) return 'reserved';
  return 'available';
}

/** Units offered for an item. Blank stock keeps the one-of-a-kind behaviour. */
export function effectiveStock(item: Pick<PromoItem, 'stock'>): number {
  const stock = item.stock;
  if (typeof stock === 'number' && Number.isFinite(stock) && stock > 0) {
    return Math.floor(stock);
  }
  return 1;
}

export function promoCounts(claims: PromoClaim[], now = Date.now()) {
  return {
    paid: claims.filter((c) => c.status === 'paid').length,
    liveHolds: claims.filter((c) => isHoldLive(c, now)).length,
  };
}

/**
 * Stock-aware state. A multi-unit item stays available while any unit is
 * unsold and unheld; it is only "claimed" once every unit has been paid for.
 */
export function itemStateForStock(
  item: Pick<PromoItem, 'stock'>,
  claims: PromoClaim[],
  now = Date.now()
): PromoItemState {
  const stock = effectiveStock(item);
  const { paid, liveHolds } = promoCounts(claims, now);
  if (stock - paid <= 0) return 'claimed';
  if (stock - paid - liveHolds <= 0) return 'reserved';
  return 'available';
}

export function toPublicItem(item: PromoItem, claims: PromoClaim[]): PublicPromoItem {
  const stock = effectiveStock(item);
  const { paid } = promoCounts(claims);
  return {
    id: item.$id,
    name: item.name,
    category: item.category,
    description: item.description || '',
    image: item.image,
    images: item.images && item.images.length ? item.images : [item.image],
    originalPrice: item.originalPrice,
    promoPrice: item.promoPrice,
    state: itemStateForStock(item, claims),
    stock,
    remaining: Math.max(0, stock - paid),
  };
}

/** 128-bit URL-safe token (22 chars). Works in the browser and in Workers. */
export function generatePromoToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function promoUrl(origin: string, token: string): string {
  return `${origin.replace(/\/$/, '')}/p/${token}`;
}

export function newPromoRef(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 12);
  return `${PROMO_REF_PREFIX}${Date.now()}-${rand}`;
}
