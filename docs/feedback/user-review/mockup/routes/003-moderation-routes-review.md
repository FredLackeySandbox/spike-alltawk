---
type: route-review-feedback
source_review: docs/mockup/routes/moderation-routes-review.md
review_fingerprint: sha256:0cea131aee08d913c9a829689c989bbfdea2cfd68f0db148bf054cf5b2ac3615
target_artifact: docs/mockup/routes/moderation-routes.md
---

# Moderation Routes Review Feedback

This immutable feedback snapshot was created from `docs/mockup/routes/moderation-routes-review.md` at fingerprint `sha256:0cea131aee08d913c9a829689c989bbfdea2cfd68f0db148bf054cf5b2ac3615` for route-story creation.

## Failing Route Findings

## Retrieve Moderation Ticket : (`GET /api/v0/moderation/retrieve-moderation-ticket`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/moderation/retrieve-moderation-ticket?reportNumber={reportNumber}&conversationUid={conversationUid}`

Reason: The queue response supplies both query values, but the only concrete ticket response shows `postingSuspension` as null even though an already-suspended ticket must supply the suspension UID and current end time needed by Update Posting Suspension. The response also crosses presentation composition into the UX API by returning `sourceConversationUrl` and `relatedDiscussion.conversationUrl` instead of public UIDs from which the page can construct its own links.

Suggested fix:

Add a concrete existing-suspension ticket response variant that carries the exact update values, and replace navigation-route strings with public conversation UIDs:

```json
{
  "conversation": {
    "conversationUid": "a12bc34d56ef4789a1234567890abcde",
    "sourceAvailable": true
  },
  "participant": {
    "participantUid": "c34de56f78a9412ba34567890abcdef1",
    "postingSuspension": {
      "suspensionUid": "e56f07819abc434da567890abcdef123",
      "endsAt": "2026-07-29T17:00:00-04:00"
    }
  },
  "relatedDiscussion": {
    "conversationUid": "f6701892abcd445ea67890abcdef1234",
    "tags": [
      "#mod-review",
      "#ticket-1048"
    ]
  }
}
```
