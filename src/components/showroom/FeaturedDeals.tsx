import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ShowroomProduct } from '../../lib/showroom';
import { ProductCard } from './ProductCard';

type Props = {
  /** Every featured product the homepage may rotate through. */
  products: ShowroomProduct[];
  /** How many cards are on screen at once. */
  visible?: number;
};

const ROTATE_MS = 8000;
const FADE_MS = 300;

/**
 * Homepage teaser: featured products and one way into the full catalogue.
 * Searching, filtering and paging live on /shop (ShopExperience).
 *
 * The cards rotate one place every 8 seconds, bringing the next featured
 * product in when there are more than fit on screen. Rotation pauses while the
 * shopper is pointing at, touching or focusing the grid (so a card never moves
 * under a tap), while the tab is hidden, and for reduced-motion users. The
 * first render is always the server's order, so there is no hydration mismatch.
 */
export function FeaturedDeals({ products, visible = 6 }: Props) {
  const [offset, setOffset] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const canRotate = products.length > 1;

  useEffect(() => {
    if (!canRotate || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let fadeTimer = 0;
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setFading(true);
      fadeTimer = window.setTimeout(() => {
        setOffset((o) => (o + 1) % products.length);
        setFading(false);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(fadeTimer);
      setFading(false);
    };
  }, [canRotate, paused, products.length]);

  const shown = products.length
    ? Array.from({ length: Math.min(visible, products.length) }, (_, i) => products[(offset + i) % products.length])
    : [];

  return (
    <section className="relative py-14 md:py-24">
      <div className="mx-auto max-w-[1240px] px-3 sm:px-4">
        <div className="mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hot right now</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Featured deals
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Hand-picked, tested devices at prices worth a look.
          </p>
        </div>

        {shown.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-10 text-center">
            <p className="text-sm font-semibold">New deals coming soon</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              We are lining up the next featured devices. The full catalogue is open now.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
            style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center md:mt-12">
          <a
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Browse the full shop <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
