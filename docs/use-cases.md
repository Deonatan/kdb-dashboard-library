# Use Cases

This guide answers a simple question:

What should a team actually build first with `kdb-dashboard-library`?

The short answer is:

- start with one internal dashboard that already has strong `kdb` logic behind it
- keep the `q` side responsible for domain logic and shaping
- keep the React side focused on operator workflows, drill-down, and presentation

The library is a strong fit when a team already trusts `kdb+/q` for analytics, but wants a friendlier and more reusable frontend surface than ad hoc HTML, Java, or desktop tooling.

## Best First Use Case

The strongest first use case for this repo is:

**an intraday trading desk risk cockpit**

That means a dashboard where a desk, PM, or risk user can open one screen and quickly answer:

- What is the desk PnL right now?
- Which books, sectors, or symbols are driving the move?
- Has exposure drifted outside expected limits?
- Where are the biggest movers or concentration pockets?
- Do I need to drill into one area immediately?

This is the best fit for the current starter because the repo already leans toward:

- KPIs and summary metrics
- ranked tables
- time-series charts
- allocation-style breakdowns
- fast request / response workflows over WebSocket

## Why This Use Case Fits The Repo

An intraday risk cockpit maps neatly onto the existing architecture:

- `q` stays responsible for exposure logic, PnL shaping, and table aggregation
- the gateway exposes clean endpoint names like `desk.snapshot` or `risk.summary`
- React renders a compact finance-friendly dashboard that updates on demand
- additional panels can be added without changing the transport layer

It also matches how many teams actually adopt internal libraries:

- one desk sponsors the first build
- the first dashboard becomes the reference contract
- new teams copy the pattern and add their own endpoint files

## Flagship Example: Multi-Asset Desk Risk Cockpit

### Primary users

- trading desk leads
- PMs
- desk risk managers
- intraday support analysts

### Core workflow

1. User opens the dashboard at market open.
2. React connects to the `q` gateway over WebSocket.
3. The page requests a top-level snapshot for the selected desk or book.
4. The dashboard renders KPIs, charts, movers, and allocations.
5. The user changes filters such as desk, book, strategy, region, or symbol.
6. New endpoint calls fetch focused slices without rebuilding the entire UI.

### Suggested backend endpoint set

The current starter endpoints are enough to bootstrap the workflow:

- `health.check`
- `dashboard.snapshot`
- `debug.echo`

The first real desk implementation would usually add endpoints like:

- `desk.snapshot`
- `desk.positions.top`
- `desk.exposure.timeseries`
- `desk.pnl.drivers`
- `desk.alerts.active`

Example request:

```json
{
  "id": "desk-001",
  "func": "desk.snapshot",
  "params": {
    "desk": "macro",
    "book": "global-rates",
    "asOf": "2026-05-03T09:30:00Z"
  }
}
```

### Suggested frontend panels

- top-row KPIs for day PnL, gross, net, VaR, and limit usage
- line chart for intraday PnL or exposure drift
- allocation or concentration view by asset class, region, or sector
- movers table for symbols or books contributing most to the day
- alerts panel for breached thresholds or stale feeds

### Why teams like this pattern

- the data shaping remains close to the source in `q`
- the frontend becomes easier to iterate on than traditional internal tooling
- users get a familiar dense finance UI without rebuilding charting and transport from scratch

## Delivery Plan For The First Real Desk

If a team wanted to turn this starter into a real desk cockpit, a practical sequence would be:

1. Replace the demo `dashboard.snapshot` payload with real desk-level data.
2. Add one filter dimension such as `desk` or `book`.
3. Add one drill-down endpoint for ranked positions or top contributors.
4. Add one time-series endpoint for intraday drift.
5. Add one alerts endpoint for limit breaches or data-quality warnings.

That path keeps the first version small while proving the extension model.

## Sample Use Cases

The flagship use case above is the best first deployment. These are other strong fits once the team is comfortable with the pattern.

### 1. Execution Quality Dashboard

Use this when an execution or electronic trading team wants to monitor fills, slippage, venue mix, and latency through the day.

Good endpoint ideas:

- `execution.summary`
- `execution.venue.mix`
- `execution.latency.timeseries`
- `execution.orders.outliers`

Good panels:

- fill-rate KPI cards
- venue share bar chart
- latency trend line
- outlier order table

Why it fits:

- `q` is strong at intraday aggregation over event streams
- React is good for quick drill-down and operator-friendly layout

### 2. Liquidity And Inventory Monitor

Use this when a market-making, fixed-income, or treasury team needs a live view of inventory, turnover, and concentration.

Good endpoint ideas:

- `inventory.snapshot`
- `inventory.by.bucket`
- `inventory.turnover.timeseries`
- `inventory.concentration.top`

Good panels:

- inventory KPIs by asset bucket
- concentration heat-style table
- turnover chart
- stale inventory exceptions

Why it fits:

- the data is naturally tabular and time-series heavy
- users usually care about compact numeric presentation more than consumer-style UI polish

### 3. Market Data Health And Surveillance Console

Use this when a support or platform team wants one place to see feed freshness, anomalous moves, and symbol-level data quality issues.

Good endpoint ideas:

- `feeds.health`
- `feeds.staleness.top`
- `ticks.anomaly.summary`
- `ticks.anomaly.details`

Good panels:

- service health badges
- stale source ranking
- anomaly counts by feed or venue
- drill-down table by symbol

Why it fits:

- `q` can detect freshness gaps and outliers close to the data
- the same WebSocket contract works for both business and operational dashboards

### 4. PM Morning Snapshot

Use this when a portfolio manager wants a fast pre-open or start-of-day summary rather than a full operator console.

Good endpoint ideas:

- `pm.snapshot`
- `pm.exposure.mix`
- `pm.watchlist.movers`
- `pm.calendar.flags`

Good panels:

- overnight PnL and exposure cards
- watchlist movers table
- sector or asset allocation view
- event or earnings flags

Why it fits:

- the dashboard can stay small and focused
- the same library supports both a broad desk screen and a lighter PM-facing surface

### 5. Client Reporting Workbench

Use this when a team prepares recurring client or management views and wants shared backend logic with a more maintainable frontend.

Good endpoint ideas:

- `client.snapshot`
- `client.performance.timeseries`
- `client.holdings.top`
- `client.risk.summary`

Good panels:

- performance summary cards
- holdings and attribution tables
- allocation chart
- downloadable or reviewable summary views

Why it fits:

- `q` can centralize the calculation and shaping logic
- React gives a clearer review surface before distribution

### 6. Strategy Research Monitor

Use this when a quant or strat team wants a lightweight internal UI for factor drift, signal health, and live research diagnostics.

Good endpoint ideas:

- `signals.summary`
- `signals.decay.timeseries`
- `signals.factor.exposure`
- `signals.outliers`

Good panels:

- signal count and quality KPIs
- factor contribution tables
- decay or hit-rate trend charts
- outlier symbol drill-down

Why it fits:

- teams can iterate on endpoint logic quickly in `q`
- the React layer gives research users a cleaner workflow than raw notebook output

## How To Choose Your First Implementation

Choose a first use case with these traits:

- one clear internal sponsor
- existing `kdb` logic or data tables already available
- a dashboard shape that is mostly KPIs, rankings, and time series
- users who already understand the domain and mainly need a better interface

Avoid starting with:

- highly permissioned external portals
- broad multi-workflow systems with many forms
- use cases that need heavy transactional write-back before basic read flows are proven

## Practical Rule Of Thumb

If your team can describe the first screen as:

"Give me a compact live view of a desk, book, strategy, or feed, plus one or two drill-downs"

then this repo is probably a very good fit.

## Related Docs

- [Getting Started](getting-started.md)
- [Architecture](architecture.md)
- [Backend Architecture](backend/architecture.md)
- [Adding Backend Endpoints](backend/adding-endpoints.md)
- [Endpoint Pattern](endpoint-pattern.md)
