import { createClient } from "@/lib/supabase/server";
import type { FollowUp } from "@/lib/types";
import { followUpStatus } from "@/lib/utils/dates";

export async function listFollowUpsByLead(leadId: string): Promise<FollowUp[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .select("*")
    .eq("lead_id", leadId)
    .order("due_date", { ascending: false });
  if (error) throw new Error(`Unable to load follow-ups: ${error.message}`);
  return ((data ?? []) as FollowUp[]).map((item) => ({
    ...item,
    computed_status: followUpStatus(item.due_date, item.completed_at),
  }));
}

export async function listOpenFollowUps(): Promise<FollowUp[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .select("*")
    .is("completed_at", null)
    .order("due_date", { ascending: true });
  if (error) throw new Error(`Unable to load follow-ups: ${error.message}`);
  return ((data ?? []) as FollowUp[]).map((item) => ({
    ...item,
    computed_status: followUpStatus(item.due_date, item.completed_at),
  }));
}

export async function createFollowUp(input: {
  lead_id: string;
  due_date: string;
  responsible_person?: string | null;
  recommended_action?: string | null;
  notes?: string | null;
  priority?: string;
}): Promise<FollowUp> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .insert({ ...input, status: followUpStatus(input.due_date) })
    .select("*")
    .single();
  if (error) throw new Error(`Unable to schedule follow-up: ${error.message}`);
  return data as FollowUp;
}

export async function completeFollowUp(id: string): Promise<FollowUp> {
  const supabase = await createClient();
  const completedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("follow_ups")
    .update({ status: "Completed", completed_at: completedAt })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(`Unable to complete follow-up: ${error.message}`);
  return data as FollowUp;
}

