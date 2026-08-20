import { createClient } from "@/lib/supabase/server";
import type { TimelineEntry } from "@/lib/types";

export async function listTimeline(leadId: string): Promise<TimelineEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timeline_entries")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Unable to load activity: ${error.message}`);
  return (data ?? []) as TimelineEntry[];
}

export async function addTimelineEntry(
  leadId: string,
  entryType: string,
  content: string,
): Promise<TimelineEntry> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timeline_entries")
    .insert({ lead_id: leadId, entry_type: entryType, content })
    .select("*")
    .single();
  if (error) throw new Error(`Unable to record activity: ${error.message}`);
  return data as TimelineEntry;
}

