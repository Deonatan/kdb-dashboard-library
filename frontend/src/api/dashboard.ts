import type { JsonObject } from "../types/kdb";

export interface DashboardSnapshot {
  symbol: string;
  last: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  vwap: number;
  volume: number;
}

export interface PricePoint {
  time: string;
  price: number;
  vwap: number;
  volume: number;
}

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ExposurePoint {
  book: string;
  value: number;
  delta: number;
}

export interface OrderBookPoint {
  price: number;
  bid: number;
  ask: number;
}

export interface TradeTapeItem {
  id: string;
  time: string;
  venue: string;
  side: "Buy" | "Sell";
  symbol: string;
  price: number;
  size: number;
}

export interface DashboardPayload {
  candles: CandlePoint[];
  exposures: ExposurePoint[];
  intraday: PricePoint[];
  orderBook: OrderBookPoint[];
  snapshot: DashboardSnapshot;
  trades: TradeTapeItem[];
}

export interface DashboardRequestArgs extends JsonObject {
  symbol: string;
}

export type KdbRequestFn = <TData, TArgs extends JsonObject = JsonObject>(
  func: string,
  args?: TArgs
) => Promise<TData>;

export const dashboardApi = {
  load(request: KdbRequestFn, args: DashboardRequestArgs) {
    return request<DashboardPayload, DashboardRequestArgs>("dashboard.load", args);
  },
  ping(request: KdbRequestFn) {
    return request<{ ok: boolean; serverTime: string }>("health.ping");
  }
};
