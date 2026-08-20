# LeadGuard — Architecture

## Stack
Next.js 14 (App Router) + Supabase (Postgres) + Vercel. TypeScript. Tailwind + shadcn/ui.

## Responsive Nav Shell
Desktop: persistent left sidebar (Home, My Leads, Lead Rescue, Performance, Support) + account menu (Profile, Team, Settings). Mobile: bottom nav bar, account in top-right hamburger.

## Layer Plan
1. **Data layer** (`lib/data/`) — all Supabase reads/writes. Leads, follow-ups, timeline, metrics.
2. **App logic** (`lib/actions/`) — server actions for create/update/complete. Status transitions, follow-up overdue calc, rescue candidate generation.
3. **Smart features** (`lib/ai/`) — priority ranking, rescue reason generation, performance summaries in plain language. Core app works without this; rules fallback used.

## Key User Action Flow (Add Note + Set Follow-Up)
1. User opens Lead Detail page → `lib/data/leads.ts` fetches lead + timeline.
2. User clicks "Add Note" → `lib/actions/notes.ts` inserts timeline entry + updates lead `updated_at`.
3. User clicks "Set Follow-Up" → `lib/actions/followups.ts` inserts follow-up row, timeline entry, updates lead `next_follow_up`.
4. UI refreshes timeline + summary cards reflect new state.

## Why Core Runs Without AI
Priority ranking and rescue detection use deterministic rules (overdue days, status, last contact age). AI layer adds plain-language summaries and recommended actions on top — if absent, static fallback copy is used.

## Repo Structure
```
lib/data/        — data-access (leads, followups, timeline, metrics, team)
lib/actions/     — server actions (notes, followups, status, leads)
lib/ai/          — ranking, rescue reasons, performance summaries
lib/utils/       — date helpers, status config, source config
app/             — routes (home, leads, rescue, performance, support)
components/      — feature-grouped UI (leads/, dashboard/, rescue/, performance/)
__tests__/       — beside source files
```

## Module Map
| Module | Responsibility | Data Owned | Build Order |
|---|---|---|---|
| leads | Lead CRUD, status pipeline, list/pipeline views | leads, timeline_entries | 1st |
| followups | Create/complete follow-ups, overdue detection | follow_ups | 2nd |
| dashboard | Summary cards, today's priorities | derived from leads+followups | 3rd |
| rescue | Weekly rescue candidate detection + display | rescue_candidates (derived) | 4th |
| performance | 4 service areas, monthly metrics | performance_metrics | 5th |
| team | Team member list + roles | team_members | 6th |