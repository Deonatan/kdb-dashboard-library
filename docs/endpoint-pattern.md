# Endpoint Extension Pattern

This document explains the intended extension model for backend functions exposed to the React frontend.

The main goal is to make adding a new endpoint feel routine rather than architectural.

## Core Rule

A new user-facing function should usually require only:

1. one new file under `apps/q-gateway/src/endpoints/`
2. one registry entry
3. optional shared utility updates if the new data shape needs reusable parsing or serialization logic

The WebSocket transport layer should not need to change for each new endpoint.

## Recommended Backend Shape

```text
apps/q-gateway/
├── src/
│   ├── core/
│   ├── endpoints/
│   └── utils/
└── tests/
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
/ apps/q-gateway/src/core/router.q
.kdb.router.route:{
  payload:x;
  funcText:.kdb.router.requestFunc payload;
  fn:.kdb.registry.get `$ funcText;
  data:fn .kdb.router.requestParams payload;
  .kdb.response.ok[.kdb.router.requestId payload; funcText; data]
 }
```

## Registry Pattern

Prefer an explicit registry over evaluating arbitrary strings.

Endpoint files register themselves through `.kdb.registry.register`, which keeps startup simple and the callable surface explicit.

Benefits:

- known supported surface area
- easier validation
- safer than evaluating arbitrary function names
- simpler documentation for consumers

## Handler Conventions

Each endpoint file should expose one main handler.

Recommended conventions:

- accept one `params` object
- default missing inputs explicitly
- reuse shared type coercion utilities
- return q data structures that are JSON-safe or easy to serialize

Example:

```q
/ apps/q-gateway/src/endpoints/top_movers.q
.kdb.registry.register[
  `top.movers;
  {[params]
    limit:.kdb.util.getOr[params; `limit; 10];
    `rows`asOf!(
      limit#([] sym:`AAPL`MSFT`NVDA; lastPx:194.22 421.14 957.61; movePct:0.74 -0.14 0.30; volume:12.3 9.8 15.6);
      string .z.p
    )
  };
  `name`description`group!(
    "top.movers";
    "Illustrative ranked table endpoint.";
    "dashboard"
  )
];
```

## Shared Utility Opportunities

Good utility candidates:

- safe dictionary field reads
- symbol coercion
- request parsing helpers
- `ok` and `fail` response builders

Utilities are especially helpful in `q` because they reduce repetitive guard code and keep endpoint handlers short.

## Frontend Pairing Pattern

For each backend endpoint, the frontend should usually have:

1. a small service wrapper or hook
2. optional shared types in `packages/protocol`
3. a presentational component that accepts already-shaped data

Example shape:

```ts
// apps/dashboard/src/App.tsx
await request("top.movers", {
  limit: 10,
})
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
  "id": "req-top-movers-01",
  "func": "top.movers",
  "params": {
    "limit": 5
  }
}
```

### Response

```json
{
  "id": "req-top-movers-01",
  "ok": true,
  "func": "top.movers",
  "data": {
    "rows": [
      { "sym": "NVDA", "lastPx": 1093.4, "movePct": 2.7, "volume": 51230000 },
      { "sym": "AMD", "lastPx": 176.8, "movePct": 1.9, "volume": 32040000 }
    ],
    "asOf": "2026.05.03D13:30:00.000000000"
  }
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
