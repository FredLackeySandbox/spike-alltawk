# Moderation Routes

## Retrieve Reviewable Reports : (`GET /api/v0/moderation/retrieve-reviewable-reports`)

Retrieves the moderation queue and governed-conversation filter choices for the signed-in reviewer. It supports the queue page's initial load, retry, authorized origin preselection, populated and empty results, and non-disclosing denied or failed outcomes while keeping report visibility scoped to conversations the reviewer currently owns or administers.

### Source Actions

- `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports`

### Mockup Files

- `docs/mockup/desktop/moderation/index.html`
- `docs/mockup/desktop/moderation/index.md`

### Route

```http
GET /api/v0/moderation/retrieve-reviewable-reports?originConversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. Optional `originConversationUid` comes from the current queue page URL and is the public conversation UID returned by an earlier conversation or ticket response; an absent value starts at all governed conversations. The browser should use this one normalized URL value when returning from a ticket rather than the mockup's inconsistent `origin` and `conversation` keys. The UX API derives the reviewer and current owner or administrator scope from the session, honors the origin only when it is in that current scope, and otherwise returns the same non-disclosing queue start state.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "result": "READY",
  "selectedConversationUid": "a12bc34d56ef4789a1234567890abcde",
  "governedConversations": [
    {
      "conversationUid": "a12bc34d56ef4789a1234567890abcde",
      "tags": [
        "#product-design",
        "#accessibility",
        "#research"
      ]
    }
  ],
  "reports": [
    {
      "reportNumber": "1048",
      "conversationUid": "a12bc34d56ef4789a1234567890abcde",
      "conversationTags": [
        "#product-design",
        "#accessibility",
        "#research"
      ],
      "reporter": {
        "displayName": "Priya Nair",
        "identityType": "PERSON"
      },
      "reasonExcerpt": "Personal attack after the keyboard test results were shared."
    }
  ],
  "totalCount": 1
}
```

## Retrieve Moderation Ticket : (`GET /api/v0/moderation/retrieve-moderation-ticket`)

Retrieves one selected moderation ticket and the UI-ready evidence, ordered notes, participant and suspension state, existing related-discussion reference, and allowed moderation actions needed by the ticket page. The report number and source-conversation value come from the current page URL or the selected queue result; the result must support normal, retained-deletion, unavailable-source, no-discussion, missing, unauthorized, failed, timeout, retry, and post-action refresh states without disclosing inaccessible evidence. The UX API returns public conversation UIDs for the source and related discussion, and the page constructs its own navigation links from those UIDs.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
GET /api/v0/moderation/retrieve-moderation-ticket?reportNumber={reportNumber}&conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `reportNumber` and `conversationUid` come from the selected queue result and are carried in the current ticket page URL; the conversation UID is also the origin used to return to its filtered queue. The static mockup names these values `ticket` and `conversation` but always renders fixture report `#1048`; the production page must render the returned report instead. The UX API binds the report to the source conversation, rechecks current reviewer authority, and returns a non-disclosing missing or unauthorized outcome rather than trusting browser or fixture content.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload — No Active Suspension

```json
{
  "result": "READY",
  "reportNumber": "1048",
  "conversation": {
    "conversationUid": "a12bc34d56ef4789a1234567890abcde",
    "tags": [
      "#product-design",
      "#accessibility",
      "#research"
    ],
    "sourceAvailable": true
  },
  "reportedMessage": {
    "messageUid": "b23cd45e67f8490ab234567890abcdef",
    "author": {
      "participantUid": "c34de56f78a9412ba34567890abcdef1",
      "displayName": "Declan Gray"
    },
    "sentAt": "2026-07-22T10:13:00-04:00",
    "text": "Maybe if Priya understood basic interaction design, we wouldn't waste another review on this.",
    "isDeleted": false
  },
  "contextMessages": [
    {
      "position": "BEFORE",
      "authorDisplayName": "AccessCheck",
      "identityType": "BOT",
      "sentAt": "2026-07-22T10:11:00-04:00",
      "text": "Keyboard path check completed: 7 of 8 tasks passed. The modal close control still needs a visible focus state."
    },
    {
      "position": "AFTER",
      "authorDisplayName": "Maya Chen",
      "identityType": "PERSON",
      "sentAt": "2026-07-22T10:15:00-04:00",
      "text": "Please keep feedback about the work. Priya's test notes clearly identify the remaining keyboard issue."
    }
  ],
  "reporter": {
    "displayName": "Priya Nair",
    "explanation": "This was directed at me rather than the design issue. It followed two similar comments in yesterday's keyboard-review discussion."
  },
  "reviewerNotes": [
    {
      "authorDisplayName": "Maya Chen",
      "createdAt": "2026-07-22T10:22:00-04:00",
      "text": "Reporter flagged this within minutes. Two similar comments appeared in yesterday's keyboard-review discussion."
    }
  ],
  "participant": {
    "participantUid": "c34de56f78a9412ba34567890abcdef1",
    "displayName": "Declan Gray",
    "status": "ACTIVE",
    "canRead": true,
    "canPost": true,
    "canRejoin": true,
    "postingSuspension": null
  },
  "relatedDiscussion": {
    "conversationUid": "f6701892abcd445ea67890abcdef1234",
    "tags": [
      "#mod-review",
      "#ticket-1048"
    ]
  },
  "appliedEffects": [],
  "allowedActions": {
    "createReviewerNote": true,
    "deleteReportedMessage": true,
    "createPostingSuspension": true,
    "updatePostingSuspension": false,
    "removeParticipant": true,
    "banParticipant": true
  }
}
```

### Example Response Payload — Existing Suspension

The existing-suspension variant returns the public participant and suspension identifiers and current suspension end time required to continue to Update Posting Suspension. It also returns public conversation UIDs for the source and related discussion so the page can construct navigation links.

```json
{
  "conversation": {
    "conversationUid": "a12bc34d56ef4789a1234567890abcde",
    "sourceAvailable": true
  },
  "participant": {
    "participantUid": "c34de56f78a9412ba34567890abcdef1",
    "postingSuspension": {
      "suspensionUid": "e56f07819abc434da567890abcdef123",
      "endsAt": "2026-07-29T17:00:00-04:00"
    }
  },
  "relatedDiscussion": {
    "conversationUid": "f6701892abcd445ea67890abcdef1234",
    "tags": [
      "#mod-review",
      "#ticket-1048"
    ]
  }
}
```

The page carries `participant.participantUid` forward as `participantUid`, `participant.postingSuspension.suspensionUid` as `suspensionUid`, and `participant.postingSuspension.endsAt` as `currentEndsAt` in the Update Posting Suspension request. For this variant, those values are exactly `c34de56f78a9412ba34567890abcdef1`, `e56f07819abc434da567890abcdef123`, and `2026-07-29T17:00:00-04:00`, respectively.

## Create Reviewer Note : (`POST /api/v0/moderation/create-reviewer-note`)

Creates one operational reviewer note on the loaded moderation ticket and returns the display-ready note with its reviewer attribution and timestamp for ordered insertion. The browser can invoke it with the report number carried by the ticket page and the reviewer-entered text; reviewer identity and continued authority are derived and checked by the UX API rather than supplied as editable fields.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Create Reviewer Note`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
POST /api/v0/moderation/create-reviewer-note
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json

{
  "reportNumber": "{reportNumber}",
  "conversationUid": "{conversationUid}",
  "noteText": "{reviewerEnteredNoteText}"
}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `reportNumber` and `conversationUid` come from the current ticket page URL, which was populated from the selected queue result, and `noteText` comes from the reviewer notes form. The UX API binds the report to the conversation and derives reviewer identity, current authority, note attribution, timestamp, and authoritative ordering server-side.

### Example Request Payload

```json
{
  "reportNumber": "1048",
  "conversationUid": "a12bc34d56ef4789a1234567890abcde",
  "noteText": "Reviewed the surrounding context and confirmed that the reported message should remain in the retained evidence."
}
```

### Example Response Payload

```json
{
  "result": "CREATED",
  "note": {
    "authorDisplayName": "Rowan Ellis",
    "createdAt": "2026-07-22T10:31:00-04:00",
    "text": "Reviewed the surrounding context and confirmed that the reported message should remain in the retained evidence."
  }
}
```

## Delete Reported Message : (`DELETE /api/v0/moderation/delete-reported-message`)

Soft-deletes the reported source message while preserving its retained moderation evidence and associating the applied effect with the ticket. The browser receives the report number and a public-safe reported-message identifier from the loaded ticket and submits them only after explicit confirmation; the route returns current already-deleted or successful deletion state so duplicate or stale application does not erase evidence or alter participant access.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Delete Reported Message`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
DELETE /api/v0/moderation/delete-reported-message
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json

{
  "reportNumber": "{reportNumber}",
  "conversationUid": "{conversationUid}",
  "reportedMessageUid": "{reportedMessageUid}"
}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `reportNumber` and `conversationUid` come from the current ticket page URL, while `reportedMessageUid` comes from the prior moderation-ticket response. The request itself represents the reviewer's delete intent after the page completes its visible confirmation. The UX API binds all three public values, rechecks current access and message state, soft-deletes only the source message, and retains the ticket evidence server-side.

### Example Request Payload

```json
{
  "reportNumber": "1048",
  "conversationUid": "a12bc34d56ef4789a1234567890abcde",
  "reportedMessageUid": "b23cd45e67f8490ab234567890abcdef"
}
```

### Example Response Payload

```json
{
  "result": "DELETED",
  "reportedMessage": {
    "messageUid": "b23cd45e67f8490ab234567890abcdef",
    "isDeleted": true,
    "deletedAt": "2026-07-22T10:32:00-04:00"
  },
  "appliedEffect": {
    "title": "Message hidden from the conversation",
    "description": "The message no longer appears in the source conversation. Its retained evidence stays on this report."
  },
  "allowedActions": {
    "deleteReportedMessage": false,
    "createPostingSuspension": true,
    "removeParticipant": true,
    "banParticipant": true
  }
}
```

## Create Posting Suspension : (`POST /api/v0/moderation/create-posting-suspension`)

Creates a time-bounded posting restriction for the active participant represented by the loaded ticket without ending membership or reading access. The browser carries forward the report number and public-safe participant identifier from the ticket response and supplies the reviewer-entered future end time plus confirmation; the route returns the effective restriction, applied effect, and continuation information required to expose the later Change action.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Create Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
POST /api/v0/moderation/create-posting-suspension
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json

{
  "reportNumber": "{reportNumber}",
  "conversationUid": "{conversationUid}",
  "participantUid": "{participantUid}",
  "endsAt": "{reviewerEnteredEndTime}"
}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `reportNumber` and `conversationUid` come from the current ticket page URL, `participantUid` comes from the prior moderation-ticket response, and `endsAt` comes from the reviewer's suspension form. The request itself represents the reviewer's create intent after the page completes its visible confirmation. This create request does not carry a suspension UID or current end because no restriction exists; the UX API binds the report, conversation, and participant, then evaluates current authority, participant eligibility, and server time before creating one restriction.

### Example Request Payload

```json
{
  "reportNumber": "1048",
  "conversationUid": "a12bc34d56ef4789a1234567890abcde",
  "participantUid": "c34de56f78a9412ba34567890abcdef1",
  "endsAt": "2026-07-29T17:00:00-04:00"
}
```

### Example Response Payload

```json
{
  "result": "CREATED",
  "postingSuspension": {
    "suspensionUid": "e56f07819abc434da567890abcdef123",
    "endsAt": "2026-07-29T17:00:00-04:00"
  },
  "appliedEffect": {
    "title": "Posting suspended",
    "description": "Declan Gray cannot post until Jul 29, 2026, 5:00 PM. He can continue reading the conversation."
  },
  "allowedActions": {
    "createPostingSuspension": false,
    "updatePostingSuspension": true,
    "removeParticipant": true,
    "banParticipant": true
  }
}
```

## Update Posting Suspension : (`PATCH /api/v0/moderation/update-posting-suspension`)

Replaces the effective end time of the existing posting suspension rather than creating a second restriction. The loaded or post-create ticket state supplies the report number, participant identifier, current public-safe suspension identifier, and current effective end time; the reviewer supplies the replacement end time and an explicit shorter-period acknowledgment when applicable, allowing the server to return one authoritative restriction and updated applied effect.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Update Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
PATCH /api/v0/moderation/update-posting-suspension
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json

{
  "reportNumber": "{reportNumber}",
  "conversationUid": "{conversationUid}",
  "participantUid": "{participantUid}",
  "suspensionUid": "{suspensionUid}",
  "currentEndsAt": "{currentEndsAt}",
  "replacementEndsAt": "{reviewerEnteredReplacementEndTime}",
  "shorterPeriodAcknowledged": true
}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `reportNumber` and `conversationUid` come from the current ticket page URL. `participantUid`, `suspensionUid`, and `currentEndsAt` come from the prior ticket or create-suspension response, while `replacementEndsAt` comes from the reviewer's suspension form. `shorterPeriodAcknowledged` is true only after the shorter-period guard is visibly confirmed. The UX API binds the report, conversation, participant, and suspension, rechecks the authoritative current restriction and authority, rejects stale `currentEndsAt`, and replaces that restriction rather than creating a second one.

### Example Request Payload

```json
{
  "reportNumber": "1048",
  "conversationUid": "a12bc34d56ef4789a1234567890abcde",
  "participantUid": "c34de56f78a9412ba34567890abcdef1",
  "suspensionUid": "e56f07819abc434da567890abcdef123",
  "currentEndsAt": "2026-07-29T17:00:00-04:00",
  "replacementEndsAt": "2026-07-25T17:00:00-04:00",
  "shorterPeriodAcknowledged": true
}
```

### Example Response Payload

```json
{
  "result": "UPDATED",
  "postingSuspension": {
    "suspensionUid": "e56f07819abc434da567890abcdef123",
    "endsAt": "2026-07-25T17:00:00-04:00"
  },
  "appliedEffect": {
    "title": "Posting suspended",
    "description": "Declan Gray cannot post until Jul 25, 2026, 5:00 PM. He can continue reading the conversation."
  },
  "allowedActions": {
    "createPostingSuspension": false,
    "updatePostingSuspension": true,
    "removeParticipant": true,
    "banParticipant": true
  }
}
```

## Remove Participant : (`DELETE /api/v0/moderation/remove-participant`)

Ends the target participant's active membership for the ticket's source conversation without banning the identity or deleting retained membership and message history. The report number and public-safe participant identifier are carried forward from the loaded ticket and the action is sent only after confirmation; the route returns the current former-participant result and allowed actions so already-inactive or stale states cannot be applied twice.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Remove Participant`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
DELETE /api/v0/moderation/remove-participant
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json

{
  "reportNumber": "{reportNumber}",
  "conversationUid": "{conversationUid}",
  "participantUid": "{participantUid}"
}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `reportNumber` and `conversationUid` come from the current ticket page URL, while `participantUid` comes from the prior moderation-ticket response. The request itself represents the reviewer's removal intent after the page completes its visible confirmation. The UX API binds the target to the ticket's source conversation and rechecks current access, membership status, and owner/administrator role constraints before ending membership without imposing a ban.

### Example Request Payload

```json
{
  "reportNumber": "1048",
  "conversationUid": "a12bc34d56ef4789a1234567890abcde",
  "participantUid": "c34de56f78a9412ba34567890abcdef1"
}
```

### Example Response Payload

```json
{
  "result": "REMOVED",
  "participant": {
    "participantUid": "c34de56f78a9412ba34567890abcdef1",
    "status": "FORMER",
    "canRejoin": true
  },
  "appliedEffect": {
    "title": "Participant removed",
    "description": "Declan Gray is now a former participant and is not blocked from rejoining."
  },
  "allowedActions": {
    "createPostingSuspension": false,
    "updatePostingSuspension": false,
    "removeParticipant": false,
    "banParticipant": true
  }
}
```

## Ban Participant : (`POST /api/v0/moderation/ban-participant`)

Applies the durable moderation decision that blocks the target identity from participating in or rejoining the source conversation while retaining its historical membership, messages, and ticket evidence. The browser carries the report number and public-safe participant identifier from the loaded ticket and invokes the action after explicit confirmation; the route returns the banned outcome and updated allowed actions for successful, already-banned, or stale participant states.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Ban Participant`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
POST /api/v0/moderation/ban-participant
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json

{
  "reportNumber": "{reportNumber}",
  "conversationUid": "{conversationUid}",
  "participantUid": "{participantUid}"
}
```

### Request Context

The browser sends `Cookie: tawk_session={opaqueSessionRef}`. `reportNumber` and `conversationUid` come from the current ticket page URL, while `participantUid` comes from the prior moderation-ticket response. The request itself represents the reviewer's ban intent after the page completes its visible confirmation. The UX API binds the target to the ticket's source conversation, rechecks current access, target state, and owner/administrator role constraints, and applies the ban while retaining membership, message, and ticket history.

### Example Request Payload

```json
{
  "reportNumber": "1048",
  "conversationUid": "a12bc34d56ef4789a1234567890abcde",
  "participantUid": "c34de56f78a9412ba34567890abcdef1"
}
```

### Example Response Payload

```json
{
  "result": "BANNED",
  "participant": {
    "participantUid": "c34de56f78a9412ba34567890abcdef1",
    "status": "BANNED",
    "canRejoin": false
  },
  "appliedEffect": {
    "title": "Participant banned",
    "description": "Declan Gray cannot post or rejoin. Retained messages, membership history, and report evidence remain available to authorized reviewers."
  },
  "allowedActions": {
    "createPostingSuspension": false,
    "updatePostingSuspension": false,
    "removeParticipant": false,
    "banParticipant": false
  }
}
```
