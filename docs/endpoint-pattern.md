# Endpoint Extension Pattern

This document explains the intended extension model for backend functions exposed to the React frontend.

The main goal is to make adding a new endpoint feel routine rather than architectural.

## Core Rule

A new user-facing function should usually require only:

1. one new file under `backend/endpoints/`
2. one registry entry
3. optional shared utility updates if the new data shape needs reusable parsing or serialization logic

The WebSocket transport layer should not need to change for each new endpoint.

## Recommended Backend Shape

```text
backend/
├── router/
│   ├── websocket.q
│   ├── dispatcher.q
│   └── registry.q
├── endpoints/
│   ├── health_check.q
│   ├── top_movers.q
│   └── pnl_series.q
└── utils/
    ├── parse.q
    ├── response.q
    └── tables.q
```

## Dispatch Model

The dispatcher should:

- parse the raw JSON payload
- validate required fields
- look up `func` in a registry
- call the registered handler with parsed `params`
- wrap the result in a standard response envelope

Illustrative direction:

```q
/ backend/router/dispatcher.q
.router.dispatch:{
  req:.utils.parse.request x;
  func:req`func;
  handler:.router.getHandler func;
  data:handler req`params;
  .utils.response.ok[req`requestId;func;data]
 }
```

## Registry Pattern

Prefer an explicit registry over evaluating arbitrary strings.

```q
/ backend/router/registry.q
.router.handlers:`healthCheck`getTopMovers`getPnLSeries!
  (.api.healthCheck;.api.getTopMovers;.api.getPnLSeries);

.router.getHandler:{
  func:x;
  if[not func in key .router.handlers;
    '"Unknown function: ", string func
  ];
  .router.handlers func
 }
```

Benefits:

- known supported surface area
- easier validation
- safer than evaluating arbitrary function names
- simpler documentation for consumers

## Handler Conventions

Each endpoint file should expose one main handler in the `.api` namespace.

Recommended conventions:

- accept one `params` object
- default missing inputs explicitly
- reuse shared type coercion utilities
- return q data structures that are JSON-safe or easy to serialize

Example:

```q
/ backend/endpoints/top_movers.q
.api.getTopMovers:{
  params:x;
  dt:.utils.parse.dateOrDefault[params;`date;.z.D];
  limit:.utils.parse.longOrDefault[params;`limit;10];
  universe:.utils.parse.symbolOrDefault[params;`universe;`ALL];

  rows:select sym, lastPx, movePct, volume
    from .data.marketSnapshot
    where date=dt, universe=universe;

  `rows`asOf!(limit#rows;.z.P)
 }
```

## Shared Utility Opportunities

Good utility candidates:

- `dateOrDefault`
- `timestampOrDefault`
- `symbolOrDefault`
- `longOrDefault`
- `boolOrDefault`
- `tableToRows`
- `ok` and `error` response builders

Utilities are especially helpful in `q` because they reduce repetitive guard code and keep endpoint handlers short.

## Frontend Pairing Pattern

For each backend endpoint, the frontend should usually have:

1. a small service wrapper
2. optional hook or feature-level request helper
3. a presentational component that accepts already-shaped data

Example shape:

```ts
// frontend/src/services/kdbClient.ts
client.call("getTopMovers", {
  date: "2026-05-03",
  limit: 10,
  universe: "EQUITIES_US",
});
```

## Endpoint Categories To Expect

Useful categories for finance dashboards:

- health / diagnostics
- ranked snapshots
- blotter tables
- historical time series
- drill-down detail panels
- parameterized analytics

## Example End-To-End Contract

### Request

```json
{
  "requestId": "req-top-movers-01",
  "func": "getTopMovers",
  "params": {
    "date": "2026-05-03",
    "limit": 5,
    "universe": "EQUITIES_US"
  }
}
```

### Response

```json
{
  "requestId": "req-top-movers-01",
  "status": "ok",
  "func": "getTopMovers",
  "data": {
    "rows": [
      { "sym": "NVDA", "lastPx": 1093.4, "movePct": 2.7, "volume": 51230000 },
      { "sym": "AMD", "lastPx": 176.8, "movePct": 1.9, "volume": 32040000 }
    ],
    "asOf": "2026-05-03T13:30:00.000Z"
  },
  "error": null
}
```

## What To Avoid

- putting business logic directly inside the WebSocket callback
- using one giant q file for every handler
- returning inconsistent response shapes across endpoints
- making frontend components aware of raw socket event details
- duplicating parse and null-handling logic across handlers

## Related Docs

- [Architecture](architecture.md)
- [Getting Started](getting-started.md)
- [Request / Response Contracts](request-response-contracts.md)
