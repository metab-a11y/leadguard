"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFollowUpAction, completeFollowUpAction } from "@/lib/actions/followups";
import { updateLeadStatusAction } from "@/lib/actions/leads";
import { addNoteAction } from "@/lib/actions/notes";
import { LEAD_STATUSES, PRIORITIES, type FollowUp, type Lead } from "@/lib/types";
import { formatDateTime, toDateTimeLocal } from "@/lib/utils/dates";
import { StatusBadge } from "@/components/ui";

type Panel = "note" | "followup" | "status" | null;

export function LeadActions({ lead, followUps }: { lead: Lead; followUps: FollowUp[] }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const tomorrow = new Date(Date.now() + 86_400_000);

  function execute(action: () => Promise<{ ok: boolean; error?: string }>, close = true) {
    setError("");
    startTransition(async () => {
      const result = await action();
      if (!result.ok) return setError(result.error || "We couldn't save that change.");
      if (close) setPanel(null);
      router.refresh();
    });
  }

  function submit(event: FormEvent<HTMLFormElement>, kind: Exclude<Panel, null>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (kind === "followup") {
      const localDueDate = String(formData.get("due_date") ?? "");
      if (localDueDate) formData.set("due_date", new Date(localDueDate).toISOString());
    }
    if (kind === "note") execute(() => addNoteAction(lead.id, formData));
    if (kind === "followup") execute(() => createFollowUpAction(lead.id, formData));
    if (kind === "status") execute(() => updateLeadStatusAction(lead.id, String(formData.get("status"))));
  }

  return (
    <>
      <div className="quick-actions" aria-label="Lead actions">
        {lead.phone && <a className="quick-action" href={`tel:${lead.phone}`}><span aria-hidden="true">☎</span>Call</a>}
        {lead.phone && <a className="quick-action" href={`sms:${lead.phone}`}><span aria-hidden="true">✉</span>Message</a>}
        {lead.email && <a className="quick-action" href={`mailto:${lead.email}`}><span aria-hidden="true">@</span>Email</a>}
        <button className="quick-action" onClick={() => setPanel("note")}><span aria-hidden="true">＋</span>Add note</button>
        <button className="quick-action emphasis" onClick={() => setPanel("followup")}><span aria-hidden="true">◷</span>Set follow-up</button>
        <button className="quick-action" onClick={() => setPanel("status")}><span aria-hidden="true">↻</span>Update status</button>
      </div>
      {panel && (
        <section className="inline-panel" aria-live="polite">
          <div className="inline-panel-header"><h2>{panel === "note" ? "Add a note" : panel === "followup" ? "Set the next follow-up" : "Update lead status"}</h2><button className="icon-button" onClick={() => setPanel(null)} aria-label="Close">×</button></div>
          <form onSubmit={(event) => submit(event, panel)} className="form-grid compact">
            {panel === "note" && <label className="full-width"><span>Note</span><textarea name="note" rows={3} autoFocus required placeholder="Record the customer outcome or next step…" /></label>}
            {panel === "followup" && <>
              <label><span>Date and time</span><input type="datetime-local" name="due_date" required defaultValue={toDateTimeLocal(tomorrow)} /></label>
              <label><span>Responsible person</span><input name="responsible_person" defaultValue={lead.assigned_to ?? "Sarah Lee"} /></label>
              <label className="full-width"><span>Recommended action</span><input name="recommended_action" required defaultValue="Contact the customer and agree the next step" /></label>
              <label><span>Priority</span><select name="priority" defaultValue={lead.priority}>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
              <label><span>Notes</span><input name="notes" placeholder="Optional context" /></label>
            </>}
            {panel === "status" && <label className="full-width"><span>Status</span><select name="status" defaultValue={lead.status}>{LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>}
            {error && <p className="form-error full-width" role="alert">{error}</p>}
            <div className="form-actions full-width"><button type="button" className="button secondary" onClick={() => setPanel(null)}>Cancel</button><button className="button primary" disabled={isPending}>{isPending ? "Saving…" : "Save change"}</button></div>
          </form>
        </section>
      )}
      <section className="detail-card followup-card">
        <div className="section-heading"><div><p className="eyebrow">Next steps</p><h2>Follow-ups</h2></div><button className="button secondary small" onClick={() => setPanel("followup")}>+ Schedule</button></div>
        {!followUps.length ? <p className="quiet-state">You&apos;re caught up. No follow-ups scheduled.</p> : (
          <div className="followup-list">{followUps.map((item) => <article key={item.id} className="followup-item"><div><StatusBadge value={item.computed_status} /><h3>{item.recommended_action || "Contact the customer"}</h3><p>{formatDateTime(item.due_date)} · {item.responsible_person || "Unassigned"}</p>{item.notes && <small>{item.notes}</small>}</div>{item.computed_status !== "Completed" && <button className="button secondary small" disabled={isPending} onClick={() => execute(() => completeFollowUpAction(item.id, lead.id), false)}>Mark done</button>}</article>)}</div>
        )}
      </section>
    </>
  );
}
