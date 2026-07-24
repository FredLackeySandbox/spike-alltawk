# Implementation Report: Find a Conversation

- **Assigned page:** `docs/mockup/desktop/hub/find.html`
- **Page slug:** `hub-find`
- **Review doc:** `docs/mockup/tasks/hub-find-review.md`
- **Approval doc:** `docs/mockup/tasks/hub-find-approval.md`
- **Result:** PASS

All work is page-local (inline `<style>` / `<script>` and existing shared classes only). Shared assets `assets/styles.css` and `assets/app.js` were not modified. `window.showToast` / modal / dropdown behaviors were left untouched (this page does not require them). All discovery, matching, eligibility, timing, failure, retry, and membership behavior is local and fixture-backed — no API, backend, auth, or third-party call.

## Per-PO implementation

- **PO-001 — Build and validate the tag query (Approved with nuance):** Suggestions are now a live type-ahead over an eligible-listed-tag fixture only: typing filters the visible suggestions by case-insensitive substring (prefix matches sorted first) without committing anything or recomputing results; already-selected tags are removed from the suggestion surface. Committing via Enter/comma/blur or clicking a suggestion adds one removable chip, updates the count, clears the input and prior error, keeps focus in the field, and refreshes only the active mode. Comparison/normalization is lowercase; the mockup does not assert a display-casing or fuzzy-ranking policy. Whitespace, malformed simple/`key:value` input, case-varied duplicates, and an 11th unique tag all leave the committed query intact and show a field-associated `role="alert"` error (`aria-invalid` toggled on the input). Help text now names the supported single `key:value` form. In Known-unlisted mode no suggestion nodes exist in the DOM.

- **PO-002 — Switch discovery modes without crossing the privacy boundary (Approved):** Mode buttons carry `aria-pressed`; switching toggles `hidden` + `aria-hidden` on the two result regions, clears the suggestion nodes entirely in unlisted mode, recomputes the result region from the existing chips, and updates copy/placeholder. Committed chips are preserved across modes but never surface as suggestions or disclose their origin. Rapid switching routes through a single `setMode()` that supersedes prior evaluations via the eval token, so only the final mode's state is announced.

- **PO-003 — Show current listed matches and resilient search states (Approved with nuance):** Every committed-query change now shows a local "Evaluating listed matches…" spinner state, then renders only the latest query's results via an incrementing `evalToken` (stale async evaluations are discarded). Inclusive fixtures match on one overlapping tag; the exclusive fixture (`accessibility`+`research`) appears only when all its tags are present and disappears when a required tag is removed. Each card shows its tag combination, restrained participant/activity context, matching rule, and one Join. Instruction (no chips), no-results, local failure, and Retry states are all present. Extra-tag semantics are deliberately not decided. Failure is reproducible with the sentinel tag `flaky`.

- **PO-004 — Join an eligible listed conversation locally (Approved with nuance):** Join is now a button (not a raw link). Activating it disables that card's action with an in-progress "Joining…" spinner and blocks duplicate submits (`joinBusy`). Eligible success writes a local `Membership` (`sessionStorage tawk.membership` = `{currentStatus:'active', currentRole:'member'}`) immediately before navigating to `../conversation/thread.html`. A banned fixture (`c4` = `local-gardening`/`atlanta`/`pollinators`) stays on the page with a concise "Not eligible to join" and no membership change. A flaky fixture (`c5` = `nodejs`/`api-design`) fails once with an inline Retry that then succeeds. The attempt is bound to the query's eval token, so a chip/mode change during progress cancels it and cannot navigate or mutate membership. No confirmation modal, approval queue, or invitation was added; rejoin rules for `left`/`removed` are not inferred.

- **PO-005 — Progressively identify a known unlisted match without disclosure (Approved with nuance):** Known-unlisted mode moves among a no-input instruction, a privacy-safe possible-match count, and a single complete-unique-match state, all derived from a hidden fixture whose identifying values never enter rendered markup. Join stays disabled until the committed tags complete exactly one hidden combination; removing any required tag immediately revokes readiness. Counts disclose only a number ("N hidden conversations may match"). Evaluations show a privacy-neutral "Checking known combination…" state and are token-guarded so stale/failed evaluations never retain a prior count. Exact-set-vs-superset semantics are not encoded as policy; only explicit combinations are demonstrated.

- **PO-006 — Complete or deny a hidden join safely (Approved with nuance):** The hidden-join button disables and shows privacy-neutral progress on activation. Eligible success (`release-triage`+`incident-ops`) writes local active-member membership then navigates. The banned combination (`night-shift-support`+`incident-ops`) keeps Join unavailable (disabled) with a concise denial that exposes no hidden identity, tags, membership, or ban rationale. A flaky eligible combination (`payroll-sync`+`finance-ops`) fails once with a privacy-neutral Retry that then succeeds. Editing chips during progress cancels the attempt via the eval token so there is no stale navigation or leak.

- **PO-007 — Leave discovery through clear secondary paths (Approved):** "Back to conversations" → `index.html` and "Create instead" → `create.html` remain quiet secondary links needing no confirmation. Both carry a `data-leave` handler that cancels any pending local search/join before navigating (page unload discards local state regardless); no membership/conversation is created and no query is transferred into creation.

## Files changed

- `docs/mockup/desktop/hub/find.html` (only file modified)

## Shared-asset impact

None. `assets/styles.css` and `assets/app.js` were read-only; no shared class, `showToast`, modal, or dropdown behavior was changed.

## Local fixtures / sentinels used (documented for QA)

- Eligible listed suggestion pool (listed-only tags); listed catalog `c1`–`c5` proving inclusive, exclusive, eligible, banned (`c4`), and flaky-join (`c5`) outcomes.
- Hidden combinations proving partial count, unique-complete eligible (`release-triage`+`incident-ops`), flaky-join eligible (`payroll-sync`+`finance-ops`), and banned (`night-shift-support`+`incident-ops`) — none expose identifying values.
- Sentinel tag `flaky`: forces one local *search* failure (listed or unlisted) with Retry, then succeeds. Not part of any real combination.

## Interaction checklist actually run (Playwright, Chrome channel, 1440×1000)

- PO-001: `acc` type-ahead narrows suggestions to `accessibility` while committed results stay unchanged; clicking it adds a chip + updates count; case-varied duplicate (`Accessibility`), malformed (`-bad-`), whitespace (`a b`), and 11th tag rejected with error and chips intact; `team:design` key/value accepted; count caps at 10.
- PO-002: switching to Known-unlisted hides listed results (`aria-hidden=true`) and suggestions, keeps chips; typing a private-only tag yields 0 suggestion nodes; switching back restores listed fixtures; `aria-pressed` correct.
- PO-003: loading state observed; inclusive match on one tag; exclusive `c3` appears only with both tags and disappears when one is removed; no-results state; `flaky` failure + Retry; chip change mid-load renders only the latest query (no stale card).
- PO-004: eligible Join shows disabled progress, sets membership, navigates to `conversation/thread.html`; banned `c4` stays on page with "Not eligible to join" and null membership; flaky `c5` fails then Retry navigates.
- PO-005: no-chip instruction (no count); `incident-ops` → "2 hidden conversations may match" with Join disabled; complete eligible combo enables Join; removing a required tag revokes readiness; banned combo shows denial with disabled Join.
- PO-006: hidden Join shows disabled progress, sets membership, navigates; flaky hidden combo fails then Retry navigates.
- PO-007: Back exit → `hub/index.html`, Create exit → `hub/create.html`, membership stays null.
- Console/pageerror: zero errors across all runs; no horizontal page overflow at 1440×1000.

## Evidence

- Before: `docs/mockup/tasks/evidence/hub-find-before.png`
- After: `docs/mockup/tasks/evidence/hub-find-after.png`

## Difficulties / residual risks

- Search/join failures are demonstrated with the local sentinel tag `flaky` and specific fixture combinations rather than random timing, so behavior is deterministic and QA-reproducible; this is a mockup convenience, not a product rule.
- The unlisted complete-match check is subset-based (all required tags present). As the approval requires, no copy or logic asserts whether extra submitted tags are permitted or disqualifying; only explicit combinations are exercised. The open extra-tag and former-member rejoin questions remain unresolved by design.
- Membership is simulated via `sessionStorage`/in-page state purely to make the local transition inspectable before navigation; there is no persistence layer or backend.
