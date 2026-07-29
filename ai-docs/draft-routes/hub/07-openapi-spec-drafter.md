# Phase 7 OpenAPI Spec Drafter Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- `repoRelativeBase`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Work unit: `desktop/hub`
- Markdown contract: `docs/mockup/routes/hub-routes.md`
- OpenAPI specification: `docs/mockup/routes/hub-routes.yaml`

All artifact path references are repository-relative to `solutionArtifactRoot`. Filesystem reads and writes used the corresponding absolute paths under that root. `projects/**` was not read or changed.

## Inputs Read

- `docs/mockup/routes/hub-routes.md`
- `ai-docs/draft-routes/hub/03-area-route-drafter.md`
- `ai-docs/draft-routes/hub/04-route-payload-drafter.md`
- `ai-docs/draft-routes/hub/05-route-rules-tightener.md`
- `ai-docs/draft-routes/hub/06-route-payload-reviewer.md`

The finalized Markdown route file remained read-only.

## Markdown-to-OpenAPI Coverage Matrix

| Markdown method and path | OpenAPI operationId | Request contract | Success response |
| --- | --- | --- | --- |
| `POST /api/v0/hub/create-conversation` | `createConversation` | Session cookie, CSRF header, JSON tags/visibility/optional matching mode | `201` created conversation and workspace continuation |
| `GET /api/v0/hub/retrieve-listed-tag-suggestions` | `retrieveListedTagSuggestions` | Session cookie, `partialTag`, repeated optional `selectedTag` query values | `200` populated or empty suggestions |
| `GET /api/v0/hub/search-listed-conversations` | `searchListedConversations` | Session cookie and repeated required `selectedTag` query values | `200` populated or empty listed matches |
| `POST /api/v0/hub/join-listed-conversation` | `joinListedConversation` | Session cookie, CSRF header, selected public `conversationUid` | `200` joined membership and workspace continuation |
| `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` | `evaluateKnownUnlistedConversationTags` | Session cookie, CSRF header, visible tag array | `200` privacy-safe eligible, incomplete, ambiguous, nonmatching, or ineligible evaluation |
| `POST /api/v0/hub/join-unlisted-conversation` | `joinUnlistedConversation` | Session cookie, CSRF header, prior public-safe `unlistedJoinChallengeUid` | `200` joined membership and newly visible workspace continuation |
| `GET /api/v0/hub/retrieve-joined-conversations` | `retrieveJoinedConversations` | Session cookie only | `200` populated or empty active joined list |
| `GET /api/v0/hub/resolve-joined-conversation-access` | `resolveJoinedConversationAccess` | Session cookie and selected public `conversationUid` query value | `200` active or no-longer-available access result |

The inventories match one-to-one: eight Markdown routes and eight OpenAPI operations, with no added, removed, renamed, split, or merged method/path pair.

## Security Schemes

- `tawkSession`: `apiKey` in the `tawk_session` cookie on all eight private-hub operations.
- `csrfToken`: `apiKey` in the `X-CSRF-Token` header on the four state-changing `POST` operations.

The specification contains no raw cookie value, CSRF value, bearer token, credential, provider secret, database identifier, internal permission state, audit data, or lower-layer API contract.

## Request and Response Examples Represented

- Preserved all four Markdown JSON request examples and omitted `requestBody` from the four routes whose Markdown says no JSON request body is sent.
- Preserved each primary Markdown JSON response example with its original strings, arrays, nested values, booleans, numbers, public UID values, and all-caps states.
- Represented documented empty outcomes for suggestions, listed search, and joined lists.
- Represented documented validation, retryable failure, timeout, ineligible, expired-challenge, session-required, stale-membership, and transient-resolution branches without adding undisclosed private state.
- Used `201` only for the documented Create Conversation success; all other documented success outcomes use `200`. No asynchronous or bodyless success was invented.
- Reused only genuinely shared public UID, tag, workspace URL, retryable-state, field-feedback, listed-conversation, and joined-conversation schemas.

Every operation includes `x-solpoc-source-actions` and `x-solpoc-mockup-files` copied from the Markdown contract. The exact top-level source link is `docs/mockup/routes/hub-routes.md`.

## Unresolved Ambiguities

- The Markdown does not assign exact HTTP status codes to validation, ineligible, expired-challenge, session-required, or transient-failure branches. Those documented non-success branches use an OpenAPI `default` response instead of inventing status codes.
- Exact state literals for partial, nonmatching, and ambiguous unlisted evaluations are not fixed. Their privacy-safe shape is represented, while only the documented `COMPLETE_ELIGIBLE` and `COMPLETE_NOT_ELIGIBLE` literals are used as examples.
- Human authentication and the identity provider remain unspecified. The OpenAPI contract models only the documented HttpOnly session cookie and CSRF header.
- Listed matching semantics, hidden exact-versus-superset matching, tag grammar/casing, and conversation rejoining persistence remain server-owned and are not redesigned in the specification.

No ambiguity required changing the finalized Markdown route contract.

## Validation

The scoped command `validate-openapi-spec.mjs --solution-root /Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk --folder-slug hub --format json` passed with:

- `ok: true`
- eight Markdown routes
- eight OpenAPI operations
- zero blockers

## Scope and Write Confirmation

- Wrote only `docs/mockup/routes/hub-routes.yaml`.
- Wrote only this Phase 7 handoff at `ai-docs/draft-routes/hub/07-openapi-spec-drafter.md`.
- Did not modify `docs/mockup/routes/hub-routes.md`, any JSON artifact, concept or mockup source, companion, prior handoff, schema, package file, backend code, application API contract, secure API contract, database design, or frontend business logic.
