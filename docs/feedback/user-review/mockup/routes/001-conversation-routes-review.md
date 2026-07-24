---
type: route-review-feedback
source_review: docs/mockup/routes/conversation-routes-review.md
review_fingerprint: sha256:119c07976a9a78d6a255fa484f21568b67756e2dbaac98bc512c8855c8aab7e9
target_artifact: docs/mockup/routes/conversation-routes.md
---

# Conversation Routes Review Feedback

This immutable feedback snapshot was created from `docs/mockup/routes/conversation-routes-review.md` at fingerprint `sha256:119c07976a9a78d6a255fa484f21568b67756e2dbaac98bc512c8855c8aab7e9` for route-story creation.

## Failing Route Findings

## Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}`

Reason: The page can form the request from its incoming public conversation UID and documented session cookie, and the response otherwise supplies the thread data and continuation message UIDs. However, the mockup renders privileged governance links while the response supplies only a role plus posting/leaving decisions; it does not provide server-derived permission flags for tags/lifecycle, member management, or report review, leaving the presentation app to infer authorization from the role or expose controls to an ordinary member.

Suggested fix:

Add explicit server-derived governance action flags to `currentParticipant` so the page can render each privileged link without interpreting role policy:

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

## Retrieve Message Note : (`GET /api/v0/conversation/retrieve-message-note`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/conversation/retrieve-message-note?messageUid={messageUid}`

Reason: The request is formable from the selected workspace message, and the concrete `UPDATE` response supplies the note UID needed by the update operation. The later create action, however, depends on the initializer's `CREATE` form mode, null note, and create permission, which are described only in prose rather than shown in a concrete response; the prose also names the unavailable-target field `isAvailable` while the example uses `targetAvailable`.

Suggested fix:

Use `targetAvailable` consistently and add a concrete create-state response that supplies the exact values the form uses to select the create operation:

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

## Retrieve Conversation Note : (`GET /api/v0/conversation/retrieve-conversation-note`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/conversation/retrieve-conversation-note?conversationUid={conversationUid}`

Reason: The page route and documented cookie make the request formable, and the concrete `UPDATE` response supplies the public note UID needed for updating. The later create action depends on a `CREATE` form mode, null note, and create permission that appear only in prose, so the operation lacks a concrete carry-forward contract for the blank-note lifecycle shown by the mockup.

Suggested fix:

Add a concrete create-state response that unambiguously drives the blank form and its subsequent create operation:

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

## Leave Conversation : (`DELETE /api/v0/conversation/leave-conversation`)

**Decision:** FAIL

Operations reviewed: `DELETE /api/v0/conversation/leave-conversation`

Reason: The public conversation UID and documented session cookie make the request formable, and the concrete `BLOCKED` response supports the last-owner branch. The eligible owner/member flow depends on the prose-only `LEFT` outcome and conversation-list path, so the successful continuation lacks an exact response field/value contract; the blocked response also sends static browser paths that should remain presentation-owned.

Suggested fix:

Add a concrete successful response and let the presentation app map `LEFT` and the blocked action codes to its own routes instead of returning browser paths:

```json
{
  "outcome": "LEFT",
  "confirmationMessage": "You left the conversation."
}
```
