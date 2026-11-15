export const prerender = false;

import type { APIRoute } from 'astro';
import { SquadAPI, getSquadSecretKey, isProductionHost } from '../../lib/squad';

interface VerifyBody {
  reference?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Confirms a Squad transaction server-side before the store issues a receipt.
 * Never trusts the presence of ?reference= alone.
 */
export const POST: APIRoute = async ({ request, url }) => {
  let payload: VerifyBody;

  try {
    payload = (await request.json()) as VerifyBody;
  } catch {
    return json({ verified: false, status: 'bad_request', message: 'Invalid JSON body' }, 400);
  }

  const reference = (payload.reference || '').trim();
  if (!reference) {
    return json({ verified: false, status: 'bad_request', message: 'Missing reference' }, 400);
  }

  const secretKey = getSquadSecretKey();
  if (!secretKey) {
    console.error('Squad verification unavailable: secret key is not configured');
    return json({
      verified: false,
      status: 'unconfigured',
      reference,
      message: 'Payment verification is not configured on this server',
    });
  }

  const squad = new SquadAPI(secretKey, isProductionHost(url.hostname));

  try {
    const result = await squad.verifyTransaction(reference);
    return json({
      verified: result.verified,
      status: result.status,
      reference: result.reference || reference,
      amount: result.amount,
    });
  } catch (error) {
    console.error('Squad verification failed:', error);
    return json({
      verified: false,
      status: 'error',
      reference,
      message: 'Could not verify the payment',
    });
  }
};
