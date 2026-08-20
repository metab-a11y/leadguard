# LeadGuard — Intelligence Layer

## Messy Inputs
- Lead summaries from chatbot/voice may be raw transcripts.
- Performance data arrives as raw numbers; needs plain-language translation.

## Auto-Structure Schema
```json
{
  "lead_summary": {
    "value": "Customer asked about website revamp pricing",
    "source": "chatbot",
    "confidence": 0.85,
    "review_status": "unreviewed"
  },
  "priority_score": {
    "value": "Important",
    "source": "rule_engine",
    "confidence": 1.0,
    "review_status": "auto"
  },
  "rescue_reason": {
    "value": "No follow-up recorded after quotation",
    "source": "rule_engine",
    "confidence": 1.0,
    "review_status": "auto"
  },
  "metric_label": {
    "value": "Fewer people clicked through from search this month",
    "source": "ai_summary",
    "confidence": 0.8,
    "review_status": "unreviewed"
  }
}
```

## Events Tracked
- Lead created, status changed, note added, follow-up set/completed, quotation sent.
- Each writes a timeline entry.

## Scoring Rules (v1, rule-based)
- **Priority ranking** (for Today's Priorities): overdue follow-up = 100pts; unanswered new enquiry >24h = 80pts; quotation sent >3 days no follow-up = 70pts; no activity >7 days = 50pts. Max 5 shown.
- **Rescue priority**: High = overdue + status in (Qualified/Quotation Sent); Medium = follow-up due soon; Watch = no activity > configurable days (default 14).
- **Health**: Active = last_contact <7d AND next_follow_up exists; Needs Attention = overdue follow-up or unanswered; At Risk = no activity >14d; Closed = Won/Lost.

## What Gets Ranked
- Today's Priorities (top 5 actions by score)
- Rescue candidates (by rescue priority High→Watch)

## v1 vs Later
- v1: deterministic rules only, static fallback copy.
- Later: AI-generated summaries for performance, smart recommended actions, auto-priority suggestions.