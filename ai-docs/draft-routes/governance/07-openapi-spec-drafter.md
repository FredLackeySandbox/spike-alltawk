# Phase 7 OpenAPI Spec Drafter Handoff

## Target

- Work-unit slug: `governance`
- Markdown contract: `docs/mockup/routes/governance-routes.md`
- OpenAPI specification: `docs/mockup/routes/governance-routes.yaml`
- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`

All artifact path references in this handoff are repository-relative to
`solutionArtifactRoot`. Filesystem reads and writes used the assigned absolute
paths beneath that root. `projects/**` was not read or changed.

## Inputs Reviewed

- `docs/mockup/routes/governance-routes.md`
- `ai-docs/draft-routes/governance/03-area-route-drafter.md`
- `ai-docs/draft-routes/governance/04-route-payload-drafter.md`
- `ai-docs/draft-routes/governance/05-route-rules-tightener.md`
- `ai-docs/draft-routes/governance/06-route-payload-reviewer.md`

## Markdown-to-OpenAPI Coverage Matrix

| Markdown route | OpenAPI operationId | Success response |
|---|---|---|
| `GET /api/v0/governance/retrieve-conversation-governance` | `retrieveConversationGovernance` | `200` |
| `POST /api/v0/governance/promote-participant-role` | `promoteParticipantRole` | `200` |
| `DELETE /api/v0/governance/remove-participant` | `removeParticipant` | `200` |
| `POST /api/v0/governance/ban-identity` | `banIdentity` | `200` |
| `POST /api/v0/governance/restore-banned-participant` | `restoreBannedParticipant` | `200` |
| `POST /api/v0/governance/create-posting-suspension` | `createPostingSuspension` | `201` |
| `PATCH /api/v0/governance/update-posting-suspension` | `updatePostingSuspension` | `200` |
| `DELETE /api/v0/governance/end-posting-suspension` | `endPostingSuspension` | `200` |
| `PATCH /api/v0/governance/update-conversation-tags` | `updateConversationTags` | `200` |
| `POST /api/v0/governance/archive-conversation` | `archiveConversation` | `200` |

The specification contains exactly these ten method/path pairs and no extra
operation. All twelve approved companion actions remain present in the
operation-level `x-solpoc-source-actions` extensions, and every Markdown
`### Mockup Files` entry remains present in the matching
`x-solpoc-mockup-files` extension.

## Security Schemes

- `TawkSession` is an OpenAPI `apiKey` security scheme in the
  `tawk_session` cookie.
- Every operation requires `TawkSession`.
- The cookie is browser-managed and opaque; no raw cookie value, session
  identifier, credential, bearer token, or internal authorization state is
  represented in a JSON payload.

## Request and Response Examples

- The governance retrieval request has no JSON body. Its
  `conversationUid` and `view` values are required query parameters, and its
  `200` response preserves separate `MEMBERS` and `SETTINGS` examples under
  one discriminated response contract.
- The nine mutation operations preserve the Markdown request examples and use
  required JSON request bodies containing only public UIDs, visible selections,
  visible edited values, or action intent.
- Every operation documents a JSON success response. Posting-suspension
  creation uses `201`; all other operations use `200` because they return
  immediate UI-ready state rather than an asynchronous or empty result.
- Response schemas preserve the Markdown examples' UIDs, enums, arrays,
  timestamps, booleans, nested participant and restriction state, allowed
  actions, and the explicit nullable `postingSuspension` result after ending a
  suspension.
- Documented missing-session, access-denied, conflicting-state, visible-field
  validation, and retryable-failure outcomes use one minimal UI-facing error
  schema without exposing lower-layer state.

## Ambiguities

- The Markdown leaves the human identity provider unresolved. The OpenAPI
  document represents only the explicit browser-to-UX-API `tawk_session`
  transport and does not choose an identity provider.
- The Markdown describes multiple non-success result branches without fixing
  exact JSON examples for each branch. The specification documents only their
  UI-facing status classes and a minimal display-ready error shape; it does not
  invent lower-layer details.
- The shared retrieval Markdown contains two separate example JSON blocks for
  the mutually exclusive `MEMBERS` and `SETTINGS` views. OpenAPI preserves them
  as named examples on a single response; the server returns only the example
  matching the requested view.
- The requirements-backed restore response remains authoritative even though
  the static mockup's unban behavior is less complete. Phase 7 did not redesign
  the reviewed Markdown contract.

No ambiguity required a Markdown correction or blocked OpenAPI drafting.

## Validation

The bundled `validate-openapi-spec.mjs` gate passed with `ok: true`,
10 Markdown routes, 10 OpenAPI operations, and no blockers. It confirmed the
same-basename file pairing, OpenAPI version, exact source link, one-to-one
method/path coverage, unique operation IDs, operation documentation, and
documented success responses.

## Scope Confirmation

- The top-level source link is exactly
  `x-solpoc-route-markdown: docs/mockup/routes/governance-routes.md`.
- The specification declares OpenAPI `3.1.0`, has one unique lower-camel-case
  `operationId` per Markdown route, and includes a documented success response
  for every operation.
- Only `docs/mockup/routes/governance-routes.yaml` and
  `ai-docs/draft-routes/governance/07-openapi-spec-drafter.md` were written.
- The finalized Markdown route contract and all JSON, HTML, CSS, JavaScript,
  concept, schema, mock-data, package, application-source, neighboring route,
  and review files remained unchanged.
