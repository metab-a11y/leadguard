"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { PriorityItem } from "@/lib/ai/ranking";
import { completeFollowUpAction } from "@/lib/actions/followups";
import { updateLeadStatusAction } from "@/lib/actions/leads";
import { markHandledAction } from "@/lib/actions/rescue";
import { StatusBadge } from "@/components/ui";

export function PriorityList({ items }: { items: PriorityItem[] }) {
  const router = useRouter();
  const [pendingKey, setPendingKey] = useState("");
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  function act(item: PriorityItem) {
    setPendingKey(item.key);
    setError("");
    startTransition(async () => {
      const result = item.actionLabel === "Respond"
        ? await updateLeadStatusAction(item.lead.id, "Contacted")
        : item.followUp
          ? await completeFollowUpAction(item.followUp.id, item.lead.id)
          : await markHandledAction(item.lead.id);
      if (!result.ok) setError(result.error);
      setPendingKey("");
      router.refresh();
    });
  }

  if (!items.length) return <div className="caught-up"><span aria-hidden="true">✓</span><div><h3>You&apos;re caught up.</h3><p>No urgent lead actions right now.</p></div></div>;
  return (
    <div className="priority-list">
      {error && <p className="form-error" role="alert">{error}</p>}
      {items.map((item, index) => (
        <article className="priority-row" key={item.key}>
          <span className="priority-rank">{String(index + 1).padStart(2, "0")}</span>
          <div className="priority-person"><Link href={`/leads/${item.lead.id}`}>{item.lead.customer_name}</Link><p>{item.lead.company || item.lead.product_service}</p></div>
          <div className="priority-reason"><strong>{item.reason}</strong><p>{item.recommendedAction}</p></div>
          <StatusBadge value={item.lead.priority} />
          <div className="priority-actions"><Link className="button secondary small" href={`/leads/${item.lead.id}`}>View lead</Link><button className="button primary small" disabled={pendingKey === item.key} onClick={() => act(item)}>{pendingKey === item.key ? "Saving…" : item.actionLabel}</button></div>
        </article>
      ))}
    </div>
  );
}

