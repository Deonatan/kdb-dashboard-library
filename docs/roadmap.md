# Roadmap

This roadmap outlines the intended evolution of `kdb-dashboard-library` from starter scaffold to open-source-ready framework.

## Phase 1: Foundation

- Define the repo structure across `apps/`, `packages/`, and `docs/`
- Implement the `q` WebSocket gateway
- Establish the request / response contract
- Add a function registry and dispatcher pattern
- Create the reusable React WebSocket client layer
- Provide a finance-oriented baseline theme

## Phase 2: Reference Features

- Expand `health.check`, `debug.echo`, and `dashboard.snapshot`
- Add a ranked movers endpoint with live table data
- Add a blotter-style trades endpoint
- Add a richer time-series endpoint
- Add reusable frontend components for tables, KPIs, rankings, and charts

## Phase 3: Developer Experience

- Add utility helpers for common q parsing and serialization cases
- Add example dashboards beyond the starter screen
- Add q runtime smoke tests and better frontend package coverage
- Add example environment configuration
- Add local startup scripts or task runners

## Phase 4: Production Hardening

- Add structured error handling
- Add authentication or session-aware connection hooks
- Add richer reconnect and heartbeat behavior
- Add request timeout handling
- Add logging and observability guidance

## Phase 5: Open Source Readiness

- Expand contributor documentation
- Add example dashboards and screenshots
- Add release and versioning guidance for workspace packages
- Add CI checks for docs and frontend/backend test suites
- Publish a stable first public milestone

## Near-Term Priorities

The highest-value next steps are:

1. validate the q gateway with a real local runtime
2. expand the sample endpoint set beyond `dashboard.snapshot`
3. add tests around the shared React packages
4. publish the first reusable package surfaces from `packages/*`

## Non-Goals For The Earliest Version

To keep the first version focused, the project does not need all of these immediately:

- full authentication and authorization
- highly abstract plugin systems
- every chart type under the sun
- exhaustive deployment tooling

The first win is a clean, understandable React-to-kdb bridge that teams can run and extend quickly.
