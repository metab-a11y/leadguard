import { Suspense } from "react";
import { listLeads } from "@/lib/data/leads";
import { LeadExperience } from "@/components/leads/lead-experience";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; source?: string; q?: string; view?: string }>;

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const leads = await listLeads({ status: filters.status, source: filters.source, q: filters.q });
  return (
    <div className="page-wrap wide">
      <PageHeader eyebrow="Lead control" title="My Leads" description={`${leads.length} ${leads.length === 1 ? "enquiry" : "enquiries"} in this view`} />
      <Suspense fallback={<div className="skeleton-block" />}><LeadExperience leads={leads} /></Suspense>
    </div>
  );
}

