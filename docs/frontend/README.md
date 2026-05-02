# Frontend starter

This package lives in `frontend/` and is designed to plug into a larger monorepo without requiring root workspace files. It provides a React + TypeScript starter for a kdb websocket backend, plus a finance-focused dashboard shell and reusable chart components.

## Run locally

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Default websocket target:

```env
VITE_KDB_WS_URL=ws://localhost:5000
```

If the backend is not running yet, set `VITE_KDB_MOCK_MODE=true` to keep the UI usable with seeded market data.

## Expected websocket contract

Frontend requests:

```json
{
  "type": "request",
  "requestId": "uuid",
  "func": "dashboard.load",
  "args": {
    "symbol": "AAPL"
  }
}
```

Backend responses:

```json
{
  "type": "response",
  "requestId": "uuid",
  "ok": true,
  "data": {
    "snapshot": {},
    "intraday": [],
    "candles": [],
    "exposures": [],
    "orderBook": [],
    "trades": []
  }
}
```

Optional backend push events:

```json
{
  "type": "event",
  "topic": "orders.updated",
  "data": {}
}
```

## Starter surface

- `src/lib/websocket/KdbSocketClient.ts`: reconnecting websocket client with request correlation and timeouts.
- `src/context/KdbProvider.tsx`: React context that exposes connection state plus `sendRequest`.
- `src/api/dashboard.ts`: typed frontend wrappers for kdb function names such as `dashboard.load`.
- `src/features/dashboard/Dashboard.tsx`: Bloomberg-inspired starter dashboard with reusable chart blocks.

## Adding frontend features

1. Add a new backend function name in `src/api/`.
2. Call it through `sendRequest` or `useKdbRequest`.
3. Render the result with a new feature component under `src/features/` or a reusable visualization under `src/components/charts/`.
