# Product Owner Review: Your Conversations

- **Assigned page:** `docs/mockup/desktop/hub/index.html`
- **Page slug:** `hub-index`
- **Review role:** Product Owner

## Sources reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/hub/index.html`
- Directly referenced local assets: `docs/mockup/desktop/assets/styles.css` and `docs/mockup/desktop/assets/app.js`

## Page purpose and user context

The page is the private starting point for an identified person returning to Tawk. Its primary job is to let that person scan a short list of active joined conversations and resume the right one. The list may include an ordinary conversation, one the person owns or administers, and a private moderation discussion in which the person participates; tags, not invented conversation titles, identify each item.

The likely entry path is the public Tawk home after the mockup's assumed identified-session handoff, or the shared private navigation from another Tawk page. The natural next actions are to resume one joined conversation in `docs/mockup/desktop/conversation/thread.html`, find another conversation in `docs/mockup/desktop/hub/find.html`, create one in `docs/mockup/desktop/hub/create.html`, or return to the public home.

## Playwright rendered inspection

### Route used

- **Kind:** `system-node-package`
- **Node executable:** `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`
- **Playwright package directory:** `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`
- **Browser:** `chromium`
- **Launch options:** `{"channel":"chrome","headless":true}`
- **Desktop viewport:** 1440 by 900
- **Rendered target:** `file:///Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk/docs/mockup/desktop/hub/index.html`

### Rendered observations

- The page rendered successfully with the expected title, private header, Rowan Ellis identity pill, two large quick actions, and a Joined panel containing three conversation cards.
- The layout had no horizontal overflow at 1440 pixels. The document was 969 pixels tall, so the final card required a small vertical scroll in the 900-pixel viewport; all content remained laid out coherently.
- The cards visibly distinguish an Owner conversation, a Member conversation with a bot as the recent author, and an Administrator private moderation discussion. Tags are the visible identifiers, consistent with the unresolved title/description model.
- Each card has a restrained recent-message cue and relative time. The displayed count of three agrees with the three rendered cards.
- The full Find and Create quick-action surfaces are clickable. Each Resume control is also a usable 110-by-43-pixel link.
- Keyboard traversal reached the brand, private navigation, both quick actions, and all three Resume links in visible order.
- All three Resume links have the same accessible text and resolve to the same undifferentiated `../conversation/thread.html` URL. The rendered page exposes no local state, query, or hash that tells the thread page which conversation was selected.
- The conversation-card surfaces themselves are not interactive; only their Resume links open a conversation. This is acceptable if Resume remains the single clear target, but the target must identify and retain the selected conversation.
- There are no rendered loading, empty, error, retry, stale-access, modal, confirmation, or feedback states. No buttons, dialogs, or toasts exist on this page.
- Rendering issued live requests to Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`). Those requests succeeded during inspection, and there were no browser console errors, but the page is not presently independent of a third-party network service.

## Current behavior from code inspection

The page is static HTML backed by shared presentation styles. The shared script supports generic modals, dropdowns, and toasts, but this page declares none of their triggers or targets, so it adds no page behavior. Find, Create, brand, private-navigation, and Resume controls are ordinary links. All three conversation examples and the count badge are hard-coded, and no selected-conversation state is recorded before navigation. The code does not attempt an application API or real authentication flow, but the shared stylesheet imports remote fonts.

## Recommended user experience and interactions

### PO-001: Resume the selected conversation

- **Scenario:** A returning participant chooses one joined conversation from the list and expects its own conversation workspace to open.
- **Trigger:** The user activates Resume on a specific conversation with a pointer or keyboard.
- **Preconditions:** The selected item represents an active membership in the local joined-conversation fixture and has a unique local conversation key associated with its visible tag combination.
- **Expected behavior:** The selected conversation opens in the conversation workspace, and the workspace visibly matches the tags, role, and recent context of the item the user selected. The Resume control's assistive name distinguishes that conversation rather than announcing three identical links. One activation is sufficient; no confirmation is needed for this reversible navigation.
- **State/data effect:** Store or pass only the selected local conversation key needed by the mock workspace. The joined list and membership data remain unchanged.
- **Alternate paths:** If the membership is stale, removed, or banned in the local fixture when Resume is activated, keep the user on this hub, show concise inline feedback that the conversation is no longer available to them, remove it from the active joined list, update the count, and move focus to the feedback. If the selection cannot be resolved because local fixture data is unavailable, preserve the list and offer a local retry without opening a generic or wrong thread.
- **QA acceptance check:** Activate each Resume link in turn and verify that the destination workspace shows the corresponding visible tag combination and role. Using keyboard navigation or an accessibility tree, verify that each Resume link can be distinguished by its conversation tags. Switch one fixture membership to stale, activate its Resume link, and verify that no thread opens, the inline explanation receives focus, the item disappears, and the count decreases by one.

### PO-002: Load a truthful joined-conversation list

- **Scenario:** The identified person opens the hub and needs an accurate, scannable list of active conversations they currently participate in.
- **Trigger:** The page opens, the user returns to it, or the user retries after a local fixture-loading failure.
- **Preconditions:** A local mock fixture can return active joined memberships, their role, visible tags, optional recent-message cue, recent activity time, and whether an item is a private moderation discussion.
- **Expected behavior:** Show a restrained loading state while the local fixture is being read, then replace it with active joined conversations ordered by most recent activity and a count that matches the visible items. Each populated item shows one to ten tags, the current role, and a concise recent cue; a conversation with no visible message uses a neutral no-recent-activity cue rather than fabricated content. Private moderation discussions remain recognizable as private without exposing extra internal details.
- **State/data effect:** Populate the list and count from local fixture data only. Retain the fixture's active memberships and display fields without creating, joining, leaving, or changing roles.
- **Alternate paths:** When the fixture returns no active memberships, replace the list and zero-count badge with an empty state that routes to the existing Find and Create jobs. On a local read failure or timeout, show a page-local error with Retry and do not substitute stale sample conversations. A retry shows loading, then either the populated, empty, or error result. Exclude former, removed, banned, and archived memberships; because archived-conversation visibility is unresolved, do not invent a separate archived collection.
- **QA acceptance check:** Load fixtures representing populated, empty, delayed, failed, and retry-success responses. Verify loading is replaced rather than overlaid, the populated list is sorted newest first, the count always equals visible cards, empty state offers Find and Create, failure offers Retry, and former/removed/banned/archived records never appear in Joined.

### PO-003: Keep find and create routes clear and independent

- **Scenario:** The person has no suitable joined conversation to resume and chooses the separate discovery or creation job.
- **Trigger:** The user activates the large Find a conversation or Create a conversation action, or the matching private-navigation link.
- **Preconditions:** The identified mock session is present; no joined-conversation selection is required.
- **Expected behavior:** Find opens the tag-driven discovery page, while Create opens the tagged-conversation setup page. The two actions remain visually and semantically distinct, retain keyboard focus visibility, and do not mutate the hub list before navigation. Returning to the hub reloads or restores the current local list and truthful count.
- **State/data effect:** Navigation changes pages only. Find does not create membership by itself, and Create does not create a conversation until its own flow completes.
- **Alternate paths:** If a local destination cannot be opened, remain on the hub with concise link-specific feedback and allow another activation; do not fall back to a real service or authentication flow. An empty joined list still exposes both actions.
- **QA acceptance check:** Activate each quick action and corresponding header link with pointer and keyboard. Verify Find and Create open their respective local pages, the hub fixture is unchanged by navigation alone, and returning shows the same list and count. Simulate an unavailable local target and verify the hub remains usable with feedback rather than navigating to a blank or remote page.

### PO-004: Preserve hub navigation and identified context

- **Scenario:** An identified person confirms where they are and moves through the established public or private navigation.
- **Trigger:** The page renders or the user activates the Tawk brand, Conversations, Find, or Create navigation item.
- **Preconditions:** The mockup is operating in its assumed identified human session for Rowan Ellis.
- **Expected behavior:** Conversations is visibly identified as the current private section. Find and Create perform the same local navigation jobs as the quick actions. The Tawk brand returns to the public product home without presenting an invented sign-in or sign-out flow. The displayed identity remains context, not a dead control that implies an unsupported profile menu.
- **State/data effect:** Navigation alone does not alter identity, membership, role, or conversation data. The local mock session remains identified until the user deliberately returns to the public entry page.
- **Alternate paths:** If the identified-session fixture is missing, do not show joined data under an anonymous identity; show a concise unavailable-session state that routes only to the public home. Do not invent a credential form, provider chooser, profile editor, or bot-token management surface.
- **QA acceptance check:** Verify Conversations carries the current-page indication, every navigation item has a visible keyboard focus state, and each opens its documented local destination. Remove the identified-session fixture and verify no joined conversations render anonymously and the only recovery route is the public home.

### PO-005: Render without third-party network access

- **Scenario:** A reviewer opens the desktop mockup locally with no network access and expects the hub to remain complete and usable.
- **Trigger:** The local page loads while external network requests are blocked or unavailable.
- **Preconditions:** All page content, fixture data, and required visual resources are available locally or have resilient local fallbacks.
- **Expected behavior:** The header, actions, tags, roles, recent cues, count, loading/empty/error states, and navigation render without waiting for or contacting a third-party service. Typography may use an equivalent local or system fallback, but loss of network access must not hide content, shift controls out of reach, or delay interaction.
- **State/data effect:** None; network availability does not change the local session or joined-conversation fixture.
- **Alternate paths:** A missing optional visual resource falls back without a blocking error. No live API, backend, authentication provider, analytics endpoint, or font service is called, and Retry applies only to the intentionally simulated local fixture state.
- **QA acceptance check:** Block all `http` and `https` requests, reload the page in Playwright, and verify there are no attempted third-party requests, no console errors, and all hub content and controls remain visible, keyboard reachable, and functional against local fixtures.

## Dynamic data, local fixtures, and state expectations

The minimum page-local fixture needs an identified human session and a small ordered collection of active memberships. Each item needs a stable local conversation key, one to ten visible tags, current role, conversation kind sufficient to mark an existing private moderation discussion, optional recent-message author and excerpt, and recent activity time. The mock state also needs controllable loading, empty, failure, timeout, retry-success, and stale-membership variants. No production-shaped dashboard metrics, raw identifiers, role history, former memberships, or broad activity feed is needed.

## External services and API avoidance

No application API, live backend, or authentication request was observed in the page script. The page does make real Google Fonts requests through its shared stylesheet; this should be replaced by a local or system-font behavior so rendered review never depends on the third party. Conversation loading, session handling, stale-access outcomes, and navigation failures must all be locally fixture-backed or deliberately simulated. This page does not need OAuth, SSO, payments, maps, notifications, uploads, AI calls, or any matching service simulation.

## Validation expectations

There are no form fields on this page. Validation is therefore limited to local state integrity: every displayed item must have a resolvable local conversation key, between one and ten displayable tags, a supported current role, and an active membership. The visible count must equal the rendered active items. Invalid, incomplete, former, removed, banned, or archived fixture entries must not leak into Joined; they should produce the controlled empty/error/stale paths described above rather than a broken card.

## Modal, confirmation, and linked-control expectations

No modal or confirmation is warranted for Resume, Find, Create, or ordinary navigation because each action is reversible and performs no destructive change on this page. Find and Create quick actions should remain aligned with their matching header links. Each Resume control must remain bound to its own card's local conversation key and accessible conversation identity. The identity pill should remain non-interactive until a supported profile or session action is defined.

## Buttons and links to retain or clarify

- Retain the Tawk brand route to the public home and the three-item private navigation.
- Retain both large Find and Create actions because they expose the page's two adjacent jobs without adding a dashboard.
- Retain one Resume action per card, but make its target and assistive meaning specific to that conversation.
- Use Retry only in the local list-error state. Do not add refresh, sort, filter, pagination, overflow menus, edit controls, leave controls, moderation controls, or a profile-menu affordance to this page.

## Explicitly out of scope

- Conversation titles or descriptions, because those product fields are unresolved.
- Public discovery results, hidden-conversation details, tag suggestions, or joining controls; those belong on Find.
- Conversation creation controls; those belong on Create.
- Former memberships, an archived-conversation section, or a decision about archived-conversation visibility.
- Moderation queues, governance controls, role changes, member management, or ticket actions.
- Global activity feeds, KPI cards, analytics, unread systems, notifications, pinning, favorites, folders, search within joined conversations, sorting controls, or pagination.
- Authentication forms, provider selection, anonymous participation, bot-token management, profile editing, or sign-out behavior.
- New pages, new major sections, or any real API or third-party-service integration.

## Change statement

No mockup files were changed. This review created only `docs/mockup/tasks/hub-index-review.md`.
