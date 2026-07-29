# Phase 8 OpenAPI Spec Reviewer Handoff

## Target And Scope

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Work unit: desktop `moderation`
- Final Markdown contract: `docs/mockup/routes/moderation-routes.md`
- Reviewed OpenAPI specification: `docs/mockup/routes/moderation-routes.yaml`
- OpenAPI version: `3.1.0`
- Exact source link: `docs/mockup/routes/moderation-routes.md`
- Requirements and page catalog reviewed: `docs/concepts/REQUIREMENTS.md`, `docs/concepts/APP_PAGES.md`
- Source companions reviewed:
  - `docs/mockup/desktop/moderation/index.md`
  - `docs/mockup/desktop/moderation/ticket.md`
- Mockup sources reviewed:
  - `docs/mockup/desktop/moderation/index.html`
  - `docs/mockup/desktop/moderation/ticket.html`
  - `docs/mockup/desktop/assets/app.js`
- Prior handoffs reviewed: `ai-docs/draft-routes/moderation/03-area-route-drafter.md` through `ai-docs/draft-routes/moderation/07-openapi-spec-drafter.md`

All artifact references in this handoff, `x-solpoc-route-markdown`,
`x-solpoc-source-actions`, and `x-solpoc-mockup-files` are repository-relative
to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths
under that root. `projects/**` was not read or changed.

## Spec Coverage Matrix

| Markdown method and path | OpenAPI operationId | Transport and security | Request contract | Response and branch review | Review result |
| --- | --- | --- | --- | --- | --- |
| `GET /api/v0/moderation/retrieve-reviewable-reports` | `retrieveReviewableReports` | Optional `originConversationUid` query value, required JSON `Accept` header, and required browser-managed `tawk_session` cookie are correctly placed | No request body, matching Markdown | `200` preserves the exact READY example and supports empty, DENIED, and FAILED branches; governed conversation and report values remain UI-facing | Added `BOT` to reporter `identityType`, because the cited queue fixture renders a bot reporter and requirements permit bot participants under the same model |
| `GET /api/v0/moderation/retrieve-moderation-ticket` | `retrieveModerationTicket` | Required `reportNumber` and `conversationUid` query values, required JSON `Accept` header, and required session cookie are correctly placed | No request body, matching Markdown | `200` preserves the exact ticket example and nullable suspension/discussion values, retained deletion, unavailable source, missing, unauthorized, failure, timeout, and post-action refresh shapes | Added `FORMER` and `BANNED` to participant `status` so the schema can represent the Markdown's post-removal and post-ban refresh states as well as `ACTIVE` |
| `POST /api/v0/moderation/create-reviewer-note` | `createReviewerNote` | Session-cookie security and JSON request-body media type match Markdown | Required `reportNumber`, `conversationUid`, and reviewer-entered `noteText` exactly match the example | `201` preserves the exact CREATED example and allows the documented UNAVAILABLE or unresolved display-ready validation outcome without inventing a ticket workflow | No correction required |
| `DELETE /api/v0/moderation/delete-reported-message` | `deleteReportedMessage` | Session-cookie security and documented DELETE body match Markdown | Required report, conversation, and reported-message public values exactly match the example | `200` preserves DELETED, ALREADY_DELETED, and UNAVAILABLE semantics and the exact success example | Made `deletedAt` optional inside `reportedMessage`; the Markdown guarantees it in the DELETED example but does not require it in the documented ALREADY_DELETED branch |
| `POST /api/v0/moderation/create-posting-suspension` | `createPostingSuspension` | Session-cookie security and JSON media type match Markdown | Create contract correctly requires no existing suspension UID and accepts only report, conversation, participant, and reviewer-entered end time | `201` preserves CREATED, NOT_APPLICABLE, and REJECTED branches plus the exact success example; the under-specified participant branch was not invented in YAML | No correction required |
| `PATCH /api/v0/moderation/update-posting-suspension` | `updatePostingSuspension` | Session-cookie security and JSON media type match Markdown | Existing suspension UID, current end, replacement end, and shorter-period acknowledgment are correctly required with their continuation values | `200` preserves UPDATED, STALE, and REJECTED branches and the exact update example | No correction required |
| `DELETE /api/v0/moderation/remove-participant` | `removeParticipant` | Session-cookie security and documented DELETE body match Markdown | Required report, conversation, and participant public values exactly match the example | `200` preserves REMOVED, ALREADY_INACTIVE, and UNAVAILABLE branches, retained-history effect, and current action affordances | No correction required |
| `POST /api/v0/moderation/ban-participant` | `banParticipant` | Session-cookie security and JSON media type match Markdown | Required report, conversation, and participant public values exactly match the example | `200` preserves BANNED, ALREADY_BANNED, and UNAVAILABLE branches, retained-history effect, and current action affordances | No correction required |

The Markdown and YAML inventories each contain exactly eight method/path pairs.
Every operation has a unique lower-camel-case `operationId`, summary,
description, `moderation` tag, documented 2xx response,
`x-solpoc-source-actions`, and `x-solpoc-mockup-files`. No route was added,
removed, renamed, split, or merged.

## Corrections Made

- Expanded reviewable-report `reporter.identityType` from only `PERSON` to
  `PERSON` or `BOT`, matching the assigned queue fixture and the product's
  shared person/bot participation model.
- Expanded moderation-ticket `participant.status` from only `ACTIVE` to
  `ACTIVE`, `FORMER`, or `BANNED`, so the finalized route's post-action refresh
  contract can represent the current participant state after removal or ban.
- Removed `deletedAt` from the universally required fields of the
  delete-message response's optional `reportedMessage` object. The concrete
  DELETED example still includes the timestamp, while the documented
  ALREADY_DELETED branch is no longer forced to return an unstated field.
- Tightened `PublicUid.pattern` to enforce a 32-character lowercase hyphenless
  UUID v4, including the version and variant nibbles, rather than accepting any
  32 hexadecimal characters. Every retained Markdown/YAML UID example matches
  the stricter public-safe pattern.

## Checks Requiring No Correction

- The document declares OpenAPI `3.1.0` and preserves the exact top-level
  `x-solpoc-route-markdown` value.
- All request and response examples remain semantically identical to the
  finalized Markdown examples.
- Query and header parameters have correct placement and requiredness; there
  are no path parameters in this area.
- `Authorization` is not modeled as a plain header. The browser-managed
  `tawk_session` cookie is represented by `components.securitySchemes` and
  operation-level security, and no cookie value appears in JSON.
- Request schemas contain only the user-entered and public continuation values
  documented by the UI contract. Reviewer identity, authority, record binding,
  server time, current state, retained history, and data joins remain
  server-side.
- Responses contain display-ready evidence, public navigation or continuation
  UIDs, editable suspension state, effects, and allowed-action affordances.
  They contain no raw credentials, JWTs, private redirect targets, provider
  secrets, hashes, database IDs, audit rows, permission internals, or
  lower-layer contracts.
- Timestamps and report-number examples are quoted where YAML implicit typing
  could otherwise alter their JSON types. The explicit JSON Schema null type is
  also quoted.
- The exact response examples validate against their reviewed schemas, and the
  six JSON request examples match their request schemas and Markdown values.

## Unresolved Blockers

None. The Markdown route contract did not require correction. Unresolved product
topics already recorded in the Markdown and prior handoffs—ticket status,
assignment, notifications, closure, note visibility, suspension lifting, and
related-discussion creation—were not invented in the OpenAPI specification.

## Validator Results

- `validate-route-coverage.mjs`: `ok: true`; eight companion actions, eight
  mapped actions, and eight routes with no blockers.
- `validate-openapi-spec.mjs`: `ok: true`; eight Markdown routes and eight
  OpenAPI operations with exact method/path parity, unique operation IDs,
  required metadata, source linkage, and documented success responses.

## Allowed-Write Confirmation

- Kept `docs/mockup/routes/moderation-routes.md` read-only.
- Changed only `docs/mockup/routes/moderation-routes.yaml` and
  `ai-docs/draft-routes/moderation/08-openapi-spec-reviewer.md`.
- Did not create or modify the final JSON definition, companions, HTML, CSS,
  JavaScript, concept documents, schema documents, source code, package files,
  another area's routes, neighboring review files, or earlier handoffs.
