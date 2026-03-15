export type Language = 'en' | 'zh';
export type Commodity = 'silver' | 'gold';

export interface MarketOutcome {
  strikePrice: number;
  direction: 'high' | 'low';  // ↑ will hit above / ↓ will hit below
  polymarketYes: number;       // cents (0-100)
  polymarketNo: number;
  predictFunYes?: number;      // undefined = no matching market on Predict.fun
  predictFunNo?: number;
  hasPredictFun?: boolean;     // true = live PF data found; false/undefined = no PF market
  // Polymarket top-of-book (cents, 0-100)
  polyBestBid?: number;
  polyBestAsk?: number;
  polyLastTrade?: number;
  // Predict.fun top-of-book (cents, 0-100)
  pfBestBid?: number;
  pfBestAsk?: number;
  pfLastTrade?: number;
}

export interface MarketData {
  commodity: Commodity;
  month: number;  // 1-12
  year: number;
  spotPrice: number;
  spotPriceChange: number;  // percentage
  outcomes: MarketOutcome[];
  lastUpdated: Date;
  isLive: boolean;
}

export interface ArbitrageRow {
  strikePrice: number;
  yesSpread: number;       // predictFunYes - polymarketYes
  noSpread: number;        // predictFunNo - polymarketNo
  crossArbitrage: number;  // polymarketYes + predictFunNo (should be <= 100 for arb)
  hasOpportunity: boolean;
  action?: string;
}
