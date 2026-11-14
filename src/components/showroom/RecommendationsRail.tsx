import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import type { ShowroomProduct } from '../../lib/showroom';
import { addFromCard, buyNowFromCard } from './cardActions';

type Props = {
  products: ShowroomProduct[];
  eyebrow?: string;
  title?: string;
};

/**
 * Recommendations rail (SPEC §6.4) — exact mockup: pill arrow buttons,
 * `no-scrollbar snap-x snap-mandatory` rail, 280–320px cards with the
 * same hover treatment. Reused on the PDP for "From the same room".
 */
export function RecommendationsRail({
  products,
  eyebrow = 'Curated for you',
  title = 'Explore our recommendations',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1240px] px-3 py-14 sm:px-4 md:py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">— {eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            {title}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:bg-muted"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:bg-muted"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
      >
        {products.map((p) => {
          const outOfStock = p.stock <= 0;
          const addClass = outOfStock
            ? 'flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium opacity-40 pointer-events-none'
            : 'flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted';
          const buyClass = outOfStock
            ? 'flex-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-40 pointer-events-none'
            : 'flex-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90';
          return (
            <article
              key={p.id}
              className="group min-w-[280px] max-w-[280px] snap-start rounded-2xl border border-border/70 bg-card p-3 transition-shadow hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.18)] md:min-w-[320px] md:max-w-[320px]"
            >
              <a
                href={`/products/${p.id}`}
                className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted/60"
              >
                <span className="absolute right-3 top-3 z-10 rounded-full border border-border/70 bg-background/90 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">
                  {p.category}
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </a>
              <div className="px-1 pt-3">
                <a href={`/products/${p.id}`} className="block">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold tracking-tight">{p.name}</h3>
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {outOfStock
                      ? 'Currently unavailable'
                      : p.hasVariants
                        ? 'Multiple options available'
                        : 'In stock'}
                  </div>
                </a>
                <div className="mt-3 flex gap-2 pb-1">
                  <button
                    onClick={() => addFromCard(p)}
                    disabled={outOfStock}
                    className={addClass}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => buyNowFromCard(p)}
                    disabled={outOfStock}
                    className={buyClass}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
