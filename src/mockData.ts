import { MarketData, MarketOutcome } from './types';

// ---------------------------------------------------------------------------
// Silver (SI) March 2026 – based on real Polymarket prices (spot ~$81/oz)
// HIGH outcomes: "Will Silver hit ABOVE $X by end of March?"
// LOW outcomes:  "Will Silver hit BELOW $X by end of March?"
// PredictFun prices = Polymarket (stand-in until API key available)
// ---------------------------------------------------------------------------

const silverHighMarch: MarketOutcome[] = [
  { direction: 'high', strikePrice:  95, polymarketYes: 23.0, polymarketNo: 77.0, predictFunYes: 23.0, predictFunNo: 77.0, polyBestBid: 20.0, polyBestAsk: 26.0, polyLastTrade: 24.0 },
  { direction: 'high', strikePrice: 100, polymarketYes: 11.5, polymarketNo: 88.5, predictFunYes: 11.5, predictFunNo: 88.5, polyBestBid: 10.0, polyBestAsk: 13.0, polyLastTrade: 11.0 },
  { direction: 'high', strikePrice: 105, polymarketYes:  9.0, polymarketNo: 91.0, predictFunYes:  9.0, predictFunNo: 91.0, polyBestBid:  7.0, polyBestAsk: 11.0, polyLastTrade: 21.0 },
  { direction: 'high', strikePrice: 110, polymarketYes:  7.5, polymarketNo: 92.5, predictFunYes:  7.5, predictFunNo: 92.5, polyBestBid:  7.0, polyBestAsk:  8.0, polyLastTrade:  9.0 },
  { direction: 'high', strikePrice: 115, polymarketYes:  5.5, polymarketNo: 94.5, predictFunYes:  5.5, predictFunNo: 94.5, polyBestBid:  4.0, polyBestAsk:  7.0, polyLastTrade:  4.0 },
  { direction: 'high', strikePrice: 120, polymarketYes:  3.65,polymarketNo: 96.35,predictFunYes:  3.65,predictFunNo: 96.35,polyBestBid:  2.2, polyBestAsk:  5.1, polyLastTrade:  5.1 },
  { direction: 'high', strikePrice: 125, polymarketYes:  1.85,polymarketNo: 98.15,predictFunYes:  1.85,predictFunNo: 98.15,polyBestBid:  1.8, polyBestAsk:  1.9, polyLastTrade:  1.7 },
  { direction: 'high', strikePrice: 130, polymarketYes:  1.85,polymarketNo: 98.15,predictFunYes:  1.85,predictFunNo: 98.15,polyBestBid:  1.8, polyBestAsk:  1.9, polyLastTrade:  1.9 },
  { direction: 'high', strikePrice: 140, polymarketYes:  1.65,polymarketNo: 98.35,predictFunYes:  1.65,predictFunNo: 98.35,polyBestBid:  1.6, polyBestAsk:  1.7, polyLastTrade:  1.9 },
  { direction: 'high', strikePrice: 150, polymarketYes:  0.80,polymarketNo: 99.20,predictFunYes:  0.80,predictFunNo: 99.20,polyBestBid:  0.7, polyBestAsk:  0.9, polyLastTrade:  0.7 },
  { direction: 'high', strikePrice: 170, polymarketYes:  0.45,polymarketNo: 99.55,predictFunYes:  0.45,predictFunNo: 99.55,polyBestBid:  0.4, polyBestAsk:  0.5, polyLastTrade:  0.4 },
  { direction: 'high', strikePrice: 200, polymarketYes:  0.40,polymarketNo: 99.60,predictFunYes:  0.40,predictFunNo: 99.60,polyBestBid:  0.3, polyBestAsk:  0.5, polyLastTrade:  0.5 },
];

const silverLowMarch: MarketOutcome[] = [
  { direction: 'low', strikePrice: 80, polymarketYes: 85.5, polymarketNo: 14.5, predictFunYes: 85.5, predictFunNo: 14.5, polyBestBid: 85.0, polyBestAsk: 86.0, polyLastTrade: 87.0 },
  { direction: 'low', strikePrice: 75, polymarketYes: 63.0, polymarketNo: 37.0, predictFunYes: 63.0, predictFunNo: 37.0, polyBestBid: 41.0, polyBestAsk: 85.0, polyLastTrade: 67.0 },
  { direction: 'low', strikePrice: 70, polymarketYes: 22.5, polymarketNo: 77.5, predictFunYes: 22.5, predictFunNo: 77.5, polyBestBid: 16.0, polyBestAsk: 29.0, polyLastTrade: 28.0 },
  { direction: 'low', strikePrice: 65, polymarketYes: 10.5, polymarketNo: 89.5, predictFunYes: 10.5, predictFunNo: 89.5, polyBestBid:  6.0, polyBestAsk: 15.0, polyLastTrade: 13.0 },
  { direction: 'low', strikePrice: 60, polymarketYes:  3.65,polymarketNo: 96.35,predictFunYes:  3.65,predictFunNo: 96.35,polyBestBid:  3.4, polyBestAsk:  3.9, polyLastTrade:  3.9 },
  { direction: 'low', strikePrice: 50, polymarketYes:  1.80,polymarketNo: 98.20,predictFunYes:  1.80,predictFunNo: 98.20,polyBestBid:  1.4, polyBestAsk:  2.2, polyLastTrade:  1.2 },
  { direction: 'low', strikePrice: 40, polymarketYes:  2.50,polymarketNo: 97.50,predictFunYes:  2.50,predictFunNo: 97.50,polyBestBid:  2.3, polyBestAsk:  2.7, polyLastTrade:  1.7 },
  { direction: 'low', strikePrice: 25, polymarketYes:  0.35,polymarketNo: 99.65,predictFunYes:  0.35,predictFunNo: 99.65,polyBestBid:  0.3, polyBestAsk:  0.4, polyLastTrade:  0.2 },
];

// ---------------------------------------------------------------------------
// Silver April 2026 placeholder (longer horizon → wider spreads)
// ---------------------------------------------------------------------------
const silverHighApril: MarketOutcome[] = [
  { direction: 'high', strikePrice:  95, polymarketYes: 42.0, polymarketNo: 58.0, predictFunYes: 42.0, predictFunNo: 58.0, polyBestBid: 40.0, polyBestAsk: 44.0, polyLastTrade: 42.0 },
  { direction: 'high', strikePrice: 100, polymarketYes: 28.0, polymarketNo: 72.0, predictFunYes: 28.0, predictFunNo: 72.0, polyBestBid: 26.0, polyBestAsk: 30.0, polyLastTrade: 28.0 },
  { direction: 'high', strikePrice: 110, polymarketYes: 14.0, polymarketNo: 86.0, predictFunYes: 14.0, predictFunNo: 86.0, polyBestBid: 12.0, polyBestAsk: 16.0, polyLastTrade: 14.0 },
  { direction: 'high', strikePrice: 120, polymarketYes:  7.5, polymarketNo: 92.5, predictFunYes:  7.5, predictFunNo: 92.5, polyBestBid:  6.5, polyBestAsk:  8.5, polyLastTrade:  7.5 },
  { direction: 'high', strikePrice: 130, polymarketYes:  4.5, polymarketNo: 95.5, predictFunYes:  4.5, predictFunNo: 95.5, polyBestBid:  4.0, polyBestAsk:  5.0, polyLastTrade:  4.5 },
  { direction: 'high', strikePrice: 150, polymarketYes:  2.0, polymarketNo: 98.0, predictFunYes:  2.0, predictFunNo: 98.0, polyBestBid:  1.8, polyBestAsk:  2.2, polyLastTrade:  2.0 },
];

const silverLowApril: MarketOutcome[] = [
  { direction: 'low', strikePrice: 80, polymarketYes: 72.0, polymarketNo: 28.0, predictFunYes: 72.0, predictFunNo: 28.0, polyBestBid: 70.0, polyBestAsk: 74.0, polyLastTrade: 72.0 },
  { direction: 'low', strikePrice: 70, polymarketYes: 40.0, polymarketNo: 60.0, predictFunYes: 40.0, predictFunNo: 60.0, polyBestBid: 38.0, polyBestAsk: 42.0, polyLastTrade: 40.0 },
  { direction: 'low', strikePrice: 60, polymarketYes: 18.0, polymarketNo: 82.0, predictFunYes: 18.0, predictFunNo: 82.0, polyBestBid: 16.0, polyBestAsk: 20.0, polyLastTrade: 18.0 },
  { direction: 'low', strikePrice: 50, polymarketYes:  7.0, polymarketNo: 93.0, predictFunYes:  7.0, predictFunNo: 93.0, polyBestBid:  6.0, polyBestAsk:  8.0, polyLastTrade:  7.0 },
];

// ---------------------------------------------------------------------------
// Gold (GC) March 2026 – spot ~$3,180/oz (reasonable estimates)
// ---------------------------------------------------------------------------
const goldHighMarch: MarketOutcome[] = [
  { direction: 'high', strikePrice: 3200, polymarketYes: 38.5, polymarketNo: 61.2, predictFunYes: 38.5, predictFunNo: 61.2, polyBestBid: 36.0, polyBestAsk: 41.0, polyLastTrade: 38.5 },
  { direction: 'high', strikePrice: 3300, polymarketYes: 11.2, polymarketNo: 88.5, predictFunYes: 11.2, predictFunNo: 88.5, polyBestBid:  9.5, polyBestAsk: 13.0, polyLastTrade: 11.0 },
  { direction: 'high', strikePrice: 3400, polymarketYes:  4.8, polymarketNo: 94.9, predictFunYes:  4.8, predictFunNo: 94.9, polyBestBid:  4.0, polyBestAsk:  6.0, polyLastTrade:  4.8 },
  { direction: 'high', strikePrice: 3500, polymarketYes:  2.2, polymarketNo: 97.5, predictFunYes:  2.2, predictFunNo: 97.5, polyBestBid:  1.8, polyBestAsk:  2.6, polyLastTrade:  2.2 },
  { direction: 'high', strikePrice: 3600, polymarketYes:  1.1, polymarketNo: 98.7, predictFunYes:  1.1, predictFunNo: 98.7, polyBestBid:  0.9, polyBestAsk:  1.4, polyLastTrade:  1.1 },
  { direction: 'high', strikePrice: 3700, polymarketYes:  0.5, polymarketNo: 99.3, predictFunYes:  0.5, predictFunNo: 99.3, polyBestBid:  0.4, polyBestAsk:  0.7, polyLastTrade:  0.5 },
];

const goldLowMarch: MarketOutcome[] = [
  { direction: 'low', strikePrice: 3000, polymarketYes: 25.0, polymarketNo: 75.0, predictFunYes: 25.0, predictFunNo: 75.0, polyBestBid: 22.0, polyBestAsk: 28.0, polyLastTrade: 25.0 },
  { direction: 'low', strikePrice: 2800, polymarketYes:  8.0, polymarketNo: 92.0, predictFunYes:  8.0, predictFunNo: 92.0, polyBestBid:  6.5, polyBestAsk:  9.5, polyLastTrade:  8.0 },
  { direction: 'low', strikePrice: 2500, polymarketYes:  2.0, polymarketNo: 98.0, predictFunYes:  2.0, predictFunNo: 98.0, polyBestBid:  1.6, polyBestAsk:  2.4, polyLastTrade:  2.0 },
  { direction: 'low', strikePrice: 2000, polymarketYes:  0.5, polymarketNo: 99.3, predictFunYes:  0.5, predictFunNo: 99.3, polyBestBid:  0.4, polyBestAsk:  0.7, polyLastTrade:  0.5 },
];

const goldHighApril: MarketOutcome[] = [
  { direction: 'high', strikePrice: 3200, polymarketYes: 62.0, polymarketNo: 37.8, predictFunYes: 62.0, predictFunNo: 37.8, polyBestBid: 60.0, polyBestAsk: 64.0, polyLastTrade: 62.0 },
  { direction: 'high', strikePrice: 3300, polymarketYes: 28.5, polymarketNo: 71.2, predictFunYes: 28.5, predictFunNo: 71.2, polyBestBid: 26.0, polyBestAsk: 31.0, polyLastTrade: 28.5 },
  { direction: 'high', strikePrice: 3400, polymarketYes: 14.2, polymarketNo: 85.5, predictFunYes: 14.2, predictFunNo: 85.5, polyBestBid: 12.0, polyBestAsk: 16.0, polyLastTrade: 14.2 },
  { direction: 'high', strikePrice: 3500, polymarketYes:  7.5, polymarketNo: 92.2, predictFunYes:  7.5, predictFunNo: 92.2, polyBestBid:  6.5, polyBestAsk:  8.5, polyLastTrade:  7.5 },
  { direction: 'high', strikePrice: 3600, polymarketYes:  3.8, polymarketNo: 96.0, predictFunYes:  3.8, predictFunNo: 96.0, polyBestBid:  3.2, polyBestAsk:  4.4, polyLastTrade:  3.8 },
];

const goldLowApril: MarketOutcome[] = [
  { direction: 'low', strikePrice: 3000, polymarketYes: 45.0, polymarketNo: 55.0, predictFunYes: 45.0, predictFunNo: 55.0, polyBestBid: 42.0, polyBestAsk: 48.0, polyLastTrade: 45.0 },
  { direction: 'low', strikePrice: 2800, polymarketYes: 20.0, polymarketNo: 80.0, predictFunYes: 20.0, predictFunNo: 80.0, polyBestBid: 18.0, polyBestAsk: 22.0, polyLastTrade: 20.0 },
  { direction: 'low', strikePrice: 2500, polymarketYes:  7.0, polymarketNo: 93.0, predictFunYes:  7.0, predictFunNo: 93.0, polyBestBid:  5.5, polyBestAsk:  8.5, polyLastTrade:  7.0 },
];

// ---------------------------------------------------------------------------
// Helper: determine current/active market month
// ---------------------------------------------------------------------------
export function getActiveMonth(): { month: number; year: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  if (now.getDate() > lastDay) {
    const next = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    return { month: next, year: nextYear };
  }
  return { month, year };
}

type OutcomePair = { high: MarketOutcome[]; low: MarketOutcome[] };
const OUTCOMES_MAP: Record<string, OutcomePair> = {
  'silver-3':  { high: silverHighMarch,  low: silverLowMarch  },
  'silver-4':  { high: silverHighApril,  low: silverLowApril  },
  'silver-5':  { high: silverHighApril,  low: silverLowApril  },
  'silver-6':  { high: silverHighApril,  low: silverLowApril  },
  'silver-7':  { high: silverHighApril,  low: silverLowApril  },
  'silver-8':  { high: silverHighApril,  low: silverLowApril  },
  'silver-9':  { high: silverHighApril,  low: silverLowApril  },
  'silver-10': { high: silverHighApril,  low: silverLowApril  },
  'silver-11': { high: silverHighApril,  low: silverLowApril  },
  'silver-12': { high: silverHighApril,  low: silverLowApril  },
  'gold-3':    { high: goldHighMarch,    low: goldLowMarch    },
  'gold-4':    { high: goldHighApril,    low: goldLowApril    },
  'gold-5':    { high: goldHighApril,    low: goldLowApril    },
  'gold-6':    { high: goldHighApril,    low: goldLowApril    },
  'gold-7':    { high: goldHighApril,    low: goldLowApril    },
  'gold-8':    { high: goldHighApril,    low: goldLowApril    },
  'gold-9':    { high: goldHighApril,    low: goldLowApril    },
  'gold-10':   { high: goldHighApril,    low: goldLowApril    },
  'gold-11':   { high: goldHighApril,    low: goldLowApril    },
  'gold-12':   { high: goldHighApril,    low: goldLowApril    },
};

export function getMockMarketData(
  commodity: 'silver' | 'gold',
  month: number,
  year: number,
): MarketData {
  const key  = `${commodity}-${month}`;
  const pair = OUTCOMES_MAP[key] ?? (commodity === 'silver'
    ? { high: silverHighApril, low: silverLowApril }
    : { high: goldHighApril,   low: goldLowApril   });

  const outcomes = [...pair.high, ...pair.low].map(o => ({
    ...o,
    // Mock data always has predictFunYes set → mark as having PF data for demo display
    hasPredictFun: o.predictFunYes !== undefined,
  }));
  const spotPrice = commodity === 'silver' ? 81.3 : 3180;
  const spotPriceChange = commodity === 'silver' ? -4.43 : -0.38;

  return { commodity, month, year, spotPrice, spotPriceChange, outcomes, lastUpdated: new Date(), isLive: false };
}
