import React from 'react';
import { ReceiptDisplay } from './ReceiptDisplay';
import type { ReceiptData } from './receipt.types';

export interface CheckoutReceiptProps {
  data: ReceiptData;
}

/**
 * Renders the receipt on the checkout confirmation screen. The data is built by
 * the checkout page once the payment has been verified server-side, so this
 * component is a pure renderer with no storage lookups or races.
 */
export function CheckoutReceipt({ data }: CheckoutReceiptProps) {
  return (
    <div className="w-full">
      <ReceiptDisplay data={data} />
    </div>
  );
}
