/**
 * API Route to purge Cloudflare cache
 * This is needed because the Cloudflare API doesn't support CORS from browser-side calls
 * 
 * Handles GET (test), POST (actual purge), and OPTIONS (CORS preflight)
 */

import type { APIRoute } from 'astro';

// Handle CORS preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
};

export const GET: APIRoute = async () => {
  // Test endpoint - if this works, routing is the issue
  return new Response(JSON.stringify({ 
    message: 'API is working! This is the purge-cache endpoint',
    hint: 'Send POST request with { urls: [...] } to purge cache'
  }), { 
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get credentials from server-side environment variables
    const zoneId = import.meta.env.CLOUDFLARE_ZONE_ID;
    const apiToken = import.meta.env.CLOUDFLARE_API_TOKEN;
    const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://abkhdstores.com.ng';

    if (!zoneId || !apiToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Cloudflare credentials not configured' 
      }), { status: 500 });
    }

    // Parse request body to get URLs to purge
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No URLs provided' 
      }), { status: 400 });
    }

    // Convert relative URLs to absolute URLs
    const absoluteUrls = urls.map((url: string) => {
      if (!url.startsWith('http')) {
        return `${siteUrl}${url}`;
      }
      return url;
    });

    // Call Cloudflare API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: absoluteUrls
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudflare API error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message || 'Cloudflare API error' 
      }), { status: response.status });
    }

    const result = await response.json();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Purged ${urls.length} URL(s)` 
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

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
}
