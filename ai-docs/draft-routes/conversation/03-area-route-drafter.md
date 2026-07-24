# Phase 3 Area Route Drafter Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and folder: desktop `conversation`
- Folder slug: `conversation`
- Route file written: `docs/mockup/routes/conversation-routes.md`
- This agent was assigned only the `conversation` area and wrote only its one route file and this Phase 3 handoff.

All markdown path references in this handoff and in the route file are repository-relative to `solutionArtifactRoot`. Filesystem reads and writes used absolute paths under that root. `projects/**` was not read or changed.

## Inputs Reviewed

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

Every approved action is mapped under exactly one route's `### Source Actions` subsection. No unknown companion action is mapped.

## Action-To-Route Coverage Matrix

| Approved companion action | Route | Method | Coverage finding |
|---|---|---|---|
| `Retrieve Conversation Workspace` | `GET /api/v0/conversation/retrieve-workspace` | GET | Covers loading, retry, populated, empty, read-only, suspended, last-owner, additional-owner, and ordinary-member entry states with UI-ready workspace and allowed-action data. |
| `Post Message` | `POST /api/v0/conversation/post-message` | POST | Creates a new durable message and preserves the retained-draft retry branch. |
| `Add Emoji Reaction` | `POST /api/v0/conversation/add-emoji-reaction` | POST | Adds the current participant's reaction through a non-idempotent create action and returns the visible aggregate. |
| `Remove Emoji Reaction` | `DELETE /api/v0/conversation/remove-emoji-reaction` | DELETE | Removes only the current participant's identified reaction association. |
| `Retrieve Message Note` | `GET /api/v0/conversation/retrieve-message-note` | GET | Supplies blank-create or existing-edit state, editable text, public note UID when present, and stale-target status. |
| `Create Message Note` | `POST /api/v0/conversation/create-message-note` | POST | Creates a new message note without requiring an existing note UID. |
| `Update Message Note` | `PATCH /api/v0/conversation/update-message-note` | PATCH | Updates an existing note identified by the public UID returned from retrieval. |
| `Retrieve Conversation Note` | `GET /api/v0/conversation/retrieve-conversation-note` | GET | Supplies blank-create or existing-edit state and current editable value without inventing note visibility. |
| `Create Conversation Note` | `POST /api/v0/conversation/create-conversation-note` | POST | Creates a new conversation note without requiring an existing note UID. |
| `Update Conversation Note` | `PATCH /api/v0/conversation/update-conversation-note` | PATCH | Updates an existing conversation note identified by the public UID returned from retrieval. |
| `Submit Message Report` | `POST /api/v0/conversation/submit-message-report` | POST | Invokes numbered ticket creation and returns the public ticket number and reported display state. |
| `Delete Message` | `DELETE /api/v0/conversation/delete-message` | DELETE | Soft-deletes an existing selected message while removing it from the visible thread. |
| `Leave Conversation` | `DELETE /api/v0/conversation/leave-conversation` | DELETE | Ends an existing active membership after rechecking owner continuity. |

## Routes Drafted And Consolidation

Thirteen coherent routes were drafted in `docs/mockup/routes/conversation-routes.md`. The action set is already expressed as distinct business lifecycle operations, so collapsing actions further would either blur method semantics or make one route depend on identifiers unavailable in all page states.

- Shared workspace initialization remains one GET route covering all documented conversation entry states.
- Message creation, reaction addition/removal, reporting, message deletion, and membership departure remain distinct invocations because they mutate different durable records or invoke different server-controlled decisions.
- Message-note and conversation-note workflows each preserve separate retrieve, create, and update routes. Retrieval supplies editable data and a public note UID only when a note exists; creation never assumes that UID, while update requires it.
- No preview or execute action for an unsaved draft appears in the approved inventory, so none was invented or dropped.

All routes retain the exact paired mockup references:

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

## Invocation-Feasibility Findings

Every route can be invoked from each page state named by its source action using browser-visible or browser-managed values:

- The incoming conversation link must carry a safe public conversation UID in the current page route. This supports workspace retrieval and every conversation-scoped action without inventing hidden frontend context. The mockup does not expose a concrete example UID, so later payload phases must use a parameterized public value rather than a hard-coded identifier.
- Workspace retrieval returns each visible message's public UID. Message posting uses user-entered text and the current conversation UID. Reaction add/remove use the selected message UID plus the selected emoji. Message reporting uses the selected message UID plus the entered explanation. Message deletion uses the selected message UID plus explicit delete intent.
- Message-note retrieval uses the selected message UID and returns a blank create state or the existing editable note's public UID and text. Message-note creation therefore needs only the message UID and entered text; update uses the note UID carried forward from retrieval, the message UID, and replacement text.
- Conversation-note retrieval uses the current conversation UID and returns a blank create state or the existing editable note's public UID and text. Conversation-note creation needs only the conversation UID and entered text; update uses the note UID carried forward from retrieval, the conversation UID, and replacement text.
- Leaving uses the current conversation UID and explicit leave intent. Current membership, participant identity, role, and the last-owner continuity decision are derived and revalidated by the UX API rather than supplied as browser business-rule inputs.
- Identified participant, membership, permissions, ownership, report numbering, note access, soft-deletion metadata, and authorization decisions remain behind the UI-facing boundary. No route requires a database identifier, raw session value, private workflow state, or lower-layer API contract.
- Branches required for retry, empty content, read-only or suspended posting, stale targets, unauthorized actions, last-owner blocking, allowed departure, and successful continuation are called out in route purposes for later payload elaboration.

## Page-Specific Preservation

The single assigned page's complete action inventory is preserved. Create and update operations are not collapsed into ambiguous Save routes, unsaved creation does not require an existing UID, and updates are continuable with the public note UID returned by their preceding retrieval route.

## Remaining Ambiguities

- Human authentication and its browser transport remain unresolved in the requirements. Later phases must document the selected browser-managed cookie or header context without exposing a raw token or asking the JSON body to supply identity.
- The mockup does not expose a concrete conversation public UID. Route tightening must document how the incoming page route provides the safe public UID.
- Note visibility and emoji multiplicity remain product open questions. The routes intentionally avoid inventing visibility fields, policies, or unsupported emoji rules.
- The source's CSS/`hidden` inconsistencies for empty/deleted messages and alternate leave footers remain presentation inconsistencies. The routes follow the authoritative requirements and corrected companion outcomes.

## Change Boundary Confirmation

- Written: `docs/mockup/routes/conversation-routes.md`
- Written: `ai-docs/draft-routes/conversation/03-area-route-drafter.md`
- No companion, HTML, CSS, JavaScript, concept, schema, mock-data, package, OpenAPI, backend, application API, secure API, frontend-business-logic, or other area's route or handoff file was changed.
- No shared scratch file, alternate route file, or path outside `solutionArtifactRoot` was created.
