# Phase 5 Route Rules Tightener Handoff

## Assignment

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- `repoRelativeBase`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and work unit: `desktop/hub`
- Route file tightened: `docs/mockup/routes/hub-routes.md`
- Page catalog: `docs/concepts/APP_PAGES.md`

All markdown path references in this handoff and the route file are repository-relative to `solutionArtifactRoot`. All filesystem operations used the corresponding absolute paths under that root. `projects/**` was not read or changed.

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
- `ai-docs/draft-routes/hub/04-route-payload-drafter.md`

All eight existing route sections and all eight exact `### Source Actions` mappings were preserved. No route was added, removed, renamed, merged, or split.

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`
- CommonJS import: `const { test, expect } = require("/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js");`
- Test invocation: the supplied `command` and `baseArgs`, followed by the `test` subcommand

The exact preflight-selected command/module pair ran successfully. Four tests passed in Chromium, and no alternative Playwright route, package-name import, dependency installation, live API, authentication service, or third-party system was used.

## Rendered Inspection

Every referenced HTML page and safely reachable source-action state was rendered at the assigned 1080-pixel viewport.

- `create.html`: default listed setup, unlisted setup, invalid-tag feedback, pending create lock, draft-preserving service failure, draft-preserving timeout, and successful creation/workspace continuation.
- `find.html`, listed mode: populated results, empty results, eligible and empty suggestions, pending evaluation, stale evaluation suppression after chip changes, recoverable search failure and retry, pending Join, banned/not-eligible Join, retryable Join failure, and successful continuation.
- `find.html`, known-unlisted mode: empty start, partial hidden match, complete unique eligible match, pending Join, complete ineligible match, recoverable evaluation failure and retry, retryable hidden Join failure, and successful continuation.
- `index.html`: restrained loading, populated newest-first list, empty list, persistent load failure, retry-success load, unavailable identified session, stale removed membership, and temporarily unresolvable Resume selection.

The rendered behavior confirmed the need for reusable browser-held create drafts, normalized search echoes for stale-response suppression, privacy-safe hidden-match branches, a public continuation identifier between the two unlisted steps, session-required private-list behavior, and distinct stale-versus-retryable Resume outcomes.

## Routes Tightened

Exactly one fenced `### Route` subsection and exactly one `### Request Context` subsection now exist in each route:

- `POST /api/v0/hub/create-conversation`
- `GET /api/v0/hub/retrieve-listed-tag-suggestions`
- `GET /api/v0/hub/search-listed-conversations`
- `POST /api/v0/hub/join-listed-conversation`
- `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`
- `POST /api/v0/hub/join-unlisted-conversation`
- `GET /api/v0/hub/retrieve-joined-conversations`
- `GET /api/v0/hub/resolve-joined-conversation-access`

The route shapes show concrete methods, paths, repeated query parameters, the browser-managed `tawk_session` cookie, `X-CSRF-Token` for state-changing requests, and `Content-Type: application/json` where a JSON body is sent. UID and session/CSRF values use placeholders in `http` blocks; no raw session, credential, private identifier, or hard-coded UID-looking value appears in a route shape.

## Request Context And Value Provenance

- The private hub's identified actor comes from the browser-managed HttpOnly `tawk_session` cookie. The identity provider remains intentionally unspecified.
- State-changing POST requests also use `X-CSRF-Token`, sourced from the private page bootstrap and held in browser memory rather than JSON or browser storage.
- `partialTag`, repeated `selectedTag` query values, and request-body `tags` come only from visible validated tag input or chips.
- Listed `conversationUid` comes from the selected visible result returned by listed search.
- Joined-list `conversationUid` comes from the selected visible Resume control returned by joined-conversation retrieval.
- `unlistedJoinChallengeUid` comes from the prior complete eligible unlisted-evaluation response. It is documented as a public-safe, session-bound continuation UID rather than the hidden conversation identifier or a credential.
- The UX API derives identity, membership, roles, eligibility, matching decisions, and authorization server-side. None is accepted as a frontend decision.

## Route Authoring Rules Applied

- Preserved all source-action and mockup-file coverage.
- Kept Create free of a pre-existing conversation UID or version and retained a server-issued public UID plus browser-safe workspace continuation on success.
- Made every GET bodyless while identifying each query parameter and repeated-value source.
- Kept listed search step-complete by returning normalized `selectedTags`, display-ready results, and public conversation UIDs for Join.
- Kept unlisted evaluation privacy-safe: incomplete, ambiguous, failed, and ineligible branches omit the challenge UID and all hidden identity/tag details.
- Renamed the ambiguous `hiddenMatchUid` payload field to `unlistedJoinChallengeUid` so the browser-visible value is clearly a public continuation challenge, not a hidden conversation identifier.
- Made unlisted Join continuable from that prior response alone; the server recovers the private tag evaluation and match without requiring hidden context or resubmitted tags.
- Distinguished invalid/ineligible, expired-or-superseded challenge, and retryable service branches so the page knows whether to disable Join, re-evaluate visible tags, or retry.
- Clarified populated, empty, retryable, and session-required joined-list branches without returning private list data for an unavailable session.
- Clarified active, no-longer-available, and temporarily unavailable access-resolution branches, including whether the selected card is removed or retained.
- Preserved parseable UI-facing request and response examples, 32-character hyphenless v4 UUID examples for UID fields, all-caps status/role/lookup values, and browser-safe relative workspace/recovery URLs.
- Omitted raw credentials, JWTs, private redirect targets, database identifiers, audit rows, backend joins, lower-layer API contracts, and frontend authorization or matching logic.

## Payload Corrections And Branch Clarifications

- Replaced `hiddenMatchUid` with `unlistedJoinChallengeUid` in both the unlisted-evaluation response and unlisted-join request examples.
- Added a privacy-safe recoverable evaluation-failure branch.
- Split expired or superseded unlisted continuation from identity ineligibility and documented the page's next action for each.
- Added `conversationCount: 0` to the empty joined-list branch, `canRetry: true` to retryable list failures, and a private-data-free `SESSION_REQUIRED` branch.
- Clarified that stale access resolution removes only the selected visible card and recomputes the displayed count, while transient resolution failure retains the list and selection for retry.

## Validation

- `validate-route-coverage.mjs` passed with 8 companion actions, 8 mapped actions, and 8 routes.
- Structural inspection found 8 route sections, 8 `### Route` subsections, 8 fenced `http` blocks, 8 `### Request Context` subsections, 8 request-payload subsections, and 8 response-payload subsections.
- All 12 fenced JSON examples parsed successfully.
- No source-action mapping or mockup-file path was orphaned or changed.

## Ambiguities Carried Forward

- Human authentication and the identity provider remain unresolved. The route draft defines only the browser transport required by the private hub and does not select a provider or credential flow.
- Listed extra-tag semantics, exact-versus-superset hidden matching, multiple complete hidden matches, tag display casing, and exact tag grammar remain unresolved in `docs/concepts/REQUIREMENTS.md`; the route contracts preserve those boundaries without choosing new business rules.
- Conversation rejoining persistence-period semantics remain server-owned and unresolved; the Join contracts expose only the UI-visible outcome.
- Exact HTTP status codes and the detailed validation-feedback object remain intentionally unspecified because this phase documents the UI-facing example contract rather than schemas or OpenAPI.

## Temporary Files And Scope Confirmation

- Private temporary directory used: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/hub/05-route-rules-tightener/`
- All specifications, screenshots, contact sheets, results, and reports were contained in that directory.
- The private temporary directory was removed before this handoff was written, and its absence was confirmed.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- This phase changed only `docs/mockup/routes/hub-routes.md` and `ai-docs/draft-routes/hub/05-route-rules-tightener.md`.
- No HTML, CSS, JavaScript, concept document, companion, schema, mock data, application source, package file, OpenAPI file, backend code, application API contract, secure API contract, database design, authorization algorithm, validation algorithm, or frontend business logic was changed.
