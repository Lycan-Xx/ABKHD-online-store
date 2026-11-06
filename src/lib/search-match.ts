/**
 * Shared search matcher (SPEC §9.3) — the single source of truth used by
 * BOTH the `/api/search` endpoint and the `/shop` SSR pre-filter, so the
 * navbar overlay and the shop page always return identical results for
 * the same term.
 *
 * Scoring: case-insensitive match against name / brand / category /
 * description, weighted ×5 / ×3 / ×2 / ×1. Whole-word matches score
 * double the substring variant. Score 0 → no match.
 */

export interface SearchableFields {
  name?: string;
  brand?: string;
  category?: string;
  description?: string;
}

const FIELD_WEIGHTS: { field: keyof SearchableFields; weight: number }[] = [
  { field: 'name', weight: 5 },
  { field: 'brand', weight: 3 },
  { field: 'category', weight: 2 },
  { field: 'description', weight: 1 },
];

/** Score a single product against a search term. 0 = no match. */
export function scoreProduct(product: SearchableFields, rawTerm: string): number {
  const term = rawTerm.trim().toLowerCase();
  if (term.length < 2) return 0;

  let score = 0;
  for (const { field, weight } of FIELD_WEIGHTS) {
    const value = product[field];
    if (!value) continue;
    const haystack = value.toLowerCase();
    if (haystack === term) {
      score += weight * 3; // exact field match beats everything
      continue;
    }
    // Whole-word match (word boundary) scores double a bare substring hit.
    const wordRe = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegExp(term)}(?:[^\\p{L}\\p{N}]|$)`, 'u');
    if (wordRe.test(haystack)) {
      score += weight * 2;
    } else if (haystack.includes(term)) {
      score += weight;
    }
  }
  return score;
}

/** Filter + rank a product list by a search term (stable for equal scores). */
export function searchProducts<T extends SearchableFields>(
  products: T[],
  term: string,
  limit = Infinity,
): T[] {
  return products
    .map((p, index) => ({ p, score: scoreProduct(p, term), index }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ p }) => p);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
