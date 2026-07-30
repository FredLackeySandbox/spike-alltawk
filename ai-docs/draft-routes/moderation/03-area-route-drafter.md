# Phase 3 Area Route Drafter Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Platform/work unit: desktop `moderation`
- Discovery-provided route namespace: `moderation`
- Page catalog: `docs/concepts/APP_PAGES.md`

All markdown paths in this handoff are repository-relative to `solutionArtifactRoot`; filesystem reads and writes used absolute paths beneath that root.

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/desktop/moderation/index.html`
- `docs/mockup/desktop/moderation/index.md`
- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`
- `ai-docs/draft-routes/moderation/01-backend-data-action-analyst.md`
- `ai-docs/draft-routes/moderation/02-data-consistency-reviewer.md`

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

## Action-To-Route Coverage Matrix

| Companion action | Route |
| --- | --- |
| `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports` | `GET /api/v0/moderation/retrieve-reviewable-reports` |
| `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket` | `GET /api/v0/moderation/retrieve-moderation-ticket` |
| `docs/mockup/desktop/moderation/ticket.md` — `Create Reviewer Note` | `POST /api/v0/moderation/create-reviewer-note` |
| `docs/mockup/desktop/moderation/ticket.md` — `Delete Reported Message` | `DELETE /api/v0/moderation/delete-reported-message` |
| `docs/mockup/desktop/moderation/ticket.md` — `Create Posting Suspension` | `POST /api/v0/moderation/create-posting-suspension` |
| `docs/mockup/desktop/moderation/ticket.md` — `Update Posting Suspension` | `PATCH /api/v0/moderation/update-posting-suspension` |
| `docs/mockup/desktop/moderation/ticket.md` — `Remove Participant` | `DELETE /api/v0/moderation/remove-participant` |
| `docs/mockup/desktop/moderation/ticket.md` — `Ban Participant` | `POST /api/v0/moderation/ban-participant` |

Every approved companion action appears exactly once under a route’s `### Source Actions`; no unknown companion action was added.

## Routes Drafted And Consolidation

- Wrote `docs/mockup/routes/moderation-routes.md`.
- Drafted eight unique `/api/v0/moderation/{lowercase-kebab-operation}` identities.
- Queue loading and retry are consolidated under `Retrieve Reviewable Reports`; ticket loading, retry, retained-evidence, missing, unauthorized, source-unavailable, and optional-discussion variants are consolidated under `Retrieve Moderation Ticket`.
- Presentation-only queue filtering and navigation to source, participant context, or an existing private discussion remain outside the route inventory.
- No moderation mutation routes were consolidated because deletion, suspension, removal, and banning have different durable effects and current-state checks.
- `Create Posting Suspension` and `Update Posting Suspension` remain separate routes. Creation does not require an existing restriction identifier, while update operates on the public restriction or continuation reference returned by an earlier visible response.

## Invocation-Feasibility Findings

- `Retrieve Reviewable Reports` is invocable at page load from the authenticated browser context; the optional governed-conversation origin comes from the current queue URL. The server derives reviewer identity, current role, governed conversations, and report visibility.
- `Retrieve Moderation Ticket` is invocable from `ticket.html?ticket={ticket}&conversation={conversation}`, populated by the selected queue result. The ticket route must resolve those public page values without requiring hidden database identifiers.
- `Create Reviewer Note` uses note text entered in the visible form and the report reference available from the current page route or prior ticket response. Reviewer identity, ordering, timestamps, and authorization remain server-side.
- `Delete Reported Message`, `Create Posting Suspension`, `Remove Participant`, and `Ban Participant` use the selected report plus public message or participant references returned by `Retrieve Moderation Ticket`; explicit confirmation and the suspension end time are visible browser inputs where applicable.
- `Update Posting Suspension` is invocable only after the browser has received a public suspension or continuation reference and current effective end time from ticket retrieval or creation. A shorter replacement also carries the visible acknowledgment selected in the confirmation dialog.
- No mutation requires the frontend to supply authenticated identity, role, permissions, ownership, internal membership state, database identifiers, business decisions, or hidden workflow state.

## Page-Specific Actions Preserved

- The queue’s sole backend action remains specific to `docs/mockup/desktop/moderation/index.html`.
- Ticket retrieval, note creation, message deletion, posting-suspension creation and replacement, participant removal, and participant banning remain specific to `docs/mockup/desktop/moderation/ticket.html`.
- All `### Mockup Files` entries name only the assigned HTML and same-basename companion files.

## Unresolved Ambiguities

- `docs/mockup/desktop/moderation/index.html` accepts `origin`, while return links in `docs/mockup/desktop/moderation/ticket.html` use `conversation`; transport tightening should choose one public queue-origin convention without changing the approved action inventory.
- The static ticket does not derive its fixture from the `ticket` and `conversation` URL values. The requirements and corrected companion nevertheless require selected-ticket retrieval from those visible entry values.
- Ticket status, assignment, notification, closure, note visibility, and mandatory related-discussion behavior remain unresolved and were not represented as routes.
- The mockup exposes suspension replacement only after creation in the current session, so later payload and transport phases must ensure ticket retrieval can also return the public continuation values needed when an existing suspension is loaded.

## Scope Confirmation

- This agent was assigned only the desktop `moderation` area.
- Wrote only `docs/mockup/routes/moderation-routes.md` and `ai-docs/draft-routes/moderation/03-area-route-drafter.md`.
- Did not edit companions, HTML, CSS, JavaScript, concept documents, schemas, mock data, application code, package files, OpenAPI files, application API contracts, secure API contracts, backend implementation, or frontend business logic.
