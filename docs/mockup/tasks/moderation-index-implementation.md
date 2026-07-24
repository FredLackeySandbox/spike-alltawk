# UI Implementation Report: Reported Messages

- **Assigned page:** `docs/mockup/desktop/moderation/index.html`
- **Page slug:** `moderation-index`
- **Role:** UI Developer
- **Review doc:** `docs/mockup/tasks/moderation-index-review.md`
- **Approval doc (binding):** `docs/mockup/tasks/moderation-index-approval.md`
- **Result:** PASS

## Summary

The report queue was rebuilt from static rows into a fixture-driven, state-aware
selection surface that keeps its original purpose, structure, and visual identity.
All six approved recommendations were implemented page-locally (inline `<script>`,
inline `<style>`, and existing shared classes). No shared asset was edited; the
Google Fonts network dependency was neutralized within this page only.

## Per-recommendation implementation

- **PO-001 (Approved with nuance) — Enforce governed-conversation scope.**
  Authorization is derived from local `SESSION` + `CONVERSATIONS` fixtures. A
  conversation is "governed" only when the signed-in identity (Rowan Ellis) holds
  an **active** membership with role `owner` or `administrator`; a member-only
  conversation (`#film-photography`) and its report (`#1031`) exist in the fixtures
  but are never authorized, so they never render. The filter options and rendered
  rows are built exclusively from governed conversations, so no protected ticket
  number, reporter, reason, or tag from an unauthorized conversation ever enters a
  rendered element or control. A no-governed-conversation run (`?scenario=denied`)
  shows a concise, non-disclosing "No reports available to review" panel with a
  safe exit to `../hub/index.html`. No identities, memberships, tickets, or
  conversations are mutated. No sign-in page or real authorization flow was added
  (identified-session assumption preserved).

- **PO-002 (Approved) — Loading, empty, failure, retry states.**
  The queue renders a restrained loading state first; the filter, live count, and
  all report-opening actions are absent until data is ready (rows are only built in
  the ready state). Populated success shows the table + derived count; empty success
  shows a distinct empty outcome (no misleading shell); a recoverable failure shows a
  concise error + Retry. Retry returns visibly to loading and then resolves to the
  configured success/empty/failure result. `?scenario=failure` resolves to success
  on retry; `?scenario=failure-persist` keeps the error visible with Retry after a
  second failure. Loading/error flags are transient in-page state; nothing creates,
  changes, resolves, or removes a ticket.

- **PO-003 (Approved) — Filter with genuine zero-result state.**
  The selector contains only governed conversations plus "All governed conversations".
  Selecting a conversation immediately filters rows, updates the live count with
  correct `0 reports` / `1 report` / plural wording, preserves the selection for the
  visit, and shows a conversation-specific empty outcome distinct from the load
  failure. Selecting All restores all authorized reports. One added authorized
  conversation with no reports (`#book-club · #atlanta`) exercises the zero-result
  path. A stale/unauthorized selected value safely resets to All. No saved filters,
  search, sorting, pagination, or persistence were added.

- **PO-004 (Approved with nuance) — Open the exact selected report.**
  Both the ticket-number link and the Review action in a row carry the same distinct
  reference to the existing detail route:
  `ticket.html?ticket=<ticketNumber>&conversation=<id>`. Each row targets its own
  ticket (`#1048`→design, `#1046`→garden, `#1042`→transit); no generic default. The
  human-readable `ticketNumber` is used for display; no internal record id is exposed.
  Rendering the selected ticket and unavailable-detail handling remain the separately
  governed `moderation/ticket.html` concern and were **not** modified here.

- **PO-005 (Approved with nuance) — Coherent entry/breadcrumb/filter/return.**
  A valid conversation origin (`?origin=design|garden|transit|books`) preselects that
  conversation and sets the breadcrumb + footer return to it. Entry from shared
  navigation (no origin / `?origin=reports`) starts at All with a broader
  "Conversations" breadcrumb and a "Back to conversations" return to `../hub/index.html`.
  Changing the filter updates the breadcrumb label and the return destination so they
  never contradict the queue scope (specific conversation → `../conversation/thread.html`,
  "Return to conversation"). A stale/unauthorized origin (`?origin=photo`) falls back
  to All without naming the former conversation. Native Back is unchanged; navigation
  stays within the existing hub/conversation/governance/moderation pages.

- **PO-006 (Approved) — Fully local rendering.**
  The shared stylesheet's `@import` of Google Fonts was the only external dependency
  (confirmed: 3 requests to `fonts.googleapis.com` / `fonts.gstatic.com` before). The
  shared `assets/styles.css` is locked, so it was **inlined into this page minus the
  `@import` line** (an inline `<style>` block); the shared file was not touched and
  other pages keep their `<link>`. Typography falls back to the `system-ui` stack
  already declared in the CSS. After the change, Playwright records **0** `http(s)`
  requests across every state, and the page stays fully readable and interactive.

## Files changed

- `docs/mockup/desktop/moderation/index.html` (only writable page code touched)

Shared assets `assets/app.js` and `assets/styles.css` were **not** modified
(`window.showToast`, modal, dropdown helpers left intact and unused here, matching
the review's "no modal/confirmation on this selection queue" guidance).

## Deterministic local scenarios (for QA)

Driven by URL query params; all local, no backend:

- `?scenario=populated` (default) — loading → 3 reports across 4 governed conversations.
- `?scenario=loading` — holds in the loading state for inspection.
- `?scenario=empty` — governed conversation with zero reports → queue-level empty outcome.
- `?scenario=failure` — error → Retry → success.
- `?scenario=failure-persist` — error → Retry → error again (persistent Retry).
- `?scenario=mixed` — only one admin-scoped conversation authorized.
- `?scenario=denied` — no governed conversations → non-disclosing denied panel.
- `?origin=design|garden|transit|books` — conversation-origin preselect + return context.
- `?origin=reports` / absent — shared-navigation All view + hub return.
- `?origin=photo` (member-only) — stale/unauthorized origin → safe All fallback.

## Manual / Playwright checks actually run (1440 × 1000, headless Chrome)

- Default load: loading state visible, then ready; count `3 reports`, 3 rows;
  row links `ticket=1048/1046/1042`; member-only `#1031` never in rendered rows;
  0 external requests; 0 console errors; 0 page errors.
- Filter (pointer + keyboard `selectOption`): design/garden/transit each → `1 report`,
  correct crumb + "Return to conversation" → thread; books → `0 reports` + "There are
  no reports in this conversation."; All → `3 reports`, "Conversations" crumb + "Back
  to conversations" → hub.
- `?scenario=loading` → loading visible, filter/count hidden.
- `?scenario=empty` → ready, `0 reports`, "There are no reports to review right now.",
  options limited to All + books.
- `?scenario=failure` → error visible → Retry → loading → ready `3 reports`.
- `?scenario=failure-persist` → error → Retry → error again.
- `?scenario=denied` → denied panel visible, 0 report rows rendered, exit → hub.
- `?scenario=mixed` → only garden option + row.
- `?origin=garden` → preselected garden, crumb = garden tags, return = thread.
- `?origin=photo` (stale) → resets to All, "Conversations" crumb, photo absent from options.
- Tools/count/case-actions hidden in loading/error/denied, shown only in ready.
- No horizontal/vertical overflow at 1440 × 1000.

## Interaction checklist

- [x] Every control has a working state/nav/no-op: filter (live filter + count),
      Retry (loading→resolve), row ticket links + Review (carry distinct reference),
      breadcrumb + return links (resolve to existing relative files), denied exit.
- [x] Links resolve to existing files (`ticket.html`, `../conversation/thread.html`,
      `../hub/index.html`, `../governance/*.html`).
- [x] Loading/empty/failure/retry/denied states exercisable and distinct.
- [x] No modal/confirmation added (correct for a read-only selection queue).
- [x] PO-### IDs preserved as inline comments in markup and script.

## Shared-asset impact

None. No shared file was edited. The Google Fonts dependency was eliminated
page-locally by inlining `styles.css` (minus its `@import`) into this page's own
markup, per the task's PO-006/network directive. No shared-asset blocker was needed.

## Difficulties / residual risks

- **Author rule vs `hidden` attribute:** `.queue-tools { display: flex }` overrode the
  UA `[hidden]` rule, leaving the filter/count visible during loading. Fixed with a
  page-local `[hidden] { display: none !important; }` guard; re-verified across states.
- **Inline fixtures in page source:** Because the mockup has no backend, all scenario
  fixtures (including the excluded member-only report) live in the page's inline
  `<script>`. That text appears in raw `page.content()` source, but it never enters the
  rendered DOM, the accessibility tree, or any control — the denied/mixed runs render
  zero report rows and expose no conversation names. This is an inherent property of a
  backend-less local mockup and is consistent with the approval's sanctioned
  "deterministic local scenarios."
- **Single thread page:** The mockup has one `conversation/thread.html`, so every
  conversation-scoped return resolves there; the label/scope is conveyed by the
  breadcrumb. No new pages or routing model were introduced (per PO-005 constraints).

## Screenshots

- Before: `docs/mockup/tasks/evidence/moderation-index-before.png`
- After: `docs/mockup/tasks/evidence/moderation-index-after.png`
