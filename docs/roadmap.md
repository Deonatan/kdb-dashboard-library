# Roadmap

This roadmap outlines the intended evolution of `kdb-dashboard-library` from starter scaffold to open-source-ready framework.

## Phase 1: Foundation

- Define the repo structure across `backend/`, `frontend/`, and `docs/`
- Implement the `q` WebSocket gateway
- Establish the request / response contract
- Add a function registry and dispatcher pattern
- Create the React WebSocket client layer
- Provide a finance-oriented baseline theme

## Phase 2: Reference Features

- Add a `healthCheck` endpoint
- Add a ranked movers endpoint
- Add a blotter-style trades endpoint
- Add a PnL time series endpoint
- Add reusable frontend components for tables, KPIs, rankings, and charts

## Phase 3: Developer Experience

- Add utility helpers for common q parsing and serialization cases
- Add mock data flows so frontend work can continue without a live backend
- Add smoke tests for request / response behavior
- Add example environment configuration
- Add local startup scripts or task runners

## Phase 4: Production Hardening

- Add structured error handling
- Add authentication or session-aware connection hooks
- Add reconnect and heartbeat behavior
- Add request timeout handling
- Add logging and observability guidance

## Phase 5: Open Source Readiness

- Expand contributor documentation
- Add example dashboards and screenshots
- Add release and versioning guidance
- Add CI checks for docs and frontend/backend test suites
- Publish a stable first public milestone

## Near-Term Priorities

The highest-value next steps are:

1. scaffold the backend folder with a minimal working WebSocket server
2. scaffold the frontend with a connection status view and one sample dashboard
3. implement `healthCheck` and one finance data endpoint end-to-end
4. validate the JSON contract with live browser-to-q messaging

## Non-Goals For The Earliest Version

To keep the first version focused, the project does not need all of these immediately:

- full authentication and authorization
- highly abstract plugin systems
- every chart type under the sun
- exhaustive deployment tooling

The first win is a clean, understandable React-to-kdb bridge that teams can run and extend quickly.
