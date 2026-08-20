import { deriveRescueCandidates } from "@/lib/ai/ranking";
import { listOpenFollowUps } from "@/lib/data/followups";
import { listLeads } from "@/lib/data/leads";
import { RescueList } from "@/components/rescue/rescue-list";
import { EmptyState, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function RescuePage() {
  const [leads, followUps] = await Promise.all([listLeads(), listOpenFollowUps()]);
  const candidates = deriveRescueCandidates(leads, followUps);
  return (
    <div className="page-wrap">
      <PageHeader eyebrow="Monday Lead Rescue" title="Your Lead Rescue List" description={candidates.length ? `${candidates.length} ${candidates.length === 1 ? "opportunity may" : "opportunities may"} need attention this week.` : "Every open opportunity has a clear next step."} />
      {candidates.length ? <RescueList candidates={candidates} /> : <EmptyState title="Great — no leads need rescue this week." message="Your next steps are clear. New rescue items will appear here when an opportunity needs attention." />}
    </div>
  );
}

