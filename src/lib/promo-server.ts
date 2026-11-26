/**
 * Server-only logic for the promo event feature. Never import this from
 * client code: it uses the Appwrite API key.
 *
 * Concurrency model (single-purchase items, no transactions available):
 *   - A claim document's ID is `${itemId}_${gen}`. Creating an existing ID
 *     returns 409, which makes "take generation N+1" an atomic compare-and-set.
 *   - Holds expire on their own (reservedUntil); a lapsed hold is superseded by
 *     a new generation, so nothing is ever deleted racily.
 *   - The first verified payment wins. A later verified payment on the same
 *     item is flagged `refund_due` instead of being honoured.
 */

import {
  dbCreate,
  dbDelete,
  dbGet,
  dbList,
  dbUpdate,
  findOrdersByPaymentRef,
  q,
  updateOrder,
  ORDERS_ID,
} from './appwrite-server';
import { deriveReceiptNumber } from './receiptUtils';
import { SquadAPI, getSquadSecretKey, isProductionHost } from './squad';
import {
  HOLD_MINUTES,
  PROMO_CLAIMS_COLLECTION,
  PROMO_EVENTS_COLLECTION,
  PROMO_ITEMS_COLLECTION,
  eventPhase,
  effectiveStock,
  isHoldLive,
  itemStateForStock,
  newPromoRef,
  toPublicItem,
  type PromoClaim,
  type PromoEvent,
  type PromoItem,
  type PublicPromoItem,
} from './promo';

const TOKEN_SHAPE = /^[A-Za-z0-9_-]{22}$/;

export function looksLikeToken(token: unknown): token is string {
  return typeof token === 'string' && TOKEN_SHAPE.test(token);
}

export async function getEventByToken(token: unknown): Promise<PromoEvent | null> {
  if (!looksLikeToken(token)) return null;
  const events = await dbList<PromoEvent>(PROMO_EVENTS_COLLECTION, [
    q.equal('token', token),
    q.limit(1),
  ]);
  return events[0] ?? null;
}

export async function loadPublicItems(event: PromoEvent): Promise<PublicPromoItem[]> {
  const [items, claims] = await Promise.all([
    dbList<PromoItem>(PROMO_ITEMS_COLLECTION, [q.equal('eventId', event.$id), q.limit(100)]),
    dbList<PromoClaim>(PROMO_CLAIMS_COLLECTION, [q.equal('eventId', event.$id), q.limit(500)]),
  ]);

  const byItem = new Map<string, PromoClaim[]>();
  for (const claim of claims) {
    const list = byItem.get(claim.itemId) ?? [];
    list.push(claim);
    byItem.set(claim.itemId, list);
  }

  return items
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => toPublicItem(item, byItem.get(item.$id) ?? []));
}

/* ------------------------------------------------------------------ */
/* Claiming                                                            */
/* ------------------------------------------------------------------ */

export interface Buyer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type ClaimResult =
  | {
      ok: true;
      ref: string;
      claimId: string;
      orderId: string;
      item: PromoItem;
      amount: number;
    }
  | { ok: false; code: 'not_found' | 'taken' | 'held' | 'limit' | 'error' };

export async function claimItem(
  event: PromoEvent,
  itemId: string,
  buyer: Buyer
): Promise<ClaimResult> {
  const itemRes = await dbGet<PromoItem>(PROMO_ITEMS_COLLECTION, itemId);
  const item = itemRes.data;
  if (!itemRes.ok || !item || item.eventId !== event.$id) {
    return { ok: false, code: 'not_found' };
  }

  const eventClaims = await dbList<PromoClaim>(PROMO_CLAIMS_COLLECTION, [
    q.equal('eventId', event.$id),
    q.limit(500),
  ]);
  const itemClaims = eventClaims.filter((c) => c.itemId === itemId);

  const state = itemStateForStock(item, itemClaims);
  if (state === 'claimed') return { ok: false, code: 'taken' };
  if (state === 'reserved') return { ok: false, code: 'held' };

  // One live hold per buyer, so a single person cannot lock the whole event.
  const email = buyer.email.trim().toLowerCase();
  if (eventClaims.some((c) => isHoldLive(c) && (c.email || '').toLowerCase() === email)) {
    return { ok: false, code: 'limit' };
  }

  const gen = itemClaims.reduce((max, c) => Math.max(max, c.gen || 0), 0) + 1;
  const claimId = `${itemId}_${gen}`;
  const ref = newPromoRef();

  const created = await dbCreate(PROMO_CLAIMS_COLLECTION, claimId, {
    itemId,
    eventId: event.$id,
    gen,
    status: 'reserved',
    reservedUntil: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
    paymentRef: ref,
    email,
  });
  if (created.status === 409) return { ok: false, code: 'held' };
  if (!created.ok) return { ok: false, code: 'error' };

  const lineItem = {
    cartId: `promo-${itemId}`,
    id: itemId,
    name: item.name,
    price: item.promoPrice,
    image: item.image,
    quantity: 1,
    category: item.category,
    promo: true,
  };

  // Order exists before payment so the webhook can always find it by ref.
  const order = await dbCreate(ORDERS_ID, uniqueId(), {
    customer: JSON.stringify({ email: buyer.email, name: buyer.name, phone: buyer.phone }),
    customerEmail: buyer.email,
    customerName: buyer.name,
    customerPhone: buyer.phone,
    address: buyer.address,
    city: '',
    state: '',
    postalCode: '',
    items: JSON.stringify([lineItem]),
    total: item.promoPrice,
    totalAmount: item.promoPrice,
    paymentRef: ref,
    paymentMethod: 'card',
    status: 'pending',
  });

  if (!order.ok || !order.data?.$id) {
    await expireClaim(claimId);
    return { ok: false, code: 'error' };
  }

  return { ok: true, ref, claimId, orderId: order.data.$id, item, amount: item.promoPrice };
}

/** Give the item back immediately (payment could not be started). */
export async function releaseClaim(claimId: string, orderId?: string): Promise<void> {
  await expireClaim(claimId);
  if (orderId) {
    await dbDelete(ORDERS_ID, orderId);
  }
}

async function expireClaim(claimId: string): Promise<void> {
  await dbUpdate(PROMO_CLAIMS_COLLECTION, claimId, {
    reservedUntil: new Date(Date.now() - 1000).toISOString(),
  });
}

function uniqueId(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/* ------------------------------------------------------------------ */
/* Finalising a payment (webhook + return page both call this)         */
/* ------------------------------------------------------------------ */

export type FinalizeState = 'paid' | 'pending' | 'refund_due' | 'unknown';

export interface FinalizeResult {
  state: FinalizeState;
  order?: Record<string, any>;
}

export async function finalizePromoPayment(
  ref: string,
  verified: boolean
): Promise<FinalizeResult> {
  const [claim] = await dbList<PromoClaim>(PROMO_CLAIMS_COLLECTION, [
    q.equal('paymentRef', ref),
    q.limit(1),
  ]);
  if (!claim) return { state: 'unknown' };

  const [order] = await findOrdersByPaymentRef(ref);
  if (!order) return { state: 'unknown' };

  if (claim.status === 'refund_due') return { state: 'refund_due', order };

  if (claim.status === 'paid') {
    return { state: 'paid', order: await ensureOrderPaid(order, ref) };
  }

  if (!verified) return { state: 'pending', order };

  const itemRes = await dbGet<PromoItem>(PROMO_ITEMS_COLLECTION, claim.itemId);
  const stock = itemRes.ok && itemRes.data ? effectiveStock(itemRes.data) : 1;

  await dbUpdate(PROMO_CLAIMS_COLLECTION, claim.$id, { status: 'paid' });

  // More verified payments than units: the earliest-updated claims win and the
  // rest are refunded. Single-unit items keep the original first-wins rule.
  const after = await dbList<PromoClaim>(PROMO_CLAIMS_COLLECTION, [
    q.equal('itemId', claim.itemId),
    q.limit(200),
  ]);
  const winners = after
    .filter((c) => c.status === 'paid')
    .sort(
      (a, b) =>
        String(a.$updatedAt).localeCompare(String(b.$updatedAt)) || a.$id.localeCompare(b.$id)
    )
    .slice(0, stock);

  if (!winners.some((c) => c.$id === claim.$id)) {
    return { state: 'refund_due', order: await markRefundDue(claim, order) };
  }

  return { state: 'paid', order: await ensureOrderPaid(order, ref) };
}

async function ensureOrderPaid(order: Record<string, any>, ref: string) {
  const updates: Record<string, any> = {};
  if (order.status !== 'paid') updates.status = 'paid';
  if (!order.receiptId) {
    updates.receiptId = deriveReceiptNumber(ref);
    updates.receiptGeneratedAt = new Date().toISOString();
  }
  if (Object.keys(updates).length === 0) return order;
  await updateOrder(order.$id, updates);
  return { ...order, ...updates };
}

async function markRefundDue(claim: PromoClaim, order: Record<string, any>) {
  await dbUpdate(PROMO_CLAIMS_COLLECTION, claim.$id, { status: 'refund_due' });
  await updateOrder(order.$id, { status: 'refund_due' });
  return { ...order, status: 'refund_due' };
}

/** Ask Squad about a reference, then finalise accordingly. */
export async function verifyAndFinalize(ref: string, hostname: string): Promise<FinalizeResult> {
  const secret = getSquadSecretKey();
  let verified = false;
  if (secret) {
    try {
      const squad = new SquadAPI(secret, isProductionHost(hostname));
      verified = (await squad.verifyTransaction(ref)).verified;
    } catch (error) {
      console.error('Promo verify failed:', error);
    }
  }
  return finalizePromoPayment(ref, verified);
}

export { eventPhase };
