import type { FollowUp, Lead } from "@/lib/types";
import { daysSince } from "@/lib/utils/dates";

export type PriorityItem = {
  key: string;
  lead: Lead;
  followUp?: FollowUp;
  score: number;
  reason: string;
  recommendedAction: string;
  actionLabel: "Done" | "Respond";
};

export type RescueCandidate = {
  lead: Lead;
  followUp?: FollowUp;
  priority: "High" | "Medium" | "Watch";
  reason: string;
  recommendedAction: string;
};

function isOpen(lead: Lead) {
  return lead.status !== "Won" && lead.status !== "Lost";
}

export function rankPriorities(leads: Lead[], followUps: FollowUp[]): PriorityItem[] {
  const byLead = new Map(followUps.map((followUp) => [followUp.lead_id, followUp]));
  return leads
    .filter(isOpen)
    .map((lead): PriorityItem | null => {
      const followUp = byLead.get(lead.id);
      if (followUp?.computed_status === "Overdue") {
        return {
          key: `followup-${followUp.id}`,
          lead,
          followUp,
          score: 100 + (lead.priority === "Urgent" ? 10 : 0),
          reason: `Follow-up was due ${daysSince(followUp.due_date)} ${daysSince(followUp.due_date) === 1 ? "day" : "days"} ago`,
          recommendedAction: followUp.recommended_action || "Contact the customer today",
          actionLabel: "Done",
        };
      }
      if (lead.status === "New" && !lead.last_contact && daysSince(lead.enquiry_date) >= 1) {
        return {
          key: `unanswered-${lead.id}`,
          lead,
          score: 80 + (lead.priority === "Urgent" ? 10 : 0),
          reason: `New enquiry received ${daysSince(lead.enquiry_date)} ${daysSince(lead.enquiry_date) === 1 ? "day" : "days"} ago`,
          recommendedAction: "This customer may still be waiting for a response",
          actionLabel: "Respond",
        };
      }
      if (lead.status === "Quotation Sent" && daysSince(lead.last_contact ?? lead.updated_at) >= 3) {
        return {
          key: `quote-${lead.id}`,
          lead,
          score: 70,
          reason: `Quotation sent ${daysSince(lead.last_contact ?? lead.updated_at)} days ago`,
          recommendedAction: "Check whether the customer has questions",
          actionLabel: "Done",
        };
      }
      const inactivity = daysSince(lead.last_contact ?? lead.updated_at);
      if (inactivity >= 7) {
        return {
          key: `stale-${lead.id}`,
          lead,
          score: 50,
          reason: `No activity recorded for ${inactivity} days`,
          recommendedAction: "Record a next step or close the opportunity",
          actionLabel: "Done",
        };
      }
      return null;
    })
    .filter((item): item is PriorityItem => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function deriveRescueCandidates(leads: Lead[], followUps: FollowUp[]): RescueCandidate[] {
  const byLead = new Map(followUps.map((followUp) => [followUp.lead_id, followUp]));
  const candidates = leads.filter(isOpen).map((lead): RescueCandidate | null => {
    const followUp = byLead.get(lead.id);
    const lastActivity = lead.last_contact ?? lead.updated_at ?? lead.enquiry_date;
    if (followUp?.computed_status === "Overdue") {
      const strongOpportunity = ["Qualified", "Quotation Sent", "Follow-Up"].includes(lead.status);
      return {
        lead,
        followUp,
        priority: strongOpportunity ? "High" : "Medium",
        reason: `A promised follow-up is ${daysSince(followUp.due_date)} ${daysSince(followUp.due_date) === 1 ? "day" : "days"} overdue.`,
        recommendedAction: followUp.recommended_action || "Contact the customer and agree the next step.",
      };
    }
    if (lead.status === "New" && !lead.last_contact && daysSince(lead.enquiry_date) >= 1) {
      return {
        lead,
        priority: "High",
        reason: "A new enquiry has no response recorded.",
        recommendedAction: "Contact the customer while their enquiry is still fresh.",
      };
    }
    if (lead.status === "Quotation Sent" && daysSince(lastActivity) >= 3) {
      return {
        lead,
        priority: "High",
        reason: "No follow-up is recorded after the quotation.",
        recommendedAction: "Check whether the customer has questions about the quotation.",
      };
    }
    const inactivity = daysSince(lastActivity);
    if (inactivity >= 14) {
      return {
        lead,
        priority: "Watch",
        reason: `No activity has been recorded for ${inactivity} days.`,
        recommendedAction: "Review the opportunity and record a clear next step.",
      };
    }
    if (followUp?.computed_status === "Due Today") {
      return {
        lead,
        followUp,
        priority: "Medium",
        reason: "A follow-up is due today.",
        recommendedAction: followUp.recommended_action || "Contact the customer today.",
      };
    }
    return null;
  });
  const order = { High: 3, Medium: 2, Watch: 1 };
  return candidates
    .filter((candidate): candidate is RescueCandidate => candidate !== null)
    .sort((a, b) => order[b.priority] - order[a.priority]);
}

