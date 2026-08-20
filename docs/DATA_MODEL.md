# LeadGuard — Data Model

## leads
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid |
| user_id | uuid nullable | owner-scoping at lock-down |
| customer_name | text | required |
| company | text | nullable |
| phone | text | nullable |
| email | text | nullable |
| enquiry_date | timestamptz | default now |
| source | text | Website/Search/Chatbot/Voice/Phone/Email/Messaging/Referral/Manual/Other |
| product_service | text | nullable |
| summary | text | nullable |
| status | text | default 'New' |
| priority | text | Normal/Important/Urgent |
| assigned_to | text | team member name |
| last_contact | timestamptz | nullable |
| next_follow_up | timestamptz | nullable |
| quotation_status | text | None/Sent/Accepted/Rejected |
| value | numeric | nullable |
| notes | text | nullable |
| health | text | Active/Needs Attention/At Risk/Closed |
| created_at | timestamptz | default now |
| updated_at | timestamptz | default now |

## follow_ups
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| lead_id | uuid | references leads |
| due_date | timestamptz | required |
| responsible_person | text | |
| recommended_action | text | |
| notes | text | nullable |
| priority | text | Normal/Important/Urgent |
| status | text | Due Today/Upcoming/Overdue/Completed |
| completed_at | timestamptz | nullable |
| created_at | timestamptz | default now |

## timeline_entries
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| lead_id | uuid | references leads |
| entry_type | text | enquiry/response/note/followup/status_change/quotation |
| content | text | human-readable description |
| created_at | timestamptz | default now |

## performance_metrics
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| service_area | text | website/seo_aeo/chatbot/voice |
| period | text | YYYY-MM |
| metric_key | text | e.g. enquiries_count, search_visibility, calls_handled |
| metric_value | numeric | |
| metric_label | text | plain-language summary (AI field) |
| ai_source | text | nullable — source of AI label |
| ai_confidence | numeric | nullable |
| review_status | text | default 'unreviewed' |
| created_at | timestamptz | default now |

## team_members
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| name | text | required |
| role | text | Owner/Manager/Staff |
| email | text | nullable |
| created_at | timestamptz | default now |

## Relationships
- leads 1:N follow_ups
- leads 1:N timeline_entries
- performance_metrics standalone (grouped by service_area + period)

## RLS / Permissions
v1: permissive read/write for demo. Lock-down: `auth.uid() = user_id` on all tables. Staff role sees only leads where `assigned_to` matches their name (future). Manager sees all leads, no billing. Owner sees all.