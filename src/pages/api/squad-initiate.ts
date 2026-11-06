export const prerender = false;
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { SquadAPI, InitiatePaymentSchema } from '../../lib/squad';
import { handleAPIError } from '../../lib/errors';

// Helper function to get environment variable
function getSquadSecretKey(): string | null {
  // In Cloudflare Pages, environment variables for server-side functions
  // need to be PUBLIC_ prefixed to be accessible via import.meta.env
  
  // Method 1: Try PUBLIC_SQUAD_SECRET_KEY first (Cloudflare Pages compatible)
  try {
    // @ts-ignore
    const key1 = import.meta.env.PUBLIC_SQUAD_SECRET_KEY;
    if (key1 && typeof key1 === 'string' && key1.trim().length > 0) {
      console.log('Got SQUAD_SECRET_KEY from PUBLIC_SQUAD_SECRET_KEY (Cloudflare Pages)');
      return key1;
    }
  } catch (e) {
    console.log('Method 1 failed:', e);
  }
  
  // Method 2: Try SQUAD_SECRET_KEY (standard, might work in other environments)
  try {
    // @ts-ignore
    const key2 = import.meta.env.SQUAD_SECRET_KEY;
    if (key2 && typeof key2 === 'string' && key2.trim().length > 0) {
      console.log('Got SQUAD_SECRET_KEY from import.meta.env');
      return key2;
    }
  } catch (e) {
    console.log('Method 2 failed:', e);
  }
  
  // Method 3: Debug - log what's available (masked for security)
  try {
    // @ts-ignore
    const allEnvVars = import.meta.env ? Object.keys(import.meta.env) : [];
    const squadRelated = allEnvVars.filter(key => 
      key.includes('SQUAD') || key.includes('squad') || key.includes('Squad')
    );
    console.log('Available env vars related to Squad (count):', squadRelated.length);
    
    // Log only key names with masked values for security
    squadRelated.forEach(key => {
      // @ts-ignore
      const value = import.meta.env[key];
      if (value && typeof value === 'string') {
        // Mask the value - show only first 3 and last 3 characters
        const maskedValue = value.length > 6 ? 
          `${value.substring(0, 3)}***${value.substring(value.length - 3)}` : 
          '***';
        console.log(`  ${key}: ${maskedValue} (length: ${value.length})`);
      } else {
        console.log(`  ${key}: [no value or not a string]`);
      }
    });
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
    const isProd = !url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1') && !url.hostname.includes('192.168.');
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