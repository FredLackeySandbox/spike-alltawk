# Phase 1 Backend Data Action Analyst Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Platform and folder: `desktop/hub`
- Viewport rendered: `1080px`
- Assigned pages: `docs/mockup/desktop/hub/create.html`, `docs/mockup/desktop/hub/find.html`, and `docs/mockup/desktop/hub/index.html`

## Concept Documents Read

- `docs/concepts/APP_PAGES.md`
- `docs/concepts/APP_STRUCTURE.md`
- `docs/concepts/AREA_LAYOUTS.md`
- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/USER_TYPES.md`

All concept documents were read before the mockup source was inspected. `docs/concepts/APP_PAGES.md` supplied the page-purpose descriptions and required hub behaviors.

## Playwright Inspection

The default state of every assigned page was rendered and visually inspected at 1080px before its source was read. Representative states and interactions were then rendered after source inspection.

Runner contract used:

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec","--no","--package","playwright","--","playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

The CommonJS specifications imported `test` and `expect` from that exact absolute module and invoked the supplied command and arguments with the `test` subcommand. The private inspection directory was `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/hub/01-backend-data-action-analyst/`.

Rendered states included:

- `create.html`: default listed form; invalid, duplicate, maximum, and minimum tag feedback; unlisted access with the listed-only option hidden; create failure; timeout; and pending-to-success with first-owner confirmation and stored result.
- `find.html`: listed loading and populated results; no-tag guidance; no-match result; search failure and retry; banned listed result; listed join failure; known-unlisted partial count, complete unique match, banned match, join failure, and successful join navigation.
- `index.html`: default loading and populated list; empty list; failure and retry success; unavailable session; stale removed membership; unresolvable selection; and active-resume navigation behavior.

Every generated Playwright specification, output file, screenshot, and contact sheet remained in the assigned private directory. That directory was removed before this handoff was written, and cleanup was confirmed by the bundled phase cleanup validator.

## Source Inspection And Traces

The complete assigned HTML, inline CSS, and inline JavaScript were inspected. The directly referenced local files `docs/mockup/desktop/assets/styles.css` and `docs/mockup/desktop/assets/app.js` were also read completely.

- `create.html`: traced tag validation and chip mutation, access and matching-mode selection, stable submit snapshot, pending edit/navigation lock, query-driven `outcome=fail|timeout` branches, generated conversation and timestamp, owner membership and role-period creation, `sessionStorage` persistence, success confirmation, and delayed workspace navigation.
- `find.html`: traced eligible suggestion filtering, tag validation, mode switching, stale evaluation tokens, timer-backed listed and unlisted evaluation, inclusive/exclusive fixtures, privacy-safe hidden counts, complete hidden matches, eligibility checks, join pending/failure/retry/success branches, membership `sessionStorage` writes, and workspace navigation.
- `index.html`: traced query-driven `sim`, `stale`, and `unresolved` entry states, session gating, timer-backed joined-list retrieval, newest-first projection, loading/list/empty/error/retry rendering, active-only membership filtering, private moderation conversation inclusion, stale membership removal, unresolvable selection recovery, and selected conversation navigation.

## Mockup Simulations Treated As Backend Evidence

- Fixture-backed joined conversations, listed catalog entries, eligible suggestion tags, and hidden tag combinations stand in for authoritative retrieval.
- Timers stand in for joined-list loading, search evaluation, join attempts, and creation work.
- `sessionStorage` writes stand in for durable membership and created-conversation state.
- Generated conversation identifiers and timestamps, initial owner membership, and the open owner role period stand in for a durable create transaction.
- Query parameters exercise creation failure/timeout and hub loading, empty, error, unavailable-session, stale-membership, and unresolvable-selection states.
- Explicit success, failure, retry, banned/ineligible, stale, empty, pending, and timeout branches were retained as required visible outcomes rather than dismissed as local-only behavior.

## Navigation And Entry-State Signals

- `index.html` links to `find.html` and `create.html`; both return to the hub, and successful create/join or active Resume continues to `docs/mockup/desktop/conversation/thread.html`.
- `create.html?outcome=fail` and `create.html?outcome=timeout` expose deterministic non-default submission outcomes.
- `index.html` accepts `sim=loading|empty|error|flaky|no-session`, `stale={conversationKey}`, and `unresolved={conversationKey}`.
- The listed/known-unlisted switch and the supplied tag set define materially different search entry states in `find.html`; source-only fixtures expose banned and transient-failure branches.
- `index.html` includes a normal private moderation conversation in Joined, consistent with the concept requirement that participating administrators can resume related moderation discussions from the same hub.

## Companion Files Written

- `docs/mockup/desktop/hub/create.md`
- `docs/mockup/desktop/hub/find.md`
- `docs/mockup/desktop/hub/index.md`

## Backend Action Inventory

- `create.md`
  - `Create Conversation` — a true create lifecycle action with no pre-existing conversation identifier; the successful operation establishes the identified creator as first owner. No update action exists because the page has no existing-record entry mode.
- `find.md`
  - `Retrieve Listed Tag Suggestions`
  - `Search Listed Conversations`
  - `Join Listed Conversation`
  - `Evaluate Known Unlisted Conversation Tags`
  - `Join Unlisted Conversation`
- `index.md`
  - `Retrieve Joined Conversations`
  - `Resolve Joined Conversation Access`

The headings use business verb-object language. Presentational mode toggles, chip removal, client-side filtering of already loaded markup, and navigation-only Find/Create links were not promoted to backend actions. Distinct retrieval, search/evaluation, membership persistence, access resolution, and record-creation lifecycles were preserved.

## Inconsistencies And Ambiguities

- `find.html` uses fixture-internal conversation IDs and raw hidden tag combinations to simulate carry-forward selections. Later route phases should expose only public-safe conversation identifiers or opaque continuation values and must not disclose unlisted identity before successful membership establishment.
- `create.html` generates a local timestamp-based identifier. This is evidence that the backend must issue the durable conversation identifier, not a proposed identifier format.
- The requirements leave extra-tag behavior, multiple complete hidden matches, human authentication, exact tag casing/grammar, and rejoining semantics unresolved. The companions preserve observed UI branches without settling those product questions.
- `index.html` models an unavailable private session but does not define the authentication mechanism, which remains explicitly unresolved in the requirements.
- No rendered-inspection blocker remains.

## Scope Confirmation

Only the three assigned page companion markdown files and this handoff were written. No backend route, schema, data logic, frontend business logic, HTML, CSS, JavaScript, concept document, mock data, application source, package file, OpenAPI file, or route file was changed.
