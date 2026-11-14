import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, ChevronDown, Minus, Plus } from 'lucide-react';
import { formatPrice, calculateDiscount, parseDescription } from '../../lib/utils';
import type { ShowroomProduct } from '../../lib/showroom';
import { addToCart, openCart } from '../../stores/cart';

/** Store policy defaults (SPEC §6.5) — owner to confirm final wording. */
const SHIPPING_TEXT =
  'We deliver within Adamawa: ₦1,000 to Yola and ₦2,000 to Jimeta. Orders are confirmed and dispatched after payment verification — we will reach out on WhatsApp to arrange a delivery slot that suits you.';
const RETURNS_TEXT =
  'Every device is multi-point tested and its condition is disclosed upfront. If a device does not match what was described, contact us within 7 days of delivery and we will make it right — that is the whole policy.';

type Props = {
  product: ShowroomProduct;
};

/**
 * PDP info column + mobile action bar (SPEC §6.5) — exact mockup layout
 * with the ratings row replaced by a stock line (D3), real variants
 * (Finish = colors, Size = sizes), and CTAs wired to the existing cart
 * store including the selected variant (key: id-size-color).
 */
export function ProductDetail({ product }: Props) {
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>('details');

  const outOfStock = product.stock <= 0;
  const discount = calculateDiscount(product.price, product.originalPrice || 0);

  const stockLine = outOfStock
    ? 'Out of stock'
    : product.stock <= 5
      ? `Only ${product.stock} left`
      : 'In stock';

  const maxQty = product.stock > 0 ? product.stock : 1;
  // Functional update — safe against stale closures on rapid clicks.
  const stepQty = (fn: (q: number) => number) =>
    setQty((q) => Math.max(1, Math.min(maxQty, fn(q))));

  const add = () => {
    if (outOfStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      size: product.sizes?.length ? (size ?? product.sizes[0]) : null,
      color: product.colors?.length ? (color ?? product.colors[0]) : null,
    });
  };

  const onAddToCart = () => {
    add();
    openCart();
  };

  const onBuyNow = () => {
    add();
    window.location.href = '/checkout';
  };

  const accordionRows = [
    {
      k: 'details',
      title: 'Details',
      body: product.description ? (
        <div
          className="pb-5 text-sm leading-relaxed text-muted-foreground [&_p]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: parseDescription(product.description) }}
        />
      ) : (
        <p className="pb-5 text-sm text-muted-foreground">
          No additional details available for this product.
        </p>
      ),
    },
    { k: 'shipping', title: 'Shipping', body: SHIPPING_TEXT },
    { k: 'returns', title: 'Returns', body: RETURNS_TEXT },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {product.category}
          {product.brand ? ` · ${product.brand}` : ''}
        </p>
        <h1 className="text-balance mt-3 text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
          {product.name}
        </h1>

        {/* Stock line replaces the mockup ratings row (D3) */}
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          {product.verified && (
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">Verified</span>
            </span>
          )}
          {product.verified && <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />}
          <span>{stockLine}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>Tested &amp; inspected</span>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p className="text-3xl font-semibold tracking-tight md:text-4xl">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {discount !== null && (
                <span className="rounded-full border border-border/70 bg-background/90 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>

        <p className="mt-6 line-clamp-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {product.description
            ? product.description.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^- /gm, '· ')
            : 'A tested, honestly disclosed device from the ABKHD showroom.'}
        </p>

        {/* Variants — Finish (colors) */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Finish {color && <span className="text-foreground">· {color}</span>}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    color === c
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-foreground/80 hover:border-foreground/40'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variants — Size */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Size {size && <span className="text-foreground">· {size}</span>}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    size === s
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-foreground/80 hover:border-foreground/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty + actions (desktop) */}
        <div className="mt-8 hidden flex-wrap items-center gap-3 md:flex">
          <QtyStepper qty={qty} onDecrement={() => stepQty((q) => q - 1)} onIncrement={() => stepQty((q) => q + 1)} disabled={outOfStock} />
          <button
            onClick={onAddToCart}
            disabled={outOfStock}
            className={`min-w-[180px] flex-1 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted ${
              outOfStock ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            Add to Cart
          </button>
          <button
            onClick={onBuyNow}
            disabled={outOfStock}
            className={`min-w-[180px] flex-1 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 ${
              outOfStock ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            Buy Now
          </button>
        </div>
        {outOfStock && (
          <p className="mt-3 hidden text-xs text-muted-foreground md:block">
            This item is currently out of stock — check back soon.
          </p>
        )}

        {/* Accordion */}
        <div className="mt-10 border-t border-border">
          {accordionRows.map((row) => {
            const isOpen = open === row.k;
            return (
              <div key={row.k} className="border-b border-border">
                <button
                  onClick={() => setOpen(isOpen ? null : row.k)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
                >
                  {row.title}
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen &&
                  (typeof row.body === 'string' ? (
                    <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                      {row.body}
                    </p>
                  ) : (
                    row.body
                  ))}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Sticky mobile action bar — exact mockup */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-[1240px] items-center gap-2">
          <QtyStepper qty={qty} onDecrement={() => stepQty((q) => q - 1)} onIncrement={() => stepQty((q) => q + 1)} compact disabled={outOfStock} />
          <button
            onClick={onAddToCart}
            disabled={outOfStock}
            className={`flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-medium ${
              outOfStock ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            Add to Cart
          </button>
          <button
            onClick={onBuyNow}
            disabled={outOfStock}
            className={`flex-1 rounded-full bg-foreground px-4 py-2.5 text-xs font-medium text-background ${
              outOfStock ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
}

/** Exact mockup QtyStepper — pill border, round h-9 buttons, min 1, max = stock. */
function QtyStepper({
  qty,
  onIncrement,
  onDecrement,
  compact = false,
  disabled = false,
}: {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-background ${
        compact ? 'px-1 py-0.5' : 'px-1.5 py-1'
      } ${disabled ? 'pointer-events-none opacity-40' : ''}`}
    >
      <button
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={`grid place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground ${
          compact ? 'h-7 w-7' : 'h-9 w-9'
        }`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={`min-w-6 text-center font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
        {qty}
      </span>
      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={`grid place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground ${
          compact ? 'h-7 w-7' : 'h-9 w-9'
        }`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
