import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type SortOption<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: SortOption<T>[];
  onChange: (value: T) => void;
};

/**
 * Custom sort menu. Replaces the native `<select>`, which Android renders as
 * the platform list widget instead of the showroom UI. Same pill trigger as
 * the mockup, expo-out open animation, dismisses on outside click or Escape.
 */
export function SortMenu<T extends string>({ id, label, value, options, onChange }: Props<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = options.find((o) => o.key === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background py-2 pr-3 pl-4 text-sm font-medium text-foreground transition hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none"
      >
        <span className="truncate">{active?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <ul
        role="listbox"
        aria-label={label}
        data-open={open ? 'true' : 'false'}
        inert={!open}
        className="menu-surface absolute right-0 z-30 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-border/70 bg-background p-1.5 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.28)]"
      >
        {options.map((option) => {
          const selected = option.key === value;
          return (
            <li key={option.key} role="none">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {selected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
