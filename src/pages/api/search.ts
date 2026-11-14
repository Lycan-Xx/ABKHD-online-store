import type { APIRoute } from 'astro';
import {
  databases,
  APPWRITE_DB_ID,
  APPWRITE_PRODUCTS_COLLECTION_ID,
} from '../../lib/appwrite';
import { Query } from 'appwrite';
import { searchProducts } from '../../lib/search-match';
import { toShowroomProduct, type ShowroomProduct } from '../../lib/showroom';

/**
 * GET /api/search?q=<term>&limit=8 (SPEC §9.1)
 *
 * Live product search for the navbar overlay. Queries Appwrite exactly
 * like /shop does (no schema/index changes), then scores + ranks in
 * memory with the shared matcher (§9.3).
 *
 * Documented ceiling: matches within the newest 200 active products —
 * identical to the /shop page fetch, so search never returns less than
 * the shop already shows.
 */
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') || '').trim();
  const rawLimit = parseInt(url.searchParams.get('limit') || '8', 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(12, Math.max(1, rawLimit)) : 8;

  if (q.length < 2 || q.length > 100) {
    return new Response(
      JSON.stringify({ error: 'Provide a search term (min 2 characters).' }),
      { status: 400, headers: jsonHeaders() },
    );
  }

  try {
    const response = await databases.listDocuments(
      APPWRITE_DB_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID,
      [
        Query.equal('isActive', true),
        Query.equal('isArchived', false),
        Query.orderDesc('$createdAt'),
        Query.limit(200),
      ],
    );

    const hits = searchProducts(response.documents.map(toShowroomProduct), q, limit).map(
      // Card fields only — keep the payload lean for the overlay rows.
      (p: ShowroomProduct) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        stock: p.stock,
        verified: p.verified,
        featured: p.featured,
        isNew: p.isNew,
        hasVariants: p.hasVariants,
      }),
    );

    return new Response(JSON.stringify({ query: q, count: hits.length, results: hits }), {
      status: 200,
      headers: { ...jsonHeaders(), 'Cache-Control': 'public, max-age=30' },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(JSON.stringify({ error: 'Search is unavailable.' }), {
      status: 500,
      headers: jsonHeaders(),
    });
  }
};

function jsonHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}
