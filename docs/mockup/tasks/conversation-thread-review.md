# Product Owner Review: Conversation Thread

## Assignment

- **Assigned page:** `docs/mockup/desktop/conversation/thread.html`
- **Page slug:** `conversation-thread`
- **Review artifact:** `docs/mockup/tasks/conversation-thread-review.md`

## Source docs reviewed

- `docs/concepts/REQUIREMENTS.md`
- `docs/concepts/APP_PAGES.md`
- `docs/concepts/USER_TYPES.md`
- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/assets/styles.css`
- `docs/mockup/desktop/assets/app.js`

## Page purpose and user context

This page is the core workspace for an identified, active conversation participant. Its primary job is to keep the message thread central while supporting posting, reactions, message and conversation notes, reporting, permitted deletion, and leaving. The rendered fixture presents Maya Chen as the only owner, alongside an administrator, ordinary members, a bot, and a former participant.

The likely entry paths are a joined-conversation item in `docs/mockup/desktop/hub/index.html`, a successful listed or known-unlisted join from `docs/mockup/desktop/hub/find.html`, or the newly created conversation flow from `docs/mockup/desktop/hub/create.html`. Natural next actions are to continue participating on this page, return to the conversation hub, or, when authorized, open tags and lifecycle, members, or reported messages. The leave flow should return a departing participant to the hub only after a permitted departure succeeds.

## Playwright route used for rendered inspection

Rendered inspection was completed at a 1440 by 1000 desktop viewport with the exact preflight route below:

```json
{"kind":"system-node-package","source":"application:/Applications","nodeExecutable":"/Users/flackey/.nvm/versions/node/v24.15.0/bin/node","packageName":"playwright","packageVersion":"1.57.0","packageDirectory":"/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright","browserType":"chromium","launchOptions":{"channel":"chrome","headless":true},"validation":"launched browser and rendered local HTML"}
```

## Current behavior observed

### Rendered Playwright observations

- The page rendered without browser console or page errors. It clearly identifies the listed conversation by the three tag chips, inclusive matching, and an active-participant count.
- The two-column layout keeps the message thread and composer prominent while showing a compact presence list and owner controls. The fixture visibly distinguishes a former participant and a bot, as required.
- The message viewport was 522 pixels high with 800 pixels of message content, but opened at scroll position zero. As a result, the page starts at the oldest visible message rather than orienting the participant to the newest activity.
- The conversation-actions menu opened and exposed conversation-note and leave actions. The current last-owner leave path opened a blocking explanation with routes to manage owners or archive instead.
- Message menus exposed note and report actions for all messages and delete only for Maya's own message. Note and report dialogs included the selected message context.
- A conversation note and a message report accepted text, closed, cleared their fields, and displayed success toasts. The report always used ticket number `#1048`; neither action left a visible, persistent page-level indication that the new record existed.
- Existing reaction chips toggled their selected state and count. The add-reaction picker offered five local emoji choices, added a selected reaction, and displayed a success toast.
- Enter posted a trimmed local message, cleared the composer, scrolled the thread to the bottom, and showed success. The new message acquired the expected own-message actions. Deleting it removed it immediately and left no deleted-message placeholder.
- The page and its modals fit the desktop viewport horizontally. The document itself required a small vertical page scroll, while message history used its own internal scroll region.

### Code-inspection observations

- All conversation data and mutations are in the document or in-page state; no application API, live backend, authentication flow, or third-party service call is made.
- Message posting, reaction changes, note submission, reporting, and deletion mutate only the current DOM. Reloading resets every change.
- The composer supports Enter to send and Shift+Enter for a new line. A blank or whitespace-only submission produces no message, but whitespace-only input receives no visible validation feedback.
- Note and report forms use required textareas. The message dialogs focus their textareas after opening; generic modal opening and closing do not consistently establish or restore focus.
- Deletion has no confirmation or cancel path. Note and report submissions have only success outcomes, and the page has no loading, empty-thread, retry, failed-mutation, stale-selection, or posting-suspension state.
- The last-owner warning is correctly grounded in the ownership-continuity rule, but the same page does not demonstrate the successful leave path for a participant who may leave.

## Recommended user experience and interactions

### PO-001: Open at current conversation activity

- **Scenario:** An active participant enters the conversation and needs to understand its identity, membership context, and latest activity without losing access to earlier history.
- **Trigger:** The participant opens the assigned page from a joined conversation, a successful join, or a completed creation flow.
- **Preconditions:** A local conversation fixture identifies the current participant, role, active or archived state, tags, participants, and message history.
- **Expected behavior:** The page first presents a restrained loading state, then renders the conversation header, realistic people and bot messages, reactions, and the visually de-emphasized former participant. When messages exist, the newest activity is in view on initial entry while older history remains reachable by scrolling. The composer is available only when the conversation is active and the current membership may post.
- **State/data effect:** Loading does not change fixture data. A successful load establishes the current conversation and message collection in local page state and records no new activity.
- **Alternate paths:** An empty active conversation shows a concise first-message state with an enabled composer. A mocked load failure keeps actions that require conversation data disabled and offers Retry. A successful retry restores the normal thread without duplicating messages. An archived or no-longer-active membership is read-only and does not silently appear postable.
- **QA acceptance check:** Load the populated fixture and verify the newest message is visible first, older messages remain scrollable, the bot and former participant are distinguishable, and no duplicate messages appear. Load the empty fixture and verify the empty state plus composer. Load the failure fixture, verify posting and message actions are unavailable, select Retry, and verify the populated thread appears once.

### PO-002: Post a message safely

- **Scenario:** An active participant contributes a new message and receives a clear result without accidentally submitting twice.
- **Trigger:** The participant enters non-whitespace text and selects Send or presses Enter; Shift+Enter inserts a new line without sending.
- **Preconditions:** The conversation is active, the participant has an active membership, posting is not suspended, and the composer contains message text.
- **Expected behavior:** Submission briefly marks the composer as busy and prevents a duplicate send. Success appends one own-message entry at the newest end of the thread, brings it into view, clears the input, restores focus to the composer, and provides restrained confirmation. The new message exposes note, report, reaction, and own-message deletion actions.
- **State/data effect:** Success appends one message with the current identity and a local timestamp to the local message fixture. Failure leaves the typed draft intact and appends nothing.
- **Alternate paths:** Blank or whitespace-only input does not submit and presents an inline, accessible validation state. A mocked failure re-enables the composer, preserves the draft, and offers a retry. A posting suspension or lost posting permission disables submission and explains the restriction, including the suspension end date/time when present. A stale conversation state is refreshed before retrying rather than duplicating the draft as a message.
- **QA acceptance check:** Press Shift+Enter and verify a newline is added without a message. Submit valid text and verify exactly one newest message appears, the composer clears and regains focus, and the thread brings it into view. Exercise blank, failure, retry, and suspended fixtures and verify no message is added until one valid retry succeeds.

### PO-003: Add and remove an emoji reaction

- **Scenario:** An active participant gives lightweight feedback on a visible message using the supported local emoji set.
- **Trigger:** The participant selects an existing reaction chip to toggle their reaction, or opens the add-reaction picker and selects an emoji.
- **Preconditions:** The message is visible, the participant is active and permitted to react, and local reaction totals plus the participant's selected reactions are available.
- **Expected behavior:** Adding a reaction marks that emoji as selected for the current participant and increments its displayed count once. Removing the participant's reaction clears the selected state and decrements the count once without going below zero. Choosing an emoji already represented on the message updates that chip instead of creating a duplicate. Closing or canceling the picker makes no change and returns focus to its trigger.
- **State/data effect:** Only the current participant's local reaction association and the derived displayed count change. Other participants' reactions remain unchanged.
- **Alternate paths:** A mocked mutation failure restores the prior chip state and count with a retryable message. If permission is lost or the message becomes unavailable while the picker is open, selection is rejected without changing counts. The mockup does not resolve whether one identity may hold several different reactions; it should demonstrate the existing supported fixture behavior without presenting that open product choice as settled.
- **QA acceptance check:** Toggle an unselected existing reaction on and off and verify a single-step count change each way. Add an emoji that already has a chip and verify no duplicate chip appears. Close the picker without choosing and verify no count changes. Exercise the failure fixture and verify the original count and selected state are restored.

### PO-004: Save a note on a message

- **Scenario:** A participant records contextual information against one message without adding it to the public message stream.
- **Trigger:** The participant opens a message's action menu, selects Add note, enters non-whitespace text, and saves.
- **Preconditions:** The selected message still exists and the current participant may create a note.
- **Expected behavior:** A focused dialog shows the selected author, time, and message excerpt so the target is unambiguous. Save enters a brief busy state, then closes with confirmation and leaves a quiet indication on that message that the current participant has attached a note. Reopening the note action shows the saved local content. Cancel, Close, Escape, or backdrop dismissal discards unsaved edits after an appropriate warning when text has changed and restores focus to the originating action.
- **State/data effect:** Success creates or updates one local note associated with the selected message and current identity. Cancel or failure leaves the previously saved note unchanged.
- **Alternate paths:** Empty or whitespace-only text produces inline validation. A mocked save failure preserves the draft and offers retry. If the selected message is deleted or otherwise becomes stale before save, the dialog explains that the note cannot be attached and does not create an orphan record. No note-visibility selector is shown because the visibility model is unresolved.
- **QA acceptance check:** Open Add note on a known message and verify the correct context. Save valid text, reopen the same action, and verify the saved content remains associated with that message. Verify blank input, cancel with an edited draft, mocked failure and retry, and stale-message handling without creating a note on another message.

### PO-005: Save a conversation note

- **Scenario:** A participant records context about the conversation as a whole without interrupting the message stream.
- **Trigger:** The participant selects Add conversation note from either the conversation-actions menu or the composer tools, enters non-whitespace text, and saves.
- **Preconditions:** The conversation is loaded and the participant may add a conversation note.
- **Expected behavior:** Both entry points open the same focused dialog with the conversation's tag combination as context. A successful save closes the dialog, confirms the result, and makes the saved local note reachable from both entry points. Cancel, Close, Escape, or backdrop dismissal does not create a note and restores focus to the entry point used.
- **State/data effect:** Success creates one local note associated with the conversation and current identity. Cancel or failure leaves conversation-note state unchanged.
- **Alternate paths:** Empty or whitespace-only text produces inline validation. A mocked save failure preserves the draft and offers retry. A changed draft receives an appropriate discard warning before dismissal. The page must not add or imply a settled note-visibility choice.
- **QA acceptance check:** Open the dialog from each entry point and verify the same conversation context. Save valid text through one entry, reopen through the other, and verify the saved note is reachable. Verify empty input, cancellation, failure and retry, and confirm none adds a thread message or exposes a visibility selector.

### PO-006: Report a message for moderator review

- **Scenario:** A participant explains why a specific message needs owner or administrator review and receives evidence that a numbered report was created.
- **Trigger:** The participant opens a message's action menu, selects Report message, enters a non-whitespace explanation, and submits.
- **Preconditions:** The selected message and current reporting identity are still valid in the loaded conversation.
- **Expected behavior:** A focused dialog identifies the selected author, time, and message excerpt. Submission enters a brief busy state and prevents duplicates. Success closes the dialog and confirms a newly assigned unique local report number tied to the selected message, conversation, and reporting identity; the page also indicates that this message has been reported by the current participant. Cancel or Close makes no report and restores focus to the message action.
- **State/data effect:** Success appends one moderation-ticket fixture with a unique ticket number, message reference, conversation reference, reporter, and explanation. Failure, cancellation, or stale selection appends nothing.
- **Alternate paths:** Empty or whitespace-only explanations produce inline validation. A mocked failure preserves the explanation and offers retry without allocating multiple ticket numbers. If the message disappears before submit or reporting permission is denied, the page explains the outcome without revealing moderation-only information or creating a ticket.
- **QA acceptance check:** Report a known message and verify exactly one new ticket fixture contains that message, conversation, reporter, explanation, and a unique number that appears in the success result. Verify the message's reported indication. Exercise blank, cancel, failure/retry, stale-message, and permission-denied states and verify none creates duplicate or partial tickets.

### PO-007: Confirm deletion of an owned message

- **Scenario:** The current participant removes one of their own messages without deleting another participant's content by mistake.
- **Trigger:** The participant opens the action menu on their own message, selects Delete message, and confirms the destructive action.
- **Preconditions:** The message still exists, belongs to the current participant, and the participant retains delete permission.
- **Expected behavior:** A confirmation identifies the target message and makes cancellation the safe path. Confirm briefly marks the action as busy, then removes the message from the visible thread and confirms completion. No deleted-message placeholder or soft-deletion metadata remains visible. Cancel, Close, or Escape leaves the message untouched and returns focus to its action trigger.
- **State/data effect:** Success marks the local message fixture soft-deleted and excludes it from the visible collection; it does not physically erase the retained mock record. Cancellation or failure changes nothing.
- **Alternate paths:** A mocked failure or stale message closes no data gap: the original visible state is restored or refreshed and the user can retry when eligible. Messages authored by others never expose this self-delete action to an ordinary participant; owner or administrator moderation deletion remains on the moderation workflow rather than being expanded here.
- **QA acceptance check:** Open an own-message menu, choose Delete, cancel, and verify the message remains. Repeat and confirm, then verify the message disappears with no placeholder while the retained local fixture is marked soft-deleted. Verify another participant's message lacks self-delete and exercise a failed deletion without removing it.

### PO-008: Leave only when ownership continuity permits

- **Scenario:** A participant ends their membership, while an owner is prevented from leaving a conversation with no remaining owner.
- **Trigger:** The participant selects Leave conversation from either page entry point.
- **Preconditions:** The conversation and current membership are loaded, and local membership state can determine whether the current identity is the last active owner.
- **Expected behavior:** When another active owner exists or the current participant is not the last owner, a confirmation explains that leaving ends active participation while existing messages remain attributed; confirm ends the membership and returns to the conversation hub, while cancel stays on the page. When the current identity is the last owner, the blocking dialog does not offer a leave confirmation and instead routes to manage owners or to the owner-only archive path.
- **State/data effect:** A permitted confirmed leave ends the current local membership period without deleting messages. A blocked or canceled attempt changes no membership or conversation data.
- **Alternate paths:** If ownership or membership changes while the dialog is open, confirm rechecks the current local state. A mocked leave failure keeps the participant in the conversation and offers retry. A user without archive authority is not offered Archive instead. Selecting Manage owners or Archive instead navigates to the matching page without prematurely ending membership.
- **QA acceptance check:** With Maya as the sole owner, invoke both Leave entry points and verify the same blocking result, no leave confirmation, no membership change, and working owner-management and archive routes. With another-owner and ordinary-member fixtures, cancel once and verify no change, then confirm and verify the membership ends, messages remain attributed, and the hub opens. Exercise a stale ownership change and verify the rule is reevaluated before departure.

## Dynamic data, local fixture, and state expectations

The minimum page-local evidence is one conversation record; the current membership and role; active, former, and bot participants; ordered visible and soft-deleted messages; per-message reaction totals plus current-participant selection; message and conversation notes; moderation tickets with a local unique-number sequence; posting-suspension state; and transient loading, pending, success, failure, retry, cancellation, and stale-target states. The current gardening fixture is appropriate and should remain small. Changes should be observable within the mock session and must reset safely on reload unless a shared local fixture intentionally demonstrates cross-page continuity.

## External services and real API avoidance

No real API, backend, authentication provider, bot service, notification channel, or third-party service was observed. All approved behavior must remain local, fixture-backed, or intercepted. The posting, reaction, note, reporting, deletion, membership, retry, timeout, and permission outcomes should be controlled mock states; they must not call production systems or imply that a toast proves persistence in a real backend.

## Validation expectations

- Composer, note, and report inputs reject empty and whitespace-only submissions with visible, accessible feedback.
- Pending mutations prevent double submission; failures preserve drafts or restore prior state and expose an observable retry.
- Permission and stale-target checks occur again at confirmation or submission time.
- Ticket numbers are unique within the mock fixture, reaction totals cannot become negative, and message deletion never leaves a visible placeholder.
- Posting suspension includes an end date/time when applicable, and last-owner departure remains blocked until another active owner exists or the conversation is archived.

## Modal, confirmation, and linked-control expectations

Message note, conversation note, report, reaction, delete, and leave overlays should identify their target, move focus into the interaction, support keyboard dismissal where safe, warn before discarding edited text, and restore focus to the trigger. The two conversation-note triggers must share the same state; the two leave triggers must produce the same role-aware result. Manage owners, Archive instead, View all members, Tags and lifecycle, Reports, and Back to your conversations must retain the navigation purposes defined by `APP_PAGES.md` and must not mutate conversation state merely by being selected.

## Button and link purposes to preserve or clarify

- **Send:** Submit one valid message or remain disabled/busy when the participant cannot currently post.
- **Add reaction and reaction chips:** Add or remove only the current participant's local association and keep the displayed total synchronized.
- **Message Add note:** Attach context to the selected message, never to whichever message happens to be selected later.
- **Conversation Add note:** Attach context to the conversation and expose the same saved state from both entry points.
- **Report message:** Create one numbered local moderation ticket from the selected message and explanation.
- **Delete message:** Appear for the current participant's own message and require confirmation before the message disappears.
- **Leave conversation:** Recheck ownership continuity and either confirm a permitted leave or explain the transfer-or-archive requirement.
- **Manage owners / View all members:** Open membership governance; **Archive instead / Manage tags and lifecycle:** open lifecycle governance; **Reports / Review reported messages:** open the authorized moderation queue; **Back to your conversations:** return without changing membership.

## Explicitly out of scope

- Adding conversation titles, descriptions, new pages, new major thread sections, metrics, audit history, raw identifiers, or deleted-message placeholders.
- Resolving note visibility, the supported emoji set, or whether one identity may add multiple different reactions.
- Bringing moderation queues, participant-history tables, role management, archival execution, or moderator deletion controls into the message thread.
- Real authentication, bot-token management, notifications, APIs, backend persistence, third-party services, or production moderation workflows.
- Inventing ticket statuses, assignments, retention controls, or archived-conversation behavior that the requirements leave unresolved.

## Mockup change statement

No mockup files were changed. This review created only `docs/mockup/tasks/conversation-thread-review.md`.
