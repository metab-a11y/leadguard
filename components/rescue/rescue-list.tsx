"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { RescueCandidate } from "@/lib/ai/ranking";
import { createFollowUpAction } from "@/lib/actions/followups";
import { markHandledAction } from "@/lib/actions/rescue";
import { formatDate, toDateTimeLocal } from "@/lib/utils/dates";
import { StatusBadge } from "@/components/ui";

export function RescueList({ candidates }: { candidates: RescueCandidate[] }) {
  const router = useRouter();
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  function run(key: string, action: () => Promise<{ ok: boolean; error?: string }>) {
    setPending(key);
    setError("");
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error || "We couldn't save that change.");
      setPending("");
      router.refresh();
    });
  }

  function scheduleTomorrow(candidate: RescueCandidate) {
    const date = new Date(Date.now() + 86_400_000);
    date.setHours(9, 0, 0, 0);
    const data = new FormData();
    data.set("due_date", toDateTimeLocal(date));
    data.set("responsible_person", candidate.lead.assigned_to || "Sarah Lee");
    data.set("recommended_action", candidate.recommendedAction);
    data.set("priority", candidate.priority === "High" ? "Urgent" : "Important");
    return createFollowUpAction(candidate.lead.id, data);
  }

  return (
    <div className="rescue-grid">
      {error && <p className="form-error full-span" role="alert">{error}</p>}
      {candidates.map((candidate) => {
        const key = `${candidate.priority}-${candidate.lead.id}`;
        return (
          <article className={`rescue-card rescue-${candidate.priority.toLowerCase()}`} key={key}>
            <div className="rescue-card-top"><StatusBadge value={candidate.priority} /><span>{candidate.lead.source}</span></div>
            <h2>{candidate.lead.customer_name}</h2><p className="rescue-company">{candidate.lead.company || candidate.lead.product_service}</p>
            <dl className="rescue-facts"><div><dt>Status</dt><dd>{candidate.lead.status}</dd></div><div><dt>Last contact</dt><dd>{formatDate(candidate.lead.last_contact)}</dd></div></dl>
            <div className="rescue-explanation"><small>Why this appears</small><p>{candidate.reason}</p></div>
            <div className="rescue-recommendation"><small>Recommended next step</small><p>{candidate.recommendedAction}</p></div>
            <div className="rescue-actions"><Link className="button secondary small" href={`/leads/${candidate.lead.id}`}>View lead</Link><button className="button secondary small" disabled={pending === key} onClick={() => run(key, () => scheduleTomorrow(candidate))}>Set tomorrow</button><button className="button primary small" disabled={pending === key} onClick={() => run(key, () => markHandledAction(candidate.lead.id, candidate.followUp?.id))}>{pending === key ? "Saving…" : "Mark handled"}</button></div>
          </article>
        );
      })}
    </div>
  );
}

