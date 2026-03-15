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
  // Top-of-book order data (cents, 0-100); undefined when unavailable
  polyBestBid?: number;        // YES best bid
  polyBestAsk?: number;        // YES best ask
  polyLastTrade?: number;
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
