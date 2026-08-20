# LeadGuard — Test Plan

## v1 Success Scenario (Sprint 1)
1. Open app anonymously → Home/Leads page renders with seeded leads.
2. Click "My Leads" → see 5 leads in list view with all fields.
3. Switch to Pipeline view → see leads in columns by status.
4. Drag a lead from New → Contacted → status persists on refresh.
5. Click a lead → Lead Detail page shows header, quick actions, timeline.
6. Click "Add Note" → enter text → save → timeline shows new entry.
7. Click "Set Follow-Up" → pick tomorrow → save → lead `next_follow_up` updates, timeline shows entry.
8. Click "Update Status" → change to "Quotation Sent" → status updates, timeline shows entry.
9. Refresh page → all changes persisted.

## Dashboard (Sprint 2)
1. Open Home → 4 cards show correct counts from seeded data.
2. Click "New Leads" card → filtered list of New leads.
3. Today's Priorities shows ≤5 items, ranked by urgency.
4. Complete a priority → it disappears from list, card count updates.
5. Open Lead Rescue → see candidates with reasons + actions.
6. Click "Mark Handled" on a rescue card → it leaves the list.

## Empty / Error States
- **No leads:** Leads list shows friendly empty state: "No enquiries yet. New leads will appear here."
- **No follow-ups:** Follow-up section: "You're caught up. No follow-ups scheduled."
- **No rescue candidates:** Rescue page: "Great — no leads need rescue this week."
- **DB error:** Any page shows: "Something went wrong loading this page. Please try again."
- **Loading:** Skeleton cards / spinner while data fetches.

## Performance (Sprint 3)
1. Open Performance → 4 service areas render with seeded metrics.
2. Each area shows plain-language summary, not raw numbers alone.
3. Website area shows enquiry count + trend.
4. Voice area shows "calls requiring staff follow-up" question.

## Auth Lock-Down (Sprint 5)
1. Logged out → redirect to /login.
2. Log in → see only own tenant's data.
3. Staff user → see only assigned leads.
4. Manager → see all leads, no Team/Settings admin.