# Backend Starter

This backend starter provides a pure kdb/q service for `kdb-dashboard-library`. It exposes a WebSocket handler, accepts JSON requests from the frontend, routes them by `func`, and returns JSON responses in a consistent envelope.

## Folder layout

```text
backend/
├── start.q                 # Entry point for the q process
└── q/
    ├── endpoints/          # Add new endpoint files here
    │   ├── echo.q
    │   └── health.q
    └── src/
        ├── bootstrap.q
        ├── config.q
        ├── registry.q
        ├── router.q
        ├── websocket.q
        └── utils/
            ├── base.q
            ├── request.q
            └── response.q
```

## Start the service

Run from the repository root so the q loader paths resolve correctly.

```bash
q backend/start.q -p 5050
```

The q process listens on the port you pass with `-p`. Once the process is listening and `.z.ws` is bound, frontend clients can open a WebSocket connection to that port.

## Request contract

Send JSON with a `func` field and optional request metadata.

```json
{
  "id": "req-1",
  "func": "echo",
  "args": {
    "symbol": "AAPL"
  }
}
```

The router:

- Parses JSON with `.j.k`
- Validates that the request is a JSON object
- Resolves `func` through the registry
- Invokes the registered q function with the full request object
- Returns a JSON response using `.j.j`

## Response shape

Successful responses:

```json
{
  "ok": true,
  "id": "req-1",
  "func": "echo",
  "data": {
    "args": {
      "symbol": "AAPL"
    },
    "receivedAt": "2026.05.03D01:23:45.678901234"
  },
  "meta": {
    "timestamp": "2026.05.03D01:23:45.678901234",
    "service": "kdb-dashboard-library"
  }
}
```

Errored responses:

```json
{
  "ok": false,
  "id": "req-1",
  "func": "missingEndpoint",
  "error": {
    "code": "unknown_func",
    "message": "No endpoint is registered for the requested func",
    "details": "missingEndpoint"
  },
  "meta": {
    "timestamp": "2026.05.03D01:23:45.678901234",
    "service": "kdb-dashboard-library"
  }
}
```

## Add a new endpoint

1. Add a new `.q` file under `backend/q/endpoints/`.
2. Define a function under `.kdbdash.endpoint`.
3. Register it with `.kdbdash.registry.register`.

Example:

```q
\d .kdbdash.endpoint

positions:{[req]
  args:.kdbdash.util.getArgs req;
  `status`positions!("ok"; enlist args)
 }

\d .

.kdbdash.registry.register[`positions;.kdbdash.endpoint.positions];
```

Any `.q` file in `backend/q/endpoints/` is auto-loaded during boot.
