"use server";

import { revalidatePath } from "next/cache";
import { addAuditEntry } from "@/lib/data/audit";
import { createSupportRequest } from "@/lib/data/support";
import type { ActionResult } from "@/lib/actions/leads";

export async function createSupportRequestAction(formData: FormData): Promise<ActionResult> {
  try {
    const category = String(formData.get("category") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const priority = String(formData.get("priority") ?? "Normal").trim();
    const submittedBy = String(formData.get("submitted_by") ?? "Sarah Lee").trim();
    if (!category || !subject || !description) return { ok: false, error: "Complete the category, subject, and description." };
    const request = await createSupportRequest({ category, subject, description, priority, submitted_by: submittedBy || "Demo user" });
    await addAuditEntry({ action: "support_request_created", targetType: "support_request", targetId: request.id, actor: submittedBy || "Demo user" });
    revalidatePath("/support");
    return { ok: true, id: request.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "We couldn't submit this request." };
  }
}

