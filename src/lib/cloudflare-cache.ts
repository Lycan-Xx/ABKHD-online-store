/**
 * Cloudflare Cache Purge Utility
 * Automatically purges Cloudflare cache when products are updated
 * to ensure immediate visibility changes
 */

interface CloudflareConfig {
  zoneId: string;
  apiToken: string;
}

/**
 * Purge specific URLs from Cloudflare cache
 * Call this after updating products to ensure immediate visibility changes
 */
export async function purgeCloudflareCache(urls: string[]): Promise<boolean> {
  // Get config from environment (check both non-public and public prefixed versions for Cloudflare Pages compatibility)
  const zoneId = import.meta.env.CLOUDFLARE_ZONE_ID || import.meta.env.PUBLIC_CLOUDFLARE_ZONE_ID;
  const apiToken = import.meta.env.CLOUDFLARE_API_TOKEN || import.meta.env.PUBLIC_CLOUDFLARE_API_TOKEN;

  if (!zoneId || !apiToken) {
    console.warn('Cloudflare cache purge skipped: Missing CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: urls.map(url => {
            // Ensure URL is absolute
            if (!url.startsWith('http')) {
              url = `${import.meta.env.PUBLIC_SITE_URL || 'https://abkhdstores.com.ng'}${url}`;
            }
            return url;
          })
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudflare cache purge failed:', error);
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
