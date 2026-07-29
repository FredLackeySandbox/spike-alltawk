# Governance Routes

## Retrieve Conversation Governance : (`GET /api/v0/governance/retrieve-conversation-governance`)

Retrieves the UI-ready governance state for the current conversation and selected governance page. The members view receives the authorized active/former roster, role and access state, current suspension references, ownership-continuity protection, permitted actions, and loading-result branches; the settings view receives editable tags, fixed access and matching summaries, lifecycle state, viewer authority, and permitted settings actions. The browser invokes the route with the current conversation public identifier from the page route and one selected governance view, and the frontend receives exactly one response object for that requested view; the route never returns the members and settings results together. Ordinary-member, unavailable, empty, archived, expired-suspension, and retryable-failure results remain explicit rather than relying on hidden frontend context.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster`
- `docs/mockup/desktop/governance/settings.md` — `Retrieve Conversation Governance Settings`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`
- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`

### Route

```http
GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie; `{opaqueSessionRef}` is a placeholder and never appears in JSON. `conversationUid` comes from the current conversation page route. `view` is `MEMBERS` when `members.html` opens and `SETTINGS` when `settings.html` opens; the browser maps that single page selection to `{governanceView}` in the query string and consumes the one view-specific response object that matches it.

The UX API rejects a missing or expired session, derives the signed-in identity server-side, authorizes governance access to the selected conversation, and suppresses former-member data for an ordinary member. A `MEMBERS` success returns the roster, editable suspension values, public participant and suspension UIDs, ownership-continuity display state, and applicable allowed actions. A `SETTINGS` success instead returns the complete editable tag list, tag count, read-only discovery and matching display values, lifecycle state, viewer role, and settings `allowedActions`. Unavailable, denied, empty, archived, and retryable-failure branches return only display-ready status and allowed next actions; they do not return an unauthorized roster or editable controls. The requirements still leave the human identity provider unresolved; the cookie documents this UX API's browser session transport, not an identity-provider choice.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

#### Requested view: `MEMBERS`

```json
{
  "result": "SUCCEEDED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "view": "MEMBERS",
  "lifecycleStatus": "ACTIVE",
  "viewerRole": "OWNER",
  "displayTimeZone": "America/New_York",
  "activeCount": 3,
  "formerCount": 1,
  "ownerContinuity": {
    "isCurrentViewerLastActiveOwner": true,
    "message": "Promote another participant to owner or archive the conversation before leaving."
  },
  "participants": [
    {
      "participantUid": "8f14e45fceea467a9b53c3f5e5d5c918",
      "displayName": "Rowan Ellis",
      "identityType": "PERSON",
      "role": "OWNER",
      "membershipState": "ACTIVE",
      "accessState": "ACTIVE",
      "memberSince": "2026-05-14T13:00:00Z",
      "postingSuspension": null,
      "allowedActions": []
    },
    {
      "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
      "displayName": "Avery Brooks",
      "identityType": "PERSON",
      "role": "MEMBER",
      "membershipState": "ACTIVE",
      "accessState": "ACTIVE",
      "memberSince": "2026-06-02T15:30:00Z",
      "postingSuspension": null,
      "allowedActions": ["PROMOTE_TO_OWNER", "PROMOTE_TO_ADMINISTRATOR", "CREATE_POSTING_SUSPENSION", "REMOVE_PARTICIPANT", "BAN_IDENTITY"]
    },
    {
      "participantUid": "c7d934725d23424daf163bf811a3506e",
      "displayName": "Patchwork Bot",
      "identityType": "BOT",
      "role": "MEMBER",
      "membershipState": "ACTIVE",
      "accessState": "POSTING_SUSPENDED",
      "memberSince": "2026-06-08T12:15:00Z",
      "postingSuspension": {
        "suspensionUid": "9d19c22f3a024ee08c9bcf677dab8f2b",
        "endsAt": "2026-08-01T14:30:00Z",
        "displayTimeZone": "America/New_York"
      },
      "allowedActions": ["UPDATE_POSTING_SUSPENSION", "END_POSTING_SUSPENSION", "REMOVE_PARTICIPANT", "BAN_IDENTITY"]
    },
    {
      "participantUid": "4be219f68d0b4e6486fe7d9cc4e8717b",
      "displayName": "Release Notes Bot",
      "identityType": "BOT",
      "role": "MEMBER",
      "membershipState": "BANNED",
      "accessState": "INACTIVE",
      "memberSince": "2026-04-09T09:00:00Z",
      "bannedAt": "2026-07-10T17:05:00Z",
      "postingSuspension": null,
      "allowedActions": ["RESTORE_BANNED_PARTICIPANT"]
    }
  ]
}
```

#### Requested view: `SETTINGS`

```json
{
  "result": "SUCCEEDED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "view": "SETTINGS",
  "lifecycleStatus": "ACTIVE",
  "viewerRole": "OWNER",
  "currentStep": "SETTINGS",
  "tags": [
    "design-systems",
    "accessibility",
    "frontend",
    "product-design"
  ],
  "tagCount": 4,
  "discovery": {
    "visibility": "LISTED",
    "displayLabel": "Listed"
  },
  "matching": {
    "mode": "EXCLUSIVE",
    "displayLabel": "Exclusive",
    "displayMeaning": "People find this conversation only when their search matches the complete tag set."
  },
  "allowedActions": [
    "UPDATE_CONVERSATION_TAGS",
    "ARCHIVE_CONVERSATION"
  ]
}
```

## Promote Participant Role : (`POST /api/v0/governance/promote-participant-role`)

Promotes an eligible active participant to the owner or administrator role selected by the current owner. The current conversation comes from the page route, while the selected participant public identifier and target role come from the loaded roster and visible row action; the response must provide the updated role, permitted row actions, and ownership-continuity state or a blocked, stale-permission, or failed result.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Promote Participant to Owner`
- `docs/mockup/desktop/governance/members.md` — `Promote Participant to Administrator`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
POST /api/v0/governance/promote-participant-role
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route. `participantUid` and the row's offered `targetRole` come from the selected participant and `allowedActions` in the prior `MEMBERS` governance response. The browser invokes this route only after the visible promotion confirmation; no duplicate confirmation field is sent.

The UX API derives the current viewer from the session, verifies that the viewer is still an owner and that the participant and requested role remain eligible, records the role change, and recomputes ownership continuity. A blocked or stale-permission response leaves the existing row unchanged and returns display-ready feedback plus current allowed actions; a success returns the authoritative role, row actions, and owner-continuity state.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "targetRole": "ADMINISTRATOR"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "participant": {
    "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
    "displayName": "Avery Brooks",
    "role": "ADMINISTRATOR",
    "membershipState": "ACTIVE",
    "accessState": "ACTIVE",
    "allowedActions": [
      "PROMOTE_TO_OWNER",
      "CREATE_POSTING_SUSPENSION",
      "REMOVE_PARTICIPANT",
      "BAN_IDENTITY"
    ]
  },
  "ownerContinuity": {
    "hasAnotherActiveOwner": false
  }
}
```

## Remove Participant : (`DELETE /api/v0/governance/remove-participant`)

Ends an eligible participant's active conversation membership without deleting retained membership or authored content. The current conversation comes from the page route and the selected participant public identifier comes from the roster row, allowing the UX API to enforce current role authority and final-owner continuity and then return the participant's retained former state, updated counts, or a protected, stale-permission, or failed outcome.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Remove Participant`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
DELETE /api/v0/governance/remove-participant
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route, and `participantUid` comes from the selected active row in the prior `MEMBERS` governance response. The browser invokes this route only after the user's affirmative choice in the visible removal dialog; no duplicate confirmation field is sent.

The UX API derives the viewer and current roles from the session and conversation, checks authority and last-owner continuity, ends the eligible membership without hard deletion, and retains authored content and membership history. Protected-owner, stale-permission, already-former, and retryable-failure responses leave the roster unchanged and return display-ready feedback; success returns the retained former row and authoritative counts.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "participant": {
    "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
    "displayName": "Avery Brooks",
    "role": "MEMBER",
    "membershipState": "REMOVED",
    "accessState": "INACTIVE",
    "endedAt": "2026-07-23T16:42:00Z",
    "allowedActions": [
      "BAN_IDENTITY"
    ]
  },
  "activeCount": 2,
  "formerCount": 2
}
```

## Ban Identity : (`POST /api/v0/governance/ban-identity`)

Bans the identity selected from either the active or former roster, retaining its conversation history while ending active participation and preventing rejoin. The current conversation comes from the page route and the selected participant public identifier comes from the roster result, so active-member, former-member, eligible non-final-owner, protected-owner, stale-permission, and failed branches can all be resolved server-side.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Ban Identity`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
POST /api/v0/governance/ban-identity
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route, while `participantUid` comes from the selected active or former row in the prior `MEMBERS` governance response. The browser invokes this route only after the visible ban confirmation; no duplicate confirmation field is sent.

The UX API derives the viewer's authority, the target's current membership, and ownership continuity server-side. It retains membership history, ends active participation when necessary, and prevents rejoin. Protected-owner, stale-permission, already-banned, and retryable-failure responses preserve the current row and return safe feedback; success returns the banned former-row state, updated counts, and the next allowed action.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "participant": {
    "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
    "displayName": "Avery Brooks",
    "role": "MEMBER",
    "membershipState": "BANNED",
    "accessState": "INACTIVE",
    "bannedAt": "2026-07-23T16:45:00Z",
    "canRejoin": false,
    "allowedActions": [
      "RESTORE_BANNED_PARTICIPANT"
    ]
  },
  "activeCount": 2,
  "formerCount": 2
}
```

## Restore Banned Participant : (`POST /api/v0/governance/restore-banned-participant`)

Ends the selected identity's ban and restores the requirements-backed active role while retaining the earlier membership and ban history. The browser carries the banned participant public identifier and displayed retained role from the authorized roster, and the response must provide the restored active roster entry and updated counts or a stale-permission or failed outcome.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Restore Banned Participant`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
POST /api/v0/governance/restore-banned-participant
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route, and `participantUid` comes from the selected banned row in the prior `MEMBERS` governance response. The browser invokes this route only after the visible restoration confirmation; no duplicate confirmation field is sent. The browser does not send the retained role as an instruction; it may display that role from the roster, but the UX API determines the appropriate restored role from authoritative membership history.

The UX API derives the viewer's current authority and the participant's retained history, ends the ban, and restores the requirements-backed active role. A stale-permission, no-longer-banned, protected, or retryable-failure response preserves the ban and returns display-ready feedback; success returns the authoritative restored roster entry, counts, and permitted next actions.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "participantUid": "4be219f68d0b4e6486fe7d9cc4e8717b"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "participant": {
    "participantUid": "4be219f68d0b4e6486fe7d9cc4e8717b",
    "displayName": "Release Notes Bot",
    "identityType": "BOT",
    "role": "MEMBER",
    "membershipState": "ACTIVE",
    "accessState": "ACTIVE",
    "restoredAt": "2026-07-23T16:48:00Z",
    "allowedActions": [
      "PROMOTE_TO_OWNER",
      "PROMOTE_TO_ADMINISTRATOR",
      "CREATE_POSTING_SUSPENSION",
      "REMOVE_PARTICIPANT",
      "BAN_IDENTITY"
    ]
  },
  "activeCount": 4,
  "formerCount": 0
}
```

## Create Posting Suspension : (`POST /api/v0/governance/create-posting-suspension`)

Creates a new time-bounded posting suspension for the active participant selected in the roster while preserving membership and reading access. The selected participant public identifier comes from the roster and the end date, end time, and displayed time-zone context come from the visible form; the response must expose the authoritative suspension public reference, effective end, updated permitted actions, and validation, stale-permission, or failed branches needed by the page.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Create Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
POST /api/v0/governance/create-posting-suspension
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route, and `participantUid` comes from the selected unsuspended row whose `allowedActions` includes `CREATE_POSTING_SUSPENSION` in the prior `MEMBERS` governance response. `endsAt` is the UTC instant produced from the visible end-date and end-time fields. `displayTimeZone` carries the exact IANA value from that response's display context (`America/New_York`); the visible `ET` label alone is not used as the request value. No suspension UID exists in this create request.

The UX API derives authority and current membership from the session, validates that the target remains active and unsuspended and that the end is in the future, then creates the restriction while preserving membership and reading access. Validation responses identify the visible field to correct; stale-permission, already-suspended, or retryable-failure responses keep posting active. Success returns the public suspension UID and editable authoritative end needed by later update and end actions.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "endsAt": "2026-08-01T14:30:00Z",
  "displayTimeZone": "America/New_York"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "accessState": "POSTING_SUSPENDED",
  "postingSuspension": {
    "suspensionUid": "9d19c22f3a024ee08c9bcf677dab8f2b",
    "endsAt": "2026-08-01T14:30:00Z",
    "displayTimeZone": "America/New_York"
  },
  "allowedActions": [
    "UPDATE_POSTING_SUSPENSION",
    "END_POSTING_SUSPENSION",
    "REMOVE_PARTICIPANT",
    "BAN_IDENTITY"
  ]
}
```

## Update Posting Suspension : (`PATCH /api/v0/governance/update-posting-suspension`)

Updates the end of an already identified posting suspension without creating a replacement suspension. The existing suspension public reference and current editable end come from the roster load, while the revised end date, end time, and displayed time-zone context come from the visible form; the response must return the revised authoritative end and current access state or a stale, missing, validation, or failed result.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Update Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
PATCH /api/v0/governance/update-posting-suspension
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route. `suspensionUid`, the form's prefilled current `endsAt`, and the exact IANA `displayTimeZone` come from the selected suspended row and display context in the prior `MEMBERS` governance response; that row's `allowedActions` includes `UPDATE_POSTING_SUSPENSION`. The UX API resolves the participant from that suspension reference. `endsAt` is the revised UTC instant produced from the visible date and time, while `displayTimeZone` carries the response value `America/New_York`.

The UX API derives authority and current restriction state from the session and supplied public UIDs, verifies that the identified suspension is still current, and validates the revised future end. Validation responses identify the visible field to correct; stale, missing, stale-permission, and retryable-failure responses preserve the existing end. Success returns the same public suspension UID with its authoritative revised editable end and current allowed actions.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "suspensionUid": "9d19c22f3a024ee08c9bcf677dab8f2b",
  "endsAt": "2026-08-08T18:00:00Z",
  "displayTimeZone": "America/New_York"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "participantUid": "c7d934725d23424daf163bf811a3506e",
  "accessState": "POSTING_SUSPENDED",
  "postingSuspension": {
    "suspensionUid": "9d19c22f3a024ee08c9bcf677dab8f2b",
    "endsAt": "2026-08-08T18:00:00Z",
    "displayTimeZone": "America/New_York"
  },
  "allowedActions": [
    "UPDATE_POSTING_SUSPENSION",
    "END_POSTING_SUSPENSION",
    "REMOVE_PARTICIPANT",
    "BAN_IDENTITY"
  ]
}
```

## End Posting Suspension : (`DELETE /api/v0/governance/end-posting-suspension`)

Ends the currently identified posting suspension immediately and restores posting access while retaining the restriction history. The browser obtains the suspension public reference and participant public identifier from the roster load and sends the visible confirmation intent; the response must return the active access state and permitted actions or a stale, missing, or failed result.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `End Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
DELETE /api/v0/governance/end-posting-suspension
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route, and `suspensionUid` comes from the selected suspended row whose `allowedActions` includes `END_POSTING_SUSPENSION` in the prior `MEMBERS` governance response; the UX API resolves the participant from that suspension reference. The browser invokes this route only after the visible immediate-end confirmation; no duplicate confirmation field is sent.

The UX API derives authority and current restriction state server-side, verifies that the public suspension still applies to the selected participant, and ends it while retaining history. Missing, already-ended, stale-permission, and retryable-failure responses keep the visible suspension until the roster is reconciled and return safe feedback; success returns active posting access and replacement allowed actions.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "suspensionUid": "9d19c22f3a024ee08c9bcf677dab8f2b"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "participantUid": "c7d934725d23424daf163bf811a3506e",
  "accessState": "ACTIVE",
  "postingSuspension": null,
  "endedAt": "2026-07-23T16:52:00Z",
  "allowedActions": [
    "CREATE_POSTING_SUSPENSION",
    "REMOVE_PARTICIPANT",
    "BAN_IDENTITY"
  ]
}
```

## Update Conversation Tags : (`PATCH /api/v0/governance/update-conversation-tags`)

Updates the complete tag set for the existing conversation identified by the page route. The browser sends the visible edited tag values, while the UX API derives the current viewer from browser-managed authentication context and returns committed display tags or field-level, stale-permission, lifecycle-locked, and retryable-failure outcomes that let the page preserve or reconcile its draft.

### Source Actions

- `docs/mockup/desktop/governance/settings.md` — `Update Conversation Tags`

### Mockup Files

- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`

### Route

```http
PATCH /api/v0/governance/update-conversation-tags
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route. `tags` is the complete ordered set currently visible in the editor after the user adds or removes chips; it is not an incremental patch.

The UX API derives the viewer, conversation lifecycle, current persisted tag set, normalization policy, and permissions server-side. It authoritatively validates the one-to-ten boundary and tag grammar. Field-validation responses return display-ready field feedback without committing changes; stale-permission or lifecycle-locked responses return the authoritative committed tags and remove unsafe controls; retryable failures leave the browser draft intact. Success returns the committed display tags, lifecycle state, allowed actions, and the visible next-page instruction.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "tags": [
    "design-systems",
    "accessibility",
    "frontend",
    "research"
  ]
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "tags": [
    "design-systems",
    "accessibility",
    "frontend",
    "research"
  ],
  "tagCount": 4,
  "lifecycleStatus": "ACTIVE",
  "allowedActions": [
    "UPDATE_CONVERSATION_TAGS",
    "ARCHIVE_CONVERSATION"
  ]
}
```

## Archive Conversation : (`POST /api/v0/governance/archive-conversation`)

Archives the active conversation identified by the page route after explicit owner confirmation, ending active use without hard deletion. The UX API rechecks current owner authority and actionable lifecycle state server-side and returns the authoritative archived state and effective timestamp or an unsaved-change, stale-permission, administrator-blocked, or retryable-failure outcome; the browser does not supply retention rules or internal ownership state.

### Source Actions

- `docs/mockup/desktop/governance/settings.md` — `Archive Conversation`

### Mockup Files

- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`

### Route

```http
POST /api/v0/governance/archive-conversation
Cookie: tawk_session={opaqueSessionRef}
Content-Type: application/json
```

### Request Context

The browser sends the browser-managed `tawk_session` cookie. `conversationUid` comes from the current conversation page route. The browser invokes this route only after the owner's affirmative choice in the visible archive dialog; no duplicate confirmation field is sent. Unsaved tag drafts remain browser-local and block invocation, so no draft tags or retention settings are sent.

The UX API derives the viewer's current role and the conversation's lifecycle server-side, verifies that the session still represents an owner and the conversation is still active, then archives it without hard deletion. Administrator-blocked, stale-permission, already-archived, and retryable-failure responses preserve the active UI state and return safe feedback; success returns the archived lifecycle state, effective timestamp, retained-record display confirmation, and no further governance actions.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479"
}
```

### Example Response Payload

```json
{
  "result": "SUCCEEDED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "lifecycleStatus": "ARCHIVED",
  "archivedAt": "2026-07-23T16:55:00Z",
  "recordsRetained": true,
  "allowedActions": []
}
```
