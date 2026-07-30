# Phase 5 Route Rules Tightener Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Platform and work unit: `desktop/hub`
- Route namespace: `hub`
- Route file: `docs/mockup/routes/hub-routes.md`

All markdown path references are repository-relative to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths under that root.

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/hub-routes.md`
- `docs/mockup/desktop/hub/create.html`
- `docs/mockup/desktop/hub/create.md`
- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/find.md`
- `docs/mockup/desktop/hub/index.html`
- `docs/mockup/desktop/hub/index.md`
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/hub/03-area-route-drafter.md`
- `ai-docs/draft-routes/hub/04-route-payload-drafter.md`

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`
- Specification format: CommonJS importing `test` and `expect` from the exact absolute `testRunnerModule`
- Viewport: `1080 × 900`
- Final inspection result: three tests passed using the locked command/module pair

The private inspection directory was `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/hub/05-route-rules-tightener/`. Specifications, screenshots, and test output were written only there. The directory was removed before this handoff was written.

## Rendered Pages And States

- `docs/mockup/desktop/hub/create.html`
  - Default listed form, inline invalid-tag feedback, unlisted access with exclusive matching hidden, pending creation, and recoverable creation failure with the draft preserved.
- `docs/mockup/desktop/hub/find.html`
  - Populated listed results, listed tag suggestions from partial input, known-unlisted mode, complete unique hidden match, and pending hidden join.
- `docs/mockup/desktop/hub/index.html`
  - Populated joined list, unavailable identified session, flaky load with successful retry, stale removed membership with card/count update, and temporarily unresolvable Resume with the list preserved.

The rendered hidden-match state also demonstrated the unresolved extra-tag behavior: a complete hidden combination can coexist with extra visible tags in the mockup. The route contract therefore carries the complete visible tag set but does not invent exact-versus-superset semantics.

## Routes Tightened

Exactly one `### Route` fenced `http` block and exactly one concrete `### Request Context` subsection now exist for each preserved route:

- `POST /api/v0/hub/create-conversation`
- `GET /api/v0/hub/retrieve-listed-tag-suggestions`
- `GET /api/v0/hub/search-listed-conversations`
- `POST /api/v0/hub/join-listed-conversation`
- `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`
- `POST /api/v0/hub/join-unlisted-conversation`
- `GET /api/v0/hub/retrieve-joined-conversations`
- `GET /api/v0/hub/resolve-joined-conversation-access`

Each heading operation appears once in its route block. All operation identities retain the discovery-provided `hub` namespace and unique lowercase-kebab operation segment. The eight route headings, descriptions, source-action mappings, mockup file mappings, and payload pairs remain present; no route was added, removed, merged, or renamed.

## Route Authoring Rules Applied

- Preserved all eight approved source actions and their one-to-one route mappings.
- Documented a concrete browser-managed `tawk_session={opaqueSessionRef}` cookie for identified-session context without exposing raw values in JSON.
- Documented `X-CSRF-Token: {opaqueCsrfRef}` and `Content-Type: application/json` for each state-changing or private-evaluation POST.
- Traced every query and body value to visible form input, selected chips, a selected public result UID, a prior UX API response, or the established browser session.
- Kept the creator, identified actor, eligibility, matching decisions, authorization, membership state, and hidden-conversation resolution behind the UX API boundary.
- Kept conversation creation independent of a pre-existing conversation UID or version and described atomic creation of the conversation and first-owner membership.
- Preserved the listed-search public `conversationUid` continuation and the known-unlisted public-safe `continuationUid` without exposing hidden conversation identity.
- Made repeated query-value transport explicit for selected tags and documented browser handling of superseded listed-search responses.
- Kept joined-list retrieval identity-free in query/body data and tied Resume resolution to the selected public UID from the prior list response.
- Documented missing/expired-session behavior for every operation and concrete stale, ineligible, unavailable, expired-continuation, retry, and list-preservation behavior where relevant.
- Preserved UI-facing payloads and omitted raw credentials, session identifiers, database IDs, authorization internals, lower-layer API contracts, and frontend business-rule inputs.

## Request Context And Branch Clarifications

- Create uses a stable visible form snapshot and retains the browser draft after session, validation, failure, or timeout outcomes.
- Suggestion retrieval sends partial input plus repeated selected-tag query values and returns no private-only tags.
- Listed search sends repeated selected-tag query values; the browser can reject a stale response by comparing it with the current visible selection.
- Listed join carries only the public UID selected from the prior visible result and revalidates visibility and eligibility server-side.
- Known-unlisted evaluation sends the complete visible tags and can return a public-safe continuation only for a complete unique eligible match.
- Unlisted join carries that continuation and the unchanged visible tag set; an expired, superseded, or mismatched continuation requires reevaluation without disclosure.
- Joined-list retrieval derives the identified person from the session cookie and returns public UIDs needed for Resume.
- Joined-access resolution carries the selected public conversation UID and distinguishes active access, stale membership removal, and transient retry without opening the wrong workspace.

## Structural Verification

- Route headings: 8
- `### Source Actions`: 8
- `### Mockup Files`: 8
- `### Route`: 8
- `### Request Context`: 8
- `### Example Request Payload`: 8
- `### Example Response Payload`: 8
- HTTP operation lines: 8, all unique and all under `/api/v0/hub/`
- Private Playwright phase directory remaining: no

## Unresolved Ambiguities

- The human authentication provider remains unspecified. Phase 5 defines the browser-to-UX-API session-cookie and CSRF transport without choosing the upstream provider.
- Extra-tag semantics for listed search and exact-versus-superset semantics for unlisted matching remain unresolved.
- Multiple complete hidden-match behavior remains unresolved; Join remains unavailable unless the backend returns one complete unique eligible continuation.
- Rejoin-period semantics for former voluntary members remain unresolved.
- Detailed HTTP status-code mapping is deferred; the route file documents the UI-facing branch states and field presence.

## Scope Confirmation

This unique Phase 5 agent was assigned only the `desktop/hub` work unit. It changed only:

- `docs/mockup/routes/hub-routes.md`
- `ai-docs/draft-routes/hub/05-route-rules-tightener.md`

No HTML, CSS, JavaScript, concept document, page companion, schema, mock data, OpenAPI file, backend code, frontend logic, application API contract, secure API contract, package file, neighboring route artifact, or `projects/**` path was changed.
