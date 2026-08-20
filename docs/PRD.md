# LeadGuard — PRD

## Problem
Small service businesses lose enquiries because they track them in scattered inboxes, spreadsheets, and memory. No one asks "who needs my attention today?" — so leads go cold.

## Target User
Owner-led local service businesses. Busy, non-technical, mobile. 1–5 team members. Currently using ad-hoc methods. Simplicity > features.

## Core Objects
- **Lead** — customer enquiry with status pipeline, source, priority, value, assigned staff, notes.
- **FollowUp** — date/time, responsible person, recommended action, priority, completion status.
- **TimelineEntry** — chronological activity log per lead.
- **RescueCandidate** — derived view of leads needing attention (overdue follow-ups, unanswered enquiries, stale quotations).
- **PerformanceMetric** — monthly roll-ups for Website, SEO+AEO, Chatbot, Voice Assistant.
- **TeamMember** — name, role (Owner/Manager/Staff), email.

## MVP (v1) — Checklist
- [ ] Home dashboard: 4 summary cards + Today's Priorities (max 5)
- [ ] My Leads: list view (default) + pipeline view (drag-to-move)
- [ ] Lead detail page with quick actions + activity timeline
- [ ] Follow-up system: create, complete, overdue detection
- [ ] Lead Rescue: weekly candidates with reason, recommended action, priority
- [ ] Performance dashboard: 4 service areas, plain-language metrics
- [ ] Lead status pipeline: New → Contacted → Qualified → Quotation Sent → Follow-Up → Won → Lost
- [ ] Seed demo data so screens render without login

## Non-Goals (v1)
- Login/auth wall (later sprint)
- abcstudio Admin multi-client environment
- Configurable lead sources
- Automated outreach / email sending
- Billing / payments
- Mobile push notifications

## Success Criteria
An anonymous visitor opens the app, sees the Home dashboard with seeded leads, clicks a card, views a lead, adds a note, updates status to "Contacted", sets a follow-up for tomorrow, and the timeline reflects all three actions — all without logging in.