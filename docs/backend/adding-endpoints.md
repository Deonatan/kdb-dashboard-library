# Adding Backend Endpoints

## Quick pattern

Every endpoint lives in its own file under `apps/q-gateway/src/endpoints/`. The boot loader scans that folder and loads every `.q` file automatically.

Use this structure:

```q
.kdb.registry.register[
  `my.endpoint;
  {[params]
    / return any JSON-serializable q object here
    `status`payload!("ok"; params)
  };
  `name`description`group!(
    "my.endpoint";
    "Short explanation.";
    "custom"
  )
];
```

## What the endpoint receives

Each endpoint gets the parsed `params` dictionary. A common request shape is:

```json
{
  "id": "req-7",
  "func": "my.endpoint",
  "params": {
    "symbol": "MSFT"
  }
}
```

Use `.kdb.util.getOr[params; \`symbol; "AAPL"]` or other shared helpers to read fields safely.

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
- `error.code: "runtime"`
- `error.message`: the q error text
- `error.details`: an empty object unless you add more structure
