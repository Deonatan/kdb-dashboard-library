export type JsonPrimitive = boolean | null | number | string

export type JsonValue = JsonObject | JsonPrimitive | JsonValue[]

export interface JsonObject {
  [key: string]: JsonValue
}

export interface KdbRequest<TParams extends JsonObject = JsonObject> {
  func: string
  id: string
  params?: TParams
}

export interface KdbErrorPayload {
  code: string
  details?: JsonValue
  message: string
}

export interface KdbSuccessResponse<TData = JsonValue> {
  data: TData
  func: string
  id: string
  ok: true
  server: string
  ts: string
}

export interface KdbErrorResponse {
  error: KdbErrorPayload
  func: string
  id: string
  ok: false
  server: string
  ts: string
}

export type KdbResponse<TData = JsonValue> =
  | KdbErrorResponse
  | KdbSuccessResponse<TData>

export type MetricTone = 'accent' | 'neutral' | 'positive' | 'warning'

export interface DashboardMetric {
  label: string
  tone: MetricTone
  value: string
}

export interface AllocationSlice {
  bucket: string
  value: number
}

export interface PricePoint {
  px: number
  ts: string
}

export interface VolumePoint {
  bucket: string
  volume: number
}

export interface MoverRow {
  change: number
  last: number
  pct: number
  symbol: string
  volume: number
}

export interface DashboardSnapshot {
  allocation: AllocationSlice[]
  movers: MoverRow[]
  overview: DashboardMetric[]
  priceSeries: PricePoint[]
  volumeSeries: VolumePoint[]
}

export interface StreamTapeTick {
  change: number
  price: number
  symbol: string
  ts: string
  volume: number
}

export interface StreamTapeSnapshot {
  channel: string
  lastUpdated: string
  sequence: number
  status: string
  ticks: StreamTapeTick[]
}

export const createRequestId = (prefix = 'req') =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

export const createRequest = <TParams extends JsonObject = JsonObject>(
  func: string,
  params?: TParams,
  id = createRequestId(),
): KdbRequest<TParams> => ({
  func,
  id,
  params,
})

export const isKdbErrorResponse = <TData = JsonValue>(
  response: KdbResponse<TData>,
): response is KdbErrorResponse => response.ok === false

export const isKdbSuccessResponse = <TData = JsonValue>(
  response: KdbResponse<TData>,
): response is KdbSuccessResponse<TData> => response.ok === true

export const demoSnapshot: DashboardSnapshot = {
  allocation: [
    { bucket: 'Equities', value: 44 },
    { bucket: 'Rates', value: 22 },
    { bucket: 'FX', value: 18 },
    { bucket: 'Commodities', value: 16 },
  ],
  movers: [
    { change: 1.42, last: 194.22, pct: 0.74, symbol: 'AAPL', volume: 12.3 },
    { change: -0.61, last: 421.14, pct: -0.14, symbol: 'MSFT', volume: 9.8 },
    { change: 2.83, last: 957.61, pct: 0.3, symbol: 'NVDA', volume: 15.6 },
    { change: 0.74, last: 401.82, pct: 0.18, symbol: 'GS', volume: 4.4 },
    { change: -0.12, last: 201.11, pct: -0.06, symbol: 'JPM', volume: 5.1 },
    { change: 0.57, last: 525.34, pct: 0.11, symbol: 'SPY', volume: 18.2 },
  ],
  overview: [
    { label: 'Net Exposure', tone: 'accent', value: '42.8M' },
    { label: 'Daily P&L', tone: 'positive', value: '+1.28M' },
    { label: '95% VaR', tone: 'warning', value: '3.7M' },
    { label: 'Gross Notional', tone: 'neutral', value: '88.4M' },
  ],
  priceSeries: [
    { px: 193.1, ts: '09:30' },
    { px: 193.42, ts: '09:45' },
    { px: 193.58, ts: '10:00' },
    { px: 193.23, ts: '10:15' },
    { px: 193.81, ts: '10:30' },
    { px: 194.07, ts: '10:45' },
    { px: 193.96, ts: '11:00' },
    { px: 194.22, ts: '11:15' },
  ],
  volumeSeries: [
    { bucket: '09:30', volume: 1.1 },
    { bucket: '09:45', volume: 1.8 },
    { bucket: '10:00', volume: 1.5 },
    { bucket: '10:15', volume: 2.3 },
    { bucket: '10:30', volume: 1.9 },
    { bucket: '10:45', volume: 2.0 },
    { bucket: '11:00', volume: 1.4 },
    { bucket: '11:15', volume: 1.7 },
  ],
}

export const demoStreamTape: StreamTapeSnapshot = {
  channel: 'stream.tape',
  lastUpdated: '09:30:11',
  sequence: 12,
  status: 'streaming',
  ticks: [
    { change: 0.18, price: 194.62, symbol: 'AAPL', ts: '09:30:11', volume: 0.8 },
    { change: -0.12, price: 421.39, symbol: 'MSFT', ts: '09:30:10', volume: 1.1 },
    { change: 0.09, price: 957.37, symbol: 'NVDA', ts: '09:30:09', volume: 1.4 },
    { change: -0.05, price: 401.74, symbol: 'GS', ts: '09:30:08', volume: 0.9 },
    { change: 0.22, price: 201.39, symbol: 'JPM', ts: '09:30:07', volume: 1.7 },
    { change: -0.08, price: 525.31, symbol: 'SPY', ts: '09:30:06', volume: 2.2 },
  ],
}
