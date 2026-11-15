export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';
import {
  SquadAPI,
  InitiatePaymentSchema,
  getSquadSecretKey,
  isProductionHost,
} from '../../lib/squad';
import { handleAPIError } from '../../lib/errors';

export const POST: APIRoute = async (ctx) => {
  const { request, url } = ctx;
  
  try {
    const body = await request.json();
    const validated = InitiatePaymentSchema.parse(body);

    // Get the secret key
    const secretKey = getSquadSecretKey();
    
    if (!secretKey) {
      console.error('Squad secret key is not available. Check Cloudflare Pages environment variables.');
      console.error('Current hostname:', url.hostname);
      console.error('Request URL:', request.url);
      
      return new Response(JSON.stringify({ 
        error: 'Payment configuration error',
        message: 'Server configuration issue: Payment secret key is not set.',
        details: {
          hostname: url.hostname,
          timestamp: new Date().toISOString(),
          suggestion: 'Add PUBLIC_SQUAD_SECRET_KEY to Cloudflare Pages environment variables and redeploy.',
          debugUrl: `${new URL(request.url).origin}/api/debug-env`
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Log key info (masked for security)
    console.log('Squad secret key found, length:', secretKey.length, 'masked:', secretKey.substring(0, 3) + '***' + secretKey.substring(secretKey.length - 3));
    
    // Determine environment based on hostname
    // Production domains: pages.dev (Cloudflare Pages) or custom domains like abkhdstores.com.ng
    const isProd = isProductionHost(url.hostname);
    console.log('Payment environment - Hostname:', url.hostname, 'Production mode:', isProd);
    
    // Initialize Squad API
    const squad = new SquadAPI(secretKey, isProd);
    
    // Create callback URL
    const callbackUrl = `${new URL(request.url).origin}/checkout?reference=${validated.transactionRef}&email=${encodeURIComponent(validated.email)}`;
    console.log('Callback URL:', callbackUrl);
    
    // Initiate payment
    const result = await squad.initiatePayment(validated, callbackUrl);

    if (!result.success || !result.data) {
      console.error('Squad payment initiation failed:', result.message);
      console.error('Full result:', result);
      return new Response(JSON.stringify({ 
        error: 'Payment initiation failed',
        message: result.message || 'Unable to initialize payment',
        details: result
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Payment initiated successfully, checkout URL generated');
    return new Response(JSON.stringify({ 
      checkoutUrl: result.data.checkout_url,
      transactionRef: result.data.transaction_ref
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Handle validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('Validation error:', (error as z.ZodError).issues);
      return new Response(JSON.stringify({ 
        error: 'Invalid request data', 
        details: (error as z.ZodError).issues 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle other errors
    console.error('API endpoint error:', error);
    return handleAPIError(error);
  }
};