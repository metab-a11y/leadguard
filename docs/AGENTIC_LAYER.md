# LeadGuard — Agentic Layer

## Draftable Actions (Low — Auto)
- Generate plain-language summary for performance metrics.
- Suggest recommended action for rescue candidates.
- Draft follow-up notes from lead context.
- Auto-set priority based on rules.

## Executable After Approval (Medium)
- Update lead status (user confirms).
- Set follow-up date (user confirms).
- Mark rescue candidate as handled.
- Assign lead to team member.

## Human-Only (High / Critical)
- Delete a lead.
- Send email/message to customer (not in v1).
- Change team member roles.
- Modify billing/account ownership.

## Named Tools
- `summarize_metric` — input: metric_key + value → output: plain-language label.
- `suggest_rescue_action` — input: lead context → output: recommended action text.
- `rank_priorities` — input: all active leads + follow-ups → output: top 5 ranked.
- `draft_followup_note` — input: lead summary + history → output: note draft.

## Audit Log Fields
| Field | Type |
|---|---|
| id | uuid |
| actor | text (user or system) |
| action | text |
| target_type | text (lead/followup/metric) |
| target_id | uuid |
| risk_level | text (low/medium/high/critical) |
| approved_by | text nullable |
| created_at | timestamptz |

## v1 vs Later
- v1: rule-based ranking + static recommended actions. No AI calls. Audit log structure exists but only manual actions logged.
- Later: AI summaries, auto-priority suggestions, approved automated status transitions.