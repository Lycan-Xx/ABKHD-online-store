import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ABKHDReceipt } from './ABKHDReceipt';
import type { ReceiptData } from './receipt.types';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export interface ReceiptDisplayProps {
  data: ReceiptData;
}

export function ReceiptDisplay({ data }: ReceiptDisplayProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [frameHeight, setFrameHeight] = useState(A4_HEIGHT);

  useEffect(() => {
    const frame = frameRef.current;
    const receipt = receiptRef.current;
    if (!frame || !receipt) return;

    const measure = () => {
      const available = frame.clientWidth;
      const next = available > 0 ? Math.min(1, available / A4_WIDTH) : 1;
      const naturalHeight = Math.max(receipt.scrollHeight, A4_HEIGHT);
      setScale(next);
      setFrameHeight(Math.ceil(naturalHeight * next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(receipt);
    return () => observer.disconnect();
  }, []);

  /**
   * Print only the receipt. A clone is moved into a body-level portal so the
   * checkout chrome (header, cart pane, wizard) never reaches the PDF.
   */
  const handlePrint = useCallback(() => {
    const receipt = receiptRef.current;
    if (!receipt) return;

    let root = document.getElementById('abkhd-print-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'abkhd-print-root';
      document.body.appendChild(root);
    }

    root.innerHTML = '';

    const style = document.createElement('style');
    style.textContent =
      '@page{size:A4 portrait;margin:0}html,body{background:#fff!important;margin:0!important;padding:0!important}';
    root.appendChild(style);
    root.appendChild(receipt.cloneNode(true));

    document.documentElement.classList.add('abkhd-printing');

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      document.documentElement.classList.remove('abkhd-printing');
      root!.innerHTML = '';
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();
    window.setTimeout(cleanup, 3000);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Action toolbar - hidden on print */}
      <div className="no-print w-full max-w-[794px] flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 rounded-lg border border-[#e2e8f0] shadow-sm">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#111c33]">Order Receipt</h3>
          <p className="text-xs text-[#475569] mt-0.5 truncate">
            Receipt No: {data.footerReceiptNumber || data.receiptNumber}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#132035] hover:bg-[#1e3252] text-white text-sm font-bold rounded-lg transition-colors active:scale-95"
          title="Print or save this receipt as PDF"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print / Download PDF
        </button>
      </div>

      {/* Scaled preview */}
      <div
        ref={frameRef}
        className="w-full max-w-[794px] overflow-hidden rounded-lg bg-[#e9edf2] ring-1 ring-black/5"
      >
        <div style={{ height: frameHeight, position: 'relative' }}>
          <div
            style={{
              width: A4_WIDTH,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            className="absolute left-0 top-0"
          >
            <ABKHDReceipt ref={receiptRef} data={data} />
          </div>
        </div>
      </div>

      <p className="no-print text-[11px] text-[#64748b] text-center">
        Preview scaled to fit. Use Print / Download PDF for the full A4 copy.
      </p>
    </div>
  );
}
