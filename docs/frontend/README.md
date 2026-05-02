# Dashboard app

The runnable dashboard lives in `apps/dashboard/` and sits on top of the shared workspace packages:

- `packages/react-client` for WebSocket connection state and request hooks
- `packages/protocol` for shared envelope and snapshot types
- `packages/finance-ui` for the terminal-inspired theme and finance visuals

## Run locally

```bash
pnpm install
cd apps/dashboard
cp .env.example .env
pnpm dev
```

Default websocket target:

```env
VITE_KDB_WS_URL=ws://localhost:5050
```

If the backend is not running yet, the UI still renders from the demo snapshot exported by `packages/protocol`.

## Expected websocket contract

Frontend requests:

```json
{
  "id": "uuid",
  "func": "dashboard.snapshot",
  "params": {
    "book": "macro"
  }
}
```

Backend responses:

```json
{
  "id": "uuid",
  "ok": true,
  "data": {
    "overview": [],
    "allocation": [],
    "priceSeries": [],
    "volumeSeries": [],
    "movers": []
  },
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D01:58:00.000000000"
}
```

## Starter surface

- `src/App.tsx`: composes the starter dashboard and debug workbench
- `src/main.tsx`: wires `KdbProvider` to the app
- `packages/react-client`: reconnecting websocket client with request correlation
- `packages/finance-ui`: KPI cards, charts, table, theme
- `packages/protocol`: request and response types

## Adding frontend features

1. Add a new backend function name in `apps/q-gateway/src/endpoints/`.
2. Add any shared types to `packages/protocol`.
3. Call it through `useKdbConnection` or `useKdbLiveQuery`.
4. Render the result with a new dashboard panel or extract a reusable visualization into `packages/finance-ui`.
