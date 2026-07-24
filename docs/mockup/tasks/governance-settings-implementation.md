# Implementation Report: Tags and Lifecycle

- **Assigned page:** `docs/mockup/desktop/governance/settings.html`
- **Page slug:** `governance-settings`
- **Role:** UI Developer
- **Binding source:** `docs/mockup/tasks/governance-settings-approval.md` (Architect approval; all six recommendations Approved with nuance)
- **Result:** PASS

## Approach

All behavior was implemented page-locally in the assigned HTML using inline `<style>` and a single inline `<script>`. The locked shared assets (`assets/app.js`, `assets/styles.css`) were not modified; existing helpers were reused: `window.showToast(msg)`, the `[data-modal-open]` / `[data-modal-close]` modal helpers, and the shared Escape/backdrop dismissal. A single committed-conversation fixture object drives every reference on the page, with a separate in-page tag draft, dirty/valid flags, pending state, and modal state. A compact page-local demo bar (scenario select + failure/stale toggles + reset) exposes the deterministic fixtures required by the approval's QA checks; it is not part of the product surface. `sessionStorage` is used only for local reopen/reload persistence of the committed tag set and lifecycle status — no network, API, or real authorization is used anywhere.

## Per-recommendation implementation

- **PO-001 — Maintain a valid tag draft (Approved with nuance):** Enter or comma adds a tag; validation now accepts the documented one-colon `key:value` grammar (`^[a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*)?$`, matching `tag.yaml normalizedValue`). Duplicate detection is case-insensitive; whitespace, Unicode, multi-colon, and malformed input are rejected with specific inline messages and leave the chips unchanged. Count updates immediately. One-to-ten is enforced: an 11th add is blocked with a max message; the final tag's remove control is not rendered at one tag, so the last tag cannot be removed. Edits mutate only the in-page draft; the committed fixture is untouched until save. No raw IDs are exposed and display-casing is normalized without asserting a resolved casing/colon policy.
- **PO-002 — Save or discard deliberately (Approved with nuance):** Save is disabled on load, enables only for a changed and valid draft, and — per the review — first validates any leftover input text as the intended final tag before submitting. Saving enters one visible pending state (spinner, input/remove/cancel/save disabled) that blocks repeat submission, then commits once (updating the committed fixture and persisting locally) and returns to the conversation. A deterministic local failure toggle keeps the draft, restores controls, shows a concise retry status, and a subsequent retry succeeds without duplicating tags. Clean Cancel returns immediately; dirty Cancel opens a keep-editing / discard confirmation (keep-editing restores focus to the editor; discard resets the draft to committed and leaves).
- **PO-003 — Keep identity and access synchronized (Approved with nuance):** Breadcrumb identity, editor chips, tag count, archive-dialog identity, and the read-only access summary all derive from the one committed fixture. Draft edits stay in the editor; after a successful commit (or a fixture-backed reopen), all references agree. Access/matching are read-only: listed shows inclusive or exclusive, unlisted shows all-tags — with no editor. An invalid fixture shows one compact unavailable state with a reset/reload path and disables save and archive rather than fabricating defaults.
- **PO-004 — Confirm archival safely and accessibly (Approved with nuance):** An active owner with a clean draft opens a confirmation that names the committed conversation and warns records are retained. Focus moves into the dialog on open, is trapped with Tab/Shift+Tab wrapping, and is restored to the archive trigger on close via Keep active, the close control, Escape, or backdrop. Confirmation enters one pending state that prevents repeat activation; success flips local lifecycle to archived exactly once (setting `archivedAt`/`archivedById`) while retaining all records. A dirty draft blocks opening with an inline instruction; a local failure keeps the conversation active and offers retry/keep-active inside the dialog; a simulated stale permission change denies the action with no success claim.
- **PO-005 — Render an archived conversation as inactive (Approved with nuance):** After archival, or when the archived fixture loads, the page announces the archived state with retained records, keeps committed tags and access context visible for reference, and makes tag input, chip removal, Save, and the archive action unavailable. Archived state persists across reload via the local fixture store. No hard-delete, unarchive, inactivity-automation, or archived-discovery claim is made.
- **PO-006 — Enforce owner/administrator boundaries (Approved with nuance):** Both active owner and active administrator can maintain and save tags. Only an active owner sees an actionable archive control; an administrator sees an owner-only unavailable boundary with no route to the confirmation. Ordinary-member, role-none, and inactive-membership fixtures receive no governance controls (a limited-access panel is shown instead). A simulated stale role during save/archive denies the action, discards any unauthorized pending result, refreshes to the permitted state, and shows no success message.

## Files changed

- `docs/mockup/desktop/governance/settings.html` (only writable page file changed)

## Shared-asset impact

None. `assets/app.js` and `assets/styles.css` were read-only and unchanged. All new behavior is inline in the assigned HTML and reuses existing shared classes/helpers.

## Interaction checklist actually run (Playwright, Chrome channel, 1440×1000, no console/page errors)

- Save disabled on load; enables after a valid edit; count updates immediately.
- Valid simple tag and valid `key:value` tag both add as chips.
- Case-insensitive duplicate, multi-colon, and whitespace inputs rejected with specific messages, chips unchanged.
- 10-tag maximum enforced; 11th add blocked with max message; removal disabled at the single remaining tag.
- Clean archive: modal opens, focus lands inside, Shift+Tab wraps to the last control, backdrop/Escape dismiss and restore focus to the trigger.
- Dirty draft blocks archive open with inline instruction; dirty Cancel shows keep/discard; keep-editing returns focus to the editor.
- Save success enters pending (input disabled, "Saving…"), navigates to the conversation, and the committed tag set persists on reopen.
- Save failure retains the draft with a retry status; retry succeeds and navigates.
- Archive success flips to the archived inactive state (edit/archive controls unavailable) and persists across reload.
- Archive failure keeps the conversation active with an in-dialog retry; retry succeeds.
- Stale-permission simulations during save and archive deny the action and show no success.
- Scenario fixtures verified: owner (listed/exclusive), administrator (listed/inclusive, owner-only archive boundary, editor available), unlisted (all-tags read-only), archived (controls disabled), ordinary member (governance hidden), invalid (unavailable state, save/archive disabled).

## Manual checks

- Layout at 1440×1000 has no horizontal overflow; `app-shell` remains within the 1080px max width.
- Console and pageerror capture: none across all exercised states.
- Before screenshot: `docs/mockup/tasks/evidence/governance-settings-before.png`
- After screenshot: `docs/mockup/tasks/evidence/governance-settings-after.png`

## Difficulties and residual risks

- The archive trigger keeps the shared `data-modal-open` helper; a capture-phase guard on the button blocks opening when the draft is dirty or the viewer is not an authorized active owner, so the shared helper is reused without modification.
- The single-remaining-tag rule is enforced by not rendering that chip's remove control (a stronger no-op than an error message); this satisfies the approval QA ("removing the only remaining tag is blocked without removing it") while diverging slightly from the review's suggested inline one-tag message.
- Local persistence uses `sessionStorage` purely to demonstrate reopen/reload behavior for committed tags and archived lifecycle; it is explicitly not production durability and makes no network or authorization claims. Use "Reset demo state" to clear it.
- Open product questions (tag display casing, broader colon grammar, archived discovery/participant visibility, titles, unarchive, automatic archival) were deliberately left unresolved per the approval's YAGNI constraints.
