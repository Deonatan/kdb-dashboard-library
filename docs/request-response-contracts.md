# Request / Response Contracts

This document defines the recommended JSON contract between the React frontend and the `q` backend.

The contract is intentionally small so that:

- endpoint authors can add new functions quickly
- frontend consumers can rely on a stable shape
- debugging over WebSocket stays straightforward

## Base Request Envelope

Every request should follow this shape:

```json
{
  "id": "unique-client-request-id",
  "func": "publicFunctionName",
  "params": {}
}
```

## Request Fields

| Field | Required | Type | Purpose |
| --- | --- | --- | --- |
| `id` | Yes | `string` | Client-generated correlation ID |
| `func` | Yes | `string` | Public endpoint name registered in the backend |
| `params` | Yes | `object` | Function-specific parameters |

## Base Response Envelope

Every response should follow this shape:

```json
{
  "id": "unique-client-request-id",
  "ok": true,
  "func": "publicFunctionName",
  "data": {},
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D00:00:00.000000000"
}
```

## Response Fields

| Field | Required | Type | Purpose |
| --- | --- | --- | --- |
| `id` | Yes | `string` | Echoes the request correlation ID |
| `ok` | Yes | `boolean` | `true` on success, `false` on failure |
| `func` | Yes | `string` | Echoes the requested function |
| `data` | Yes | `object` | Success payload |
| `error` | No | `object` | Error payload when `ok` is `false` |
| `server` | Yes | `string` | Service name |
| `ts` | Yes | `string` | Backend timestamp string |

## Example: Health Check

### Request

```json
{
  "id": "health-001",
  "func": "health.check",
  "params": {}
}
```

### Success Response

```json
{
  "id": "health-001",
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

## Example: Ranked Table Data

### Request

```json
{
  "id": "movers-001",
  "func": "top.movers",
  "params": {
    "limit": 10
  }
}
```

### Success Response

```json
{
  "id": "movers-001",
  "ok": true,
  "func": "top.movers",
  "data": {
    "rows": [
      { "sym": "AAPL", "movePct": 1.82, "volume": 50213421 },
      { "sym": "MSFT", "movePct": 1.37, "volume": 29011420 }
    ],
    "asOf": "2026.05.03D09:30:00.000000000"
  },
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D09:30:00.000000000"
}
```

## Example: Dashboard Snapshot

### Request

```json
{
  "id": "snapshot-001",
  "func": "dashboard.snapshot",
  "params": {
    "book": "EQD_APAC"
  }
}
```

### Success Response

```json
{
  "id": "snapshot-001",
  "ok": true,
  "func": "dashboard.snapshot",
  "data": {
    "overview": [],
    "allocation": [],
    "priceSeries": [],
    "volumeSeries": [],
    "movers": []
  },
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D09:00:00.000000000"
}
```

## Example: Error Response

### Unknown Function

```json
{
  "id": "bad-001",
  "ok": false,
  "func": "getSecretSauce",
  "error": {
    "code": "unknownFunction",
    "message": "No endpoint is registered for the requested func",
    "details": {}
  },
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D09:00:00.000000000"
}
```

### Runtime Failure

```json
{
  "id": "bad-002",
  "ok": false,
  "func": "dashboard.snapshot",
  "error": {
    "code": "runtime",
    "message": "Endpoint execution failed",
    "details": {
      "reason": "example backend exception text"
    }
  },
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D09:00:00.000000000"
}
```

## Contract Rules

- `id` must always be echoed back.
- `func` should match a registered public endpoint name.
- `ok` should be `true` or `false`.
- `data` should be omitted or ignored on errors.
- `error` should be omitted or ignored on success.
- timestamps should be serialized consistently
- tables should usually be represented as arrays of row objects for frontend convenience

## Notes On q Type Handling

When shaping `q` results for JSON:

- convert temporal values to a consistent string format
- avoid leaking raw q-specific types that the browser cannot interpret cleanly
- normalize tables into frontend-friendly row arrays
- keep field names explicit and stable

## Future Extensions

The base contract is enough for request/response workflows today. Future versions may add:

- subscription or streaming event envelopes
- pagination metadata
- server timing metadata
- warning arrays for partial results

Those should extend the envelope carefully rather than replacing it.
