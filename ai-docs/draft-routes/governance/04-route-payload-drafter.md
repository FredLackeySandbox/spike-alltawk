# Phase 4 Route Payload Drafter Handoff

## Target

- Platform: desktop
- Work-unit slug: `governance`
- Route file: `docs/mockup/routes/governance-routes.md`
- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`. Every filesystem read and write used an absolute path beneath that root.

## Inputs Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/governance-routes.md`
- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`
- `ai-docs/draft-routes/governance/03-area-route-drafter.md`

Every source action's page states, evidence, visible inputs, and required outcomes were reviewed before drafting its route payloads.

## Playwright Inspection

The preflight-selected runner contract was used without substitution:

- ID: `npm-exec-no-cli`
- Label: `npm exec --no --package playwright -- playwright`
- Usage: `npm exec --no --package playwright -- playwright`
- Command: `npm`
- Base arguments: `["exec", "--no", "--package", "playwright", "--", "playwright"]`
- Version: `1.61.1`
- Test runner module: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

CommonJS specifications imported `test` and `expect` from the exact absolute test runner module. The required command and base arguments invoked the `test` subcommand. No package-name import, alternate runner, dependency installation, or smoke-test command was used.

The following mockup states were rendered at the assigned 1080-pixel viewport:

- `docs/mockup/desktop/governance/members.html`: default owner roster; administrator; ordinary-member denied; retryable load failure; empty active roster; empty former roster; expired suspension; former-filter empty state.
- `docs/mockup/desktop/governance/members.html`: create-suspension form and success state; update-suspension prefilled state; administrator-promotion confirmation.
- `docs/mockup/desktop/governance/settings.html`: owner listed-exclusive; administrator listed-inclusive; owner unlisted-all-tags; archived; ordinary-member denied; unavailable.
- `docs/mockup/desktop/governance/settings.html`: retryable tag-save failure; stale tag-save permission; archive confirmation; retryable archive failure.

All interactions were local mockup behavior. No real API, authentication provider, live backend, or third-party system was contacted.

The private inspection directory was `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/governance/04-route-payload-drafter/`. It was removed after the final rendered check and before this handoff was written. No root-level Playwright specification, result, report, screenshot, trace, or configuration path was created.

## Routes Updated

Exactly one `### Example Request Payload` and one `### Example Response Payload` were added to all ten existing routes:

1. Retrieve Conversation Governance
2. Promote Participant Role
3. Remove Participant
4. Ban Identity
5. Restore Banned Participant
6. Create Posting Suspension
7. Update Posting Suspension
8. End Posting Suspension
9. Update Conversation Tags
10. Archive Conversation

The retrieval route uses the exact no-body statement and documents `conversationUid` and selected governance `view` as query-derived request context. Each mutation example contains only visible action intent, page-route values, or public identifiers carried from the retrieval response. The route headings, descriptions, `### Source Actions`, and `### Mockup Files` mappings were preserved.

## Route Authoring Rules Applied

- Preserved all twelve approved source-action mappings and all ten Phase 3 routes.
- Kept create and update posting-suspension contracts distinct. Creation does not require an existing suspension UID and returns one; update and end requests carry the public suspension UID supplied by roster retrieval.
- Made roster actions invocable with public participant UIDs returned by governance retrieval.
- Returned editable suspension values, participant states, counts, allowed actions, and owner-continuity display data needed by the members page.
- Returned committed tag values and lifecycle/next-page data needed after tag updates.
- Returned archive lifecycle state and retained-record confirmation without exposing retention implementation.
- Used only 32-character, hyphen-free version-4 UUID examples for public UID fields.
- Used all-caps enum strings for roles, lifecycle states, access states, views, identity types, results, and allowed actions.
- Kept authenticated identity, current authority, final-owner protection, validation, role history, workflow decisions, and data joins behind the UX API boundary.
- Kept raw session values, credentials, tokens, database identifiers, private workflow state, and lower-layer application or secure API contracts out of JSON.

## Request Context Sources

- The current `conversationUid` is sourced from the page route.
- The selected governance view is sourced from the page being opened.
- Public `participantUid` values and suspension UIDs are sourced from the Retrieve Conversation Governance response.
- The retained role used by the restore flow is sourced from the selected banned roster entry.
- The user's authentication is browser-managed, while the exact human authentication mechanism remains unresolved by the requirements; no ungrounded cookie or header name was invented.
- Unsaved tag state remains browser-local and blocks archive invocation before the request is sent.

## Ambiguities

- The shared retrieval example shows the `MEMBERS` response shape. A `SETTINGS` request must return the analogous view-specific editable tags, read-only discovery/matching summary, lifecycle state, viewer role, and allowed actions described by the source action; the examples remain illustrative rather than schemas.
- Requirements do not resolve the human browser authentication mechanism, so request context names browser-managed authentication without choosing a cookie, bearer token, or storage source.
- Requirements do not decide whether restored participants always receive the retained role. The payload carries the visible retained role from the roster, matching the Phase 3 route decision, while the server remains authoritative.
- Tag display casing and some tag grammar details remain unresolved. The payload uses the lowercase values rendered by the mockup without declaring a broader storage or display rule.

No ambiguity blocked Phase 4 payload drafting.

## Validation and Scope Confirmation

- The action-to-route coverage validator passed with twelve companion actions mapped across ten routes.
- All ten route sections contain exactly one source-actions subsection, mockup-files subsection, example request subsection, and example response subsection.
- Every fenced JSON example parses successfully.
- Written route file: `docs/mockup/routes/governance-routes.md`
- Written handoff: `ai-docs/draft-routes/governance/04-route-payload-drafter.md`
- Only these two assigned markdown files were changed by this phase.
- No HTML, CSS, JavaScript, concept, schema, mock-data, package, OpenAPI, application source, backend implementation, frontend business logic, application API contract, secure API contract, or neighboring route/review file was changed.
