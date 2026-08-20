"use client";

import { useState } from "react";
import { SERVICE_AREAS, currentMetrics, metricName, trendFor } from "@/lib/ai/performance";
import type { PerformanceMetric } from "@/lib/types";

export function PerformanceDashboard({ metrics }: { metrics: PerformanceMetric[] }) {
  const [active, setActive] = useState<(typeof SERVICE_AREAS)[number]["key"]>("website");
  const area = SERVICE_AREAS.find((item) => item.key === active) ?? SERVICE_AREAS[0];
  const visibleMetrics = currentMetrics(metrics, area.key);
  const primary = visibleMetrics[0];
  const primaryTrend = primary ? trendFor(metrics, primary) : null;
  return (
    <>
      <div className="service-tabs" role="tablist" aria-label="Performance service areas">
        {SERVICE_AREAS.map((item) => (
          <button key={item.key} role="tab" aria-selected={active === item.key} className={active === item.key ? "active" : ""} onClick={() => setActive(item.key)}>
            <span>{item.icon}</span><strong>{item.name}</strong><small>{currentMetrics(metrics, item.key).length ? "Data connected" : "No data yet"}</small>
          </button>
        ))}
      </div>
      <section className="performance-panel" role="tabpanel">
        <header className="performance-hero"><div><p className="eyebrow">{area.name} performance</p><h2>{area.question}</h2><p>{primary?.metric_label || "Performance data will appear here when it is available."}</p></div>{primary && <div className={`trend-orb trend-${primaryTrend?.direction}`}><small>{primary.period}</small><strong>{Number(primary.metric_value).toLocaleString()}</strong><span>{primaryTrend?.change == null ? "Current" : `${primaryTrend.change > 0 ? "+" : ""}${primaryTrend.change} vs prior`}</span></div>}</header>
        {!visibleMetrics.length ? <div className="quiet-state">No {area.name} metrics are available yet.</div> : <div className="metric-grid">{visibleMetrics.map((metric) => { const trend = trendFor(metrics, metric); return <article className="metric-card" key={metric.id}><div><span className={`trend-mark trend-${trend.direction}`} aria-label={`${trend.direction} trend`}>{trend.direction === "up" ? "↗" : trend.direction === "down" ? "↘" : "→"}</span><small>{metricName(metric.metric_key)}</small></div><strong>{Number(metric.metric_value).toLocaleString()}</strong><p>{metric.metric_label || `${metricName(metric.metric_key)} is ${metric.metric_value}.`}</p>{trend.previous != null && <span className="metric-previous">Previous: {trend.previous.toLocaleString()}</span>}</article>; })}</div>}
        <div className="business-language-grid"><article><span>01</span><small>What happened</small><p>{primary?.metric_label || `Your latest ${area.name} activity is ready to review.`}</p></article><article><span>02</span><small>Why it matters</small><p>{area.why}</p></article><article className="recommended"><span>03</span><small>Recommended next step</small><p>{area.next}</p></article></div>
      </section>
    </>
  );
}

