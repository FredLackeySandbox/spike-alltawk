# Phase 4 Route Payload Drafter Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Platform: desktop
- Work-unit slug: `governance`
- Route namespace: `governance`
- Route file: `docs/mockup/routes/governance-routes.md`
- Viewport widths: `1080`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`.

## Files Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/mockup/routes/governance-routes.md`
- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`
- `ai-docs/draft-routes/governance/03-area-route-drafter.md`

No project files outside the assigned read set were inspected.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`

The CommonJS inspection specification imported `test` and `expect` from the exact absolute `testRunnerModule`. The exact selected command was invoked with the `test` subcommand; no package-name import, `npx`, dependency discovery, substitution, or installation was used.

## Rendered Inspection

Playwright rendered every referenced page at 1080 pixels:

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/settings.html`

Representative Members and Roles states rendered:

- Default owner roster, active and former counts, last-owner protection, and suspended participant row.
- Administrator, permission-denied member, retryable load failure, empty-active, empty-former, and expired-suspension fixtures.
- Owner and administrator promotion confirmations.
- Remove, ban, unban, create-suspension, update-suspension, and end-suspension dialogs.

Representative Tags and Lifecycle states rendered:

- Active owner listed/exclusive, active administrator listed/inclusive, active owner unlisted/all-tags, archived, ordinary-member denied, and unavailable fixtures.
- Tag-save retryable failure and stale-permission outcomes.
- Archive confirmation, retryable failure, and successful archived outcome.

The first broad interaction probe found two private harness selector mistakes. Those temporary selectors were corrected, and the complete alternate-state interaction run then passed with the selected runner. No mockup source was changed.

## Routes Updated

Exactly one `### Example Request Payload` and one `### Example Response Payload` were added to each of the 11 existing route sections:

- `GET /api/v0/governance/retrieve-conversation-roster`
- `PATCH /api/v0/governance/update-participant-role`
- `DELETE /api/v0/governance/remove-participant`
- `POST /api/v0/governance/ban-identity`
- `POST /api/v0/governance/restore-banned-participant`
- `POST /api/v0/governance/create-posting-suspension`
- `PATCH /api/v0/governance/update-posting-suspension`
- `DELETE /api/v0/governance/end-posting-suspension`
- `GET /api/v0/governance/retrieve-conversation-governance-settings`
- `PATCH /api/v0/governance/update-conversation-tags`
- `POST /api/v0/governance/archive-conversation`

All 12 approved source actions remain mapped under their original 11 route identities. Existing route headings, descriptions, `### Source Actions`, and `### Mockup Files` lists were preserved.

## Request Context and Value Provenance

Each route now has a `### Request Context` subsection because every governance operation depends on an authenticated browser session and a conversation selected by the current page route.

- Session cookies remain browser-managed and do not appear in JSON examples.
- Conversation UIDs come from the current page route.
- Participant UIDs, suspension UIDs, retained roles, and roster versions come from the prior Retrieve Conversation Roster response.
- Governance versions and editable tags come from the Retrieve Conversation Governance Settings response and visible editor state.
- Target roles come from the visible promotion action.
- Suspension end date, time, and time zone come from the visible suspension form.

No raw cookie, token, session identifier, secret, database identifier, authorization internals, audit records, application API contract, secure API contract, or lower-layer payload was included.

## Route Authoring Rules Applied

- Preserved every approved source-action mapping and existing operation identity.
- Kept create, update, and end posting-suspension contracts distinct.
- Made create-suspension feasible without a pre-existing suspension UID.
- Returned public suspension UIDs and editable end values from roster data for later update and end operations.
- Returned roster and governance versions as safe carry-forward values for stale-state reconciliation.
- Returned UI-ready roles, access states, counts, allowed actions, editable tags, lifecycle state, matching meaning, and continuation values.
- Used only user-entered values, selected public UIDs, current route values, prior UX API response values, and action intent in requests.
- Used 32-character hyphenless v4 UUID examples for public UID values.
- Used all-caps values for selectable roles, states, actions, discovery modes, and matching modes.
- Used the exact no-body sentence for both GET routes.
- Kept JSON examples concrete, pretty-printed, comment-free, and parseable.

Structural verification found 11 route sections, 11 request payload subsections, 11 response payload subsections, 11 request-context subsections, 20 parseable JSON blocks, and no malformed UID examples.

## Ambiguities and Review Notes

- The Members mockup's Unban success makes a former identity merely eligible to rejoin, while `REQUIREMENTS.md` and the corrected companion require restoration to an appropriate active role. The restore response follows the higher-priority requirements and returns an active member. This known mockup inconsistency remains for Phase 5 and Phase 6 review.
- Tag display casing and some tag grammar edge cases remain unresolved in the requirements. Examples use the lowercase display convention rendered by the current mockup without claiming a permanent casing policy.
- The response examples show representative successful branches. Existing companion outcomes still require server-side field, stale, permission, protected-owner, retryable, and unavailable handling; no extra route identities were introduced for those branches.

No ambiguity blocked Phase 4 payload drafting.

## Temporary Directory Cleanup

The only Playwright temporary directory used was:

`/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/governance/04-route-payload-drafter/`

It contained the private CommonJS specification, private configuration, screenshots, and Playwright test output. The owned directory was removed before this handoff was written, and its absence was explicitly confirmed.

## Scope Confirmation

- Files written:
  - `docs/mockup/routes/governance-routes.md`
  - `ai-docs/draft-routes/governance/04-route-payload-drafter.md`
- No HTML, CSS, JavaScript, concept, companion, schema, mock-data, package, OpenAPI, application-source, backend-code, application API, secure API, or frontend-business-logic file was changed.
- No file under `projects/**` was read or written.
- No shared scratch file or output outside `solutionArtifactRoot` was created.
