import React, { forwardRef } from 'react';
import type {
  PaymentConfirmationStatus,
  ReceiptBadgeStatus,
  ReceiptData,
  StoreBrandingConfig,
} from './receipt.types';

const DEFAULT_STORE_CONFIG: StoreBrandingConfig = {
  brandPrimary: 'ABKHD',
  brandAccent: 'Store',
  subtitle: 'Premium Tech Electronics',
  tagline: 'SMARTER TECH. BETTER LIVING.',
  hoursLine1: 'Mon – Sat: 9AM – 8PM',
  hoursLine2: 'Sun: 10AM – 6PM',
  warrantyTitle: '30-Day Warranty',
  warrantySubtitle: 'on all devices',
  returnsTitle: 'Returns within',
  returnsSubtitle: '7 days',
  supportMessage: 'Questions? Message us on our store for support.',
};

const BADGE_STYLES: Record<
  ReceiptBadgeStatus,
  { bg: string; label: string }
> = {
  PAID: { bg: '#159947', label: 'PAID' },
  PENDING: { bg: '#d97706', label: 'PENDING' },
  UNPAID: { bg: '#dc2626', label: 'UNPAID' },
  REFUNDED: { bg: '#475569', label: 'REFUNDED' },
};

const PAYMENT_STATUS_COLOR: Record<PaymentConfirmationStatus, string> = {
  Confirmed: '#159947',
  Pending: '#d97706',
  Failed: '#dc2626',
  Refunded: '#475569',
};

function formatCurrency(amount: number, symbol = '₦'): string {
  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}

export interface ABKHDReceiptProps {
  data: ReceiptData;
  className?: string;
}

export const ABKHDReceipt = forwardRef<HTMLDivElement, ABKHDReceiptProps>(
  ({ data, className = '' }, ref) => {
    const store: StoreBrandingConfig = {
      ...DEFAULT_STORE_CONFIG,
      ...data.store,
    };

    const currency = data.currencySymbol ?? '₦';

    // Compute line items & summary totals dynamically
    const computedItems = data.items.map((item) => ({
      ...item,
      lineTotal: item.totalOverride ?? item.quantity * item.unitPrice,
    }));

    const subtotal =
      data.subtotalOverride ??
      computedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const vatAmount =
      data.vatAmountOverride ?? Math.round(subtotal * data.vatRate);

    const totalAmount =
      data.totalAmountOverride ?? subtotal + data.deliveryFee + vatAmount;

    const vatPercentageDisplay = Number((data.vatRate * 100).toFixed(2));
    const showVat = data.vatRate > 0 || vatAmount > 0;
    const badge = BADGE_STYLES[data.badgeStatus];
    const paymentStatusColor = PAYMENT_STATUS_COLOR[data.payment.status];

    const formattedHeaderReceiptNo = data.receiptNumber.startsWith('#')
      ? data.receiptNumber
      : `#${data.receiptNumber}`;

    const formattedFooterReceiptNo =
      data.footerReceiptNumber ??
      data.receiptNumber
        .replace(/^#/, '')
        .replace(/^ABKHD-/, 'ABKHD-RCPT-');

    return (
      <div
        ref={ref}
        style={{
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
        className={`relative w-[794px] min-h-[1123px] bg-white text-[#111c33] overflow-hidden flex flex-col justify-between shadow-xl select-none ${className}`}
      >
        {/* Top subtle cool gradient & top-right circuit trace graphic */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[230px]"
          style={{
            background:
              'linear-gradient(180deg, #f3f6fa 0%, rgba(255,255,255,0) 100%)',
          }}
        />
        <svg
          className="pointer-events-none absolute top-0 right-0 w-[340px] h-[165px] opacity-55"
          viewBox="0 0 340 165"
          fill="none"
        >
          <path
            d="M340 18H245L210 53H125"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <circle cx="122" cy="53" r="3.5" fill="#cbd5e1" />
          <path
            d="M340 42H268L232 78H165"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <circle cx="162" cy="78" r="3.5" fill="#cbd5e1" />
          <path
            d="M340 68H292L252 108H205"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <circle cx="202" cy="108" r="3.5" fill="#cbd5e1" />
          <path
            d="M340 96H312L282 126"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <circle cx="280" cy="128" r="3.5" fill="#cbd5e1" />
          <path
            d="M315 110L340 135"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <circle cx="313" cy="108" r="3.5" fill="#cbd5e1" />
        </svg>

        {/* Main Content Wrapper */}
        <div className="relative z-10 px-9 pt-8 pb-6 flex-1 flex flex-col">
          {/* 1. HEADER */}
          <header className="flex items-center gap-5 mb-6">
            {/* Brand Logo */}
            <div className="w-[96px] h-[84px] flex items-center justify-center shrink-0">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={`${store.brandPrimary} Logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <DefaultBrandLogoSvg />
              )}
            </div>

            {/* Vertical Divider */}
            <div className="w-[1.5px] h-[72px] bg-[#1e293b]" />

            {/* Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-[36px] leading-none font-extrabold tracking-tight">
                <span className="text-[#111c33]">{store.brandPrimary}</span>{' '}
                <span className="text-[#ff6600]">{store.brandAccent}</span>
              </h1>
              <p className="text-[17px] font-medium text-[#475569] mt-1.5">
                {store.subtitle}
              </p>
              <p className="text-[11px] font-bold tracking-[0.16em] text-[#64748b] uppercase mt-1.5">
                {store.tagline}
              </p>
            </div>
          </header>

          {/* 2. RECEIPT NUMBER & STATUS BANNER */}
          <section className="bg-[#eef2f6] rounded-2xl px-6 py-4 flex items-center justify-between mb-6">
            <div>
              <p className="text-[13px] font-bold tracking-wider text-[#475569] uppercase">
                RECEIPT NO.
              </p>
              <p className="text-[28px] font-extrabold tracking-tight text-[#111c33] leading-tight mt-0.5">
                {formattedHeaderReceiptNo}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-[1px] h-[52px] bg-[#cbd5e1]" />
              <div
                style={{ backgroundColor: badge.bg }}
                className="h-[48px] px-6 rounded-full flex items-center gap-2.5 text-white shadow-sm"
              >
                <svg
                  className="w-6 h-6 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                >
                  <circle cx="12" cy="12" r="9.5" />
                  <path
                    d="M8.5 12.3L10.8 14.6L15.8 9.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[21px] font-extrabold tracking-wide">
                  {badge.label}
                </span>
              </div>
            </div>
          </section>

          {/* 3. CUSTOMER, DELIVERY ADDRESS & LOCATION */}
          <section className="grid grid-cols-[1.45fr_1.15fr_0.75fr] gap-4 mb-6">
            {/* Customer Details */}
            <div className="pr-3 border-r border-[#cbd5e1]">
              <div className="flex items-center gap-2 mb-2.5">
                <svg
                  className="w-5 h-5 text-[#132035] shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
                </svg>
                <h2 className="text-[15px] font-bold text-[#111c33]">
                  Customer Details
                </h2>
              </div>
              <div className="grid grid-cols-[62px_1fr] gap-y-1 text-[13.5px] leading-snug text-[#1e293b]">
                <span className="font-medium text-[#334155]">Name:</span>
                <span className="font-medium">{data.customer.name}</span>

                <span className="font-medium text-[#334155]">Email:</span>
                <span className="font-medium break-all">
                  {data.customer.email}
                </span>

                <span className="font-medium text-[#334155]">Phone:</span>
                <span className="font-medium">{data.customer.phone}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="px-2 border-r border-[#cbd5e1]">
              <div className="flex items-center gap-1.5 mb-2.5">
                <svg
                  className="w-5 h-5 text-[#132035] shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                </svg>
                <h2 className="text-[15px] font-bold text-[#111c33]">
                  Delivery Address
                </h2>
              </div>
              <div className="text-[13.5px] leading-snug font-medium text-[#1e293b] space-y-1">
                <p>{data.deliveryAddress.street}</p>
                <p>{data.deliveryAddress.city}</p>
                <p>{data.deliveryAddress.stateCountry}</p>
              </div>
            </div>

            {/* Location */}
            <div className="pl-2">
              <div className="flex items-center gap-1.5 mb-2.5">
                <svg
                  className="w-5 h-5 text-[#132035] shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
                </svg>
                <h2 className="text-[15px] font-bold text-[#111c33]">
                  Location
                </h2>
              </div>
              <div className="text-[13.5px] leading-snug font-medium text-[#1e293b] space-y-1">
                <p>{data.location.city}</p>
                <p>{data.location.state}</p>
              </div>
            </div>
          </section>

          {/* 4. ITEMS TABLE */}
          <section className="mb-5">
            {/* Dark Navy Rounded Header */}
            <div className="bg-[#132035] text-white rounded-xl px-6 py-3 grid grid-cols-[1fr_100px_135px_135px] items-center text-[15px] font-bold">
              <div>Items</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Unit Price</div>
              <div className="text-right pr-2">Total</div>
            </div>

            {/* Line Items */}
            <div className="divide-y divide-[#e2e8f0] border-b border-[#e2e8f0]">
              {computedItems.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 grid grid-cols-[1fr_100px_135px_135px] items-center"
                >
                  {/* Thumbnail + Title & Variant */}
                  <div className="flex items-center gap-4 pr-3">
                    <div className="w-[46px] h-[46px] rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <DefaultProductIcon />
                      )}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#111c33] leading-tight">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="text-[13px] font-medium text-[#475569] mt-0.5">
                          {item.variant}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="text-center text-[16px] font-bold text-[#111c33]">
                    {item.quantity}
                  </div>

                  {/* Unit Price */}
                  <div className="text-center text-[16px] font-bold text-[#111c33]">
                    {formatCurrency(item.unitPrice, currency)}
                  </div>

                  {/* Line Total */}
                  <div className="text-right pr-2 text-[16px] font-bold text-[#111c33]">
                    {formatCurrency(item.lineTotal, currency)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. TOTALS SUMMARY CARD */}
          <section className="flex justify-end mb-6">
            <div className="w-[385px] bg-[#eef2f6] rounded-2xl overflow-hidden">
              <div className="px-6 pt-4 pb-3.5 space-y-2.5 text-[15.5px]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1e293b]">Subtotal</span>
                  <span className="font-bold text-[#111c33]">
                    {formatCurrency(subtotal, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1e293b]">
                    Delivery Fee ({data.deliveryAreaLabel})
                  </span>
                  <span className="font-bold text-[#111c33]">
                    {formatCurrency(data.deliveryFee, currency)}
                  </span>
                </div>

                {showVat && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1e293b]">
                      VAT ({vatPercentageDisplay}%)
                    </span>
                    <span className="font-bold text-[#111c33]">
                      {formatCurrency(vatAmount, currency)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total Amount Dark Navy Pill Footer */}
              <div className="bg-[#132035] text-white px-6 py-3.5 rounded-2xl flex items-center justify-between">
                <span className="text-[18px] font-bold">Total Amount</span>
                <span className="text-[22px] font-extrabold tracking-tight">
                  {formatCurrency(totalAmount, currency)}
                </span>
              </div>
            </div>
          </section>

          {/* 6. PAYMENT DETAILS */}
          <section className="mb-5">
            <div className="flex items-center gap-3 mb-3.5">
              <div className="flex items-center gap-2.5 shrink-0">
                <svg
                  className="w-6 h-6 text-[#132035]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
                <h2 className="text-[16px] font-bold text-[#111c33]">
                  Payment Details
                </h2>
              </div>
              <div className="h-[1px] bg-[#cbd5e1] flex-1" />
            </div>

            <div className="grid grid-cols-[1.2fr_1.3fr_0.9fr] items-center pb-4 border-b border-[#cbd5e1]">
              {/* Payment Method */}
              <div className="pr-4 border-r border-[#cbd5e1]">
                <p className="text-[13.5px] font-medium text-[#475569]">
                  Payment Method
                </p>
                <p className="text-[15px] font-bold text-[#111c33] mt-1">
                  {data.payment.method}
                </p>
              </div>

              {/* Transaction Reference */}
              <div className="px-5 border-r border-[#cbd5e1]">
                <p className="text-[13.5px] font-medium text-[#475569]">
                  Transaction Reference
                </p>
                <p className="text-[15px] font-bold text-[#111c33] mt-1">
                  {data.payment.transactionReference}
                </p>
              </div>

              {/* Payment Status */}
              <div className="pl-5">
                <p className="text-[13.5px] font-medium text-[#475569]">
                  Payment Status
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <svg
                    className="w-4 h-4 shrink-0"
                    style={{ color: paymentStatusColor }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className="text-[15px] font-bold"
                    style={{ color: paymentStatusColor }}
                  >
                    {data.payment.status}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 7. STORE HOURS, WARRANTY & RETURNS */}
          <section className="grid grid-cols-3 items-start pt-1 mb-6">
            {/* Store Hours */}
            <div className="flex items-start gap-3 pr-3 border-r border-[#cbd5e1]">
              <svg
                className="w-6 h-6 text-[#132035] mt-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <circle cx="12" cy="12" r="9.5" />
                <path
                  d="M12 7v5l3.5 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-[13px] leading-snug">
                <p className="font-bold text-[#111c33]">Store Hours</p>
                <p className="font-medium text-[#1e293b] mt-0.5">
                  {store.hoursLine1}
                </p>
                <p className="font-medium text-[#1e293b]">
                  {store.hoursLine2}
                </p>
              </div>
            </div>

            {/* 30-Day Warranty */}
            <div className="flex items-start gap-3 px-5 border-r border-[#cbd5e1]">
              <svg
                className="w-6 h-6 text-[#132035] mt-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z" />
              </svg>
              <div className="text-[13px] leading-snug">
                <p className="font-bold text-[#111c33]">{store.warrantyTitle}</p>
                <p className="font-medium text-[#1e293b] mt-0.5">
                  {store.warrantySubtitle}
                </p>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="flex items-start gap-3 pl-5">
              <svg
                className="w-7 h-7 text-[#132035] mt-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 3L4 7.5v9L12 21l8-4.5v-9L12 3z"
                  strokeLinejoin="round"
                />
                <path d="M4 7.5L12 12l8-4.5" strokeLinejoin="round" />
                <path d="M12 12v9" strokeLinecap="round" />
                <path
                  d="M7 14.5l-2.5 1.5L7 17.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-[13px] leading-snug">
                <p className="font-bold text-[#111c33]">{store.returnsTitle}</p>
                <p className="font-bold text-[#111c33]">
                  {store.returnsSubtitle}
                </p>
              </div>
            </div>
          </section>

          {/* 8. FOOTER SUPPORT & RECEIPT ID */}
          <footer className="mt-auto pt-2 text-center">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-[1px] bg-[#94a3b8] flex-1" />
              <p className="text-[13px] font-medium text-[#334155]">
                {store.supportMessage}
              </p>
              <div className="h-[1px] bg-[#94a3b8] flex-1" />
            </div>
            <p className="text-[13.5px] font-bold text-[#111c33]">
              Receipt No: {formattedFooterReceiptNo}
            </p>
          </footer>
        </div>

        {/* 9. BOTTOM SYMMETRICAL NAVY & ORANGE CORNER RIBBONS */}
        <div className="pointer-events-none relative h-[28px] w-full flex justify-between items-end">
          {/* Bottom-Left Ribbon */}
          <svg className="w-[140px] h-[28px]" viewBox="0 0 140 28" fill="none">
            <polygon points="0,4 96,4 122,28 0,28" fill="#132035" />
            <polygon points="82,4 96,4 122,28 108,28" fill="#ff6600" />
          </svg>

          {/* Bottom-Right Ribbon */}
          <svg className="w-[140px] h-[28px]" viewBox="0 0 140 28" fill="none">
            <polygon points="44,4 140,4 140,28 18,28" fill="#132035" />
            <polygon points="44,4 58,4 32,28 18,28" fill="#ff6600" />
          </svg>
        </div>
      </div>
    );
  }
);

ABKHDReceipt.displayName = 'ABKHDReceipt';

/* Fallback Vector Logo matching the circuit-board shopping bag "AS" monogram */
function DefaultBrandLogoSvg() {
  return (
    <svg className="w-[86px] h-[82px]" viewBox="0 0 100 96" fill="none">
      {/* Bag Handle */}
      <path
        d="M35 28V20C35 11.7157 41.7157 5 50 5C58.2843 5 65 11.7157 65 20V28"
        stroke="#1e3a5f"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M38 28V20C38 13.3726 43.3726 8 50 8C56.6274 8 62 13.3726 62 20V28"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Bag Body */}
      <path
        d="M21 28H79L85 83C85.5 87.5 82 91 77.5 91H22.5C18 91 14.5 87.5 15 83L21 28Z"
        fill="#f1f5f9"
        stroke="#1e3a5f"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Circuit Traces */}
      <path
        d="M26 38H36L42 44M74 38H64L58 44M24 76H36L42 70M76 76H64L58 70"
        stroke="#38bdf8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Monogram "AS" */}
      <text
        x="50"
        y="69"
        textAnchor="middle"
        fill="#0f294a"
        stroke="#38bdf8"
        strokeWidth="1.2"
        fontSize="34"
        fontWeight="900"
        fontFamily="Inter, sans-serif"
        letterSpacing="-1"
      >
        AS
      </text>
    </svg>
  );
}

function DefaultProductIcon() {
  return (
    <svg
      className="w-6 h-6 text-[#64748b]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <circle cx="12" cy="17.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
