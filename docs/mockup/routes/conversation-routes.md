# Conversation Routes

## Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)

Retrieves the display-ready state for the active conversation workspace, including conversation tags and matching mode, the current participant's role and allowed actions, posting restrictions, participants, messages, reactions, and ownership-continuity guidance. It supports initial loading, retry, populated and empty threads, read-only and suspended participation, and each documented owner or member entry state. The current conversation is selected by the safe public conversation UID carried by the incoming page route; the UX API derives identity, membership, permissions, organization or session state, and each participant summary's or message author's `isCurrentParticipant` value from the identified session and membership context behind the browser-facing boundary. The presentation app uses that server-derived flag for “You” labels, current-participant roster treatment, and own-message treatment without comparing `displayName`.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Retrieve Conversation Workspace`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}
Accept: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `conversationUid` is the safe public UID carried by the incoming conversation page route from the conversation list, search/join result, creation result, or another authorized conversation link. The UX API validates the identified session, derives the participant and active membership, authorizes access, and returns display-ready role and allowed-action decisions without asking the browser for permission inputs. From that identified session and membership context, the UX API also derives `isCurrentParticipant` for every `participants` summary and every `messages[].author`; the presentation app uses the boolean for “You” labels, current-participant roster treatment, and own-message treatment without comparing `displayName`. The presentation app renders governance controls from `canManageTagsAndLifecycle`, `canManageMembers`, and `canReviewReports` rather than interpreting `role` as permission policy. If the cookie is absent or invalid, the UX API returns an identified-session-required response and no conversation data. A ready response may contain an empty `messages` array, a populated thread, or posting restrictions; a load failure returns no partial workspace, while owner-continuity decisions are expressed through `canLeave` and `leaveBlockReason`.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "workspaceState": "READY",
  "conversation": {
    "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
    "access": "LISTED",
    "matchingMode": "INCLUSIVE",
    "tags": [
      "urban-gardening",
      "atlanta",
      "pollinators"
    ],
    "activeParticipantCount": 5
  },
  "currentParticipant": {
    "displayName": "Maya Chen",
    "role": "OWNER",
    "canPost": false,
    "canLeave": false,
    "canManageTagsAndLifecycle": true,
    "canManageMembers": true,
    "canReviewReports": true,
    "leaveBlockReason": "Transfer ownership or archive this conversation before leaving."
  },
  "postingRestriction": {
    "kind": "SUSPENDED",
    "message": "Posting is paused until Fri, Jul 24, 2026, 9:00 AM ET. Your membership stays active in the meantime.",
    "endsAtDisplay": "Fri, Jul 24, 2026, 9:00 AM ET"
  },
  "participants": [
    {
      "displayName": "Maya Chen",
      "participantType": "PERSON",
      "roleLabel": "Owner",
      "presence": "ACTIVE",
      "isCurrentParticipant": true
    },
    {
      "displayName": "Nadia Rivera",
      "participantType": "PERSON",
      "roleLabel": "Administrator",
      "presence": "ACTIVE",
      "isCurrentParticipant": false
    },
    {
      "displayName": "Theo Walker",
      "participantType": "PERSON",
      "roleLabel": "Member",
      "presence": "ACTIVE",
      "isCurrentParticipant": false
    },
    {
      "displayName": "SoilWatch",
      "participantType": "BOT",
      "roleLabel": "Member",
      "presence": "ACTIVE",
      "isCurrentParticipant": false
    }
  ],
  "messages": [
    {
      "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
      "author": {
        "displayName": "Maya Chen",
        "participantType": "PERSON",
        "roleLabel": "Owner",
        "isFormerParticipant": false,
        "isCurrentParticipant": true
      },
      "text": "I can bring two flats of mountain mint on Saturday.",
      "postedAt": "2026-07-22T09:18:00-04:00",
      "reactions": [
        {
          "emoji": "🙋",
          "count": 2,
          "currentParticipantReacted": true
        }
      ],
      "noteIndicator": null,
      "reportIndicator": null,
      "allowedActions": {
        "canReact": true,
        "canAddNote": true,
        "canReport": true,
        "canDelete": false
      }
    }
  ]
}
```

## Post Message : (`POST /api/v0/conversation/post-message`)

Creates a durable message in the current conversation after rechecking active membership and posting permission. The browser supplies the message text and the current page's public conversation UID; the authenticated author is derived server-side. Success returns the public message identity, attributed display data, timestamp, and initial reaction state needed to insert the message immediately, while a rejected or failed result lets the page retain the user's draft.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Post Message`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/post-message
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `conversationUid` is read from the current conversation page route, and `text` is the trimmed value entered in the visible composer. The UX API validates the session, derives the author, rechecks active membership and posting permission, and attributes the message server-side. If the cookie is absent or invalid, no message is created. A rejected or failed response omits `message`, reports why posting was unavailable, and directs the page to retain the draft; only `POSTED` returns the created display-ready message.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "text": "I can bring seed trays on Saturday morning."
}
```

### Example Response Payload

```json
{
  "outcome": "POSTED",
  "message": {
    "messageUid": "1b4e28ba2fa14f5ba3c75e06fb7f7e9d",
    "author": {
      "displayName": "Maya Chen",
      "participantType": "PERSON",
      "roleLabel": "Owner",
      "isFormerParticipant": false
    },
    "text": "I can bring seed trays on Saturday morning.",
    "postedAt": "2026-07-23T10:14:00-04:00",
    "reactions": [],
    "allowedActions": {
      "canReact": true,
      "canAddNote": true,
      "canReport": true,
      "canDelete": true
    }
  },
  "confirmationMessage": "Message posted."
}
```

## Add Emoji Reaction : (`POST /api/v0/conversation/add-emoji-reaction`)

Adds the current participant's selected emoji reaction to a visible message and returns its display-ready aggregate. The selected message public UID comes from the retrieved workspace and the emoji comes from the reaction chip or picker; the reacting identity and access decision are derived server-side. The route supports both an existing inactive chip and a newly selected picker emoji without requiring hidden frontend state.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Add Emoji Reaction`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/add-emoji-reaction
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `messageUid` comes from the selected message in the Retrieve Conversation Workspace response, and `emoji` comes from the visible reaction chip or picker. The UX API validates the session, derives the reacting identity, confirms active access to the selected message, and applies the product's current reaction rules server-side. If the cookie or message is unavailable, the response omits a changed aggregate and the page keeps the existing reaction display.

### Example Request Payload

```json
{
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "emoji": "💚"
}
```

### Example Response Payload

```json
{
  "outcome": "ADDED",
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "reaction": {
    "emoji": "💚",
    "count": 2,
    "currentParticipantReacted": true
  },
  "confirmationMessage": "Reaction added."
}
```

## Remove Emoji Reaction : (`DELETE /api/v0/conversation/remove-emoji-reaction`)

Removes only the current participant's selected emoji reaction from a visible message and returns the remaining display-ready aggregate. The browser has the message public UID and emoji from the loaded reaction control, while the UX API derives the reacting identity and verifies that the participant's reaction exists. Stale, unavailable, or unauthorized message outcomes leave the rendered aggregate unchanged.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Remove Emoji Reaction`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
DELETE /api/v0/conversation/remove-emoji-reaction
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `messageUid` and `emoji` come from the active reaction control rendered from the Retrieve Conversation Workspace response. The UX API validates the session, derives the reacting identity, confirms message access, and removes only that participant's matching reaction. If the cookie, message, or reaction is unavailable, the response omits a changed aggregate and the page keeps the existing reaction display.

### Example Request Payload

```json
{
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "emoji": "🙋"
}
```

### Example Response Payload

```json
{
  "outcome": "REMOVED",
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "reaction": {
    "emoji": "🙋",
    "count": 1,
    "currentParticipantReacted": false
  },
  "confirmationMessage": "Reaction removed."
}
```

## Retrieve Message Note : (`GET /api/v0/conversation/retrieve-message-note`)

Initializes the message-note form for the selected message with either a blank create state or the participant-accessible note's current editable text and safe public note UID. The message public UID comes from the selected message in the loaded workspace. The response also reports whether the target remains available so the page can block attachment to a stale or unauthorized message without inventing a note-visibility policy.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Retrieve Message Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
GET /api/v0/conversation/retrieve-message-note?messageUid={messageUid}
Accept: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `messageUid` comes from the selected message in the Retrieve Conversation Workspace response. The UX API validates the session, derives participant and note access, and returns only the participant-accessible editable note without exposing the unresolved visibility model. If the cookie is absent or invalid, no note data is returned. `CREATE` returns `note: null` with `canCreate: true`, and its returned `messageUid` is carried into `POST /api/v0/conversation/create-message-note`; `UPDATE` returns the public `noteUid` and editable `text`; an unavailable target returns `targetAvailable: false`, no note content, and no allowed save action.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

Existing-note `UPDATE` state:

```json
{
  "formMode": "UPDATE",
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "targetAvailable": true,
  "note": {
    "noteUid": "9f1c2e345a6b4c7d8e9f0123456789ab",
    "text": "Confirm the sunny strip near the tool shed."
  },
  "allowedActions": {
    "canCreate": false,
    "canUpdate": true
  }
}
```

Blank-note `CREATE` state:

```json
{
  "formMode": "CREATE",
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "targetAvailable": true,
  "note": null,
  "allowedActions": {
    "canCreate": true,
    "canUpdate": false
  }
}
```

## Create Message Note : (`POST /api/v0/conversation/create-message-note`)

Creates a participant-authored note attached to the selected message when the note initializer reported that no editable note exists. The browser supplies the message public UID from the loaded workspace and the entered note text; it does not supply a pre-existing note UID. Success returns a server-issued public note UID and the display-ready noted state, while stale, unauthorized, failed, or duplicate creation creates no partial note.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Create Message Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/create-message-note
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `messageUid` comes from the selected message in the Retrieve Conversation Workspace response, and `text` is the value entered in the visible note form. The UX API validates the session, derives the note author and access, confirms that the message remains available and has no editable note for this create flow, and issues the public `noteUid`. If the cookie or target is unavailable, or a note now exists, no partial note is created and the page retains the entered text.

### Example Request Payload

```json
{
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "text": "Confirm the sunny strip near the tool shed."
}
```

### Example Response Payload

```json
{
  "outcome": "CREATED",
  "noteUid": "9f1c2e345a6b4c7d8e9f0123456789ab",
  "messageIndicator": "Note added",
  "confirmationMessage": "Note saved to the message."
}
```

## Update Message Note : (`PATCH /api/v0/conversation/update-message-note`)

Replaces the editable text of an existing participant-accessible message note while preserving its message attachment. The browser supplies the public note UID returned by message-note retrieval and the replacement text; the UX API resolves the attached message from that note. It revalidates the current note and message state so stale or unauthorized updates preserve the prior durable content and leave the replacement text recoverable in the form.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Update Message Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
PATCH /api/v0/conversation/update-message-note
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `noteUid` is the safe public UID carried forward from the Retrieve Message Note response, and `text` is the replacement value entered in the visible form. The UX API validates the session, derives note access, resolves and verifies the note's attached message, and updates only the accessible note. If the cookie, note, or attached message is stale or unauthorized, durable content is unchanged and the page retains the replacement text.

### Example Request Payload

```json
{
  "noteUid": "9f1c2e345a6b4c7d8e9f0123456789ab",
  "text": "Reserve the sunny strip and two hand trowels."
}
```

### Example Response Payload

```json
{
  "outcome": "UPDATED",
  "noteUid": "9f1c2e345a6b4c7d8e9f0123456789ab",
  "messageIndicator": "Note added",
  "confirmationMessage": "Note saved to the message."
}
```

## Retrieve Conversation Note : (`GET /api/v0/conversation/retrieve-conversation-note`)

Initializes the conversation-note form with either a blank create state or the participant-accessible note's current editable text and safe public note UID. The public conversation UID comes from the current page route, and the UX API derives the participant and applicable access decision. A retrieval failure does not overwrite unknown durable content, and the contract does not expose or resolve the product's undecided note-visibility model.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Retrieve Conversation Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
GET /api/v0/conversation/retrieve-conversation-note?conversationUid={conversationUid}
Accept: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `conversationUid` is the safe public UID from the current conversation page route. The UX API validates the session, derives participant and note access, and returns only the participant-accessible editable note without exposing the unresolved visibility model. If the cookie is absent or invalid, no note data is returned. `CREATE` returns `note: null` with `canCreate: true` and selects `POST /api/v0/conversation/create-conversation-note`; `UPDATE` returns the public `noteUid` and editable `text`; retrieval failure returns no partial note content so the form does not overwrite an unknown durable value.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

Existing-note `UPDATE` state:

```json
{
  "formMode": "UPDATE",
  "note": {
    "noteUid": "c1a2b3c4d5e64f708123456789abcdef",
    "text": "Saturday volunteers should meet by the tool shed."
  },
  "allowedActions": {
    "canCreate": false,
    "canUpdate": true
  }
}
```

Blank-note `CREATE` state:

```json
{
  "formMode": "CREATE",
  "note": null,
  "allowedActions": {
    "canCreate": true,
    "canUpdate": false
  }
}
```

## Create Conversation Note : (`POST /api/v0/conversation/create-conversation-note`)

Creates participant-authored context attached to the current conversation when the note initializer reported that no editable note exists. The browser supplies the public conversation UID from the current page route and the entered text, with no pre-existing note UID. Success returns a server-issued public note UID and confirmation-ready state; a failure preserves the user's text and creates no partial note.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Create Conversation Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/create-conversation-note
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `conversationUid` is read from the current conversation page route, and `text` is the value entered in the visible conversation-note form. The UX API validates the session, derives the note author and access, confirms that no participant-accessible note already exists for this create flow, and issues the public `noteUid`. If the cookie or conversation is unavailable, or a note now exists, no partial note is created and the page retains the entered text.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "text": "Saturday volunteers should meet by the tool shed."
}
```

### Example Response Payload

```json
{
  "outcome": "CREATED",
  "noteUid": "c1a2b3c4d5e64f708123456789abcdef",
  "confirmationMessage": "Conversation note saved."
}
```

## Update Conversation Note : (`PATCH /api/v0/conversation/update-conversation-note`)

Replaces the editable text of an existing participant-accessible conversation note. The browser supplies the public note UID returned by conversation-note retrieval and the replacement text; the UX API resolves the attached conversation from that note. It revalidates the current note state so a stale or unauthorized update does not overwrite durable content and the page can retain the proposed replacement for recovery.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Update Conversation Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
PATCH /api/v0/conversation/update-conversation-note
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `noteUid` is the safe public UID carried forward from the Retrieve Conversation Note response, and `text` is the replacement value entered in the visible form. The UX API validates the session, derives note access, resolves the note's attached conversation, and updates only the accessible note. If the cookie or note is stale or unauthorized, durable content is unchanged and the page retains the replacement text.

### Example Request Payload

```json
{
  "noteUid": "c1a2b3c4d5e64f708123456789abcdef",
  "text": "Saturday volunteers should meet by the south tool-shed door."
}
```

### Example Response Payload

```json
{
  "outcome": "UPDATED",
  "noteUid": "c1a2b3c4d5e64f708123456789abcdef",
  "confirmationMessage": "Conversation note saved."
}
```

## Submit Message Report : (`POST /api/v0/conversation/submit-message-report`)

Creates the numbered moderation ticket requested by the participant and makes it available to the affected conversation's authorized moderators. The browser supplies the selected message public UID from the loaded workspace and the entered explanation; the UX API resolves the source conversation from the message, while reporting identity, moderator access, and ticket numbering remain server-side decisions. Success returns the public ticket number and message-reported display state, while stale, unavailable, unauthorized, or duplicate submissions create no ticket.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Submit Message Report`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/submit-message-report
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `messageUid` comes from the selected message in the Retrieve Conversation Workspace response, and `explanation` is the visible report-form input. The UX API validates the session, derives the reporter and moderator audience, resolves the message's source conversation, confirms that it remains reportable, and assigns the ticket number server-side. If the cookie or target is unavailable, or the same report is rejected as a duplicate, no ticket is created and the page keeps the explanation for recovery.

### Example Request Payload

```json
{
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "explanation": "Please review whether this message exposes unsafe access details."
}
```

### Example Response Payload

```json
{
  "outcome": "SUBMITTED",
  "messageUid": "7c9e6679742f40de944be07fc1f90ae7",
  "ticketNumber": "1048",
  "messageIndicator": "Reported #1048",
  "confirmationMessage": "Report #1048 was sent to the conversation moderators."
}
```

## Delete Message : (`DELETE /api/v0/conversation/delete-message`)

Soft-deletes the selected durable message after revalidating that the current participant may delete it, then instructs the workspace to remove it without a placeholder. The message public UID comes from the current participant's visible message in the retrieved workspace, and invoking the DELETE route after modal confirmation is the explicit delete intent; authorship and moderation permission are derived server-side. Stale or unauthorized deletion leaves the thread unchanged, and no retained deletion metadata is exposed to the page.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Delete Message`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
DELETE /api/v0/conversation/delete-message
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `messageUid` comes from the current participant's selected visible message in the Retrieve Conversation Workspace response. The browser invokes this DELETE route only after the user confirms the visible modal; a redundant confirmation boolean is not sent. The UX API validates the session, derives authorship and moderation permission, confirms that the message remains available, and performs soft deletion behind the UI-facing boundary. If the cookie is absent or the target is stale or unauthorized, the message remains visible and no deletion metadata is returned to the browser.

### Example Request Payload

```json
{
  "messageUid": "2d8f7e6c5b4a4938a1230fedcba98765"
}
```

### Example Response Payload

```json
{
  "outcome": "DELETED",
  "removeMessageUid": "2d8f7e6c5b4a4938a1230fedcba98765",
  "confirmationMessage": "Your message was deleted."
}
```

## Leave Conversation : (`DELETE /api/v0/conversation/leave-conversation`)

Ends the current participant's active membership in the selected conversation while retaining historical attribution. The browser supplies the public conversation UID from the current page route, and invoking the DELETE route after modal confirmation is the explicit leave intent; the UX API derives the current membership and rechecks owner continuity at invocation time. It returns a blocked branch with action codes for a last owner, a successful `LEFT` branch for an eligible owner or member, or a recoverable failure that leaves membership active. The presentation app maps those outcomes and action codes to its conversation-list or governance routes.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Leave Conversation`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
DELETE /api/v0/conversation/leave-conversation
Accept: application/json
Content-Type: application/json
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}` automatically. `conversationUid` comes from the current conversation page route. The browser invokes this DELETE route only after the user confirms the allowed leave modal; a redundant confirmation boolean is not sent. The UX API validates the session, derives the active membership and role, rechecks owner continuity at invocation time, and ends only the current participant's membership when allowed. If the cookie is absent, membership stays active. `BLOCKED` returns `LAST_OWNER` with action codes and no membership change; `LEFT` returns the successful outcome and confirmation while omitting owner-management actions; a recoverable failure leaves membership active. The presentation app owns the mapping from `LEFT` to its conversation-list route and from blocked action codes to its governance routes.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479"
}
```

### Example Response Payload

Last-owner `BLOCKED` response:

```json
{
  "outcome": "BLOCKED",
  "reason": "LAST_OWNER",
  "message": "Transfer ownership or archive this conversation before leaving.",
  "allowedActions": [
    {
      "action": "MANAGE_OWNERS"
    },
    {
      "action": "ARCHIVE_CONVERSATION"
    }
  ]
}
```

Successful `LEFT` response:

```json
{
  "outcome": "LEFT",
  "confirmationMessage": "You left the conversation."
}
```
