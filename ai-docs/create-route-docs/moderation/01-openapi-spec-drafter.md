# Moderation OpenAPI Spec Drafter Handoff

## Markdown-to-OpenAPI Coverage Matrix

| Markdown operation | OpenAPI operation | Request contract | Success contract |
| --- | --- | --- | --- |
| Retrieve Reviewable Reports | `GET /api/v0/moderation/retrieve-reviewable-reports` | `originConversationUid` query value, JSON accept header, and shared session cookie security | `200` queue, denied, and failure result family |
| Retrieve Moderation Ticket | `GET /api/v0/moderation/retrieve-moderation-ticket` | Required `reportNumber` and `conversationUid` query values, JSON accept header, and shared session cookie security | `200` ticket or non-disclosing outcome family |
| Create Reviewer Note | `POST /api/v0/moderation/create-reviewer-note` | JSON `reportNumber`, `conversationUid`, and `noteText` | `201` created-note result family |
| Delete Reported Message | `DELETE /api/v0/moderation/delete-reported-message` | JSON `reportNumber`, `conversationUid`, and `reportedMessageUid` | `200` deletion-state result family |
| Create Posting Suspension | `POST /api/v0/moderation/create-posting-suspension` | JSON report, conversation, participant, and `endsAt` values | `201` created-suspension result family |
| Update Posting Suspension | `PATCH /api/v0/moderation/update-posting-suspension` | JSON report, conversation, participant, suspension, current/replacement end-time, and acknowledgment values | `200` update-state result family |
| Remove Participant | `DELETE /api/v0/moderation/remove-participant` | JSON report, conversation, and participant values | `200` removal-state result family |
| Ban Participant | `POST /api/v0/moderation/ban-participant` | JSON report, conversation, and participant values | `200` ban-state result family |

The operation inventory is one-to-one: eight Markdown route headings map to eight OpenAPI method/path operations with exact repository-relative traceability extensions.

## Security Schemes Used

Every operation uses the `sessionCookie` API-key security scheme for the documented opaque `tawk_session` cookie. The specification does not expose the session reference as an editable parameter and does not add authorization secrets or lower-layer permission state.

## Request and Response Examples

All six documented JSON request examples are copied exactly into their operations' `application/json` request bodies. Both GET operations omit request bodies. All eight documented primary JSON response examples are copied exactly into a success response with minimal UI-facing schemas preserving strings, UIDs, enums, nested objects, arrays, booleans, integer counts, date-time strings, and documented nullable values.

## Validator Results

- `validate-openapi-spec.mjs`: exit code 0 and `ok: true`; 8 Markdown routes and 8 OpenAPI operations; no blockers.
- `validate-openapi-projection.mjs`: exit code 0 and `ok: true`; package `atk-ux-api-contract`; 8 projected routes; 26 projected inputs; canonical JSON SHA-256 `029d053aefcbd7df4548f08c3486ff8f52442ba5e51daa4a9dd27a080d8a3565`; no blockers.

## Unresolved Ambiguities

The Markdown describes alternate result branches without assigning distinct HTTP status codes or complete alternate payload examples. The YAML keeps those branches within each documented success response and does not invent lower-layer error contracts. The authoritative validator treats `originConversationUid` as required because its request-context sentence says it comes from the page URL, although that same sentence explicitly calls the value optional; the YAML follows the required scripted gate.

## Changed Files Confirmation

Only `docs/mockup/routes/moderation-routes.yaml` and `ai-docs/create-route-docs/moderation/01-openapi-spec-drafter.md` were written. `docs/mockup/routes/moderation-routes.md` and `docs/mockup/routes/moderation-routes-review.md` were not changed, and the review file's content was not read.
