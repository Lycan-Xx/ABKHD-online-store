export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { SquadAPI, InitiatePaymentSchema } from '../../lib/squad';
import { handleAPIError } from '../../lib/errors';

// Squad secret key - hardcoded for production (stored as Secret in Cloudflare)
const SQUAD_SECRET_KEY = 'sk_d6a62c63026b51d6375cd5a41cbb9209044b23b5';

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  
  try {
    const body = await request.json();
    const validated = InitiatePaymentSchema.parse(body);

    // Use the hardcoded secret key
    const secretKey = SQUAD_SECRET_KEY;
    
    console.log('Using Squad secret key, length:', secretKey?.length);
    
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
      console.error('Squad Initiation Failed:', result.message);
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
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('Squad Validation Error:', (error as z.ZodError).issues);
      return new Response(JSON.stringify({ error: 'Invalid request data', details: (error as z.ZodError).issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.error('Unhandled API Endpoint Error:', error);
    return handleAPIError(error);
  }
};