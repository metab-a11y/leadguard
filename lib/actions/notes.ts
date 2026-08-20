"use server";

import { revalidatePath } from "next/cache";
import { updateLead } from "@/lib/data/leads";
import { addTimelineEntry } from "@/lib/data/timeline";
import type { ActionResult } from "@/lib/actions/leads";

export async function addNoteAction(leadId: string, formData: FormData): Promise<ActionResult> {
  try {
    const note = String(formData.get("note") ?? "").trim();
    if (!note) return { ok: false, error: "Write a note before saving." };
    await addTimelineEntry(leadId, "note", note);
    await updateLead(leadId, { notes: note, last_contact: new Date().toISOString() });
    revalidatePath(`/leads/${leadId}`);
    revalidatePath("/");
    revalidatePath("/rescue");
    return { ok: true, id: leadId };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "We couldn't save this note." };
  }
}

