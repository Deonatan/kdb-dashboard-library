import type { ReactNode } from "react";

interface SectionCardProps {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title: string;
}

export function SectionCard({ action, children, className, eyebrow, title }: SectionCardProps) {
  return (
    <section className={`section-card ${className ?? ""}`.trim()}>
      <header className="section-card__header">
        <div>
          {eyebrow ? <p className="section-card__eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {action ? <div className="section-card__action">{action}</div> : null}
      </header>
      <div className="section-card__body">{children}</div>
    </section>
  );
}
