/**
 * Showroom island data layer (SPEC §8).
 *
 * Appwrite product documents are mapped to a plain, serializable
 * `ShowroomProduct` in the `.astro` frontmatter before being handed to
 * React islands. Derived flags (`isNew`, `hasVariants`, discount) are
 * computed once at SSR time so the islands stay dumb.
 */

/** ABKHD catalog categories (SPEC §6.2 sidebar contract). */
export const CATEGORIES = ['Computers', 'Mobile Phones', 'Accessories'] as const;
export type ShowroomCategory = (typeof CATEGORIES)[number];

/** Window in which a product counts as a "New Arrival". */
export const NEW_WINDOW_DAYS = 30;

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800';

export interface ShowroomProduct {
  id: string; // product.$id
  name: string; // name
  category: string; // category ('Computers' | 'Mobile Phones' | 'Accessories')
  price: number; // price — displayed via formatPrice → ₦
  originalPrice?: number; // originalPrice (discount chip + "sale" flag)
  image: string; // images[0] || image || videoThumbnail (fallback chain preserved)
  images: string[]; // images (PDP rail)
  video?: string; // video
  stock: number; // stock
  verified: boolean; // verified
  featured: boolean; // featured → "Best Seller" flag
  isNew: boolean; // $createdAt within NEW_WINDOW_DAYS → "New Arrival" flag
  hasVariants: boolean; // !!(sizes?.length || colors?.length)
  sizes?: string[]; // sizes
  colors?: string[]; // colors
  description?: string; // description (PDP only)
  brand?: string; // brand
}

/** Raw Appwrite product document (loose-typed — attributes arrive as-is). */
export type ProductDoc = Record<string, any> & { $id: string; $createdAt?: string };

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return [];
}

export function toShowroomProduct(doc: ProductDoc): ShowroomProduct {
  const images = normalizeList(doc.images);
  const sizes = normalizeList(doc.sizes);
  const colors = normalizeList(doc.colors);
  const createdAt = doc.$createdAt ? new Date(doc.$createdAt).getTime() : 0;
  const isNew =
    createdAt > 0 && Date.now() - createdAt < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return {
    id: doc.$id,
    name: doc.name ?? 'Untitled product',
    category: doc.category ?? 'Accessories',
    price: Number(doc.price) || 0,
    originalPrice: doc.originalPrice ? Number(doc.originalPrice) : undefined,
    image: images[0] || doc.image || doc.videoThumbnail || FALLBACK_IMAGE,
    images,
    video: doc.video || undefined,
    stock: Number(doc.stock) || 0,
    verified: doc.verified === true,
    featured: doc.featured === true,
    isNew,
    hasVariants: sizes.length > 0 || colors.length > 0,
    sizes: sizes.length ? sizes : undefined,
    colors: colors.length ? colors : undefined,
    description: doc.description || undefined,
    brand: doc.brand || undefined,
  };
}
