/**
 * Cloudflare Cache Purge Utility
 * Automatically purges Cloudflare cache when products are updated
 * to ensure immediate visibility changes
 * 
 * Uses a server-side API route to avoid CORS issues with the Cloudflare API
 */

/**
 * Purge specific URLs from Cloudflare cache via server-side API
 * Uses GET with query parameters due to Cloudflare Pages POST limitations
 */
export async function purgeCloudflareCache(urls: string[]): Promise<boolean> {
  try {
    // First, test if the API route is accessible with GET
    console.log('Testing API route availability...');
    const testResponse = await fetch('/api/purge-cache', {
      method: 'GET',
    });
    
    if (!testResponse.ok) {
      console.error('API route test failed:', testResponse.status, testResponse.statusText);
      return false;
    } else {
      const testData = await testResponse.json();
      console.log('API route test OK:', testData);
    }

    // Use GET with query parameters for purging (workaround for Cloudflare Pages POST limitation)
    const urlsParam = urls.map(u => encodeURIComponent(u)).join(',');
    const purgeUrl = `/api/purge-cache?urls=${urlsParam}`;
    
    console.log(`Purging Cloudflare cache for ${urls.length} URL(s)...`);

    const response = await fetch(purgeUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check response status before parsing JSON
    if (!response.ok) {
      console.error(`Cloudflare cache purge failed with HTTP ${response.status}:`, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      return false;
    }

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      return false;
    }

    if (!result.success) {
      console.error('Cloudflare cache purge failed:', result.error || 'Unknown error');
      return false;
    }

    console.log(`✅ Cloudflare cache purged for ${urls.length} URL(s)`);
    return true;
  } catch (error) {
    console.error('Cloudflare cache purge error:', error);
    return false;
  }
}

/**
 * Purge all product-related pages from cache
 * Call this after deactivating/activating products
 */
export async function purgeProductCache(productId?: string): Promise<boolean> {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://abkhdstores.com.ng';
  
  // URLs to purge (these will be cached by Cloudflare)
  const urls = [
    '/shop',                    // Main shop page
    '/',                        // Homepage (may show featured products)
    '/products',                // Products listing
  ];

  // If specific product, add its page
  if (productId) {
    urls.push(`/products/${productId}`);
  }

  return purgeCloudflareCache(urls);
}

/**
 * Purge a single product's cache
 */
export async function purgeSingleProductCache(productId: string): Promise<boolean> {
  return purgeProductCache(productId);
}
