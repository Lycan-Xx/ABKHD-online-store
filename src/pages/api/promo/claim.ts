export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { eventPhase } from '../../../lib/promo';
import { claimItem, getEventByToken, releaseClaim } from '../../../lib/promo-server';
import { SquadAPI, getSquadSecretKey, isProductionHost } from '../../../lib/squad';

const HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

const Body = z.object({
  token: z.string(),
  itemId: z.string().min(1).max(64),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().pipe(z.email().max(200)),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(8).max(400),
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: HEADERS });
}

const MESSAGES: Record<string, string> = {
  taken: 'Sorry, this item has just been claimed.',
  held: 'Someone is paying for this item right now. Check back in a few minutes.',
  limit: 'You already have an item on hold. Finish that payment first.',
  not_found: 'This item is no longer available.',
  error: 'Something went wrong. Please try again.',
};

/**
 * POST /api/promo/claim
 * Locks one item (atomic), prices it from the database (never from the
 * client), then starts a Squad payment for exactly that amount.
 */
export const POST: APIRoute = async ({ request, url }) => {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return json({ error: 'Please fill in every field correctly.' }, 400);
  }

  try {
    const event = await getEventByToken(body.token);
    if (!event) return json({ error: MESSAGES.not_found }, 404);
    if (eventPhase(event) !== 'live') {
      return json({ error: 'This promo is not running right now.' }, 403);
    }

    const secret = getSquadSecretKey();
    if (!secret) return json({ error: MESSAGES.error }, 500);

    const claim = await claimItem(event, body.itemId, body);
    if (!claim.ok) {
      const status = claim.code === 'error' ? 500 : claim.code === 'not_found' ? 404 : 409;
      return json({ error: MESSAGES[claim.code], code: claim.code }, status);
    }

    const squad = new SquadAPI(secret, isProductionHost(url.hostname));
    const callbackUrl = `${url.origin}/p/${body.token}/thanks?reference=${claim.ref}`;

    const payment = await squad.initiatePayment(
      {
        email: body.email,
        amount: claim.amount,
        customerName: body.name,
        phone: body.phone,
        address: body.address,
        items: [{ id: claim.item.$id, name: claim.item.name, price: claim.amount, quantity: 1 }],
        transactionRef: claim.ref,
      },
      callbackUrl
    );

    if (!payment.success || !payment.data?.checkout_url) {
      await releaseClaim(claim.claimId, claim.orderId);
      return json({ error: 'Could not start the payment. Please try again.' }, 502);
    }

    return json({ checkoutUrl: payment.data.checkout_url });
  } catch (error) {
    console.error('Promo claim error:', error);
    return json({ error: MESSAGES.error }, 500);
  }
};
