---
type: route-review-feedback
source_review: docs/mockup/routes/moderation-routes-review.md
review_fingerprint: sha256:f5c7625c1433f09bd799a0bcb065e2f51f47ebbe6717cdf0af75d0f5b7486ead
target_artifact: docs/mockup/routes/moderation-routes.md
---

# Moderation Routes Review Feedback

This immutable feedback snapshot records the failing route findings from `docs/mockup/routes/moderation-routes-review.md` at review fingerprint `sha256:f5c7625c1433f09bd799a0bcb065e2f51f47ebbe6717cdf0af75d0f5b7486ead`.

## Failing Route Findings

## Retrieve Moderation Ticket : (`GET /api/v0/moderation/retrieve-moderation-ticket`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/moderation/retrieve-moderation-ticket?reportNumber={reportNumber}&conversationUid={conversationUid}`

Reason: The queue response supplies both query values, but the concrete ticket response shows `postingSuspension` only as `null`. The active-suspension branch needed to invoke Update Posting Suspension supplies its public suspension UID and current end time only in prose, not in a concrete response example.

Suggested fix:

Add a concrete existing-suspension response variant showing the exact fields and representative values that the page carries into Update Posting Suspension:

```json
{
  "participant": {
    "participantUid": "c34de56f78a9412ba34567890abcdef1",
    "postingSuspension": {
      "suspensionUid": "e56f07819abc434da567890abcdef123",
      "endsAt": "2026-07-29T17:00:00-04:00"
    }
  }
}
```
