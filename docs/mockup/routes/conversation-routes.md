# Conversation Routes

## Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)

Retrieves the display-ready state needed to open or retry the active conversation workspace. It supports the loading, populated, empty, failed, read-only, suspended, and ownership-continuity states on the Conversation page, including permitted actions derived from the current participant's membership.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Retrieve Conversation Workspace`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` is a safe public UID read from the current page route; that page route is populated by the conversation link selected in the hub, discovery, or related-conversation workflow. The UX API derives the identified participant, membership, role, permissions, posting restriction, and ownership-continuity state from the session and selected conversation before returning display-ready data. If the cookie is absent or invalid, the response contains no protected conversation data and directs the browser to reauthenticate.

A successful empty-thread branch returns `threadState: EMPTY` with `messages: []`; populated, read-only, suspended, last-owner, and eligible-to-leave branches return their applicable display values and allowed actions. An unavailable or unauthorized conversation returns no conversation or message content, and a retryable load failure leaves the existing workspace unavailable until the browser retries this operation.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "threadState": "POPULATED",
  "tags": [
    "urban-gardening",
    "atlanta",
    "pollinators"
  ],
  "accessType": "LISTED",
  "matchingMode": "INCLUSIVE",
  "activeParticipantCount": 5,
  "currentParticipant": {
    "displayName": "Maya Chen",
    "role": "OWNER",
    "membershipState": "ACTIVE",
    "postingState": "ALLOWED",
    "postingRestrictionMessage": null,
    "allowedActions": [
      "POST_MESSAGE",
      "ADD_CONVERSATION_NOTE",
      "OPEN_LEAVE_CONVERSATION",
      "MANAGE_TAGS_AND_LIFECYCLE",
      "MANAGE_MEMBERS",
      "REVIEW_REPORTS"
    ]
  },
  "leaveState": {
    "outcome": "BLOCKED_LAST_OWNER",
    "message": "Transfer ownership or archive this conversation before leaving.",
    "allowedActions": [
      "MANAGE_OWNERS",
      "ARCHIVE_CONVERSATION"
    ]
  },
  "participantsHereNow": [
    {
      "displayName": "Maya Chen",
      "identityType": "PERSON",
      "role": "OWNER"
    },
    {
      "displayName": "SoilWatch",
      "identityType": "BOT",
      "role": "MEMBER"
    },
    {
      "displayName": "Nadia Rivera",
      "identityType": "PERSON",
      "role": "ADMINISTRATOR"
    },
    {
      "displayName": "Theo Walker",
      "identityType": "PERSON",
      "role": "MEMBER"
    }
  ],
  "messages": [
    {
      "messageUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
      "author": {
        "displayName": "Jules Park",
        "identityType": "PERSON",
        "participationState": "FORMER"
      },
      "postedAt": "2026-07-22T08:42:00-04:00",
      "text": "The milkweed along the west fence is flowering. I counted six monarch caterpillars there before heading out this morning.",
      "reactions": [
        {
          "emoji": "🦋",
          "count": 4,
          "reactedByCurrentParticipant": false
        }
      ],
      "allowedActions": [
        "ADD_REACTION",
        "ADD_NOTE",
        "REPORT_MESSAGE"
      ]
    },
    {
      "messageUid": "7b46c27208e74b1c8bb94a3a55fb28ca",
      "author": {
        "displayName": "SoilWatch",
        "identityType": "BOT",
        "participationState": "ACTIVE"
      },
      "postedAt": "2026-07-22T09:06:00-04:00",
      "text": "Bed 3 moisture is back in range after last night's watering: 31% at 6 in. No irrigation is recommended this morning.",
      "reactions": [
        {
          "emoji": "🌱",
          "count": 3,
          "reactedByCurrentParticipant": true
        }
      ],
      "allowedActions": [
        "ADD_REACTION",
        "REMOVE_REACTION",
        "ADD_NOTE",
        "REPORT_MESSAGE"
      ]
    },
    {
      "messageUid": "c3b2f111d9ac49a1a70d39c278843c5e",
      "author": {
        "displayName": "Maya Chen",
        "identityType": "PERSON",
        "participationState": "ACTIVE"
      },
      "postedAt": "2026-07-22T09:24:00-04:00",
      "text": "Perfect. I marked the south side of the shed for the mint and added hand trowels to Saturday's supply bin.",
      "reactions": [
        {
          "emoji": "👍",
          "count": 2,
          "reactedByCurrentParticipant": false
        }
      ],
      "allowedActions": [
        "ADD_REACTION",
        "ADD_NOTE",
        "REPORT_MESSAGE",
        "DELETE_MESSAGE"
      ]
    }
  ]
}
```

## Post Message : (`POST /api/v0/conversation/post-message`)

Creates a persistent message in the current conversation for an active participant who is permitted to post. It supports the composer's pending, failed-with-retained-draft, retry, and successful insertion outcomes.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Post Message`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/post-message?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` is read from the current page route, and `text` comes from the visible composer. The UX API derives the author from the session and revalidates active membership and posting permission; the browser does not send trusted author, role, permission, or suspension values. If the cookie is absent or invalid, no message is created and the browser is directed to reauthenticate.

On success, the response supplies the created message public UID, display attribution, timestamp, and allowed next actions. A blocked or failed submission creates no message; the browser retains the locally entered `text` for retry and displays the returned failure message.

### Example Request Payload

```json
{
  "text": "Seedling pickup is confirmed for Saturday."
}
```

### Example Response Payload

```json
{
  "message": {
    "messageUid": "31c2c8db07894f6598d923b794282467",
    "author": {
      "displayName": "Maya Chen",
      "identityType": "PERSON",
      "participationState": "ACTIVE"
    },
    "postedAt": "2026-07-22T09:36:00-04:00",
    "text": "Seedling pickup is confirmed for Saturday.",
    "reactions": [],
    "allowedActions": [
      "ADD_REACTION",
      "ADD_NOTE",
      "REPORT_MESSAGE",
      "DELETE_MESSAGE"
    ]
  },
  "confirmationMessage": "Message posted."
}
```

## Add Emoji Reaction : (`POST /api/v0/conversation/add-emoji-reaction`)

Adds the current participant's selected emoji reaction to a visible message and returns the updated visible aggregate. It supports both selecting an existing inactive reaction and adding a reaction from the picker.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Add Emoji Reaction`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/add-emoji-reaction?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current page route, `messageUid` comes from the selected rendered message in the workspace response, and `emoji` comes from the visible reaction chip or picker. The UX API derives the reacting participant and verifies that the participant may view and react to the selected message. If the cookie is absent or invalid, no reaction is created and the browser is directed to reauthenticate.

Success returns the updated aggregate and marks the current participant's reaction active. A stale, unavailable, or unauthorized message returns no replacement aggregate, leaves the displayed reaction unchanged, and supplies a recoverable failure message.

### Example Request Payload

```json
{
  "messageUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "emoji": "🦋"
}
```

### Example Response Payload

```json
{
  "messageUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "reaction": {
    "emoji": "🦋",
    "count": 5,
    "reactedByCurrentParticipant": true
  },
  "confirmationMessage": "Reaction added."
}
```

## Remove Emoji Reaction : (`DELETE /api/v0/conversation/remove-emoji-reaction`)

Removes only the current participant's selected emoji reaction from a visible message and preserves reactions from other participants. It returns the aggregate needed to render the reaction's remaining count and inactive state.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Remove Emoji Reaction`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
DELETE /api/v0/conversation/remove-emoji-reaction?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current page route, while `messageUid` and `emoji` come from the active reaction chip on the selected rendered message. The UX API derives the reacting participant and removes only that participant's association after confirming message visibility and reaction ownership. If the cookie is absent or invalid, no reaction is removed and the browser is directed to reauthenticate.

Success returns the remaining visible aggregate with `reactedByCurrentParticipant: false`. A stale, unavailable, unauthorized, or already-removed reaction leaves the displayed aggregate unchanged and returns a recoverable failure message.

### Example Request Payload

```json
{
  "messageUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "emoji": "🦋"
}
```

### Example Response Payload

```json
{
  "messageUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "reaction": {
    "emoji": "🦋",
    "count": 4,
    "reactedByCurrentParticipant": false
  }
}
```

## Retrieve Note : (`GET /api/v0/conversation/retrieve-note`)

Retrieves participant-editable note state for either the selected message or the current conversation. This shared route supports blank creation forms, existing-note prefill, and stale or unavailable attachment targets while leaving unresolved note-visibility policy behind the UX API boundary.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Retrieve Message Note`
- `docs/mockup/desktop/conversation/thread.md` — `Retrieve Conversation Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
GET /api/v0/conversation/retrieve-note?conversationUid={conversationUid}&targetType={targetType}&targetUid={targetUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` is read from the current page route. `targetType` is the all-caps `MESSAGE` or `CONVERSATION` value implied by the visible note action, and `targetUid` is the selected message public UID from the workspace response or the same current-page conversation UID. The UX API authorizes access to the participant-accessible note and applies the unresolved visibility policy server-side. If the cookie is absent or invalid, the response contains no note data and directs the browser to reauthenticate.

An available target with no note returns `targetState: AVAILABLE`, `noteState: NONE`, `note: null`, and permits creation. An existing note returns editable text, its public `noteUid`, and whether update is allowed. A stale, unavailable, or unauthorized target returns `targetState: UNAVAILABLE`, omits note content and identifiers, and provides a display-ready explanation.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "targetType": "MESSAGE",
  "targetUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "targetState": "AVAILABLE",
  "noteState": "EXISTING",
  "note": {
    "noteUid": "6f9619ff8b8642d4a9d30c1dc9f9472c",
    "text": "Ask Nadia about shade tolerance.",
    "canEdit": true
  }
}
```

## Create Note : (`POST /api/v0/conversation/create-note`)

Creates participant-authored note text against either a selected message or the current conversation when no note record exists. The common operation preserves the target-specific thread outcomes without requiring a pre-existing note public identifier.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Create Message Note`
- `docs/mockup/desktop/conversation/thread.md` — `Create Conversation Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/create-note?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current page route. `targetType` is the all-caps value implied by the visible message-note or conversation-note action, `targetUid` comes from the selected rendered message or current page route, and `text` comes from the visible note form. No note UID exists before creation. If the cookie is absent or invalid, no note is created and the browser is directed to reauthenticate.

The UX API derives the author and applies note visibility and attachment rules server-side. Success returns a safe public `noteUid` for later retrieval or update and target-appropriate thread feedback. Empty text is rejected before invocation; a stale, unavailable, unauthorized, or already-noted target creates nothing, returns no note UID, and preserves the entered text in the browser for recovery.

### Example Request Payload

```json
{
  "targetType": "MESSAGE",
  "targetUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "text": "Ask Nadia about shade tolerance."
}
```

### Example Response Payload

```json
{
  "noteUid": "6f9619ff8b8642d4a9d30c1dc9f9472c",
  "targetType": "MESSAGE",
  "targetUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "text": "Ask Nadia about shade tolerance.",
  "messageMarkLabel": "Note added",
  "confirmationMessage": "Note saved to the message."
}
```

## Update Note : (`PATCH /api/v0/conversation/update-note`)

Replaces the editable text of an existing participant-accessible note while preserving its message or conversation attachment. The existing note public identifier comes from note retrieval, allowing both prefilled edit states to use the same lifecycle-specific update operation.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Update Message Note`
- `docs/mockup/desktop/conversation/thread.md` — `Update Conversation Note`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
PATCH /api/v0/conversation/update-note?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current page route, `noteUid` is the safe public UID returned by Retrieve Note and carried by the open existing-note form, and `text` is the participant's visible replacement text. The UX API derives note ownership and edit permission and preserves the existing target attachment server-side. If the cookie is absent or invalid, the note is not changed and the browser is directed to reauthenticate.

Success returns the note's current editable text and target-ready display feedback. A stale, unavailable, or unauthorized note is not overwritten, returns no replacement content, and leaves the participant's entered replacement text in the browser for recovery.

### Example Request Payload

```json
{
  "noteUid": "6f9619ff8b8642d4a9d30c1dc9f9472c",
  "text": "Confirm shade tolerance with Nadia before Saturday."
}
```

### Example Response Payload

```json
{
  "noteUid": "6f9619ff8b8642d4a9d30c1dc9f9472c",
  "targetType": "MESSAGE",
  "targetUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "text": "Confirm shade tolerance with Nadia before Saturday.",
  "messageMarkLabel": "Note added",
  "confirmationMessage": "Note saved to the message."
}
```

## Submit Message Report : (`POST /api/v0/conversation/submit-message-report`)

Creates a numbered moderation report for the selected message using the participant's explanation. It supports validation, pending submission, successful ticket creation, and stale or unauthorized target outcomes without exposing moderation internals.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Submit Message Report`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
POST /api/v0/conversation/submit-message-report?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current page route, `messageUid` comes from the rendered message whose Report action opened the form, and `explanation` comes from the visible report form. The UX API derives the reporting participant, links the selected conversation and message, and grants report access to authorized moderators server-side. If the cookie is absent or invalid, no ticket is created and the browser is directed to reauthenticate.

Success returns the public ticket number and display labels needed to mark the message as reported. Empty explanation is rejected before invocation; a stale, unavailable, or unauthorized message creates no ticket, omits `ticketNumber` and report labels, and returns a blocked-outcome message.

### Example Request Payload

```json
{
  "messageUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "explanation": "The gate instruction may create a safety issue."
}
```

### Example Response Payload

```json
{
  "messageUid": "9d0cb4ae5f5f4a3ab2ab278fe2c2b5b7",
  "ticketNumber": 1048,
  "messageMarkLabel": "Reported #1048",
  "confirmationMessage": "Report #1048 was sent to the conversation moderators."
}
```

## Delete Message : (`DELETE /api/v0/conversation/delete-message`)

Soft-deletes the selected message after revalidating the current participant's permission and explicit confirmation. The Conversation page uses the result to remove the message without a deleted-message placeholder while retained history remains server-owned.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Delete Message`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
DELETE /api/v0/conversation/delete-message?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current page route, `messageUid` comes from the rendered message whose Delete action opened the confirmation, and `confirmed` records the participant's explicit confirmation. The UX API derives the participant and revalidates authorship or moderation permission before applying the retained soft deletion. If the cookie is absent or invalid, the message is not changed and the browser is directed to reauthenticate.

Success returns `visibleInConversation: false`, so the browser removes the message without a placeholder. A stale or unauthorized target is not changed, returns no replacement message content, and instructs the browser to keep the current thread unchanged while showing the failure.

### Example Request Payload

```json
{
  "messageUid": "c3b2f111d9ac49a1a70d39c278843c5e",
  "confirmed": true
}
```

### Example Response Payload

```json
{
  "messageUid": "c3b2f111d9ac49a1a70d39c278843c5e",
  "visibleInConversation": false,
  "confirmationMessage": "Your message was deleted."
}
```

## Leave Conversation : (`DELETE /api/v0/conversation/leave-conversation`)

Ends the current participant's active membership after explicit confirmation and a server-side ownership-continuity recheck. It returns either the blocked last-owner outcome or an allowed departure outcome that lets the page return to the conversation list while preserving historical attribution.

### Source Actions

- `docs/mockup/desktop/conversation/thread.md` — `Leave Conversation`

### Mockup Files

- `docs/mockup/desktop/conversation/thread.html`
- `docs/mockup/desktop/conversation/thread.md`

### Route

```http
DELETE /api/v0/conversation/leave-conversation?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
Content-Type: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current page route, and `confirmed` records the participant's explicit confirmation. The UX API derives the current membership and role and rechecks active-owner continuity server-side; the browser sends no trusted role, ownership count, or permission decision. If the cookie is absent or invalid, membership stays active and the browser is directed to reauthenticate.

An eligible departure returns `outcome: LEFT`, the former-membership display state, and a browser-safe application-relative redirect target. If owner continuity changed or the participant is the last owner, the operation returns `outcome: BLOCKED_LAST_OWNER`, leaves membership active, omits the redirect target, and supplies the transfer-ownership or archive guidance. Other failures also leave membership active and return no redirect target.

### Example Request Payload

```json
{
  "confirmed": true
}
```

### Example Response Payload

```json
{
  "outcome": "LEFT",
  "membershipState": "FORMER",
  "redirectTarget": "../hub/index.html",
  "confirmationMessage": "You left the conversation."
}
```
