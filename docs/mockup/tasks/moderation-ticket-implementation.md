# UI Implementation Report: Moderation Ticket

- **Assigned page:** `docs/mockup/desktop/moderation/ticket.html`
- **Page slug:** `moderation-ticket`
- **Role:** UI Developer
- **Approval source of truth:** `docs/mockup/tasks/moderation-ticket-approval.md`
- **Result:** PASS

## Summary

Implemented all eight approved product outcomes page-locally inside the assigned HTML using inline `<style>` / inline `<script>` and existing shared classes only. No shared assets were modified. The shared `window.showToast` and the shared modal open/close/Escape/backdrop behavior are reused unchanged; focus management, focus trapping, validation, async simulation, applied-effect state, and deterministic scenario variants were added locally.

Local scenario variants are driven by a `?scenario=` query parameter (`normal` default, plus `loading`, `missing`, `unauthorized`, `failed`, `timeout`, `unavailable-source`, `no-discussion`, `deleted`). These exist only to exercise the approved states; they expose no raw IDs, JSON, schema metadata, or audit internals.

## Per-outcome implementation

- **PO-001 (Load authorized ticket, Approved w/ nuance):** Added a brief local loading state (`#ticket-loading`) that resolves after ~650ms into the evidence/controls for the authorized reviewer. Added `missing` (not-found + Back to reports), `unauthorized` (access-denied panel that hides all evidence and tags), and `failed`/`timeout` (error panel with a local **Try again** that recovers to normal). No ticket status/assignment/closure UI introduced; loading and failure paths mutate no records; previously applied effects are summarized from local state via the "Applied to this report" panel.
- **PO-002 (Reviewer notes, Approved w/ nuance):** Notes now **append** in order (a seeded prior note by Maya Chen is preserved) with reviewer attribution and a readable mock time. Save shows a brief local "Saving…" progress, clears the composer only after success, and blocks duplicate appends while saving (`state.saving` guard). Empty/whitespace-only input shows an inline `role="alert"` message, keeps focus, and creates nothing. Textarea capped at `maxlength=10000` (schema max). No visibility selector added.
- **PO-003 (Confirm/cancel safely, Approved):** Each of the four actions opens one consequence-specific dialog. Added local focus management: on open, focus moves inside the dialog (first input, else first control); a Tab keydown handler traps focus; a MutationObserver restores focus to the initiating control on any dismissal (Cancel, close ×, Escape, backdrop). Confirm is disabled while a local result is pending (`state.confirming`), and each confirm re-checks current target state before applying. Opening/dismissing changes no data.
- **PO-004 (Delete message, Approved w/ nuance):** Confirm soft-deletes: the flagged message keeps a readable retained copy on the ticket with a "retained evidence" label and a "Hidden from the conversation" flag, an effect is logged clarifying membership/posting are unchanged, and the Delete control is replaced by a non-interactive "Deleted" pill (idempotent; re-confirm reconciles). `?scenario=deleted` renders the already-applied state. Source-conversation link gains `&deleted=1` context.
- **PO-005 (Future-bounded suspension, Approved w/ nuance):** Validates inline against a deterministic mock now (Jul 22 2026 10:30): rejects empty, malformed, current, and past values with the dialog staying open. Success shows the exact end time in a persistent effect and relabels the action ("Change" + "Posting blocked until …"). Time-zone context is stated in the dialog. A replacement guard (checkbox) blocks silently shortening an existing longer suspension.
- **PO-006 (Remove non-owner, Approved):** Dialog explicitly distinguishes removal from banning and states rejoining is not blocked. Success marks the participant former, preserves message attribution, logs the effect, disables Remove ("Removed") and disables Suspend ("Not applicable" — needs an active poster). Target is the reported non-owner Declan; owner protection is respected by scoping to that participant.
- **PO-007 (Ban without erasing history, Approved w/ nuance):** Dialog distinguishes ban from both removal and deletion. Success sets banned state, logs that Declan cannot post or rejoin while retained history/evidence stay available, and disables Ban ("Banned") plus Remove/Suspend ("Not applicable"). Idempotent (re-confirm reconciles). No content deleted; no unban control added.
- **PO-008 (Preserve navigation context, Approved w/ nuance):** Back to reports and breadcrumb carry `?conversation=design` (index.html resolves and still lists #1048). Source conversation and related discussion now point to **distinct** targets (`thread.html?conversation=design-1048&focus=flagged` vs `thread.html?conversation=mod-review-1048`), fixing the prior identical-link defect. View participant context carries `?participant=declan-gray&conversation=design-1048`. `?scenario=no-discussion` omits the related-discussion card; `?scenario=unavailable-source` disables the source link with a restrained "unavailable" indicator while retaining evidence.

## Files changed

- `docs/mockup/desktop/moderation/ticket.html` (only file changed)

## Shared-asset impact

None. `assets/app.js` and `assets/styles.css` were read only and left unmodified. All new behavior is inline in the assigned HTML. Reused shared primitives: `window.showToast(msg)`, `[data-modal-open]`/`[data-modal-close]` modals, Escape/backdrop close, and existing utility/component classes.

## Manual + Playwright checks actually run

Rendered at 1440×1000 via the bundled Playwright/Chrome route. No console or page errors in any scenario.

Interaction checklist (all passed):
- Normal load resolves loading → content; loading hidden afterward.
- Seeded prior note present (1); whitespace-only save shows inline error and creates no note; valid save appends (→2) and clears composer; second valid save appends in order (→3).
- Delete dialog: opens, focus lands inside dialog, Escape closes and restores focus to the Delete trigger.
- Suspend validation: empty rejected (dialog stays open), past date rejected, valid future date applies, closes, shows effects panel, relabels action to "Change".
- Delete apply: flagged message marked retained/deleted, Delete control replaced by "Deleted" pill.
- Ban apply: Ban → "Banned" pill; Remove and Suspend controls become "Not applicable".
- No horizontal overflow at 1440px.
- Scenario variants verified: `missing` → not-found panel; `unauthorized` → denied panel (no evidence); `loading` → persistent loading; `failed` → error panel then **Try again** recovers to content; `unavailable-source` → content with source link disabled; `no-discussion` → related card omitted; `deleted` → pre-applied soft-delete with Delete control removed and effects shown.

## Before / after evidence

- Before: `docs/mockup/tasks/evidence/moderation-ticket-before.png`
- After: `docs/mockup/tasks/evidence/moderation-ticket-after.png` (rich terminal state: applied-effects panel, three ordered notes, retained deleted evidence, applied-action pills, related discussion, ban toast)

## Difficulties and residual risks

- **Cross-page context is best-effort by design.** "Back to reports restores the prior filter" and the distinct source/related destinations are carried via query params, but the destination pages (`moderation/index.html`, `conversation/thread.html`, `governance/members.html`) are outside this page's write scope and do not yet read those params. Links resolve to valid existing files and never dead-route; full filter restoration / deleted-context landing would require edits to those pages in their own lanes.
- **State is per-session in-memory** (no persistence across reload), consistent with a static mockup; reload-survival of effects would need a storage mechanism not approved here.
- The `deleted` scenario and manual delete both drive the same soft-delete path, so behavior is consistent between pre-applied and interactively-applied states.
- No real API/backend/auth/notification calls were added; all authorization, delay, success/failure/timeout, and retry are locally simulated.
