# Architect Approval: Find a Conversation

## Assignment

- **Assigned page:** `docs/mockup/desktop/hub/find.html`
- **Page slug:** `hub-find`
- **Product Owner review:** `docs/mockup/tasks/hub-find-review.md`

## Sources Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/schemas/DICTIONARY.md`
- `docs/schemas/tag.yaml`
- `docs/schemas/conversation.yaml`
- `docs/schemas/conversation-tag.yaml`
- `docs/schemas/identity.yaml`
- `docs/schemas/membership.yaml`
- `docs/schemas/membership-event.yaml`
- `docs/schemas/membership-role-period.yaml`
- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/tasks/hub-find-review.md`

## Rendered Inspection Evidence Confirmed

The validated Product Owner review records a successful 1440 × 1000 Playwright-rendered inspection using the `system-node-package` route, Chromium with the Chrome channel, and headless launch. Its rendered observations cover tag entry and validation, suggestions, listed and known-unlisted states, mode changes, join availability, privacy behavior, and secondary navigation. The decisions below therefore use both rendered evidence and the current page behavior rather than code inspection alone.

## Decisions

### PO-001: Build and validate the tag query

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Typing in Listed mode must narrow only eligible listed-tag suggestions without committing or changing results; selecting a suggestion or committing a valid tag must add one removable chip, update the count and active-mode results, clear the input/error, and preserve usable focus. Comparison is case-insensitive, but the mockup must not settle display casing or a broader fuzzy-ranking rule: a predictable case-insensitive prefix or substring fixture is sufficient. Known-unlisted mode must expose no suggestions. Empty, malformed, duplicate, and over-limit entries must leave the committed query unchanged and show field-associated feedback; whitespace is invalid rather than silently accepted as part of a tag.
- **State/data effect:** Update only local input, selected-tag, validation, and derived-result state. Normalize comparisons consistently with `Tag.normalizedValue`; keep the selected set unique and at no more than ten values. The local suggestion fixture may contain only tags associated with active listed conversations, never private-only tags.
- **QA acceptance check:** Type a partial listed tag and verify suggestions narrow while results remain based on committed chips; select it and verify one new chip, updated count/results, cleared error, and no duplicate suggestion. Verify case-varied duplicates, malformed simple or `key:value` tags, whitespace, and an eleventh unique tag do not alter existing chips. Switch to Known unlisted and verify no suggestion surface is exposed for any typed value.
- **Constraints:** Support the schema's lowercase comparison shape and single optional colon, but do not claim final display-casing policy or resolve the open exact tag-grammar question beyond the current validated fixture. Do not add private autocomplete, ranking, history, or network-backed lookup.

### PO-002: Switch discovery modes without crossing the privacy boundary

- ***Decision:*** Approved
- **Approved behavior or rationale:** Activating Listed or Known unlisted must visibly and programmatically select that mode, immediately remove inactive-mode content from visual and assistive-technology exposure, and recompute the result region from the existing chips. Listed mode may show only eligible public suggestions and identifiable listed fixtures; Known unlisted must show only privacy-safe instructions or hidden-match status. Preserving manually supplied chips is acceptable because the page must not reinterpret them as discoverable suggestions or disclose their origin.
- **State/data effect:** Change only the local mode and its derived result state. Do not create membership, start a join, copy hidden fixture values into listed suggestion data, or expose hidden records during either transition.
- **QA acceptance check:** From an identifiable listed result, switch to Known unlisted and verify listed identities and suggestions are absent while chips remain; switch back and verify only listed-fixture matches appear. Repeat with a manually entered private-only fixture value and verify it never becomes a suggestion or reveals hidden information in Listed mode. Rapid switching must leave only the final mode visible and announced.
- **Constraints:** Preserve the single-page mode-switch structure required by the page contract. Do not add separate pages, authentication behavior, or any hidden identity, tag, membership, or moderation detail.

### PO-003: Show current listed matches and resilient search states

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Adding or removing a chip in Listed mode must show a local evaluation state and then only results for the latest committed query. Inclusive fixtures may match one overlapping assigned tag; exclusive fixtures must require all assigned conversation tags. Each public result may show its tag combination, restrained derived participation/activity context, matching mode, and one Join action. Instructional, no-result, locally simulated failure, timeout, and Retry states are approved, but the mockup must not choose how unrelated extra query tags affect either matching mode.
- **State/data effect:** Read only active listed-conversation fixtures, their active tag assignments, matching mode, derived display context, and eligibility state. Search changes no membership. A newer local query cancels or supersedes any older pending evaluation so stale results cannot render.
- **QA acceptance check:** Demonstrate one inclusive result from one overlapping tag and one exclusive result only after all of that conversation's tags are committed; remove one required exclusive tag and verify the result disappears. Exercise instruction, no-result, loading, failure, timeout, and Retry states, then change a chip during loading and verify only the latest query renders. Confirm every identified result comes from a listed fixture.
- **Constraints:** Conversation identity is its visible tag combination; do not require a title or description. Participant/activity cues must remain restrained local derived values, not new durable fields. Do not settle extra-tag semantics, add advanced boolean controls, or call a search API.

### PO-004: Join an eligible listed conversation locally

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Activating Join on a still-current eligible listed result must put that card's action into a disabled progress state and prevent duplicate submission. Local success may mark the current identity as an active member with member role and navigate to the conversation workspace. A banned fixture must remain on search with a concise denial and no membership change; local failure or timeout must restore a Retry path without losing the query. Changing mode or chips while joining must cancel the stale attempt. This approval covers a new eligible membership and a retained banned membership only; it does not settle the open behavior for rejoining after leaving or removal.
- **State/data effect:** On the eligible fixture only, locally simulate a Membership with `currentStatus: active` and `currentRole: member` immediately before navigation, together with the corresponding joined transition needed by the data model. Banned, failed, timed-out, canceled, and stale attempts leave membership unchanged; a banned Membership remains `currentStatus: banned` with role `none`.
- **QA acceptance check:** Join the eligible listed fixture and verify one progress state, one local active-member transition, and navigation. Exercise the banned fixture and verify no transition or navigation, then exercise failure/Retry and change the query during progress to verify a stale attempt cannot navigate or mutate membership.
- **Constraints:** Use only local fixtures and simulated timing/outcomes. Do not add approval queues, invitations, real authentication, real authorization, backend persistence, moderation detail, or a confirmation modal. Do not infer rejoin rules for `left` or `removed` memberships.

### PO-005: Progressively identify a known unlisted match without disclosure

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** In Known unlisted mode, adding or removing manually entered chips may move among a no-input instruction, a privacy-safe zero or possible-match count, and one complete unique-match state. Join must stay disabled until the current submitted combination supplies all required tags and narrows to one hidden conversation. Even then, the page may disclose only readiness to join, never the hidden record's tags, name, members, activity, roles, moderation data, or private-only suggestions. The fixture must demonstrate only combinations whose intended result is explicit and must not treat extra submitted tags as a resolved product rule.
- **State/data effect:** Render only a derived privacy-safe count/readiness status from local hidden fixtures. Removing a required chip immediately revokes readiness. Pending, failed, timed-out, or superseded evaluations must clear stale status and must never place hidden identifying values in rendered result or suggestion content.
- **QA acceptance check:** With no chips, verify no hidden count or identity; with one known partial value, verify only the fixture count and a disabled Join; with the complete fixture combination, verify one join-ready state with no hidden details; remove a required value and verify readiness disappears. Exercise local failure and a changed query during loading and inspect rendered output for hidden identities or private tags.
- **Constraints:** Unlisted conversations use `visibility: unlisted` and `matchingMode: allTags`, but exact-set versus required-set-plus-extra behavior remains unresolved. Do not encode either rule as authoritative, expose hidden fixtures to autocomplete or visible markup, or add brute-force protections beyond the POC scope.

### PO-006: Complete or deny a hidden join safely

- ***Decision:*** Approved with nuance
- **Approved behavior or rationale:** Activating Join for the current complete unique hidden match must disable the action and show privacy-neutral progress. Eligible local success may create active member state and navigate, after which the workspace may reveal the joined conversation. A banned fixture must keep Join unavailable and show only a concise denial with no hidden identity, tags, membership, or ban rationale. Local failure, timeout, Retry, cancellation, and chip changes must remain privacy-neutral and prevent stale navigation. As with listed joining, this approval does not decide rejoin behavior for a former non-banned membership.
- **State/data effect:** Eligible success locally simulates an active member Membership and joined transition immediately before navigation. Banned status remains `banned`/`none`; denial, failure, timeout, cancellation, and stale attempts leave all membership state unchanged. Editing the current combination cancels the target and recomputes only privacy-safe status.
- **QA acceptance check:** Use the eligible complete fixture to verify progress, one active-member transition, and navigation. Use the banned complete fixture to verify Join remains unavailable, membership is unchanged, and no hidden identifier or tag renders. Exercise failure, timeout, Retry, and chip removal during progress and verify there is no stale transition, navigation, or privacy leak.
- **Constraints:** Keep eligibility and membership outcomes local and fixture-backed. Do not contact a backend, identity provider, authorization service, invitation system, or third party; do not expose ban reasons or resolve former-member rejoin rules.

### PO-007: Leave discovery through clear secondary paths

- ***Decision:*** Approved
- **Approved behavior or rationale:** Activating Back to conversations or Conversations must return to the conversation hub; activating Create instead or Create must open the existing creation page. These exits stay secondary and need no confirmation because the query is page-local and non-persistent. Leaving during a local search or join evaluation must cancel it so no delayed update or membership change occurs, and the search combination must not be transferred into creation as an implied product behavior.
- **State/data effect:** Discard page-local mode, input, chip, evaluation, and selected-join state on navigation. Do not create or change a conversation or membership.
- **QA acceptance check:** From no-result, validation, and pending local evaluation states, activate each declared exit and verify the correct existing page opens, no membership or conversation is created, no query is prefilled in creation, and no delayed result or join outcome appears.
- **Constraints:** Reuse the existing navigation destinations and preserve their secondary hierarchy. Do not add confirmation dialogs, query persistence, cross-page transfer, new destinations, or analytics/service calls.

## Data and Schema Feasibility

The approved behavior fits the existing data model. `Tag` supports canonical case-insensitive values and one optional `key:value` separator; `Conversation Tag` supports deterministic active assignments within the one-to-ten boundary; and `Conversation` distinguishes listed inclusive/exclusive matching from unlisted `allTags`. `Membership` can represent eligible active participation and retained bans, while Membership Event and Role Period records support the corresponding joined/member or banned/none history. Conversation titles and descriptions remain optional and are not required for listed identification. The open extra-tag and former-member rejoin questions remain constraints, not decisions made by this mockup.

## Mock Data and Local State Feasibility

The minimum fixture set is: eligible listed tags; a small group of active listed conversations proving inclusive, exclusive, eligible, and banned outcomes; hidden combinations proving partial-count, unique-complete, eligible, and banned outcomes without exposing identifying values; the current identified person; and local membership outcomes. Page-local state needs only mode, input, committed chips, validation, latest evaluation token/status, current join target, and join outcome. Loading, failure, timeout, Retry, cancellation, no-result, and permission-denied states can all be simulated locally without new durable entities.

## External Service and Real API Avoidance

No real API, backend, production system, authentication provider, authorization service, analytics endpoint, or third-party service is approved for this page. Search, suggestion filtering, eligibility checks, membership transitions, delays, failures, retries, and navigation outcomes must remain local and deterministic. The existing identified profile is sufficient; no sign-in flow is introduced.

## YAGNI/YACNI Constraints

Do not add browse-all or trending discovery, advanced boolean search, ranking or personalization, saved/history searches, hidden names or private autocomplete, invitation or approval workflows, conversation previews, new pages, authentication/profile expansion, persistent search state, analytics, notifications, or a product decision for unresolved extra-tag or rejoin behavior. Do not add a modal where inline progress or status is sufficient.

## Scope Statement

No mockup files were changed. This approval created only `docs/mockup/tasks/hub-find-approval.md`.
