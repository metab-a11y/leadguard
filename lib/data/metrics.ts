import { createClient } from "@/lib/supabase/server";
import type { PerformanceMetric } from "@/lib/types";

export async function listMetrics(): Promise<PerformanceMetric[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("performance_metrics")
    .select("*")
    .order("period", { ascending: false })
    .order("metric_key", { ascending: true });
  if (error) throw new Error(`Unable to load performance: ${error.message}`);
  return (data ?? []) as PerformanceMetric[];
}

export async function listMetricsByArea(area: string): Promise<PerformanceMetric[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("performance_metrics")
    .select("*")
    .eq("service_area", area)
    .order("period", { ascending: false });
  if (error) throw new Error(`Unable to load ${area} performance: ${error.message}`);
  return (data ?? []) as PerformanceMetric[];
}

