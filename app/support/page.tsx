import { SupportCentre } from "@/components/support/support-centre";
import { PageHeader } from "@/components/ui";
import { listRecommendations, listSupportRequests } from "@/lib/data/support";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const [requests, recommendations] = await Promise.all([listSupportRequests(), listRecommendations()]);
  return <div className="page-wrap"><PageHeader eyebrow="abcstudio Support" title="How can we help?" description="Get help with your services, lead flow, or next growth decision." /><SupportCentre requests={requests} recommendations={recommendations} /></div>;
}

