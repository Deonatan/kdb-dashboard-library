# Getting Started

This guide describes the setup flow for the monorepo version of `kdb-dashboard-library`.

Because the project is meant to stay friendly to `kdb` users, the workflow is designed around a simple split:

- `apps/q-gateway/` runs the pure `q` WebSocket server
- `apps/dashboard/` runs the React dashboard client

## Prerequisites

Expected local tooling:

- `q` / `kdb+`
- `node` and `pnpm`
- a browser for local dashboard testing

Optional but recommended:

- `rlwrap` or your preferred terminal tooling for `q`
- a process manager or simple shell scripts for repeatable local startup

## Expected Repository Layout

```text
kdb-dashboard-library/
├── apps/
│   ├── q-gateway/
│   └── dashboard/
├── packages/
├── docs/
└── README.md
```

## Suggested First Boot Flow

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the q gateway

The gateway startup script expects `q` on your `PATH`.

```bash
pnpm dev:gateway
```

This runs:

- `q apps/q-gateway/src/main.q -port 5050`

The gateway will listen on `ws://localhost:5050`.

### 3. Start the dashboard

```bash
pnpm dev:dashboard
```

## Environment Expectations

The dashboard connects using `VITE_KDB_WS_URL`.

```text
ws://localhost:5050
```

Copy [`apps/dashboard/.env.example`](../apps/dashboard/.env.example) to `apps/dashboard/.env` if you want to override the default.

Suggested environment variables:

- `VITE_KDB_WS_URL` for the frontend WebSocket target
- `Q_PORT` if you want to change the default gateway port in the shell wrapper

## First End-To-End Smoke Test

Once both sides are running, a minimal test should be:

1. Start the backend.
2. Start the frontend.
3. Open the dashboard.
4. Let the dashboard send `health.check` automatically after the socket opens.
5. Confirm a JSON success response comes back.
6. Render a visible connected state in the UI.

Recommended first request:

```json
{
  "id": "smoke-001",
  "func": "health.check",
  "params": {}
}
```

Recommended first response:

```json
{
  "id": "smoke-001",
  "ok": true,
  "func": "health.check",
  "data": {
    "status": "ok",
    "service": "kdb-dashboard-library",
    "timestamp": "2026.05.03D00:00:00.000000000"
  },
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D00:00:00.000000000"
}
```

## Manual q-Side Smoke Test

Before the React layer is fully wired, kdb users may want to validate the backend contract directly from `q`.

Suggested approach once the WebSocket gateway exists:

1. Start the backend process.
2. Open a handle to the local service with `hopen` or your team’s preferred q WebSocket helper.
3. Send a minimal JSON payload.
4. Confirm the response envelope shape is correct.

This is useful for isolating backend contract issues before debugging React state or rendering behavior.

## Adding A New Endpoint

The expected happy path should be:

1. Add a new handler file under `apps/q-gateway/src/endpoints/`.
2. Register it in the gateway registry.
3. Add or update a request wrapper in `packages/react-client/` or `apps/dashboard/`.
4. Render the data in the dashboard or in a package consumer.

See [docs/backend/adding-endpoints.md](backend/adding-endpoints.md) and [docs/endpoint-pattern.md](endpoint-pattern.md) for the recommended structure.

## Suggested First Reference Endpoints

For early scaffolding, these endpoints give good coverage:

- `health.check`
- `debug.echo`
- `dashboard.snapshot`
- one custom desk-specific endpoint of your own

They exercise different shapes:

- scalar service metadata
- ranked tabular data
- blotter-style row sets
- time series for charts

## Frontend UX Baseline

The starter kit should feel recognizable to finance users:

- dense information layout
- dark background surfaces
- strong positive/negative color cues
- clear typography for prices, PnL, and timestamps

That visual baseline should help users focus on integrating data first, then customizing the presentation for their desk or product.

## Troubleshooting Ideas

Common early issues will likely be:

- backend process started without the expected WebSocket port
- JSON parse failures from malformed request payloads
- mismatch between registered function names and frontend request names
- unsupported q types being returned directly without JSON-safe shaping
- frontend assuming a response shape that differs from the backend contract

When debugging, start with:

1. a single known-good request
2. backend logging for raw payload, parsed request, and resolved function
3. frontend logging for socket lifecycle and response envelopes

## Next Reading

- [Architecture](architecture.md)
- [Backend Architecture](backend/architecture.md)
- [Request / Response Contracts](request-response-contracts.md)
- [Roadmap](roadmap.md)
