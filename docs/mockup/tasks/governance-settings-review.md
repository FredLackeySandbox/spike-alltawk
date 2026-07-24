# Product Owner Review: Tags and Lifecycle

- **Assigned page:** `docs/mockup/desktop/governance/settings.html`
- **Page slug:** `governance-settings`
- **Review role:** Product Owner

## Sources Reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/assets/app.js` as a directly referenced local behavior asset

## Page Purpose and User Context

This page lets an identified conversation owner or administrator maintain the one-to-ten-tag set for one conversation while keeping its listed/unlisted access and matching mode read only. It also gives an owner the separate, destructive lifecycle action to archive the conversation while showing that an administrator cannot archive.

The primary user is a conversation owner. A conversation administrator is the secondary permitted user for tag maintenance only. An ordinary member should not receive governance controls. The likely entry path is the conversation workspace or the governance subnavigation. Natural next actions are to save or cancel back to the conversation workspace, open Members & roles, or, for an owner, archive the conversation after explicit confirmation.

## Playwright Route Used for Rendered Inspection

- **Route kind:** `system-node-package`
- **Node executable:** `/Users/flackey/.nvm/versions/node/v24.15.0/bin/node`
- **Package directory:** `/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright`
- **Package version:** `1.57.0`
- **Browser type:** `chromium`
- **Launch options:** `{"channel":"chrome","headless":true}`
- **Viewport inspected:** 1440 × 1000
- **Validation:** The supplied route launched Chrome and rendered the assigned local HTML page successfully.

## Current Behavior Observed from Playwright and Code Inspection

### Rendered observations

- The rendered page has a clear sparse settings hierarchy: editable tags and a read-only access summary appear first, followed by a visually separate archive area. There was no horizontal overflow at the desktop viewport.
- Four tag chips render and the count reads `4 of 10`, while the breadcrumb and archive confirmation identify the conversation using only three tags. Adding a fifth draft tag changes the chips and count but not those other conversation references.
- Enter and comma add a tag; chip remove buttons work; duplicate, invalid-format, maximum-count, and last-tag checks provide inline messages. Attempting to remove the final tag is blocked and leaves one chip.
- A supported-looking key/value example such as `Design:Ops` is rejected because the current validator does not allow a colon, even though the requirements establish `key:value` as a valid tag form.
- Save tags is enabled even before a change. On submit it shows a success toast, remains interactive during the delay, navigates to the conversation, and does not retain the saved tag set when the settings page is opened again.
- Archive opens a confirmation and can be canceled with Escape, the close control, Keep active, or the backdrop. Focus remains on the page trigger when the dialog opens rather than moving into and being contained by the dialog.
- Confirming archive hides the archive action and shows a retained-records success state. The tag input, save button, and tag-removal controls remain enabled even though the same page says the conversation is no longer active.
- The rendered owner badge and archive action communicate the owner case. A disabled “Archive unavailable” example explains the administrator boundary, but the page does not yet behave as an actual administrator state.

### Code observations

- The page uses an in-page four-tag array and rebuilds chips and the numeric count from that draft array.
- Input is trimmed, lowercased, stripped of one leading `#`, checked for duplicates, and validated by a simple-tag expression. It does not support the documented `key:value` form.
- Tag edits mutate only the in-page array. Save shows a toast and redirects after 900 ms; it has no durable local fixture update, no pending lock, and no failure path.
- Archive is entirely local: confirmation changes classes and ARIA visibility, hides the archive controls, shows a success notice, and shows a toast. It does not call an API or delete records.
- The shared modal behavior supports open, close, backdrop dismissal, and Escape dismissal, but not initial focus placement, focus containment, or reliable focus restoration.
- No real API, live backend, authentication, or third-party-service call was observed on this page.

## Recommended User Experience and Interactions

### PO-001: Maintain a valid tag draft

- **Scenario:** An authorized owner or administrator adds or removes tags while preserving the documented tag grammar and one-to-ten boundary.
- **Trigger:** The user enters a tag and presses Enter or comma, or selects a remove control on an existing chip.
- **Preconditions:** The conversation is active; the viewer is an owner or administrator; the current committed tag set contains between one and ten tags.
- **Expected behavior:** Valid simple tags and the explicitly supported single-colon `key:value` form become chips, the input clears, focus stays ready for another tag, and the count updates immediately. Duplicate checks are case-insensitive. Invalid input receives a specific inline explanation without changing the chips. Removing a chip updates the draft and count. The UI must not present unresolved casing or multi-colon behavior as a finalized product rule.
- **State/data effect:** Only the in-page draft tag set changes until Save tags succeeds. The committed local conversation fixture remains unchanged. Each normalized tag remains reusable and is not treated as owned by this conversation.
- **Alternate paths:** Empty input makes no change; whitespace, Unicode, malformed hyphen placement, unsupported colon placement, and otherwise invalid components remain in the input with inline guidance. A duplicate leaves the draft unchanged. At ten tags, another addition is blocked and the maximum state is visible; removing one re-enables addition. At one tag, removal is blocked with the one-tag requirement and the existing chip remains.
- **QA acceptance check:** Starting with the four-tag fixture, add a valid simple tag and a valid `key:value` tag and observe two new chips and a matching count. Verify a case-insensitive duplicate and malformed value do not change the count. Reach ten tags and verify an eleventh is rejected, then remove down to one and verify the final removal is rejected.

### PO-002: Save or discard tag changes deliberately

- **Scenario:** The user commits a valid draft, abandons it, or recovers from a locally mocked save problem without losing work or submitting twice.
- **Trigger:** The user selects Save tags or Cancel after editing the draft.
- **Preconditions:** The conversation is active; the viewer may maintain tags; the draft is either unchanged, valid and changed, or contains a pending invalid value.
- **Expected behavior:** Save is unavailable when nothing changed or the draft is invalid. A valid save enters a visible pending state, disables tag editing and repeat submission, then shows success and returns to the conversation workspace. Cancel with no changes returns immediately. Cancel with unsaved changes asks whether to keep editing or discard the draft; discarding returns to the workspace and keeping editing restores focus to the editor.
- **State/data effect:** Successful save replaces the committed tag set in the local fixture and clears dirty state. Cancel or failed save leaves the committed fixture unchanged. A failed or timed-out mocked save retains the draft and restores enabled controls for retry.
- **Alternate paths:** If text remains in the input, Save first validates it as the intended final tag. Invalid, duplicate, minimum, or maximum states block submission and focus the relevant error/input. A locally mocked failure or timeout shows a concise non-success status and retry path; retry does not duplicate tags. Repeated clicks during pending state have no additional effect.
- **QA acceptance check:** Verify Save is disabled on initial load, becomes enabled after a valid edit, and locks controls while pending. Verify success returns to the conversation and the committed tags remain when settings is reopened. In the mocked failure scenario, verify the draft remains and retry can succeed. Verify dirty Cancel offers keep/discard choices and clean Cancel returns without a prompt.

### PO-003: Keep conversation identity and access context synchronized

- **Scenario:** The user needs every reference on the page to describe the same committed conversation while editing tags.
- **Trigger:** The page loads from its local conversation fixture or a tag save succeeds.
- **Preconditions:** A valid committed conversation fixture supplies tags, discovery mode, matching mode, lifecycle status, and viewer role.
- **Expected behavior:** The editor chips, tag count, breadcrumb conversation identity, and archive confirmation all use one committed tag set. Draft edits stay in the editor until saved; after success, every page reference reflects the newly committed set. Discovery and matching remain clearly read only and accurately explain the supplied fixture without offering unsupported edit controls.
- **State/data effect:** A successful save updates the single local committed tag set consumed by all page references. Draft edits do not silently rename the breadcrumb or archive target before commit. Access and matching values remain unchanged.
- **Alternate paths:** If a fixture is missing, has zero tags, or has contradictory access/matching values, the page must not fabricate editable defaults or allow save/archive; it shows a compact local-data-unavailable state with a retry/reset path. If the conversation is unlisted, the read-only explanation reflects mandatory all-tag matching without exposing an exclusive-matching editor.
- **QA acceptance check:** Load the listed-exclusive fixture and verify the same committed tags appear in the editor, breadcrumb, and archive dialog. Add a draft tag and verify only the editor changes. Save successfully, reopen the dialog or page, and verify all references now show the same updated committed set while discovery and matching remain unchanged and non-editable.

### PO-004: Confirm archival safely and accessibly

- **Scenario:** An owner reviews the irreversible-in-practice consequence of ending active use, cancels safely, or confirms a locally mocked archive action.
- **Trigger:** The owner selects Archive conversation, dismisses the confirmation, or selects the destructive confirmation action.
- **Preconditions:** The conversation is active, the viewer is an owner, the tag draft has no unresolved changes, and the committed fixture is available.
- **Expected behavior:** Opening the dialog identifies the correct committed conversation, explains that active use ends while records remain, moves focus into the dialog, and keeps keyboard focus within it. Close, Keep active, Escape, and backdrop dismissal make no changes and return focus to the archive trigger. Confirmation enters a visible pending state and prevents repeat activation. Success announces the archived result; a local failure restores the confirmation actions with a retry or cancel choice.
- **State/data effect:** Cancellation changes nothing. Successful confirmation changes only the local conversation lifecycle state from active to archived; messages, memberships, tags, moderation records, and other retained history remain intact. No record is hard-deleted.
- **Alternate paths:** If tag edits are dirty, archival is blocked with a clear instruction to save or discard them first. A mocked failure or timeout retains active state and supports retry without duplicate effects. If the fixture becomes archived or the owner's permission becomes stale before confirmation, the page closes the modal and presents the current archived or permission-denied state instead of claiming a second success.
- **QA acceptance check:** With a clean owner fixture, open the dialog and verify correct identity, focus placement, focus containment, and retained-records warning. Dismiss it through each supported cancellation path and verify active state and focus restoration. Confirm once and verify pending protection and one announced success. Exercise failure, timeout, dirty-draft, and stale-state fixtures and verify no archive success is shown unless local state actually changes.

### PO-005: Render an archived conversation as inactive

- **Scenario:** The page reflects a successful archive or opens for a conversation whose local fixture is already archived.
- **Trigger:** Archival succeeds or the page loads with archived lifecycle state.
- **Preconditions:** The fixture records the conversation as archived.
- **Expected behavior:** The page prominently identifies the archived state and retained records. Tag chips and access context remain visible for reference, but tag input, tag removal, Save tags, and the archive action are unavailable so the user cannot continue editing an inactive conversation. The page does not claim how archived conversations behave in search or participant lists because that product decision is unresolved.
- **State/data effect:** The committed fixture remains archived and all retained tags and records remain unchanged. No further tag draft is created and repeated archival cannot occur.
- **Alternate paths:** Reloading or revisiting the page preserves the same local archived state. If a stale active rendering receives an archived update, pending edits are abandoned with a clear state message rather than being saved. There is no automatic unarchive path or automatic archival based on inactivity.
- **QA acceptance check:** Confirm archival and verify the success state, retained tag/access summary, and disabled or absent edit/archive controls. Reload the page and verify it remains archived from the local fixture. Verify the page makes no hard-delete, automatic-archive, discovery, or read-only participant-view promise beyond the established retained inactive state.

### PO-006: Enforce owner and administrator boundaries

- **Scenario:** The same governance page presents only the controls permitted by the viewer's current conversation role.
- **Trigger:** The page loads with an owner or administrator local role fixture, or permission changes before an action completes.
- **Preconditions:** The identified viewer has an active owner or administrator membership for this conversation.
- **Expected behavior:** Both roles can add, remove, validate, save, and cancel tag changes. Only an owner can open and confirm archival. An administrator sees the archive action unavailable with a concise owner-only reason, without a control that can open the confirmation. If permission is lost while editing, the attempted action is denied locally and the page refreshes to the permitted state without claiming success.
- **State/data effect:** Role selection affects control availability only; it does not change membership data. A permission-denied tag save or archive attempt leaves the committed tag and lifecycle fixtures unchanged.
- **Alternate paths:** An ordinary-member or role-none fixture does not expose editable governance actions. An administrator never receives a hidden route to archival. A stale owner-to-administrator change preserves no unauthorized pending result and explains why the action stopped.
- **QA acceptance check:** Render the page with owner and administrator fixtures. Verify both can exercise the tag workflow, only the owner can open the archive confirmation, and the administrator sees the clear owner-only boundary. Exercise a stale permission change during save and archive and verify no unauthorized local state mutation or success message occurs.

## Dynamic Data, Local Fixture, and State Expectations

The minimum local conversation fixture needs the committed tag set, listed/unlisted discovery mode, applicable matching mode, active/archived lifecycle state, and current viewer role. In-page state needs a separate tag draft, dirty/valid state, pending operation state, modal state, and announced success/error state. Deterministic local scenarios should cover successful save/archive, failure, timeout, stale lifecycle, and stale permission without contacting a service. A legitimate conversation never has an empty committed tag set; a missing or invalid fixture is an unavailable-data state, not an editable zero-tag conversation.

## External Service and API Expectations

No real API, backend, authentication, OAuth, payment, upload, notification, AI, map, or other third-party call was observed or is needed for this page. Tag persistence, role variants, save outcomes, archive outcomes, and stale-state scenarios must remain local and fixture-backed. The mockup must not call a live application endpoint or perform real authentication/authorization. Any loading, failure, timeout, retry, or permission-denied experience should be simulated locally and visibly.

## Validation, Confirmations, and Linked Controls

- Tag validation must enforce one to ten tags, case-insensitive duplicate detection, documented Latin-letter/number rules, hyphen placement, and the established `key:value` form without pretending unresolved grammar choices are settled.
- Save and Cancel operate on a draft separate from committed data; dirty cancellation protects against accidental loss, while saving synchronizes all conversation references.
- Archive is owner-only, requires a clean draft and explicit confirmation, preserves all records, and changes the page to an inactive state.
- The archive dialog must support pointer and keyboard cancellation, focus management, pending/failure states, and one successful state transition.
- The read-only access and matching summary is linked to the same conversation fixture but remains non-editable.

## Button and Link Purposes

- **Save tags:** Validate and commit the draft locally, then return to the assigned conversation.
- **Cancel:** Return to the conversation without committing; protect a dirty draft from accidental loss.
- **Archive conversation:** Owner-only entry to the archive confirmation, never a direct archive action.
- **Keep active / close / Escape / backdrop:** Dismiss the archive confirmation without mutation.
- **Confirm archive:** Change the local lifecycle state exactly once while retaining records.
- **Conversation breadcrumb:** Return to the current conversation workspace.
- **Members & roles:** Move to the sibling governance job; do not mix membership management into this page.
- **Conversations, Find, and Create:** Retain their existing private-product navigation purposes without adding unrelated governance behavior.

## Explicitly Out of Scope

- Editing listed/unlisted access or matching mode after creation.
- Hard deletion, configurable retention, automatic archival, unarchive behavior, or a promise about archived-conversation discovery and participant views.
- Audit timelines, raw record IDs, API controls, advanced permission configuration, bulk tag operations, tag ownership, or a general settings console.
- New pages, new major sections, conversation titles/descriptions, or resolution of the open tag-casing and multi-colon grammar questions.
- Real backend persistence, production authorization, external services, or third-party calls.

## Mockup Change Statement

No mockup HTML, CSS, JavaScript, concept, schema, or application files were changed. This review created only `docs/mockup/tasks/governance-settings-review.md`.
