import type { ReactNode } from "react";

export function StatusBadge({ value }: { value?: string | null }) {
  const slug = (value ?? "unknown").toLowerCase().replace(/[^a-z]+/g, "-");
  return <span className={`badge badge-${slug}`}>{value ?? "Not set"}</span>;
}

export function PageHeader({ eyebrow, title, description, action }: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}</div>
      {action}
    </header>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return <div className="empty-state"><span aria-hidden="true">◎</span><h2>{title}</h2><p>{message}</p>{action}</div>;
}

