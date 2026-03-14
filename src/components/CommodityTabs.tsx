import { Commodity } from '../types';
import { Translations } from '../i18n';

interface CommodityTabsProps {
  selected: Commodity;
  onChange: (c: Commodity) => void;
  t: Translations;
}

const COMMODITIES: { id: Commodity; emoji: string }[] = [
  { id: 'silver', emoji: '🥈' },
  { id: 'gold',   emoji: '🥇' },
];

export default function CommodityTabs({ selected, onChange, t }: CommodityTabsProps) {
  const label = (id: Commodity) => (id === 'silver' ? t.silverFull : t.goldFull);

  return (
    <div className="flex gap-2 flex-wrap">
      {COMMODITIES.map(({ id, emoji }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
            selected === id
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          <span>{emoji}</span>
          <span>{label(id)}</span>
        </button>
      ))}
      {/* Placeholder for future commodities */}
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-dashed border-slate-300 text-slate-400 cursor-not-allowed"
        title="Coming soon"
      >
        <span>＋</span>
        <span className="text-xs">More…</span>
      </button>
    </div>
  );
}
