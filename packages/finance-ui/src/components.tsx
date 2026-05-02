import type {
  AllocationSlice,
  DashboardMetric,
  MoverRow,
  PricePoint,
  VolumePoint,
} from '@kdb-dashboard-library/protocol'
import type { ReactNode } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type BadgeTone = 'accent' | 'negative' | 'neutral' | 'positive' | 'warning'

export function TerminalShell({
  children,
  eyebrow,
  heading,
  status,
}: {
  children: ReactNode
  eyebrow: string
  heading: string
  status?: ReactNode
}) {
  return (
    <div className="finance-shell">
      <div className="terminal-shell">
        <header className="terminal-shell__header">
          <div>
            <p className="terminal-shell__eyebrow">{eyebrow}</p>
            <h1 className="terminal-shell__heading">{heading}</h1>
          </div>
          <div className="terminal-shell__status">{status}</div>
        </header>
        <div className="terminal-shell__body">{children}</div>
      </div>
    </div>
  )
}

export function StatusBadge({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: BadgeTone
}) {
  return (
    <span className={`status-badge status-badge--${tone}`}>{label}</span>
  )
}

export function Panel({
  action,
  children,
  eyebrow,
  title,
}: {
  action?: ReactNode
  children: ReactNode
  eyebrow?: string
  title: string
}) {
  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          {eyebrow ? <p className="panel__eyebrow">{eyebrow}</p> : null}
          <h2 className="panel__title">{title}</h2>
        </div>
        {action ? <div className="panel__action">{action}</div> : null}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  )
}

export function MetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <article
          className={`metric-card metric-card--${metric.tone}`}
          key={metric.label}
        >
          <p className="metric-card__label">{metric.label}</p>
          <strong className="metric-card__value">{metric.value}</strong>
        </article>
      ))}
    </div>
  )
}

export function PriceLineChart({
  data,
  label = 'Price',
}: {
  data: PricePoint[]
  label?: string
}) {
  return (
    <div className="chart-surface">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#ffb000" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#ffb000" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="ts" stroke="#6d7a84" tickLine={false} />
          <YAxis
            domain={['auto', 'auto']}
            stroke="#6d7a84"
            tickFormatter={(value) => `${value.toFixed(2)}`}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${asNumber(value).toFixed(2)}`, label]}
          />
          <Area
            dataKey="px"
            fill="url(#priceGradient)"
            stroke="#ffb000"
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function VolumeBarChart({ data }: { data: VolumePoint[] }) {
  return (
    <div className="chart-surface">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="bucket" stroke="#6d7a84" tickLine={false} />
          <YAxis stroke="#6d7a84" tickLine={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${asNumber(value).toFixed(1)}M`, 'Volume']}
          />
          <Bar dataKey="volume" fill="#2ce6b8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AllocationDonut({ data }: { data: AllocationSlice[] }) {
  const palette = ['#ffb000', '#ff7a00', '#2ce6b8', '#44b7ff']

  return (
    <div className="allocation-layout">
      <div className="chart-surface chart-surface--compact">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell fill={palette[index % palette.length]} key={entry.bucket} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${asNumber(value)}%`, 'Allocation']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="allocation-list">
        {data.map((slice, index) => (
          <div className="allocation-row" key={slice.bucket}>
            <span className="allocation-row__label">
              <span
                className="allocation-row__swatch"
                style={{ backgroundColor: palette[index % palette.length] }}
              />
              {slice.bucket}
            </span>
            <strong>{slice.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MoversTable({ rows }: { rows: MoverRow[] }) {
  return (
    <div className="table-shell">
      <table className="movers-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last</th>
            <th>Change</th>
            <th>%</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const positive = row.change >= 0

            return (
              <tr key={row.symbol}>
                <td>{row.symbol}</td>
                <td>{row.last.toFixed(2)}</td>
                <td className={positive ? 'positive' : 'negative'}>
                  {formatSigned(row.change)}
                </td>
                <td className={positive ? 'positive' : 'negative'}>
                  {formatSigned(row.pct)}%
                </td>
                <td>{row.volume.toFixed(1)}M</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const formatSigned = (value: number) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}`

const asNumber = (value: unknown) =>
  typeof value === 'number' ? value : Number(value ?? 0)

const tooltipStyle = {
  background: '#081015',
  border: '1px solid #263039',
  borderRadius: 12,
  color: '#f3f0d8',
}
