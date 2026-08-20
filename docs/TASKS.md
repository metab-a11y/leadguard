# LeadGuard — Tasks

## Sprint 1 — Core Lead Engine (v1 functional milestone)
**Goal:** Lead CRUD, status pipeline, timeline, follow-ups — working end-to-end, no login.
- [ ] Create Supabase tables + seed data (migration SQL)
- [ ] `lib/data/leads.ts` — list, get, create, update, updateStatus
- [ ] `lib/data/followups.ts` — create, complete, listByLead
- [ ] `lib/data/timeline.ts` — addEntry, listByLead
- [ ] `lib/actions/leads.ts` — server actions wrapping data layer
- [ ] My Leads: list view with all fields, filters by status/source
- [ ] My Leads: pipeline view with drag-to-move status
- [ ] Lead Detail page: header, quick actions (Call/Message/Email/Add Note/Set Follow-Up/Update Status)
- [ ] Lead Detail: activity timeline
- [ ] Follow-up overdue detection (computed on read)
- [ ] Seed 5 leads across statuses, 3 follow-ups, 10 timeline entries
**Done:** Anonymous visitor can view leads, open detail, add note, set follow-up, change status — all persisted.

## Sprint 2 — Dashboard + Lead Rescue
**Goal:** Home dashboard + rescue feature.
- [ ] `lib/ai/ranking.ts` — priority scoring (rule-based)
- [ ] Home dashboard: 4 summary cards (New/Need Follow-Up/Quotations Pending/At-Risk)
- [ ] Today's Priorities: top 5 ranked actions with View Lead / Done / Respond buttons
- [ ] `lib/actions/rescue.ts` — derive rescue candidates on read
- [ ] Lead Rescue page: cards with reason, recommended action, priority, View/Set Follow-Up/Mark Handled
- [ ] Health indicator on lead cards
- [ ] Header greeting: "Good morning" / "You're caught up"
**Done:** Dashboard shows real counts from DB; rescue lists live candidates; priorities update after actions.

## Sprint 3 — Performance Dashboard
**Goal:** 4 service areas with plain-language metrics.
- [ ] `lib/data/metrics.ts` — list metrics by area + period
- [ ] Performance page: Website, SEO+AEO, Chatbot, Voice tabs/sections
- [ ] Display metrics in plain language with trend indicators
- [ ] Seed 3 months of performance_metrics per service area
- [ ] "What happened / Why it matters / What to do next" format per area
**Done:** Performance page shows seeded metrics in plain language; question prompts visible per area.

## Sprint 4 — Team + Polish
**Goal:** Team management, support page, responsive polish.
- [ ] Team member list (view-only in v1, roles displayed)
- [ ] abcstudio Support page: contact form, FAQ, request support
- [ ] Account menu: Profile, Team, Settings (non-functional placeholders except Team)
- [ ] Mobile bottom nav + responsive testing
- [ ] Empty states for all list views
- [ ] Loading + error states for all data fetches
**Done:** All 5 nav areas functional; responsive on mobile; empty/loading/error states handled.

## Sprint 5 — Lock It Down
**Goal:** Auth + per-user RLS.
- [ ] Supabase Auth (email/password + magic link)
- [ ] Login/signup pages
- [ ] Replace permissive RLS with `auth.uid() = user_id` policies
- [ ] Role checks (Owner/Manager/Staff) in data layer
- [ ] Redirect unauthenticated users to /login
- [ ] Assign user_id on all creates
**Done:** Logged-out user cannot see data; logged-in user sees only their tenant's leads.

## Gantt
```
S1: Core Lead Engine     ████████
S2: Dashboard + Rescue   ████████
S3: Performance           ████████
S4: Team + Polish         ████████
S5: Lock It Down          ████████
```