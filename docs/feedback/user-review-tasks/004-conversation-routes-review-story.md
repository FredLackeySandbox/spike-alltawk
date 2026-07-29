---
type: route-review-story
source_review: docs/mockup/routes/conversation-routes-review.md
review_fingerprint: sha256:690b8e4c7cffbd01e854c157ad3a5a6c4b9ad45584392c8639f5b2f62a08cb7b
source_feedback:
  - docs/feedback/user-review/mockup/routes/004-conversation-routes-review.md
target_artifacts:
  - docs/mockup/routes/conversation-routes.md
---

# Address Conversation Route Review Failures

## Source Feedback

- `docs/feedback/user-review/mockup/routes/004-conversation-routes-review.md`

## Source Review

- `docs/mockup/routes/conversation-routes-review.md` at `sha256:690b8e4c7cffbd01e854c157ad3a5a6c4b9ad45584392c8639f5b2f62a08cb7b`

## Target Artifacts

- `docs/mockup/routes/conversation-routes.md`

## User Problem

The Retrieve Conversation Workspace response does not identify which participant summary or message author represents the current participant. The browser therefore cannot reliably render “You” labels, current-participant roster treatment, or own-message treatment. Comparing display names would be unsafe because display names are presentation values rather than stable identity signals.

## Proposed Change

Update the Retrieve Conversation Workspace contract so every participant summary and every retrieved message author includes a server-derived `isCurrentParticipant` boolean. Add the field to the documented example response with the approved representative values, and align the route prose, browser responsibilities, and frontend rendering guidance so the presentation app uses this flag instead of comparing display names.

## Requirements And Scope Notes

The calibrated FAIL finding and its complete suggested-fix block are binding. The existing `/api/v0` route version and use of safe public UIDs remain acceptable. Only the concrete current-participant identification gap named by the review is in scope. The UX API must derive the flag from the identified session and membership context already described by the contract; the browser must not supply identity or permission inputs.

## Affected Routes

- `## Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)`
  - Operations reviewed: `GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}`

## Acceptance Criteria

- In `docs/mockup/routes/conversation-routes.md`, update the `## Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)` contract for `GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}` so each object in `participants` and each `messages[].author` object includes the server-derived boolean field `isCurrentParticipant`.
- In that route's `### Example Response Payload`, preserve the approved field names, nesting, and representative values by including the following structured example:

```json
{
  "participants": [
    {
      "displayName": "Maya Chen",
      "participantType": "PERSON",
      "roleLabel": "Owner",
      "presence": "ACTIVE",
      "isCurrentParticipant": true
    }
  ],
  "messages": [
    {
      "author": {
        "displayName": "Maya Chen",
        "participantType": "PERSON",
        "roleLabel": "Owner",
        "isFormerParticipant": false,
        "isCurrentParticipant": true
      }
    }
  ]
}
```

- In the same route's introductory prose and `### Request Context`, document that the UX API derives `isCurrentParticipant` from the session and membership context and that the presentation app uses it for “You” labels, current-participant roster treatment, and own-message treatment without comparing `displayName`.
- Examples, prose, browser actions, and frontend responsibilities in `docs/mockup/routes/conversation-routes.md` contain no stale contradiction about how the current participant is identified.

## Out Of Scope

- Editing files other than `docs/mockup/routes/conversation-routes.md`.
- Changing PASS-only route contracts except a directly shared example required by a failed route.
- Backend or frontend implementation, mockup HTML, schemas, concepts, generated specifications, or product redesign.

## Open Questions

None
