# Phase 4 Route Payload Drafter Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and work unit: `desktop/hub`
- Route file updated: `docs/mockup/routes/hub-routes.md`
- Page catalog: `docs/concepts/APP_PAGES.md`

All markdown paths in this handoff and the route file are repository-relative to `solutionArtifactRoot`. Filesystem operations used the corresponding absolute paths under that root.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/hub-routes.md`
- `docs/mockup/desktop/hub/create.html`
- `docs/mockup/desktop/hub/create.md`
- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/find.md`
- `docs/mockup/desktop/hub/index.html`
- `docs/mockup/desktop/hub/index.md`
- `ai-docs/draft-routes/hub/03-area-route-drafter.md`

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`
- Test invocation: supplied `command` and `baseArgs` followed by the `test` subcommand
- CommonJS specifications imported `test` and `expect` from the exact absolute `testRunnerModule`.

## Rendered Inspection

Every referenced page was rendered at the assigned 1080-pixel viewport before payload drafting.

- `create.html`: default listed form, unlisted selection, invalid-tag feedback, pending creation, service failure with preserved draft, timeout with preserved draft, and success continuation.
- `find.html`: listed populated and empty results, empty suggestions, failed and retried search, pending listed join, banned listed join, retryable listed join failure, known-unlisted empty and partial states, complete eligible hidden match, pending hidden join, complete ineligible hidden match, and retryable hidden join failure.
- `index.html`: loading, populated, empty, persistent error, retry-success, unavailable session, stale removed membership, and temporarily unresolvable Resume selection.

All interactions were local mockup interactions. No real API, live backend, authentication service, or third-party system was called.

## Routes Updated

The following eight existing route sections received exactly one `### Example Request Payload` and one `### Example Response Payload`:

- `POST /api/v0/hub/create-conversation`
- `GET /api/v0/hub/retrieve-listed-tag-suggestions`
- `GET /api/v0/hub/search-listed-conversations`
- `POST /api/v0/hub/join-listed-conversation`
- `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`
- `POST /api/v0/hub/join-unlisted-conversation`
- `GET /api/v0/hub/retrieve-joined-conversations`
- `GET /api/v0/hub/resolve-joined-conversation-access`

Every route also received `### Request Context` because the private hub depends on an identified-session cookie, query-string provenance, or a carry-forward identifier from a prior visible UX API response. No raw cookie, token, session identifier, provider credential, hidden conversation identifier, or lower-layer contract appears in JSON.

## Route Authoring Rules Applied

- Preserved all eight route headings, descriptions, `### Source Actions` mappings, and `### Mockup Files` lists.
- Kept creation free of a pre-existing conversation UID or version and returned a server-issued public conversation UID plus a browser-safe workspace URL.
- Kept GET bodies empty and named visible query inputs in request context.
- Returned display-ready listed results, active joined-conversation cards, public conversation UIDs for later visible actions, and public-safe continuation values for multi-step hidden joining.
- Kept hidden discovery privacy-safe: incomplete and ambiguous evaluation states expose only state and a hidden count; only a complete eligible match returns `hiddenMatchUid`, never the hidden conversation UID or tag set.
- Made listed and unlisted join requests feasible from prior visible responses.
- Documented populated, empty, unavailable, ineligible, stale, and retryable branch behavior without exposing permission internals or frontend business-rule inputs.
- Used 32-character hyphenless v4 UUID examples for public UID fields and all-caps enum values for selectable/status values.
- Kept payloads UI-facing and omitted backend joins, database identifiers, audit data, application API contracts, secure API contracts, and authentication internals.

## Request Context Sources

- Identified-session cookie supplied by the browser; the UX API derives actor and authorization context.
- Current partial tag and selected listed tags from visible inputs, sent as query parameters for suggestion retrieval and listed search.
- `conversationUid` from a visible listed result for listed join.
- `hiddenMatchUid` from the complete eligible unlisted-evaluation response for unlisted join.
- `conversationUid` from a visible Joined Resume control for access resolution.

## Validation

- `validate-route-coverage.mjs` passed with eight companion actions, eight mapped actions, and eight routes.
- The route file has eight request-payload sections and eight response-payload sections.
- All twelve JSON example blocks parse successfully.

## Ambiguities Carried Forward

- Human authentication and the concrete session-cookie name remain unresolved; the payload layer records only that the browser supplies an identified-session cookie.
- Listed extra-tag semantics, exact versus superset hidden matching, and multiple complete hidden-match behavior remain unresolved in `REQUIREMENTS.md`; payload states do not choose new matching rules.
- Tag display casing remains unresolved; examples preserve the lowercase mockup presentation.
- Creation failure transport status and the exact validation-error field structure remain for route tightening/review; the documented branches deliberately guarantee no created UID and a reusable browser-held draft.

## Temporary Files And Scope Confirmation

- Private temporary directory used: `.solpoc-tmp/draft-routes/hub/04-route-payload-drafter/`
- The private temporary directory and all specifications, screenshots, results, and reports inside it were removed before this handoff was written.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- Only `docs/mockup/routes/hub-routes.md` and `ai-docs/draft-routes/hub/04-route-payload-drafter.md` were changed by this phase.
- No HTML, CSS, JavaScript, concept document, companion, schema, mock data, application source, package file, OpenAPI file, backend code, application API contract, secure API contract, or frontend business logic was changed.
