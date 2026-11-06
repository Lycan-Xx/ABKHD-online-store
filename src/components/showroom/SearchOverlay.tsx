import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DrawerPanel } from './DrawerPanel';
import { formatPrice } from '../../lib/utils';

/** Card-field subset returned by /api/search (SPEC §9.1). */
type SearchHit = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
};

type Status = 'idle' | 'loading' | 'done' | 'empty' | 'error';

const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;

/**
 * Search overlay (SPEC §6.6, D4) — mockup-language top sheet opened from
 * the navbar search button and the mobile nav via the `abkhd:search`
 * window event. Debounced live queries against `/api/search` with
 * request abortion; keyboard-navigable results.
 */
export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = () => {
    setOpen(false);
    setQ('');
    setResults([]);
    setStatus('idle');
    setActiveIndex(-1);
    triggerRef.current?.focus();
  };

  // Open triggers: navbar search button + mobile nav (via window event)
  useEffect(() => {
    const openOverlay = () => {
      triggerRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener('abkhd:search', openOverlay);
    return () => window.removeEventListener('abkhd:search', openOverlay);
  }, []);

  // Auto-close on navigation (same pattern as MobileNav)
  useEffect(() => {
    const onPageLoad = () => setOpen(false);
    document.addEventListener('astro:page-load', onPageLoad);
    return () => document.removeEventListener('astro:page-load', onPageLoad);
  }, []);

  // Focus the input as soon as the sheet opens
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Debounced live search with stale-request abortion
  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (term.length < MIN_CHARS) {
      setStatus('idle');
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`search failed: ${res.status}`);
        const data = (await res.json()) as { results?: SearchHit[] };
        const hits = data.results ?? [];
        setResults(hits);
        setActiveIndex(hits.length > 0 ? 0 : -1);
        setStatus(hits.length === 0 ? 'empty' : 'done');
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setStatus('error');
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, open]);

  // Escape to close + arrow-key navigation + Enter to open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (results.length ? Math.min(i + 1, results.length - 1) : -1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const hit = results[activeIndex];
        if (hit) window.location.href = `/products/${hit.id}`;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, activeIndex]);

  const term = q.trim();

  return (
    <DrawerPanel open={open} onClose={close} title="Search">
      {/* Query row — underline input, mockup contact pattern */}
      <div className="flex items-center gap-3 px-1">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={status === 'done'}
          aria-controls="search-overlay-results"
          aria-label="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search devices…"
          className="field-input"
          autoComplete="off"
        />
        {q && (
          <button
            onClick={() => {
              setQ('');
              inputRef.current?.focus();
            }}
            aria-label="Clear query"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Results / states */}
      <div className="mt-4">
        {status === 'idle' && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Type at least {MIN_CHARS} characters
          </p>
        )}

        {status === 'loading' && (
          <ul className="space-y-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex animate-pulse items-center gap-3 rounded-2xl p-2">
                <span className="h-14 w-14 shrink-0 rounded-xl bg-muted" />
                <span className="flex-1 space-y-2">
                  <span className="block h-3.5 w-3/5 rounded-full bg-muted" />
                  <span className="block h-3 w-2/5 rounded-full bg-muted/70" />
                </span>
                <span className="h-3.5 w-14 rounded-full bg-muted" />
              </li>
            ))}
          </ul>
        )}

        {status === 'empty' && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No products found for “{term}”
          </p>
        )}

        {status === 'error' && (
          <div className="px-2 py-6 text-center">
            <p className="text-xs text-muted-foreground">Search is unavailable — try again</p>
            <button
              onClick={() => {
                const t = term;
                setQ('');
                requestAnimationFrame(() => setQ(t));
              }}
              className="mt-3 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-muted"
            >
              Retry
            </button>
          </div>
        )}

        {status === 'done' && (
          <ul id="search-overlay-results" role="listbox" className="max-h-[50vh] space-y-1 overflow-y-auto">
            {results.map((hit, i) => (
              <li key={hit.id} role="option" aria-selected={i === activeIndex}>
                <a
                  href={`/products/${hit.id}`}
                  className={`flex items-center gap-3 rounded-2xl p-2 transition ${
                    i === activeIndex ? 'bg-muted' : 'hover:bg-muted/60'
                  }`}
                >
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/60">
                    <img
                      src={hit.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold tracking-tight">
                      {hit.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {hit.category}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold">{formatPrice(hit.price)}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DrawerPanel>
  );
}
