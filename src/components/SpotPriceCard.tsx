import { MarketData } from '../types';
import { Translations } from '../i18n';

interface SpotPriceCardProps {
  data: MarketData;
  t: Translations;
}

export default function SpotPriceCard({ data, t }: SpotPriceCardProps) {
  const { spotPrice, spotPriceChange, commodity, isLive, lastUpdated } = data;
  const isPositive = spotPriceChange >= 0;
  const symbol = commodity === 'silver' ? 'XAG' : 'XAU';
  const precision = commodity === 'silver' ? 2 : 0;

  return (
    <div className="card p-5 flex flex-col gap-2 min-w-[200px]">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          {symbol} · {t.spotPrice}
        </span>
        {/* Live / mock badge */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isLive
              ? 'bg-green-100 text-green-600'
              : 'bg-amber-100 text-amber-600'
          }`}
        >
          {isLive ? `● ${t.liveBadge}` : t.mockDataBadge}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-800">
          ${spotPrice.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })}
        </span>
        <span className="text-sm text-slate-400 mb-1">{t.priceUnit}</span>
      </div>

      {/* 24h change */}
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
        <span>{isPositive ? '▲' : '▼'}</span>
        <span>{Math.abs(spotPriceChange).toFixed(2)}%</span>
        <span className="text-slate-400 font-normal text-xs ml-1">{t.change24h}</span>
      </div>

      {/* Last updated */}
      <p className="text-[11px] text-slate-400 mt-1">
        {t.lastUpdated}: {lastUpdated.toLocaleTimeString()}
      </p>
    </div>
  );
}
