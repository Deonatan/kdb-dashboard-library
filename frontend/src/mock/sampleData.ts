import type { CandlePoint, DashboardPayload, ExposurePoint, OrderBookPoint, PricePoint, TradeTapeItem } from "../api/dashboard";

const BOOKS = ["Macro", "Rates", "Credit", "EM", "Options"];
const VENUES = ["XNYS", "BATS", "IEX", "ARCA", "TRQX"];

const formatClock = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

const seedPriceSeries = (symbol: string) => {
  const now = new Date();
  const basePrice = symbol === "MSFT" ? 416.3 : symbol === "NVDA" ? 907.5 : 188.42;
  const intraday: PricePoint[] = [];
  const candles: CandlePoint[] = [];

  let lastPrice = basePrice;

  for (let index = 0; index < 24; index += 1) {
    const time = new Date(now.getTime() - (23 - index) * 15 * 60 * 1000);
    const drift = Math.sin(index / 2.5) * 0.6;
    const noise = ((index % 3) - 1) * 0.38;
    const open = lastPrice;
    const close = Number((open + drift + noise).toFixed(2));
    const high = Number((Math.max(open, close) + 0.72 + index * 0.01).toFixed(2));
    const low = Number((Math.min(open, close) - 0.63 - index * 0.01).toFixed(2));
    const vwap = Number((((open + high + low + close) / 4) * 0.9985).toFixed(2));
    const volume = 32000 + index * 1750;

    candles.push({
      close,
      high,
      low,
      open,
      time: formatClock(time),
      volume
    });

    intraday.push({
      price: close,
      time: formatClock(time),
      volume,
      vwap
    });

    lastPrice = close;
  }

  return { candles, intraday };
};

const buildExposureSeries = (snapshotLast: number): ExposurePoint[] =>
  BOOKS.map((book, index) => ({
    book,
    delta: Number((((index % 2 === 0 ? 1 : -1) * (index + 1) * 0.24) / 10).toFixed(2)),
    value: Number((snapshotLast * 13500 * (0.45 + index * 0.12)).toFixed(0))
  }));

const buildOrderBook = (snapshotLast: number): OrderBookPoint[] =>
  Array.from({ length: 12 }, (_, index) => {
    const offset = index - 5.5;
    return {
      ask: offset >= 0 ? Math.max(0, Math.round(700 - index * 42 + offset * 18)) : 0,
      bid: offset < 0 ? Math.max(0, Math.round(760 - Math.abs(offset) * 56)) : 0,
      price: Number((snapshotLast + offset * 0.15).toFixed(2))
    };
  });

const buildTrades = (symbol: string, last: number): TradeTapeItem[] =>
  Array.from({ length: 10 }, (_, index) => ({
    id: `${symbol}-${index}`,
    price: Number((last + (index % 2 === 0 ? 0.03 : -0.05) * (index + 1)).toFixed(2)),
    side: index % 2 === 0 ? "Buy" : "Sell",
    size: 200 + index * 75,
    symbol,
    time: formatClock(new Date(Date.now() - index * 90 * 1000)),
    venue: VENUES[index % VENUES.length]
  }));

export const buildMockDashboard = (symbol: string): DashboardPayload => {
  const { candles, intraday } = seedPriceSeries(symbol);
  const latest = intraday[intraday.length - 1];
  const opening = intraday[0];
  const high = Math.max(...intraday.map((point) => point.price));
  const low = Math.min(...intraday.map((point) => point.price));
  const volume = intraday.reduce((sum, point) => sum + point.volume, 0);
  const change = Number((latest.price - opening.price).toFixed(2));
  const changePct = Number(((change / opening.price) * 100).toFixed(2));

  return {
    candles,
    exposures: buildExposureSeries(latest.price),
    intraday,
    orderBook: buildOrderBook(latest.price),
    snapshot: {
      change,
      changePct,
      high: Number(high.toFixed(2)),
      last: latest.price,
      low: Number(low.toFixed(2)),
      open: opening.price,
      symbol,
      volume,
      vwap: latest.vwap
    },
    trades: buildTrades(symbol, latest.price)
  };
};
