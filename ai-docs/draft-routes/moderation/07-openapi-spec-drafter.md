# Phase 7 OpenAPI Spec Drafter Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Final Markdown contract: `docs/mockup/routes/moderation-routes.md`
- Drafted OpenAPI specification: `docs/mockup/routes/moderation-routes.yaml`
- OpenAPI version: `3.1.0`
- Exact source link: `docs/mockup/routes/moderation-routes.md`
- Prior handoffs read: `ai-docs/draft-routes/moderation/03-area-route-drafter.md` through `ai-docs/draft-routes/moderation/06-route-payload-reviewer.md`

All artifact references in this handoff, `x-solpoc-route-markdown`, `x-solpoc-source-actions`, and `x-solpoc-mockup-files` are repository-relative to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths under that root. `projects/**` was not read or changed.

## Markdown-to-OpenAPI Coverage Matrix

| Markdown method and path | OpenAPI operationId | Success response | Request representation | Traceability |
| --- | --- | --- | --- | --- |
| `GET /api/v0/moderation/retrieve-reviewable-reports` | `retrieveReviewableReports` | `200` | Optional `originConversationUid` query parameter; required JSON `Accept` header; no request body | Queue companion and both queue mockup files preserved |
| `GET /api/v0/moderation/retrieve-moderation-ticket` | `retrieveModerationTicket` | `200` | Required `reportNumber` and `conversationUid` query parameters; required JSON `Accept` header; no request body | Ticket companion and both ticket mockup files preserved |
| `POST /api/v0/moderation/create-reviewer-note` | `createReviewerNote` | `201` | Required JSON body with report, conversation, and reviewer-entered note values | Ticket companion and both ticket mockup files preserved |
| `DELETE /api/v0/moderation/delete-reported-message` | `deleteReportedMessage` | `200` | Required JSON body with report, conversation, and reported-message public UID | Ticket companion and both ticket mockup files preserved |
| `POST /api/v0/moderation/create-posting-suspension` | `createPostingSuspension` | `201` | Required JSON body with report, conversation, participant public UID, and end time | Ticket companion and both ticket mockup files preserved |
| `PATCH /api/v0/moderation/update-posting-suspension` | `updatePostingSuspension` | `200` | Required JSON body with report, conversation, participant and suspension public UIDs, current and replacement end times, and acknowledgment | Ticket companion and both ticket mockup files preserved |
| `DELETE /api/v0/moderation/remove-participant` | `removeParticipant` | `200` | Required JSON body with report, conversation, and participant public UID | Ticket companion and both ticket mockup files preserved |
| `POST /api/v0/moderation/ban-participant` | `banParticipant` | `200` | Required JSON body with report, conversation, and participant public UID | Ticket companion and both ticket mockup files preserved |

The Markdown and YAML inventories both contain exactly eight method/path pairs. No route was added, removed, renamed, split, or merged.

## Security And Browser Transport

- Added `components.securitySchemes.tawkSession` as an `apiKey` in the `tawk_session` cookie and applied it at operation level to all eight operations.
- The browser-managed opaque cookie is not exposed in JSON examples.
- Represented the two documented `Accept: application/json` values as header parameters.
- Represented `Content-Type: application/json` through each mutation operation's `application/json` request body.
- Represented all documented query values in `parameters`; there are no path placeholders in this area.
- Kept authentication, reviewer identity, current authority, record binding, current state, validation, and retained-history behavior behind the UI-facing boundary.

## Examples And Schemas

- Preserved the exact request example for each of the six mutation routes.
- Preserved the exact response example for all eight routes, including public UIDs, strings, timestamps, booleans, numbers, arrays, nested objects, empty arrays, and the explicit `null` posting-suspension value.
- Modeled the queue's documented `READY`, `DENIED`, and `FAILED` results and optional or omitted collections.
- Modeled the ticket's documented ready, missing, unauthorized, failed, timeout, retained-deletion, unavailable-source, related-discussion, and existing-suspension shapes without adding lower-layer data.
- Modeled each mutation's documented semantic result branches in its response schema while retaining only the HTTP success status explicitly justified by the Markdown semantics.
- Reused components only for genuinely shared public UID, reviewer note, posting suspension, display effect, participant state, action-affordance, and session-cookie contracts.
- Quoted timestamps, report-number strings, the YAML `null` type string, and other scalars where YAML could otherwise change the represented type.

## Ambiguities

- The Markdown documents alternate semantic result branches but does not assign separate HTTP status codes to them. The specification preserves those branches within the documented route response contract and does not invent additional HTTP errors.
- The invalid reviewer-note branch names a display-ready validation outcome without defining its exact result enum value or fields. Its result remains a documented string rather than inventing a new enum or validation payload.
- The posting-suspension `NOT_APPLICABLE` branch mentions current display-ready participant state without defining its exact object fields. The schema preserves that documented object branch without inventing participant fields.
- Queue URL normalization, the fixture's fixed report number, initially suspended ticket fixture coverage, and unresolved ticket workflow topics remain as recorded in the Phase 3 through Phase 6 handoffs; no OpenAPI fields or routes were invented for them.
- No blocker required a Markdown contract correction.

## Validation And Allowed-Write Confirmation

- Ran `validate-openapi-spec.mjs` scoped to folder slug `moderation`.
- Validator result: `ok: true`.
- Validator confirmed OpenAPI `3.1.0`, exact Markdown source linkage, eight Markdown routes, eight OpenAPI operations, exact method/path parity, unique operation IDs, operation metadata, and documented success responses with no blockers.
- Kept `docs/mockup/routes/moderation-routes.md` read-only.
- Changed only `docs/mockup/routes/moderation-routes.yaml` and `ai-docs/draft-routes/moderation/07-openapi-spec-drafter.md`.
- Did not create or modify JSON, companions, mockups, concept documents, schemas, source code, package files, another area's routes, neighboring review files, or downstream handoffs.
