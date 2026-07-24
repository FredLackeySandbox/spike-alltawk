# UI Implementation Report: Create a Conversation

- **Assigned page:** `docs/mockup/desktop/hub/create.html`
- **Page slug:** `hub-create`
- **Role:** UI Developer
- **Review doc:** `docs/mockup/tasks/hub-create-review.md`
- **Approval doc (binding):** `docs/mockup/tasks/hub-create-approval.md`
- **Repository root:** `/Users/flackey/Source/Personal/FredLackeySandbox/spike-alltawk`

## Summary

All five approved Product Owner items were implemented page-locally inside the assigned
HTML only (inline `<style>` and inline `<script>`, reusing existing shared classes). No
shared asset was modified. The page now captures a stable draft snapshot on submit,
disables every editable control and competing navigation during the pending state,
provides deterministic local success / failure / timeout outcomes, carries the submitted
configuration forward to the workspace, and renders with zero remote requests.

## Per-PO implementation

### PO-001 — Build and validate the tag set (Approved with nuance)
- Kept the existing case-insensitive, lowercase-normalized commit flow on Enter, comma,
  blur, and submit; the documented grammar regex is unchanged
  (`^[a-z0-9]+(?:-[a-z0-9]+)*(?::[a-z0-9]+(?:-[a-z0-9]+)*)?$`) — Latin letters/numbers,
  hyphens only between non-empty segments, at most one colon. No grammar expansion, no
  Unicode, no suggestions, no ownership, no display-casing policy implied.
- Enforced 1–10 committed tags with specific adjacent inline feedback; invalid, duplicate,
  and over-limit attempts leave the committed set unchanged.
- Implemented the approved nuance: after a maximum-limit error with a value still typed,
  removing a chip now clears the over-limit error, restores capacity, and returns focus to
  the tag input so the user can **explicitly** recommit the pending value. Removal never
  auto-commits it.
- Associated the error region with the input via `aria-describedby`/`aria-invalid` and kept
  `role="alert"`; stale feedback clears after correction.

### PO-002 — Keep access and matching choices logically linked (Approved)
- Listed exposes the require-every-tag checkbox; Unlisted hides it and clears any checked
  value; returning to Listed reveals it unchecked. Captured mapping:
  `listed + unchecked -> {visibility: listed, matchingMode: inclusive}`,
  `listed + checked -> {visibility: listed, matchingMode: exclusive}`,
  `unlisted -> {visibility: unlisted, matchingMode: allTags}`. No other combination is retained.
- No unlisted-exclusive control, invitation, approval, permission, or post-creation editor added.

### PO-003 — Create from a stable draft with recoverable local outcomes (Approved with nuance)
- Submit visibly commits any valid waiting tag, validates the whole draft, then captures
  **one stable snapshot** (`{tags, visibility, matchingMode}`); later UI edits cannot change
  the result.
- During the brief pending state: tag input, all chip remove buttons, both access radios,
  the exclusive checkbox, the submit button, Cancel, and all private/brand navigation are
  disabled (anchors via `pointer-events`, `aria-disabled`, `tabindex=-1`, and a click guard).
  An accessible loading status (`role="status" aria-live="polite"`, "Creating conversation…")
  is announced. Double activation is ignored via a `pending` guard.
- Success builds one indivisible local fixture — active standard Conversation, 1–10 ordered
  active Conversation Tag associations, one active `owner` Membership, and one open owner
  Membership Role Period for Rowan Ellis — persists it to `sessionStorage`
  (`tawk.createdConversation`), shows success feedback, and opens the existing workspace
  (`../conversation/thread.html`) carrying the submitted tags/visibility/matching as query
  params. Handoff reflects the captured snapshot, not stale UI.
- Deterministic local failure (`?outcome=fail`) and timeout (`?outcome=timeout`) preserve the
  full draft, restore all controls, show a form-level danger notice, relabel the button
  "Try again", create no fixture, and permit retry; a successful retry yields exactly one
  result. Default (no param) is success. Outcome selection is URL-only — no visible dev control.

### PO-004 — Cancel without producing hidden state (Approved)
- Cancel remains a direct link to `hub/index.html` with no confirmation modal and no draft
  persistence. Pointer and keyboard behave identically (native anchor). Cancel and other
  competing navigation are suppressed while a creation attempt is pending so they cannot race
  the success handoff. Reopening starts from the defined static example.

### PO-005 — Keep the mockup fully local and network-independent (Approved)
- The shared `assets/styles.css` (LOCKED) begins with a remote Google Fonts `@import`, the
  only third-party dependency the PO observed. Because the shared asset cannot be edited and
  a page-local fix exists, I did **not** need an exclusive shared-asset lane. Instead the page
  now inlines the shared design system's rules page-locally (a copy of `styles.css` **minus**
  the remote `@import`) and drops the external `<link>`. A defense-in-depth CSP `<meta>`
  (`connect-src 'none'`, `font-src file:`, `style-src 'unsafe-inline' file:`, etc.) blocks any
  accidental remote fetch.
- Result: Playwright records **zero** remote requests when loading the page (verified). All
  identity, draft, validation, simulated-outcome, and created-conversation state stays local.
  Typography degrades gracefully to the system stack; layout, color tokens, and behavior are
  unchanged.

## Files changed

- `docs/mockup/desktop/hub/create.html` — inline CSS (self-contained design system, no remote
  `@import`), added CSP meta, and rewrote the inline script to add snapshot capture, full
  control/navigation locking during pending, accessible loading status, deterministic
  success/failure/timeout outcomes, local owner-first fixture + sessionStorage/query handoff,
  double-submit guard, and the PO-001 remove-restores-capacity focus nuance.

No other files were edited. `assets/styles.css` and `assets/app.js` were read only and left
unchanged; `window.showToast`, the modal, and dropdown helpers were left intact (not needed
on this page, and none removed).

## Manual / automated checks run (Playwright, Chrome channel, headless, 1440×1000)

Interaction checklist actually exercised:
- Base render: page loads with **0 remote requests**; count shows 2/10.
- PO-001: valid simple + `Neighborhood:Arts` key/value commit and normalize to lowercase,
  count updates; `bad tag` rejected with format feedback, count unchanged; `ATLANTA` rejected
  as case-insensitive duplicate; filled to 10, 11th (`eleventh`) rejected with max feedback,
  count stays 10 and value remains typed; removing a chip -> count 9, error cleared, focus
  returned to input, `eleventh` still typed and **not** auto-added; explicit Enter recommits
  -> count back to 10; remove all -> count 0, minimum error; submit with 0 tags keeps page and
  focuses input.
- PO-002: check exclusive -> switch Unlisted (control hidden, value cleared) -> switch Listed
  (control visible, unchecked).
- PO-003 success (listed/inclusive): pending shows status, input/radio/create disabled, Cancel
  `aria-disabled=true`; navigates to `thread.html?created=1&visibility=listed&matching=inclusive&tags=…`;
  sessionStorage fixture has owner Rowan Ellis, correct visibility/matching, ordered active tags,
  active owner membership + open owner role period.
- PO-003 failure (`?outcome=fail`): no navigation, no sessionStorage, draft intact, controls
  re-enabled, button "Try again"; subsequent success run navigates (retry yields one result).
- PO-003 timeout (`?outcome=timeout`): recovers with form-level error, no navigation.
- PO-003 unlisted success: navigates with `visibility=unlisted&matching=allTags` (no exclusive retained).
- Console/pageerror: **no JS errors** across all runs.
- Layout: 720px form readable at 1440×1000, no horizontal overflow; visual parity with the
  pre-change design confirmed (only typography falls back to system fonts by design).

## Evidence

- Before: `docs/mockup/tasks/evidence/hub-create-before.png`
- After: `docs/mockup/tasks/evidence/hub-create-after.png`

## Shared-asset impact

None. `assets/styles.css` and `assets/app.js` were not modified. The design system rules were
inlined page-locally (a per-page copy) purely to satisfy PO-005's zero-remote-request contract
without editing the locked shared file. Sibling pages are unaffected.

## Difficulties and residual risks

- **`@import` semicolon trap (fixed):** the Google Fonts URL contains semicolons, so a naive
  `@import` strip left a garbage CSS fragment that silently broke the `:root{}` custom-property
  block (colors rendered transparent). Corrected by removing the full `@import url(...);`
  statement and re-verified computed styles (`--primary`, brand, button, chips, nav all correct).
- **Inlined stylesheet divergence:** this page now carries its own copy of the shared design
  tokens/components. If `assets/styles.css` is later restyled, this page will not inherit the
  change automatically and would need a re-sync. This is the accepted cost of meeting PO-005's
  strict "zero remote font requests" QA while `styles.css` remains locked.
- **Downstream page fonts:** navigating to `../conversation/thread.html` still triggers that
  page's own Google Fonts request via the unchanged shared stylesheet; that is out of this
  page's scope. `create.html` itself makes zero remote requests.
- **Workspace consumption of handoff:** the carried tags/visibility/matching (query params +
  sessionStorage) are produced by this page but not rendered by the static `thread.html`
  (out of scope). The carry-forward is demonstrable via URL and sessionStorage evidence.
