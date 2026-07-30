# Phase 3 Area Route Drafter Handoff

## Target

- Folder slug: `conversation`
- Platform: desktop
- Route namespace: `conversation`
- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Route file: `docs/mockup/routes/conversation-routes.md`

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/conversation/thread.md`
- `ai-docs/draft-routes/conversation/01-backend-data-action-analyst.md`
- `ai-docs/draft-routes/conversation/02-data-consistency-reviewer.md`

## Complete Approved Action Inventory

The corrected companion contains 13 approved backend actions:

1. `Retrieve Conversation Workspace`
2. `Post Message`
3. `Add Emoji Reaction`
4. `Remove Emoji Reaction`
5. `Retrieve Message Note`
6. `Create Message Note`
7. `Update Message Note`
8. `Retrieve Conversation Note`
9. `Create Conversation Note`
10. `Update Conversation Note`
11. `Submit Message Report`
12. `Delete Message`
13. `Leave Conversation`

## Action-To-Route Coverage Matrix

| Companion action | Drafted route | Coverage decision |
|---|---|---|
| `Retrieve Conversation Workspace` | `GET /api/v0/conversation/retrieve-workspace` | Page-specific authoritative workspace initialization and retry. |
| `Post Message` | `POST /api/v0/conversation/post-message` | Separate durable message creation operation. |
| `Add Emoji Reaction` | `POST /api/v0/conversation/add-emoji-reaction` | Separate reaction creation operation. |
| `Remove Emoji Reaction` | `DELETE /api/v0/conversation/remove-emoji-reaction` | Separate removal of the current participant's reaction. |
| `Retrieve Message Note` | `GET /api/v0/conversation/retrieve-note` | Consolidated with conversation-note retrieval using explicit target context available at invocation. |
| `Create Message Note` | `POST /api/v0/conversation/create-note` | Consolidated target-aware note creation; no existing note UID is required. |
| `Update Message Note` | `PATCH /api/v0/conversation/update-note` | Consolidated existing-note update using the note UID returned by retrieval. |
| `Retrieve Conversation Note` | `GET /api/v0/conversation/retrieve-note` | Consolidated with message-note retrieval using explicit target context available at invocation. |
| `Create Conversation Note` | `POST /api/v0/conversation/create-note` | Consolidated target-aware note creation; no existing note UID is required. |
| `Update Conversation Note` | `PATCH /api/v0/conversation/update-note` | Consolidated existing-note update using the note UID returned by retrieval. |
| `Submit Message Report` | `POST /api/v0/conversation/submit-message-report` | Separate non-idempotent moderation-report invocation. |
| `Delete Message` | `DELETE /api/v0/conversation/delete-message` | Separate soft-deletion operation for an identified message. |
| `Leave Conversation` | `DELETE /api/v0/conversation/leave-conversation` | Separate membership-ending operation with ownership-continuity revalidation. |

Every approved action appears under exactly one route's `### Source Actions`; no unknown companion action was introduced.

## Routes Drafted And Consolidation

Ten unique operations were drafted under the discovery-provided `conversation` namespace. Workspace retrieval, message creation, reaction addition/removal, reporting, message deletion, and membership departure remain page-specific operations because their lifecycle semantics and outcomes are distinct.

The six note actions were consolidated into three shared, target-aware operations:

- `Retrieve Note` covers message-note and conversation-note initialization.
- `Create Note` covers new notes attached to either target and does not require a pre-existing note UID.
- `Update Note` covers existing notes attached to either target and requires the public note UID returned by retrieval.

This consolidation preserves the required create/update lifecycle split and does not resolve or expose the requirements' unresolved note-visibility policy.

## Invocation-Feasibility Findings

- Every operation depends on the current conversation selection. The incoming hub, find, or conversation-related link must carry a safe public conversation UID in the page route; the static mockup does not show a concrete value, so later transport documentation must make this provenance explicit rather than assume hidden frontend state.
- Message posting uses only the current conversation selection and composer text.
- Reaction addition and removal use the current conversation selection, the selected message public UID, and the selected emoji visible at the trigger.
- Message-note retrieval and creation use the selected message public UID. Conversation-note retrieval and creation use the current conversation public UID. A target discriminator is action intent, not hidden business state.
- Note creation occurs before a note public UID exists. Note update is invoked only after retrieval returns an existing safe public note UID and editable content.
- Message reporting uses the selected message public UID and participant-entered explanation. The current conversation and reporting identity are derivable from the page route and authenticated request context.
- Message deletion uses the selected message public UID and explicit confirmation; ownership or moderation permission is revalidated server-side.
- Leaving uses the current conversation selection and explicit confirmation. Current membership, role, and owner continuity are server-derived and must not be supplied as trusted browser decisions.
- No proposed operation requires a database identifier, hidden workflow value, private credential, or version unavailable in its documented page state. If later review determines that note updates require visible concurrency control, the retrieval response must provide that public-safe value before update invocation.

## Page-Specific Actions Preserved

All Conversation page states remain represented: loading, populated, empty, retryable failure, read-only, suspended, last-owner, additional-owner, ordinary member, message-send failure/retry, reaction add/remove, blank and prefilled note forms, stale note/report targets, numbered report creation, permitted message deletion, and allowed or blocked departure.

## Ambiguities

- The mockup does not expose the concrete public conversation UID carried into `conversation/thread.html`. Later phases must document the current page-route source precisely.
- Note visibility remains unresolved by requirements. The route list treats retrieval and mutation as participant-accessible operations without inventing a visibility selector or policy.
- Emoji multiplicity remains unresolved. The draft preserves only the demonstrated per-identity add and remove operations.
- The Phase 1 and Phase 2 handoffs record CSS conflicts that visually defeat some `hidden` states. Requirements and the page catalog remain authoritative for empty-thread and deleted-message outcomes.
- The exact concurrency mechanism for updating an existing note is not specified. Later payload work should add a browser-visible version only if the UI-facing contract needs stale-write protection; it must not invent an internal version value.

## Write-Scope Confirmation

This agent was assigned only the desktop `conversation` work unit. It wrote only:

- `docs/mockup/routes/conversation-routes.md`
- `ai-docs/draft-routes/conversation/03-area-route-drafter.md`

No page companions, mockup HTML/CSS/JavaScript, concept docs, schemas, mock data, package files, OpenAPI files, backend code, frontend business logic, neighboring route files, or downstream phase handoffs were changed.
