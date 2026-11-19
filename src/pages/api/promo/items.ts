export const prerender = false;

import type { APIRoute } from 'astro';
import { eventPhase } from '../../../lib/promo';
import { getEventByToken, loadPublicItems } from '../../../lib/promo-server';

const HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
};

/** GET /api/promo/items?t=<token> - live item states for the promo page. */
export const GET: APIRoute = async ({ url }) => {
  try {
    const event = await getEventByToken(url.searchParams.get('t'));
    if (!event) return new Response('{}', { status: 404, headers: HEADERS });

    const phase = eventPhase(event);
    const items = phase === 'live' ? await loadPublicItems(event) : [];
    return new Response(JSON.stringify({ phase, items }), { status: 200, headers: HEADERS });
  } catch (error) {
    console.error('Promo items error:', error);
    return new Response('{}', { status: 500, headers: HEADERS });
  }
};
