---
type: route-review-story
source_review: docs/mockup/routes/conversation-routes-review.md
review_fingerprint: sha256:119c07976a9a78d6a255fa484f21568b67756e2dbaac98bc512c8855c8aab7e9
source_feedback:
  - docs/feedback/user-review/mockup/routes/001-conversation-routes-review.md
target_artifacts:
  - docs/mockup/routes/conversation-routes.md
---

# Address Conversation Route Review Failures

## Source Feedback

- `docs/feedback/user-review/mockup/routes/001-conversation-routes-review.md`

## Source Review

- `docs/mockup/routes/conversation-routes-review.md` at `sha256:119c07976a9a78d6a255fa484f21568b67756e2dbaac98bc512c8855c8aab7e9`

## Target Artifacts

- `docs/mockup/routes/conversation-routes.md`

## User Problem

The conversation workspace cannot safely render privileged governance links because its response lacks server-derived governance permissions. The message-note and conversation-note initializers do not provide concrete `CREATE` response contracts for the blank-note lifecycles that lead to their create operations, and the message-note availability field is inconsistent. Leaving a conversation lacks a concrete successful continuation contract and currently makes the UX API provide presentation-owned browser paths.

## Proposed Change

Update the four failed route sections in `docs/mockup/routes/conversation-routes.md`: add the approved governance flags to the workspace response; standardize message-note availability and document its concrete create state; document the conversation-note concrete create state; and document a concrete `LEFT` response while keeping route mapping for `LEFT` and blocked action codes in the presentation app.

## Requirements And Scope Notes

The calibrated findings are binding. Keep the `/api/v0` route shapes and safe public UIDs acceptable. Only the concrete contract gaps named by the review are in scope: the target document must retain server-derived authorization and must not require the browser to infer role policy or consume server-provided browser paths.

## Affected Routes

- Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)
  - Operations reviewed: `GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}`
- Retrieve Message Note : (`GET /api/v0/conversation/retrieve-message-note`)
  - Operations reviewed: `GET /api/v0/conversation/retrieve-message-note?messageUid={messageUid}`
- Retrieve Conversation Note : (`GET /api/v0/conversation/retrieve-conversation-note`)
  - Operations reviewed: `GET /api/v0/conversation/retrieve-conversation-note?conversationUid={conversationUid}`
- Leave Conversation : (`DELETE /api/v0/conversation/leave-conversation`)
  - Operations reviewed: `DELETE /api/v0/conversation/leave-conversation`

## Acceptance Criteria

1. In the **Retrieve Conversation Workspace** (`GET /api/v0/conversation/retrieve-workspace`) Example Response Payload, document the server-derived governance flags in `currentParticipant` so each privileged governance link can be rendered without the presentation app interpreting role policy:

   ```json
   {
     "currentParticipant": {
       "displayName": "Maya Chen",
       "role": "OWNER",
       "canPost": false,
       "canLeave": false,
       "canManageTagsAndLifecycle": true,
       "canManageMembers": true,
       "canReviewReports": true,
       "leaveBlockReason": "Transfer ownership or archive this conversation before leaving."
     }
   }
   ```

2. In the **Retrieve Message Note** (`GET /api/v0/conversation/retrieve-message-note`) Request Context and Example Response Payload documentation, use `targetAvailable` consistently; replace the unavailable-target prose reference to `isAvailable` with `targetAvailable`. Add a concrete `CREATE` state response that provides the exact values used to select the later Create Message Note operation:

   ```json
   {
     "formMode": "CREATE",
     "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
     "targetAvailable": true,
     "note": null,
     "allowedActions": {
       "canCreate": true,
       "canUpdate": false
     }
   }
   ```

   The documented `messageUid` from this `CREATE` response must remain the concrete public message UID carried into `POST /api/v0/conversation/create-message-note`; the `formMode`, null `note`, and `allowedActions.canCreate`/`canUpdate` values must agree with that create-operation selection.

3. In the **Retrieve Conversation Note** (`GET /api/v0/conversation/retrieve-conversation-note`) Example Response Payload documentation, add a concrete `CREATE` state response that unambiguously drives the blank form and its subsequent Create Conversation Note operation:

   ```json
   {
     "formMode": "CREATE",
     "note": null,
     "allowedActions": {
       "canCreate": true,
       "canUpdate": false
     }
   }
   ```

   The `CREATE` form mode, null `note`, and `allowedActions.canCreate`/`canUpdate` values must agree with the documented blank-form lifecycle and selection of `POST /api/v0/conversation/create-conversation-note`.

4. In the **Leave Conversation** (`DELETE /api/v0/conversation/leave-conversation`) Request Context and Example Response Payload documentation, add the concrete successful `LEFT` response and make the presentation app map `LEFT` and blocked action codes to its own routes rather than returning browser paths from the UX API:

   ```json
   {
     "outcome": "LEFT",
     "confirmationMessage": "You left the conversation."
   }
   ```

   The `BLOCKED` branch must retain action codes but must not document static `browserPath` values; the `LEFT` response must provide the exact outcome and confirmation above, while the presentation app owns navigation to the conversation list and governance routes.

5. Across the changed target-route documentation, examples, prose, browser actions, and frontend responsibilities contain no stale contradiction: governance controls rely on the documented server-derived flags; message-note availability is consistently `targetAvailable`; create-state examples agree with their downstream create operations; and `LEFT` plus blocked action-code route mapping remains presentation-owned.

## Out Of Scope

- Editing files other than `docs/mockup/routes/conversation-routes.md`.
- Changing PASS-only route contracts except a directly shared example required by a failed route.
- Backend or frontend implementation, mockup HTML, schemas, concepts, generated specifications, or product redesign.

## Open Questions

None
