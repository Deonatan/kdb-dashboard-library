# Getting Started

This guide describes the intended setup flow for `kdb-dashboard-library` once the backend and frontend implementations are scaffolded.

Because the project is meant to stay friendly to `kdb` users, the workflow is designed around a simple split:

- `backend/` runs the pure `q` WebSocket server
- `frontend/` runs the React dashboard client

## Prerequisites

Expected local tooling:

- `q` / `kdb+`
- `node` and `npm` or `pnpm`
- a browser for local dashboard testing

Optional but recommended:

- `rlwrap` or your preferred terminal tooling for `q`
- a process manager or simple shell scripts for repeatable local startup

## Expected Repository Layout

```text
kdb-dashboard-library/
├── backend/
├── frontend/
├── docs/
└── README.md
```

## Suggested First Boot Flow

### Backend

The backend should eventually expose:

- a startup script such as `backend/main.q`
- configuration for host, port, and environment
- a WebSocket handler that parses JSON and routes by function name

Typical local startup pattern:

```bash
cd backend
q main.q -p 5050
```

### Frontend

The frontend should eventually provide:

- a React app
- a shared WebSocket client service
- a configurable backend WebSocket URL

Typical local startup pattern:

```bash
cd frontend
npm install
npm run dev
```

## Environment Expectations

The frontend should connect using a configurable WebSocket URL, for example:

```text
ws://localhost:5050
```

Suggested environment variables:

- `KDB_WS_URL` for the frontend WebSocket target
- `KDB_APP_ENV` for backend runtime mode

## First End-To-End Smoke Test

Once both sides are scaffolded, a minimal test should be:

1. Start the backend.
2. Start the frontend.
3. Open the dashboard.
4. Send a `healthCheck` request from the frontend.
5. Confirm a JSON success response comes back.
6. Render a visible connected state in the UI.

Recommended first request:

```json
{
  "requestId": "smoke-001",
  "func": "healthCheck",
  "params": {}
}
```

Recommended first response:

```json
{
  "requestId": "smoke-001",
  "status": "ok",
  "func": "healthCheck",
  "data": {
    "connected": true,
    "service": "kdb-dashboard-library",
    "timestamp": "2026-05-03T00:00:00.000Z"
  },
  "error": null
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

1. Add a new handler file under `backend/endpoints/`.
2. Register it in the backend function registry.
3. Add a frontend request wrapper in `frontend/src/services/` or `frontend/src/features/`.
4. Render the data in a dashboard component.

See [docs/endpoint-pattern.md](endpoint-pattern.md) for the recommended structure.

## Suggested First Reference Endpoints

For early scaffolding, these endpoints give good coverage:

- `healthCheck`
- `getTopMovers`
- `getTrades`
- `getPnLSeries`

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
- [Request / Response Contracts](request-response-contracts.md)
- [Roadmap](roadmap.md)
