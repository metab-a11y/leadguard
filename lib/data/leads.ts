import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export type LeadFilters = {
  status?: string;
  source?: string;
  q?: string;
};

export async function listLeads(filters: LeadFilters = {}): Promise<Lead[]> {
  const supabase = await createClient();
  let query = supabase.from("leads").select("*").order("updated_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.source) query = query.eq("source", filters.source);
  if (filters.q) {
    const term = filters.q.replace(/[,%()]/g, " ").trim();
    if (term) {
      query = query.or(
        `customer_name.ilike.%${term}%,company.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,product_service.ilike.%${term}%,notes.ilike.%${term}%`,
      );
    }
  }
  const { data, error } = await query;
  if (error) throw new Error(`Unable to load leads: ${error.message}`);
  return (data ?? []) as Lead[];
}

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Unable to load lead: ${error.message}`);
  return data as Lead | null;
}

export type NewLead = Pick<Lead, "customer_name"> &
  Partial<
    Pick<
      Lead,
      | "company"
      | "phone"
      | "email"
      | "source"
      | "product_service"
      | "summary"
      | "status"
      | "priority"
      | "assigned_to"
      | "value"
      | "notes"
    >
  >;

export async function createLead(input: NewLead): Promise<Lead> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({ ...input, health: input.status === "Won" || input.status === "Lost" ? "Closed" : "Active" })
    .select("*")
    .single();
  if (error) throw new Error(`Unable to create lead: ${error.message}`);
  return data as Lead;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(`Unable to update lead: ${error.message}`);
  return data as Lead;
}

