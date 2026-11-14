import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import type { ShowroomProduct } from '../../lib/showroom';
import { ProductCard } from './ProductCard';
import { CategorySidebar, type CategoryKey, type FlagKey } from './CategorySidebar';
import { DrawerPanel } from './DrawerPanel';

export type ShopSortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

type Props = {
  products: ShowroomProduct[];
  initialCategory?: string | null;
  initialQuery?: string | null;
  initialSort?: string | null;
};

const TINTS: Record<string, string> = {
  All: 'oklch(0.97 0.008 80)',
  Computers: 'oklch(0.965 0.01 240)',
  'Mobile Phones': 'oklch(0.965 0.012 200)',
  Accessories: 'oklch(0.965 0.012 100)',
};

const FLAG_LABELS: Record<FlagKey, string> = {
  new: 'New',
  best: 'Best',
  sale: 'Sale',
};

const SORTS: { key: ShopSortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'newest', label: 'Newest' },
];

function matchesFlag(p: ShowroomProduct, flag: FlagKey): boolean {
  if (flag === 'new') return p.isNew;
  if (flag === 'best') return p.featured;
  return !!p.originalPrice && p.originalPrice > p.price;
}

function sortProducts(list: ShowroomProduct[], sort: ShopSortKey): ShowroomProduct[] {
  const indexed = list.map((p, i) => ({ p, i }));
  switch (sort) {
    case 'price-asc':
      return indexed.sort((a, b) => a.p.price - b.p.price || a.i - b.i).map((x) => x.p);
    case 'price-desc':
      return indexed.sort((a, b) => b.p.price - a.p.price || a.i - b.i).map((x) => x.p);
    case 'newest':
      return indexed
        .sort((a, b) => {
          const ta = a.p.createdAt ? new Date(a.p.createdAt).getTime() : 0;
          const tb = b.p.createdAt ? new Date(b.p.createdAt).getTime() : 0;
          return tb - ta || a.i - b.i;
        })
        .map((x) => x.p);
    case 'featured':
    default:
      return indexed.sort((a, b) => Number(b.p.featured) - Number(a.p.featured) || a.i - b.i).map((x) => x.p);
  }
}

export function ShopExperience({
  products,
  initialCategory = null,
  initialQuery = null,
  initialSort = null,
}: Props) {
  const perPage = 9;
  const query = initialQuery?.trim() || null;
  const sortKey: ShopSortKey =
    initialSort && SORTS.some((s) => s.key === initialSort) ? (initialSort as ShopSortKey) : 'featured';

  const [active, setActive] = useState<CategoryKey>(() =>
    initialCategory && initialCategory in TINTS && initialCategory !== 'All'
      ? (initialCategory as CategoryKey)
      : 'All',
  );
  const [flag, setFlag] = useState<FlagKey | null>(null);
  const [sort, setSort] = useState<ShopSortKey>(sortKey);
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ambient-x', `${x}%`);
        el.style.setProperty('--ambient-y', `${y}%`);
      });
    };
    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const tint = useMemo(() => TINTS[active] ?? TINTS.All, [active]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => active === 'All' || p.category === active);
    if (flag) list = list.filter((p) => matchesFlag(p, flag));
    return sortProducts(list, sort);
  }, [products, active, flag, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pages);
  const current = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const status = query
    ? `Search results for “${query}” · ${filtered.length} item${filtered.length === 1 ? '' : 's'}`
    : `Now browsing · ${active === 'All' ? 'Everything' : active}${flag ? `· ${FLAG_LABELS[flag]}` : ''}`;

  const selectSort = (key: ShopSortKey) => {
    setSort(key);
    setPage(1);
  };

  return (
    <section
      ref={stageRef}
      className="ambient-stage relative py-14 md:py-24"
      style={{ ['--ambient-tint' as string]: tint }}
    >
      <div className="mx-auto max-w-[1240px] px-3 sm:px-4">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">&mdash; Collection</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              The Showroom
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <p className="text-xs text-muted-foreground">{status}</p>
              {query && (
                <a
                  href="/shop"
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  Clear "{query}" <X className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => setDrawer(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <div className="hidden md:block">
            <div className="sticky top-24">
              <CategorySidebar
                active={active}
                onChange={(c) => {
                  setActive(c);
                  setPage(1);
                }}
                flag={flag}
                onFlag={(f) => {
                  setFlag(f);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </p>
              <div className="relative">
                <label htmlFor="shop-sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="shop-sort"
                  value={sort}
                  onChange={(e) => selectSort(e.target.value as ShopSortKey)}
                  className="appearance-none rounded-full border border-border bg-background py-2 pr-9 pl-4 text-sm font-medium text-foreground outline-none transition hover:bg-muted focus:ring-2 focus:ring-ring"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {current.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-10 text-center">
                <p className="text-sm font-semibold">Nothing here yet</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  {query
                    ? 'No products matched your search - try another term or clear the query.'
                    : 'This corner of the showroom is being restocked. Check back soon.'}
                </p>
                {query && (
                  <a
                    href="/shop"
                    className="mt-4 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-muted"
                  >
                    Clear search
                  </a>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {current.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </AnimatePresence>
                </div>

                {pages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-between gap-3 md:mt-12">
                    <button
                      disabled={safePage === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pages }).map((_, i) => {
                        const n = i + 1;
                        const isActive = safePage === n;
                        return (
                          <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`grid h-8 w-8 place-items-center rounded-full text-xs transition ${
                              isActive
                                ? 'bg-foreground text-background'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      disabled={safePage === pages}
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <DrawerPanel open={drawer} onClose={() => setDrawer(false)} title="Filter">
          <CategorySidebar
            active={active}
            onChange={(c) => {
              setActive(c);
              setPage(1);
            }}
            flag={flag}
            onFlag={(f) => {
              setFlag(f);
              setPage(1);
            }}
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setActive('All');
                setFlag(null);
                setPage(1);
              }}
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Reset
            </button>
            <button
              onClick={() => setDrawer(false)}
              className="flex-1 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </DrawerPanel>
      </div>
    </section>
  );
}