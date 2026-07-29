# Hub OpenAPI Spec Reviewer Handoff

## Spec Coverage Matrix

| Markdown route | OpenAPI operationId | Reviewed request contract | Reviewed response and branch contract | Traceability |
| --- | --- | --- | --- | --- |
| `POST /api/v0/hub/create-conversation` | `createConversation` | Session security, CSRF header, and JSON `tags`, `visibility`, and `matchingMode` | `201` covers created, validation-failed, temporarily-unavailable, and timed-out states | `docs/mockup/desktop/hub/create.md`; `docs/mockup/desktop/hub/create.html` |
| `GET /api/v0/hub/retrieve-listed-tag-suggestions` | `retrieveListedTagSuggestions` | Session security and documented `partialTag` plus repeated `selectedTag` query inputs | `200` preserves the echoed partial tag and privacy-filtered suggestion array, including an empty array | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `GET /api/v0/hub/search-listed-conversations` | `searchListedConversations` | Session security and required repeated `selectedTag` input whenever the route is invoked | `200` covers matches, empty results, and retryable failure with the normalized selected-tag echo | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `POST /api/v0/hub/join-listed-conversation` | `joinListedConversation` | Session security, CSRF header, and public `conversationUid` body input | `200` covers joined, not-eligible, and temporarily-unavailable states without private membership data | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` | `evaluateKnownUnlistedConversationTags` | Session security, CSRF header, and visible validated `tags` body input | `200` preserves privacy-safe state, count, join flag, opaque challenge, and retry fields | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `POST /api/v0/hub/join-unlisted-conversation` | `joinUnlistedConversation` | Session security, CSRF header, and public-safe `unlistedJoinChallengeUid` body input | `200` covers joined, not-eligible, challenge-expired, and temporarily-unavailable states | `docs/mockup/desktop/hub/find.md`; `docs/mockup/desktop/hub/find.html` |
| `GET /api/v0/hub/retrieve-joined-conversations` | `retrieveJoinedConversations` | Session security with no path, query, or body values | `200` covers populated, empty, temporarily-unavailable, and session-required states with UI-ready cards | `docs/mockup/desktop/hub/index.md`; `docs/mockup/desktop/hub/index.html` |
| `GET /api/v0/hub/resolve-joined-conversation-access` | `resolveJoinedConversationAccess` | Session security and required public `conversationUid` query input | `200` covers active access, stale removal, and retryable resolution failure | `docs/mockup/desktop/hub/index.md`; `docs/mockup/desktop/hub/index.html` |

All eight Markdown operations have one exact method/path counterpart, unique operation metadata, the `hub` tag, operation-level session security, and exact source-action and mockup-file extensions.

## Corrections Made

- Marked `search-listed-conversations` `selectedTag` as required because the Markdown says the route is not invoked in the no-chip state.
- Added the documented one-to-ten, unique, validated-tag constraints to the create and unlisted-evaluation request arrays.
- Added matching one-to-ten, unique, validated-tag constraints to selected-tag query arrays and UI-returned conversation tag arrays.
- Restricted active joined-conversation roles to the UI-facing `OWNER`, `ADMINISTRATOR`, and `MEMBER` values supported by the requirements and mockup.

## Checks Requiring No Correction

- Method/path inventory, lower-camel-case operation IDs, summaries, descriptions, tags, and top-level Markdown linkage already matched the finalized route contract.
- Session-cookie security and CSRF header placement were correct; no authorization value was modeled as a browser JSON field.
- All four JSON request examples and all eight primary response examples preserved the documented strings, arrays, booleans, numbers, nested objects, and public-safe UIDs.
- Response status choices, documented alternate state fields, omission behavior, and retry/recovery signals were represented without inventing non-success status codes.
- Opaque conversation and unlisted-challenge values remain public-safe handles; no credentials, storage identifiers, permission decisions, audit data, or lower-layer contracts were added.
- Ambiguous scalar examples remain strings after YAML parsing, and the reviewed document remains ordinary block-style OpenAPI 3.1 YAML.

## Unresolved Blockers

None. The reviewed evidence did not require a change to the finalized Markdown route contract.

## Validator Results

- `validate-openapi-spec.mjs`: exit code `0`, `ok: true`; Markdown route count `8`, OpenAPI operation count `8`, blockers `[]`.
- `validate-openapi-projection.mjs`: exit code `0`, `ok: true`; projected route count `8`, projected input count `10`, package `atk-ux-api-contract`, blockers `[]`; canonical JSON byte length `2429`; canonical JSON SHA-256 `d860b28e679d3886f475c15e26d1f8ce36a2e898c233e1ab53c413ea37a6ab42`.

## Changed Files Confirmation

Only `docs/mockup/routes/hub-routes.yaml` and `ai-docs/create-route-docs/hub/02-openapi-spec-reviewer.md` were changed in Phase 2. The Markdown route contract, paired route-review evidence, requirements, mockup sources, page-action companions, and Phase 1 handoff remained unchanged.
