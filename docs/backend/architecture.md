# Backend Architecture

## Overview

The backend starter is organized as a small q application with four layers:

1. `backend/start.q` boots the backend from the monorepo root.
2. `backend/q/src/bootstrap.q` loads shared modules, loads endpoint files, and binds WebSocket callbacks.
3. `backend/q/src/*.q` contains reusable infrastructure for request parsing, routing, endpoint registration, and response shaping.
4. `backend/q/endpoints/*.q` contains user-defined business functions that are exposed over the socket.

## Request lifecycle

1. The q process starts with a listening port, for example `q backend/start.q -p 5050`.
2. The frontend opens a WebSocket to that port.
3. The socket payload is passed to `.z.ws`, which delegates to `.kdbdash.ws.onMessage`.
4. `.kdbdash.router.handle` parses the JSON payload and validates the request object.
5. The router looks up the endpoint registered under the request's `func` value.
6. The endpoint function executes and returns q data.
7. `.kdbdash.response.success` or `.kdbdash.response.error` wraps the result in a stable envelope.
8. The response is serialized back to JSON with `.j.j` and sent to the same socket handle.

## Endpoint pattern

Endpoint files should stay small and only contain business logic plus one registration line. That keeps the shared plumbing in `src/` and makes future open-source contributions easier to review.

Suggested pattern:

```q
\d .kdbdash.endpoint

myEndpoint:{[req]
  args:.kdbdash.util.getArgs req;
  / business logic here
 }

\d .

.kdbdash.registry.register[`myEndpoint;.kdbdash.endpoint.myEndpoint];
```

## Integration notes

- Loader paths are root-relative today so the service boots cleanly inside a larger monorepo.
- The endpoint loader uses `find` to auto-load every `.q` file in `backend/q/endpoints/`.
- The current request helper checks `args`, `payload`, then `params`, so frontend and backend teams can evolve the request body shape with a small compatibility buffer.
- Because q is not installed in this workspace, this scaffold is designed for clean structure and likely-correct q syntax, but it still needs a real `q` runtime smoke test before release.
