export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { SquadAPI, InitiatePaymentSchema } from '../../lib/squad';
import { handleAPIError } from '../../lib/errors';

// Helper function to get environment variable
function getSquadSecretKey(): string | null {
  // Try multiple methods to get the environment variable
  
  // Method 1: Direct from import.meta.env (standard Astro way)
  try {
    // @ts-ignore
    const key1 = import.meta.env.SQUAD_SECRET_KEY;
    if (key1 && typeof key1 === 'string' && key1.trim().length > 0) {
      console.log('Got SQUAD_SECRET_KEY from import.meta.env');
      return key1;
    }
  } catch (e) {
    console.log('Method 1 failed:', e);
  }
  
  // Method 2: From PUBLIC_ variable (might be exposed in Cloudflare Pages)
  try {
    // @ts-ignore
    const key2 = import.meta.env.PUBLIC_SQUAD_SECRET_KEY;
    if (key2 && typeof key2 === 'string' && key2.trim().length > 0) {
      console.log('Got SQUAD_SECRET_KEY from PUBLIC_SQUAD_SECRET_KEY');
      return key2;
    }
  } catch (e) {
    console.log('Method 2 failed:', e);
  }
  
  // Method 3: From global process.env (Node.js style)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      const key3 = process.env.SQUAD_SECRET_KEY;
      if (key3 && typeof key3 === 'string' && key3.trim().length > 0) {
        console.log('Got SQUAD_SECRET_KEY from process.env');
        return key3;
      }
    }
  } catch (e) {
    console.log('Method 3 failed:', e);
  }
  
  // Method 4: Debug - log all available env vars
  try {
    // @ts-ignore
    const allEnvVars = import.meta.env ? Object.keys(import.meta.env) : [];
    const squadRelated = allEnvVars.filter(key => 
      key.includes('SQUAD') || key.includes('squad') || key.includes('Squad')
    );
    console.log('Available env vars related to Squad:', squadRelated);
  } catch (e) {
    console.log('Could not list env vars:', e);
  }
  
  return null;
}

export const POST: APIRoute = async (ctx) => {
  const { request, url } = ctx;
  
  try {
    const body = await request.json();
    const validated = InitiatePaymentSchema.parse(body);

    // Get the secret key
    const secretKey = getSquadSecretKey();
    
    if (!secretKey) {
      console.error('SQUAD_SECRET_KEY is not available. Check Cloudflare Pages environment variables.');
      console.error('Current hostname:', url.hostname);
      console.error('Request URL:', request.url);
      
      return new Response(JSON.stringify({ 
        error: 'Payment configuration error',
        message: 'Server configuration issue: SQUAD_SECRET_KEY is not set. Please check Cloudflare Pages environment variables.',
        details: {
          hostname: url.hostname,
          timestamp: new Date().toISOString(),
          suggestion: 'Add SQUAD_SECRET_KEY to Cloudflare Pages environment variables and redeploy.'
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Log key info (without exposing full key)
    console.log('SQUAD_SECRET_KEY found, length:', secretKey.length, 'starts with:', secretKey.substring(0, 6) + '...');
    
    // Determine environment
    const isProd = url.hostname.includes('pages.dev') && !url.hostname.includes('localhost');
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
      return new Response(JSON.stringify({ 
        error: 'Payment initiation failed',
        message: result.message || 'Unable to initialize payment'
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