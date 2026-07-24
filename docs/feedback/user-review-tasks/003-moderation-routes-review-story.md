---
type: route-review-story
source_review: docs/mockup/routes/moderation-routes-review.md
review_fingerprint: sha256:0cea131aee08d913c9a829689c989bbfdea2cfd68f0db148bf054cf5b2ac3615
source_feedback:
  - docs/feedback/user-review/mockup/routes/003-moderation-routes-review.md
target_artifacts:
  - docs/mockup/routes/moderation-routes.md
---

# Address Moderation Route Review Failures

## Source Feedback

- `docs/feedback/user-review/mockup/routes/003-moderation-routes-review.md`

## Source Review

- `docs/mockup/routes/moderation-routes-review.md` at `sha256:0cea131aee08d913c9a829689c989bbfdea2cfd68f0db148bf054cf5b2ac3615`

## Target Artifacts

- `docs/mockup/routes/moderation-routes.md`

## User Problem

The ticket page cannot reliably continue to Update Posting Suspension for an already-suspended participant because the only concrete Retrieve Moderation Ticket response has `postingSuspension` set to null. The response also returns composed navigation URLs instead of public conversation UIDs, leaving the UX API responsible for page link construction rather than providing the identifiers the page needs.

## Proposed Change

Update the Retrieve Moderation Ticket documentation with a concrete existing-suspension response variant. Preserve the exact suspension UID and current end time required by Update Posting Suspension, and replace `sourceConversationUrl` and `relatedDiscussion.conversationUrl` with the corresponding public conversation UIDs.

## Requirements And Scope Notes

The calibrated finding is binding. `/api/v0` and safe public UIDs remain acceptable. Only the concrete Retrieve Moderation Ticket response-contract gaps named by the review are in scope; the route document must retain the existing route's documented authorization and non-disclosure responsibilities.

## Affected Routes

- `Retrieve Moderation Ticket : (\`GET /api/v0/moderation/retrieve-moderation-ticket\`)`
  - Operations reviewed: `GET /api/v0/moderation/retrieve-moderation-ticket?reportNumber={reportNumber}&conversationUid={conversationUid}`

## Acceptance Criteria

1. In `docs/mockup/routes/moderation-routes.md`, update the `Retrieve Moderation Ticket : (\`GET /api/v0/moderation/retrieve-moderation-ticket\`)` documentation to add a concrete existing-suspension ticket response variant. That variant must provide the public `participant.postingSuspension.suspensionUid` and current `participant.postingSuspension.endsAt` values required for the `PATCH /api/v0/moderation/update-posting-suspension` continuation, while replacing navigation-route strings with public conversation UIDs as follows:

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

2. In the same target route section, make the Retrieve Moderation Ticket existing-suspension response and the `Update Posting Suspension` request lineage agree exactly: the ticket response's `participantUid`, `postingSuspension.suspensionUid`, and `postingSuspension.endsAt` must be the carry-forward values used by the update route's `participantUid`, `suspensionUid`, and `currentEndsAt`.

3. Ensure examples, prose, browser actions, and frontend responsibilities in `docs/mockup/routes/moderation-routes.md` contain no stale contradiction: the UX API must return public conversation UIDs rather than `sourceConversationUrl` or `relatedDiscussion.conversationUrl`, and the page constructs its own navigation links.

## Out Of Scope

- Editing files other than `docs/mockup/routes/moderation-routes.md`.
- Changing PASS-only route contracts except a directly shared example required by a failed route.
- Backend or frontend implementation, mockup HTML, schemas, concepts, generated specifications, or product redesign.

## Open Questions

None
