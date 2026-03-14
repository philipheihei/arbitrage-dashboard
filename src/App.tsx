import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CommodityTabs from './components/CommodityTabs';
import SpotPriceCard from './components/SpotPriceCard';
import MonthSelector from './components/MonthSelector';
import ComparisonChart from './components/ComparisonChart';
import ArbitrageTable from './components/ArbitrageTable';
import { Language, Commodity, MarketData } from './types';
import { translations } from './i18n';
import { getMockMarketData, getActiveMonth } from './mockData';
import { fetchAllMarketData } from './dataService';

type LoadState = 'idle' | 'loading' | 'done' | 'error';

export default function App() {
  const [language, setLanguage] = useState<Language>('zh');
  const [commodity, setCommodity] = useState<Commodity>('silver');

  const active = getActiveMonth();
  const [month, setMonth] = useState(active.month);
  const [year, setYear]   = useState(active.year);

  const [marketData, setMarketData] = useState<MarketData>(() =>
    getMockMarketData('silver', active.month, active.year),
  );
  const [loadState, setLoadState]   = useState<LoadState>('idle');
  const [spotLive,  setSpotLive]    = useState(false);
  const [polyLive,  setPolyLive]    = useState(false);
  const [pfLive,    setPfLive]      = useState(false);
  const [directionFilter, setDirectionFilter] = useState<'high' | 'low'>('high');

  const t = translations[language];

  const refreshData = useCallback(async () => {
    setLoadState('loading');
    try {
      const result = await fetchAllMarketData(commodity, month, year);
      setMarketData(result.data);
      setSpotLive(result.spotLive);
      setPolyLive(result.polyLive);
      setPfLive(result.pfLive);
      setLoadState('done');
    } catch {
      setMarketData(getMockMarketData(commodity, month, year));
      setLoadState('error');
    }
  }, [commodity, month, year]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleMonthChange = (m: number, y: number) => {
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header language={language} onLanguageChange={setLanguage} t={t} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* Status banner */}
        {loadState === 'loading' && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl">
            <span className="animate-spin inline-block">⟳</span>
            <span>{language === 'zh' ? '正在獲取實時數據…' : 'Fetching live data…'}</span>
          </div>
        )}
        {loadState === 'error' && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
            ⚠ {language === 'zh' ? '無法獲取實時數據，顯示模擬數據' : 'Live data unavailable — showing simulated data'}
          </div>
        )}
        {loadState === 'done' && (
          <div className="flex flex-wrap items-center gap-3 text-xs px-4 py-2 rounded-xl bg-white border border-slate-100">
            <DataBadge live={spotLive}  label={language === 'zh' ? '現貨價格' : 'Spot Price'} />
            <DataBadge live={polyLive}  label="Polymarket" />
            <DataBadge live={pfLive}    label="Predict.fun" pendingLabel={language === 'zh' ? '待API Key' : 'Pending API Key'} />
          </div>
        )}
        <section className="flex flex-wrap items-center gap-3">
          <CommodityTabs selected={commodity} onChange={setCommodity} t={t} />
        </section>

        {/* Row 2: Spot price + Month selector */}
        <section className="flex flex-wrap gap-4 items-stretch">
          <SpotPriceCard data={marketData} t={t} />
          <MonthSelector month={month} year={year} onChange={handleMonthChange} t={t} />

          {/* Market links + Refresh */}
          <div className="card px-4 py-3 flex flex-col justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              {t.currentMarket}
            </span>
            <MarketLink
              label="Polymarket"
              color="text-indigo-600"
              href={buildPolymarketUrl(commodity, month)}
            />
            <MarketLink
              label="Predict.fun"
              color="text-amber-600"
              href={buildPredictFunUrl(commodity, month)}
            />
          </div>
          <button
            onClick={refreshData}
            disabled={loadState === 'loading'}
            className="card px-4 py-3 flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <span className={loadState === 'loading' ? 'animate-spin inline-block' : ''}>⟳</span>
            <span>{language === 'zh' ? '刷新數據' : 'Refresh'}</span>
          </button>
        </section>

        {/* Row 3: Direction toggle + Charts side by side */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {language === 'zh' ? '圖表方向' : 'Chart Direction'}:
            </span>
            <button
              onClick={() => setDirectionFilter('high')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                directionFilter === 'high'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-green-400 hover:text-green-600'
              }`}
            >
              ↑ {t.highLabel}
            </button>
            <button
              onClick={() => setDirectionFilter('low')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                directionFilter === 'low'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-red-400 hover:text-red-500'
              }`}
            >
              ↓ {t.lowLabel}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ComparisonChart
              outcomes={marketData.outcomes}
              mode="yes"
              direction={directionFilter}
              commodity={commodity}
              t={t}
            />
            <ComparisonChart
              outcomes={marketData.outcomes}
              mode="no"
              direction={directionFilter}
              commodity={commodity}
              t={t}
            />
          </div>
        </section>

        {/* Row 4: Arbitrage table */}
        <section>
          <ArbitrageTable
            outcomes={marketData.outcomes}
            commodity={commodity}
            t={t}
          />
        </section>

        {/* Footer note */}
        <footer className="text-center text-[11px] text-slate-400 pb-4">
          {marketData.isLive ? (language === 'zh' ? '實時數據' : 'Live data') : t.mockDataBadge}
          {' · '}{t.lastUpdated}: {marketData.lastUpdated.toLocaleString(language === 'zh' ? 'zh-HK' : 'en-US')}
        </footer>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function DataBadge({
  live,
  label,
  pendingLabel,
}: {
  live: boolean;
  label: string;
  pendingLabel?: string;
}) {
  if (live) {
    return (
      <span className="flex items-center gap-1 text-green-600 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        {label}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-slate-400 font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />
      {pendingLabel ?? label}
    </span>
  );
}

function MarketLink({ label, color, href }: { label: string; color: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-xs font-semibold flex items-center gap-1 hover:underline ${color}`}
    >
      <span>↗</span>
      <span>{label}</span>
    </a>
  );
}

const MONTH_SLUGS = [
  '', 'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

function buildPolymarketUrl(commodity: Commodity, month: number): string {
  const slug = commodity === 'silver' ? 'silver-si' : 'gold-gc';
  return `https://polymarket.com/event/will-${slug}-hit-by-end-of-${MONTH_SLUGS[month]}`;
}

function buildPredictFunUrl(commodity: Commodity, month: number): string {
  const slug = commodity === 'silver' ? 'silver-si' : 'gold-gc';
  return `https://predict.fun/market/will-${slug}-hit-by-end-of-${MONTH_SLUGS[month]}`;
}
