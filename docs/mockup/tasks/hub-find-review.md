# Product Owner UX Review: Find a Conversation

## Assignment

- **Assigned page:** `docs/mockup/desktop/hub/find.html`
- **Page slug:** `hub-find`
- **Target user:** An identified person who wants to discover a listed conversation or enter a known unlisted conversation. The same product rules also apply to bots, but this desktop page is the human-operated experience.

## Sources Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/assets/app.js` as a local asset directly referenced by the assigned page

## Page Purpose and Journey

The page's primary job is to let an identified person build a tag query, see identifiable listed matches, or privately test a complete tag combination for a known unlisted conversation. The likely entry is **Your Conversations** through its Find action or the shared private navigation. A successful join should activate local mock membership and continue to `docs/mockup/desktop/conversation/thread.html`. The user may instead return to the conversation hub or move to conversation creation.

The listed and known-unlisted tasks belong on this one focused surface, but they must have visibly different disclosure rules. Listed search may show a matching conversation's tags and restrained activity context. Known-unlisted search must never suggest private-only tags or reveal the hidden conversation's identity, tags, membership, or other details before or after an ineligible join attempt.

## Playwright Rendered Inspection

The page was opened and exercised at a 1440 × 1000 desktop viewport using the required route:

- **Kind:** `system-node-package`
- **Node executable:** `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`
- **Package directory:** `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`
- **Browser type:** `chromium`
- **Launch options:** `{"channel":"chrome","headless":true}`
- **Validation:** The browser launched and rendered the local HTML.

### Rendered observations

- The initial listed state contains a preselected `product-design` chip and immediately shows two identifiable inclusive matches. Result cards expose tag combinations, participant counts, recent-activity cues, matching mode, and a Join link.
- Clicking an eligible suggestion adds a chip and refreshes results. Removing all chips produces an “add a tag” state; entering a valid tag with no fixture match produces a no-results state.
- The suggestion set stays static while text is typed. For example, typing `zzzz` leaves all five suggestions visible and leaves the previous committed query's results in place. The required type-ahead relationship between typed text and suggestions is therefore not yet demonstrated.
- Invalid text, duplicates, and an eleventh tag produce inline errors while preserving the committed query. Key/value input such as `Key:Value` is accepted and compared in normalized form. The rendered help does not make the supported key/value form as clear as the validation behavior does.
- The mode switch updates its explanatory copy and placeholder, hides listed suggestions and listed results in known-unlisted mode, and preserves committed chips across modes.
- Known-unlisted mode renders privacy-safe states for no tags, zero hidden matches, two possible hidden matches, one complete hidden match, and an ineligible/banned complete match. It does not expose a hidden name, hidden tag, participant count, or activity detail.
- `release-triage` plus `incident-ops` enables a Join link for one complete hidden match. `incident-ops` plus `night-shift-support` shows the ineligible state and an aria-disabled Join link.
- Join actions are direct links to the conversation page. The rendered experience does not demonstrate a local eligibility check in progress, a membership state change, a recoverable failure, timeout, retry, or protection against a stale join after the query changes.
- Back to conversations and Create instead are visible as quiet secondary exits. No modal or confirmation is currently used, which is appropriate for normal discovery and joining.

### Code observations

- All demonstrated discovery data is local: a small in-page listed catalog and condition-based hidden-match fixtures. No real API, backend, authentication provider, or third-party call is present.
- Tags are committed on Enter, comma, or blur; normalized for matching; rendered as removable chips; checked for valid separators, duplicates, and a maximum of ten.
- Listed fixtures apply inclusive matching when any selected tag overlaps and exclusive matching when every conversation tag is present.
- Hidden fixtures check for known tag combinations and render success or banned states locally. Because additional-tag semantics are unresolved in the requirements, this mockup must not present its current subset check as a settled product rule.
- The shared script only supplies general modal, dropdown, and toast behavior; this page does not use those behaviors for discovery or joining.

## Recommended User Experience

### PO-001: Build and validate the tag query

- **Scenario:** The person enters, selects, reviews, and removes tags that drive the current discovery mode.
- **Trigger:** The person types in the tag field, commits a value with Enter or comma, selects an eligible listed suggestion, or removes a selected chip.
- **Preconditions:** The identified session is represented locally; the page has a local fixture of tags eligible for listed discovery; zero to ten chips may already be selected.
- **Expected behavior:** Typed text filters eligible suggestions by case-insensitive prefix or meaningful partial match without committing the query. Committing a valid simple or `key:value` tag creates one removable chip, updates the selected count, clears the input and prior error, keeps focus available for another tag, and refreshes only the active mode's result region. Comparison is case-insensitive while presentation remains consistent without claiming a final canonical casing rule. Suggestions already selected are unavailable for duplicate selection. In known-unlisted mode, no suggestions are shown at all.
- **State/data effect:** Only local selected-tag and input state changes. The eligible suggestion fixture contains no tag used exclusively by unlisted conversations. Removing a chip removes it from the local query and immediately recomputes the active state; removing the last chip returns to the mode's instruction state.
- **Alternate paths:** Empty input does nothing. Whitespace, Unicode, leading or trailing hyphens, repeated separators, or malformed key/value input leaves the committed query unchanged and shows an inline error. Duplicate input leaves one chip and explains the duplicate. An eleventh unique tag is not added and the existing ten remain unchanged. The help and error guidance must consistently acknowledge both simple tags and the supported single key/value form.
- **QA acceptance check:** In listed mode, type a partial value and verify the visible eligible suggestions narrow while the committed result set does not change; select one and verify a chip, count, cleared error, and refreshed results. Add the same value with different case and verify no duplicate. Enter malformed values and an eleventh unique value and verify the existing chips remain intact. Switch to known-unlisted mode and verify the suggestion surface is absent even while typing a private-only fixture tag.

### PO-002: Switch discovery modes without crossing the privacy boundary

- **Scenario:** The person moves between public listed discovery and entry of a known unlisted combination while understanding the different disclosure rules.
- **Trigger:** The person selects Listed or Known unlisted in the mode control.
- **Preconditions:** Either mode may be active and the person may have committed chips; a result state may already be visible.
- **Expected behavior:** The selected mode is visibly and programmatically identified. Listed mode shows eligible public suggestions and identifiable listed results. Known-unlisted mode hides all suggestions and identifiable results, explains that tags must already be known, and shows only privacy-safe hidden-match status. Committed chips may remain so the person can test the same known values, but inactive-mode content must be removed from view and assistive-technology exposure immediately.
- **State/data effect:** The local mode changes and the result region is recomputed from the existing chips. No hidden fixture data is copied into the listed suggestion fixture or exposed when switching back. Changing mode does not create membership or start a join.
- **Alternate paths:** With no chips, each mode shows its own concise starting instruction. A manually entered tag that is not eligible for listed suggestion may remain a chip when returning to listed mode, but it must not appear as a suggested tag or disclose whether it belongs to an unlisted conversation. Rapid mode changes must leave only the final mode's state announced and visible.
- **QA acceptance check:** Start with a listed result, switch to known-unlisted, and verify listed identities and suggestions disappear while the chips remain. Switch back and verify only listed-fixture results reappear. Repeat with a private-only fixture tag entered manually and verify it never appears in suggestions or causes hidden information to appear in listed mode.

### PO-003: Show current listed matches and resilient search states

- **Scenario:** The person uses committed tags to identify listed conversations under inclusive or exclusive matching rules.
- **Trigger:** A valid chip is added or removed while Listed mode is active, or the person retries a locally simulated failed search.
- **Preconditions:** The local listed fixture distinguishes conversation tags, inclusive or exclusive matching mode, displayable activity context, and eligibility state; at least one tag is selected for a match attempt.
- **Expected behavior:** The result region first signals that the current query is being evaluated, then replaces that state with only the latest query's compact results. Inclusive conversations appear when at least one assigned tag matches; exclusive conversations appear only when all assigned tags are supplied. Each result remains identifiable by its visible tag combination, with restrained participation/activity context, its matching rule, and one clear join action. No query shows unlisted conversation identity or private-only tag data.
- **State/data effect:** Search reads local fixture data only and does not change membership. Result state is derived from the active chips and mode; older pending evaluations are discarded when the query changes.
- **Alternate paths:** Zero chips produces an instructional state with no results or Join actions. A valid query with no listed match produces a no-results state and keeps Create instead available. A local failure or timeout produces a non-destructive error with Retry; retry evaluates the same latest query. If chips change during loading or retry, only the newest query may populate the result region. No behavior should be asserted for additional tags beyond a conversation's assigned tags until that unresolved product rule is decided.
- **QA acceptance check:** Use local fixtures to prove one inclusive match on a single overlapping tag and one exclusive match only after all of its tags are present. Remove a required exclusive tag and verify that result disappears. Exercise the loading, no-results, failure, and retry fixtures, then change a chip during loading and verify no stale result is rendered. Confirm every visible identity comes from a listed fixture.

### PO-004: Join an eligible listed conversation locally

- **Scenario:** The person selects a listed match and either becomes an active member or receives a concise eligibility/failure outcome.
- **Trigger:** The person activates Join on a listed result.
- **Preconditions:** The result still matches the current chips; a local fixture provides the current identity's eligible or banned state for that listed conversation; no join for that card is already running.
- **Expected behavior:** The selected card's Join action enters a clear in-progress, disabled state while other accidental submissions are prevented. On local success, the mock membership becomes active and the conversation workspace opens. A banned identity stays on the search page with a concise not-eligible state; the listed conversation may remain identifiable because it is public, but no private membership or moderation details are shown. No invitation, approval queue, real authentication, or real service call is introduced.
- **State/data effect:** Success changes only local mock membership for the selected conversation before navigation. Banned, failed, timed-out, canceled, or stale attempts do not change membership. The join must use the result selected, not a result invalidated by later chip changes.
- **Alternate paths:** A recoverable local failure or timeout restores Join and offers Retry without losing the query. If the chips or mode change while a join is pending, cancel the pending attempt and do not navigate. If local eligibility is denied, keep Join unavailable for that result and retain the current search so the person can continue elsewhere. No confirmation modal is needed for an ordinary eligible join.
- **QA acceptance check:** Join an eligible fixture and verify one in-progress state, one local active-membership change, and navigation to the conversation workspace. Repeat with the banned fixture and verify no membership change or navigation. Exercise a failure/Retry fixture and a query change during loading, verifying that only the valid final attempt can navigate.

### PO-005: Progressively identify a known unlisted match without disclosure

- **Scenario:** The person supplies a tag combination they already know and learns only whether it has narrowed hidden results enough to permit a join attempt.
- **Trigger:** A chip is added or removed while Known unlisted mode is active, or a locally simulated evaluation is retried.
- **Preconditions:** The unlisted fixture contains hidden tag combinations and eligibility data inaccessible to rendered suggestion and result content; the person starts with zero or more manually entered chips.
- **Expected behavior:** The page evaluates the committed tags locally and moves through a privacy-safe instruction, zero-match, possible-match count, and one-complete-unique-match state. Until one complete unique match exists, no Join action is enabled. Even at the complete state, the page identifies only that one hidden match is ready to join; it does not reveal its tags, name, members, activity, roles, or moderation status. Private-only autocomplete is never offered.
- **State/data effect:** Only a privacy-safe derived count/status is rendered from the hidden local fixture. The hidden record remains inaccessible to visible result markup, suggestion data, labels, and error details. Removing any required chip immediately revokes the join-ready state.
- **Alternate paths:** Zero tags shows instruction rather than a hidden count. Zero or multiple possible matches disclose only the count and keep Join disabled. Loading, local failure, timeout, and Retry states must not retain or reveal a prior count from a stale query. Additional-tag behavior is an unresolved product decision and must not be described as authoritative or added to QA acceptance until resolved.
- **QA acceptance check:** With no chips, verify no hidden identity or count is exposed. Add one known partial tag and verify only the fixture count appears with Join disabled. Add the remaining known tag and verify one complete hidden match with Join enabled but no hidden details. Remove a required tag and verify Join disables immediately. Exercise failure and stale-query fixtures and inspect the rendered text to confirm they disclose no hidden identity or private tag.

### PO-006: Complete or deny a hidden join safely

- **Scenario:** The person attempts to join the one complete hidden match and receives a success, permission denial, or recoverable local failure without privacy leakage.
- **Trigger:** The person activates Join hidden conversation after the current chips produce one complete unique match.
- **Preconditions:** The unique match remains current; the local fixture represents either eligible membership or a banned identity; no hidden join is already running.
- **Expected behavior:** Join becomes disabled and shows progress while the current chips are locked against a stale submission. On local success, membership becomes active and the conversation workspace opens; hidden details are revealed only in that post-join workspace. On a banned or otherwise permission-denied fixture, the page remains in place, Join is unavailable, and a concise ineligible message appears without the hidden conversation's identity, tags, membership, or ban rationale.
- **State/data effect:** Eligible success updates local mock membership for the hidden conversation immediately before navigation. Permission denial, cancellation, timeout, and failure leave membership unchanged. Editing or removing a chip before completion cancels the attempt and recomputes the privacy-safe match state.
- **Alternate paths:** A local failure or timeout shows a privacy-neutral message and Retry without exposing whether the hidden conversation still exists. A canceled or stale attempt returns to the state for the latest chips. A banned identity cannot reactivate Join by repeating the same complete combination. No real backend, authentication, invitation, or approval workflow is contacted or implied.
- **QA acceptance check:** With the eligible complete fixture, activate Join and verify progress, one local membership change, and navigation. With the banned complete fixture, verify Join is unavailable, no membership change occurs, and rendered content contains no hidden identity or tag. Simulate failure, timeout, Retry, and chip removal during progress and verify no stale navigation or privacy leak occurs.

### PO-007: Leave discovery through clear secondary paths

- **Scenario:** The person decides to stop searching and either return to joined conversations or create a new conversation.
- **Trigger:** The person activates Back to conversations, Conversations in private navigation, or Create instead/Create in private navigation.
- **Preconditions:** Any discovery mode, chip query, validation message, or result state may be present; no successful join has completed.
- **Expected behavior:** Back and Conversations return to the conversation hub. Create instead and Create open the existing conversation-creation page. These exits remain secondary to joining and require no confirmation because search state is local and non-persistent. The page must not imply that an entered search combination will automatically become creation data because that transfer is not specified.
- **State/data effect:** Leaving discards the page-local query and does not create membership or a conversation.
- **Alternate paths:** If a local search or join evaluation is pending, navigation cancels that pending local action and prevents a later state change. Validation or no-result states do not disable either exit.
- **QA acceptance check:** From a no-result state and from a pending local failure fixture, use each exit and verify it reaches its declared page, creates no membership, and produces no delayed discovery or join update.

## Dynamic Data, Local Fixtures, and State Expectations

Use the smallest local fixture set that proves the approved interactions: eligible listed tags; listed conversations with tags, matching mode, restrained activity context, and eligible/banned status; hidden combinations whose identifying data never enters visible search output; and the current identity's mock membership state. In-page state needs only the active mode, input value, committed chips, latest evaluation token, result status, selected join target, and join outcome. Loading, failure, timeout, retry, cancellation, no-result, complete-match, and permission-denied outcomes must be locally reproducible without network calls.

## External Services and API Avoidance

No real API, live backend endpoint, authentication provider, authorization service, analytics service, or third-party service is required or allowed for this page. The current page makes no such calls. Search evaluation, eligibility checks, membership activation, delays, failures, and retries must remain fixture-backed or in-page mocked behavior. The displayed profile may stand in for the already identified POC session; this page must not invent a sign-in flow.

## Validation Expectations

Tag validation must cover empty input, allowed Latin letters and digits, hyphens only as internal separators, the supported single `key:value` form, case-insensitive duplicate detection, and the local query limit. Validation failures must be inline, associated with the tag field, announced, and non-destructive to committed chips. Search and join errors belong in the relevant live result region and must never leak hidden data.

## Modals, Confirmations, and Linked Controls

No modal or confirmation is needed for ordinary listed or hidden joining, changing modes, removing a search chip, leaving the search, or moving to creation. The mode control, chips, suggestions, result status, and Join availability must stay synchronized. A modal should not be added merely to stage loading or eligibility checks.

## Button and Link Purposes

- **Listed / Known unlisted:** Select the disclosure and matching mode; they are not separate pages.
- **Eligible suggestion:** Commit one public-discovery-eligible tag.
- **Chip remove:** Remove that tag and recompute only the active mode.
- **Join:** Attempt local membership activation for that specific listed result.
- **Join hidden conversation:** Available only for a current complete unique hidden match and never exposes its identity on this page.
- **Back to conversations / Conversations:** Return to joined conversations without mutating membership.
- **Create instead / Create:** Move to the existing creation flow without inventing query transfer.

## Intentionally Out of Scope

- Browse-all directories, trending tags, advanced boolean controls, saved searches, search history, or ranking/personalization.
- Private tag autocomplete, hidden names or details, invitation/approval queues, and brute-force/privacy threat-model work beyond the documented POC.
- A product rule for additional search tags beyond a conversation's assigned tags; the requirements explicitly leave this unresolved.
- New pages, a redesigned hub, conversation previews, expanded profile or authentication flows, or implementation/CSS prescriptions.
- Real service calls, production authorization, analytics, notifications, and persistence beyond the local functional mockup.

## Scope Statement

No mockup files were changed. This review created only `docs/mockup/tasks/hub-find-review.md`.
