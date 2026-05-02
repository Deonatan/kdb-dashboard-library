import { useKdbRequest } from "../../hooks/useKdbRequest";
import type { KdbConnectionStatus } from "../../types/kdb";
import { StatusPill } from "./StatusPill";

const statusToneMap: Record<KdbConnectionStatus, "negative" | "neutral" | "positive" | "warning"> = {
  closed: "negative",
  connecting: "warning",
  error: "negative",
  idle: "neutral",
  open: "positive",
  reconnecting: "warning"
};

interface ConnectionPanelProps {
  lastError: string | null;
  lastEventTopic: string | null;
  onReconnect: () => void;
  source: "live" | "mock";
  status: KdbConnectionStatus;
  wsUrl: string;
}

export function ConnectionPanel({
  lastError,
  lastEventTopic,
  onReconnect,
  source,
  status,
  wsUrl
}: ConnectionPanelProps) {
  const pingRequest = useKdbRequest<{ ok: boolean; serverTime: string }>();

  const pingBackend = async () => {
    try {
      await pingRequest.execute("health.ping");
    } catch {
      // Error state is surfaced in the panel.
    }
  };

  return (
    <div className="connection-panel">
      <div className="connection-panel__meta">
        <div>
          <span className="connection-panel__label">websocket</span>
          <strong>{wsUrl}</strong>
        </div>
        <div className="connection-panel__badges">
          <StatusPill label={status} tone={statusToneMap[status]} />
          <StatusPill label={`${source} data`} tone={source === "live" ? "positive" : "warning"} />
        </div>
      </div>

      <div className="connection-panel__actions">
        <button className="button button--secondary" onClick={onReconnect} type="button">
          Reconnect
        </button>
        <button
          className="button"
          disabled={pingRequest.isLoading || status !== "open"}
          onClick={pingBackend}
          type="button"
        >
          {pingRequest.isLoading ? "Pinging..." : "Ping backend"}
        </button>
      </div>

      <dl className="connection-panel__stats">
        <div>
          <dt>Last event</dt>
          <dd>{lastEventTopic ?? "No events yet"}</dd>
        </div>
        <div>
          <dt>Heartbeat</dt>
          <dd>{pingRequest.data?.serverTime ?? "Not pinged"}</dd>
        </div>
        <div>
          <dt>Transport error</dt>
          <dd>{lastError ?? pingRequest.error ?? "Healthy"}</dd>
        </div>
      </dl>
    </div>
  );
}
