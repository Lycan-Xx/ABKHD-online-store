export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (ctx) => {
  const { url } = ctx;
  
  // Collect all environment variable information (without exposing credentials)
  const envInfo: any = {
    hostname: url.hostname,
    timestamp: new Date().toISOString(),
    isProduction: url.hostname.includes('pages.dev') && !url.hostname.includes('localhost'),
    environmentVariables: {},
    security: {
      credentialsExposed: false,
      note: 'All sensitive values are masked for security'
    }
  };
  
  // Check for Squad environment variables (masked for security)
  const sources = [
    { name: 'SQUAD_SECRET_KEY', getter: () => (import.meta as any).env?.SQUAD_SECRET_KEY },
    { name: 'PUBLIC_SQUAD_SECRET_KEY', getter: () => (import.meta as any).env?.PUBLIC_SQUAD_SECRET_KEY },
    { name: 'PUBLIC_SQUAD_PUBLIC_KEY', getter: () => (import.meta as any).env?.PUBLIC_SQUAD_PUBLIC_KEY },
  ];
  
  for (const source of sources) {
    try {
      const value = source.getter();
      const exists = !!value && typeof value === 'string' && value.trim().length > 0;
      
      envInfo.environmentVariables[source.name] = {
        exists,
        length: exists ? value.length : 0,
        // Only show first 3 chars and last 3 chars for verification, mask the rest
        maskedPreview: exists ? `${value.substring(0, 3)}***${value.substring(value.length - 3)}` : 'N/A',
        // Never expose full value
        fullValue: 'MASKED FOR SECURITY'
      };
    } catch (error) {
      envInfo.environmentVariables[source.name] = {
        error: error instanceof Error ? error.message : String(error),
        exists: false
      };
    }
  }
  
  // List all environment variables (filtered, no values)
  try {
    const allEnvKeys = Object.keys((import.meta as any).env || {});
    envInfo.allEnvKeysCount = allEnvKeys.length;
    
    // Only show keys, not values
    envInfo.squadRelatedKeys = allEnvKeys.filter(key => 
      key.toLowerCase().includes('squad') || 
      key.toLowerCase().includes('payment') ||
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('key')
    );
    
    // Also show appwrite keys for completeness (just names)
    envInfo.appwriteRelatedKeys = allEnvKeys.filter(key => 
      key.toLowerCase().includes('appwrite')
    );
  } catch (error) {
    envInfo.envKeysError = error instanceof Error ? error.message : String(error);
  }
  
  // Check if payment would work (without exposing the actual key)
  const secretKeyExists = envInfo.environmentVariables['PUBLIC_SQUAD_SECRET_KEY']?.exists || 
                         envInfo.environmentVariables['SQUAD_SECRET_KEY']?.exists;
  
  if (secretKeyExists) {
    envInfo.paymentStatus = 'READY';
    envInfo.paymentDetails = {
      keyAvailable: true,
      keySource: envInfo.environmentVariables['PUBLIC_SQUAD_SECRET_KEY']?.exists ? 
                 'PUBLIC_SQUAD_SECRET_KEY' : 'SQUAD_SECRET_KEY',
      keyLength: envInfo.environmentVariables['PUBLIC_SQUAD_SECRET_KEY']?.exists ? 
                 envInfo.environmentVariables['PUBLIC_SQUAD_SECRET_KEY'].length :
                 envInfo.environmentVariables['SQUAD_SECRET_KEY'].length
    };
  } else {
    envInfo.paymentStatus = 'BLOCKED';
    envInfo.paymentDetails = {
      keyAvailable: false,
      suggestedFix: 'Set PUBLIC_SQUAD_SECRET_KEY in Cloudflare Pages environment variables'
    };
  }
  
  // Add system info
  envInfo.system = {
    nodeEnv: (import.meta as any).env?.MODE || 'unknown',
    isDev: (import.meta as any).env?.DEV === 'true',
    isProd: (import.meta as any).env?.PROD === 'true',
    ssrEnabled: (import.meta as any).env?.SSR === 'true'
  };
  
  return new Response(JSON.stringify(envInfo, null, 2), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'X-Content-Type-Options': 'nosniff'
    }
  });
};