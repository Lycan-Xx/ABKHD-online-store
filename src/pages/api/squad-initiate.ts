export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { SquadAPI, InitiatePaymentSchema } from '../../lib/squad';
import { handleAPIError } from '../../lib/errors';

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  
  try {
    const body = await request.json();
    const validated = InitiatePaymentSchema.parse(body);

    // Access Cloudflare env - use type assertion for Cloudflare adapter
    const cfEnv = (ctx as unknown as { env?: Record<string, string> }).env;
    const secretKey = cfEnv?.SQUAD_SECRET_KEY;
    
    // Debug: Log what's available
    console.log('SQUAD_SECRET_KEY from env:', !!secretKey);
    console.log('SQUAD_SECRET_KEY length:', secretKey?.length);
    
    if (!secretKey) {
      // Fallback to import.meta.env for local development
      const fallbackKey = import.meta.env.SQUAD_SECRET_KEY;
      console.log('Fallback to import.meta.env:', !!fallbackKey);
      
      if (!fallbackKey) {
        return new Response(JSON.stringify({ error: 'Payment configuration error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const squad = new SquadAPI(fallbackKey, import.meta.env.PROD);
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
    }

    // Use Cloudflare Secret (production)
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