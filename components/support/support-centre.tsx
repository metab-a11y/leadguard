"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupportRequestAction } from "@/lib/actions/support";
import type { Recommendation, SupportRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils/dates";
import { StatusBadge } from "@/components/ui";

const categories = ["Website Support", "SEO + AEO Question", "Chatbot Update", "Voice Assistant Update", "Lead Flow Review", "Growth Review", "General Support"];

export function SupportCentre({ requests, recommendations }: { requests: SupportRequest[]; recommendations: Recommendation[] }) {
  const router = useRouter();
  const [category, setCategory] = useState("General Support");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function growthReview() {
    setCategory("Growth Review");
    setSubject("Request a Growth Review");
    setDescription("Please review our lead flow, follow-up process, and current digital performance, then recommend the clearest next steps.");
    document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = event.currentTarget;
    startTransition(async () => {
      const result = await createSupportRequestAction(new FormData(form));
      if (!result.ok) return setError(result.error);
      setMessage("Request received. abcstudio will review it and reply here.");
      setSubject("");
      setDescription("");
      setCategory("General Support");
      router.refresh();
    });
  }

  return (
    <>
      <section className="support-hero">
        <div><p className="eyebrow">Founder-to-founder support</p><h2>Need a second pair of eyes?</h2><p>Ask abcstudio to review your lead flow, follow-up, and digital performance. You&apos;ll get a practical answer, not a generic report.</p></div>
        <button className="button lime" onClick={growthReview}>Request Growth Review</button>
      </section>
      <div className="support-layout">
        <div>
          <section className="detail-card recommendations-section">
            <div className="section-heading"><div><p className="eyebrow">From abcstudio</p><h2>Recommendations</h2></div><span className="count-pill">{recommendations.length}</span></div>
            {!recommendations.length ? <p className="quiet-state">No new recommendations right now.</p> : <div className="recommendation-list">{recommendations.map((item) => <article key={item.id}><div><StatusBadge value={item.priority} /><small>{item.category}</small></div><h3>{item.observation}</h3><p>{item.why_it_matters}</p><strong>Suggested action</strong><p>{item.recommended_action}</p></article>)}</div>}
          </section>
          <section className="detail-card request-history">
            <div className="section-heading"><div><p className="eyebrow">Your requests</p><h2>Support history</h2></div></div>
            {!requests.length ? <p className="quiet-state">No requests yet. When you ask for help, its status will appear here.</p> : <div>{requests.map((request) => <article key={request.id}><div><h3>{request.subject}</h3><p>{request.category} · {formatDate(request.created_at)}</p></div><StatusBadge value={request.status} /></article>)}</div>}
          </section>
        </div>
        <aside>
          <section className="detail-card support-form-card" id="support-form">
            <p className="eyebrow">Send a request</p><h2>How can we help?</h2><p>Tell us what you need. Your request is saved here so the team can track it.</p>
            <form onSubmit={submit} className="stacked-form">
              <label><span>Category</span><select name="category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Subject</span><input name="subject" required value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="What do you need help with?" /></label>
              <label><span>Description</span><textarea name="description" required rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Share the context and the outcome you need…" /></label>
              <div className="support-form-row"><label><span>Priority</span><select name="priority"><option>Normal</option><option>Important</option><option>Urgent</option></select></label><label><span>Submitted by</span><input name="submitted_by" defaultValue="Sarah Lee" /></label></div>
              {error && <p className="form-error" role="alert">{error}</p>}
              {message && <p className="form-success" role="status">{message}</p>}
              <button className="button primary" disabled={isPending}>{isPending ? "Submitting…" : "Submit request"}</button>
            </form>
          </section>
          <section className="faq-card"><p className="eyebrow">Quick answers</p><h2>Frequently asked</h2><details><summary>When will abcstudio reply?</summary><p>Normal requests are reviewed within one business day. Use Urgent only when leads or a live service are affected.</p></details><details><summary>Can I request a chatbot update?</summary><p>Yes. Choose Chatbot Update and describe the answer or flow that needs changing.</p></details><details><summary>What is a Growth Review?</summary><p>A practical review of lead capture, follow-up, and current performance with a short list of next actions.</p></details></section>
        </aside>
      </div>
    </>
  );
}

