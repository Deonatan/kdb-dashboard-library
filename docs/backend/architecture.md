# Backend Architecture

## Overview

The backend starter is organized as a small q application with four layers:

1. `apps/q-gateway/src/main.q` boots the gateway.
2. `apps/q-gateway/src/load.q` loads shared modules.
3. `apps/q-gateway/src/core/*.q` contains reusable infrastructure for request parsing, routing, endpoint registration, and response shaping.
4. `apps/q-gateway/src/endpoints/*.q` contains user-defined business functions that are exposed over the socket.

## Request lifecycle

1. The q process starts with a listening port, for example `q apps/q-gateway/src/main.q -port 5050`.
2. The frontend opens a WebSocket to that port.
3. The socket payload is passed to `.z.ws`, which delegates to `.kdb.ws.onMessage`.
4. `.kdb.router.handle` parses the JSON payload and validates the request object.
5. The router looks up the endpoint registered under the request's `func` value.
6. The endpoint function executes and returns q data.
7. `.kdb.response.ok` or `.kdb.response.fail` wraps the result in a stable envelope.
8. The response is serialized back to JSON with `.j.j` and sent to the same socket handle.

## Endpoint pattern

Endpoint files should stay small and only contain business logic plus one registration line. That keeps the shared plumbing in `src/` and makes future open-source contributions easier to review.

Suggested pattern:

```q
.kdb.registry.register[
  `my.endpoint;
  {[params]
    / business logic here
  };
  `name`description`group!(
    "my.endpoint";
    "Short explanation.";
    "custom"
  )
];
```

## Integration notes

- The gateway is designed to be started from `apps/q-gateway/` through the provided shell script.
- The endpoint loader scans `apps/q-gateway/src/endpoints/` and auto-loads every `.q` file.
- The current request helper expects `id`, `func`, and `params`.
- Because q is not installed in this workspace, this scaffold is designed for clean structure and likely-correct q syntax, but it still needs a real `q` runtime smoke test before release.
