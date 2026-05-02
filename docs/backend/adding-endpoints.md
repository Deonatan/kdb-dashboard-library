# Adding Backend Endpoints

## Quick pattern

Every endpoint lives in its own file under `backend/q/endpoints/`. The boot loader scans that folder and loads every `.q` file automatically.

Use this structure:

```q
\d .kdbdash.endpoint

myEndpoint:{[req]
  args:.kdbdash.util.getArgs req;
  / return any JSON-serializable q object here
  `status`payload!("ok"; args)
 }

\d .

.kdbdash.registry.register[`myEndpoint;.kdbdash.endpoint.myEndpoint];
```

## What the endpoint receives

Each endpoint gets the full parsed request object. A common payload shape is:

```json
{
  "id": "req-7",
  "func": "myEndpoint",
  "args": {
    "symbol": "MSFT"
  }
}
```

Use `.kdbdash.util.getArgs req` to read the first matching payload key from:

- `args`
- `payload`
- `params`

## What the endpoint should return

Return q data that `.j.j` can serialize cleanly, for example:

- dictionaries
- lists
- tables
- scalars

The router wraps your return value in the shared response envelope automatically, so endpoints only need to return their domain data.

## Failure behavior

If an endpoint throws, the router catches the error and returns:

- `ok: false`
- `error.code: "endpoint_error"`
- `error.message: "Endpoint execution failed"`
- `error.details`: the q error text
