# Phase 3 Area Route Drafter Handoff

## Target And Inputs

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario work unit: desktop `moderation`
- Requirements: `docs/concepts/REQUIREMENTS.md`
- Page catalog: `docs/concepts/APP_PAGES.md`
- Corrected companions:
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/ticket.md`
- Prior handoffs:
  - `ai-docs/draft-routes/moderation/01-backend-data-action-analyst.md`
  - `ai-docs/draft-routes/moderation/02-data-consistency-reviewer.md`

All path references in this handoff and the route file are repository-relative to `solutionArtifactRoot`; filesystem reads and writes used absolute paths under that root.

## Complete Approved Action Inventory

- `docs/mockup/desktop/moderation/index.md`
  - `Retrieve Reviewable Reports`
- `docs/mockup/desktop/moderation/ticket.md`
  - `Retrieve Moderation Ticket`
  - `Create Reviewer Note`
  - `Delete Reported Message`
  - `Create Posting Suspension`
  - `Update Posting Suspension`
  - `Remove Participant`
  - `Ban Participant`

All eight approved actions remain mapped. The suspension lifecycle remains explicitly split between creation without an existing restriction and update of an identified existing restriction.

## Action-To-Route Coverage Matrix

| Companion action | Drafted route | Coverage decision |
| --- | --- | --- |
| `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` | `GET /api/v0/moderation/retrieve-reviewable-reports` | Queue-specific retrieval keeps governed scope, reports, origin preselection, retry, empty, denied, and failure outcomes together. |
| `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket` | `GET /api/v0/moderation/retrieve-moderation-ticket` | Ticket-specific retrieval is step-complete for evidence, notes, participant and suspension state, allowed actions, and optional related discussion. |
| `docs/mockup/desktop/moderation/ticket.md` — `Create Reviewer Note` | `POST /api/v0/moderation/create-reviewer-note` | Non-idempotent durable note creation remains distinct from ticket retrieval and moderation effects. |
| `docs/mockup/desktop/moderation/ticket.md` — `Delete Reported Message` | `DELETE /api/v0/moderation/delete-reported-message` | Soft deletion remains a distinct message lifecycle action with retained evidence and already-deleted handling. |
| `docs/mockup/desktop/moderation/ticket.md` — `Create Posting Suspension` | `POST /api/v0/moderation/create-posting-suspension` | Creates a new durable time-bounded restriction without requiring a pre-existing suspension identifier. |
| `docs/mockup/desktop/moderation/ticket.md` — `Update Posting Suspension` | `PATCH /api/v0/moderation/update-posting-suspension` | Updates one identified existing restriction and preserves shorter-period acknowledgment semantics. |
| `docs/mockup/desktop/moderation/ticket.md` — `Remove Participant` | `DELETE /api/v0/moderation/remove-participant` | Ends active membership while retaining history and allowing later rejoin; it is not merged with ban. |
| `docs/mockup/desktop/moderation/ticket.md` — `Ban Participant` | `POST /api/v0/moderation/ban-participant` | Applies a distinct privileged moderation decision that blocks participation and rejoining while retaining history. |

## Routes Drafted And Consolidation

- Wrote `docs/mockup/routes/moderation-routes.md` with eight route sections.
- Consolidated the queue's initial load, retry, governed-conversation options, authorized origin selection, populated, empty, denied, and failure states under one reviewable-reports retrieval route.
- Consolidated the ticket's initial load, retry, evidence variants, existing notes, participant and suspension state, optional related discussion, allowed actions, and post-action refresh under one step-complete ticket retrieval route.
- Kept note creation, message deletion, suspension creation, suspension update, participant removal, and participant banning distinct because they have different methods, lifecycle preconditions, retained-data effects, and visible outcomes.
- Did not add routes for local filtering, confirmation-dialog presentation, navigation to an existing discussion, unresolved ticket status or assignment behavior, or creating a related moderation discussion.

## Invocation-Feasibility Findings

- The queue retrieval can be invoked on page load without a JSON body. Its optional origin comes from the current queue URL and must be accepted only when it resolves to a conversation the signed-in reviewer currently governs.
- The ticket retrieval can be invoked with the selected report number and source-conversation value carried from the queue into the ticket URL. The UX API must return missing and unauthorized outcomes without revealing ticket evidence.
- The ticket retrieval response must deliberately provide public-safe identifiers for the reported message, target participant, and any current posting suspension, plus editable/current effective suspension values and allowed-action affordances. These values make later ticket actions invocable without hidden frontend state.
- Reviewer-note creation uses the current page's report number and reviewer-entered note text. The authenticated reviewer identity, governed conversation, permissions, authoritative ordering, and duplicate protection stay behind the UX API boundary.
- Reported-message deletion uses the report number and reported-message public identifier returned by ticket retrieval, after explicit confirmation. It does not require the browser to send retained evidence or authorization decisions.
- Posting-suspension creation uses the report number, target participant public identifier, reviewer-entered future end time, and explicit confirmation. It does not require a suspension identifier because no restriction exists in this state.
- Posting-suspension update uses the report number, target participant identifier, public suspension identifier, current effective end carried from ticket retrieval or the create response, replacement end time, and shorter-period acknowledgment when applicable. No invisible record identifier or invented version is assumed.
- Participant removal and banning use the report number and target participant public identifier returned by ticket retrieval, after explicit confirmation. Current membership state, owner-role constraints, and stale-action checks remain server responsibilities.
- Every mutation must return enough display-ready current state to show its applied or already-applied outcome and update available controls without exposing internal permission, membership-history, audit, or database contracts.

## Ambiguities And Constraints

- `docs/mockup/desktop/moderation/index.html` recognizes an `origin` query parameter for queue preselection, while `docs/mockup/desktop/moderation/ticket.html` links back with `conversation=design`. The route draft records the authorized origin concept but does not choose between these inconsistent browser parameter names; Phase 5 should make one browser transport shape explicit from the approved route semantics.
- The ticket URL accepts `ticket` and `conversation`, but the static fixture always renders report `#1048`. The route uses the selected report number and source-conversation value as public continuation inputs because the requirements and page catalog require a selected numbered ticket even though the mockup does not resolve arbitrary values.
- Ticket statuses, assignment, notification, closure, note visibility, suspension lifting, and creation of a related moderation conversation are unresolved or absent from the assigned pages. No routes were invented for them.
- The static mockup has no initial already-suspended ticket scenario and no durable submission-failure presentation for notes or moderation actions. The update route remains required by the reachable post-create Change state.

## Scope Confirmation

- This agent was assigned only the desktop `moderation` area.
- Wrote only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/03-area-route-drafter.md`.
- Did not change companions, HTML, CSS, JavaScript, concept documents, schemas, mock data, package files, application source, OpenAPI files, or any other area's route or handoff.
- The route draft documents only the UI-facing UX API boundary. It does not define payload examples, lower application or secure API contracts, database design, authorization algorithms, validation algorithms, or frontend business rules.
