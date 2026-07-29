# Hub OpenAPI Spec Drafter Handoff

## Markdown-to-OpenAPI Coverage Matrix

| Markdown route | OpenAPI operationId | Request representation | Success response | Traceability |
| --- | --- | --- | --- | --- |
| `POST /api/v0/hub/create-conversation` | `createConversation` | Required CSRF header and JSON `tags`, `visibility`, and `matchingMode` | `201` JSON creation/result-state shape | `docs/mockup/desktop/hub/create.md`; `docs/mockup/desktop/hub/create.html` |
| `GET /api/v0/hub/retrieve-listed-tag-suggestions` | `retrieveListedTagSuggestions` | Required `partialTag` and repeated `selectedTag` query values; no body | `200` JSON partial-tag and suggestions shape | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `GET /api/v0/hub/search-listed-conversations` | `searchListedConversations` | Repeated `selectedTag` query value, omitted only when the route is not invoked; no body | `200` JSON populated, empty, or retryable result shape | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `POST /api/v0/hub/join-listed-conversation` | `joinListedConversation` | Required CSRF header and JSON `conversationUid` | `200` JSON joined, ineligible, or retryable result shape | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` | `evaluateKnownUnlistedConversationTags` | Required CSRF header and JSON `tags` | `200` JSON privacy-safe evaluation/result shape | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `POST /api/v0/hub/join-unlisted-conversation` | `joinUnlistedConversation` | Required CSRF header and JSON `unlistedJoinChallengeUid` | `200` JSON joined, denied, expired, or retryable result shape | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `GET /api/v0/hub/retrieve-joined-conversations` | `retrieveJoinedConversations` | Shared session only; no path, query, or body values | `200` JSON populated, empty, retryable, or session-required result shape | `docs/mockup/desktop/hub/index.md`; `docs/mockup/desktop/hub/index.html` |
| `GET /api/v0/hub/resolve-joined-conversation-access` | `resolveJoinedConversationAccess` | Required `conversationUid` query value; no body | `200` JSON active, unavailable, or retryable access shape | `docs/mockup/desktop/hub/index.md`; `docs/mockup/desktop/hub/index.html` |

The Markdown and OpenAPI inventories both contain eight operations with exact one-to-one method/path coverage.

## Security Schemes Used

- `sessionCookie`: OpenAPI `apiKey` security scheme in the `tawk_session` cookie, required by every operation.
- `X-CSRF-Token`: required header parameter on each state-changing `POST` operation, sourced from the private page bootstrap rather than JSON or browser storage.

## Request and Response Examples

All four documented JSON request examples are represented with the same values. The four documented bodyless GET requests omit `requestBody`. All eight primary JSON response examples are represented with the same values, including nested arrays and objects. Documented alternative UI result branches are covered by optional fields and documented state shapes without adding separate undocumented HTTP status codes.

## Validator Results

- `validate-openapi-spec.mjs`: exit code `0`, `ok: true`; Markdown route count `8`, OpenAPI operation count `8`, blockers `[]`.
- `validate-openapi-projection.mjs`: exit code `0`, `ok: true`; projected route count `8`, projected input count `10`, package `atk-ux-api-contract`, blockers `[]`; canonical JSON SHA-256 `d860b28e679d3886f475c15e26d1f8ce36a2e898c233e1ab53c413ea37a6ab42`.

## Unresolved Ambiguities

None. Where the Markdown names alternate response states without assigning distinct HTTP status codes, the OpenAPI document keeps those outcomes under the operation's documented success response.

## Changed Files Confirmation

Only `docs/mockup/routes/hub-routes.yaml` and `ai-docs/create-route-docs/hub/01-openapi-spec-drafter.md` were changed for this work unit. The Markdown route contract and paired review evidence remained unchanged.
