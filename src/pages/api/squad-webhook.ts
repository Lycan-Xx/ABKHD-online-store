export const prerender = false;

import type { APIRoute } from 'astro';
import { handleAPIError } from '../../lib/errors';
import { deriveReceiptNumber } from '../../lib/receiptUtils';
import { getSquadSecretKey } from '../../lib/squad';
import {
  findOrdersByPaymentRef,
  hasServerKey,
  updateOrder,
} from '../../lib/appwrite-server';

/** Squad signs the raw request body with HMAC-SHA512 using the secret key. */
async function isValidSignature(
  secret: string,
  rawBody: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );
    const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const hex = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    return hex.toUpperCase() === signature.trim().toUpperCase();
  } catch (error) {
    console.error('Webhook signature check failed:', error);
    return false;
  }
}

function ok(): Response {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.text();

    // Reject forged callbacks when a secret is configured.
    const secret = getSquadSecretKey();
    if (secret) {
      const signature = request.headers.get('x-squad-encrypted-body');
      const valid = await isValidSignature(secret, rawBody, signature);

      if (!valid) {
        console.warn('Squad webhook rejected: invalid or missing signature');
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid signature' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    let payload: any = null;
    try {
      payload = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      console.error('Squad webhook: body is not valid JSON');
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transactionRef: string | undefined = payload?.transaction_ref;
    const transactionStatus: string = String(payload?.transaction_status || '');

    console.log('Squad webhook received:', { transactionRef, transactionStatus });

    if (!transactionRef || !/^success/i.test(transactionStatus)) {
      return ok();
    }

    // Backfill only; the checkout screen records paid + receipt id itself.
    // Acknowledge even when the server key is missing so Squad stops retrying.
    if (!hasServerKey()) {
      console.warn(
        'Squad webhook: APPWRITE_API_KEY is not configured, skipping order update'
      );
      return ok();
    }

    let orders;
    try {
      orders = await findOrdersByPaymentRef(transactionRef);
    } catch (error) {
      console.error('Squad webhook lookup failed:', error);
      return ok();
    }

    if (orders.length === 0) {
      console.warn('Squad webhook: no order found for reference', transactionRef);
      return ok();
    }

    const order = orders[0];
    const updates: Record<string, any> = {};

    if (order.status !== 'paid') {
      updates.status = 'paid';
    }

    if (!order.receiptId) {
      updates.receiptId = deriveReceiptNumber(transactionRef);
      updates.receiptGeneratedAt = new Date().toISOString();
    }

    if (Object.keys(updates).length > 0) {
      try {
        await updateOrder(order.$id, updates);
        console.log('Order updated by webhook:', { orderId: order.$id, updates });
      } catch (error) {
        console.error('Webhook could not update the order:', error);
      }
    }

    return ok();
  } catch (error) {
    console.error('Squad webhook error:', error);
    return handleAPIError(error);
  }
};
