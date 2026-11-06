import { Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DrawerPanel } from './DrawerPanel';
import { openCart } from '../../stores/cart';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const;

/**
 * Mobile navigation — mockup Navbar mobile drawer pattern (SPEC §5.3).
 * Opened from the floating navbar's menu button via the `abkhd:mobile-nav`
 * window event; auto-closes on navigation (`astro:page-load`).
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState('/');

  useEffect(() => {
    setPath(window.location.pathname);
    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);
    window.addEventListener('abkhd:mobile-nav', toggle);
    document.addEventListener('astro:page-load', close);
    return () => {
      window.removeEventListener('abkhd:mobile-nav', toggle);
      document.removeEventListener('astro:page-load', close);
    };
  }, []);

  return (
    <div className="md:hidden">
      <DrawerPanel open={open} onClose={() => setOpen(false)} title="Menu">
        <ul className="space-y-2">
          {links.map((l) => {
            const active = l.to === '/' ? path === '/' : path.startsWith(l.to);
            return (
              <li key={l.to}>
                <a
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className={`block rounded-2xl px-4 py-3.5 text-[15px] transition ${
                    active
                      ? 'bg-muted font-semibold text-foreground shadow-[inset_0_0_0_1px_var(--border)]'
                      : 'text-foreground/80 hover:bg-muted/60'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="my-4 h-px bg-border/70" />
        <div className="flex gap-2">
          {/* Search — opens the live SearchOverlay island (SPEC §6.6) */}
          <button
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent('abkhd:search'));
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <Search className="h-4 w-4" /> Search
          </button>
          <button
            onClick={() => {
              setOpen(false);
              openCart();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" /> Cart
          </button>
        </div>
      </DrawerPanel>
    </div>
  );
}
