export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { SquadAPI, InitiatePaymentSchema } from '../../lib/squad';
import { handleAPIError } from '../../lib/errors';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = InitiatePaymentSchema.parse(body);

    const secretKey = import.meta.env.SQUAD_SECRET_KEY;
    
    // Debug: Log what's available (remove in production)
    console.log('Env keys available:', Object.keys(import.meta.env).filter(k => k.includes('SQUAD')));
    console.log('SQUAD_SECRET_KEY present:', !!secretKey);
    console.log('SQUAD_SECRET_KEY length:', secretKey?.length);
    
    if (!secretKey) {
      // Try alternative access method for Cloudflare secrets
      const altSecret = (import.meta.env as any).SQUAD_SECRET_KEY;
      console.log('Alternative access result:', !!altSecret);
      
      if (!altSecret) {
        return new Response(JSON.stringify({ error: 'Payment configuration error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    const finalSecretKey = secretKey || (import.meta.env as any).SQUAD_SECRET_KEY;

    const squad = new SquadAPI(finalSecretKey, import.meta.env.PROD);
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
    if (error && typeof error === 'object' && ('issues' in error || error.name === 'ZodError')) {
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
