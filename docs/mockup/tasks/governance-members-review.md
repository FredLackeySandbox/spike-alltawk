# Product Owner UX Review: Members and Roles

- **Assigned page:** `docs/mockup/desktop/governance/members.html`
- **Page slug:** `governance-members`
- **Review role:** Product Owner

## Source documents reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/assets/app.js`, which is directly referenced by the assigned page

## Page purpose and user journey

The page is the conversation-level roster for a privileged identified person who is currently an owner or administrator. Its primary job is to let that moderator compare active and retained former people and bots, understand current roles and access restrictions, and apply only the membership actions allowed by the moderator's own role. The rendered example is the owner view for Rowan Ellis, who begins as the last active owner.

The likely entry paths are the conversation workspace, the adjacent **Tags & lifecycle** governance page, or participant context from moderation. Natural next actions are to return to the conversation through the tag breadcrumb, review reported messages, move to tags and lifecycle settings, or remain on this page to promote, remove, ban, unban, or suspend an eligible participant.

## Playwright rendered inspection

### Playwright route used

The page was opened at a 1440 by 1000 desktop viewport with the exact preflight route below. The installed Chromium route launched successfully and rendered the local HTML.

```json
{"kind":"system-node-package","source":"application:/Applications","nodeExecutable":"/Users/flackey/.nvm/versions/node/v24.15.0/bin/node","packageName":"playwright","packageVersion":"1.57.0","packageDirectory":"/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright","browserType":"chromium","launchOptions":{"channel":"chrome","headless":true},"validation":"launched browser and rendered local HTML"}
```

### Rendered observations

- The initial active view rendered five participants: Rowan Ellis as the protected last owner, Maya Chen as an administrator, two ordinary people, and one bot with a posting suspension. The filter labels showed five active and two former participants.
- Selecting **Former** correctly changed both `aria-pressed` values and displayed the removed person and banned bot. The existing empty-state panel never appeared in the exercised states.
- Avery Brooks's menu offered owner and administrator promotion plus suspend, remove, and ban actions. Promoting Avery to owner updated the role badge and hid the continuity warning immediately, but the same row still offered both promotions, suspension, removal, and banning. Rowan also continued to be labeled as the protected last owner even though another owner now existed.
- Removing Noor Patel opened a confirmation with the participant and retained-membership consequence. Cancel left the row active. Confirm moved Noor to the Former view and displayed a success toast, but the filter counts remained at five active and two former while three former rows were visible.
- The suspension form opened with Patchwork Bot's displayed date and time. Empty date and time fields produced an inline error and kept the modal open. A non-empty date and time updated the access badge and toast, but no check ensured that the selected end was in the future and no control offered an immediate end to an existing suspension.
- Opening either action modal did not move focus into the dialog. Cancel left focus on the now-hidden Cancel button rather than returning it to the row action that opened the dialog.
- The breadcrumb, governance tabs, **Review reports**, and private-navigation links had destinations consistent with the page plan. No page errors or console errors occurred during inspection.
- Request inspection found no application API, authentication, or backend call. It did find live HTTPS requests to Google Fonts in addition to the local HTML, stylesheet, and script.

## Current behavior from code inspection

- The page uses a fixed in-document roster and local in-page mutation state. The shared script handles dropdowns, modal close buttons, backdrop clicks, Escape, and success toasts.
- Filtering only toggles row visibility. It does not derive counts or show the existing empty-state panel.
- Promotions mutate the role label immediately without confirmation and do not rebuild role-appropriate actions or recompute all owner-continuity indicators.
- Remove and ban convert an active row to a retained former row; unban leaves the identity former and eligible to join again. The membership counts are static.
- Suspension validation checks only that both fields contain values. Existing suspension data happens to match the form defaults rather than being populated from the selected row's state.
- No `fetch`, XHR, real authentication, or real moderation service behavior is present in the assigned page. Runtime font delivery is the only observed third-party request.

## Recommended user experience and interactions

### PO-001: Load and filter an authoritative role-aware roster

- **Scenario:** An authorized owner or administrator needs a trustworthy view of current and retained former participants before taking governance action.
- **Trigger:** The authorized user opens the page or selects the **Active** or **Former** roster filter.
- **Preconditions:** A local fixture provides the current identity's conversation role plus participant identity type, current or retained role, access state, relevant membership dates, and any suspension end time.
- **Expected behavior:** The page shows a brief local loading state, then defaults to Active with counts derived from the same roster state used to render rows. Switching filters updates the visible rows and pressed state without changing membership. Owners and administrators can see former participants; an ordinary member must not receive former-membership data or governance actions. Counts and visible rows update together after every local mutation.
- **State/data effect:** Loading, loaded, selected-filter, empty, and error are in-page states. Filtering changes only the selected view. The roster fixture remains authoritative for row content and counts.
- **Alternate paths:** An empty filter shows the existing empty-state treatment while leaving the other filter available. A local fixture-load failure shows a restrained error and Retry without exposing stale rows. If the current identity lacks or loses governance permission, former records and action controls are not rendered and the user is directed back to the conversation.
- **QA acceptance check:** Open the page under owner and administrator fixtures, verify the Active and Former counts equal their rendered rows, switch filters, and confirm no membership data changes. Exercise an empty fixture and a failed fixture with Retry. Open under an ordinary-member fixture and confirm former identities and governance actions are absent.

### PO-002: Promote permitted roles and recompute ownership safeguards

- **Scenario:** A conversation owner promotes an eligible active participant to administrator or owner while preserving role boundaries and owner continuity.
- **Trigger:** The owner chooses an available promotion from a participant's action menu and confirms the named participant and destination role.
- **Preconditions:** The current identity is an active owner; the target is active, is not already in the destination role, and is eligible for that promotion in the current local roster state.
- **Expected behavior:** The confirmation states the participant and new role. Confirm updates the role badge, closes the dialog, shows success feedback, removes obsolete promotion choices, and recomputes every last-owner label and protection state. Promoting another owner resolves Rowan's last-owner warning and protection wording consistently. The warning's archive alternative takes the user to the existing **Tags & lifecycle** page rather than implying an unavailable action on this page. Administrators never receive controls that add, remove, or change owners.
- **State/data effect:** Confirm ends the prior local role period and makes the new role current in the fixture-backed page state. Cancel leaves the role, menu, and continuity state unchanged.
- **Alternate paths:** Already-promoted or stale selections are not applied twice; the row refreshes from local state with a neutral explanation. Permission loss closes the confirmation and leaves the target unchanged. A user canceling by button, close control, Escape, or backdrop makes no role change.
- **QA acceptance check:** As Rowan, promote Avery to administrator and then use a fresh fixture to promote Avery to owner. Verify the destination role, available row actions, toast, and all continuity indicators agree after each confirmation. Cancel a promotion and verify no visible or fixture state changes. Under an administrator fixture, confirm no owner-changing action is available.

### PO-003: Remove a participant while retaining membership history

- **Scenario:** An owner or administrator removes a participant from active conversation access without hard-deleting retained membership.
- **Trigger:** The moderator selects **Remove** for a role-eligible active participant and confirms the named action.
- **Preconditions:** The target is still active and may be changed by the current moderator. An administrator cannot target an owner, and no action may leave the conversation without an owner.
- **Expected behavior:** The confirmation explains that participation ends but prior membership and authored content remain retained. Confirm changes the row to Former/Removed, records the local effective time, decrements Active, increments Former, switches to the Former view so the result is visible, and shows success feedback. Cancel closes the dialog without changing the row or counts.
- **State/data effect:** The target's active membership ends in local mock state and a retained former state replaces it; no identity, membership history, or message data is deleted.
- **Alternate paths:** The last owner remains protected and cannot initiate removal. A stale, already-former, or newly protected target produces a non-destructive message and refreshed row. Permission denial leaves all data unchanged. If the removal creates an empty Active view, the empty state is shown with the corrected zero count.
- **QA acceptance check:** Remove an eligible active member and verify the participant appears once in Former as Removed, the counts change by minus one and plus one, and retained role and date context remain visible. Reload/reset the fixture, cancel removal, and confirm all row and count values stay unchanged. Verify an administrator cannot remove an owner and the last owner has no removal path.

### PO-004: Ban and restore an identity without automatic rejoining

- **Scenario:** An owner or administrator blocks an active or former eligible identity from rejoining, then may later restore join eligibility.
- **Trigger:** The moderator chooses **Ban** for an eligible active or removed former identity, or chooses **Unban** for a banned identity, and confirms the named consequence.
- **Preconditions:** The current moderator may act on the target's role; the target's latest local state is known; administrator actions never alter an owner.
- **Expected behavior:** Ban confirmation distinguishes the stronger rejoin restriction from simple removal. Confirm ends active access when necessary, displays Banned in Former, updates counts when the target was active, and makes the local identity ineligible to rejoin this conversation. Removed former rows retain a Ban action because the requirements allow selecting an active or former participant. Unban confirmation restores eligibility only; the identity remains former and is not automatically added to the conversation.
- **State/data effect:** Ban records a local banned/none access period while retaining prior membership and identity context. Unban ends that restriction and marks the former identity eligible for a future join; it creates no active membership.
- **Alternate paths:** Cancel, stale state, duplicate ban/unban, or permission denial makes no mutation and returns refreshed status. A banned identity remains unable to rejoin even when it otherwise knows all tags. Ban and unban failures are simulated locally with an explanatory retry or dismiss path and never call a service.
- **QA acceptance check:** Ban one active member and one removed former member; verify both show Banned, only the active case changes filter counts, and a local join-eligibility check denies both. Unban one identity and verify it remains in Former, becomes eligible, and is not present in Active. Cancel each confirmation and verify no state change.

### PO-005: Apply, change, and end a time-bounded posting suspension

- **Scenario:** An owner or administrator temporarily prevents an eligible participant from posting while leaving reading and membership intact.
- **Trigger:** The moderator selects **Suspend posting**, **Change suspension**, or an immediate end-suspension action for an eligible participant, then applies or cancels the suspension form.
- **Preconditions:** The target remains an active role-eligible participant. For a change, the form is populated from that row's current local suspension end time and displayed timezone.
- **Expected behavior:** The form names the participant, explains that reading remains available, and requires an end date and time later than the current local time. Applying shows a short busy/disabled state, then updates the access badge, exact end time, action label, and success feedback together. Ending a suspension immediately restores Active/full participation. When the displayed end time passes in a fixture, the page resolves the state to Active rather than leaving an expired restriction visible.
- **State/data effect:** Apply creates or replaces only the local posting-suspension end time; membership and role remain unchanged. Ending or expiry clears the restriction. Cancel preserves the prior value exactly.
- **Alternate paths:** Missing, malformed, or past date/time keeps the dialog open with an inline error and focus directed to the first invalid field. Permission denial, stale target, or simulated local failure leaves the previous restriction unchanged and offers retry or dismissal. Cancel by any supported dialog-closing path makes no update.
- **QA acceptance check:** Suspend an active participant to a future ET time and verify the row and success feedback match it. Reopen Change and verify the same value is prefilled, then modify it and confirm the update. Try blank and past values and confirm no mutation. End the suspension and test an expired fixture; both must render Active/full participation.

### PO-006: Complete or cancel governance dialogs safely

- **Scenario:** A keyboard, assistive-technology, or pointer user completes or abandons a promotion, removal, ban, unban, or suspension action without losing context.
- **Trigger:** The user opens any governance dialog from a participant row, navigates within it, confirms, presses Cancel, uses the close control, presses Escape, or selects the backdrop.
- **Preconditions:** A participant and action have been selected from a currently visible row.
- **Expected behavior:** Opening moves focus to the dialog heading or first meaningful control, keeps keyboard focus within the open dialog, and prevents background controls from being operated. Every close path makes the dialog unavailable to assistive technology and returns focus to the originating row action. Confirm disables repeated submission until the local result completes; cancellation never fires the action.
- **State/data effect:** The dialog keeps a temporary selected participant/action state. Cancel clears that temporary state without mutating the roster. Confirm applies at most one mutation and then clears it.
- **Alternate paths:** If the originating row disappears after a confirmed mutation, focus moves to the selected filter or a nearby stable roster control. Escape and backdrop follow the same no-mutation cancellation rule. A rapid double activation cannot apply the same action twice.
- **QA acceptance check:** Open each dialog using only the keyboard, verify focus enters and stays within it, then close it through Cancel, close control, Escape, and backdrop and verify focus returns to the trigger with no mutation. Confirm once and verify repeated activation is disabled and only one state transition occurs.

### PO-007: Keep the page functional without third-party services

- **Scenario:** A reviewer opens and exercises the desktop mockup locally or offline without depending on production, backend, authentication, or third-party availability.
- **Trigger:** The page loads with external network access blocked and the user exercises filters and every approved roster action.
- **Preconditions:** The assigned HTML, shared local assets, and minimal roster fixtures are available under the mockup. No real sign-in, API, moderation, notification, or third-party service is available.
- **Expected behavior:** The page remains legible and fully interactive using local assets or system fallbacks. Roster loading, mutations, busy states, successes, local failures, permission denials, cancellation, and retry are fixture-backed or in-page behaviors. No page-purpose action sends a network request, and typography does not depend on Google Fonts or another live service.
- **State/data effect:** All demonstrations mutate only resettable local mock state. Opening or exercising the page creates no remote record and transmits no identity or governance data.
- **Alternate paths:** With external requests blocked, the page uses a local or system fallback without missing content or broken layout. Simulated failures remain deliberate local scenarios; they do not fall through to a live endpoint. Reloading or resetting returns to the known fixture baseline.
- **QA acceptance check:** Block all HTTP and HTTPS traffic, load the page, and exercise filters, promotion, removal, ban, unban, suspension, cancellation, and retry. Verify the page stays usable, the browser records no external request, and a fixture reset restores the initial five-active/two-former baseline.

## Dynamic data, local fixture, and state expectations

The smallest useful local dataset is the current seven-row example: people and bots, owner/administrator/member roles, active/removed/banned states, one time-bounded suspension, membership dates, and a current-user role. That dataset should be the single source for rendered rows, counts, menus, confirmations, and continuity messaging. It also needs resettable variants for empty Active, empty Former, local load failure/retry, administrator permissions, ordinary-member denial, stale action, and expired suspension. These are local demonstration states, not reasons to add a server or a visible developer control panel.

## External service and API avoidance

No real application API, backend, authentication flow, or moderation service was observed. The rendered page did request Google Fonts over HTTPS. The reviewed experience should use local typography assets or a system fallback so it works offline and sends no third-party request. All action success, loading, failure, retry, cancellation, permission-denied, and stale-state outcomes must remain local; there is no page-purpose external service that needs a real call or an OAuth-like simulation.

## Validation expectations

- Derive action availability from both the current moderator role and the target's latest role/state.
- Require a complete future date and time for posting suspension and preserve the explicitly displayed timezone.
- Prevent duplicate or stale role, remove, ban, unban, and suspension mutations.
- Recompute roster counts, last-owner status, row labels, menus, and filter emptiness after every successful state change.
- Keep cancellation non-destructive and explain permission-denied or no-longer-valid actions without losing the user's roster context.

## Modal, confirmation, and linked-control expectations

Promotion, removal, ban, and unban require a named consequence confirmation. Suspension uses its named participant form as the deliberate commit step, with validation before Apply; changing and ending an existing suspension must be equally clear. Dialogs need complete keyboard focus behavior as described in PO-006. The conversation-tag breadcrumb returns to the thread, **Tags & lifecycle** opens the adjacent governance page, **Review reports** opens the conversation's moderation queue, and the shared navigation retains its current hub/find/create purposes. The last-owner notice should link its archive alternative to the existing lifecycle page. No additional global navigation or new destination is needed.

## Explicitly out of scope

- No organization-wide user administration, bulk actions, invitation workflow, permissions matrix, or new page.
- No exhaustive role-period timeline, audit feed, raw IDs, database metadata, or message-activity metrics.
- No hard deletion of identities, memberships, messages, or conversations.
- No change to listed/unlisted mode, tag settings, archival mechanics, ticket status, or moderation evidence on this page.
- No real API, live authentication, production authorization, notifications, or third-party service integration.
- No exact final copy, CSS prescription, implementation architecture, or visible fixture/debug controls are recommended.

## Mockup change statement

No mockup files were changed. This review created only `docs/mockup/tasks/governance-members-review.md`.
