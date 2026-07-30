# Moderation Routes

## Retrieve Reviewable Reports : (`GET /api/v0/moderation/retrieve-reviewable-reports`)

Retrieves the moderation reports the current reviewer is authorized to review, together with the governed-conversation choices needed by the Reported Messages page. It supports the initial load, retry, populated and empty results, non-disclosing denied results, and an optional conversation-origin selection only when that conversation is in the reviewer’s authorized scope.

### Source Actions

- `docs/mockup/desktop/moderation/index.md` — `Retrieve Reviewable Reports`

### Mockup Files

- `docs/mockup/desktop/moderation/index.html`
- `docs/mockup/desktop/moderation/index.md`

### Route

```http
GET /api/v0/moderation/retrieve-reviewable-reports?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie. The UX API derives the current reviewer, active conversation roles, and authorized governed-conversation scope server-side; no reviewer identity, role, or permission value is supplied by JSON or the query string.

`conversationUid` is optional. It comes from the current queue page’s public-safe `origin` value, which was issued in a prior UX response or navigation URL. The static mockup uses aliases such as `design`, but production transport uses the public UID. The browser omits the query parameter when the origin is absent, `reports`, stale, or not among the governed conversations returned for the current session. Ticket return navigation preserves this same public value as `conversationUid`.

An empty authorized queue returns `queueState: READY` with empty `reports`; a reviewer with no governed report scope receives `queueState: DENIED` with no conversation or report data. A retryable load failure returns no partial report data, so the page can keep its current display and retry this same request.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "queueState": "READY",
  "selectedConversationUid": null,
  "governedConversations": [
    {
      "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
      "tags": [
        "#product-design",
        "#accessibility",
        "#research"
      ]
    },
    {
      "conversationUid": "2c1b6b8e4f3a4c9d8e7f1a2b3c4d5e6f",
      "tags": [
        "#urban-gardening",
        "#atlanta",
        "#pollinators"
      ]
    }
  ],
  "reports": [
    {
      "reportUid": "550e8400e29b41d4a716446655440000",
      "reportNumber": "1048",
      "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
      "conversationTags": [
        "#product-design",
        "#accessibility",
        "#research"
      ],
      "reporter": {
        "displayName": "Priya Nair",
        "initials": "PN",
        "identityType": "PERSON",
        "roleLabel": "Member"
      },
      "reasonExcerpt": "Personal attack after the keyboard test results were shared."
    }
  ]
}
```

## Retrieve Moderation Ticket : (`GET /api/v0/moderation/retrieve-moderation-ticket`)

Retrieves the selected report’s evidence and current moderation state for the Moderation Ticket page. It uses the report number and source-conversation value carried by the queue link, then returns only evidence the current owner or administrator may review, including current notes, retained message state, participant restrictions, available actions, and any existing related discussion.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Retrieve Moderation Ticket`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
GET /api/v0/moderation/retrieve-moderation-ticket?reportUid={reportUid}&conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie. `reportUid` and `conversationUid` are public-safe values from the selected row returned by `Retrieve Reviewable Reports`; queue navigation carries both in the ticket page URL, and retry reuses those current page-route values. The static mockup displays a report number in its `ticket` parameter and a conversation alias, but production transport uses the public UIDs returned by the queue.

The UX API rechecks the current reviewer’s owner or administrator authority and the report-to-conversation relationship server-side. A missing report returns `ticketState: NOT_FOUND`, and revoked authority returns `ticketState: ACCESS_DENIED`; neither branch includes message, reporter, participant, note, or discussion evidence. A retryable failure returns `ticketState: RETRYABLE_FAILURE` without partial evidence. A deleted message remains in the authorized response with `visibilityState: DELETED` and retained evidence; an unavailable source uses `sourceAvailable: false` with no `sourceConversationUrl`, and an absent related discussion uses `relatedDiscussion: null`.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "ticketState": "READY",
  "reportUid": "550e8400e29b41d4a716446655440000",
  "reportNumber": "1048",
  "conversation": {
    "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
    "tags": [
      "#product-design",
      "#accessibility",
      "#research"
    ],
    "sourceAvailable": true,
    "sourceConversationUrl": "/conversation/thread.html?conversationUid=f47ac10b58cc4372a5670e02b2c3d479&focus=flagged"
  },
  "reportedMessage": {
    "messageUid": "9f1c2d3e4a5b4c6d8e7f0a1b2c3d4e5f",
    "authorDisplayName": "Declan Gray",
    "authorInitials": "DG",
    "sentAt": "2026-07-22T10:13:00-04:00",
    "body": "Maybe if Priya understood basic interaction design, we wouldn't waste another review on this.",
    "visibilityState": "VISIBLE",
    "retainedEvidenceAvailable": true
  },
  "adjacentMessages": [
    {
      "authorDisplayName": "AccessCheck",
      "authorInitials": "AB",
      "identityType": "BOT",
      "sentAt": "2026-07-22T10:11:00-04:00",
      "body": "Keyboard path check completed: 7 of 8 tasks passed. The modal close control still needs a visible focus state."
    },
    {
      "authorDisplayName": "Maya Chen",
      "authorInitials": "MC",
      "identityType": "PERSON",
      "sentAt": "2026-07-22T10:15:00-04:00",
      "body": "Please keep feedback about the work. Priya's test notes clearly identify the remaining keyboard issue."
    }
  ],
  "reporter": {
    "displayName": "Priya Nair",
    "initials": "PN",
    "explanation": "This was directed at me rather than the design issue. It followed two similar comments in yesterday's keyboard-review discussion."
  },
  "reviewerNotes": [
    {
      "noteUid": "123e4567e89b42d3a456426614174000",
      "authorDisplayName": "Maya Chen",
      "createdAt": "2026-07-22T10:22:00-04:00",
      "text": "Reporter flagged this within minutes. Two similar comments appeared in yesterday’s keyboard-review discussion."
    }
  ],
  "targetParticipant": {
    "participantUid": "7c9e6679dafa4d6c8f1b2a3c4d5e6f70",
    "displayName": "Declan Gray",
    "status": "ACTIVE"
  },
  "postingSuspension": null,
  "allowedActions": [
    "CREATE_REVIEWER_NOTE",
    "DELETE_REPORTED_MESSAGE",
    "CREATE_POSTING_SUSPENSION",
    "REMOVE_PARTICIPANT",
    "BAN_PARTICIPANT"
  ],
  "relatedDiscussion": {
    "conversationUid": "3f2504e04f8941d39a0c0305e82c3301",
    "tags": [
      "#mod-review",
      "#ticket-1048"
    ],
    "conversationUrl": "/conversation/thread.html?conversationUid=3f2504e04f8941d39a0c0305e82c3301"
  }
}
```

## Create Reviewer Note : (`POST /api/v0/moderation/create-reviewer-note`)

Creates one operational reviewer note on the currently loaded moderation ticket. The browser supplies the reviewer-entered text and the selected report reference from the page route or ticket-load result; reviewer identity and current authority are derived server-side, and the authoritative created note is returned for ordered display.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Create Reviewer Note`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
POST /api/v0/moderation/create-reviewer-note
Cookie: tawk_session={opaqueSessionRef}
Origin: {applicationOrigin}
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie and its browser-managed `Origin` header. `reportUid` comes from the current ticket page URL or the prior `Retrieve Moderation Ticket` response; `text` is the trimmed value entered in the visible Reviewer notes form. The UX API validates the same-origin request and current report access, derives reviewer identity and authoritative note order server-side, and prevents a repeated pending submission from creating duplicate notes.

Revoked access returns no note or ticket evidence. If the ticket has changed incompatibly, the response identifies a UI-safe conflict and the page reloads `Retrieve Moderation Ticket` rather than appending a speculative note.

### Example Request Payload

```json
{
  "reportUid": "550e8400e29b41d4a716446655440000",
  "text": "Escalation context confirmed with the reporter."
}
```

### Example Response Payload

```json
{
  "note": {
    "noteUid": "6ba7b8109dad41d180b400c04fd430c8",
    "authorDisplayName": "Rowan Ellis",
    "createdAt": "2026-07-22T10:31:00-04:00",
    "text": "Escalation context confirmed with the reporter."
  }
}
```

## Delete Reported Message : (`DELETE /api/v0/moderation/delete-reported-message`)

Applies the confirmed soft deletion of the reported message while preserving the retained moderation evidence and participant state. The reported-message reference comes from the ticket-load result, so the action remains invocable without exposing an internal identifier or asking the browser to reconstruct message ownership or authorization.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Delete Reported Message`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
DELETE /api/v0/moderation/delete-reported-message
Cookie: tawk_session={opaqueSessionRef}
Origin: {applicationOrigin}
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie and its browser-managed `Origin` header. `reportUid` and `messageUid` are public-safe values carried forward from `Retrieve Moderation Ticket`; `confirmed` records the reviewer’s visible confirmation-dialog intent. The UX API validates the same-origin request, rechecks current authority, verifies that the message belongs to the report, and performs a soft deletion while keeping the retained evidence server-side.

If the message was already deleted, the response returns its current UI-safe `DELETED` state without applying the action twice. Revoked access returns no message or report evidence; another stale or incompatible ticket state returns a conflict that instructs the page to reload the ticket.

### Example Request Payload

```json
{
  "reportUid": "550e8400e29b41d4a716446655440000",
  "messageUid": "9f1c2d3e4a5b4c6d8e7f0a1b2c3d4e5f",
  "confirmed": true
}
```

### Example Response Payload

```json
{
  "messageUid": "9f1c2d3e4a5b4c6d8e7f0a1b2c3d4e5f",
  "visibilityState": "DELETED",
  "retainedEvidenceAvailable": true,
  "allowedActions": [
    "CREATE_REVIEWER_NOTE",
    "CREATE_POSTING_SUSPENSION",
    "REMOVE_PARTICIPANT",
    "BAN_PARTICIPANT"
  ],
  "appliedEffect": "The reported message is hidden from the source conversation and retained on this report."
}
```

## Create Posting Suspension : (`POST /api/v0/moderation/create-posting-suspension`)

Creates the first active time-bounded posting restriction for the reported participant while leaving reading membership intact. The browser carries forward the selected report and target-participant references from the ticket-load result and supplies the reviewer-entered future end time plus explicit confirmation; the server determines eligibility and the effective restriction.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Create Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
POST /api/v0/moderation/create-posting-suspension
Cookie: tawk_session={opaqueSessionRef}
Origin: {applicationOrigin}
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie and its browser-managed `Origin` header. `reportUid` and `participantUid` are public-safe values carried forward from `Retrieve Moderation Ticket`; `endsAt` is entered in the visible date-time field and `confirmed` records the reviewer’s confirmation-dialog intent. The browser sends the ISO 8601 time with its local UTC offset so the server can return one authoritative effective time.

The UX API validates the same-origin request, current authority, report participant, active membership, absence of an existing suspension, and a future end time server-side. If a suspension now exists or the participant is no longer active, it returns a conflict with current UI-safe suspension or participant state and allowed actions so the page can refresh instead of creating a duplicate restriction.

### Example Request Payload

```json
{
  "reportUid": "550e8400e29b41d4a716446655440000",
  "participantUid": "7c9e6679dafa4d6c8f1b2a3c4d5e6f70",
  "endsAt": "2026-08-05T17:00:00-04:00",
  "confirmed": true
}
```

### Example Response Payload

```json
{
  "suspensionUid": "e7b8c9d0a1f24355b678c901d234e567",
  "version": 1,
  "endsAt": "2026-08-05T17:00:00-04:00",
  "allowedActions": [
    "CREATE_REVIEWER_NOTE",
    "DELETE_REPORTED_MESSAGE",
    "UPDATE_POSTING_SUSPENSION",
    "REMOVE_PARTICIPANT",
    "BAN_PARTICIPANT"
  ],
  "appliedEffect": "Posting is suspended until Aug 5, 2026, 5:00 PM. Reading access remains available."
}
```

## Update Posting Suspension : (`PATCH /api/v0/moderation/update-posting-suspension`)

Replaces the existing posting suspension shown by the ticket’s Change state instead of creating a duplicate restriction. The browser carries forward the public restriction or continuation reference and current effective end time returned by ticket retrieval or suspension creation, then supplies the replacement end time and the explicit shorter-period acknowledgment when required.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Update Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
PATCH /api/v0/moderation/update-posting-suspension
Cookie: tawk_session={opaqueSessionRef}
Origin: {applicationOrigin}
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie and its browser-managed `Origin` header. `reportUid`, public-safe `suspensionUid`, and `version` are carried forward from `Retrieve Moderation Ticket` or `Create Posting Suspension`. `replacementEndsAt` is entered in the visible Change dialog, and `replaceShorterConfirmed` records the extra visible acknowledgment when the proposed time is earlier than the currently displayed end time.

The browser does not send `currentEndsAt`; the UX API compares the replacement with the authoritative current suspension selected by `suspensionUid` and `version`. It validates the same-origin request, current authority, report participant, active membership, and future replacement time server-side. A version mismatch or changed participant state returns a conflict with the current UI-safe suspension or participant state and allowed actions so the page can refresh before retrying.

### Example Request Payload

```json
{
  "reportUid": "550e8400e29b41d4a716446655440000",
  "suspensionUid": "e7b8c9d0a1f24355b678c901d234e567",
  "version": 1,
  "replacementEndsAt": "2026-07-30T17:00:00-04:00",
  "replaceShorterConfirmed": true
}
```

### Example Response Payload

```json
{
  "suspensionUid": "e7b8c9d0a1f24355b678c901d234e567",
  "version": 2,
  "endsAt": "2026-07-30T17:00:00-04:00",
  "allowedActions": [
    "CREATE_REVIEWER_NOTE",
    "DELETE_REPORTED_MESSAGE",
    "UPDATE_POSTING_SUSPENSION",
    "REMOVE_PARTICIPANT",
    "BAN_PARTICIPANT"
  ],
  "appliedEffect": "The prior posting suspension is replaced and now ends Jul 30, 2026, 5:00 PM."
}
```

## Remove Participant : (`DELETE /api/v0/moderation/remove-participant`)

Ends the reported participant’s active conversation membership without banning the identity or deleting retained history. The target-participant and selected-report references come from the loaded ticket, while the browser supplies explicit confirmation; the server rechecks the reviewer’s authority, the participant’s current state, and role constraints before applying the removal.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Remove Participant`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
DELETE /api/v0/moderation/remove-participant
Cookie: tawk_session={opaqueSessionRef}
Origin: {applicationOrigin}
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie and its browser-managed `Origin` header. `reportUid` and `participantUid` are public-safe values carried forward from `Retrieve Moderation Ticket`; `confirmed` records the reviewer’s visible removal-dialog intent.

The UX API validates the same-origin request, current authority, report participant, active membership, and role constraints server-side. If the participant is already former or banned, it returns the current UI-safe participant state and allowed actions without applying removal twice. Revoked access returns no participant or report evidence; other stale states instruct the page to reload the ticket.

### Example Request Payload

```json
{
  "reportUid": "550e8400e29b41d4a716446655440000",
  "participantUid": "7c9e6679dafa4d6c8f1b2a3c4d5e6f70",
  "confirmed": true
}
```

### Example Response Payload

```json
{
  "participantUid": "7c9e6679dafa4d6c8f1b2a3c4d5e6f70",
  "participantStatus": "FORMER",
  "allowedActions": [
    "CREATE_REVIEWER_NOTE",
    "DELETE_REPORTED_MESSAGE",
    "BAN_PARTICIPANT"
  ],
  "appliedEffect": "Active membership ended; retained messages and membership history remain available."
}
```

## Ban Participant : (`POST /api/v0/moderation/ban-participant`)

Applies the confirmed ban represented by the ticket, ending active participation and preventing rejoining while preserving membership, message, and moderation history. The target-participant and selected-report references are carried from the ticket-load result, and the server rechecks current authority, target state, and role constraints before returning the banned outcome.

### Source Actions

- `docs/mockup/desktop/moderation/ticket.md` — `Ban Participant`

### Mockup Files

- `docs/mockup/desktop/moderation/ticket.html`
- `docs/mockup/desktop/moderation/ticket.md`

### Route

```http
POST /api/v0/moderation/ban-participant
Cookie: tawk_session={opaqueSessionRef}
Origin: {applicationOrigin}
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser automatically sends the HttpOnly `tawk_session` cookie and its browser-managed `Origin` header. `reportUid` and `participantUid` are public-safe values carried forward from `Retrieve Moderation Ticket`; `confirmed` records the reviewer’s visible ban-dialog intent.

The UX API validates the same-origin request, current authority, report participant, current membership state, and role constraints server-side. If the participant is already banned, it returns the current UI-safe banned state and allowed actions without applying the ban twice. Revoked access returns no participant or report evidence; other stale states instruct the page to reload the ticket.

### Example Request Payload

```json
{
  "reportUid": "550e8400e29b41d4a716446655440000",
  "participantUid": "7c9e6679dafa4d6c8f1b2a3c4d5e6f70",
  "confirmed": true
}
```

### Example Response Payload

```json
{
  "participantUid": "7c9e6679dafa4d6c8f1b2a3c4d5e6f70",
  "participantStatus": "BANNED",
  "allowedActions": [
    "CREATE_REVIEWER_NOTE",
    "DELETE_REPORTED_MESSAGE"
  ],
  "appliedEffect": "The participant cannot post or rejoin; retained messages, membership history, and report evidence remain available."
}
```
