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
  "requestId": "unique-client-request-id",
  "func": "publicFunctionName",
  "params": {},
  "meta": {}
}
```

## Request Fields

| Field | Required | Type | Purpose |
| --- | --- | --- | --- |
| `requestId` | Yes | `string` | Client-generated correlation ID |
| `func` | Yes | `string` | Public endpoint name registered in the backend |
| `params` | Yes | `object` | Function-specific parameters |
| `meta` | No | `object` | Optional caller metadata |

## Base Response Envelope

Every response should follow this shape:

```json
{
  "requestId": "unique-client-request-id",
  "status": "ok",
  "func": "publicFunctionName",
  "data": {},
  "error": null
}
```

## Response Fields

| Field | Required | Type | Purpose |
| --- | --- | --- | --- |
| `requestId` | Yes | `string` | Echoes the request correlation ID |
| `status` | Yes | `string` | `ok` or `error` |
| `func` | Yes | `string` | Echoes the requested function |
| `data` | Yes | `object` or `null` | Success payload |
| `error` | Yes | `object` or `null` | Error payload |

## Example: Health Check

### Request

```json
{
  "requestId": "health-001",
  "func": "healthCheck",
  "params": {}
}
```

### Success Response

```json
{
  "requestId": "health-001",
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

## Example: Ranked Table Data

### Request

```json
{
  "requestId": "movers-001",
  "func": "getTopMovers",
  "params": {
    "date": "2026-05-03",
    "limit": 10,
    "universe": "EQUITIES_US"
  }
}
```

### Success Response

```json
{
  "requestId": "movers-001",
  "status": "ok",
  "func": "getTopMovers",
  "data": {
    "rows": [
      { "sym": "AAPL", "movePct": 1.82, "volume": 50213421 },
      { "sym": "MSFT", "movePct": 1.37, "volume": 29011420 }
    ],
    "asOf": "2026-05-03T09:30:00.000Z"
  },
  "error": null
}
```

## Example: Time Series Data

### Request

```json
{
  "requestId": "pnl-001",
  "func": "getPnLSeries",
  "params": {
    "book": "EQD_APAC",
    "start": "2026-05-01T00:00:00.000Z",
    "end": "2026-05-03T23:59:59.999Z",
    "interval": "15m"
  }
}
```

### Success Response

```json
{
  "requestId": "pnl-001",
  "status": "ok",
  "func": "getPnLSeries",
  "data": {
    "series": [
      { "ts": "2026-05-03T09:00:00.000Z", "pnl": 124500.12 },
      { "ts": "2026-05-03T09:15:00.000Z", "pnl": 125920.47 }
    ],
    "currency": "USD"
  },
  "error": null
}
```

## Example: Error Response

### Unknown Function

```json
{
  "requestId": "bad-001",
  "status": "error",
  "func": "getSecretSauce",
  "data": null,
  "error": {
    "code": "UNKNOWN_FUNCTION",
    "message": "No endpoint registered for getSecretSauce",
    "details": {
      "availableFunctions": ["healthCheck", "getTrades", "getTopMovers", "getPnLSeries"]
    }
  }
}
```

### Validation Failure

```json
{
  "requestId": "bad-002",
  "status": "error",
  "func": "getPnLSeries",
  "data": null,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "start must be before end",
    "details": {
      "start": "2026-05-04T00:00:00.000Z",
      "end": "2026-05-03T00:00:00.000Z"
    }
  }
}
```

## Contract Rules

- `requestId` must always be echoed back.
- `func` should match a registered public endpoint name.
- `status` should be either `ok` or `error`.
- `data` should be `null` on errors.
- `error` should be `null` on success.
- Timestamps should use ISO 8601 strings when serialized to JSON.
- Tables should usually be represented as arrays of row objects for frontend convenience.

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
