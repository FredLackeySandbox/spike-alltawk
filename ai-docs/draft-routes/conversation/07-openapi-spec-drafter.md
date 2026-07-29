# Phase 7 OpenAPI Spec Drafter Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- `repoRelativeBase`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Folder slug: `conversation`
- Markdown contract: `docs/mockup/routes/conversation-routes.md`
- OpenAPI specification: `docs/mockup/routes/conversation-routes.yaml`

All artifact path references in this handoff and specification are repository-relative to `solutionArtifactRoot`; filesystem reads and writes used absolute paths under that root. `projects/**` remained out of scope.

## Inputs Reviewed

- `docs/mockup/routes/conversation-routes.md`
- `ai-docs/draft-routes/conversation/03-area-route-drafter.md`
- `ai-docs/draft-routes/conversation/04-route-payload-drafter.md`
- `ai-docs/draft-routes/conversation/05-route-rules-tightener.md`
- `ai-docs/draft-routes/conversation/06-route-payload-reviewer.md`

The Phase 7 contract and shared OpenAPI artifact rules from the installed `solpoc-draft-routes` skill were applied. The finalized Markdown remained read-only and was the sole route-contract authority.

## Markdown-to-OpenAPI Coverage Matrix

| Markdown route | OpenAPI operationId | Success response | Coverage |
|---|---|---:|---|
| `GET /api/v0/conversation/retrieve-workspace` | `retrieveConversationWorkspace` | `200` | Exact method/path, query UID, identified-session context, workspace example, source action, and mockup files represented. |
| `POST /api/v0/conversation/post-message` | `postConversationMessage` | `201` | Exact method/path, JSON request, created message example, source action, and mockup files represented. |
| `POST /api/v0/conversation/add-emoji-reaction` | `addEmojiReaction` | `200` | Exact method/path, selected message and emoji request, aggregate example, source action, and mockup files represented. |
| `DELETE /api/v0/conversation/remove-emoji-reaction` | `removeEmojiReaction` | `200` | Exact method/path, selected message and emoji request, remaining aggregate example, source action, and mockup files represented. |
| `GET /api/v0/conversation/retrieve-message-note` | `retrieveMessageNote` | `200` | Exact method/path, query UID, both documented create/update examples, source action, and mockup files represented. |
| `POST /api/v0/conversation/create-message-note` | `createMessageNote` | `201` | Exact method/path, JSON create request without note UID, created-note example, source action, and mockup files represented. |
| `PATCH /api/v0/conversation/update-message-note` | `updateMessageNote` | `200` | Exact method/path, carried-forward note UID request, updated-note example, source action, and mockup files represented. |
| `GET /api/v0/conversation/retrieve-conversation-note` | `retrieveConversationNote` | `200` | Exact method/path, query UID, both documented create/update examples, source action, and mockup files represented. |
| `POST /api/v0/conversation/create-conversation-note` | `createConversationNote` | `201` | Exact method/path, JSON create request without note UID, created-note example, source action, and mockup files represented. |
| `PATCH /api/v0/conversation/update-conversation-note` | `updateConversationNote` | `200` | Exact method/path, carried-forward note UID request, updated-note example, source action, and mockup files represented. |
| `POST /api/v0/conversation/submit-message-report` | `submitMessageReport` | `201` | Exact method/path, selected message and explanation request, created-ticket example, source action, and mockup files represented. |
| `DELETE /api/v0/conversation/delete-message` | `deleteConversationMessage` | `200` | Exact method/path, selected message request, deletion example, source action, and mockup files represented. |
| `DELETE /api/v0/conversation/leave-conversation` | `leaveConversation` | `200` | Exact method/path, conversation request, both documented blocked/left examples, source action, and mockup files represented. |

Inventory comparison: 13 Markdown method/path pairs and 13 OpenAPI operations, with no additions, removals, renames, splits, or merges. All 13 `operationId` values are unique lower-camel-case strings.

## Security Schemes

- `tawkSession` is an OpenAPI `apiKey` security scheme in the `tawk_session` cookie.
- Every operation declares `security: [{ tawkSession: [] }]`.
- Raw cookie values and session identifiers do not appear in request or response examples.
- The documented `Accept: application/json` header is modeled by the shared required `AcceptJson` parameter. JSON-bearing operations use `application/json` request bodies rather than a separate `Content-Type` header parameter.

## Examples Represented

- The workspace response preserves the documented conversation, participant, posting-restriction, participant-list, message, reaction, null indicator, and allowed-action values.
- Message posting, reaction add/remove, note create/update, report submission, message deletion, and their documented confirmation values are preserved.
- Both `UPDATE` and `CREATE` examples are preserved for message-note and conversation-note retrieval.
- Both `BLOCKED` and `LEFT` examples are preserved for leaving a conversation.
- Every request example retains the documented public UID, enum, emoji, string, boolean, integer, array, object, or null type. GET initializers omit `requestBody` because the Markdown explicitly sends no JSON body.

## Ambiguities

- The Markdown intentionally leaves the human identity provider unresolved. The specification models only the documented secure browser-managed session cookie.
- The static mockup does not carry a concrete conversation UID in its URL. The specification preserves the documented required `conversationUid` query/body value and its current-page-route provenance without inventing an internal identifier.
- Note visibility, ticket lifecycle after submission, emoji multiplicity, and lower-layer implementation remain unresolved by the Markdown and were not added to OpenAPI.
- The Markdown documents several stale, unauthorized, rejected, duplicate, or recoverable failure branches without assigning HTTP statuses or JSON examples. The specification does not invent branch payloads or status codes; operation descriptions preserve those behaviors. Explicit missing-session branches are represented as description-only `401` responses.

## Validation

- Ran `node /Users/flackey/.codex/skills/solpoc-draft-routes/scripts/validate-openapi-spec.mjs --solution-root /Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk --folder-slug conversation --format json`.
- Result: passed with `ok: true`, 13 Markdown routes, 13 OpenAPI operations, and no blockers.

## Change Boundary Confirmation

- Written: `docs/mockup/routes/conversation-routes.yaml`
- Written: `ai-docs/draft-routes/conversation/07-openapi-spec-drafter.md`
- `docs/mockup/routes/conversation-routes.md` remained read-only.
- No JSON definition, HTML, CSS, JavaScript, concept document, companion, schema, mock data, package file, backend code, frontend business logic, lower-layer API contract, other area's route artifact, or other phase handoff was changed.
- No shared scratch, log, alternate route file, or path outside `solutionArtifactRoot` was created.
