---
paired_html: docs/mockup/desktop/moderation/index.html
description: "Lets owners and administrators scan numbered reports for conversations they govern and choose one for review."
---

# Backend Data Actions

## Retrieve Reviewable Reports

### Page States

- Initial page load and retry after a recoverable loading failure.
- Populated, conversation-filtered, zero-report, permission-denied, still-loading, and failed queue outcomes.
- Conversation-origin entry, where an authorized governed conversation is preselected without disclosing an unauthorized or stale origin.

### Evidence

- `docs/mockup/desktop/moderation/index.html` — the first rendered state loads reports before showing the queue; fixtures stand in for governed conversations, role-based authorization, report records, reporters, reason excerpts, and ticket references.
- `docs/mockup/desktop/moderation/index.html` — `?scenario=` branches render populated, empty, mixed-authority, denied, loading, failed, retry-success, and retry-failure outcomes, while `?origin=` may preselect only an authorized governed conversation.
- `docs/concepts/APP_PAGES.md` — Reported Messages must show realistic ticket numbers, governed-conversation context, reporter, and reason excerpts without inventing a ticket-status workflow.
- `docs/concepts/REQUIREMENTS.md` — only owners and administrators of the affected conversation may access reports, and each ticket is linked to its message, conversation, and reporting identity.

### Backend Need

The page needs an authoritative, reviewer-scoped collection of moderation reports plus the governed conversations permitted as filters. Retrieval must enforce current owner or administrator access and return privacy-safe populated, empty, denied, and failed outcomes without exposing reports from member-only or revoked conversations.

### Visible Inputs

- Optional governed-conversation origin value from the current page URL, used only when it identifies a conversation the reviewer may govern.

### Required Outcomes

- Loading followed by a populated queue with report number, conversation tags, reporter identity, reason excerpt, and a continuation reference for review.
- A ready zero-report outcome for the complete authorized scope or the selected governed conversation.
- A non-disclosing denied outcome when the current identity governs no report-bearing conversations.
- A recoverable failure with retry, including either successful recovery or a repeated failure without changing moderation data.
