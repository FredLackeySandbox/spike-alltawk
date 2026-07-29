# Phase 8 OpenAPI Spec Reviewer Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- `repoRelativeBase`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Final Markdown contract: `docs/mockup/routes/hub-routes.md`
- Reviewed OpenAPI YAML: `docs/mockup/routes/hub-routes.yaml`

All artifact references in this handoff and the OpenAPI extensions are repository-relative to `solutionArtifactRoot`. Every filesystem read and write used the corresponding absolute path under that root. `projects/**` was out of scope and was not read or changed.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/hub-routes.md`
- `docs/mockup/routes/hub-routes.yaml`
- `docs/mockup/desktop/hub/create.md`
- `docs/mockup/desktop/hub/create.html`
- `docs/mockup/desktop/hub/find.md`
- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/index.md`
- `docs/mockup/desktop/hub/index.html`
- `docs/mockup/desktop/assets/app.js`
- `docs/mockup/desktop/assets/styles.css`
- `ai-docs/draft-routes/hub/03-area-route-drafter.md`
- `ai-docs/draft-routes/hub/04-route-payload-drafter.md`
- `ai-docs/draft-routes/hub/05-route-rules-tightener.md`
- `ai-docs/draft-routes/hub/06-route-payload-reviewer.md`
- `ai-docs/draft-routes/hub/07-openapi-spec-drafter.md`

The finalized Markdown route file remained read-only and was treated as the product-contract authority.

## Spec Coverage Matrix

| Markdown operation | `operationId` | Transport and security | Contract branches checked | Review result |
| --- | --- | --- | --- | --- |
| `POST /api/v0/hub/create-conversation` | `createConversation` | Required session cookie, CSRF header, JSON body | Created, validation failed, temporarily unavailable, timed out | Corrected tag cardinality/uniqueness, conditional listed-only `matchingMode`, and retry invariants |
| `GET /api/v0/hub/retrieve-listed-tag-suggestions` | `retrieveListedTagSuggestions` | Required `partialTag`, optional repeated `selectedTag`, session cookie | Suggestions and empty suggestions | Corrected selected-tag cardinality/uniqueness; route, example, and response remained faithful |
| `GET /api/v0/hub/search-listed-conversations` | `searchListedConversations` | Required repeated `selectedTag`, session cookie | Matches, empty, temporarily unavailable | Split populated/empty schemas, constrained selected tags, and fixed retry invariant |
| `POST /api/v0/hub/join-listed-conversation` | `joinListedConversation` | Required session cookie, CSRF header, JSON body | Joined, not eligible, temporarily unavailable | Split denial and retry schemas so each branch requires only its documented fields |
| `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` | `evaluateKnownUnlistedConversationTags` | Required session cookie, CSRF header, JSON body | Complete eligible, partial/no match/ambiguous, complete not eligible, temporarily unavailable | Corrected tag bounds and privacy-branch boolean/count invariants |
| `POST /api/v0/hub/join-unlisted-conversation` | `joinUnlistedConversation` | Required session cookie, CSRF header, JSON body | Joined, not eligible, challenge expired, temporarily unavailable | Removed the undocumented `TIMED_OUT` possibility from this route and fixed reevaluation/retry invariants |
| `GET /api/v0/hub/retrieve-joined-conversations` | `retrieveJoinedConversations` | Session cookie; no query or body values | Populated, empty, temporarily unavailable, session required | Split populated/empty schemas and aligned active role values to `OWNER`, `ADMINISTRATOR`, and `MEMBER` |
| `GET /api/v0/hub/resolve-joined-conversation-access` | `resolveJoinedConversationAccess` | Required `conversationUid` query value, session cookie | Active, no longer available, temporarily unavailable | Existing remove/retry invariants, parameter placement, and requiredness were correct |

All eight Markdown method/path pairs have exactly one matching OpenAPI operation. The operation IDs remain unique and lower-camel-case. Summaries, descriptions, the `hub` tag, `x-solpoc-source-actions`, and `x-solpoc-mockup-files` remain faithful to the finalized Markdown and cited artifacts.

## Corrections Made

- Normalized the eight `operationId` scalars from quoted to plain lower-camel-case YAML scalars after the Phase 9 gate exposed a lexical validator mismatch. Each value contains only ASCII letters, remains a YAML string under PyYAML, and cannot be mistaken for a boolean, null, number, timestamp, or date. This is a presentation-only correction: methods, paths, operation IDs, schemas, examples, and all other contract values remain semantically unchanged.
- Changed `PublicUid.pattern` to enforce hyphenless UUID v4 and RFC-compatible variant positions instead of accepting any 32 hexadecimal characters.
- Added the documented one-to-ten and uniqueness constraints to browser-supplied tag collections where applicable.
- Added the current mockup's normalized lowercase tag grammar to the shared `Tag` schema without selecting unresolved future display-casing behavior.
- Made `matchingMode` required only for `LISTED` creation requests and disallowed it for `UNLISTED`, matching the listed-only visible choice and keeping fixed unlisted all-tag behavior server-owned.
- Split listed-search populated and empty response shapes so `MATCHES` requires at least one conversation and `EMPTY` permits none.
- Split listed-join denial and retry response shapes so only the retry branch requires `canRetry`.
- Added missing `canRetry: true` branch invariants while preserving already-correct `canJoin`, `reevaluationRequired`, and `removeFromJoined` constants.
- Limited the complete eligible hidden-match branch to `hiddenMatchCount: 1`.
- Replaced the overly broad retry component on unlisted Join and joined-list retrieval with a route-specific `TEMPORARILY_UNAVAILABLE` schema, avoiding the undocumented `TIMED_OUT` state.
- Split populated and empty joined-list shapes and added the requirements- and mockup-backed `MEMBER` role needed for active ordinary-member conversations.

These were YAML-only corrections supported by the Markdown, requirements, companions, and mockup behavior. No route was added, removed, renamed, split, or merged, and no Markdown contract correction was required.

## Checks Requiring No Correction

- OpenAPI remains `3.1.0` with concise area metadata and the exact source link `x-solpoc-route-markdown: docs/mockup/routes/hub-routes.md`.
- All operations preserve exact HTTP method/path parity, operation IDs, summaries, descriptions, tags, traceability extensions, primary request examples, primary response examples, and documented success/default status choices.
- Session authentication is represented as an operation-level cookie security scheme; CSRF values remain required header parameters only on state-changing POST operations.
- Repeated query values use array query parameters with form/explode serialization. Requiredness follows the Markdown: `partialTag` and search `selectedTag` are required, suggestion `selectedTag` is optional, and access-resolution `conversationUid` is required.
- GET operations have no request bodies. POST bodies contain only visible user inputs, selected public UIDs, or the public-safe unlisted continuation UID.
- Response contracts remain UI-facing. Workspace and recovery locations are browser-safe relative URLs; the unlisted challenge remains a public-safe, session-bound continuation value.
- No cookie value, CSRF value, credential, JWT, provider secret, database identifier, audit row, internal permission state, private hidden-conversation identifier, or lower-layer API contract appears in a JSON payload.
- Ambiguous version, reference, response-code, and pattern scalars remain quoted where lossless YAML-to-JSON conversion requires string preservation. The unquoted lower-camel-case `operationId` values parse as strings and require no ambiguity-protecting quotes.

## Validation

- `validate-route-coverage.mjs --folder-slug hub`: passed with 8 companion actions, 8 mapped actions, and 8 routes.
- `validate-openapi-spec.mjs --folder-slug hub`: passed with `ok: true`, OpenAPI 3.1 metadata, exact Markdown source linkage, 8 Markdown routes, 8 OpenAPI operations, unique operation IDs, exact method/path parity, and documented 2xx responses.
- Python 3 with PyYAML parsed all eight normalized `operationId` values as strings and parsed the reviewed file successfully as OpenAPI `3.1.0`, with 8 operations and the exact repository-relative Markdown source link.
- The existing pre-regeneration JSON remains semantically equal to the reviewed YAML after excluding its required export-provenance field. Diagnostic `validate-openapi-json.mjs --folder-slug hub` no longer reports any `operationId` mismatch; its only expected blocker is that the existing JSON carries the previous YAML SHA-256 and must be regenerated by Phase 9.
- Markdown SHA-256 before and after review remained `48fd1410641777222ed5c0ab83c3b29bbf4088b68839b70c8e4433536aeffbd4`.
- Reviewed YAML SHA-256 after the validator-compatibility correction: `556ec64f0418686db38e1ff4273c3888306b3525de4e85753db81f7701853c60`.

## Unresolved Blockers

None for Phase 8. The existing JSON requires normal Phase 9 regeneration so its `x-solpoc-source-yaml-sha256` matches the corrected reviewed YAML. Existing product ambiguities about human authentication, listed extra-tag semantics, hidden matching edge cases, tag casing/grammar, and rejoining persistence remain intentionally unresolved and were not redesigned in YAML.

## Scope Confirmation

This phase changed only:

- `docs/mockup/routes/hub-routes.yaml`
- `ai-docs/draft-routes/hub/08-openapi-spec-reviewer.md`

`docs/mockup/routes/hub-routes.md` remained read-only. No HTML, CSS, JavaScript, concept document, companion, prior handoff, JSON route definition, package file, backend code, database schema, frontend business logic, application API contract, or secure API contract was changed.
