import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Lock, X } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import type { PublicPromoItem } from '../../lib/promo';

interface Props {
  token: string;
  title: string;
  endsAt: string | null;
  initialItems: PublicPromoItem[];
}

const POLL_MS = 12_000;

export function PromoExperience({ token, title, endsAt, initialItems }: Props) {
  const [items, setItems] = useState<PublicPromoItem[]>(initialItems);
  const [selected, setSelected] = useState<PublicPromoItem | null>(null);
  const selectedRef = useRef<PublicPromoItem | null>(null);
  selectedRef.current = selected;

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/promo/items?t=${encodeURIComponent(token)}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.phase && data.phase !== 'live') {
        window.location.reload();
        return;
      }
      if (Array.isArray(data.items)) setItems(data.items);
    } catch {
      /* network blips are fine; the next poll recovers */
    }
  }, [token]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const id = window.setInterval(tick, POLL_MS);
    // Coming back from the payment page with the browser's Back button can
    // restore this page frozen mid-submit with stale item states: start fresh.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [refresh]);

  // Close the sheet if the item is taken while the buyer is reading it.
  const liveSelected = selected ? items.find((i) => i.id === selected.id) : null;

  const left = items.filter((i) => i.state === 'available').length;

  return (
    <div>
      <section className="pb-8 pt-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          One of a kind · first come, first served
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {items.length === 0
            ? 'No items yet. Check back soon.'
            : left === 0
              ? 'Everything has been claimed. Thank you!'
              : `${left} of ${items.length} still available`}
          {endsAt ? ` · ends ${new Date(endsAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}` : ''}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PromoCard key={item.id} item={item} onClaim={() => setSelected(item)} />
        ))}
      </div>

      {selected && (
        <ClaimSheet
          token={token}
          item={liveSelected ?? selected}
          onClose={() => setSelected(null)}
          onConflict={refresh}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PromoCard({ item, onClaim }: { item: PublicPromoItem; onClaim: () => void }) {
  const discount = calculateDiscount(item.promoPrice, item.originalPrice);
  const claimed = item.state === 'claimed';
  const reserved = item.state === 'reserved';
  const unavailable = claimed || reserved;

  return (
    <article
      className={`group flex flex-col rounded-2xl border border-border/70 bg-card p-3 transition ${
        claimed ? 'opacity-70' : ''
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/60">
        <img
          src={item.image}
          alt={claimed ? '' : item.name}
          loading="lazy"
          width={800}
          height={800}
          className={`h-full w-full object-cover transition duration-500 ${
            claimed ? 'scale-105 blur-md grayscale' : reserved ? 'opacity-60' : ''
          }`}
        />

        {discount !== null && !claimed && (
          <span className="absolute bottom-3 left-3 z-10 rounded-full border border-border/70 bg-background/90 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            -{discount}%
          </span>
        )}

        {unavailable && (
          <div className="absolute inset-0 z-10 grid place-items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Lock className="h-3 w-3" />
              {claimed ? 'Claimed' : 'On hold'}
            </span>
          </div>
        )}
      </div>

      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[15px] font-semibold tracking-tight">
            {claimed ? 'Sold' : item.name}
          </h2>
          {!claimed && (
            <div className="text-right">
              <div className="whitespace-nowrap text-[15px] font-semibold tracking-tight">
                {formatPrice(item.promoPrice)}
              </div>
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(item.originalPrice)}
              </div>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {claimed
            ? 'This one found a home.'
            : reserved
              ? 'Someone is paying now. It may come back.'
              : item.category}
        </p>
      </div>

      <div className="mt-4 px-1 pb-1">
        <button
          onClick={onClaim}
          disabled={unavailable}
          className="w-full rounded-full bg-foreground px-3 py-2.5 text-xs font-medium text-background transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        >
          {claimed ? 'Claimed' : reserved ? 'On hold' : 'Claim this deal'}
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function ClaimSheet({
  token,
  item,
  onClose,
  onConflict,
}: {
  token: string;
  item: PublicPromoItem;
  onClose: () => void;
  onConflict: () => void;
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // While our own request is in flight (or we are being sent to the payment
  // page) the item shows as "on hold" because *we* now hold it. That is not
  // "taken by someone else", so don't flash that message at the buyer.
  const gone = !busy && item.state !== 'available';
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || gone) return;
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/promo/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, itemId: item.id, ...form }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setError(data.error || 'Something went wrong. Please try again.');
      if (res.status === 409 || res.status === 404) onConflict();
    } catch {
      setError('Network error. Please check your connection and try again.');
    }
    setBusy(false);
  }

  const field =
    'w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-foreground/40';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <form
        onSubmit={submit}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">{item.name}</h3>
            <p className="text-sm">
              <span className="font-semibold">{formatPrice(item.promoPrice)}</span>{' '}
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(item.originalPrice)}
              </span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          We hold this item for you while you pay. Delivery is arranged with you after payment, so
          enter the full address.
        </p>

        <div className="mt-4 space-y-3">
          <input className={field} placeholder="Full name" value={form.name} onChange={set('name')} required autoComplete="name" />
          <input className={field} type="email" placeholder="Email" value={form.email} onChange={set('email')} required autoComplete="email" />
          <input className={field} type="tel" placeholder="Phone number" value={form.phone} onChange={set('phone')} required autoComplete="tel" />
          <textarea
            className={`${field} resize-none`}
            rows={3}
            placeholder="Full delivery address (street, area, city, state)"
            value={form.address}
            onChange={set('address')}
            required
            minLength={8}
            autoComplete="street-address"
          />
        </div>

        {(error || gone) && (
          <p role="alert" className="mt-3 text-sm text-red-500">
            {gone ? 'Sorry, this item was just taken.' : error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || gone}
          className="mt-5 w-full rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? 'Taking you to payment…' : `Pay ${formatPrice(item.promoPrice)}`}
        </button>
      </form>
    </div>
  );
}
