# Docs Site

This app is a deployable static documentation site for `kdb-dashboard-library`, focused on setup, contract, package responsibilities, and operational commands.

## Run locally

```bash
pnpm dev:docs
```

## Build static assets

```bash
pnpm build:docs
```

The final static output is written to `apps/docs-site/dist/`.

## Deploy under a subpath

If you deploy under a repository path such as GitHub Pages, set:

```bash
DOCS_BASE_PATH=/kdb-dashboard-library/ pnpm build:docs
```
