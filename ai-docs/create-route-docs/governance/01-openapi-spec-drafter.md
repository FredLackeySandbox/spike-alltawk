# Governance OpenAPI Spec Drafter Handoff

## Markdown-to-OpenAPI Coverage Matrix

| Markdown route | OpenAPI operationId | Coverage |
| --- | --- | --- |
| `GET /api/v0/governance/retrieve-conversation-governance` | `retrieveConversationGovernance` | Exact |
| `POST /api/v0/governance/promote-participant-role` | `promoteParticipantRole` | Exact |
| `DELETE /api/v0/governance/remove-participant` | `removeParticipant` | Exact |
| `POST /api/v0/governance/ban-identity` | `banIdentity` | Exact |
| `POST /api/v0/governance/restore-banned-participant` | `restoreBannedParticipant` | Exact |
| `POST /api/v0/governance/create-posting-suspension` | `createPostingSuspension` | Exact |
| `PATCH /api/v0/governance/update-posting-suspension` | `updatePostingSuspension` | Exact |
| `DELETE /api/v0/governance/end-posting-suspension` | `endPostingSuspension` | Exact |
| `PATCH /api/v0/governance/update-conversation-tags` | `updateConversationTags` | Exact |
| `POST /api/v0/governance/archive-conversation` | `archiveConversation` | Exact |

The Markdown and OpenAPI inventories each contain 10 operations with one-to-one method/path coverage.

## Security Schemes Used

Every operation requires `sessionCookie`, an OpenAPI `apiKey` security scheme in the `cookie` location with the documented name `tawk_session`. The opaque session reference is not represented as a JSON field or ordinary operation parameter.

## Request and Response Examples

All nine documented JSON request examples and all ten operations' documented success response examples are preserved exactly. The retrieval operation preserves both its `MEMBERS` and `SETTINGS` examples, with `MEMBERS` first for exact validator comparison. The retrieval operation correctly has no request body. The create-suspension operation uses `201`; the other body-bearing successes use `200`.

## Validator Results

- `validate-openapi-spec.mjs`: exit code 0, `ok: true`, 10 Markdown routes, 10 OpenAPI operations, no blockers.
- `validate-openapi-projection.mjs`: exit code 0, `ok: true`, package `atk-ux-api-contract`, 10 projected routes, 24 projected inputs, canonical SHA-256 `ad183dde05964bd03e897805ae2d3af80ef4e2248c4fece629824c45404aa3b0`, no blockers.

## Unresolved Ambiguities

None. The Markdown contract provided complete methods, paths, browser inputs, success examples, and traceability values for all operations.

## Changed Files Confirmation

Changed only `docs/mockup/routes/governance-routes.yaml` and `ai-docs/create-route-docs/governance/01-openapi-spec-drafter.md`. The finalized route Markdown and paired route-review Markdown were not modified.
