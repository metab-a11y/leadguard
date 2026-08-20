export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Quotation Sent",
  "Follow-Up",
  "Won",
  "Lost",
] as const;

export const LEAD_SOURCES = [
  "Website",
  "Search",
  "Chatbot",
  "Voice Assistant",
  "Phone",
  "Email",
  "Messaging",
  "Referral",
  "Manual Entry",
  "Other",
] as const;

export const PRIORITIES = ["Normal", "Important", "Urgent"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type Priority = (typeof PRIORITIES)[number];

export type Lead = {
  id: string;
  user_id: string | null;
  customer_name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  enquiry_date: string;
  source: string;
  product_service: string | null;
  summary: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  last_contact: string | null;
  next_follow_up: string | null;
  quotation_status: string | null;
  value: number | null;
  notes: string | null;
  health: string | null;
  created_at: string;
  updated_at: string;
};

export type FollowUp = {
  id: string;
  user_id: string | null;
  lead_id: string;
  due_date: string;
  responsible_person: string | null;
  recommended_action: string | null;
  notes: string | null;
  priority: string;
  status: string;
  completed_at: string | null;
  created_at: string;
  computed_status?: "Due Today" | "Upcoming" | "Overdue" | "Completed";
};

export type TimelineEntry = {
  id: string;
  user_id: string | null;
  lead_id: string;
  entry_type: string;
  content: string;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  created_at: string;
};

export type PerformanceMetric = {
  id: string;
  service_area: string;
  period: string;
  metric_key: string;
  metric_value: number;
  metric_label: string | null;
  created_at: string;
};

export type SupportRequest = {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  submitted_by: string | null;
  abcstudio_response: string | null;
  completed_at: string | null;
  created_at: string;
};

export type Recommendation = {
  id: string;
  category: string;
  observation: string;
  why_it_matters: string;
  recommended_action: string;
  priority: string;
  status: string;
  created_at: string;
};
