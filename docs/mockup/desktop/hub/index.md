---
paired_html: docs/mockup/desktop/hub/index.html
description: "Resume active joined conversations and start the separate find or create journeys."
---

# Backend Data Actions

## Retrieve Joined Conversations

### Page States

- An identified private session enters loading, populated, empty, failed, retried, or indefinitely pending joined-list states.
- An unavailable identified session suppresses all private hub content and offers only a return to the public home.

### Evidence

- `docs/mockup/desktop/hub/index.html` — boot checks the session fixture, a timer simulates joined-list retrieval, fixture records are projected newest-first, and rendered branches cover loading, populated, empty, persistent failure, flaky retry success, and unavailable session.
- `docs/mockup/desktop/hub/index.html` — the populated fixture includes active standard and private moderation conversations with tag combinations, the member's role, recent-message cues, activity time, and per-conversation Resume controls.
- `docs/concepts/REQUIREMENTS.md` — membership is authoritative, active participation is private to an identified actor, and related private moderation conversations appear in participating administrators' conversation lists.
- `docs/concepts/APP_PAGES.md` — the hub must show a short list of active joined conversations with visible tags, role, and a restrained recent-message cue.

### Backend Need

The product must retrieve the identified person's authoritative active joined-conversation projection, including display-ready tags, role, recent activity, and a public identifier for later selection. It must return no private conversation data when the identified session is unavailable and must exclude former or inactive memberships from the resolved list.

### Visible Inputs

- None; page lifecycle action.

### Required Outcomes

- Loading is restrained and resolves to the newest-first active list, a zero-conversation state, or a recoverable error.
- The populated list includes standard and private moderation conversations the identified person actively participates in, with role and recent activity cues.
- Empty results offer the separate Find and Create journeys.
- Failure keeps private data unchanged and permits retry.
- An unavailable session hides the private hub and directs the person back to the public entry point.

## Resolve Joined Conversation Access

### Page States

- The identified person selects Resume for a currently active joined conversation.
- At selection time, the membership may still be active, may have become removed or banned, or the conversation selection may be temporarily unresolvable.

### Evidence

- `docs/mockup/desktop/hub/index.html` — each rendered card carries a conversation key, and the Resume handler rechecks the fixture-backed membership before navigation; active membership opens the workspace, stale membership removes the card and updates the count, and an unresolved selection preserves the list with Retry.
- `docs/concepts/REQUIREMENTS.md` — only active members may participate, membership records retain removed and banned states, and a banned identity cannot rejoin.
- `docs/concepts/APP_PAGES.md` — selecting an active joined item opens the conversation workspace.

### Backend Need

The product must resolve the selected conversation against current authoritative membership before exposing its private workspace. It must distinguish active access from stale membership and a transient resolution failure so the hub never opens the wrong or unauthorized conversation.

### Visible Inputs

- The selected conversation's public identifier carried by its visible Resume control.

### Required Outcomes

- Active membership continues to the selected conversation workspace.
- Removed or banned membership prevents entry, removes the stale item from Joined, updates the count, and explains that access is no longer available.
- A temporarily unresolvable selection leaves the list intact and permits retry without opening another conversation.
