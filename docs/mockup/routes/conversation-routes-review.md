# Conversation Routes Review

Review target: `docs/mockup/routes/conversation-routes.md`
Reviewer: Route File Reviewer

## Summary

- Routes reviewed: 13
- Decisions: 9 PASS, 4 FAIL

## Route Findings

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

## Post Message : (`POST /api/v0/conversation/post-message`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/post-message`

The current page route, composer, and documented session cookie provide every request value; the concrete response returns the created display-ready message and public message UID needed for immediate insertion and later message actions, with attribution and permission decisions kept server-side.

## Add Emoji Reaction : (`POST /api/v0/conversation/add-emoji-reaction`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/add-emoji-reaction`

The selected message UID is available from workspace state and the emoji is visible interaction state; the response returns the exact updated aggregate the chip needs, while identity, access, and reaction-rule decisions remain behind the UX API.

## Remove Emoji Reaction : (`DELETE /api/v0/conversation/remove-emoji-reaction`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/conversation/remove-emoji-reaction`

The active reaction control supplies both the workspace-provided message UID and emoji, and the response concretely returns the remaining count and current-participant state without exposing another participant's reaction records or internal identifiers.

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

## Create Message Note : (`POST /api/v0/conversation/create-message-note`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/create-message-note`

The message UID is present in loaded page state and the text is collected by the note form; the UX API derives note identity and access, and the concrete response returns the server-issued public note UID plus the display indicator needed after creation.

## Update Message Note : (`PATCH /api/v0/conversation/update-message-note`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/conversation/update-message-note`

The note UID is concretely returned by note retrieval and the replacement text comes from the open form; the response confirms the updated public note and display indicator while attachment resolution and authorization remain server-side.

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

## Create Conversation Note : (`POST /api/v0/conversation/create-conversation-note`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/create-conversation-note`

The public conversation UID comes from the active page route and the note text from the form; the response returns a server-issued public note UID and confirmation state, without asking the browser to choose visibility or generate identity.

## Update Conversation Note : (`PATCH /api/v0/conversation/update-conversation-note`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/conversation/update-conversation-note`

The note UID is available from the concrete retrieval response and replacement text is visible form state; the UX API resolves the attachment and access, and the concrete response identifies the updated public note with sufficient confirmation data.

## Submit Message Report : (`POST /api/v0/conversation/submit-message-report`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/conversation/submit-message-report`

The selected workspace message supplies its public UID and the participant enters the explanation; the response concretely returns the server-assigned ticket number and thread indicator, while reporter identity, conversation linkage, moderator audience, and numbering stay server-owned.

## Delete Message : (`DELETE /api/v0/conversation/delete-message`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/conversation/delete-message`

The selected visible message supplies its public UID and invocation follows the local confirmation; the concrete response identifies exactly which message to remove, while authorship, moderation permission, and retained soft-deletion data remain behind the UX API.

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
