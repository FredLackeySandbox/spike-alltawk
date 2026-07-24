---
type: route-review-story
source_review: docs/mockup/routes/governance-routes-review.md
review_fingerprint: sha256:5df1229f3ba61345fb6e68ad5bad3f3e6bb5543467a756879e65c8f087c52236
source_feedback:
  - docs/feedback/user-review/mockup/routes/002-governance-routes-review.md
target_artifacts:
  - docs/mockup/routes/governance-routes.md
---

# Address Governance Route Review Failures

## Source Feedback

- `docs/feedback/user-review/mockup/routes/002-governance-routes-review.md`

## Source Review

- `docs/mockup/routes/governance-routes-review.md` at `sha256:5df1229f3ba61345fb6e68ad5bad3f3e6bb5543467a756879e65c8f087c52236`

## Target Artifacts

- `docs/mockup/routes/governance-routes.md`

## User Problem

The `Retrieve Conversation Governance` route documents that the selected governance view returns one view-specific result, but its only concrete response example is a combined array containing both `MEMBERS` and `SETTINGS` objects. Consequently, the members and settings browser pages lack an unambiguous response contract for the selected view.

## Proposed Change

Replace the combined `Example Response Payload` array for the retrieve-governance route with two explicitly labeled, single-object response examples: one keyed to `view: "MEMBERS"` and one keyed to `view: "SETTINGS"`. Retain the concrete view-specific fields already documented for each response.

## Requirements And Scope Notes

The calibrated finding is binding. Keep the `/api/v0` route, browser-managed session-cookie transport, and safe public UIDs acceptable as currently documented. Only the concrete selected-view response-contract gap named by the review is in scope; do not change the request contract or make product decisions.

## Affected Routes

- `Retrieve Conversation Governance : (GET /api/v0/governance/retrieve-conversation-governance)`
  - Operations reviewed: `GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}`

## Acceptance Criteria

1. In `docs/mockup/routes/governance-routes.md`, replace the combined array under `## Retrieve Conversation Governance : (GET /api/v0/governance/retrieve-conversation-governance)` → `### Example Response Payload` with two explicitly labeled response examples. Each example must be one JSON object, not an array, and must be keyed to its corresponding requested `view` value.

2. The explicitly labeled `MEMBERS` response example must document a single object with the concrete selected-view contract below, including `view: "MEMBERS"`, lifecycle and viewer-role state, counts, ownership-continuity state, and `participants`:

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

3. The explicitly labeled `SETTINGS` response example must document this separate single object keyed to `view: "SETTINGS"`; it must not be combined with the `MEMBERS` response in an array:

```json
{
  "result": "SUCCEEDED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "view": "SETTINGS",
  "lifecycleStatus": "ACTIVE",
  "viewerRole": "OWNER",
  "currentStep": "SETTINGS",
  "tags": [
    "design-systems",
    "accessibility",
    "frontend",
    "product-design"
  ],
  "tagCount": 4,
  "discovery": {
    "visibility": "LISTED",
    "displayLabel": "Listed"
  },
  "matching": {
    "mode": "EXCLUSIVE",
    "displayLabel": "Exclusive",
    "displayMeaning": "People find this conversation only when their search matches the complete tag set."
  },
  "allowedActions": [
    "UPDATE_CONVERSATION_TAGS",
    "ARCHIVE_CONVERSATION"
  ]
}
```

4. The route’s examples, prose, browser actions, and frontend responsibilities must contain no stale contradiction: the request’s selected `view` must correspond to exactly one view-specific response object, and the members and settings examples must not imply both views are returned together.

## Out Of Scope

- Editing files other than `docs/mockup/routes/governance-routes.md`.
- Changing PASS-only route contracts except a directly shared example required by a failed route.
- Backend or frontend implementation, mockup HTML, schemas, concepts, generated specifications, or product redesign.

## Open Questions

None
