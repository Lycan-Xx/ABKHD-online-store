import { X } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Tailwind top offset class for the panel (default below floating navbar) */
  topClass?: string;
};

/** Slide-down-from-top glass sheet - port of the mockup DrawerPanel
 *  (0.45s expo-out via CSS transitions, overlay fade, scroll-lock while
 *  open). The panel stays mounted so the close animation can play; it is
 *  inert and hidden while closed. */
export function DrawerPanel({ open, onClose, title, children, topClass = 'top-20' }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        data-open={open ? 'true' : 'false'}
        aria-hidden="true"
        className="panel-overlay fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-label={title}
        aria-modal="false"
        data-open={open ? 'true' : 'false'}
        inert={!open}
        className={`panel-surface fixed inset-x-4 ${topClass} z-50 origin-top overflow-hidden rounded-3xl border border-border/70 bg-background/95 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.25)] backdrop-blur-xl`}
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title ?? ''}
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 pb-6 pt-2">{children}</div>
      </div>
    </>
  );
}
