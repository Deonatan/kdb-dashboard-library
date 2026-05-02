# q Gateway

The q gateway is the kdb+/q side of `kdb-dashboard-library`.

It starts a WebSocket listener, accepts JSON requests shaped like:

```json
{
  "id": "req-001",
  "func": "dashboard.snapshot",
  "params": {
    "book": "macro"
  }
}
```

Endpoint files live in [`src/endpoints`](./src/endpoints). To add a new callable endpoint, create a new `.q` file and register it through `.kdb.registry.register`.

Run locally from the repo root with:

```bash
pnpm dev:gateway
```

The repo will auto-discover `q` from `Q_BIN`, `PATH`, `~/.kx/bin/q`, and common `~/q/*/q` install locations.
If you need to inspect the selected runtime or license state, run:

```bash
pnpm q:doctor
```

Or directly inside this folder:

```bash
q src/main.q -port 5050
```
