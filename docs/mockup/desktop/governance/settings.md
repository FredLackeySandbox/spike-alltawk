---
paired_html: docs/mockup/desktop/governance/settings.html
description: "Maintain a conversation’s tags and owner-controlled archival while summarizing its fixed access and matching mode."
---

# Backend Data Actions

## Retrieve Conversation Governance Settings

### Page States

- Owner, administrator, ordinary-member, active listed-inclusive, active listed-exclusive, active unlisted, archived, and unavailable page-entry states.

### Evidence

- `docs/mockup/desktop/governance/settings.html` — deterministic fixtures initialize tags, discovery mode, matching mode, lifecycle status, viewer role, and membership status; rendered states enable owner or administrator editing, show owner-only archival, lock archived data, deny ordinary members, or show unavailable data.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may maintain tags, only owners may archive, and current listed/unlisted and matching state govern discovery.
- `docs/concepts/APP_PAGES.md` — the catalog requires editable tags, read-only access and matching summaries, and owner-only archival.

### Backend Need

Retrieve the authoritative conversation tags, fixed discovery and matching configuration, lifecycle state, viewer role, active membership, and allowed governance actions for the current conversation. The result must distinguish editable owner and administrator states from archived, unauthorized, and unavailable states.

### Visible Inputs

- Current conversation identifier from the page route.

### Required Outcomes

- Show the current tags, one-to-ten count, listed or unlisted access, matching meaning, lifecycle state, and viewer role.
- Enable tag maintenance only for an active owner or administrator and archival only for an active owner.
- Show archived, ordinary-member denied, unavailable, and retryable load outcomes without enabling unsafe changes.

## Update Conversation Tags

### Page States

- Active owner or administrator editing an existing listed or unlisted conversation, including dirty, validation-error, pending, successful, retryable-failure, and stale-permission states.

### Evidence

- `docs/mockup/desktop/governance/settings.html` — tag chips can be added and removed within the one-to-ten boundary; submit shows “Saving…”, persists the committed tags to `sessionStorage`, reports success and returns to the conversation, retains the draft on simulated failure, and discards the change when permission becomes stale.
- `docs/concepts/REQUIREMENTS.md` — owners and administrators may add or remove tags after creation, every conversation must retain one to ten valid tags, and tag changes affect listed and unlisted discovery.

### Backend Need

Persist the complete revised tag set for the identified existing conversation after applying authoritative tag grammar, count, authorization, and lifecycle checks. Return the committed display tags or a field, permission, stale-state, or retryable failure that lets the editor preserve or reconcile its draft.

### Visible Inputs

- Current conversation identifier from the page route.
- Complete edited set of one to ten visible tag values.

### Required Outcomes

- Reject whitespace, unsupported grammar, duplicates, fewer than one tag, or more than ten tags with actionable field feedback.
- Show pending and successful saved states, update the visible conversation identity, and continue back to the conversation.
- Keep the draft available after a retryable failure.
- Lock governance and leave the committed tags unchanged when the viewer’s permission or conversation lifecycle becomes stale.

## Archive Conversation

### Page States

- Active owner with no unsaved tag changes, archive confirmation, pending, retryable failure, stale-owner permission, and archived success; administrator and dirty-editor states remain blocked.

### Evidence

- `docs/mockup/desktop/governance/settings.html` — only the owner fixture can open the archive confirmation, a dirty tag draft blocks the action, simulated failure leaves the dialog open for retry, stale permission changes the view to administrator without archiving, and success persists an archived status and timestamp while rendering retained-record confirmation.
- `docs/concepts/REQUIREMENTS.md` — archival replaces hard deletion, is owner-only, ends active use, and retains messages, memberships, tags, tickets, and other records.

### Backend Need

Archive the current active conversation after verifying current owner authority and unchanged actionable state. End active use without physically deleting retained records and return the authoritative archived outcome.

### Visible Inputs

- Current conversation identifier from the page route.
- Explicit archive confirmation.

### Required Outcomes

- Block archival while tag changes are unsaved and explain that administrators cannot archive.
- Show the retention consequence and affected tag identity before confirmation.
- Show a pending state, retryable unchanged failure, or stale-permission denial.
- On success, lock tag editing, remove the archive action, and show that the conversation is archived while its records remain retained.
