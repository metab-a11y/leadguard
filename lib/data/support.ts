import { createClient } from "@/lib/supabase/server";
import type { Recommendation, SupportRequest } from "@/lib/types";

export async function listSupportRequests(): Promise<SupportRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("support_requests").select("*").order("created_at", { ascending: false }).limit(5);
  if (error) {
    const tableMissing = error.code === "PGRST205" || error.code === "42P01" || /could not find the table|does not exist/i.test(error.message);
    if (!tableMissing) throw new Error(`Unable to load support requests: ${error.message}`);
    const { data: fallback, error: fallbackError } = await supabase
      .from("timeline_entries")
      .select("id,content,created_at")
      .eq("entry_type", "support_request")
      .order("created_at", { ascending: false })
      .limit(5);
    if (fallbackError) throw new Error(`Unable to load support requests: ${fallbackError.message}`);
    return (fallback ?? []).flatMap((entry) => {
      try {
        const parsed = JSON.parse(entry.content) as Omit<SupportRequest, "id" | "created_at">;
        return [{ ...parsed, id: entry.id, created_at: entry.created_at }];
      } catch { return []; }
    });
  }
  return (data ?? []) as SupportRequest[];
}

export async function createSupportRequest(input: {
  category: string;
  subject: string;
  description: string;
  priority: string;
  submitted_by: string;
}): Promise<SupportRequest> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("support_requests").insert({ ...input, status: "Received" }).select("*").single();
  if (error) {
    const tableMissing = error.code === "PGRST205" || error.code === "42P01" || /could not find the table|does not exist/i.test(error.message);
    if (!tableMissing) throw new Error(`Unable to submit support request: ${error.message}`);
    const fallbackRecord = {
      ...input,
      status: "Received",
      abcstudio_response: null,
      completed_at: null,
    };
    const { data: fallback, error: fallbackError } = await supabase
      .from("timeline_entries")
      .insert({ lead_id: null, entry_type: "support_request", content: JSON.stringify(fallbackRecord) })
      .select("id,created_at")
      .single();
    if (fallbackError) throw new Error(`Unable to submit support request: ${fallbackError.message}`);
    return { ...fallbackRecord, id: fallback.id, created_at: fallback.created_at };
  }
  return data as SupportRequest;
}

export async function listRecommendations(): Promise<Recommendation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("recommendations").select("*").eq("status", "Open").order("created_at", { ascending: false });
  if (error) {
    const tableMissing = error.code === "PGRST205" || error.code === "42P01" || /could not find the table|does not exist/i.test(error.message);
    if (!tableMissing) throw new Error(`Unable to load recommendations: ${error.message}`);
    return [
      { id: "fallback-lead-flow", category: "Lead Flow", observation: "Several open quotations are waiting for a follow-up.", why_it_matters: "Customers may still be deciding and could need one clear answer before moving forward.", recommended_action: "Review open quotations and schedule a personal follow-up this week.", priority: "Important", status: "Open", created_at: new Date().toISOString() },
      { id: "fallback-website", category: "Website", observation: "Website enquiries are arriving from several service pages.", why_it_matters: "The strongest enquiry paths show where customer intent is already high.", recommended_action: "Review the pages generating enquiries and make their next step even clearer.", priority: "Normal", status: "Open", created_at: new Date().toISOString() },
    ];
  }
  return (data ?? []) as Recommendation[];
}
