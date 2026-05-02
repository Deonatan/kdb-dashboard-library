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
      eyebrow="q websocket starter"
      heading="Bloomberg-flavored React + kdb dashboards."
      status={
        <>
          <StatusBadge
            label={
              status === 'open'
                ? 'Live'
                : status === 'connecting'
                  ? 'Connecting'
                  : status === 'error'
                    ? 'Error'
                    : 'Offline'
            }
            tone={
              status === 'open'
                ? 'positive'
                : status === 'error'
                  ? 'negative'
                  : 'warning'
            }
          />
          <StatusBadge label={url} tone="accent" />
        </>
      }
    >
      <div className="dashboard-page">
        <section className="dashboard-grid dashboard-grid--top">
          <Panel
            eyebrow="overview"
            title="Portfolio pulse"
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
              <strong>Backend status:</strong>{' '}
              {health.data?.status ?? 'demo snapshot'}
              <span className="panel-note__meta">
                {health.lastUpdated ?? 'Waiting for q health check'}
              </span>
            </div>
          </Panel>

          <Panel eyebrow="explainability" title="Endpoint pattern">
            <div className="endpoint-list">
              <div className="endpoint-list__item">
                <span className="endpoint-list__func">health.check</span>
                <p>Connectivity smoke test for the frontend shell.</p>
              </div>
              <div className="endpoint-list__item">
                <span className="endpoint-list__func">dashboard.snapshot</span>
                <p>Single payload powering cards, charts, and movers table.</p>
              </div>
              <div className="endpoint-list__item">
                <span className="endpoint-list__func">debug.echo</span>
                <p>Helpful while onboarding new request contracts and params.</p>
              </div>
            </div>
          </Panel>
        </section>

        <section className="dashboard-grid dashboard-grid--charts">
          <Panel eyebrow="price action" title="Intraday path">
            <PriceLineChart data={snapshotData.priceSeries} />
          </Panel>

          <Panel eyebrow="liquidity" title="Volume profile">
            <VolumeBarChart data={snapshotData.volumeSeries} />
          </Panel>
        </section>

        <section className="dashboard-grid dashboard-grid--bottom">
          <Panel eyebrow="risk mix" title="Allocation split">
            <AllocationDonut data={snapshotData.allocation} />
          </Panel>

          <Panel eyebrow="market tape" title="Top movers">
            <MoversTable rows={snapshotData.movers} />
          </Panel>
        </section>

        <section className="dashboard-grid dashboard-grid--tools">
          <Panel
            eyebrow="request workbench"
            title="Send debug.echo"
            action={
              <button className="app-button" onClick={() => void handleEcho()} type="button">
                Send request
              </button>
            }
          >
            <label className="composer">
              <span className="composer__label">params JSON</span>
              <textarea
                className="composer__textarea"
                onChange={(event) => setEchoPayload(event.target.value)}
                value={echoPayload}
              />
            </label>
            <pre className="raw-envelope">
              {echoResponse || 'Press "Send request" to verify the round trip.'}
            </pre>
          </Panel>

          <Panel eyebrow="transport" title="Latest websocket envelope">
            <pre className="raw-envelope">
              {latestEnvelope ||
                'No websocket reply received yet. Start the q gateway and the envelope will appear here.'}
            </pre>
            <div className="panel-note">
              <strong>Snapshot mode:</strong>{' '}
              {snapshot.error ? snapshot.error : 'Using live data when the gateway is reachable.'}
            </div>
          </Panel>
        </section>
      </div>
    </TerminalShell>
  )
}

export default App
