/**
 * Shared card CTA logic (SPEC §6.3) — used by ProductCard (grid) and
 * RecommendationsRail cards. Talks to the existing nanostores cart
 * directly, exactly like the rest of the app; no commerce behavior
 * changes, only presentation.
 */
import { addToCart, openCart } from '../../stores/cart';
import type { ShowroomProduct } from '../../lib/showroom';

function toCartLine(p: ShowroomProduct, quantity = 1) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    quantity,
  };
}

/**
 * Add to Cart from a card. Variant products (sizes/colors) must be
 * configured on the PDP, so the card routes there instead.
 */
export function addFromCard(product: ShowroomProduct): void {
  if (product.stock <= 0) return;
  if (product.hasVariants) {
    window.location.href = `/products/${product.id}`;
    return;
  }
  addToCart(toCartLine(product));
  openCart();
}

/** Buy Now — same guard, then straight to checkout. */
export function buyNowFromCard(product: ShowroomProduct): void {
  if (product.stock <= 0) return;
  if (product.hasVariants) {
    window.location.href = `/products/${product.id}`;
    return;
  }
  addToCart(toCartLine(product));
  window.location.href = '/checkout';
}
