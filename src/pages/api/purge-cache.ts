/**
 * API Route to purge Cloudflare cache
 * This is needed because the Cloudflare API doesn't support CORS from browser-side calls
 * 
 * Handles GET (test), POST (actual purge), and OPTIONS (CORS preflight)
 */

import type { APIRoute } from 'astro';

// Handle CORS preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response('', {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const zoneId = import.meta.env.CLOUDFLARE_ZONE_ID;
    const apiToken = import.meta.env.CLOUDFLARE_API_TOKEN;
    const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://abkhdstores.com.ng';

    // Support both test request and cache purging via query parameters
    const urlParams = new URL(url).searchParams;
    const urlsParam = urlParams.get('urls');

    // If no urls parameter, return test message
    if (!urlsParam) {
      return new Response(JSON.stringify({ 
        message: 'API is working! This is the purge-cache endpoint',
        hint: 'Send GET request with ?urls=url1,url2,url3 to purge cache, or POST with { urls: [...] }'
      }), { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Parse URLs from query parameter (comma-separated)
    const urls = urlsParam.split(',').map(u => u.trim()).filter(u => u.length > 0);

    if (urls.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid or empty urls parameter'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Use shared purge logic
    return await purgeCache(urls, zoneId, apiToken, siteUrl);
  } catch (error) {
    console.error('GET cache purge error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get credentials from server-side environment variables
    const zoneId = import.meta.env.CLOUDFLARE_ZONE_ID;
    const apiToken = import.meta.env.CLOUDFLARE_API_TOKEN;
    const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://abkhdstores.com.ng';

    if (!zoneId || !apiToken) {
      console.error('Missing Cloudflare credentials');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Cloudflare credentials not configured' 
      }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Parse request body to get URLs to purge
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const { urls } = body;
    
    // Call the purge handler
    return await purgeCache(urls, zoneId, apiToken, siteUrl);
  } catch (error) {
    console.error('Cache purge error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
};

// Shared purge logic for both GET and POST
async function purgeCache(
  urls: string[],
  zoneId: string,
  apiToken: string,
  siteUrl: string
) {
  try {

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      console.error('Invalid URLs provided:', urls);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No URLs provided' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Convert relative URLs to absolute URLs
    const absoluteUrls = urls.map((url: string) => {
      if (!url.startsWith('http')) {
        return `${siteUrl}${url}`;
      }
      return url;
    });

    console.log(`[PURGE-CACHE] Starting purge for ${absoluteUrls.length} URLs:`, absoluteUrls);
    console.log(`[PURGE-CACHE] Zone ID: ${zoneId ? 'present' : 'MISSING'}`);
    console.log(`[PURGE-CACHE] API Token: ${apiToken ? 'present' : 'MISSING'}`);

    if (!zoneId || !apiToken) {
      console.error('[PURGE-CACHE] Credentials missing - Zone:', !!zoneId, 'Token:', !!apiToken);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Cloudflare credentials not configured',
        debug: {
          zoneIdPresent: !!zoneId,
          apiTokenPresent: !!apiToken
        }
      }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Call Cloudflare API
    console.log('[PURGE-CACHE] Calling Cloudflare API...');
    const cfApiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
    console.log(`[PURGE-CACHE] CF API URL: ${cfApiUrl}`);

    const response = await fetch(cfApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: absoluteUrls
      }),
    });

    console.log(`[PURGE-CACHE] Cloudflare API response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('[PURGE-CACHE] Failed to parse CF error response:', text);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Cloudflare API returned ${response.status}: ${text}`
        }), { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      console.error('[PURGE-CACHE] Cloudflare API error:', errorData);
      const errorMsg = errorData.errors?.[0]?.message || errorData.message || 'Unknown Cloudflare error';
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMsg,
        cfErrors: errorData.errors
      }), { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const result = await response.json();
    console.log('[PURGE-CACHE] Cloudflare purge successful:', result);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Purged ${urls.length} URL(s)`,
      cloudflareResponse: result
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('[PURGE-CACHE] Unexpected error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Server error: ${errorMsg}`,
      stack: error instanceof Error ? error.stack : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
