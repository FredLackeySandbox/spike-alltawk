---
paired_html: docs/mockup/desktop/conversation/thread.html
description: "Read and participate in one active conversation through messaging and lightweight participation actions."
---

# Backend Data Actions

## Retrieve Conversation Workspace

### Page States

- Initial loading, populated thread, no-message thread, failed load with retry, read-only membership, posting suspension, last-owner, additional-owner, and ordinary-member entry states.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — the page renders a loading status before fixture-backed conversation tags, matching mode, participant count, message history, current participants, current role, permitted controls, and composer state; query-driven `state` and `role` branches produce empty, error/retry, read-only, suspended, and ownership-continuity outcomes.
- `docs/concepts/APP_PAGES.md` — the Conversation page must show realistic people and bot messages, reactions, former-participant treatment, participation controls, and the last-owner warning.
- `docs/concepts/REQUIREMENTS.md` — conversation history, retained former-author attribution, posting restrictions, role permissions, and owner continuity are authoritative conversation and membership state.

### Backend Need

The workspace needs authoritative conversation, membership, permission, participant, message, reaction, and posting-restriction data. It must distinguish load failure from an empty conversation and return enough role state to disable posting or leaving when required.

### Visible Inputs

- Current conversation selection carried by the incoming conversation link; no additional form input.

### Required Outcomes

- Loading resolves to the populated or empty thread with display-ready conversation context and permitted actions.
- A failed retrieval keeps posting and message actions unavailable and offers retry.
- Read-only and suspended members can read the thread but receive the applicable posting restriction, including the visible suspension end time.
- The page explains whether the current owner may leave or must first transfer ownership or archive.

## Post Message

### Page States

- Populated or empty conversation with posting allowed, one-shot failed submission with retained draft and retry, and read-only or suspended states where posting is unavailable.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — composer submission validates message text, shows a timed `Sending…` state, simulates a failure that retains the draft, and on success generates a message identifier, appends the authored message, clears the composer, and shows confirmation.
- `docs/concepts/APP_PAGES.md` — the Conversation page must post a message through the composer.
- `docs/concepts/REQUIREMENTS.md` — active participants may post persistent messages, while a posting suspension prevents posting without ending membership.

### Backend Need

Posting creates a durable message attributed to the identified active participant after membership and posting permission are checked. The server-controlled outcome must preserve the draft on failure and return the created message for immediate display on success.

### Visible Inputs

- Message text entered in the composer.
- Current conversation selection carried by the page.

### Required Outcomes

- Empty input is rejected before submission.
- Pending submission disables duplicate sending.
- Failure retains the draft and offers retry.
- Success adds the new attributed message with its public continuation identity and timestamp, clears the draft, and updates an empty thread to populated.
- Read-only or suspended members remain unable to submit.

## Add Emoji Reaction

### Page States

- Any visible message in an active, loaded conversation, using either an existing inactive reaction chip or the add-reaction picker.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — selecting an inactive reaction or a picker emoji marks the reaction active, increments or creates its count, and shows a `Reaction added.` confirmation.
- `docs/concepts/APP_PAGES.md` — the Conversation page must add or remove an emoji reaction.
- `docs/concepts/REQUIREMENTS.md` — a reaction is associated with both the message and the reacting identity and is available to active participants who can view the message.

### Backend Need

Adding a reaction durably associates the identified participant and selected emoji with the selected message and returns the current visible aggregate.

### Visible Inputs

- Selected message public identifier.
- Selected emoji.

### Required Outcomes

- Success displays the reaction as active with the updated count.
- A stale, unavailable, or unauthorized message leaves the reaction unchanged and presents a recoverable failure.

## Remove Emoji Reaction

### Page States

- A loaded message where the current participant's reaction is already active.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — selecting an active reaction chip clears its pressed state and decrements the visible count without removing other participants' reactions.
- `docs/concepts/APP_PAGES.md` — the Conversation page must add or remove an emoji reaction.
- `docs/concepts/REQUIREMENTS.md` — reactions belong to both a message and the reacting identity.

### Backend Need

Removing a reaction durably ends only the identified participant's selected message reaction and returns the remaining visible aggregate.

### Visible Inputs

- Selected message public identifier.
- Selected emoji.

### Required Outcomes

- Success displays the reaction as inactive with the updated count.
- A stale, unavailable, or unauthorized message leaves the reaction unchanged and presents a recoverable failure.

## Retrieve Message Note

### Page States

- Opening the message-note form for a message with no saved note, reopening it for a message with a saved note, and opening it after the target message has become unavailable.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — the Add note action reads fixture-backed note state by message identifier, prefills saved text for later editing, and uses the `stale` entry branch to replace the form with a no-save warning.
- `docs/concepts/APP_PAGES.md` — the Conversation page must offer a contextual action to add a note.
- `docs/concepts/REQUIREMENTS.md` — a note has an author and may be attached to a message, while its visibility model remains unresolved.

### Backend Need

Opening the form needs authoritative note presence and editable content for the selected message without inventing a visibility choice. It must also confirm that the target message remains available for attachment.

### Visible Inputs

- Selected message public identifier.

### Required Outcomes

- No existing note opens a blank form ready for creation.
- An existing note opens with its current editable text ready for update.
- A stale or unavailable target blocks saving and explains that nothing can be attached.

## Create Message Note

### Page States

- Message-note form opened for a selected message that has no existing note.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — submitting non-empty note text stores it by message identifier, adds a `Note added` mark, and shows a saved confirmation; empty text is rejected.
- `docs/concepts/APP_PAGES.md` — a message action must add a note.
- `docs/concepts/REQUIREMENTS.md` — a participant may create a note attached to a message.

### Backend Need

Creating a message note durably attaches the participant-authored text to the selected message and returns confirmation suitable for the thread.

### Visible Inputs

- Selected message public identifier.
- Note text entered by the participant.

### Required Outcomes

- Empty text is rejected.
- Pending creation prevents duplicate submission.
- Success marks the message as noted and confirms that the note was saved.
- A stale, unavailable, or unauthorized target creates nothing and explains the failure.

## Update Message Note

### Page States

- Message-note form reopened with existing editable note text.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — reopening Add note prefills the note saved for that message, and submitting replacement text overwrites the fixture-backed value while preserving the `Note added` mark.
- `docs/concepts/REQUIREMENTS.md` — notes are durable records attached to messages; the mockup's prefilled existing value demonstrates an edit lifecycle distinct from creation.

### Backend Need

Updating replaces the current participant-editable message note content for the selected existing note while preserving its message attachment.

### Visible Inputs

- Selected message public identifier.
- Existing note public identifier carried from note retrieval.
- Replacement note text entered by the participant.

### Required Outcomes

- Empty replacement text is rejected.
- Success preserves the noted indicator and confirms that the updated note was saved.
- Stale note or message state blocks the update and keeps the prior content available for recovery.

## Retrieve Conversation Note

### Page States

- Opening the conversation-note form when no note exists and reopening it after a note has been saved.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — both conversation-note triggers load the fixture-backed `conversationNote` value into the textarea, producing either a blank create form or a prefilled edit form.
- `docs/concepts/APP_PAGES.md` — the thread includes a lightweight conversation-note action without exposing unresolved visibility choices.
- `docs/concepts/REQUIREMENTS.md` — a participant may create a note attached to a conversation, while note visibility remains unresolved.

### Backend Need

Opening the form needs the authoritative presence and editable content of the participant-accessible conversation note without exposing an unresolved visibility setting.

### Visible Inputs

- Current conversation selection carried by the page.

### Required Outcomes

- No existing note opens a blank form ready for creation.
- An existing note opens with its current editable text ready for update.
- Retrieval failure keeps the form from overwriting unknown durable content and presents a recoverable error.

## Create Conversation Note

### Page States

- Conversation-note form opened for the current conversation when no note exists.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — submitting non-empty conversation-note text stores the fixture value and shows `Conversation note saved.`; empty text is rejected.
- `docs/concepts/APP_PAGES.md` — the workspace allows lightweight notes while keeping messaging central.
- `docs/concepts/REQUIREMENTS.md` — a participant may create a note attached to a conversation.

### Backend Need

Creating a conversation note durably attaches participant-authored context to the current conversation.

### Visible Inputs

- Current conversation selection carried by the page.
- Note text entered by the participant.

### Required Outcomes

- Empty text is rejected.
- Success closes the form and confirms that the note was saved.
- Failure preserves the entered text for retry and does not create a partial note.

## Update Conversation Note

### Page States

- Conversation-note form reopened with existing editable note text.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — reopening either conversation-note trigger prefills the saved fixture value, and a later submission replaces that value.
- `docs/concepts/REQUIREMENTS.md` — conversation notes are durable attached records; the mockup's prefilled value demonstrates an existing-record edit lifecycle.

### Backend Need

Updating replaces the current participant-editable conversation note content while preserving its attachment to the current conversation.

### Visible Inputs

- Current conversation selection carried by the page.
- Existing note public identifier carried from note retrieval.
- Replacement note text entered by the participant.

### Required Outcomes

- Empty replacement text is rejected.
- Success closes the form and confirms that the updated note was saved.
- Stale note state blocks overwrite and preserves the participant's replacement text for recovery.

## Submit Message Report

### Page States

- Report form opened for an available message, pending submission, successful numbered report, empty explanation, and a target message that became unavailable before submission.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — Report message opens target context, requires explanatory text, shows `Submitting…`, increments a fixture ticket sequence, marks the message with `Reported #1048`, and has a `stale` branch that disables submission and states no report was created.
- `docs/concepts/APP_PAGES.md` — the Conversation page must flag a message with an explanation.
- `docs/concepts/REQUIREMENTS.md` — flagging creates a uniquely numbered moderation ticket linked to the message, conversation, and reporting identity for owner and administrator review.

### Backend Need

Submitting a report invokes the server-controlled moderation operation that validates the message, creates the durable numbered ticket, and grants the appropriate conversation moderators access.

### Visible Inputs

- Selected message public identifier.
- Explanation entered by the reporting participant.

### Required Outcomes

- Empty explanation is rejected.
- Pending submission prevents duplicates.
- Success returns the public ticket number, marks the message as reported, and confirms delivery to moderators.
- A stale, unavailable, or unauthorized target creates no ticket and explains the blocked outcome.

## Delete Message

### Page States

- Delete confirmation for the current participant's own visible message, pending deletion, successful removal, and stale or unauthorized target.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — only the current participant's message exposes Delete message; confirmation shows `Deleting…`, sets retained soft-deletion fixture metadata, and intends to remove the message from view with a success toast.
- `docs/concepts/APP_PAGES.md` — the current participant may delete their own message and the deleted message must disappear without a placeholder.
- `docs/concepts/REQUIREMENTS.md` — permitted deletion soft-deletes the durable message while removing it from the visible conversation.

### Backend Need

Deletion must revalidate ownership or moderation permission, soft-delete the selected durable message, and return an outcome that removes it from the visible thread without a placeholder.

### Visible Inputs

- Selected message public identifier.
- Explicit delete confirmation.

### Required Outcomes

- Pending deletion prevents duplicate requests.
- Success removes the message from the visible thread and confirms deletion while retained history remains server-side.
- Stale or unauthorized deletion leaves the thread unchanged and explains the failure.

## Leave Conversation

### Page States

- Last-owner state where departure is blocked, additional-owner state where departure is allowed, and ordinary-member state where departure is allowed.

### Evidence

- `docs/mockup/desktop/conversation/thread.html` — `role` entry branches change the ownership warning and confirmation copy; the leave handler rechecks continuity, simulates pending departure, and returns allowed users to the conversation list while the last owner is directed to transfer ownership or archive.
- `docs/concepts/APP_PAGES.md` — the Conversation page must allow leaving when permitted and show the ownership-continuity warning for the last owner.
- `docs/concepts/REQUIREMENTS.md` — leaving ends active membership rather than deleting history, and the last remaining owner cannot leave until another owner exists unless the conversation is archived.

### Backend Need

Leaving durably ends the identified participant's active membership only after the server revalidates ownership continuity. Existing messages must remain attributed to the former participant.

### Visible Inputs

- Current conversation selection carried by the page.
- Explicit leave confirmation.

### Required Outcomes

- A last owner is blocked and directed to transfer ownership or archive without changing membership.
- An eligible owner or member sees pending departure and, on success, returns to the conversation list.
- Failure keeps membership active and presents a recoverable error.
