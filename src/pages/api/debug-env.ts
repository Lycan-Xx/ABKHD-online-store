export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (ctx) => {
  const { url } = ctx;
  
  // Collect all environment variable information
  const envInfo: any = {
    hostname: url.hostname,
    timestamp: new Date().toISOString(),
    isProduction: url.hostname.includes('pages.dev') && !url.hostname.includes('localhost'),
    environmentVariables: {}
  };
  
  // Try to get SQUAD_SECRET_KEY from different sources
  const sources = [
    { name: 'import.meta.env.SQUAD_SECRET_KEY', getter: () => (import.meta as any).env?.SQUAD_SECRET_KEY },
    { name: 'import.meta.env.PUBLIC_SQUAD_SECRET_KEY', getter: () => (import.meta as any).env?.PUBLIC_SQUAD_SECRET_KEY },
    { name: 'import.meta.env.PUBLIC_SQUAD_PUBLIC_KEY', getter: () => (import.meta as any).env?.PUBLIC_SQUAD_PUBLIC_KEY },
  ];
  
  for (const source of sources) {
    try {
      const value = source.getter();
      envInfo.environmentVariables[source.name] = {
        exists: !!value,
        length: value ? value.length : 0,
        preview: value ? `${value.substring(0, 6)}...` : 'N/A',
        fullValue: value || 'NOT SET'
      };
    } catch (error) {
      envInfo.environmentVariables[source.name] = {
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  // List all environment variables (filtered)
  try {
    const allEnvKeys = Object.keys((import.meta as any).env || {});
    envInfo.allEnvKeys = allEnvKeys;
    envInfo.squadRelatedKeys = allEnvKeys.filter(key => 
      key.toLowerCase().includes('squad') || 
      key.toLowerCase().includes('payment') ||
      key.toLowerCase().includes('secret')
    );
  } catch (error) {
    envInfo.envKeysError = error instanceof Error ? error.message : String(error);
  }
  
  // Check if payment would work
  const secretKey = envInfo.environmentVariables['import.meta.env.PUBLIC_SQUAD_SECRET_KEY']?.fullValue || 
                   envInfo.environmentVariables['import.meta.env.SQUAD_SECRET_KEY']?.fullValue;
  
  if (secretKey && secretKey !== 'NOT SET') {
    envInfo.paymentStatus = 'READY (Secret key found)';
    envInfo.paymentDetails = {
      keySource: envInfo.environmentVariables['import.meta.env.PUBLIC_SQUAD_SECRET_KEY']?.exists ? 
                 'PUBLIC_SQUAD_SECRET_KEY' : 'SQUAD_SECRET_KEY',
      keyLength: secretKey.length,
      keyStartsWith: secretKey.substring(0, 6)
    };
  } else {
    envInfo.paymentStatus = 'BLOCKED (No secret key available)';
    envInfo.suggestedFix = 'Set PUBLIC_SQUAD_SECRET_KEY in Cloudflare Pages environment variables';
  }
  
  return new Response(JSON.stringify(envInfo, null, 2), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
};