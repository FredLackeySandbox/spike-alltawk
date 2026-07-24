# Product Owner UX Review: Create a Conversation

- **Assigned page:** `docs/mockup/desktop/hub/create.html`
- **Page slug:** `hub-create`
- **Review role:** Product Owner

## Source documents reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/hub/create.html`
- Directly referenced local assets: `docs/mockup/desktop/assets/styles.css` and `docs/mockup/desktop/assets/app.js`

## Page purpose and user journey

- **Target user:** An already identified person using the private application. The product also allows a token-authenticated bot to create a conversation, but a bot-facing browser flow is intentionally out of scope.
- **Primary job:** Create a conversation by choosing one to ten tags, selecting listed or unlisted access, and optionally requiring every tag for listed matching.
- **Purpose:** Keep creation quick and limited to the product's settled decisions. The creator becomes the first owner; titles, descriptions, invitations, and advanced settings are not part of this flow.
- **Likely entry paths:** The user's conversation list at `hub/index.html`, the find flow at `hub/find.html`, or the shared private Create navigation.
- **Likely next actions:** Successful creation opens the existing conversation workspace as owner. Cancellation returns to the user's conversation list without creating anything.

## Playwright route used for rendered inspection

Rendered inspection was completed at a desktop viewport of 1440 by 900 using the required route:

```json
{"kind":"system-node-package","source":"application:/Applications","nodeExecutable":"/Users/flackey/.nvm/versions/node/v24.15.0/bin/node","packageName":"playwright","packageVersion":"1.57.0","packageDirectory":"/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright","browserType":"chromium","launchOptions":{"channel":"chrome","headless":true},"validation":"launched browser and rendered local HTML"}
```

The page was opened from its local `file://` URL with the supplied Node executable, `require(packageDirectory)`, `playwright[browserType]`, and the supplied launch options unchanged.

## Current behavior observed from Playwright and code inspection

### Rendered Playwright observations

- The page rendered as a focused single-column form under the private navigation. The identified profile is Rowan Ellis, Listed is initially selected, and the initial static example contains `community-design` and `atlanta` with a visible `2 / 10` count.
- Adding `Neighborhood:Arts` with Enter produced a third chip normalized to `neighborhood:arts`, cleared the input, and updated the count.
- Entering `bad tag` kept the value editable and showed inline format feedback. Entering `ATLANTA` showed duplicate feedback, confirming case-insensitive comparison.
- Ten chips were accepted. An eleventh tag was rejected with maximum-limit feedback. Removing a chip cleared that error and reduced the count, although the uncommitted eleventh value remained in the input and focus moved away from it.
- Removing the final chip showed the minimum-tag error. Submitting with no chips kept the user on the page and returned focus to the tag input.
- Selecting Unlisted hid the listed-only matching control and cleared its checked state. Returning to Listed showed the control unchecked.
- On successful submit, the Create control became disabled and changed to a creating state, a success status appeared, and the browser navigated after roughly 900 milliseconds to `docs/mockup/desktop/conversation/thread.html`.
- During the pending interval only the submit button was disabled; tags, access choices, and navigation remained operable, which permits the visible draft to diverge from the state being presented as created.
- The request log contained live requests to `fonts.googleapis.com` and `fonts.gstatic.com` caused by the shared stylesheet. The page otherwise loaded its document, stylesheet, script, and destination from local files.
- At 1440 by 900, the 720-pixel-wide form remained readable and visually restrained. The document extended modestly below the viewport, so normal vertical scrolling was sufficient and no horizontal overflow was observed.

### Code inspection observations

- The page uses local in-page state for its tag array, access choice, exclusive-matching choice, validation feedback, pending state, success status, and timed redirect. No application API, authentication endpoint, or backend service call is made by the page script.
- Tag input is committed on Enter, comma, or blur. Values are trimmed and lowercased before a local pattern check. Empty values are ignored; invalid, duplicate, minimum, and maximum conditions are handled inline.
- Submission automatically tries to commit any text still in the input before checking the draft. This is useful, but the visible input and inline feedback need to make the committed outcome unambiguous.
- The success path does not create a durable local conversation fixture or demonstrate a failure, timeout, or retry outcome. It always redirects after the fixed delay.
- The shared script provides generic modal, dropdown, and toast behavior, but this page does not currently use a modal or toast.

## Recommended user experience and interactions

### PO-001: Build and validate the tag set

- **Scenario:** An identified creator builds the one-to-ten-tag identity for the new conversation and corrects mistakes without losing valid tags.
- **Trigger:** The user types a tag and presses Enter or comma, leaves the field, removes a chip, or submits while text remains in the input.
- **Preconditions:** The page has a local draft containing zero to ten tags; the input may be empty, valid, invalid, duplicate, or waiting while the draft is already at the maximum.
- **Expected behavior:** A valid tag is committed as a chip, the input clears, the visible count updates, and focus remains ready for the next tag. Validation is case-insensitive and follows the documented Latin-letter, number, hyphen-separator, and single key/value shape demonstrated by the page without settling the open final casing policy. Invalid or duplicate text remains editable, receives specific inline feedback associated with the input, and does not alter existing chips. Removing a chip updates the count immediately. When a maximum-limit attempt remains typed and a chip is removed, focus returns to that input and the user can explicitly commit the now-eligible value; removal must not silently create it.
- **State/data effect:** Only the local draft tag array changes. Valid additions append one normalized comparison value, removals delete only the selected chip, and rejected input leaves the tag array unchanged. No suggestion service or remote tag catalog is queried.
- **Alternate paths:** Empty input does nothing until creation is attempted; a zero-tag creation attempt shows the minimum error and focuses the field. Whitespace, Unicode, misplaced or repeated separators, unsupported colon shapes, and other invalid forms are rejected without discarding valid chips. A case-insensitive duplicate is rejected. A maximum of ten is retained when an eleventh is attempted, with clear feedback that removing one restores capacity. After correction, stale error feedback clears.
- **QA acceptance check:** Starting with the page fixture, add a valid simple tag and a valid key/value tag and confirm chips and count update. Attempt a whitespace tag and a differently cased duplicate and confirm neither changes the chips. Reach ten, attempt an eleventh, and confirm the count stays at ten with maximum feedback. Remove one chip, recommit the pending valid value, and confirm the count returns to ten. Remove all chips, submit, and confirm the page remains open with focus and minimum feedback at the input.

### PO-002: Keep access and matching choices logically linked

- **Scenario:** The creator chooses whether the conversation is discoverable and, only for a listed conversation, whether discovery requires every assigned tag.
- **Trigger:** The user selects Listed or Unlisted and, when available, toggles the require-every-tag choice.
- **Preconditions:** The identified creator is editing an unsubmitted draft; exactly one access choice is always selected.
- **Expected behavior:** Listed exposes the optional require-every-tag control and explains the default inclusive behavior. Unlisted immediately hides the listed-only control and clears any prior checked value because unlisted conversations already require the complete tag combination. Returning to Listed reveals the control unchecked so an old hidden choice is never applied unexpectedly.
- **State/data effect:** The local draft stores access as either listed or unlisted. Exclusive matching is true only when access is listed and the visible checkbox is selected; it is forced to false for unlisted drafts.
- **Alternate paths:** Rapidly switching choices must leave one selected card, one coherent description, and no stale exclusive value. No unlisted-exclusive option, private-tag suggestion, invitation, approval, or permission workflow appears. Permission denial is not a page state because the requirements allow the current identified user to create a conversation.
- **QA acceptance check:** Select the listed exclusive option, then select Unlisted and confirm the option disappears and its state clears. Select Listed again and confirm the option returns unchecked. Submit each access variant in separate runs and confirm the captured local draft reflects only a valid access/matching combination.

### PO-003: Create from a stable draft with recoverable local outcomes

- **Scenario:** The creator submits a valid draft, understands that creation is underway, and either enters the new workspace as first owner or recovers from a simulated failure.
- **Trigger:** The user activates Create conversation with one to ten valid committed tags and a valid access/matching combination.
- **Preconditions:** There is an identified creator profile, no validation error is active, and no earlier creation attempt is pending.
- **Expected behavior:** Any valid text waiting in the tag field is visibly committed before submission. The page captures one stable draft snapshot, disables all form controls and conflicting navigation during the short pending state, and exposes an accessible loading status. A local success outcome creates the static conversation example, identifies the current profile as its first owner, shows concise success feedback, and opens the existing conversation workspace. The handoff must reflect the captured tags and access/matching choice rather than an unrelated example. A local failure or timeout keeps the completed draft intact, shows a form-level error, restores controls, and offers retry without creating a second conversation.
- **State/data effect:** A successful local fixture adds one active conversation with the selected tags, listed state, listed-only matching mode when applicable, and one active owner membership for the current identity. Failure, timeout, or retry-before-success creates no conversation. The captured snapshot, not later stale UI changes, determines the success result.
- **Alternate paths:** Double activation is ignored while pending. Invalid or zero-tag drafts return to PO-001 rather than entering pending state. A deterministic local failure and timeout both preserve the draft and allow retry; a later successful retry creates exactly one conversation. There is no real authentication, backend, or third-party request. In-flight cancellation is unnecessary once creation is accepted because the pending interval is brief and conflicting navigation is disabled; pre-submit cancellation is covered separately.
- **QA acceptance check:** Submit a valid listed draft and observe all editable controls become disabled with a loading status, followed by success and navigation to the workspace as owner with the selected configuration. Run the local failure fixture and confirm no navigation or conversation creation occurs, the draft remains editable, and retry is available. Retry with success and confirm exactly one conversation is created. Repeat with an unlisted draft and confirm no exclusive-matching value is retained.

### PO-004: Cancel without producing hidden state

- **Scenario:** The creator decides not to create a conversation and returns to the conversation list.
- **Trigger:** The user activates Cancel before submitting the form.
- **Preconditions:** No creation attempt is pending; the draft may be unchanged or may contain locally edited tags and access choices.
- **Expected behavior:** Cancel returns directly to `hub/index.html`. Because no draft is persisted and the form is deliberately short, no confirmation modal is required for this POC. The action is unavailable once creation is pending so it cannot race the success handoff.
- **State/data effect:** The local draft is discarded and no conversation or membership fixture is created.
- **Alternate paths:** Keyboard activation behaves the same as pointer activation. Returning to the create page starts from the defined static example rather than resurrecting a canceled draft. No autosave, recovery, or cross-device draft behavior is introduced.
- **QA acceptance check:** Change tags and access, activate Cancel, and confirm the conversation list opens with no new conversation. Reopen Create and confirm the canceled edits are absent. While creation is pending, confirm Cancel cannot initiate competing navigation.

### PO-005: Keep the mockup fully local and network-independent

- **Scenario:** A reviewer opens and exercises the creation page in the required local mockup environment without internet access or third-party dependencies.
- **Trigger:** The page loads and the reviewer completes tag editing, access selection, cancellation, local failure/retry, and successful creation.
- **Preconditions:** The HTML and its approved local assets are available; external network access may be blocked or unavailable.
- **Expected behavior:** The page renders with the same usable hierarchy and all interaction states without requesting Google Fonts, a live API, authentication provider, analytics endpoint, or other third-party service. Loss of network access produces no blank content, delayed control, permission prompt, or hidden failure.
- **State/data effect:** All page data, validation, service-like outcomes, and creation results remain fixture-backed or in-page state. No user identity, tag, access choice, or created-conversation data leaves the local mockup.
- **Alternate paths:** Offline and blocked-third-party conditions behave like the normal path. Loading, failure, timeout, and retry for creation are simulated locally under PO-003 rather than inferred from a real network. There is no permission-denied external-service state because no external service is needed.
- **QA acceptance check:** Block all HTTP and HTTPS traffic, reload the page, and exercise every approved interaction. Confirm the page remains visually usable, all local outcomes still work, and Playwright records only local document/asset navigation with zero remote font, API, authentication, analytics, or other third-party requests.

## Dynamic data, local fixture, and state expectations

- Maintain a page-local draft containing the current tags, access choice, and listed-only exclusive flag. The chip count, validation, conditional control, and submit eligibility must derive from that single draft state.
- Use a minimal identified-session fixture for Rowan Ellis and a minimal successful conversation fixture containing the selected tags, listed/unlisted state, applicable matching mode, active state, and first-owner membership.
- Provide deterministic local success, failure, and timeout outcomes for review and QA without adding visible developer controls to the product surface.
- Preserve the draft through simulated failure and retry, prevent duplicate creation while pending, and discard it on Cancel.
- Do not query a tag suggestion catalog on this page. Conversation creation accepts creator-invented valid tags.

## External service and real API avoidance

- No application API, backend endpoint, or authentication request was observed in the page script.
- Live Google Fonts stylesheet and font requests were observed during Playwright rendering. They should be removed from the mockup execution path so the page remains entirely local and deterministic.
- Creation must remain a local simulated operation. Its loading, success, failure, timeout, and retry states must not call DynamoDB, a Node API, a human identity provider, or any third-party service.
- No payment, OAuth, SSO, map, notification, upload, AI, or other protected-service behavior belongs on this page.

## Validation expectations

- Enforce one to ten committed tags and block creation outside that range.
- Compare tags case-insensitively and reject duplicates without settling the open display-casing decision beyond the current local example.
- Accept only the documented component shape demonstrated by the page: Latin letters and numbers, hyphens only as separators, and at most one key/value separator. Do not expand the grammar while its remaining details are unresolved.
- Keep errors adjacent and programmatically associated with the tag input, announce changes, focus the invalid field after failed submission, and clear stale feedback after correction.
- Validate the access/matching combination before capturing the creation snapshot.

## Modal, confirmation, and linked-control expectations

- The access cards and exclusive checkbox are one linked control group; hidden exclusive state must always clear when Unlisted is selected.
- No confirmation modal is warranted for Cancel in this short, non-persisted POC form. Cancel is direct before submission and unavailable during pending creation.
- No creation confirmation modal is needed. The deliberate primary button, pending status, result feedback, and direct workspace handoff are sufficient.

## Buttons and links to preserve or clarify

- **Create conversation:** Commits valid waiting input, validates the whole draft, starts one local creation attempt, and prevents duplicate activation while pending.
- **Cancel:** Discards the draft and returns to the conversation list before submission.
- **Tag remove buttons:** Remove only their named chip, expose an accessible name, update count and validation, and restore input focus when capacity becomes available.
- **Listed/Unlisted cards:** Select exactly one access mode and clearly govern whether the exclusive-matching control is available.
- **Private navigation:** Conversations, Find, and Create retain their existing destinations and current-page indication; conflicting navigation is disabled during the brief captured-submit state.

## Explicitly out of scope and intentionally not recommended

- Conversation title or description fields.
- Invitations, approval queues, participant limits, member selection, or role setup beyond making the creator first owner.
- Editing access or matching mode after creation.
- Tag ownership, private-tag autocomplete, a tag browser, or resolution of the open final casing and extra-search-tag rules.
- Authentication UI, bot-token management, API configuration, live backend persistence, DynamoDB access, or third-party service integration.
- Note visibility, retention controls, billing, analytics, audit timelines, hard deletion, archival controls, advanced permissions, or additional pages.
- Autosaved drafts, cross-device draft recovery, or a multi-step creation wizard.

## Mockup change statement

No mockup HTML, CSS, JavaScript, concept document, schema document, application source, or supporting asset was changed during this review. The only created artifact is `docs/mockup/tasks/hub-create-review.md`.
