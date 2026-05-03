type PackageCard = {
  body: string
  bullets: string[]
  path: string
  title: string
}

type LinkCard = {
  links: Array<{ href: string; label: string }>
  title: string
}

type StepCard = {
  body: string
  snippet: string
  title: string
}

const repoUrl = 'https://github.com/Deonatan/kdb-dashboard-library'

const packageCards: PackageCard[] = [
  {
    title: 'apps/q-gateway',
    path: 'apps/q-gateway',
    body: 'q websocket service that loads endpoint files, parses JSON requests, routes by function name, and can push stream updates.',
    bullets: [
      'Runtime entry point: `src/main.q`',
      'Core modules: `src/core/*.q`',
      'Extension surface: `src/endpoints/*.q`',
    ],
  },
  {
    title: 'packages/react-client',
    path: 'packages/react-client',
    body: 'React connection layer for websocket lifecycle, request correlation, request hooks, and stream subscriptions.',
    bullets: [
      '`KdbProvider` and `KdbWebSocketClient`',
      '`useKdbConnection`, `useKdbRequest`, `useKdbLiveQuery`',
      '`useKdbStream` for pushed updates',
    ],
  },
  {
    title: 'packages/protocol',
    path: 'packages/protocol',
    body: 'Shared request and response types plus demo fixtures used by the dashboard and docs examples.',
    bullets: [
      'Request and response envelope types',
      'Dashboard snapshot fixtures',
      'Stream payload fixtures',
    ],
  },
  {
    title: 'packages/finance-ui',
    path: 'packages/finance-ui',
    body: 'Reusable dashboard components and theme styles for dense numeric layouts, charts, and tables.',
    bullets: [
      'Metric, panel, and status primitives',
      'Chart and table components',
      'Shared theme variables and typography',
    ],
  },
]

const setupSteps: StepCard[] = [
  {
    title: '1. Install workspace dependencies',
    body: 'Install the frontend workspace packages with pnpm before running any app.',
    snippet: 'pnpm install',
  },
  {
    title: '2. Start the q gateway',
    body: 'The startup script resolves `q`, configures `QHOME` and `QLIC`, and launches the websocket gateway.',
    snippet: 'pnpm dev:gateway',
  },
  {
    title: '3. Start a frontend surface',
    body: 'Run the example dashboard or this docs app locally against the same workspace packages.',
    snippet: 'pnpm dev:dashboard\npnpm dev:docs',
  },
]

const utilityGroups = [
  {
    title: 'Backend utilities',
    items: [
      '`.kdb.registry.register` registers one public function name from an endpoint file.',
      '`.kdb.util.getOr` reads optional request params safely.',
      '`.kdb.response.ok` and `.kdb.response.fail` keep the response envelope consistent.',
      '`.kdb.router.handle` is the main JSON request entry point.',
    ],
  },
  {
    title: 'Frontend utilities',
    items: [
      '`KdbProvider` owns the websocket connection lifecycle.',
      '`useKdbRequest` sends one-off requests and returns the typed response.',
      '`useKdbLiveQuery` handles request state for query-style panels.',
      '`useKdbStream` subscribes to pushed stream updates such as `stream.tape`.',
    ],
  },
  {
    title: 'Operations',
    items: [
      '`pnpm q:doctor` checks q discovery and license state.',
      '`pnpm test:q` runs the q smoke test.',
      '`VITE_KDB_WS_URL` points the dashboard to another websocket server.',
      '`DOCS_BASE_PATH` builds this site under a repository subpath.',
    ],
  },
]

const referenceCards: LinkCard[] = [
  {
    title: 'Core docs',
    links: [
      { label: 'Getting Started', href: `${repoUrl}/blob/main/docs/getting-started.md` },
      { label: 'Architecture', href: `${repoUrl}/blob/main/docs/architecture.md` },
      { label: 'Backend Architecture', href: `${repoUrl}/blob/main/docs/backend/architecture.md` },
      { label: 'Request / Response Contracts', href: `${repoUrl}/blob/main/docs/request-response-contracts.md` },
    ],
  },
  {
    title: 'Backend guides',
    links: [
      { label: 'Adding Backend Endpoints', href: `${repoUrl}/blob/main/docs/backend/adding-endpoints.md` },
      { label: 'Endpoint Pattern', href: `${repoUrl}/blob/main/docs/endpoint-pattern.md` },
      { label: 'Use Cases', href: `${repoUrl}/blob/main/docs/use-cases.md` },
      { label: 'Roadmap', href: `${repoUrl}/blob/main/docs/roadmap.md` },
    ],
  },
  {
    title: 'Repository',
    links: [
      { label: 'Source Repository', href: repoUrl },
      { label: 'Dashboard Notes', href: `${repoUrl}/blob/main/docs/frontend/README.md` },
      { label: 'Docs App README', href: `${repoUrl}/blob/main/apps/docs-site/README.md` },
      { label: 'Contributing', href: `${repoUrl}/blob/main/CONTRIBUTING.md` },
    ],
  },
]

const endpointExample = `.kdb.registry.register[
  \`desk.snapshot;
  {[params]
    desk:.kdb.util.getOr[params; \`desk; "macro"];
    asOf:string .z.p;
    \`desk\`status\`asOf!(desk; "ok"; asOf)
  };
  \`name\`description\`group!(
    "desk.snapshot";
    "Returns a desk status payload.";
    "desk"
  )
];`

const reactExample = `const { status } = useKdbConnection()

const snapshot = useKdbLiveQuery(
  'desk.snapshot',
  { desk: 'macro' },
  { enabled: status === 'open' },
)`

const requestExample = `{
  "id": "req-20260503-001",
  "func": "dashboard.snapshot",
  "params": {
    "book": "macro"
  }
}`

const responseExample = `{
  "id": "req-20260503-001",
  "ok": true,
  "func": "dashboard.snapshot",
  "data": {
    "overview": [],
    "allocation": [],
    "priceSeries": [],
    "volumeSeries": [],
    "movers": []
  },
  "server": "kdb-dashboard-library",
  "ts": "2026.05.03D01:58:00.000000000"
}`

const operationsExample = `pnpm q:doctor
pnpm test:q
pnpm build:docs

DOCS_BASE_PATH=/kdb-dashboard-library/ pnpm build:docs`

export default function App() {
  return (
    <div className="docs-site">
      <div className="docs-site__glow docs-site__glow--left" />
      <div className="docs-site__glow docs-site__glow--right" />

      <header className="topbar">
        <a className="brand" href="#overview">
          <span className="brand__led" />
          <span>kdb-dashboard-library</span>
        </a>
        <nav className="topbar__nav">
          <a href="#overview">Overview</a>
          <a href="#setup">Setup</a>
          <a href="#contract">Contract</a>
          <a href="#endpoint-pattern">Endpoint Pattern</a>
          <a href="#runtime-packages">Runtime Packages</a>
          <a href="#operations">Operations</a>
        </nav>
      </header>

      <main className="page-shell" id="top">
        <section className="hero" id="overview">
          <div className="hero__copy">
            <p className="eyebrow">Overview</p>
            <h1>Utilities for q-backed React dashboards.</h1>
            <p className="hero__body">
              This repo contains a q websocket gateway, a React client layer,
              shared protocol types, and dashboard UI primitives. The main
              workflow is: start the gateway, add an endpoint file, then
              consume that endpoint from React.
            </p>
            <ul className="hero-list">
              <li>Backend runtime in pure q.</li>
              <li>JSON request and response envelopes over WebSocket.</li>
              <li>Endpoint files under `apps/q-gateway/src/endpoints`.</li>
              <li>React hooks for requests, live queries, and streams.</li>
            </ul>
            <div className="hero__actions">
              <a className="button button--primary" href="#setup">
                Open setup
              </a>
              <a className="button button--secondary" href="#endpoint-pattern">
                View endpoint pattern
              </a>
            </div>
            <div className="hero__badges">
              <span className="badge">q gateway</span>
              <span className="badge">React client</span>
              <span className="badge">Shared protocol</span>
              <span className="badge">Static docs</span>
            </div>
          </div>

          <div className="hero__panel">
            <div className="terminal-card">
              <div className="terminal-card__header">
                <span>start-here</span>
                <span>local workflow</span>
              </div>
              <div className="terminal-card__body">
                <div className="metric-strip">
                  <Metric label="Backend" value="q" />
                  <Metric label="Transport" value="WebSocket" />
                  <Metric label="Client" value="React hooks" />
                </div>
                <div className="signal-grid">
                  <Signal title="Run">`pnpm dev:gateway`</Signal>
                  <Signal title="Extend">Add one file under `src/endpoints`.</Signal>
                  <Signal title="Consume">Use `useKdbLiveQuery` or `useKdbStream`.</Signal>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="setup">
          <SectionHeading
            eyebrow="Setup"
            title="Local setup and first run"
            body="Start with the standard workspace install, then run the q gateway and a frontend surface."
          />
          <div className="workflow-grid">
            {setupSteps.map((item) => (
              <article className="workflow-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <pre>
                  <code>{item.snippet}</code>
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="contract">
          <SectionHeading
            eyebrow="Contract"
            title="Request and response shape"
            body="The transport contract is intentionally small: each request sends `id`, `func`, and optional `params`, and each response returns the same `id` with either `data` or `error`."
          />
          <div className="code-grid">
            <CodeSurface title="Request example" code={requestExample} />
            <CodeSurface title="Success response example" code={responseExample} />
          </div>
        </section>

        <section className="section" id="endpoint-pattern">
          <SectionHeading
            eyebrow="Endpoint pattern"
            title="Add one q endpoint file"
            body="Endpoints are normal `.q` files loaded at startup. Each file usually registers one public function name and returns a q value that serializes cleanly to JSON."
          />
          <div className="section--split">
            <article className="surface-card">
              <h3>Handler conventions</h3>
              <ul className="tick-list">
                <li>Create the file under `apps/q-gateway/src/endpoints`.</li>
                <li>Accept parsed `params` in the handler function.</li>
                <li>Use helpers such as `.kdb.util.getOr` for optional inputs.</li>
                <li>Return a q dictionary, list, or table that `.j.j` can serialize.</li>
                <li>Register `name`, `description`, and `group` metadata.</li>
              </ul>
            </article>
            <CodeSurface title="Endpoint example" code={endpointExample} />
          </div>
        </section>

        <section className="section" id="runtime-packages">
          <SectionHeading
            eyebrow="Runtime packages"
            title="What each package does"
            body="The repo is split between the q runtime app, the example dashboard, and the reusable frontend packages."
          />
          <div className="feature-grid">
            {packageCards.map((card) => (
              <article className="surface-card" key={card.title}>
                <h3>{card.title}</h3>
                <p className="card-path">{card.path}</p>
                <p>{card.body}</p>
                <ul className="tick-list">
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="Utilities"
            title="Common utilities and touchpoints"
            body="These are the backend functions, frontend hooks, and operational commands most teams reuse first."
          />
          <div className="utility-grid">
            {utilityGroups.map((group) => (
              <article className="utility-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul className="utility-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="React usage"
            title="Consume an endpoint from React"
            body="The shared client packages handle connection state, request IDs, response envelopes, and stream subscriptions."
          />
          <div className="section--split">
            <CodeSurface title="React query example" code={reactExample} />
            <article className="surface-card">
              <h3>When to use which hook</h3>
              <ul className="tick-list">
                <li>Use `useKdbRequest` for explicit button-driven requests.</li>
                <li>Use `useKdbLiveQuery` for query-style panels that refresh from the gateway.</li>
                <li>Use `useKdbStream` for server-pushed updates such as `stream.tape`.</li>
                <li>Use `useKdbConnection` when the UI needs websocket status or the raw client instance.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section" id="operations">
          <SectionHeading
            eyebrow="Operations"
            title="Diagnostics, build, and reference links"
            body="These commands and links cover q runtime discovery, smoke testing, docs builds, and the deeper markdown docs in the repository."
          />
          <div className="section--split">
            <CodeSurface title="Common commands" code={operationsExample} />
            <div className="utility-grid utility-grid--stack">
              {referenceCards.map((card) => (
                <article className="utility-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <ul className="link-list">
                    {card.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function SectionHeading({
  body,
  eyebrow,
  title,
}: {
  body: string
  eyebrow: string
  title: string
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-chip">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Signal({
  children,
  title,
}: {
  children: string
  title: string
}) {
  return (
    <div className="signal-card">
      <span>{title}</span>
      <p>{children}</p>
    </div>
  )
}

function CodeSurface({ code, title }: { code: string; title: string }) {
  return (
    <article className="code-surface">
      <div className="code-surface__header">
        <span>{title}</span>
        <span>docs</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </article>
  )
}
