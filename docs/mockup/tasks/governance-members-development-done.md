# Development-Done Report: Members and Roles

- **Page:** `docs/mockup/desktop/governance/members.html`
- **Page slug:** `governance-members`
- **Review role:** Peer Developer Reviewer
- **Final status:** DONE (no residual risks)

## Files reviewed

- `docs/mockup/tasks/governance-members-review.md` (Product Owner review — context)
- `docs/mockup/tasks/governance-members-approval.md` (Architect approval — binding)
- `docs/mockup/tasks/governance-members-implementation.md` (UI Developer report — read only)
- `docs/mockup/desktop/governance/members.html` (assigned page)
- `docs/mockup/desktop/assets/app.js` (shared, read only)
- `docs/mockup/desktop/assets/styles.css` (shared, read only)

## Peer verification per PO-###

- **PO-001 (Approved with nuance) — VERIFIED.** Brief local loading state resolves; Active/Former counts (5/2) are derived from a single roster state and equal rendered rows. Filtering toggles only visibility and `aria-pressed`, no membership change. Empty state shows on zero-row filters. Ordinary-member fixture denies the whole governance surface (roster + actions hidden, "Back to conversation" link) — no reduced roster leaks former identities. No org-wide/remote/member-facing variant added.
- **PO-002 (Approved) — VERIFIED.** Promotion routes through a named-consequence confirmation. Confirm updates the role badge, closes the dialog, toasts success, removes obsolete actions, and recomputes owner continuity: promoting Avery to owner hides the ownership notice and clears both Rowan's and Avery's "Protected" label (both become neutral "—"), and the newly-promoted owner row carries no destructive menu. Admin fixture exposes zero owner-changing controls. Archive alternative links to `settings.html` (Tags & lifecycle). No generic role editor / demotion / bulk change / real auth introduced.
- **PO-003 (Approved) — VERIFIED.** Remove uses a retained-history confirmation. Confirm marks the row Former/Removed, drops role display to Member (retained context), moves counts together (5/2 -> 4/3), switches to Former view with the row visible, toasts, and leaves a Ban action. Owner rows have no removal path (last owner Protected; extra owners neutral). No hard deletion.
- **PO-004 (Approved with nuance) — VERIFIED.** Ban of an active member -> Banned, count 5->4, `window.__canRejoin` returns false. Ban of an already-removed former (Ellis Romero) -> Banned with former count unchanged. Unban -> "Eligible", identity stays Former (data-state=former), not added to Active, `__canRejoin` true, regains a Ban action. Admin fixture never targets an owner. No auto-rejoin/invitation/real join service.
- **PO-005 (Approved) — VERIFIED.** Suspend form names participant, states reading remains available, requires a future end date/time. Change preloads the row's stored end (2026-07-24/09:00). Past value -> inline "later than now" error, modal stays open; blank date -> "Choose an end date." Valid future applies via a busy state and updates badge/copy/menu label/toast together ("Until Aug 15, 2026 · 2:30 PM ET"). "End suspension now" restores Active. `?fixture=expired` auto-resolves Patchwork to Active on load. No indefinite suspension/notifications/real service.
- **PO-006 (Approved) — VERIFIED.** Opening a dialog moves focus to its heading and traps Tab within the modal; the app shell gets `inert` to block background operation (modals sit outside `.app-shell`, so they remain operable). All close paths set `aria-hidden="true"` (app.js handles Cancel/close/backdrop/Escape), driving a MutationObserver that clears `inert` and restores focus. Escape leaves the target unmutated and returns focus to the originating row trigger. Confirm disables to prevent a second transition — a triple-click applied the mutation exactly once (former stayed 3). After a row-removing mutation, focus lands on the active filter button (stable control).
- **PO-007 (Approved with nuance) — VERIFIED.** All flows are fixture-backed / in-page. Playwright recorded **zero external requests** and **zero console/page errors** across every flow and all fixtures. `styles.css` is globally clean (no `@import`, no `http`/font URL) and renders in system-ui fallbacks — the implementation report's flagged Google Fonts residual risk is now moot (the remote `@import` was removed under the completed exclusive lane). Reload restores the five-active/two-former baseline; Retry navigates to the clean path.

Nothing rejected was implemented. No out-of-scope surface (bulk actions, invitations, permissions matrix, demotion, audit views, new pages, real API/auth) was introduced.

## Corrections made by this reviewer

None. The implementation matched the approval on every point exercised; no concrete in-scope defect was found. The assigned HTML was not modified.

## Files changed

- By UI Developer: `docs/mockup/desktop/governance/members.html` (inline `<style>` + markup panels/data hooks + full page-local `<script>` rewrite).
- By Peer Reviewer: none (no corrections required).
- Shared assets (`assets/app.js`, `assets/styles.css`): untouched by both agents; verified LOCKED and read-only.

## Screenshots

- Peer-review: `docs/mockup/tasks/evidence/governance-members-peer-review.png`
- Final: `docs/mockup/tasks/evidence/governance-members-final.png` (identical to peer-review; no corrections applied)

## Interaction checklist (Playwright, 1440x1000, headless Chrome — 30/30 PASS)

- Load: loading hidden; counts 5/2; active visible rows == 5. PASS
- Filter to Former: 2 rows + `aria-pressed=true`; back to Active. PASS
- Promote Avery to owner: dialog title + focus in heading; role -> Owner; notice hidden; Avery + Rowan cells neutral "—"; focus -> filter. PASS
- Remove Noor: retained-history copy; counts 4/3; Removed + Former view + visible + Ban action. PASS
- Ban active Maya: Banned; count 5->4; `__canRejoin` false. PASS
- Ban removed-former Ellis: Banned; former count unchanged. PASS
- Unban Release Notes Bot: Eligible; stays Former; `__canRejoin` true. PASS
- Suspension change Patchwork: prefill 2026-07-24/09:00; past date inline error + modal open; valid future -> "Until Aug 15, 2026 · 2:30 PM ET"; blank date error; End suspension -> Active. PASS
- Dialog: focus trapped in modal; Escape no-mutation + focus to trigger; triple-click double-submit applies once. PASS
- Fixtures: member (denied panel + table hidden); fail (error + retry); admin (badge + 0 promote-owner); empty-active (count 0 + empty panel); empty-former (count 0 + empty panel); expired (Patchwork -> Active). PASS

## Console and link findings

- Console errors: 0. Page errors: 0. (Across all flows and all six fixtures.)
- External (non-`file://`, non-`data:`) requests: 0.
- Navigation targets consistent with the plan: breadcrumb -> `../conversation/thread.html`; Tags & lifecycle -> `settings.html`; Review reports -> `../moderation/index.html`; ownership-notice archive alternative -> `settings.html`; shared nav retains hub/find/create.

## Shared-asset verification

- `assets/styles.css`: read-only; globally clean of remote font `@import` and any `http(s)` URL; system-ui fallbacks render correctly. Not modified.
- `assets/app.js`: read-only; only `window.showToast` and existing modal/dropdown `aria-hidden` hooks are reused. Not modified.
- No shared-asset edit was needed; no exclusive-lane block was triggered.

## Scope-drift check

No scope drift. All PO-### IDs preserved. Changes are confined to the assigned page. No new features, redesign, rejected items, org-wide administration, or external dependencies. Fixture variants remain invisible `?fixture=` QA hooks (no visible debug panel), consistent with the "keep test-state selection out of the product surface" constraint.

## Final status

**DONE** — no residual risks. All seven PO items implemented as approved/constrained; 30/30 Playwright checks pass; zero external requests; zero console/page errors; shared assets untouched and verified clean.
