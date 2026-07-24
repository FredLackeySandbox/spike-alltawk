---
type: route-review-feedback
source_review: docs/mockup/routes/governance-routes-review.md
review_fingerprint: sha256:5df1229f3ba61345fb6e68ad5bad3f3e6bb5543467a756879e65c8f087c52236
target_artifact: docs/mockup/routes/governance-routes.md
---

# Governance Routes Review Feedback

This immutable feedback snapshot was created from `docs/mockup/routes/governance-routes-review.md` at fingerprint `sha256:5df1229f3ba61345fb6e68ad5bad3f3e6bb5543467a756879e65c8f087c52236` for route-story creation.

## Failing Route Findings

## Retrieve Conversation Governance : (`GET /api/v0/governance/retrieve-conversation-governance`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}`

Reason: The page route, selected governance page, and documented session cookie can form the request, but the only concrete response example is an array containing both `MEMBERS` and `SETTINGS` objects even though the prose says the selected view returns one view-specific result. The browser therefore lacks an unambiguous concrete response contract for either page.

Suggested fix:

Replace the combined array with two explicitly labeled response examples, each a single object keyed to its request `view`. For example, document the members response as:

```json
{
  "result": "SUCCEEDED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "view": "MEMBERS",
  "lifecycleStatus": "ACTIVE",
  "viewerRole": "OWNER",
  "activeCount": 5,
  "formerCount": 2,
  "ownerContinuity": {
    "isCurrentViewerLastActiveOwner": true,
    "message": "Promote another participant to owner or archive the conversation before leaving."
  },
  "participants": []
}
```

Document the `SETTINGS` response separately as a single object containing the concrete `tags`, `discovery`, `matching`, lifecycle, viewer-role, and `allowedActions` fields already shown in the route file.
