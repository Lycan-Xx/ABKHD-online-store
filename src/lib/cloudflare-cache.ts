/**
 * Cloudflare Cache Purge Utility
 * Automatically purges Cloudflare cache when products are updated
 * to ensure immediate visibility changes
 * 
 * Uses a server-side API route to avoid CORS issues with the Cloudflare API
 */

/**
 * Purge specific URLs from Cloudflare cache via server-side API
 */
export async function purgeCloudflareCache(urls: string[]): Promise<boolean> {
  try {
    // Use server-side API route to avoid CORS issues
    const response = await fetch('/api/purge-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
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
