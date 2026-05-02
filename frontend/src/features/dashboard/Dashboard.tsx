import { dashboardApi } from "../../api/dashboard";
import { CandlestickChart } from "../../components/charts/CandlestickChart";
import { ExposureBarChart } from "../../components/charts/ExposureBarChart";
import { OrderBookDepthChart } from "../../components/charts/OrderBookDepthChart";
import { PriceAreaChart } from "../../components/charts/PriceAreaChart";
import { ConnectionPanel } from "../../components/ui/ConnectionPanel";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionCard } from "../../components/ui/SectionCard";
import { StatusPill } from "../../components/ui/StatusPill";
import { TradeTapeTable } from "../../components/ui/TradeTapeTable";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useKdb } from "../../hooks/useKdb";
import { formatCompactNumber, formatPercent, formatPrice, formatSignedPrice } from "../../utils/formatters";

const SYMBOLS = ["AAPL", "MSFT", "NVDA", "TSLA"];

export function Dashboard() {
  const { lastError, lastEvent, reconnect, sendRequest, status, wsUrl } = useKdb();
  const { data, error, isLoading, loadDashboard, source, symbol } = useDashboardData();

  const changeTone = data.snapshot.change >= 0 ? "positive" : "negative";

  const refresh = async () => {
    await loadDashboard(symbol);
  };

  const pingOnly = async () => {
    try {
      await dashboardApi.ping(sendRequest);
    } catch {
      // Connection errors are surfaced through the transport panel.
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <p className="eyebrow">kdb dashboard library</p>
          <h1>React starter for websocket-driven analytics desks.</h1>
          <p className="hero-panel__lede">
            Typed request/response flow on top of a kdb websocket, with finance-first visuals and a starter theme that
            feels familiar to terminal-native users.
          </p>
        </div>

        <div className="hero-panel__actions">
          <div className="hero-panel__badges">
            <StatusPill label={`symbol ${symbol}`} tone="neutral" />
            <StatusPill label={status} tone={status === "open" ? "positive" : status === "error" ? "negative" : "warning"} />
            <StatusPill label={source === "live" ? "live backend" : "mock fallback"} tone={source === "live" ? "positive" : "warning"} />
          </div>

          <div className="hero-panel__buttons">
            <button className="button button--secondary" disabled={status !== "open"} onClick={pingOnly} type="button">
              Test request flow
            </button>
            <button className="button" disabled={isLoading} onClick={refresh} type="button">
              {isLoading ? "Refreshing..." : "Refresh dashboard"}
            </button>
          </div>
        </div>
      </section>

      <section className="symbol-strip" aria-label="Ticker selector">
        {SYMBOLS.map((ticker) => (
          <button
            className={`symbol-chip ${ticker === symbol ? "symbol-chip--active" : ""}`.trim()}
            key={ticker}
            onClick={() => {
              void loadDashboard(ticker);
            }}
            type="button"
          >
            {ticker}
          </button>
        ))}
      </section>

      <section className="metrics-grid">
        <MetricCard label="Last" tone="neutral" value={formatPrice(data.snapshot.last)} />
        <MetricCard label="Change" tone={changeTone} value={formatSignedPrice(data.snapshot.change)} />
        <MetricCard label="Return" tone={changeTone} value={formatPercent(data.snapshot.changePct)} />
        <MetricCard label="VWAP" tone="neutral" value={formatPrice(data.snapshot.vwap)} />
        <MetricCard label="Day range" tone="neutral" value={`${formatPrice(data.snapshot.low)} / ${formatPrice(data.snapshot.high)}`} />
        <MetricCard label="Volume" tone="neutral" value={formatCompactNumber(data.snapshot.volume)} />
      </section>

      <section className="dashboard-grid">
        <SectionCard
          action={<StatusPill label={source === "live" ? "response: dashboard.load" : "fallback dataset"} tone={source === "live" ? "positive" : "warning"} />}
          className="dashboard-grid__price"
          eyebrow="Intraday"
          title={`${data.snapshot.symbol} price & VWAP`}
        >
          <PriceAreaChart data={data.intraday} />
        </SectionCard>

        <SectionCard className="dashboard-grid__transport" eyebrow="Transport" title="Connection state">
          <ConnectionPanel
            lastError={error ?? lastError}
            lastEventTopic={lastEvent?.topic ?? null}
            onReconnect={reconnect}
            source={source}
            status={status}
            wsUrl={wsUrl}
          />
        </SectionCard>

        <SectionCard className="dashboard-grid__candles" eyebrow="OHLC" title="Candlestick view">
          <CandlestickChart data={data.candles} />
        </SectionCard>

        <SectionCard className="dashboard-grid__exposure" eyebrow="Risk" title="Book exposures">
          <ExposureBarChart data={data.exposures} />
        </SectionCard>

        <SectionCard className="dashboard-grid__depth" eyebrow="Liquidity" title="Order-book depth">
          <OrderBookDepthChart data={data.orderBook} />
        </SectionCard>

        <SectionCard className="dashboard-grid__trades" eyebrow="Tape" title="Recent prints">
          <TradeTapeTable rows={data.trades} />
        </SectionCard>
      </section>
    </main>
  );
}
