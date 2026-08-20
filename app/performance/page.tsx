import { PerformanceDashboard } from "@/components/performance/performance-dashboard";
import { PageHeader } from "@/components/ui";
import { listMetrics } from "@/lib/data/metrics";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const metrics = await listMetrics();
  return <div className="page-wrap"><PageHeader eyebrow="Business visibility" title="Performance" description="See what happened, why it matters, and what to do next — without the analytics jargon." /><PerformanceDashboard metrics={metrics} /></div>;
}

