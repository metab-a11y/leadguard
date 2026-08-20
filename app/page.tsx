import Link from "next/link";
import { rankPriorities, deriveRescueCandidates } from "@/lib/ai/ranking";
import { listOpenFollowUps } from "@/lib/data/followups";
import { listLeads } from "@/lib/data/leads";
import { PriorityList } from "@/components/dashboard/priority-list";
import { followUpStatus, daysSince } from "@/lib/utils/dates";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [leads, followUps] = await Promise.all([listLeads(), listOpenFollowUps()]);
  const priorities = rankPriorities(leads, followUps);
  const rescue = deriveRescueCandidates(leads, followUps);
  const newLeads = leads.filter((lead) => lead.status === "New");
  const receivedToday = newLeads.filter((lead) => daysSince(lead.enquiry_date) === 0).length;
  const needsFollowUp = followUps.filter((item) => ["Overdue", "Due Today"].includes(followUpStatus(item.due_date, item.completed_at)));
  const overdue = followUps.filter((item) => followUpStatus(item.due_date, item.completed_at) === "Overdue").length;
  const quotes = leads.filter((lead) => lead.status === "Quotation Sent" || lead.quotation_status === "Sent");
  const oldestQuote = quotes.reduce((oldest, lead) => Math.max(oldest, daysSince(lead.last_contact ?? lead.updated_at)), 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const todayLabel = new Intl.DateTimeFormat("en-SG", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const cards = [
    { value: newLeads.length, label: "New enquiries", note: `${receivedToday} received today`, href: "/leads?status=New", accent: "lime" },
    { value: needsFollowUp.length, label: "Need follow-up", note: `${overdue} ${overdue === 1 ? "is" : "are"} overdue`, href: "/leads?status=Follow-Up", accent: "pink" },
    { value: quotes.length, label: "Quotes awaiting response", note: quotes.length ? `Oldest: ${oldestQuote} days` : "No open quotations", href: "/leads?status=Quotation+Sent", accent: "blue" },
    { value: rescue.length, label: "At-risk opportunities", note: rescue.length ? "Take action before they go cold" : "All next steps are clear", href: "/rescue", accent: "ink" },
  ];
  return (
    <div className="page-wrap dashboard-wrap">
      <header className="dashboard-header"><div><p className="eyebrow">{todayLabel}</p><h1>{greeting}, Sarah.</h1><p>{priorities.length ? "Here is what needs your attention today." : "You're caught up. Here is how your business is performing."}</p></div><Link href="/leads" className="button primary">+ Add or view leads</Link></header>
      <section className="summary-grid" aria-label="Lead summary">
        {cards.map((card) => <Link className={`summary-card summary-${card.accent}`} href={card.href} key={card.label}><span className="summary-arrow" aria-hidden="true">↗</span><strong>{card.value}</strong><h2>{card.label}</h2><p>{card.note}</p></Link>)}
      </section>
      <section className="dashboard-section"><div className="section-heading dashboard-title"><div><p className="eyebrow">Clear next actions</p><h2>Today&apos;s Priorities</h2></div><span>{priorities.length} of 5</span></div><PriorityList items={priorities} /></section>
      <section className="journey-strip" aria-label="Customer journey"><span><strong>Get found</strong><small>Website + Search</small></span><i>→</i><span><strong>Capture</strong><small>Chatbot + Voice</small></span><i>→</i><span><strong>Respond</strong><small>Owner + Team</small></span><i>→</i><span className="journey-active"><strong>Follow up</strong><small>LeadGuard</small></span><i>→</i><span><strong>Convert</strong><small>Customer</small></span><i>→</i><span><strong>Grow</strong><small>Performance</small></span></section>
    </div>
  );
}
