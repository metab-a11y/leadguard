"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { createLeadAction, updateLeadStatusAction } from "@/lib/actions/leads";
import { LEAD_SOURCES, LEAD_STATUSES, PRIORITIES, type Lead } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils/dates";
import { EmptyState, StatusBadge } from "@/components/ui";

function LeadCard({ lead, draggable = false }: { lead: Lead; draggable?: boolean }) {
  return (
    <article
      className="lead-card"
      draggable={draggable}
      onDragStart={(event) => event.dataTransfer.setData("text/lead-id", lead.id)}
    >
      <div className="lead-card-top">
        <div><Link href={`/leads/${lead.id}`} className="lead-name">{lead.customer_name}</Link><p>{lead.company || "Independent enquiry"}</p></div>
        <StatusBadge value={lead.priority} />
      </div>
      <p className="lead-summary">{lead.summary || "No enquiry summary recorded."}</p>
      <dl className="lead-meta">
        <div><dt>Source</dt><dd>{lead.source}</dd></div>
        <div><dt>Service</dt><dd>{lead.product_service || "Not set"}</dd></div>
        <div><dt>Assigned</dt><dd>{lead.assigned_to || "Unassigned"}</dd></div>
        <div><dt>Next follow-up</dt><dd>{formatDateTime(lead.next_follow_up)}</dd></div>
      </dl>
      <div className="lead-card-footer">
        <StatusBadge value={lead.status} />
        <Link className="text-link" href={`/leads/${lead.id}`}>View lead <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

function AddLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  if (!open) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    startTransition(async () => {
      const result = await createLeadAction(new FormData(form));
      if (!result.ok) return setError(result.error);
      onClose();
      router.push(`/leads/${result.id}`);
      router.refresh();
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="add-lead-title">
        <div className="modal-header"><div><p className="eyebrow">New enquiry</p><h2 id="add-lead-title">Add a lead</h2></div><button className="icon-button" onClick={onClose} aria-label="Close">×</button></div>
        <form onSubmit={submit} className="form-grid">
          <label><span>Customer name</span><input name="customer_name" autoFocus placeholder="e.g. Alex Tan" /></label>
          <label><span>Company</span><input name="company" placeholder="e.g. Northstar Services" /></label>
          <label><span>Phone</span><input name="phone" type="tel" placeholder="+65 9000 0000" /></label>
          <label><span>Email</span><input name="email" type="email" placeholder="alex@example.com" /></label>
          <label><span>Source</span><select name="source" defaultValue="Manual Entry">{LEAD_SOURCES.map((source) => <option key={source}>{source}</option>)}</select></label>
          <label><span>Priority</span><select name="priority">{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
          <label><span>Product or service</span><input name="product_service" placeholder="Website Revamp" /></label>
          <label><span>Assigned to</span><input name="assigned_to" placeholder="Team member" /></label>
          <label className="full-width"><span>Enquiry summary</span><textarea name="summary" required rows={3} placeholder="What does the customer need?" /></label>
          <label><span>Estimated value</span><input name="value" type="number" min="0" step="0.01" placeholder="0" /></label>
          {error && <p className="form-error full-width" role="alert">{error}</p>}
          <div className="form-actions full-width"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={isPending}>{isPending ? "Adding…" : "Add lead"}</button></div>
        </form>
      </section>
    </div>
  );
}

export function LeadExperience({ leads }: { leads: Lead[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [dropError, setDropError] = useState("");
  const view = params.get("view") === "pipeline" ? "pipeline" : "list";
  const grouped = useMemo(() => Object.fromEntries(LEAD_STATUSES.map((status) => [status, leads.filter((lead) => lead.status === status)])), [leads]);

  function setView(nextView: string) {
    const next = new URLSearchParams(params.toString());
    next.set("view", nextView);
    router.push(`/leads?${next.toString()}`);
  }

  function moveLead(event: React.DragEvent, status: string) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/lead-id");
    if (!id) return;
    setDropError("");
    startTransition(async () => {
      const result = await updateLeadStatusAction(id, status);
      if (!result.ok) setDropError(result.error);
      router.refresh();
    });
  }

  return (
    <>
      <div className="lead-toolbar">
        <form className="filters" action="/leads">
          <input type="hidden" name="view" value={view} />
          <label className="search-field"><span className="sr-only">Search leads</span><span aria-hidden="true">⌕</span><input name="q" defaultValue={params.get("q") ?? ""} placeholder="Search name, company, email…" /></label>
          <select name="status" defaultValue={params.get("status") ?? ""} aria-label="Filter by status"><option value="">All statuses</option>{LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
          <select name="source" defaultValue={params.get("source") ?? ""} aria-label="Filter by source"><option value="">All sources</option>{LEAD_SOURCES.map((source) => <option key={source}>{source}</option>)}</select>
          <button className="button secondary">Apply</button>
        </form>
        <div className="view-actions"><div className="segmented" aria-label="Lead view"><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button><button className={view === "pipeline" ? "active" : ""} onClick={() => setView("pipeline")}>Pipeline</button></div><button className="button primary" onClick={() => setModalOpen(true)}>+ Add lead</button></div>
      </div>
      {dropError && <p className="form-error" role="alert">{dropError}</p>}
      {isPending && <p className="update-note" role="status">Updating pipeline…</p>}
      {!leads.length ? (
        <EmptyState title="No enquiries yet" message="New enquiries will appear here when they arrive." action={<button className="button primary" onClick={() => setModalOpen(true)}>Add lead</button>} />
      ) : view === "pipeline" ? (
        <div className="pipeline" aria-label="Lead status pipeline">
          {LEAD_STATUSES.map((status) => (
            <section key={status} className="pipeline-column" onDragOver={(event) => event.preventDefault()} onDrop={(event) => moveLead(event, status)}>
              <header><h2>{status}</h2><span>{grouped[status].length}</span></header>
              <div className="pipeline-stack">{grouped[status].map((lead) => <LeadCard key={lead.id} lead={lead} draggable />)}{!grouped[status].length && <p className="drop-hint">Drop a lead here</p>}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="lead-list">
          <div className="lead-list-head"><span>Lead</span><span>Enquiry</span><span>Status</span><span>Owner & next step</span><span /></div>
          {leads.map((lead) => (
            <article className="lead-row" key={lead.id}>
              <div><Link href={`/leads/${lead.id}`} className="lead-name">{lead.customer_name}</Link><p>{lead.company || lead.email || lead.phone || "No company"}</p><small>Received {formatDate(lead.enquiry_date)}</small></div>
              <div><p>{lead.product_service || "General enquiry"}</p><small>{lead.source} · {lead.summary || "No summary"}</small></div>
              <div className="badge-stack"><StatusBadge value={lead.status} /><StatusBadge value={lead.priority} /><small>{lead.health}</small></div>
              <div><p>{lead.assigned_to || "Unassigned"}</p><small>{lead.next_follow_up ? `Follow up ${formatDateTime(lead.next_follow_up)}` : "No next step"}</small>{lead.value != null && <small>S${Number(lead.value).toLocaleString()}</small>}</div>
              <Link className="row-arrow" href={`/leads/${lead.id}`} aria-label={`View ${lead.customer_name}`}>→</Link>
            </article>
          ))}
        </div>
      )}
      <AddLeadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

