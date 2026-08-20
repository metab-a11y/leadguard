"use server";

import { revalidatePath } from "next/cache";
import { completeFollowUp, createFollowUp } from "@/lib/data/followups";
import { updateLead } from "@/lib/data/leads";
import { addTimelineEntry } from "@/lib/data/timeline";
import { addAuditEntry } from "@/lib/data/audit";
import { formatDateTime } from "@/lib/utils/dates";
import type { ActionResult } from "@/lib/actions/leads";

function refresh(leadId: string) {
  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/rescue");
  revalidatePath(`/leads/${leadId}`);
}

export async function createFollowUpAction(leadId: string, formData: FormData): Promise<ActionResult> {
  try {
    const dueDate = String(formData.get("due_date") ?? "");
    if (!dueDate || Number.isNaN(new Date(dueDate).getTime())) {
      return { ok: false, error: "Choose a follow-up date and time." };
    }
    const recommendedAction = String(formData.get("recommended_action") ?? "").trim();
    const responsiblePerson = String(formData.get("responsible_person") ?? "").trim();
    const priority = String(formData.get("priority") ?? "Normal");
    await createFollowUp({
      lead_id: leadId,
      due_date: new Date(dueDate).toISOString(),
      responsible_person: responsiblePerson || null,
      recommended_action: recommendedAction || "Contact the customer",
      notes: String(formData.get("notes") ?? "").trim() || null,
      priority,
    });
    await updateLead(leadId, {
      next_follow_up: new Date(dueDate).toISOString(),
      assigned_to: responsiblePerson || undefined,
      health: "Active",
    });
    await addTimelineEntry(
      leadId,
      "followup",
      `Follow-up scheduled for ${formatDateTime(new Date(dueDate).toISOString())}${recommendedAction ? ` — ${recommendedAction}` : ""}`,
    );
    await addAuditEntry({ action: "followup_created", targetType: "lead", targetId: leadId, riskLevel: "medium", approvedBy: "Demo user" });
    refresh(leadId);
    return { ok: true, id: leadId };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "We couldn't schedule this follow-up." };
  }
}

export async function completeFollowUpAction(followUpId: string, leadId: string): Promise<ActionResult> {
  try {
    await completeFollowUp(followUpId);
    await updateLead(leadId, { last_contact: new Date().toISOString(), next_follow_up: null, health: "Active" });
    await addTimelineEntry(leadId, "followup", "Follow-up marked complete");
    await addAuditEntry({ action: "followup_completed", targetType: "lead", targetId: leadId, riskLevel: "medium", approvedBy: "Demo user" });
    refresh(leadId);
    return { ok: true, id: leadId };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "We couldn't complete this follow-up." };
  }
}
