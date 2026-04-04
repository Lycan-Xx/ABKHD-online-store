import type { APIRoute } from 'astro';
import { z } from 'zod';
import { SquadAPI, InitiatePaymentSchema } from '../../lib/squad';
import { handleAPIError } from '../../lib/errors';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = InitiatePaymentSchema.parse(body);

    const secretKey = import.meta.env.SQUAD_SECRET_KEY;
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'Payment configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const squad = new SquadAPI(secretKey, import.meta.env.PROD);
    const callbackUrl = `${new URL(request.url).origin}/checkout?reference=${validated.transactionRef}&email=${encodeURIComponent(validated.email)}`;

    const result = await squad.initiatePayment(validated, callbackUrl);

    if (!result.success || !result.data) {
      return new Response(JSON.stringify({ error: result.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ checkoutUrl: result.data.checkout_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid request data', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return handleAPIError(error);
  }
};
