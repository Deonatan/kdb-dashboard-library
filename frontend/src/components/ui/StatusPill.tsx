interface StatusPillProps {
  label: string;
  tone?: "negative" | "neutral" | "positive" | "warning";
}

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return <span className={`status-pill status-pill--${tone}`}>{label}</span>;
}
