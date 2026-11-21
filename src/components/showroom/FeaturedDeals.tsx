import { ArrowRight } from 'lucide-react';
import type { ShowroomProduct } from '../../lib/showroom';
import { ProductCard } from './ProductCard';

type Props = {
  products: ShowroomProduct[];
};

/**
 * Homepage teaser: a handful of featured products and one way into the full
 * catalogue. Searching, filtering and paging live on /shop (ShopExperience).
 */
export function FeaturedDeals({ products }: Props) {
  return (
    <section className="relative py-14 md:py-24">
      <div className="mx-auto max-w-[1240px] px-3 sm:px-4">
        <div className="mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Featured deals
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Hand-picked, tested devices at prices worth a look.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-10 text-center">
            <p className="text-sm font-semibold">New deals coming soon</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              We are lining up the next featured devices. The full catalogue is open now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {products.map((p) => (
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
