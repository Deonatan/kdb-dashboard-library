import { startTransition, useDeferredValue, useState } from 'react'

import {
  AllocationDonut,
  MetricGrid,
  MoversTable,
  Panel,
  PriceLineChart,
  StatusBadge,
  TerminalShell,
  VolumeBarChart,
} from '@kdb-dashboard-library/finance-ui'
import {
  demoSnapshot,
  type DashboardSnapshot,
  type JsonObject,
} from '@kdb-dashboard-library/protocol'
import { useKdbConnection, useKdbLiveQuery } from '@kdb-dashboard-library/react-client'

import './App.css'

type HealthPayload = {
  service: string
  status: string
  timestamp: string
}

const defaultEchoPayload = '{\n  "book": "macro",\n  "limit": 5,\n  "desk": "cross-asset"\n}'

function App() {
  const { connect, disconnect, latestResponse, request, status, url } =
    useKdbConnection()
  const [echoPayload, setEchoPayload] = useState(defaultEchoPayload)
  const [echoResponse, setEchoResponse] = useState<string>('')

  const health = useKdbLiveQuery<HealthPayload>('health.check', undefined, {
    enabled: status === 'open',
  })

  const snapshot = useKdbLiveQuery<DashboardSnapshot>(
    'dashboard.snapshot',
    undefined,
    {
      enabled: status === 'open',
      fallbackData: demoSnapshot,
    },
  )

  const snapshotData = snapshot.data ?? demoSnapshot
  const latestEnvelope = useDeferredValue(
    latestResponse ? JSON.stringify(latestResponse, null, 2) : '',
  )
  const connectionLabel =
    status === 'open'
      ? 'Live'
      : status === 'connecting'
        ? 'Connecting'
        : status === 'error'
          ? 'Error'
          : 'Offline'
  const connectionTone =
    status === 'open'
      ? 'positive'
      : status === 'error'
        ? 'negative'
        : 'warning'
  const serviceName = health.data?.service ?? 'kdb-dashboard-library'
  const heartbeatState =
    health.data?.status === 'ok'
      ? 'Healthy'
      : status === 'open'
        ? 'Pending'
        : 'Standby'
  const heartbeatTone =
    health.data?.status === 'ok'
      ? 'positive'
      : status === 'open'
        ? 'warning'
        : 'neutral'
  const feedState = snapshot.error
    ? 'Attention'
    : status === 'open'
      ? 'Live data'
      : 'Fallback'
  const feedTone = snapshot.error
    ? 'negative'
    : status === 'open'
      ? 'positive'
      : 'warning'

  const handleEcho = async () => {
    try {
      const parsedPayload = JSON.parse(echoPayload) as JsonObject
      const response = await request('debug.echo', parsedPayload)

      startTransition(() => {
        setEchoResponse(JSON.stringify(response, null, 2))
      })
    } catch (error) {
      startTransition(() => {
        setEchoResponse(
          JSON.stringify(
            {
              error:
                error instanceof Error ? error.message : 'Unable to send request',
            },
            null,
            2,
          ),
        )
      })
    }
  }

  return (
    <TerminalShell
      eyebrow="kdb dashboard library"
      heading="Cross-Asset Risk Console"
      status={
        <>
          <StatusBadge
            label={connectionLabel}
            tone={connectionTone}
          />
          <StatusBadge label={url} tone="accent" />
        </>
      }
    >
      <div className="dashboard-page">
        <section className="dashboard-strip">
          <article className="strip-card">
            <p className="strip-card__label">gateway</p>
            <strong className={`strip-card__value strip-card__value--${connectionTone}`}>
              {connectionLabel}
            </strong>
            <span className="strip-card__meta">{serviceName}</span>
          </article>

          <article className="strip-card">
            <p className="strip-card__label">feed state</p>
            <strong className={`strip-card__value strip-card__value--${feedTone}`}>
              {feedState}
            </strong>
            <span className="strip-card__meta">
              {snapshot.lastUpdated ?? 'Awaiting first payload'}
            </span>
          </article>

          <article className="strip-card">
            <p className="strip-card__label">transport</p>
            <strong className="strip-card__value strip-card__value--accent">
              WebSocket
            </strong>
            <span className="strip-card__meta">{url}</span>
          </article>

          <article className="strip-card">
            <p className="strip-card__label">heartbeat</p>
            <strong className={`strip-card__value strip-card__value--${heartbeatTone}`}>
              {heartbeatState}
            </strong>
            <span className="strip-card__meta">
              {health.lastUpdated ?? 'Awaiting gateway heartbeat'}
            </span>
          </article>
        </section>

        <section className="dashboard-grid dashboard-grid--top">
          <Panel
            eyebrow="risk summary"
            title="Desk overview"
            action={
              <div className="button-row">
                <button className="app-button" onClick={connect} type="button">
                  Reconnect
                </button>
                <button
                  className="app-button app-button--secondary"
                  onClick={disconnect}
                  type="button"
                >
                  Disconnect
                </button>
              </div>
            }
          >
            <MetricGrid metrics={snapshotData.overview} />
            <div className="panel-note">
              <strong>Gateway:</strong>
              {health.data?.status ?? 'Awaiting heartbeat'}
              <span className="panel-note__meta">
                {health.lastUpdated ?? 'No server heartbeat received yet'}
              </span>
            </div>
          </Panel>

          <Panel eyebrow="service map" title="Route catalog">
            <div className="route-list">
              <div className="route-list__item">
                <div className="route-list__top">
                  <span className="route-list__func">health.check</span>
                  <span className="route-list__tag">heartbeat</span>
                </div>
                <p>Gateway availability, service identity, and server timestamp.</p>
              </div>

              <div className="route-list__item">
                <div className="route-list__top">
                  <span className="route-list__func">dashboard.snapshot</span>
                  <span className="route-list__tag">primary feed</span>
                </div>
                <p>Overview metrics, allocation, intraday series, and active movers.</p>
              </div>

              <div className="route-list__item">
                <div className="route-list__top">
                  <span className="route-list__func">debug.echo</span>
                  <span className="route-list__tag">validation</span>
                </div>
                <p>Request and response contract validation for new route development.</p>
              </div>
            </div>
          </Panel>
        </section>

        <section className="dashboard-grid dashboard-grid--charts">
          <Panel eyebrow="pricing" title="Intraday price">
            <PriceLineChart data={snapshotData.priceSeries} />
          </Panel>

          <Panel eyebrow="trading activity" title="Volume by interval">
            <VolumeBarChart data={snapshotData.volumeSeries} />
          </Panel>
        </section>

        <section className="dashboard-grid dashboard-grid--bottom">
          <Panel eyebrow="allocation" title="Allocation mix">
            <AllocationDonut data={snapshotData.allocation} />
          </Panel>

          <Panel eyebrow="market activity" title="Active movers">
            <MoversTable rows={snapshotData.movers} />
          </Panel>
        </section>

        <section className="dashboard-grid dashboard-grid--tools">
          <Panel
            eyebrow="request console"
            title="Execute debug.echo"
            action={
              <button className="app-button" onClick={() => void handleEcho()} type="button">
                Run request
              </button>
            }
          >
            <label className="composer">
              <span className="composer__label">request parameters</span>
              <textarea
                className="composer__textarea"
                onChange={(event) => setEchoPayload(event.target.value)}
                value={echoPayload}
              />
            </label>
            <pre className="raw-envelope">
              {echoResponse || 'Submit a request to inspect the live response contract.'}
            </pre>
          </Panel>

          <Panel eyebrow="transport" title="Latest response envelope">
            <pre className="raw-envelope">
              {latestEnvelope || 'Awaiting the first gateway response.'}
            </pre>
            <div className="panel-note">
              <strong>Feed mode:</strong>
              {snapshot.error ? snapshot.error : 'Live transport active'}
            </div>
          </Panel>
        </section>
      </div>
    </TerminalShell>
  )
}

export default App
