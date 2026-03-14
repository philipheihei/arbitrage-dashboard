import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { MarketOutcome, Commodity } from '../types';
import { Translations } from '../i18n';

interface ComparisonChartProps {
  outcomes: MarketOutcome[];
  mode: 'yes' | 'no';
  direction: 'high' | 'low';
  commodity: Commodity;
  t: Translations;
}

const POLY_COLOR = '#4F46E5';   // indigo – Polymarket
const PF_COLOR   = '#F59E0B';   // amber  – Predict.fun

// Custom dot with hollow circle (matching the image style)
const HollowDot = (props: { cx?: number; cy?: number; stroke?: string }) => {
  const { cx = 0, cy = 0, stroke = '#000' } = props;
  return <circle cx={cx} cy={cy} r={4} fill="white" stroke={stroke} strokeWidth={2} />;
};

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
  t,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  t: Translations;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-slate-700 mb-2">
        {t.strikePrice}: <span className="text-indigo-600">${label}</span>
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-semibold text-slate-800">{p.value.toFixed(1)}{t.centsUnit}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between">
          <span className="text-slate-500">{t.spread}:</span>
          <span
            className={`font-bold ${
              Math.abs(payload[0].value - payload[1].value) > 0.5
                ? 'text-green-600'
                : 'text-slate-500'
            }`}
          >
            {(payload[0].value - payload[1].value).toFixed(2)}{t.centsUnit}
          </span>
        </div>
      )}
    </div>
  );
};

export default function ComparisonChart({ outcomes, mode, direction, commodity, t }: ComparisonChartProps) {
  const priceFormatter = (val: number) => (commodity === 'silver' ? `$${val}` : `$${val.toLocaleString()}`);

  const filtered = outcomes
    .filter((o) => o.direction === direction)
    .sort((a, b) => a.strikePrice - b.strikePrice);

  const data = filtered.map((o) => ({
    strike: o.strikePrice,
    [t.polymarket]: mode === 'yes' ? o.polymarketYes : o.polymarketNo,
    [t.predictFun]: mode === 'yes' ? o.predictFunYes : o.predictFunNo,
  }));

  const dirLabel  = direction === 'high' ? '↑' : '↓';
  const modeLabel = mode === 'yes' ? t.chartTitle : t.chartTitleNo;
  const title     = `${dirLabel} ${modeLabel}`;

  return (
    <div className="card p-5">
      {/* Chart title row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-700">{title}</h3>
          <p className="text-xs text-slate-400">{t.subtitle}</p>
        </div>
        <span className="text-[10px] font-bold bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">
          {t.marketSentiment}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis
            dataKey="strike"
            tickFormatter={priceFormatter}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `${v}¢`}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={38}
          />
          <Tooltip
            content={<CustomTooltip t={t} />}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          {/* Reference line at 50¢ for context on No chart */}
          {mode === 'no' && (
            <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="4 4" />
          )}
          <Line
            type="monotone"
            dataKey={t.polymarket}
            stroke={POLY_COLOR}
            strokeWidth={2}
            dot={<HollowDot stroke={POLY_COLOR} />}
            activeDot={{ r: 5, fill: POLY_COLOR }}
          />
          <Line
            type="monotone"
            dataKey={t.predictFun}
            stroke={PF_COLOR}
            strokeWidth={2}
            dot={<HollowDot stroke={PF_COLOR} />}
            activeDot={{ r: 5, fill: PF_COLOR }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
