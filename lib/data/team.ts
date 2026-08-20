import { createClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/types";

export async function listTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_members").select("*").order("created_at");
  if (error) throw new Error(`Unable to load team members: ${error.message}`);
  return (data ?? []) as TeamMember[];
}

