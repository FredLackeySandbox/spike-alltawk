# Phase 6 Route Payload Reviewer Handoff

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
- `docs/mockup/desktop/assets/app.js`
- `ai-docs/draft-routes/governance/03-area-route-drafter.md`
- `ai-docs/draft-routes/governance/04-route-payload-drafter.md`
- `ai-docs/draft-routes/governance/05-route-rules-tightener.md`

No file under `projects/**` was read or written.

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`

The private CommonJS specification imported `test` and `expect` from the exact absolute `testRunnerModule`. The exact selected command was invoked with the `test` subcommand and the owned configuration; no package-name import, `npx`, runner rediscovery, substitution, or dependency installation was used.

## Rendered Inspection

Playwright rendered every route-referenced HTML page at 1080 pixels:

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/settings.html`

Members and Roles inspection covered:

- Default owner roster, active/former filtering, owner-continuity notice, participant actions, and current suspension display.
- Administrator, ordinary-member denied, retryable-load-failure, and empty-former entry fixtures.
- Promote-to-administrator, unban, and create-suspension interaction outcomes.
- The mockup's explicit unban behavior, which changes a banned former identity to eligible-to-rejoin without reactivating membership.

Tags and Lifecycle inspection covered:

- Owner listed/exclusive, administrator listed/inclusive, owner unlisted/all-tags, archived, ordinary-member denied, and unavailable entry states.
- Tag editing with retryable save failure and retained browser draft.
- Archive confirmation, retained-record messaging, and retryable archive failure.

The first inspection run exposed two private test-selector mistakes: one text locator was ambiguous and the failure toggle was clicked after an open modal intercepted pointer events. Both private harness selectors were corrected without changing mockup source, and the full selected-runner inspection then passed with two tests.

## Route Authoring Rules Applied

- Preserved all 11 route headings and their discovery-provided `governance` namespace.
- Preserved all 12 approved source-action mappings and every `### Mockup Files`, `### Route`, and `### Request Context` subsection.
- Confirmed each request uses only current-route values, selected public UIDs, prior UX API response values, visible form values, or explicit action intent.
- Confirmed session, CSRF, viewer identity, authority, ownership continuity, retained role decisions, and lifecycle decisions remain outside JSON payloads and server-side.
- Confirmed roster and governance versions are safe public carry-forward values used for stale-state protection.
- Confirmed existing editable tag values, suspension public UIDs, editable suspension values, allowed actions, counts, lifecycle states, return target, and archived outcome are UI-ready without exposing database IDs, credentials, JWTs, audit rows, provider secrets, permission internals, or lower-layer contracts.
- Confirmed all UID examples are 32-character hyphenless v4 UUID strings and selectable role, state, action, discovery, matching, page, and outcome values use all-caps enum strings.
- Confirmed the create, update, and end suspension contracts remain distinct and invocation-feasible.
- Preserved the corrected Phase 5 identity rule: each route heading operation appears exactly once in its `### Route` block.

## Payload Corrections

The review made only these UI-facing response corrections in `docs/mockup/routes/governance-routes.md`:

- Added `PROMOTE_TO_OWNER` to the Update Participant Role response when the example promotes a member to administrator, matching the rendered owner view where administrators remain eligible for owner promotion.
- Added `PROMOTE_TO_OWNER` and `PROMOTE_TO_ADMINISTRATOR` to the suspended participant in Retrieve Conversation Roster and to the Create, Update, and End Posting Suspension responses. Posting restriction changes do not change the participant's member role or remove owner-visible promotion actions.
- Added authoritative `endDate`, `endTime`, and `timeZone` values to the Create Posting Suspension response. These values let the immediately available Change Suspension form prefill from the server result without relying on stale request values or hidden frontend context.

No request payload needed another frontend-supplied field, and no response payload needed an internal or speculative field. Existing payload shapes were otherwise retained under YAGNI.

## Request Context Review

- `conversationUid` comes from the current governance page route.
- `participantUid`, `suspensionUid`, `rosterVersion`, current editable suspension values, and retained displayed role come from Retrieve Conversation Roster.
- `governanceVersion` and editable tags come from Retrieve Conversation Governance Settings.
- `targetRole` comes from the visible promotion action.
- Suspension end date, time, and time zone come from the visible form.
- Browser-managed session and page-bootstrap CSRF values remain documented only in request transport/context.
- Owner/administrator authority, last-owner protection, restoration role choice, archived-state checks, field validation, and stale-state decisions remain server-side.

## Validation

The bundled route-coverage validator passed after payload review:

- `companionActionCount`: `12`
- `mappedActionCount`: `12`
- `routeCount`: `11`
- `operationCount`: `11`
- Blockers: none

Structural verification also confirmed:

- 11 route sections.
- Exactly one Source Actions, Mockup Files, Route, Request Context, Example Request Payload, and Example Response Payload subsection per route.
- Each heading operation appears exactly once in its HTTP block.
- Every JSON payload block parses.
- Every public UID example passes the required hyphenless v4 format.

## Unresolved Ambiguities

- `REQUIREMENTS.md` requires unbanning to restore an appropriate active role, while the rendered Members mockup only marks the former identity eligible to rejoin. The existing Restore Banned Participant response continues to follow the higher-priority requirement and returns active membership with a server-decided restored role; no browser role picker or hidden decision input was invented.
- Tag display casing, some tag grammar edge cases, the effect of tag changes on in-progress unlisted joins, and archived-conversation visibility remain unresolved in the requirements. The examples do not settle those product questions.

No ambiguity blocks any documented governance operation.

## Temporary Directory Cleanup

The only Playwright temporary directory used was:

`/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/governance/06-route-payload-reviewer/`

It contained the private CommonJS specification, configuration, screenshots, and test output. The owned directory was removed before this handoff was written. The phase-scoped cleanup validator passed with no entries or blockers.

## Scope Confirmation

- Files written:
  - `docs/mockup/routes/governance-routes.md`
  - `ai-docs/draft-routes/governance/06-route-payload-reviewer.md`
- No route identity, description, source-action mapping, mockup-file mapping, Route block, or Request Context subsection was added, removed, renamed, or orphaned.
- No HTML, CSS, JavaScript, concept, companion, schema, mock-data, package, OpenAPI, application-source, backend-code, application API, secure API, or frontend-business-logic file was changed.
- No shared scratch file or output outside `solutionArtifactRoot` was created.
