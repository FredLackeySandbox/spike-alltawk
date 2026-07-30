# Phase 6 Route Payload Reviewer Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Platform and work unit: `desktop/hub`
- Route namespace: `hub`
- Route file: `docs/mockup/routes/hub-routes.md`

All markdown path references are repository-relative to `solutionArtifactRoot`. All filesystem operations used absolute paths under that root. `projects/**` was out of scope and was not read or changed.

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
- `docs/mockup/desktop/assets/styles.css`
- `ai-docs/draft-routes/hub/03-area-route-drafter.md`
- `ai-docs/draft-routes/hub/04-route-payload-drafter.md`
- `ai-docs/draft-routes/hub/05-route-rules-tightener.md`

Every companion action under `### Source Actions` and every page under `### Mockup Files` was reviewed against its rendered states and source behavior.

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
- Final inspection result: seven tests passed using the locked command/module pair

The private inspection directory was `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/hub/06-route-payload-reviewer/`. Specifications, screenshots, and Playwright output were written only there. The directory was removed after the final rendered check and its absence was confirmed before this handoff was written.

## Rendered Pages And States

- `docs/mockup/desktop/hub/create.html`
  - Default listed form, invalid-tag feedback, unlisted access with the listed-only matching control hidden, pending creation, draft-preserving failure, and successful first-owner confirmation.
- `docs/mockup/desktop/hub/find.html`
  - Listed suggestions from partial input, populated listed search, recoverable search failure and retry, and an ineligible listed Join.
  - Known-unlisted empty and partial states, a complete unique eligible result, pending hidden Join, and a complete ineligible result without identity disclosure.
- `docs/mockup/desktop/hub/index.html`
  - Populated and empty joined lists, unavailable identified session, recoverable load failure and retry, stale membership removal with count update, and temporarily unresolved Resume with the list preserved.

All interactions remained local to the static mockups. No live API, authentication service, backend, or third-party system was contacted.

## Routes Reviewed

- `POST /api/v0/hub/create-conversation`
- `GET /api/v0/hub/retrieve-listed-tag-suggestions`
- `GET /api/v0/hub/search-listed-conversations`
- `POST /api/v0/hub/join-listed-conversation`
- `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`
- `POST /api/v0/hub/join-unlisted-conversation`
- `GET /api/v0/hub/retrieve-joined-conversations`
- `GET /api/v0/hub/resolve-joined-conversation-access`

All eight route identities, descriptions, approved source-action mappings, mockup-file mappings, route shapes, and request-context sections remain intact. Every action is invokable from its documented page states.

## Route Authoring Rules And Payload Review

- Requests contain only visible tags or access choices, selected public conversation UIDs, or the public-safe continuation UID returned by the prior visible step.
- The browser session and CSRF values remain transport context, never JSON fields; actor identity, eligibility, ownership, membership, authorization, matching, and persistence decisions remain behind the UX API boundary.
- Conversation creation requires no pre-existing conversation UID or version and returns the public UID, first-owner role, and safe workspace continuation needed by the page.
- Listed search returns display-ready tags, activity and participant cues, server-decided matching mode, allowed Join affordance, and public conversation UIDs for subsequent selection.
- Known-unlisted evaluation discloses only a privacy-safe match state and count. Only a complete unique eligible result returns the public-safe `continuationUid`; no hidden conversation UID, hidden identity, private tag set, or membership detail is exposed.
- Unlisted Join carries the prior `continuationUid` plus the unchanged visible tag set and returns a public conversation UID only after membership succeeds.
- Joined-list retrieval returns only the active participant projection needed to render the member pill and cards: visible tags, kind, role, activity cues, public Resume UIDs, and allowed actions.
- Joined-access resolution carries the selected public conversation UID and returns either a safe workspace path, a stale-item removal instruction, or a retry affordance.
- Response branches cover created, empty, pending-related continuation, ineligible, retryable failure, expired continuation, unavailable session, stale membership, and unresolved access without exposing internal or security data.
- Raw credentials, cookie values, session identifiers, JWTs, provider secrets, hashes, database identifiers, audit rows, private workflow state, permission internals, and lower-layer contracts are absent from JSON.

## Payload Corrections

No payload edits were needed. The Phase 5 payload pairs were already minimal, parseable, UI-ready, correctly sourced, and sufficient for every rendered state and next visible action. Retaining them avoided introducing redundant fields or settling unresolved product rules.

All public UID examples remain 32-character hyphenless v4 UUID strings. Selectable state, role, kind, visibility, matching-mode, and allowed-action values remain all-caps enum strings; user-entered tags remain product tag strings rather than enums.

## Request Context Sources Checked

- `tawk_session={opaqueSessionRef}` is a browser-managed same-origin cookie; the UX API derives the identified actor and current authorization server-side.
- `X-CSRF-Token: {opaqueCsrfRef}` is a public-safe browser session value used only in headers for POST operations.
- Create values come from the stable visible form snapshot.
- Suggestion and listed-search query values come from the partial input and visible selected chips.
- Listed `conversationUid` comes from the selected visible search result.
- Unlisted `continuationUid` comes from the immediately preceding complete eligible evaluation response; the tag set remains visible on the page.
- Joined-list identity comes from the browser session, not a request field.
- Resume `conversationUid` comes from the selected card in the preceding joined-list response.

## Structural Verification

- Route headings: 8
- Unique HTTP operations: 8
- `### Source Actions`: 8
- `### Mockup Files`: 8
- `### Route`: 8
- `### Request Context`: 8
- `### Example Request Payload`: 8
- `### Example Response Payload`: 8
- Parseable JSON blocks: 12
- Invalid example UID values: 0

## Unresolved Ambiguities

- Human authentication provider selection remains unresolved; the route file documents only the concrete same-origin browser transport required by these examples.
- Extra-tag semantics for listed search and exact-versus-superset semantics for unlisted matching remain unresolved.
- Behavior for multiple complete hidden matches remains unresolved; Join stays unavailable unless evaluation yields one complete unique eligible continuation.
- Membership-period behavior for a former voluntary member who rejoins remains unresolved.
- Exact HTTP status-code mapping remains outside this UI-facing example-payload review.

## Scope Confirmation

This unique Phase 6 agent was assigned only the `desktop/hub` work unit. It replaced only this handoff document:

- `ai-docs/draft-routes/hub/06-route-payload-reviewer.md`

`docs/mockup/routes/hub-routes.md` was reviewed and intentionally left unchanged because its eight payload pairs already passed the Phase 6 review. No HTML, CSS, JavaScript, concept document, companion, schema, mock data, application source, package file, OpenAPI file, backend code, application API contract, secure API contract, database design, authorization algorithm, validation algorithm, frontend business logic, neighboring route artifact, or `projects/**` path was changed.
