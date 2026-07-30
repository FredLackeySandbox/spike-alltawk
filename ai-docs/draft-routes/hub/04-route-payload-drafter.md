# Phase 4 Route Payload Drafter Handoff

## Target

- `solutionArtifactRoot`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`
- Scenario: `root-artifact-monorepo`
- Platform and work unit: `desktop/hub`
- Route namespace: `hub`
- Route file: `docs/mockup/routes/hub-routes.md`

All markdown path references in this handoff are repository-relative to `solutionArtifactRoot`. All filesystem reads and writes used absolute paths under `solutionArtifactRoot`.

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

## Playwright Runner Contract

- `id`: `local-node-modules-cli`
- `label`: `./node_modules/.bin/playwright`
- `usage`: `./node_modules/.bin/playwright`
- `command`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/.bin/playwright`
- `baseArgs`: `[]`
- `version`: `1.62.0`
- `testRunnerModule`: `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/node_modules/playwright/test.js`
- Specification format: CommonJS, importing `test` and `expect` from the exact absolute `testRunnerModule`
- Viewport: `1080 × 900` for the discovered `1080` width
- Final result: four Playwright tests passed using the exact selected command/module pair

The private inspection directory was `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/.solpoc-tmp/draft-routes/hub/04-route-payload-drafter/`. The specification, screenshots, and Playwright test output were written only there. The directory was removed after the last rendered check and before this handoff was written.

## Pages And States Rendered

- `docs/mockup/desktop/hub/create.html`
  - Default listed form with existing tags.
  - Invalid-tag validation.
  - Pending creation followed by recoverable failure.
  - Unlisted selection with the listed-only matching option hidden, followed by timeout recovery.
  - Listed exclusive selection followed by the success confirmation before workspace navigation.
- `docs/mockup/desktop/hub/find.html`
  - Default listed suggestions and populated listed results.
  - Filtered suggestion retrieval from partial visible input.
  - Listed search failure and successful retry while preserving selected tags.
  - Listed join denied for an ineligible result.
  - Listed join pending for an eligible selected result.
  - Known-unlisted empty, partial, complete unique eligible, complete banned, join-pending, and flaky join-failure states.
- `docs/mockup/desktop/hub/index.html`
  - Populated active joined list.
  - Empty joined list.
  - Retryable load failure followed by success.
  - Unavailable identified-session state with private hub content suppressed.
  - Stale removed membership resolved at Resume, including card removal and count update.
  - Temporarily unresolvable Resume selection with the list preserved.
  - Active Resume choice ready with its selected public identifier.

Successful listed, unlisted, and Resume transitions were not followed into the out-of-scope conversation page; their browser-visible pending or ready states and their assigned source behavior were inspected.

## Routes Updated

Exactly one `### Example Request Payload` and one `### Example Response Payload` were added to each of the eight existing routes:

- `POST /api/v0/hub/create-conversation`
- `GET /api/v0/hub/retrieve-listed-tag-suggestions`
- `GET /api/v0/hub/search-listed-conversations`
- `POST /api/v0/hub/join-listed-conversation`
- `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`
- `POST /api/v0/hub/join-unlisted-conversation`
- `GET /api/v0/hub/retrieve-joined-conversations`
- `GET /api/v0/hub/resolve-joined-conversation-access`

The eight existing route headings, route identities, purpose descriptions, approved `### Source Actions`, and `### Mockup Files` mappings were preserved. All eight approved companion actions remain covered.

## Payload And Context Decisions

- Added one `### Request Context` subsection to every route because all hub operations require established identified-session context, while the human-auth transport remains unresolved.
- Did not invent a cookie name, bearer format, authentication provider, or session identifier. The context notes state that the browser sends the eventual established authentication context and that the UX API derives the identified actor.
- Kept GET request examples body-free using the exact sentence `No JSON request body is sent for this route.` and documented the visible query-value sources separately.
- Limited create input to ordered tags, visibility, and matching mode; the identified creator is not accepted in JSON.
- Returned server-issued public conversation UIDs and browser-safe workspace paths only where a visible next action needs them.
- Carried the listed conversation UID from the listed-search response into the listed-join request.
- Returned a public-safe `continuationUid` from complete eligible known-unlisted evaluation and carried it, together with the still-visible complete tag set, into unlisted join.
- Kept the known-unlisted evaluation response non-identifying: it contains a privacy-safe match state, count, continuation UID, and allowed action, but no hidden conversation UID or private tag disclosure.
- Returned joined conversations as display-ready items with public selection UIDs, visible tags, role, activity cues, and allowed Resume action.
- Documented concrete alternate response semantics for validation, empty, retryable failure, timeout, ineligible, expired continuation, unavailable-session, stale-membership, and temporarily unresolvable states while keeping one parseable representative JSON example per route.
- Used 32-character hyphenless v4 UUID examples for every `*Uid` value and all-caps strings for selectable states, roles, matching modes, and allowed actions.
- Omitted raw credentials, cookie values, session IDs, database IDs, audit data, private workflow state, lower-layer contracts, authorization algorithms, and frontend business-rule inputs.

## Route Authoring Rules Applied

- Preserved every approved source-action mapping and all eight route identities.
- Covered create versus join semantics without requiring a pre-existing UID for creation.
- Traced every request value to a visible field, selected result, prior UX API response, or established browser authentication context.
- Supplied editable or display-ready UI data only to the extent needed by the referenced hub states and their next visible actions.
- Kept opaque browser-returned workflow data public-safe and omitted hidden conversation identity before membership is established.
- Used backend-decided states and allowed-action affordances instead of asking the frontend to reproduce eligibility or discovery rules.
- Kept the `hub` namespace and lowercase-kebab operation identities unchanged.

## Structural Verification

- Route sections: 8
- `### Source Actions` subsections: 8
- `### Mockup Files` subsections: 8
- `### Request Context` subsections: 8
- `### Example Request Payload` subsections: 8
- `### Example Response Payload` subsections: 8
- JSON blocks parsed successfully: 12
- Invalid UUID example values: 0

## Unresolved Ambiguities

- The human authentication mechanism and concrete cookie/header transport remain unresolved, so Phase 4 documents the required browser-managed identified-session context without choosing a transport name.
- Extra-tag semantics for listed search and exact-versus-superset semantics for unlisted matching remain unresolved; payloads carry the visible tag sets without settling those backend rules.
- Multiple complete hidden-match behavior remains unresolved; the example covers the established complete unique eligible branch.
- Rejoin-period semantics for former voluntary members remain unresolved; join responses expose only the resulting active member role needed by the UI.
- HTTP status mapping, exact browser-auth transport, and final route-shape placement for the documented alternate response branches remain for route tightening.

## Scope Confirmation

This unique Phase 4 agent was assigned only the `desktop/hub` work unit. It changed only:

- `docs/mockup/routes/hub-routes.md`
- `ai-docs/draft-routes/hub/04-route-payload-drafter.md`

No HTML, CSS, JavaScript, concept document, page companion, schema, mock data, OpenAPI file, backend code, frontend logic, application API contract, secure API contract, package file, neighboring route artifact, or other area route file was changed. No file under `projects/**` was read or written.
