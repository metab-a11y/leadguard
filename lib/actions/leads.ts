"use server";

import { revalidatePath } from "next/cache";
import { createLead, getLead, updateLead } from "@/lib/data/leads";
import { addTimelineEntry } from "@/lib/data/timeline";
import { addAuditEntry } from "@/lib/data/audit";
import { LEAD_SOURCES, LEAD_STATUSES, PRIORITIES, type LeadStatus } from "@/lib/types";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

function refreshLead(id?: string) {
  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/rescue");
  if (id) revalidatePath(`/leads/${id}`);
}

export async function createLeadAction(formData: FormData): Promise<ActionResult> {
  try {
    const customerName = value(formData, "customer_name");
    const company = value(formData, "company");
    const phone = value(formData, "phone");
    const email = value(formData, "email");
    const summary = value(formData, "summary");
    if (!customerName && !company) return { ok: false, error: "Add a customer or company name." };
    if (!phone && !email) return { ok: false, error: "Add a phone number or email address." };
    if (!summary) return { ok: false, error: "Add a short enquiry summary." };
    const sourceInput = value(formData, "source");
    const priorityInput = value(formData, "priority");
    const lead = await createLead({
      customer_name: customerName || company,
      company: company || null,
      phone: phone || null,
      email: email || null,
      source: LEAD_SOURCES.includes(sourceInput as (typeof LEAD_SOURCES)[number]) ? sourceInput : "Manual Entry",
      product_service: value(formData, "product_service") || null,
      summary,
      status: "New",
      priority: PRIORITIES.includes(priorityInput as (typeof PRIORITIES)[number]) ? priorityInput : "Normal",
      assigned_to: value(formData, "assigned_to") || null,
      value: value(formData, "value") ? Number(value(formData, "value")) : null,
    });
    await addTimelineEntry(lead.id, "enquiry", `Enquiry added manually${summary ? ` — ${summary}` : ""}`);
    await addAuditEntry({ action: "lead_created", targetType: "lead", targetId: lead.id });
    refreshLead(lead.id);
    return { ok: true, id: lead.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "We couldn't add this lead." };
  }
}

export async function updateLeadStatusAction(leadId: string, status: string): Promise<ActionResult> {
  try {
    if (!LEAD_STATUSES.includes(status as LeadStatus)) return { ok: false, error: "Choose a valid status." };
    const lead = await getLead(leadId);
    if (!lead) return { ok: false, error: "Lead not found." };
    if (lead.status === status) return { ok: true, id: leadId };
    await updateLead(leadId, {
      status,
      last_contact: status === "Contacted" ? new Date().toISOString() : lead.last_contact,
      quotation_status: status === "Quotation Sent" ? "Sent" : lead.quotation_status,
      health: status === "Won" || status === "Lost" ? "Closed" : lead.health,
    });
    await addTimelineEntry(leadId, "status_change", `Status changed from ${lead.status} to ${status}`);
    await addAuditEntry({ action: `status_changed:${lead.status}->${status}`, targetType: "lead", targetId: leadId, riskLevel: "medium", approvedBy: "Demo user" });
    refreshLead(leadId);
    return { ok: true, id: leadId };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "We couldn't update the status." };
  }
}
