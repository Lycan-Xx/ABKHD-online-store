import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import type { ShowroomProduct } from '../../lib/showroom';
import { addFromCard, buyNowFromCard } from './cardActions';

/**
 * Showroom product card (SPEC §6.3) — mockup card structure verbatim
 * (rounded-2xl / border-border/70 / hover lift / image scale 1.04 / dual
 * pill CTAs) minus the ratings row (D3). ABKHD-only enrichment chips
 * (Verified, -N%, stock) reuse the mockup's glass chip treatment.
 */
export function ProductCard({ product }: { product: ShowroomProduct }) {
  const discount = calculateDiscount(product.price, product.originalPrice || 0);
  const outOfStock = product.stock <= 0;
  const addClass = outOfStock
    ? 'flex-1 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium opacity-40 pointer-events-none'
    : 'flex-1 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium transition hover:bg-muted';
  const buyClass = outOfStock
    ? 'flex-1 rounded-full bg-foreground px-3 py-2 text-xs font-medium text-background opacity-40 pointer-events-none'
    : 'flex-1 rounded-full bg-foreground px-3 py-2 text-xs font-medium text-background transition hover:opacity-90';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group flex flex-col rounded-2xl border border-border/70 bg-card p-3 shadow-[0_1px_0_rgb(0_0_0/0.02)] transition-shadow hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.18)]"
    >
      <a
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden rounded-xl bg-muted/60"
      >
        {/* Category chip — exact mockup position (top-right) */}
        <span className="absolute right-3 top-3 z-10 rounded-full border border-border/70 bg-background/90 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
          {product.category}
        </span>

        {/* Verified chip — ABKHD-only, mockup glass treatment (top-left) */}
        {product.verified && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            <BadgeCheck className="h-3 w-3" /> Verified
          </span>
        )}

        {/* Discount chip — bottom-left */}
        {discount !== null && (
          <span className="absolute bottom-3 left-3 z-10 rounded-full border border-border/70 bg-background/90 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            -{discount}%
          </span>
        )}

        {/* Stock chip — bottom-right (replaces "Out of stock" CTA context) */}
        {outOfStock && (
          <span className="absolute bottom-3 right-3 z-10 rounded-full border border-border/70 bg-background/90 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            Out of stock
          </span>
        )}

        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]${
            outOfStock ? ' opacity-60' : ''
          }`}
        />
      </a>

      <a href={`/products/${product.id}`} className="block px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold tracking-tight group-hover:underline underline-offset-4 decoration-foreground/20">
            {product.name}
          </h3>
          <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight">
            {formatPrice(product.price)}
          </span>
        </div>
        {/* Ratings row dropped (D3) — mockup line replaced by a subtle
            variant hint so the layout rhythm is preserved. */}
        <div className="mt-1 text-xs text-muted-foreground">
          {outOfStock
            ? 'Currently unavailable'
            : product.hasVariants
              ? 'Multiple options available'
              : product.stock <= 5
                ? `Only ${product.stock} left`
                : 'In stock'}
        </div>
      </a>

      <div className="mt-4 flex items-center gap-2 px-1 pb-1">
        <button
          onClick={() => addFromCard(product)}
          disabled={outOfStock}
          className={addClass}
        >
          Add to Cart
        </button>
        <button
          onClick={() => buyNowFromCard(product)}
          disabled={outOfStock}
          className={buyClass}
        >
          Buy Now
        </button>
      </div>
    </motion.article>
  );
}
