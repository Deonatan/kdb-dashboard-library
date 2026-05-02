interface MetricCardProps {
  label: string;
  tone?: "negative" | "neutral" | "positive";
  value: string;
}

export function MetricCard({ label, tone = "neutral", value }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
    </article>
  );
}
