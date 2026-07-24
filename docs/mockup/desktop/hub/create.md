---
paired_html: docs/mockup/desktop/hub/create.html
description: "Create a listed or unlisted tagged conversation and continue as its first owner."
---

# Backend Data Actions

## Create Conversation

### Page States

- The new-conversation form is ready with one to ten tags, listed or unlisted access, and the listed-only inclusive or exclusive matching choice.
- Submission enters a pending state that locks editing and navigation, then resolves to success, failure, or timeout; failure and timeout preserve the draft for retry.

### Evidence

- `docs/mockup/desktop/hub/create.html` — the rendered form collects tag chips and access choices, the submit handler captures one stable snapshot, timers simulate pending/failure/timeout/success branches, and success stores a generated conversation plus the creator's owner membership before opening the workspace.
- `docs/concepts/REQUIREMENTS.md` — creation requires one to ten valid tags, listed or unlisted access, listed-only exclusive matching, durable conversation creation, and assignment of the creator as first owner.
- `docs/concepts/APP_PAGES.md` — the page must create the example and continue to the conversation workspace as owner.

### Backend Need

The product must durably create the conversation and its initial owner membership as one operation while enforcing the documented tag and access constraints. The result must support a clear pending state, preserve the user's draft after a failed or timed-out attempt, and provide the newly created conversation needed to continue to its workspace.

### Visible Inputs

- The ordered set of one to ten user-entered tags.
- The selected listed or unlisted access choice.
- The selected inclusive or exclusive matching choice when access is listed.

### Required Outcomes

- Pending creation disables competing edits and navigation and prevents duplicate activation.
- Success confirms that the identified creator is the first owner and continues to the new conversation workspace.
- Validation failure explains the invalid, duplicate, missing, or over-limit tag condition without creating a conversation.
- Service failure or timeout confirms that nothing was created, preserves the draft, and permits retry.
