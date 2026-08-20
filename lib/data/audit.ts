import { createClient } from "@/lib/supabase/server";

export async function addAuditEntry(input: {
  action: string;
  targetType: string;
  targetId?: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
  actor?: string;
  approvedBy?: string;
}) {
  const supabase = await createClient();
  const record = {
    actor: input.actor ?? "Demo user",
    action: input.action,
    target_type: input.targetType,
    target_id: input.targetId ?? null,
    risk_level: input.riskLevel ?? "low",
    approved_by: input.approvedBy ?? null,
  };
  const { error } = await supabase.from("audit_logs").insert(record);
  if (!error) return;
  const tableMissing = error.code === "PGRST205" || error.code === "42P01" || /could not find the table|does not exist/i.test(error.message);
  if (!tableMissing) throw new Error(`Unable to record audit history: ${error.message}`);

  // During the short deployment window before 0002 is applied, preserve the
  // audit event in the already-provisioned timeline table instead of dropping it.
  const { error: fallbackError } = await supabase.from("timeline_entries").insert({
    lead_id: null,
    entry_type: "audit",
    content: JSON.stringify(record),
  });
  if (fallbackError) throw new Error(`Unable to record audit history: ${fallbackError.message}`);
}
