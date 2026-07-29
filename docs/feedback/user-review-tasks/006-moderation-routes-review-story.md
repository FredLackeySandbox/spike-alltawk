---
type: route-review-story
source_review: docs/mockup/routes/moderation-routes-review.md
review_fingerprint: sha256:f5c7625c1433f09bd799a0bcb065e2f51f47ebbe6717cdf0af75d0f5b7486ead
source_feedback:
  - docs/feedback/user-review/mockup/routes/006-moderation-routes-review.md
target_artifacts:
  - docs/mockup/routes/moderation-routes.md
---

# Address Moderation Route Review Failures

## Source Feedback

- `docs/feedback/user-review/mockup/routes/006-moderation-routes-review.md`

## Source Review

- `docs/mockup/routes/moderation-routes-review.md`
- Review fingerprint: `sha256:f5c7625c1433f09bd799a0bcb065e2f51f47ebbe6717cdf0af75d0f5b7486ead`

## Target Artifacts

- `docs/mockup/routes/moderation-routes.md`

## User Problem

The moderation queue supplies the report number and conversation UID required to retrieve a ticket, but the concrete successful ticket response documents `participant.postingSuspension` only as `null`. For a ticket whose participant already has an active posting suspension, the contract leaves the public suspension UID and current end time only in prose. A page implementer therefore lacks a concrete response example proving how to obtain the values that must continue into Update Posting Suspension.

## Proposed Change

In the Retrieve Moderation Ticket documentation, add the calibrated concrete existing-suspension response variant to the successful response guidance. The variant must show the exact participant, suspension fields, and representative values approved by the review:

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

This is the smallest coherent documentation change: it makes the already-described active-suspension branch concrete without redesigning the route or changing its existing successful `result: "READY"` status.

## Requirements And Scope Notes

- The calibrated FAIL finding and its complete suggested fix are binding for this story; do not reassess PASS decisions or substitute a different route design.
- The existing `/api/v0` route family is acceptable and remains unchanged.
- Public-safe UIDs, including `participantUid` and `suspensionUid`, are acceptable browser-facing contract values.
- Only the named concrete-example gap is in scope. Preserve the surrounding successful response contract, including `result: "READY"`, and the existing prose for active-suspension behavior.
- Preserve the continuation lineage explicitly: the Retrieve Moderation Ticket existing-suspension response supplies `participant.postingSuspension.suspensionUid` as Update Posting Suspension's `suspensionUid`, and supplies `participant.postingSuspension.endsAt` as Update Posting Suspension's `currentEndsAt`.

## Affected Routes

### Retrieve Moderation Ticket : (`GET /api/v0/moderation/retrieve-moderation-ticket`)

Operations reviewed: `GET /api/v0/moderation/retrieve-moderation-ticket?reportNumber={reportNumber}&conversationUid={conversationUid}`

## Acceptance Criteria

- In `docs/mockup/routes/moderation-routes.md`, the `## Retrieve Moderation Ticket : (`GET /api/v0/moderation/retrieve-moderation-ticket`)` section for `GET /api/v0/moderation/retrieve-moderation-ticket?reportNumber={reportNumber}&conversationUid={conversationUid}` includes a concrete existing-suspension response variant containing exactly this approved example:

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

- The Retrieve Moderation Ticket section makes the active-suspension continuation independently traceable: `participant.postingSuspension.suspensionUid` with representative value `e56f07819abc434da567890abcdef123` is carried into Update Posting Suspension as `suspensionUid`, and `participant.postingSuspension.endsAt` with representative value `2026-07-29T17:00:00-04:00` is carried into Update Posting Suspension as `currentEndsAt`.
- The added variant remains part of the existing successful `result: "READY"` response guidance and does not change the route, query parameters, or public-safe UID contract.
- The updated Retrieve Moderation Ticket documentation contains no stale statement or example that contradicts the concrete active-suspension variant or its carry-forward lineage to Update Posting Suspension.

## Out Of Scope

- Changes to files other than `docs/mockup/routes/moderation-routes.md`.
- Changes to PASS-only routes, except a directly shared example if required to resolve the named failure.
- Application implementation, mockup HTML, schemas, concepts, generated specifications, or route redesign.

## Open Questions

None.
