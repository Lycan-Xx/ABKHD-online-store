import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import type { ShowroomProduct } from '../../lib/showroom';
import { ProductCard } from './ProductCard';
import { CategorySidebar, type CategoryKey, type FlagKey } from './CategorySidebar';
import { DrawerPanel } from './DrawerPanel';

type Props = {
  products: ShowroomProduct[];
  /** `/shop` mode: 9 per page, no list-duplication hack (SPEC §6.2). */
  deep?: boolean;
  /** Preselect a sidebar category (`?category=` URL contract). */
  initialCategory?: string | null;
  /** SSR search pre-filter (`?q=`); renders a status line instead of filtering (§7.2). */
  initialQuery?: string | null;
};

/** Per-category ambient tint — same room, different lighting (SPEC §6.2). */
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

function matchesFlag(p: ShowroomProduct, flag: FlagKey): boolean {
  if (flag === 'new') return p.isNew;
  if (flag === 'best') return p.featured;
  return !!p.originalPrice && p.originalPrice > p.price;
}

export function ShowroomExperience({
  products,
  deep = false,
  initialCategory = null,
  initialQuery = null,
}: Props) {
  const perPage = deep ? 9 : 6;
  const query = initialQuery?.trim() || null;

  const [active, setActive] = useState<CategoryKey>(() =>
    initialCategory && initialCategory in TINTS && initialCategory !== 'All'
      ? (initialCategory as CategoryKey)
      : 'All',
  );
  const [flag, setFlag] = useState<FlagKey | null>(null);
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const stageRef = useRef<HTMLElement>(null);

  // Cursor-follow ambient spotlight (desktop only, GPU-friendly via CSS vars)
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
    // The SSR layer may already have pre-filtered `products` (e.g. `?q=`
    // search on /shop) — the sidebar keeps working on top of that list.
    let list = products.filter((p) => active === 'All' || p.category === active);
    if (flag) list = list.filter((p) => matchesFlag(p, flag));
    return list;
  }, [products, active, flag]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pages);
  const current = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const status = query
    ? `Search results for “${query}” · ${filtered.length} item${filtered.length === 1 ? '' : 's'}`
    : `Now browsing · ${active === 'All' ? 'Everything' : active}${
        flag ? ` · ${FLAG_LABELS[flag]}` : ''
      }`;

  return (
    <section
      ref={stageRef}
      className="ambient-stage relative py-14 md:py-24"
      style={{ ['--ambient-tint' as string]: tint }}
    >
      <div className="mx-auto max-w-[1240px] px-3 sm:px-4">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">— Collection</p>
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
                  Clear “{query}” <X className="h-3 w-3" />
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
            {current.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-10 text-center">
                <p className="text-sm font-semibold">Nothing here yet</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  {query
                    ? 'No products matched your search — try another term or clear the query.'
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

                {/* Pagination */}
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

      {/* Mobile filter drawer — same slide-down pattern as nav */}
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
