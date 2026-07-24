# Conversation Routes Review Changes

## Implementation Handoff

- Story base: `001-conversation-routes-review`
- Story: `docs/feedback/user-review-tasks/001-conversation-routes-review-story.md`
- Source feedback reviewed:
  - `docs/feedback/user-review/mockup/routes/001-conversation-routes-review.md`
- Target artifact changed:
  - `docs/mockup/routes/conversation-routes.md`

## Implementation Summary

- Added server-derived conversation governance permission flags to the Retrieve Conversation Workspace response and documented that the presentation app renders governance controls from those flags rather than interpreting the participant role as permission policy.
- Standardized Retrieve Message Note availability terminology on `targetAvailable`, added the concrete blank-note `CREATE` response, and documented that its public `messageUid` is carried into Create Message Note.
- Added the concrete Retrieve Conversation Note blank-note `CREATE` response and documented that this state selects Create Conversation Note.
- Added the concrete successful `LEFT` response for Leave Conversation. Retained the `MANAGE_OWNERS` and `ARCHIVE_CONVERSATION` blocked action codes, removed static browser paths, and assigned conversation-list and governance-route mapping to the presentation app.

## Acceptance Criteria Checklist

1. **Implemented** — Retrieve Conversation Workspace now includes `canManageTagsAndLifecycle: true`, `canManageMembers: true`, and `canReviewReports: true` in `currentParticipant`, alongside the required participant identity, role, posting/leaving decisions, and exact owner-continuity reason.
2. **Implemented** — Retrieve Message Note now uses `targetAvailable` consistently in prose and examples. Its concrete `CREATE` state contains the required public `messageUid`, `targetAvailable: true`, null `note`, `canCreate: true`, and `canUpdate: false`. The prose and existing Create Message Note request both carry `7c9e6679742f40de944be07fc1f90ae7` into `POST /api/v0/conversation/create-message-note`.
3. **Implemented** — Retrieve Conversation Note now includes the concrete `CREATE` state with null `note`, `canCreate: true`, and `canUpdate: false`, and its request context explicitly selects `POST /api/v0/conversation/create-conversation-note`.
4. **Implemented** — Leave Conversation now includes the exact `LEFT` outcome and confirmation. Its `BLOCKED` response retains both required action codes without `browserPath`, and the presentation app owns navigation mapping.
5. **Implemented** — The changed sections consistently use server-derived governance flags, `targetAvailable`, downstream create-operation selection, and presentation-owned route mapping without stale contradictory language.

## Suggested-Fix Traceability

### Retrieve Conversation Workspace — Example Response Payload

The fenced `currentParticipant` object contains:

- `displayName: "Maya Chen"`
- `role: "OWNER"`
- `canPost: false`
- `canLeave: false`
- `canManageTagsAndLifecycle: true`
- `canManageMembers: true`
- `canReviewReports: true`
- `leaveBlockReason: "Transfer ownership or archive this conversation before leaving."`

These values are implemented in `Retrieve Conversation Workspace` → `Example Response Payload`. Its `Request Context` states that the presentation app uses the three governance flags instead of interpreting `role`.

### Retrieve Message Note — Blank-note CREATE State

The fenced `CREATE` response in `Retrieve Message Note` → `Example Response Payload` contains:

- `formMode: "CREATE"`
- `messageUid: "7c9e6679742f40de944be07fc1f90ae7"`
- `targetAvailable: true`
- `note: null`
- `allowedActions.canCreate: true`
- `allowedActions.canUpdate: false`

The same `messageUid` remains in the existing Create Message Note request payload, and Retrieve Message Note `Request Context` explicitly identifies `POST /api/v0/conversation/create-message-note` as the create continuation.

### Retrieve Conversation Note — Blank-note CREATE State

The fenced `CREATE` response in `Retrieve Conversation Note` → `Example Response Payload` contains:

- `formMode: "CREATE"`
- `note: null`
- `allowedActions.canCreate: true`
- `allowedActions.canUpdate: false`

Retrieve Conversation Note `Request Context` explicitly identifies `POST /api/v0/conversation/create-conversation-note` as the operation selected by this state.

### Leave Conversation — Successful LEFT State

The fenced successful response in `Leave Conversation` → `Example Response Payload` contains:

- `outcome: "LEFT"`
- `confirmationMessage: "You left the conversation."`

The adjacent fenced `BLOCKED` response retains `MANAGE_OWNERS` and `ARCHIVE_CONVERSATION` action codes and contains no static browser paths. The route overview and `Request Context` assign conversation-list and governance-route selection to the presentation app.

## Validation And Consistency Checks

- Read the story, complete source feedback including every full `Suggested fix:` block, and the complete target artifact before editing.
- Parsed all 26 fenced JSON example blocks in the final target artifact successfully.
- Checked for the required governance fields, both concrete note `CREATE` contracts, both downstream create-operation names, the `LEFT` outcome and confirmation, and both blocked action codes.
- Searched for stale `isAvailable`; no occurrence remains. `targetAvailable` is used in the message-note prose and both message-note examples.
- Searched for stale `browserPath`, `conversation-list browser path`, and `safe browser navigation actions`; no occurrence remains.
- Checked that governance prose rejects presentation-side role-policy interpretation.
- Checked that the Create Message Note request still uses the exact `messageUid` returned by the new initializer `CREATE` example.
- Checked that the conversation-note initializer explicitly selects Create Conversation Note.
- Checked that the final `BLOCKED` and `LEFT` examples agree with the presentation-owned navigation prose.

## Files Changed

- `docs/mockup/routes/conversation-routes.md`
- `docs/feedback/user-review-tasks/001-conversation-routes-review-changes.md`

## Corrections, Compromises, Blockers, And Residual Risks

- Corrections: the four failed route sections were corrected as specified.
- Compromises: none.
- Blockers: none.
- Residual risk: this change validates the Markdown route contracts only; runtime backend and presentation-app conformance were not assessed because implementation is out of scope.
- Scope confirmation: no out-of-scope files were intentionally modified.

## Peer Documentation Review

### Acceptance-Criteria Status

1. **Implemented and peer-verified** — The Retrieve Conversation Workspace fenced response contains the exact required `currentParticipant` identity, role, posting/leaving decisions, all three server-derived governance flags set to `true`, and the exact owner-continuity reason. Its request context directs the presentation app to render governance controls from those flags instead of interpreting `role`.
2. **Implemented and peer-verified** — Retrieve Message Note consistently uses `targetAvailable`. Its fenced blank-note `CREATE` response contains the exact required public `messageUid`, `targetAvailable: true`, null `note`, `canCreate: true`, and `canUpdate: false`. That same UID is carried into the fenced Create Message Note request for `POST /api/v0/conversation/create-message-note`.
3. **Implemented and peer-verified** — Retrieve Conversation Note contains the exact required fenced blank-note `CREATE` response, and its request context explicitly selects `POST /api/v0/conversation/create-conversation-note`.
4. **Implemented and peer-verified** — Leave Conversation contains the exact fenced successful `LEFT` response. The fenced `BLOCKED` response retains `MANAGE_OWNERS` and `ARCHIVE_CONVERSATION` without `browserPath`, and the prose assigns conversation-list and governance navigation to the presentation app.
5. **Implemented and peer-verified** — Prose, examples, downstream request data, browser responsibilities, and presentation-owned route mapping are mutually consistent across the changed contract areas.

### Peer-Reviewed Suggested-Fix Traceability

- **Retrieve Conversation Workspace → Example Response Payload:** the fenced full response contains the required `currentParticipant` subset with `displayName: "Maya Chen"`, `role: "OWNER"`, `canPost: false`, `canLeave: false`, `canManageTagsAndLifecycle: true`, `canManageMembers: true`, `canReviewReports: true`, and `leaveBlockReason: "Transfer ownership or archive this conversation before leaving."`
- **Retrieve Message Note → Example Response Payload → Blank-note `CREATE` state:** the fenced block exactly preserves `formMode: "CREATE"`, `messageUid: "7c9e6679742f40de944be07fc1f90ae7"`, `targetAvailable: true`, `note: null`, `allowedActions.canCreate: true`, and `allowedActions.canUpdate: false`. The same UID appears in the fenced Create Message Note request payload.
- **Retrieve Conversation Note → Example Response Payload → Blank-note `CREATE` state:** the fenced block exactly preserves `formMode: "CREATE"`, `note: null`, `allowedActions.canCreate: true`, and `allowedActions.canUpdate: false`; the surrounding request context maps this state to the create operation.
- **Leave Conversation → Example Response Payload → Successful `LEFT` response:** the fenced block exactly preserves `outcome: "LEFT"` and `confirmationMessage: "You left the conversation."` The adjacent `BLOCKED` block preserves both required action codes and has no static browser route values.

### Peer Corrections

- No target-artifact correction was needed. The Route Documentation Developer's implementation already satisfied the binding story and contained no concrete in-scope inconsistency.
- The Peer Documentation Reviewer added this final review section to the changes report.

### Files Changed Across Both Phases

- `docs/mockup/routes/conversation-routes.md`
- `docs/feedback/user-review-tasks/001-conversation-routes-review-changes.md`

### Peer Validation And Consistency Checks

- Read the complete story, immutable source feedback, target route artifact, and implementation changes report.
- Reviewed every FAIL section through the end of its complete `Suggested fix:` block.
- Parsed all 26 fenced JSON examples in the target route artifact successfully.
- Compared all four binding suggested-fix JSON examples with their final target sections. The governance object is an exact subset of the complete workspace response; the other three are exact standalone fenced blocks.
- Confirmed the message-note `CREATE` response and Create Message Note request share the exact public message UID `7c9e6679742f40de944be07fc1f90ae7`.
- Searched the target artifact for stale `isAvailable`; none remains. Message-note availability uses `targetAvailable`.
- Searched the target artifact for stale `browserPath`; none remains.
- Confirmed the blocked branch retains `MANAGE_OWNERS` and `ARCHIVE_CONVERSATION`, while `LEFT` and blocked action navigation remain presentation-owned.
- Confirmed workspace governance prose prohibits presentation-side interpretation of `role` as permission policy and agrees with the server-derived flags in the response.

### Scope-Drift Check

- The implementation is limited to the listed conversation route artifact and this changes report.
- No PASS-only contract was redesigned; the existing Create Message Note request is used only to verify the story-required UID carry-forward relationship.
- No story, fix, source feedback, concept, schema, mockup HTML, application source, package, or generated-specification file was intentionally modified.

### Residual Risks

- Runtime backend behavior and presentation-app navigation were not tested; this workflow validates the approved Markdown route contract only, as required by the story's out-of-scope limits.
- No blocker remains in the route documentation.

### Final Status

`done with residual risks`
