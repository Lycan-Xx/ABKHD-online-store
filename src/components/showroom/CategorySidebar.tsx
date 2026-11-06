import { Sparkles, Trophy, Tag, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../lib/showroom';

export type CategoryKey = 'All' | (typeof CATEGORIES)[number];
export type FlagKey = 'new' | 'best' | 'sale';

type Props = {
  active: CategoryKey;
  onChange: (c: CategoryKey) => void;
  flag: FlagKey | null;
  onFlag: (f: FlagKey | null) => void;
};

/** Category + flag sidebar — exact mockup styling, ABKHD categories (SPEC §6.2). */
export function CategorySidebar({ active, onChange, flag, onFlag }: Props) {
  const entries: { key: CategoryKey; label: string }[] = [
    { key: 'All', label: 'All Products' },
    { key: 'Computers', label: 'Computers' },
    { key: 'Mobile Phones', label: 'Mobile Phones' },
    { key: 'Accessories', label: 'Accessories' },
  ];

  return (
    <aside className="rounded-2xl border border-border/70 bg-card p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</p>
      <ul className="mt-4 space-y-1">
        {entries.map((c) => {
          const isActive = active === c.key;
          return (
            <li key={c.key}>
              <button
                onClick={() => onChange(c.key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? 'bg-foreground text-background' : 'text-foreground/80 hover:bg-muted'
                }`}
              >
                <span className="font-medium">{c.label}</span>
                <ChevronRight className={`h-3.5 w-3.5 transition ${isActive ? 'opacity-100' : 'opacity-30'}`} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="my-5 h-px bg-border" />

      <div className="space-y-1">
        {[
          { k: 'new' as FlagKey, icon: Sparkles, label: 'New Arrival' },
          { k: 'best' as FlagKey, icon: Trophy, label: 'Best Seller' },
          { k: 'sale' as FlagKey, icon: Tag, label: 'On Discount' },
        ].map(({ k, icon: Icon, label }) => {
          const isActive = flag === k;
          return (
            <button
              key={k}
              onClick={() => onFlag(isActive ? null : k)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
