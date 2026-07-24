# UI Implementation Report: Members and Roles

- **Assigned page:** `docs/mockup/desktop/governance/members.html`
- **Page slug:** `governance-members`
- **Review doc:** `governance-members-review.md`
- **Approval doc:** `governance-members-approval.md`
- **Result:** PASS

## Per-PO status summary

### PO-001 Load and filter an authoritative role-aware roster — IMPLEMENTED
- Added a brief (~450ms) local loading state (`#rosterLoading` spinner) before the roster is revealed.
- Active/Former counts are now derived from a single roster state via `recount()` (counts live rows by `data-state`), and are recomputed after every mutation so rows and counts stay in sync.
- Filtering (`showFilter`) toggles only visible rows and pressed state; the existing empty-state panel (`#emptyFilter`) now shows when a filter has zero rows.
- Role-aware handling via invisible QA hooks: `?fixture=member` renders a permission-denied panel (roster + actions hidden, link back to the conversation); `?fixture=admin` relabels the actor badge and strips owner-changing controls; `?fixture=fail` shows a restrained error with Retry; `?fixture=empty-active` / `empty-former` demonstrate the empty state and zero count. No visible debug/fixture panel was added.

### PO-002 Promote permitted roles and recompute ownership safeguards — IMPLEMENTED
- Promotion now routes through a named-consequence confirmation dialog (was previously instant).
- Confirm updates the role badge, closes the dialog, shows success feedback, removes obsolete promotion choices (owner promotion clears the row's destructive menu; administrator promotion removes the redundant promote-to-administrator option), and recomputes owner continuity (`recomputeOwners`).
- Owner-continuity: exactly one active owner shows "Protected" and the named ownership notice (with an archive link to `settings.html`); once a second owner exists the notice hides and owner rows show a neutral placeholder. Verified: promoting Avery to owner hides the notice and clears Rowan's "last active owner / Protected" label.
- Administrator fixture exposes no owner-changing control.

### PO-003 Remove a participant while retaining membership history — IMPLEMENTED
- Remove uses a confirmation explaining that participation ends while membership/authored content is retained.
- Confirm marks the row Former/Removed, drops `currentRole` display to Member (retained role context), decrements Active / increments Former together, switches to the Former view, and shows a toast. Removed rows retain a Ban action.
- Owner rows have no removal path (last owner is Protected; owners carry no destructive menu). Verified counts 5/2 -> 4/3 on removal.

### PO-004 Ban and restore an identity without automatic rejoining — IMPLEMENTED
- Ban confirmation distinguishes the stronger rejoin restriction. Banning an active member updates counts; banning an already-removed former row (Ellis Romero now carries a Ban action) leaves counts unchanged.
- A local rejoin-eligibility ledger (`bannedSet`) plus `window.__canRejoin(name)` denies banned identities and allows unbanned ones (QA-checkable, no service).
- Unban restores eligibility only: the identity stays Former, is not added to Active, and regains a Ban action.

### PO-005 Apply, change, and end a time-bounded posting suspension — IMPLEMENTED
- Suspend form names the participant, states reading remains available, and requires a complete end date/time later than `Date.now()` (blank and past values keep the dialog open with an inline error and focus the first invalid field).
- Apply shows a busy/disabled state (~550ms) then updates the access badge, exact end time, menu label, and toast together; cancelling mid-busy aborts the pending mutation.
- Change preloads the row's stored suspension (`data-suspend-end`). An "End suspension now" action restores Active/full participation. Expired suspensions auto-resolve to Active on load (`resolveExpiredSuspensions`; `?fixture=expired` demonstrates it).

### PO-006 Complete or cancel governance dialogs safely — IMPLEMENTED
- Opening any dialog moves focus to its heading, traps Tab focus within the dialog, and sets `inert` on the app shell to block background operation.
- All close paths (Cancel, close control, Escape, backdrop, confirm) are handled by a MutationObserver on each modal's `aria-hidden`, which restores focus and clears `inert`. Plain cancel returns focus to the originating row control; a confirmed mutation moves focus to the active filter button (stable roster control). Verified focus returns to the row menu button on Escape with no mutation.
- Confirm buttons disable on submit to prevent a second transition.

### PO-007 Keep the page functional without third-party services — IMPLEMENTED (with residual note)
- All behavior is fixture-backed / in-page: loading, mutations, busy, success, deliberate local failure (`?fixture=fail`), permission denial (`?fixture=member`), retry, cancellation. No page-purpose action issues a network request. Reload restores the five-active/two-former baseline (Retry navigates to the clean path).
- Typography degrades gracefully offline: `styles.css` font stacks already fall back to `system-ui, sans-serif`. See residual risks re: the Google Fonts `@import`.

## Files changed
- `docs/mockup/desktop/governance/members.html` (inline `<style>` additions: loading/error/denied/spinner/busy classes; markup: loading + error + denied panels, `data-suspend-end` on Patchwork, "End suspension now" menu item, Ban action on the removed former row, `tabindex="-1"` on modal headings; full rewrite of the page-local inline `<script>`).

No shared assets were modified (`assets/app.js`, `assets/styles.css` untouched). Only `window.showToast` and the existing modal/dropdown data hooks in app.js are reused.

## Manual checks
- Default owner render: loading resolves, counts 5/2, layout matches original (see after screenshot).
- Filter toggle Active/Former updates rows, pressed state, and empty panel.
- Promotion, removal, ban, unban, suspension (apply/change/end), and validation all behave per approval.
- Keyboard: dialog focus enters heading, Escape restores focus to the trigger with no mutation.

## Screenshots
- Before: `docs/mockup/tasks/evidence/governance-members-before.png`
- After: `docs/mockup/tasks/evidence/governance-members-after.png`

## Playwright interaction checklist (actually run, 1440x1000, headless Chrome)
- Load: loading hidden after boot; counts 5/2. PASS
- Filter to Former shows 2 rows; back to Active. PASS
- Promote Avery to owner: confirm dialog title, focus in dialog (`#actionTitle`), role -> Owner, owner notice hidden, Rowan cell -> neutral. PASS
- Remove Noor: confirm, counts 4/3, row Former, switched to Former view, row visible. PASS
- Ban Maya (active): Former, `__canRejoin` false, Active count 5 -> 4. PASS
- Ban Ellis (removed former): Former count unchanged. PASS
- Unban Release Notes Bot: eligible true, stays Former. PASS
- Suspension change on Patchwork: prefill 2026-07-24/09:00; past date -> inline error; valid future -> "Until Aug 15, 2026 · 2:30 PM ET"; End suspension -> Active. PASS
- Suspend blank date -> "Choose an end date." PASS
- Escape on open remove dialog: focus returns to Maya menu button, Maya still active. PASS
- Fixtures: `member` denied panel + table hidden; `fail` error visible; `admin` badge + 0 promote-owner buttons; `empty-active` count 0 + empty panel; `expired` Patchwork resolves to Active. PASS
- Console/pageerror across all flows: NONE.

## Shared-asset impact
None. All approved behavior implemented page-locally.

## Difficulties / compromises
- Owner-on-owner removal is intentionally not surfaced: owner rows carry no destructive menu (last owner is Protected; additional owners show a neutral placeholder). This satisfies "admin cannot remove an owner" and "last owner has no removal path" and avoids any ownerless path, while staying within YAGNI (no demotion workflow). Owner management remains promotion-only, matching the existing Rowan treatment.
- Fixture variants are exposed only through `?fixture=` query params (no visible control), per the constraint to keep test-state selection out of the product surface.

## Residual risks
- The Google Fonts `@import` lives in the locked shared `assets/styles.css`, which is out of my write scope. When HTTP/HTTPS is blocked the page still renders legibly via the existing `system-ui, sans-serif` fallbacks, so PO-007's offline-legibility and no-page-purpose-request requirements hold; however the passive font `@import` request itself can only be removed by editing the shared stylesheet (would require an exclusive lane). Flagged, not blocking.
