import { useState, Fragment } from 'react';
import { MarketOutcome, Commodity } from '../types';
import { Translations } from '../i18n';

interface ArbitrageTableProps {
  outcomes: MarketOutcome[];
  commodity: Commodity;
  t: Translations;
}

const ARB_THRESHOLD = 0.5;
const COLS = 8;

interface ComputedRow extends MarketOutcome {
  yesSpread: number | null;
  crossProfit: number | null;
  hasOpportunity: boolean;
}

function computeRows(outcomes: MarketOutcome[]): ComputedRow[] {
  return outcomes.map((o) => {
    if (!o.hasPredictFun || o.predictFunYes === undefined || o.predictFunNo === undefined) {
      return { ...o, yesSpread: null, crossProfit: null, hasOpportunity: false }
    }
    const yesSpread   = o.predictFunYes - o.polymarketYes
    const crossProfit = 100 - Math.min(o.polymarketYes, o.predictFunYes) - Math.min(o.polymarketNo, o.predictFunNo)
    const hasOpportunity = Math.abs(yesSpread) > ARB_THRESHOLD || crossProfit > ARB_THRESHOLD
    return { ...o, yesSpread, crossProfit, hasOpportunity }
  })
}

export default function ArbitrageTable({ outcomes, commodity, t }: ArbitrageTableProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [side, setSide] = useState<'yes' | 'no'>('yes');

  const allRows = computeRows(outcomes);
  // HIGH: descending – $200 at top, $95 at bottom
  const highRows = allRows.filter((r) => r.direction === 'high').sort((a, b) => b.strikePrice - a.strikePrice);
  // LOW: descending – $80 at top, $25 at bottom
  const lowRows  = allRows.filter((r) => r.direction === 'low' ).sort((a, b) => b.strikePrice - a.strikePrice);

  const priceLabel = commodity === 'silver'
    ? (p: number) => `$${p}`
    : (p: number) => `$${p.toLocaleString()}`;

  const anyOpp = allRows.some((r) => r.hasOpportunity);

  function toggleRow(key: string) {
    setExpandedKey((prev) => (prev === key ? null : key));
  }

  function renderRows(rows: ComputedRow[]) {
    return rows.map((row) => {
      const key      = `${row.direction}-${row.strikePrice}`;
      const expanded = expandedKey === key;
      const isHigh   = row.direction === 'high';
      const dirColor = isHigh ? 'text-green-600' : 'text-red-500';

      // Pick the displayed price depending on YES/NO toggle
      const polyPrice = side === 'yes' ? row.polymarketYes : row.polymarketNo;
      const pfPrice   = side === 'yes' ? row.predictFunYes : row.predictFunNo;
      const spread    = row.hasPredictFun && pfPrice !== undefined
        ? pfPrice - polyPrice
        : null;

      // Order-book: NO side is the mirror of YES bids/asks
      const rawBid = row.polyBestBid;
      const rawAsk = row.polyBestAsk;
      const bid = side === 'yes' ? rawBid : (rawAsk != null ? 100 - rawAsk : undefined);
      const ask = side === 'yes' ? rawAsk : (rawBid != null ? 100 - rawBid : undefined);
      const bookSpread = bid != null && ask != null ? ask - bid : null;

      const crossProfit = row.crossProfit;

      return (
        <Fragment key={key}>
          <tr
            onClick={() => toggleRow(key)}
            className={`border-b border-slate-50 cursor-pointer select-none transition-colors ${
              expanded ? 'bg-indigo-50'
                : row.hasOpportunity ? 'bg-green-50 hover:bg-green-100'
                : 'hover:bg-slate-50'
            }`}
          >
            {/* Strike */}
            <td className="py-2 px-2 font-bold text-slate-700 whitespace-nowrap">
              <span className={`mr-1 font-bold ${dirColor}`}>{isHigh ? '↑' : '↓'}</span>
              {priceLabel(row.strikePrice)}
              <span className="ml-1 text-slate-300 text-[10px]">{expanded ? '▲' : '▼'}</span>
            </td>
            {/* Polymarket price */}
            <td className="py-2 px-2 text-right font-mono text-indigo-600">{polyPrice.toFixed(1)}¢</td>
            {/* Predict.fun price */}
            <td className="py-2 px-2 text-right font-mono text-amber-600">
              {pfPrice !== undefined ? `${pfPrice.toFixed(1)}¢` : '—'}
            </td>
            {/* Spread (PF − Poly) */}
            <td className={`py-2 px-2 text-right font-mono font-semibold ${
              spread !== null && Math.abs(spread) > ARB_THRESHOLD ? 'text-green-600' : 'text-slate-400'
            }`}>
              {spread !== null
                ? `${spread > 0 ? '+' : ''}${spread.toFixed(2)}¢`
                : '—'}
            </td>
            {/* Poly Bid */}
            <td className="py-2 px-2 text-right font-mono text-green-600">
              {bid != null ? bid.toFixed(1) + '¢' : '—'}
            </td>
            {/* Poly Ask */}
            <td className="py-2 px-2 text-right font-mono text-red-500">
              {ask != null ? ask.toFixed(1) + '¢' : '—'}
            </td>
            {/* Book spread (ask − bid) */}
            <td className="py-2 px-2 text-right font-mono text-slate-400">
              {bookSpread !== null ? bookSpread.toFixed(1) + '¢' : '—'}
            </td>
            {/* Cross-platform arb */}
            <td className={`py-2 px-2 text-right font-mono font-bold ${
              crossProfit !== null && crossProfit > ARB_THRESHOLD ? 'text-green-600' : 'text-slate-400'
            }`}>
              {crossProfit !== null
                ? `${crossProfit > 0 ? '+' : ''}${crossProfit.toFixed(2)}¢`
                : '—'}
            </td>
          </tr>

          {/* Expanded order book */}
          {expanded && (
            <tr>
              <td colSpan={COLS} className="bg-indigo-50 border-b border-indigo-100 px-4">
                <div className="text-[11px] font-semibold text-indigo-500 pt-2 pb-1 uppercase tracking-wide">
                  {t.orderBook}
                </div>
                <div className="flex flex-wrap gap-6 text-xs py-2 px-2">
                  <div>
                    <div className="font-bold text-indigo-600 mb-2">Polymarket</div>
                    <table className="text-left border-separate" style={{ borderSpacing: '0 2px' }}>
                      <tbody>
                        <tr>
                          <td className="pr-3 text-slate-400">{side === 'yes' ? 'YES' : 'NO'} Bid</td>
                          <td className="font-mono font-semibold text-green-600">{bid != null ? bid.toFixed(1) + '¢' : '—'}</td>
                        </tr>
                        <tr>
                          <td className="pr-3 text-slate-400">{side === 'yes' ? 'YES' : 'NO'} Ask</td>
                          <td className="font-mono font-semibold text-red-500">{ask != null ? ask.toFixed(1) + '¢' : '—'}</td>
                        </tr>
                        {bookSpread !== null && (
                          <tr>
                            <td className="pr-3 text-slate-400">{t.spread}</td>
                            <td className="font-mono font-semibold text-slate-600">{bookSpread.toFixed(1)}¢</td>
                          </tr>
                        )}
                        {row.polyLastTrade != null && (
                          <tr>
                            <td className="pr-3 text-slate-400">Last</td>
                            <td className="font-mono text-slate-500">
                              {side === 'yes'
                                ? row.polyLastTrade.toFixed(1)
                                : (100 - row.polyLastTrade).toFixed(1)}¢
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="font-bold text-amber-600 mb-2">Predict.fun</div>
                    {row.hasPredictFun ? (
                      <table className="text-left border-separate" style={{ borderSpacing: '0 2px' }}>
                        <tbody>
                          {(() => {
                            const pfBid = side === 'yes' ? row.pfBestBid : (row.pfBestAsk != null ? 100 - row.pfBestAsk : undefined)
                            const pfAsk = side === 'yes' ? row.pfBestAsk : (row.pfBestBid != null ? 100 - row.pfBestBid : undefined)
                            const pfBookSpread = pfBid != null && pfAsk != null ? pfAsk - pfBid : null
                            const pfLast = row.pfLastTrade != null
                              ? (side === 'yes' ? row.pfLastTrade : 100 - row.pfLastTrade)
                              : undefined
                            return <>
                              <tr>
                                <td className="pr-3 text-slate-400">{side === 'yes' ? 'YES' : 'NO'} Bid</td>
                                <td className="font-mono font-semibold text-green-600">{pfBid != null ? pfBid.toFixed(1) + '¢' : '—'}</td>
                              </tr>
                              <tr>
                                <td className="pr-3 text-slate-400">{side === 'yes' ? 'YES' : 'NO'} Ask</td>
                                <td className="font-mono font-semibold text-red-500">{pfAsk != null ? pfAsk.toFixed(1) + '¢' : '—'}</td>
                              </tr>
                              {pfBookSpread !== null && (
                                <tr>
                                  <td className="pr-3 text-slate-400">{t.spread}</td>
                                  <td className="font-mono font-semibold text-slate-600">{pfBookSpread.toFixed(1)}¢</td>
                                </tr>
                              )}
                              {pfLast !== undefined && (
                                <tr>
                                  <td className="pr-3 text-slate-400">Last</td>
                                  <td className="font-mono text-slate-500">{pfLast.toFixed(1)}¢</td>
                                </tr>
                              )}
                            </>
                          })()}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-slate-400 italic text-[11px] mt-1">{t.noPfMarket}</p>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          )}
        </Fragment>
      );
    });
  }

  return (
    <div className="card p-5">
      {/* Header: title + YES/NO toggle + opportunity badge */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700">{t.arbitrageTable}</h3>
        <div className="flex items-center gap-3">
          {/* YES / NO toggle */}
          <div className="flex rounded-lg overflow-hidden border border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => setSide('yes')}
              className={`px-3 py-1 transition-colors ${
                side === 'yes' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              YES
            </button>
            <button
              onClick={() => setSide('no')}
              className={`px-3 py-1 border-l border-slate-200 transition-colors ${
                side === 'no' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              NO
            </button>
          </div>
          {anyOpp ? (
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              ✓ {t.opportunity}
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {t.noArbitrage}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 px-2 text-slate-400 font-semibold">{t.strikePrice}</th>
              <th className="text-right py-2 px-2 text-indigo-500 font-semibold">
                {t.polymarket} {side === 'yes' ? 'YES' : 'NO'}
              </th>
              <th className="text-right py-2 px-2 text-amber-500 font-semibold">
                {t.predictFun} {side === 'yes' ? 'YES' : 'NO'}
              </th>
              <th className="text-right py-2 px-2 text-slate-400 font-semibold">{t.yesSpreadLabel}</th>
              <th className="text-right py-2 px-2 text-green-600 font-semibold">Bid</th>
              <th className="text-right py-2 px-2 text-red-500 font-semibold">Ask</th>
              <th className="text-right py-2 px-2 text-slate-400 font-semibold">{t.marketSpread}</th>
              <th className="text-right py-2 px-2 text-green-600 font-semibold">{t.crossArb}</th>
            </tr>
          </thead>
          <tbody>
            {highRows.length > 0 && (
              <tr>
                <td colSpan={COLS} className="pt-3 pb-1 px-2 text-[11px] font-bold text-green-600 uppercase tracking-wide">
                  ↑ {t.highLabel}
                </td>
              </tr>
            )}
            {renderRows(highRows)}

            {lowRows.length > 0 && (
              <tr>
                <td colSpan={COLS} className="pt-4 pb-1 px-2 text-[11px] font-bold text-red-500 uppercase tracking-wide">
                  ↓ {t.lowLabel}
                </td>
              </tr>
            )}
            {renderRows(lowRows)}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-400 mt-3">
        {t.thresholdNote} · {t.clickRowOrderBook}
      </p>
    </div>
  );
}
