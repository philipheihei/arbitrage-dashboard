import { Translations } from '../i18n';

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
  t: Translations;
}

export default function MonthSelector({ month, year, onChange, t }: MonthSelectorProps) {
  const prev = () => {
    if (month === 1) onChange(12, year - 1);
    else onChange(month - 1, year);
  };

  const next = () => {
    if (month === 12) onChange(1, year + 1);
    else onChange(month + 1, year);
  };

  const monthLabel = t.monthNames[month - 1];

  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
        {t.settlement}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors text-sm"
        >
          ‹
        </button>
        <span className="text-sm font-bold text-indigo-600 min-w-[120px] text-center">
          {monthLabel} {year}
        </span>
        <button
          onClick={next}
          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors text-sm"
        >
          ›
        </button>
      </div>
    </div>
  );
}
