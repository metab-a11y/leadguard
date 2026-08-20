# LeadGuard — Security

## Secret Handling
- Supabase URL + anon key in `NEXT_PUBLIC_` env vars (safe for client). Service role key server-side only — never in frontend.
- No third-party API keys in v1.

## Permission Model
- **v1 (demo):** All tables permissive RLS — anonymous read/write for demo.
- **Lock-down (later sprint):** `auth.uid() = user_id` on leads, follow_ups, timeline_entries, performance_metrics, team_members. Staff sees only leads where `assigned_to` matches. Manager sees all leads but no account admin. Owner full access.
- abcstudio Admin: separate supabase project or separate schema — never mixed with client UI.

## Approved-Tools Rule
- Named tools only (`summarize_metric`, `suggest_rescue_action`, `rank_priorities`, `draft_followup_note`). No raw `run_any`/`send_any` execution.
- AI actions inherit user's permission scope. A Staff user's AI draft cannot reference leads they can't see.

## Audit Principle
- Every meaningful action (status change, follow-up create/complete, rescue handled, assignment) writes to audit log with actor, action, target, risk level, timestamp.
- No silent mutations. Every DB write produces an audit entry + timeline entry where applicable.

## Data Safety
- Soft-delete not needed in v1 (no delete in UI). Hard stop: no destructive action exposed.
- If a planned feature risks data loss (bulk status change, CSV import), stop and get human review before shipping.