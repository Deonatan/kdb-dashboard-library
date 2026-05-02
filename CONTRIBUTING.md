# Contributing

Thanks for helping build `kdb-dashboard-library`.

This project is intended to become a clean open-source starter kit for connecting `kdb+/q` to React dashboards. Contributions should preserve that goal: practical, readable, and easy for finance teams to extend.

## What Good Contributions Look Like

- Small, focused changes with clear intent
- A strong separation between transport, endpoint logic, and shared utilities
- Predictable JSON contracts between backend and frontend
- Docs updated alongside behavior changes
- Examples that help users extend the library without guessing

## Repository Expectations

The repository is expected to evolve around this shape:

```text
backend/   # q WebSocket server, router, endpoints, shared utils
frontend/  # React client, hooks, services, dashboard components, theme
docs/      # Architecture, setup, contracts, roadmap
```

Please avoid mixing concerns unnecessarily. For example:

- add new `q` business functions under `backend/endpoints/`
- keep common parsers and coercion helpers under `backend/utils/`
- keep WebSocket connection logic in frontend services or hooks rather than inside visualization components

## Developer Workflow

1. Create or update the backend endpoint you need.
2. Register it through the backend function registry.
3. Add or update the frontend request wrapper.
4. Connect the result to a presentational component.
5. Update the relevant docs if the contract or extension pattern changes.

## Commit Guidance

Use small incremental commits with descriptive messages.

Good examples:

- `docs: add request-response contract guide`
- `backend: add registry-based websocket dispatcher`
- `frontend: scaffold websocket client hook`

Try to avoid bundling unrelated backend, frontend, and docs changes into a single commit unless they form one tightly coupled feature.

## Pull Request Expectations

Every pull request should explain:

- what problem it solves
- what folders it touches
- how the behavior was validated
- whether JSON contracts changed
- whether docs were updated

Use the pull request template in [`.github/pull_request_template.md`](.github/pull_request_template.md).

## Backend Contribution Notes

When adding backend endpoints:

- prefer one public handler per file
- keep the WebSocket gateway thin
- return normalized result shapes
- handle parse errors and unknown functions consistently
- reuse utility functions for type coercion, null handling, and table-to-JSON shaping

If an endpoint needs special transformation logic for nested data, add that to reusable utils when it is broadly useful.

## Frontend Contribution Notes

When adding frontend features:

- treat the WebSocket client as shared infrastructure
- keep request state and presentation concerns separated
- design components so they can render mock data as well as live data
- preserve the finance-focused visual direction unless there is a deliberate design update

The default look should feel comfortable to users familiar with terminal-style finance tools: dense, legible, and high contrast.

## Documentation Standards

If your change affects setup, architecture, contracts, or extension flow, update the corresponding file in `docs/`.

Priority docs:

- `README.md`
- `docs/architecture.md`
- `docs/backend/architecture.md`
- `docs/getting-started.md`
- `docs/endpoint-pattern.md`
- `docs/request-response-contracts.md`

## Reporting Bugs Or Requesting Features

Use the templates under `.github/ISSUE_TEMPLATE/` so maintainers can reproduce issues and evaluate roadmap ideas quickly.

## Questions To Ask Before Opening A PR

- Does this make it easier to connect React to `kdb`?
- Does it keep endpoint authoring straightforward?
- Will a finance user understand how to extend this without reading the whole codebase?
- Did I document any new contract or workflow?

If the answer is yes, you are probably on the right track.
