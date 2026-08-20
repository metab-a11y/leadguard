import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/lib/data/leads";
import { listFollowUpsByLead } from "@/lib/data/followups";
import { listTimeline } from "@/lib/data/timeline";
import { LeadActions } from "@/components/leads/lead-actions";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/utils/dates";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, followUps, timeline] = await Promise.all([getLead(id), listFollowUpsByLead(id), listTimeline(id)]);
  if (!lead) notFound();
  return (
    <div className="page-wrap">
      <Link href="/leads" className="back-link">← Back to leads</Link>
      <header className="lead-detail-header">
        <div><p className="eyebrow">{lead.company || "Customer enquiry"}</p><h1>{lead.customer_name}</h1><p>{lead.summary || "No enquiry summary recorded."}</p><div className="badge-line"><StatusBadge value={lead.status} /><StatusBadge value={lead.priority} /><StatusBadge value={lead.health} /></div></div>
        <div className="lead-value"><small>Potential value</small><strong>{lead.value == null ? "Not set" : `S$${Number(lead.value).toLocaleString()}`}</strong></div>
      </header>
      <LeadActions lead={lead} followUps={followUps} />
      <div className="detail-grid">
        <section className="detail-card">
          <div className="section-heading"><div><p className="eyebrow">Lead context</p><h2>Details</h2></div></div>
          <dl className="detail-list">
            <div><dt>Phone</dt><dd>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : "Not provided"}</dd></div>
            <div><dt>Email</dt><dd>{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "Not provided"}</dd></div>
            <div><dt>Source</dt><dd>{lead.source}</dd></div>
            <div><dt>Service</dt><dd>{lead.product_service || "Not set"}</dd></div>
            <div><dt>Assigned to</dt><dd>{lead.assigned_to || "Unassigned"}</dd></div>
            <div><dt>Enquiry received</dt><dd>{formatDateTime(lead.enquiry_date)}</dd></div>
            <div><dt>Last contact</dt><dd>{formatDate(lead.last_contact)}</dd></div>
            <div><dt>Next follow-up</dt><dd>{formatDateTime(lead.next_follow_up)}</dd></div>
            <div><dt>Quotation</dt><dd>{lead.quotation_status || "None"}</dd></div>
            <div><dt>Latest note</dt><dd>{lead.notes || "No note recorded"}</dd></div>
          </dl>
        </section>
        <section className="detail-card timeline-card">
          <div className="section-heading"><div><p className="eyebrow">Customer history</p><h2>Activity timeline</h2></div></div>
          {!timeline.length ? <p className="quiet-state">No activity recorded yet.</p> : <ol className="timeline">{timeline.map((entry) => <li key={entry.id}><span className={`timeline-dot timeline-${entry.entry_type}`} /><div><time>{formatDateTime(entry.created_at)}</time><p>{entry.content}</p><small>{entry.entry_type.replace("_", " ")}</small></div></li>)}</ol>}
        </section>
      </div>
    </div>
  );
}

