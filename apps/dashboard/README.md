# Dashboard App

This is the runnable starter dashboard for `kdb-dashboard-library`.

It uses:

- `packages/react-client` for connection state and request hooks
- `packages/protocol` for shared request/response types
- `packages/finance-ui` for the finance-oriented theme and visual primitives

## Local development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app connects to `ws://localhost:5050` by default.

If the q gateway is not running yet, the app still renders against the demo snapshot from `packages/protocol`.

## Main files

- `src/main.tsx`: wraps the app in `KdbProvider`
- `src/App.tsx`: starter dashboard shell and request workbench
- `src/App.css`: local layout and control styling
- `vite.config.ts`: aliases the shared workspace packages during development

More detail lives in [docs/frontend/README.md](../../docs/frontend/README.md).
