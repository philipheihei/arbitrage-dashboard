import { Commodity, MarketOutcome, MarketData } from './types'
import { getMockMarketData } from './mockData'

// ── Month slugs ────────────────────────────────────────────────────────────
const MONTH_SLUGS = [
  '', 'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

export function buildEventSlug(commodity: Commodity, month: number): string {
  const c = commodity === 'silver' ? 'silver-si' : 'gold-gc'
  return `will-${c}-hit-by-end-of-${MONTH_SLUGS[month]}`
}

// ── Spot price via Yahoo Finance ───────────────────────────────────────────
export async function fetchSpotPrice(
  commodity: Commodity,
): Promise<{ price: number; changePercent: number }> {
  // SI=F = Silver futures, GC=F = Gold futures
  const ticker = commodity === 'silver' ? 'SI%3DF' : 'GC%3DF'
  const res = await fetch(
    `/api/yahoo/v8/finance/chart/${ticker}?interval=1d&range=1d`,
    { signal: AbortSignal.timeout(8000) },
  )
  if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status}`)
  const data = await res.json()
  const meta         = data.chart.result[0].meta
  const price: number = meta.regularMarketPrice
  const prev: number  = meta.chartPreviousClose
  const changePercent = prev ? ((price - prev) / prev) * 100 : 0
  return { price, changePercent }
}

// ── Polymarket via public Gamma API ───────────────────────────────────────
interface RawPolyMarket {
  question: string
  groupItemTitle: string    // e.g. "↑ $110" or "↓ $80"
  outcomePrices: string     // JSON string: ["0.075", "0.925"]
  active: boolean
  closed: boolean
  bestBid?: number          // YES best bid, decimal 0-1
  bestAsk?: number          // YES best ask, decimal 0-1
  lastTradePrice?: number   // decimal 0-1
}

export interface PolyOutcome {
  strikePrice: number
  direction: 'high' | 'low'
  yesPrice: number      // cents 0-100
  noPrice: number
  bestBid?: number      // cents 0-100 (already converted)
  bestAsk?: number
  lastTradePrice?: number
}

function parsePolymarketMarkets(markets: RawPolyMarket[]): PolyOutcome[] {
  const results: PolyOutcome[] = []
  for (const m of markets) {
    if (!m.active || m.closed) continue

    const titleMatch = m.groupItemTitle.match(/(↑|↓)\s*\$([\d,]+(?:\.\d+)?)/)
    if (!titleMatch) continue

    const direction   = titleMatch[1] === '↑' ? ('high' as const) : ('low' as const)
    const strikePrice = parseFloat(titleMatch[2].replace(',', ''))

    let prices: string[] = []
    try { prices = JSON.parse(m.outcomePrices) } catch { continue }
    if (prices.length < 2) continue

    const yesPrice = parseFloat(prices[0]) * 100
    const noPrice  = parseFloat(prices[1]) * 100

    const bestBid        = m.bestBid        != null ? m.bestBid        * 100 : undefined
    const bestAsk        = m.bestAsk        != null ? m.bestAsk        * 100 : undefined
    const lastTradePrice = m.lastTradePrice != null ? m.lastTradePrice * 100 : undefined

    if (!isNaN(strikePrice) && !isNaN(yesPrice) && !isNaN(noPrice)) {
      results.push({ strikePrice, direction, yesPrice, noPrice, bestBid, bestAsk, lastTradePrice })
    }
  }
  return results
}

export async function fetchPolymarketOutcomes(
  commodity: Commodity,
  month: number,
): Promise<PolyOutcome[]> {
  const slug = buildEventSlug(commodity, month)
  const res  = await fetch(
    `/api/polymarket/events?slug=${slug}`,
    { signal: AbortSignal.timeout(10000) },
  )
  if (!res.ok) throw new Error(`Polymarket HTTP ${res.status}`)
  const data = await res.json() as Array<{ markets: RawPolyMarket[] }>
  if (!Array.isArray(data) || data.length === 0) throw new Error('No event found')
  return parsePolymarketMarkets(data[0].markets)
}

// ── Predict.fun live integration ──────────────────────────────────────────
// Predict.fun currently offers BTC/USD up-down, sports, and crypto markets.
// Silver (SI) and Gold (GC) futures prediction markets do not yet exist on the
// platform.  fetchPredictFunOutcomes performs a real search and returns whatever
// matches; when nothing matches (current behaviour) hasPredictFun is set false.

interface RawPFMarket {
  id: number
  title: string
  question: string
  categorySlug: string
  tradingStatus: string
  status: string
  outcomes: Array<{ indexSet: number; name: string; onChainId: string; status: string | null }>
  variantData?: {
    type?: string
    startPrice?: number
    endPrice?: number | null
    priceFeedId?: string
  } | null
}

export interface PFOutcome {
  strikePrice: number
  direction: 'high' | 'low'
  yesPrice: number      // cents 0-100
  noPrice: number
  pfBestBid?: number    // cents, YES outcome
  pfBestAsk?: number
  pfLastTrade?: number  // cents, last executed trade
}

// Fetch order book for a single Predict.fun market id and return price data
async function fetchPFOrderBook(
  id: number,
): Promise<{ yesPrice: number; bid?: number; ask?: number; lastTrade?: number } | null> {
  try {
    const res = await fetch(`/api/predictfun/v1/markets/${id}/orderbook`, {
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const j = await res.json() as {
      data: {
        bids: [number, number][]
        asks: [number, number][]
        lastOrderSettled?: { price: string } | null
      }
    }
    const bids = j.data?.bids ?? []
    const asks = j.data?.asks ?? []
    const bestBid      = bids.length > 0 ? bids[0][0] * 100 : undefined
    const bestAsk      = asks.length > 0 ? asks[0][0] * 100 : undefined
    const lastTradeRaw = j.data?.lastOrderSettled?.price
    const lastTrade    = lastTradeRaw != null ? parseFloat(lastTradeRaw) * 100 : undefined

    // Prefer last executed trade price; fall back to bid-ask mid; then to 50
    let yesPrice: number
    if (lastTrade !== undefined && !isNaN(lastTrade)) {
      yesPrice = lastTrade
    } else if (bestBid !== undefined && bestAsk !== undefined) {
      yesPrice = (bestBid + bestAsk) / 2
    } else if (bestAsk !== undefined) {
      yesPrice = bestAsk
    } else if (bestBid !== undefined) {
      yesPrice = bestBid
    } else {
      return null
    }

    return { yesPrice, bid: bestBid, ask: bestAsk, lastTrade }
  } catch {
    return null
  }
}

// Parse Predict.fun market title to extract strike price + direction.
// Handles: "↑ $110", "↓ $80", "above $32", "below $2,000"
function parsePFTitle(
  title: string,
): { strikePrice: number; direction: 'high' | 'low' } | null {
  const m1 = title.match(/(↑|↓)\s*\$([\d,]+(?:\.\d+)?)/)
  if (m1) {
    return {
      strikePrice: parseFloat(m1[2].replace(',', '')),
      direction: m1[1] === '↑' ? 'high' : 'low',
    }
  }
  const m2 = title.match(/(above|below)\s*\$([\d,]+(?:\.\d+)?)/i)
  if (m2) {
    return {
      strikePrice: parseFloat(m2[2].replace(',', '')),
      direction: m2[1].toLowerCase() === 'above' ? 'high' : 'low',
    }
  }
  return null
}

export async function fetchPredictFunOutcomes(
  commodity: Commodity,
  month: number,
): Promise<PFOutcome[]> {
  // Use the same slug that the Predict.fun website uses
  const slug = buildEventSlug(commodity, month)

  const catRes = await fetch(`/api/predictfun/v1/categories/${slug}`, {
    signal: AbortSignal.timeout(10000),
  })
  if (!catRes.ok) throw new Error(`Predict.fun category HTTP ${catRes.status}`)

  const catJson = await catRes.json() as { data: { markets: RawPFMarket[] } }
  const markets = catJson.data?.markets ?? []

  // Only include markets still open for trading
  const openMarkets = markets.filter((m) => m.tradingStatus === 'OPEN')

  // Fetch all order books in parallel
  const bookResults = await Promise.allSettled(
    openMarkets.map((m) => fetchPFOrderBook(m.id)),
  )

  const results: PFOutcome[] = []
  for (let i = 0; i < openMarkets.length; i++) {
    const m      = openMarkets[i]
    const parsed = parsePFTitle(m.title)
    if (!parsed) continue

    const bookResult = bookResults[i]
    const book       = bookResult.status === 'fulfilled' ? bookResult.value : null
    if (!book) continue  // no price data available; skip this strike

    results.push({
      strikePrice: parsed.strikePrice,
      direction:   parsed.direction,
      yesPrice:    book.yesPrice,
      noPrice:     100 - book.yesPrice,
      pfBestBid:   book.bid,
      pfBestAsk:   book.ask,
      pfLastTrade: book.lastTrade,
    })
  }

  return results
}

// ── Merge Polymarket + Predict.fun into MarketData ────────────────────────
export function buildMarketData(
  commodity: Commodity,
  month: number,
  year: number,
  spotPrice: number,
  spotPriceChange: number,
  polyOutcomes: PolyOutcome[],
  pfOutcomes: PFOutcome[],
): MarketData {
  // Lookup map for Predict.fun prices
  const pfMap = new Map<string, PFOutcome>()
  pfOutcomes.forEach((p) => pfMap.set(`${p.direction}-${p.strikePrice}`, p))

  const mapOutcome = (pm: PolyOutcome): MarketOutcome => {
    const pf = pfMap.get(`${pm.direction}-${pm.strikePrice}`)
    return {
      strikePrice:   pm.strikePrice,
      direction:     pm.direction,
      polymarketYes: pm.yesPrice,
      polymarketNo:  pm.noPrice,
      predictFunYes: pf ? pf.yesPrice : undefined,
      predictFunNo:  pf ? pf.noPrice  : undefined,
      hasPredictFun: !!pf,
      polyBestBid:   pm.bestBid,
      polyBestAsk:   pm.bestAsk,
      polyLastTrade: pm.lastTradePrice,
      pfBestBid:     pf?.pfBestBid,
      pfBestAsk:     pf?.pfBestAsk,
      pfLastTrade:   pf?.pfLastTrade,
    }
  }

  // HIGH ascending, then LOW ascending (lowest strike → highest, i.e. closest-to-spot last)
  const outcomes: MarketOutcome[] = [
    ...polyOutcomes.filter(m => m.direction === 'high').sort((a, b) => a.strikePrice - b.strikePrice).map(mapOutcome),
    ...polyOutcomes.filter(m => m.direction === 'low' ).sort((a, b) => a.strikePrice - b.strikePrice).map(mapOutcome),
  ]

  return {
    commodity,
    month,
    year,
    spotPrice,
    spotPriceChange,
    outcomes,
    lastUpdated: new Date(),
    isLive: true,
  }
}

// ── Master fetch: real data with graceful fallback to mock ────────────────
export interface FetchResult {
  data: MarketData
  spotLive: boolean
  polyLive: boolean
  pfLive: boolean
}

export async function fetchAllMarketData(
  commodity: Commodity,
  month: number,
  year: number,
): Promise<FetchResult> {
  const mock = getMockMarketData(commodity, month, year)

  const [spotResult, polyResult, pfResult] = await Promise.allSettled([
    fetchSpotPrice(commodity),
    fetchPolymarketOutcomes(commodity, month),
    fetchPredictFunOutcomes(commodity, month),
  ])

  const spotLive = spotResult.status === 'fulfilled'
  const polyLive = polyResult.status === 'fulfilled'
  const pfLive   = pfResult.status === 'fulfilled' && pfResult.value.length > 0

  const spot = spotLive
    ? spotResult.value
    : { price: mock.spotPrice, changePercent: mock.spotPriceChange }

  // If Polymarket fetch failed, fall back entirely to mock
  if (!polyLive) {
    return { data: { ...mock, spotPrice: spot.price, spotPriceChange: spot.changePercent }, spotLive, polyLive: false, pfLive: false }
  }

  const pfOutcomes = pfLive ? (pfResult as PromiseFulfilledResult<PFOutcome[]>).value : []

  const data = buildMarketData(
    commodity, month, year,
    spot.price, spot.changePercent,
    polyResult.value,
    pfOutcomes,
  )

  return { data, spotLive, polyLive, pfLive }
}
