"use server";

import { revalidatePath } from "next/cache";
import { completeFollowUp } from "@/lib/data/followups";
import { getLead, updateLead } from "@/lib/data/leads";
import { addTimelineEntry } from "@/lib/data/timeline";
import type { ActionResult } from "@/lib/actions/leads";

function refresh(leadId: string) {
  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/rescue");
  revalidatePath(`/leads/${leadId}`);
}

export async function markHandledAction(leadId: string, followUpId?: string): Promise<ActionResult> {
  try {
    const lead = await getLead(leadId);
    if (!lead) return { ok: false, error: "Lead not found." };
    if (followUpId) await completeFollowUp(followUpId);
    await updateLead(leadId, {
      last_contact: new Date().toISOString(),
      next_follow_up: followUpId ? null : lead.next_follow_up,
      health: "Active",
      status: lead.status === "New" ? "Contacted" : lead.status,
    });
    await addTimelineEntry(
      leadId,
      "response",
      followUpId ? "Rescue item handled and follow-up completed" : "Rescue item marked handled",
    );
    refresh(leadId);
    return { ok: true, id: leadId };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "We couldn't mark this item handled." };
  }
}

