type FeatureCard = {
  body: string
  bullets: string[]
  title: string
}

type UseCaseCard = {
  outcome: string
  title: string
  utility: string
}

const featureCards: FeatureCard[] = [
  {
    title: 'Pure q gateway',
    body: 'Keep transport and business logic close to your kdb estate instead of adding a second backend stack.',
    bullets: [
      'WebSocket request handling in q',
      'Registry-based endpoint dispatch',
      'JSON request and response envelopes',
    ],
  },
  {
    title: 'Reusable parsing utilities',
    body: 'Shared helpers absorb repetitive coercion, defaulting, and response shaping so endpoint authors stay focused.',
    bullets: [
      'Consistent JSON parsing helpers',
      'Response envelope builders',
      'Convenient params access patterns',
    ],
  },
  {
    title: 'React transport layer',
    body: 'A reconnecting client and live-query hooks remove most of the frontend socket boilerplate.',
    bullets: [
      'Request correlation by ID',
      'Connection state for the UI',
      'Live query patterns for dashboards',
    ],
  },
  {
    title: 'Finance-ready UI baseline',
    body: 'The starter visual language feels familiar to trading and analytics users while staying editable in normal React and CSS.',
    bullets: [
      'Terminal-inspired dark theme',
      'KPI, chart, and table primitives',
      'Compact layouts for dense numeric views',
    ],
  },
]

const utilityGroups = [
  {
    eyebrow: 'Backend utilities',
    title: 'What q developers reuse',
    items: [
      '`Kdb gateway core`: `.kdb.boot`, `.kdb.ws`, and `.kdb.router`',
      '`apps/q-gateway/src/core/router.q` for request decoding and dispatch',
      '`apps/q-gateway/src/core/response.q` for standardized success and error envelopes',
      '`apps/q-gateway/src/utils/*.q` for parsing, data shaping, and defaults',
      '`apps/q-gateway/src/endpoints/` as the drop-in extension surface',
    ],
  },
  {
    eyebrow: 'Frontend utilities',
    title: 'What React developers reuse',
    items: [
      '`KdbProvider` and `KdbWebSocketClient` for connection lifecycle',
      '`packages/react-client` for socket lifecycle and request helpers',
      '`useKdbConnection`, `useKdbRequest`, and `useKdbLiveQuery` for request flows',
      '`packages/finance-ui` for finance-oriented layout and chart styling',
      'Shared request and response types through `packages/protocol`',
    ],
  },
  {
    eyebrow: 'Team utilities',
    title: 'What delivery teams get immediately',
    items: [
      'A starter dashboard to prove the contract quickly',
      'A monorepo that separates runtime apps from reusable packages',
      'A docs and use-case baseline for open-source readiness',
      'A static docs site that can be hosted independently from the app',
    ],
  },
]

const referenceCards = [
  {
    title: 'Reference docs',
    bullets: [
      'Request and response contract examples',
      'Endpoint registration pattern',
      'Architecture and backend notes',
    ],
  },
  {
    title: 'Important scripts',
    bullets: [
      '`pnpm dev:gateway` to run the q gateway',
      '`pnpm dev:dashboard` to run the example dashboard',
      '`pnpm dev:docs` and `pnpm build:docs` for this static site',
    ],
  },
  {
    title: 'Environment and runtime',
    bullets: [
      '`Q_BIN`, `QHOME`, and `QLIC` for q runtime setup',
      '`VITE_KDB_WS_URL` for frontend socket targeting',
      '`DOCS_BASE_PATH` for static hosting under a subpath',
    ],
  },
]

const workflowSteps = [
  {
    step: '1. Start the gateway',
    detail: 'Run q with the provided startup script so the library can accept JSON over WebSocket.',
    snippet: 'pnpm dev:gateway',
  },
  {
    step: '2. Add an endpoint file',
    detail: 'Drop one q file into the endpoint folder and register a public function name.',
    snippet: `.kdb.registry.register[\n  \`desk.snapshot;\n  {[params]\n    desk:.kdb.util.getOr[params; \`desk; "macro"];\n    \`desk\`status!(desk; "ok")\n  };\n  \`name\`description\`group!(\n    "desk.snapshot";\n    "Example desk snapshot endpoint.";\n    "desk"\n  )\n];`,
  },
  {
    step: '3. Consume it in React',
    detail: 'Call the endpoint through the shared client and bind the result to a dashboard panel.',
    snippet: `const snapshot = useKdbLiveQuery(\n  'desk.snapshot',\n  { desk: 'macro' },\n  { enabled: status === 'open' },\n)`,
  },
]

const useCases: UseCaseCard[] = [
  {
    title: 'Intraday desk risk cockpit',
    utility: 'PnL, exposure, concentration, and movers in one screen',
    outcome: 'Best first deployment for a team with existing kdb analytics.',
  },
  {
    title: 'Execution quality monitor',
    utility: 'Venue mix, slippage, latency, and outlier fills',
    outcome: 'Pairs well with event-heavy intraday q aggregations.',
  },
  {
    title: 'Liquidity and inventory board',
    utility: 'Inventory buckets, turnover, stale positions, and concentration',
    outcome: 'Useful for market-making, treasury, and fixed-income desks.',
  },
  {
    title: 'Market data health console',
    utility: 'Feed freshness, anomalies, and symbol-level support views',
    outcome: 'Shows that the same contract supports ops and business dashboards.',
  },
]

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

const deployExample = `pnpm dev:docs
pnpm build:docs
pnpm preview:docs

# if you deploy under a repo subpath
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
          <a href="#utilities">Utilities</a>
          <a href="#features">Features</a>
          <a href="#how-to-use">How to use</a>
          <a href="#reference">Reference</a>
        </nav>
      </header>

      <main className="page-shell" id="top">
        <section className="hero" id="overview">
          <div className="hero__copy">
            <p className="eyebrow">Static documentation site</p>
            <h1>
              A clean React front end for <span>q-powered dashboards</span>.
            </h1>
            <p className="hero__body">
              `kdb-dashboard-library` gives teams a practical bridge between
              `kdb+/q` and React: a pure q gateway, a reusable client layer,
              finance-friendly UI primitives, and a simple endpoint extension
              model that keeps domain logic where it belongs.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#how-to-use">
                Start with the workflow
              </a>
              <a className="button button--secondary" href="#utilities">
                Explore utilities
              </a>
            </div>
            <div className="hero__badges">
              <span className="badge">Pure q backend</span>
              <span className="badge">JSON over WebSocket</span>
              <span className="badge">React workspace packages</span>
              <span className="badge">Static docs build</span>
            </div>
          </div>

          <div className="hero__panel">
            <div className="terminal-card">
              <div className="terminal-card__header">
                <span>starter-status</span>
                <span>docs surface</span>
              </div>
              <div className="terminal-card__body">
                <div className="metric-strip">
                  <Metric label="Gateway" value="q runtime" />
                  <Metric label="Client" value="live queries" />
                  <Metric label="UI" value="finance-ready" />
                </div>
                <div className="signal-grid">
                  <Signal title="Backend">
                    registry dispatch, JSON parsing, reusable helpers
                  </Signal>
                  <Signal title="Frontend">
                    reconnecting socket, typed envelopes, dense dashboards
                  </Signal>
                  <Signal title="Docs">
                    static build, feature map, deploy notes
                  </Signal>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <SectionHeading
            eyebrow="Feature surface"
            title="What the library gives you immediately"
            body="This repo is most useful when you want a reusable dashboard foundation rather than a one-off demo."
          />
          <div className="feature-grid">
            {featureCards.map((card) => (
              <article className="surface-card" key={card.title}>
                <h3>{card.title}</h3>
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

        <section className="section" id="utilities">
          <SectionHeading
            eyebrow="Utilities"
            title="The reusable pieces teams actually build on"
            body="The point of the library is not just transport. It is to reduce repeated setup across q, React, and delivery workflows."
          />
          <div className="utility-grid">
            {utilityGroups.map((group) => (
              <article className="utility-card" key={group.title}>
                <p className="eyebrow">{group.eyebrow}</p>
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
            eyebrow="Contract"
            title="The payload shape stays boring on purpose"
            body="The JSON envelope is intentionally small and predictable so teams can extend endpoints without rethinking the transport every time."
          />
          <div className="code-grid">
            <CodeSurface title="Request" code={requestExample} />
            <CodeSurface title="Response" code={responseExample} />
          </div>
        </section>

        <section className="section" id="how-to-use">
          <SectionHeading
            eyebrow="How to use"
            title="A practical path from starter kit to real desk workflow"
            body="The normal flow is: start the gateway, add one endpoint file, then consume it from React through the shared client."
          />
          <div className="workflow-grid">
            {workflowSteps.map((item) => (
              <article className="workflow-card" key={item.step}>
                <h3>{item.step}</h3>
                <p>{item.detail}</p>
                <pre>
                  <code>{item.snippet}</code>
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="reference">
          <SectionHeading
            eyebrow="Reference"
            title="The important reference surface in one place"
            body="Use the deeper markdown docs for contracts and architecture, but keep these runtime and package touchpoints close when onboarding new contributors."
          />
          <div className="utility-grid">
            {referenceCards.map((card) => (
              <article className="utility-card" key={card.title}>
                <h3>{card.title}</h3>
                <ul className="utility-list">
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
            eyebrow="Use cases"
            title="Where this library fits especially well"
            body="The strongest first deployment is an intraday desk risk cockpit, but the same pattern extends to execution, inventory, and surveillance dashboards."
          />
          <div className="use-case-grid">
            {useCases.map((card) => (
              <article className="surface-card surface-card--accent" key={card.title}>
                <h3>{card.title}</h3>
                <p className="use-case-card__utility">{card.utility}</p>
                <p>{card.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--split" id="deploy">
          <div>
            <SectionHeading
              eyebrow="Deploy"
              title="This documentation page ships as a static Vite app"
              body="Build output lands in `apps/docs-site/dist/`, so you can host it on GitHub Pages, Netlify, Vercel static hosting, S3, or any CDN-backed web server."
            />
            <ul className="tick-list">
              <li>Run the site locally with `pnpm dev:docs`.</li>
              <li>Build static assets with `pnpm build:docs`.</li>
              <li>Preview the built output with `pnpm preview:docs`.</li>
              <li>Set `DOCS_BASE_PATH` when hosting under a repository subpath.</li>
            </ul>
          </div>
          <CodeSurface title="Static deploy commands" code={deployExample} />
        </section>

        <section className="section section--cta">
          <div className="cta-card">
            <p className="eyebrow">Next move</p>
            <h2>Replace the demo snapshot with one real desk endpoint.</h2>
            <p>
              That is usually the fastest way to prove the contract, the
              visuals, and the extension pattern with stakeholders.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="https://github.com/Deonatan/kdb-dashboard-library">
                Open the repository
              </a>
              <a
                className="button button--secondary"
                href="https://github.com/Deonatan/kdb-dashboard-library/blob/main/docs/use-cases.md"
              >
                Read detailed use cases
              </a>
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
