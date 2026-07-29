# Moderation OpenAPI Spec Reviewer Handoff

## Spec Coverage Matrix

| Markdown operation | OpenAPI operation | Review result |
| --- | --- | --- |
| Retrieve Reviewable Reports | `GET /api/v0/moderation/retrieve-reviewable-reports` | Method, path, operation metadata, moderation tag, source-action and mockup traceability, shared-session security, JSON accept header, response example, and documented result branches match. The `originConversationUid` query input is now modeled as optional, matching both the finalized route contract and the passing route-review evidence. |
| Retrieve Moderation Ticket | `GET /api/v0/moderation/retrieve-moderation-ticket` | Required report and conversation query inputs, JSON accept header, shared-session security, ticket evidence, nullable suspension and discussion state, action availability, examples, and documented non-disclosing branches match. |
| Create Reviewer Note | `POST /api/v0/moderation/create-reviewer-note` | Required JSON inputs, session-derived reviewer context, created-note response, unavailable and validation branches, schemas, and examples match. |
| Delete Reported Message | `DELETE /api/v0/moderation/delete-reported-message` | Required public request handles, soft-deletion response, retained-evidence effect, action availability, idempotent branch, schemas, and examples match. |
| Create Posting Suspension | `POST /api/v0/moderation/create-posting-suspension` | Required report, conversation, participant, and end-time inputs; public suspension handle; effective end time; applied effect; action availability; branch coverage; schemas; and examples match. |
| Update Posting Suspension | `PATCH /api/v0/moderation/update-posting-suspension` | Required current and replacement suspension inputs, shorter-period acknowledgment, authoritative replacement response, stale and rejected branches, schemas, and examples match. |
| Remove Participant | `DELETE /api/v0/moderation/remove-participant` | Required public request handles, former-participant response, rejoin state, applied effect, action availability, idempotent and unavailable branches, schemas, and examples match. |
| Ban Participant | `POST /api/v0/moderation/ban-participant` | Required public request handles, retained-history ban response, no-rejoin state, action availability, idempotent and unavailable branches, schemas, and examples match. |

All eight Markdown method/path pairs have one matching OpenAPI operation. The reviewed operations retain unique lower-camel-case operation IDs, concise summaries and descriptions, the `moderation` tag, exact repository-relative traceability values, UI-facing request and response data, and the documented `sessionCookie` security requirement.

## Corrections Made

- Changed `GET /api/v0/moderation/retrieve-reviewable-reports` parameter `originConversationUid` from `required: true` to `required: false`. The finalized Markdown explicitly calls the value optional, says an absent value starts at all governed conversations, and the passing route-review file independently confirms that it may be omitted.
- No route was added, removed, renamed, split, or merged. No request or response field was added beyond the finalized Markdown contract.

## Checks Requiring No Correction

- Confirmed exact one-to-one coverage for all eight methods and paths.
- Confirmed each operation's ID, summary, description, tag, source-action extension, mockup-file extension, shared-session security, request placement, response status, response schema, primary example, and documented branch family against the route contract and cited moderation mockups.
- Confirmed both GET operations omit request bodies and the six mutation operations preserve the documented JSON examples with required top-level request properties.
- Confirmed path/query placement, opaque public UIDs, report-number strings, boolean values, date-time strings, nullable fields, arrays, and enums remain lossless through YAML parsing.
- Confirmed the specification exposes no session secret, database identifier, internal permission state, lower-layer contract, storage algorithm, or hard-deletion mechanism.
- Confirmed the OpenAPI source link remains `docs/mockup/routes/moderation-routes.md` and all cited source and mockup paths remain repository-relative.

## Unresolved Blockers

Blocked: Markdown route contract requires correction.

The finalized Markdown says `originConversationUid` is optional and that an absent value starts at all governed conversations. Its passing review says the value "may be omitted." The authoritative spec validator nevertheless requires the parameter because its heuristic treats the words "comes from" in the same request-context sentence as requiredness. With the contract-correct `required: false`, the validator fails; with `required: true`, the YAML contradicts the finalized contract. Resolving this requires either correcting the Markdown wording so the heuristic no longer overrides the explicit optional statement or correcting the validator. Both are outside this reviewer's allowed write set, so the conflict cannot be silently reinterpreted in YAML.

## Validator Results

- Before correction, `validate-openapi-spec.mjs` exited 0 with `ok: true`, but only because the YAML contradicted the Markdown's explicit optionality with `required: true`.
- Before correction, `validate-openapi-projection.mjs` exited 0 with `ok: true`; it projected 8 routes and 26 inputs with canonical JSON SHA-256 `029d053aefcbd7df4548f08c3486ff8f52442ba5e51daa4a9dd27a080d8a3565`.
- After correction, `validate-openapi-spec.mjs` exits nonzero with `ok: false` and the blocker `GET /api/v0/moderation/retrieve-reviewable-reports must mark documented query parameter "originConversationUid" as required.`
- After correction, `validate-openapi-projection.mjs` exits 0 with `ok: true`; the optional parameter remains deterministically projectable.

## Changed Files Confirmation

Only `docs/mockup/routes/moderation-routes.yaml` and `ai-docs/create-route-docs/moderation/02-openapi-spec-reviewer.md` were written in Phase 2. The finalized `docs/mockup/routes/moderation-routes.md`, its paired `docs/mockup/routes/moderation-routes-review.md`, requirements, source-action companions, mockup files, Phase 1 handoff, package plan, scripts, and all unrelated artifacts were not changed.
