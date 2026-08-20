import type { PerformanceMetric } from "@/lib/types";

export const SERVICE_AREAS = [
  {
    key: "website",
    name: "Website",
    short: "Web",
    question: "Is your website generating useful enquiries?",
    why: "Website enquiries show whether visitors are taking the next step, not just browsing.",
    next: "Review the services generating the most enquiries and make those paths even clearer.",
    icon: "W",
  },
  {
    key: "seo_aeo",
    name: "SEO + AEO",
    short: "Search",
    question: "Are more customers finding you in search?",
    why: "Visibility matters when it brings the right people to pages that can answer their questions.",
    next: "Strengthen the pages that appear in searches but are not yet earning enough enquiries.",
    icon: "S",
  },
  {
    key: "chatbot",
    name: "Chatbot",
    short: "Chat",
    question: "Is chat turning conversations into real enquiries?",
    why: "Captured enquiries — especially after hours — are the conversations your team can act on.",
    next: "Check the enquiries needing a human response and assign a clear owner today.",
    icon: "C",
  },
  {
    key: "voice",
    name: "Voice Assistant",
    short: "Voice",
    question: "Which callers still require human follow-up?",
    why: "Calls are valuable when important customer intent reaches the right team member quickly.",
    next: "Review callers waiting for staff follow-up before they become missed opportunities.",
    icon: "V",
  },
] as const;

const labelMap: Record<string, string> = {
  enquiries_count: "Enquiries",
  search_visibility: "Search visibility",
  conversations_handled: "Conversations handled",
  enquiries_captured: "Enquiries captured",
  after_hours_enquiries: "After-hours enquiries",
  calls_handled: "Calls handled",
  after_hours_calls: "After-hours calls",
  needs_human_followup: "Need staff follow-up",
};

export function metricName(key: string) {
  return labelMap[key] ?? key.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

export function currentMetrics(metrics: PerformanceMetric[], area: string) {
  const areaMetrics = metrics.filter((metric) => metric.service_area === area);
  const currentPeriod = areaMetrics[0]?.period;
  return areaMetrics.filter((metric) => metric.period === currentPeriod);
}

export function trendFor(metrics: PerformanceMetric[], metric: PerformanceMetric) {
  const previous = metrics.find(
    (item) =>
      item.service_area === metric.service_area &&
      item.metric_key === metric.metric_key &&
      item.period < metric.period,
  );
  if (!previous) return { direction: "steady" as const, change: null, previous: null };
  const change = Number(metric.metric_value) - Number(previous.metric_value);
  return {
    direction: change > 0 ? ("up" as const) : change < 0 ? ("down" as const) : ("steady" as const),
    change,
    previous: Number(previous.metric_value),
  };
}

