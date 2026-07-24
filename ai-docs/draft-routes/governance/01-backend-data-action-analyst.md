# Phase 1 Backend Data Action Analyst Handoff

## Target

- Platform: desktop
- Folder: `docs/mockup/desktop/governance/`
- Work-unit slug: `governance`
- Viewport rendered: 1080 pixels

## Concept Documents Read

- `docs/concepts/APP_PAGES.md`
- `docs/concepts/APP_STRUCTURE.md`
- `docs/concepts/AREA_LAYOUTS.md`
- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/USER_TYPES.md`

All concept markdown was read before page source analysis. `docs/concepts/APP_PAGES.md` supplied the page-purpose descriptions and `docs/concepts/REQUIREMENTS.md` supplied the governing role, retention, tag, restriction, and archival rules.

## Playwright Runner Contract

- `id`: `npm-exec-no-cli`
- `label`: `npm exec --no --package playwright -- playwright`
- `usage`: `npm exec --no --package playwright -- playwright`
- `command`: `npm`
- `baseArgs`: `["exec","--no","--package","playwright","--","playwright"]`
- `version`: `1.61.1`
- `testRunnerModule`: `/Users/flackey/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/test.js`

The CommonJS specifications imported `test` and `expect` directly from the exact absolute `testRunnerModule` and invoked the supplied command and base arguments with the `test` subcommand. No package-name import, runner rediscovery, dependency installation, live backend, or external service was used.

## Rendered Pages and Entry States

### `docs/mockup/desktop/governance/members.html`

- Default 1080-pixel render, including the initial local loading state.
- Completed owner roster with active people and bots, a current suspension, last-owner protection, and the active/former filter.
- `?fixture=admin`, including the administrator badge and removal of owner-promotion controls.
- `?fixture=expired`, including automatic presentation of the expired suspension as active.
- `?fixture=empty-active` and `?fixture=empty-former`, including empty-filter outcomes and updated counts.
- `?fixture=member`, including governance denial and the return-to-conversation action.
- `?fixture=fail`, including the retryable roster failure and successful Retry reset to the baseline entry state.
- Former-roster state.
- Promotion confirmations and successful owner promotion.
- Removal confirmation and successful movement into retained former membership.
- Ban and unban confirmations and outcomes.
- New posting-suspension form validation, pending behavior, and success.
- Existing suspension immediate-end confirmation and restored posting access.

### `docs/mockup/desktop/governance/settings.html`

- Default 1080-pixel owner/listed/exclusive render.
- Owner listed/exclusive, administrator listed/inclusive, owner unlisted/all-tags, owner archived, ordinary-member denied, and invalid/unavailable scenario states.
- Tag validation for whitespace, duplicate values, multiple colons, and the ten-tag maximum.
- Dirty-editor discard confirmation and keep-editing path.
- Tag-save pending, retryable failure with preserved draft, stale-permission denial, successful persistence, success toast, and return-to-conversation continuation.
- Archive blocking while tags are dirty.
- Archive confirmation, pending, retryable failure, stale-owner denial, successful archive persistence, and retained-record result.

## Source and Behavior Inspected

- `docs/mockup/desktop/governance/members.html` — complete HTML, inline CSS, and inline JavaScript.
- `docs/mockup/desktop/governance/settings.html` — complete HTML, inline CSS, and inline JavaScript.
- `docs/mockup/desktop/assets/styles.css` — complete directly referenced shared stylesheet.
- `docs/mockup/desktop/assets/app.js` — complete directly referenced modal, dropdown, toast, and Escape-key behavior.

The inspection traced each page from initialization through visible controls and handlers. On members, this included `URLSearchParams` fixture selection, delayed roster boot, retry navigation, filter derivation, owner recomputation, row-menu routing, confirmation dialogs, role mutation, membership-state mutation, local ban/rejoin state, suspension validation, delayed completion, and expired-suspension resolution. On settings, this included scenario initialization, `sessionStorage` override reads and writes, permission and lifecycle guards, chip validation, dirty-state comparison, save pending/failure/stale/success branches, cancel/discard handling, archive guards, archive pending/failure/stale/success branches, and scenario resets.

## Mockup Simulations Treated as Backend Evidence

- The members roster’s 450-millisecond boot timer stands in for authoritative roster retrieval and supports loading, failed, denied, empty, and completed states.
- Members fixture rows stand in for active and retained former membership, current role, identity type, suspension state, owner continuity, and rejoin eligibility.
- In-memory role, membership, ban, and suspension mutations stand in for durable temporal role/membership changes and server-controlled governance operations.
- The local `bannedSet` and `window.__canRejoin` behavior stand in for authoritative ban enforcement against future rejoin.
- The suspension timer, stored end date/time, expired-state resolution, and success/validation outcomes stand in for time-bounded restriction creation, update, ending, and authoritative expiry.
- Settings scenario fixtures stand in for server-returned tags, viewer role, membership state, visibility, matching mode, lifecycle state, archive metadata, and permission boundaries.
- Settings `sessionStorage` writes stand in for durable tag and archive persistence.
- Settings save and archive timers, stale-role branches, generated archive timestamp, and explicit success/failure branches stand in for backend requests, concurrency/authorization rechecks, and business outcomes.

## Navigation and Alternate Entry Signals

- Both pages receive the current conversation context from links originating in `docs/mockup/desktop/conversation/thread.html`, as established by `docs/concepts/APP_PAGES.md`.
- `members.html` and `settings.html` link to each other through the governance subnavigation.
- Both pages return to `docs/mockup/desktop/conversation/thread.html`.
- `members.html` links to `docs/mockup/desktop/moderation/index.html` for report review.
- `members.html` exposes source-defined entry fixtures through `?fixture=admin`, `?fixture=expired`, `?fixture=empty-active`, `?fixture=empty-former`, `?fixture=member`, and `?fixture=fail`.
- `settings.html` exposes representative owner, administrator, unlisted, archived, member, and unavailable states through its page-local scenario selector. No query-string or hash entry mode is implemented for that page.
- No assigned page uses incoming hashes. `settings.html` reads per-scenario `sessionStorage` values; `members.html` has no browser-storage entry state.

## Companion Files Written

- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.md`

## Backend Action Inventory

### `docs/mockup/desktop/governance/members.md`

- Retrieve Conversation Roster
- Promote Participant to Owner
- Promote Participant to Administrator
- Remove Participant
- Ban Identity
- Unban Identity
- Create Posting Suspension
- Update Posting Suspension
- End Posting Suspension

The posting-restriction lifecycle is deliberately separated into creation for a currently unsuspended participant, update for an identified existing suspension, and immediate ending. Owner and administrator promotion are also kept distinct because their eligible actors, authority boundaries, and ownership-continuity outcomes differ.

### `docs/mockup/desktop/governance/settings.md`

- Retrieve Conversation Governance Settings
- Update Conversation Tags
- Archive Conversation

This settings page updates an already identified conversation; it does not create a conversation or edit the creation-time visibility and matching choices. Tag drafting, cancel/discard, fixture selection, filtering already-loaded roster data, modal opening, and navigation-only controls were not promoted to standalone backend actions.

## Naming Principles Applied

- Used product/business verb-object names rather than control labels.
- Used Retrieve for authoritative page initialization and explicit lifecycle verbs for durable changes.
- Avoided ambiguous Save headings, route names, API paths, database fields, lower-layer implementation, and frontend business-rule placement.
- Consolidated duplicate triggers while retaining requirements-backed differences in owner versus administrator promotion and posting-suspension lifecycle.

## Inconsistencies and Ambiguities

- In `docs/mockup/desktop/governance/members.html`, the `?fixture=member` state correctly denies roster access but leaves the page-heading badge reading “You’re an owner.” The denial state and requirements were treated as authoritative.
- In `docs/mockup/desktop/governance/members.html`, the administrator fixture retains the generic ownership-continuity copy suggesting promotion or archival even though administrators cannot promote to owner or archive. The actual removed owner controls and requirements were treated as authoritative.
- Members mutations do not simulate retryable failure or stale-permission branches even though these are consequential backend operations. The companions retain appropriate failed and stale outcomes for later contract drafting.
- In `docs/mockup/desktop/governance/settings.html`, invalid fixture rendering returns before updating the role badge, so the badge may retain a prior scenario’s role. The unavailable state was treated as authoritative.
- The members mutation display date is hard-coded to Jul 22, 2026 while the inspection occurred on Jul 23, 2026. This is mockup-only display drift; later phases should use server-authoritative effective timestamps rather than that literal.
- Tag casing display policy, exact multi-hyphen grammar, archived-conversation visibility, and post-tag-change effects remain open requirements and were not resolved here.

No inconsistency blocked Phase 1 analysis.

## Cleanup and Scope Confirmation

- Private Playwright directory used: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/governance/01-backend-data-action-analyst/`
- The entire owned private directory, including specifications, configuration, screenshots, runner output, and error context, was removed before this handoff was written.
- Cleanup was explicitly verified: the private phase directory no longer exists.
- No root-level Playwright specification, `test-results/`, `playwright-report/`, screenshot, trace, or temporary configuration was created.
- No backend route, data logic, frontend business logic, HTML, CSS, JavaScript, concept document, schema, mock data, package file, or application source file was changed.
- Only the two assigned page companions and this Phase 1 handoff were written.
