# Governance Routes

## Retrieve Conversation Roster : (`GET /api/v0/governance/retrieve-conversation-roster`)

Retrieves the authorized, UI-ready participant roster for the Members and Roles page. It supports owner and administrator views, active and retained former membership, posting restrictions, ownership-continuity protection, empty states, denied entry, and retryable load failure for the conversation identified by the current page route.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Retrieve Conversation Roster`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
GET /api/v0/governance/retrieve-conversation-roster?conversationUid={conversationUid}&filter={activeOrFormer}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser sends its managed `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current Members and Roles page route, and `filter` comes from the visible Active or Former selection as `ACTIVE` or `FORMER`. The UX API derives the viewer identity and conversation authority server-side; an unauthorized viewer receives a permission-denied result with no former roster data, while unavailable or retryable retrieval returns no participant collection.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "filter": "ACTIVE",
  "rosterVersion": 12,
  "viewerRole": "OWNER",
  "activeCount": 5,
  "formerCount": 2,
  "ownershipContinuity": {
    "protectedParticipantUid": "2c5ea4c0d4a34d79a35b4f558d35b2bc",
    "message": "Rowan Ellis is the last active owner. Promote another participant to owner or archive the conversation before removing this owner."
  },
  "participants": [
    {
      "participantUid": "7d4448409dc0432e8f7a7d35f62b3af1",
      "displayName": "Avery Brooks",
      "identityType": "PERSON",
      "role": "MEMBER",
      "membershipState": "ACTIVE",
      "accessState": "ACTIVE",
      "since": "2026-06-02",
      "allowedActions": [
        "PROMOTE_TO_OWNER",
        "PROMOTE_TO_ADMINISTRATOR",
        "CREATE_POSTING_SUSPENSION",
        "REMOVE",
        "BAN"
      ]
    },
    {
      "participantUid": "9a6b0f2e176a4dd89db4155871c86e2d",
      "displayName": "Patchwork Bot",
      "identityType": "BOT",
      "role": "MEMBER",
      "membershipState": "ACTIVE",
      "accessState": "POSTING_SUSPENDED",
      "since": "2026-06-08",
      "postingSuspension": {
        "suspensionUid": "9f1c2d3e4a5b4c6d8e9f001122334455",
        "endsAt": "2026-08-14T13:00:00-04:00",
        "endDate": "2026-08-14",
        "endTime": "13:00",
        "timeZone": "America/New_York",
        "timeZoneLabel": "ET"
      },
      "allowedActions": [
        "PROMOTE_TO_OWNER",
        "PROMOTE_TO_ADMINISTRATOR",
        "UPDATE_POSTING_SUSPENSION",
        "END_POSTING_SUSPENSION",
        "REMOVE",
        "BAN"
      ]
    }
  ]
}
```

## Update Participant Role : (`PATCH /api/v0/governance/update-participant-role`)

Changes an eligible active participant to the owner or administrator role from the Members and Roles page. The selected participant comes from the retrieved roster, the target role comes from the visible promotion action, and the operation preserves the distinct owner-only authority and ownership-continuity outcomes required by the two promotion flows.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Promote Participant to Owner`
- `docs/mockup/desktop/governance/members.md` — `Promote Participant to Administrator`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
PATCH /api/v0/governance/update-participant-role?conversationUid={conversationUid}&participantUid={participantUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "roster-{rosterVersion}"
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the current page route; `participantUid` and `rosterVersion` come from Retrieve Conversation Roster; `targetRole` comes from the visible promotion action. The UX API rechecks owner authority and ownership continuity. A stale roster version returns the current `rosterVersion` for reload, and a blocked or permission-denied result leaves the displayed participant unchanged.

### Example Request Payload

```json
{
  "targetRole": "ADMINISTRATOR"
}
```

### Example Response Payload

```json
{
  "outcome": "UPDATED",
  "rosterVersion": 13,
  "participant": {
    "participantUid": "7d4448409dc0432e8f7a7d35f62b3af1",
    "displayName": "Avery Brooks",
    "role": "ADMINISTRATOR",
    "membershipState": "ACTIVE",
    "accessState": "ACTIVE",
    "allowedActions": [
      "PROMOTE_TO_OWNER",
      "CREATE_POSTING_SUSPENSION",
      "REMOVE",
      "BAN"
    ]
  },
  "ownershipContinuityProtected": true
}
```

## Remove Participant : (`DELETE /api/v0/governance/remove-participant`)

Ends the selected participant's active conversation membership without hard deletion, retaining membership history and authored content. It supports owner and administrator actions while enforcing the stricter owner-target and last-owner protections represented on the Members and Roles page.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Remove Participant`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
DELETE /api/v0/governance/remove-participant?conversationUid={conversationUid}&participantUid={participantUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "roster-{rosterVersion}"
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the page route; `participantUid` and `rosterVersion` come from the selected Retrieve Conversation Roster row. Opening and accepting the visible confirmation is the removal intent, so no JSON body is needed. The UX API rechecks role authority and last-owner protection; protected, stale, or denied results preserve active membership and return a display-safe reason plus the latest roster version when available.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "outcome": "REMOVED",
  "rosterVersion": 13,
  "activeCount": 4,
  "formerCount": 3,
  "participant": {
    "participantUid": "7d4448409dc0432e8f7a7d35f62b3af1",
    "displayName": "Avery Brooks",
    "role": "MEMBER",
    "membershipState": "FORMER",
    "accessState": "REMOVED",
    "removedAt": "2026-07-30T15:42:00Z",
    "canRejoin": true,
    "allowedActions": [
      "BAN"
    ]
  }
}
```

## Ban Identity : (`POST /api/v0/governance/ban-identity`)

Bans the selected active or former identity from the current conversation and prevents future rejoin while retaining membership and role history. The operation supports the page's confirmation flow, active-to-former transition, owner-continuity checks, and protected or stale failure outcomes.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Ban Identity`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
POST /api/v0/governance/ban-identity?conversationUid={conversationUid}&participantUid={participantUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "roster-{rosterVersion}"
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the page route; `participantUid` and `rosterVersion` come from the selected active or former Retrieve Conversation Roster row. Accepting the visible confirmation supplies ban intent, so no JSON body is needed. The UX API enforces current moderation authority and owner continuity; a protected, stale, or denied result leaves membership and rejoin eligibility unchanged and returns a display-safe reason.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "outcome": "BANNED",
  "rosterVersion": 13,
  "activeCount": 4,
  "formerCount": 3,
  "participant": {
    "participantUid": "7d4448409dc0432e8f7a7d35f62b3af1",
    "displayName": "Avery Brooks",
    "role": "MEMBER",
    "membershipState": "FORMER",
    "accessState": "BANNED",
    "bannedAt": "2026-07-30T15:42:00Z",
    "canRejoin": false,
    "allowedActions": [
      "RESTORE"
    ]
  }
}
```

## Restore Banned Participant : (`POST /api/v0/governance/restore-banned-participant`)

Ends the selected former participant's ban and restores an appropriate active conversation role while retaining the prior ban and role history. It follows the requirements-backed restoration flow for the banned roster entry and returns the active state needed to update the roster.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Restore Banned Participant`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
POST /api/v0/governance/restore-banned-participant?conversationUid={conversationUid}&participantUid={participantUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "roster-{rosterVersion}"
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the page route; `participantUid`, the retained role, and `rosterVersion` come from the selected banned Retrieve Conversation Roster row. Accepting the visible confirmation supplies restoration intent; the retained role is display context, not a browser-selected rule input. The UX API decides the appropriate restored role under current authority. A stale or denied result keeps the ban in force.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "outcome": "RESTORED",
  "rosterVersion": 13,
  "activeCount": 6,
  "formerCount": 1,
  "participant": {
    "participantUid": "5a2d7f1c3b9e4f108c6d72a55b891304",
    "displayName": "Release Notes Bot",
    "identityType": "BOT",
    "role": "MEMBER",
    "membershipState": "ACTIVE",
    "accessState": "ACTIVE",
    "canRejoin": true,
    "allowedActions": [
      "PROMOTE_TO_OWNER",
      "PROMOTE_TO_ADMINISTRATOR",
      "CREATE_POSTING_SUSPENSION",
      "REMOVE",
      "BAN"
    ]
  }
}
```

## Create Posting Suspension : (`POST /api/v0/governance/create-posting-suspension`)

Creates a time-bounded posting restriction for an active, currently unsuspended participant while leaving membership and reading access intact. The participant is selected from the roster and the visible form supplies the requested end date, end time, and displayed time-zone context.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Create Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
POST /api/v0/governance/create-posting-suspension?conversationUid={conversationUid}&participantUid={participantUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "roster-{rosterVersion}"
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the page route; `participantUid` and `rosterVersion` come from the selected unsuspended Retrieve Conversation Roster row; the end date, time, and displayed time zone come from the visible suspension form. No suspension UID exists for this create operation. The UX API authorizes the restriction and computes the authoritative end; field errors keep the form open, and stale or denied results leave posting access unchanged.

### Example Request Payload

```json
{
  "endDate": "2026-08-14",
  "endTime": "13:00",
  "timeZone": "America/New_York"
}
```

### Example Response Payload

```json
{
  "outcome": "CREATED",
  "rosterVersion": 13,
  "participantUid": "7d4448409dc0432e8f7a7d35f62b3af1",
  "accessState": "POSTING_SUSPENDED",
  "postingSuspension": {
    "suspensionUid": "9f1c2d3e4a5b4c6d8e9f001122334455",
    "endsAt": "2026-08-14T13:00:00-04:00",
    "endDate": "2026-08-14",
    "endTime": "13:00",
    "timeZone": "America/New_York",
    "displayEnd": "Aug 14, 2026 · 1:00 PM ET"
  },
  "allowedActions": [
    "PROMOTE_TO_OWNER",
    "PROMOTE_TO_ADMINISTRATOR",
    "UPDATE_POSTING_SUSPENSION",
    "END_POSTING_SUSPENSION",
    "REMOVE",
    "BAN"
  ]
}
```

## Update Posting Suspension : (`PATCH /api/v0/governance/update-posting-suspension`)

Updates the end of an existing posting suspension for the participant selected from the roster. The roster retrieval must provide the existing suspension's public reference and editable end values so the prefilled change flow can submit a feasible update and preserve the current restriction on stale or failed outcomes.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `Update Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
PATCH /api/v0/governance/update-posting-suspension?conversationUid={conversationUid}&suspensionUid={suspensionUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "roster-{rosterVersion}"
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the page route; `suspensionUid`, current editable end values, and `rosterVersion` come from the selected participant’s posting-suspension object in Retrieve Conversation Roster; the revised date, time, and time zone come from the visible form. The UX API resolves the participant from the public suspension reference and authorizes the change. Field errors keep the form open, and stale, missing, denied, or retryable outcomes keep the current suspension intact.

### Example Request Payload

```json
{
  "endDate": "2026-08-21",
  "endTime": "17:30",
  "timeZone": "America/New_York"
}
```

### Example Response Payload

```json
{
  "outcome": "UPDATED",
  "rosterVersion": 13,
  "participantUid": "9a6b0f2e176a4dd89db4155871c86e2d",
  "accessState": "POSTING_SUSPENDED",
  "postingSuspension": {
    "suspensionUid": "9f1c2d3e4a5b4c6d8e9f001122334455",
    "endsAt": "2026-08-21T17:30:00-04:00",
    "endDate": "2026-08-21",
    "endTime": "17:30",
    "timeZone": "America/New_York",
    "displayEnd": "Aug 21, 2026 · 5:30 PM ET"
  },
  "allowedActions": [
    "PROMOTE_TO_OWNER",
    "PROMOTE_TO_ADMINISTRATOR",
    "UPDATE_POSTING_SUSPENSION",
    "END_POSTING_SUSPENSION",
    "REMOVE",
    "BAN"
  ]
}
```

## End Posting Suspension : (`DELETE /api/v0/governance/end-posting-suspension`)

Ends the selected participant's existing posting suspension immediately while retaining restriction history and active membership. The suspension's public reference is carried forward from the roster result, allowing the confirmation flow to restore posting access without hidden frontend state.

### Source Actions

- `docs/mockup/desktop/governance/members.md` — `End Posting Suspension`

### Mockup Files

- `docs/mockup/desktop/governance/members.html`
- `docs/mockup/desktop/governance/members.md`

### Route

```http
DELETE /api/v0/governance/end-posting-suspension?conversationUid={conversationUid}&suspensionUid={suspensionUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "roster-{rosterVersion}"
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the page route; `suspensionUid` and `rosterVersion` come from the selected participant’s posting-suspension object in Retrieve Conversation Roster. Accepting the visible confirmation supplies immediate-end intent, so no JSON body is needed. The UX API resolves the participant from the public suspension reference, authorizes the action, and retains restriction history; stale, missing, denied, or retryable outcomes keep the suspension in force.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "outcome": "ENDED",
  "rosterVersion": 13,
  "participantUid": "9a6b0f2e176a4dd89db4155871c86e2d",
  "accessState": "ACTIVE",
  "postingSuspension": null,
  "allowedActions": [
    "PROMOTE_TO_OWNER",
    "PROMOTE_TO_ADMINISTRATOR",
    "CREATE_POSTING_SUSPENSION",
    "REMOVE",
    "BAN"
  ]
}
```

## Retrieve Conversation Governance Settings : (`GET /api/v0/governance/retrieve-conversation-governance-settings`)

Retrieves the UI-ready tags, fixed discovery and matching summary, lifecycle state, viewer role, active-membership state, and allowed governance actions for the Tags and Lifecycle page. It supports editable owner and administrator entry, owner-only archival, archived read-only display, denied ordinary-member entry, unavailable data, and retryable loading outcomes.

### Source Actions

- `docs/mockup/desktop/governance/settings.md` — `Retrieve Conversation Governance Settings`

### Mockup Files

- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`

### Route

```http
GET /api/v0/governance/retrieve-conversation-governance-settings?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
Accept: application/json
```

### Request Context

The browser sends its managed `Cookie: tawk_session={opaqueSessionRef}`. `conversationUid` comes from the current Tags and Lifecycle page route. The UX API derives the viewer identity, active membership, lifecycle state, and allowed governance actions server-side. An ordinary member receives a denied result without editable governance data; an unavailable or retryable retrieval returns no editable tag set, and an archived result returns the retained tags with no mutating allowed actions.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "governanceVersion": 7,
  "tags": [
    "design-systems",
    "accessibility",
    "frontend",
    "product-design"
  ],
  "discoveryMode": "LISTED",
  "matchingMode": "EXCLUSIVE",
  "matchingMeaning": "People find this conversation only when their search matches the complete tag set.",
  "lifecycleState": "ACTIVE",
  "viewerRole": "OWNER",
  "activeMembership": true,
  "allowedActions": [
    "UPDATE_TAGS",
    "ARCHIVE_CONVERSATION"
  ]
}
```

## Update Conversation Tags : (`PATCH /api/v0/governance/update-conversation-tags`)

Replaces the complete visible tag set for the existing conversation identified by the current page route. It supports owner and administrator editing, authoritative one-to-ten and grammar validation, preservation of the user's draft after retryable failure, and reconciliation when permission or lifecycle state becomes stale.

### Source Actions

- `docs/mockup/desktop/governance/settings.md` — `Update Conversation Tags`

### Mockup Files

- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`

### Route

```http
PATCH /api/v0/governance/update-conversation-tags?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "governance-{governanceVersion}"
Content-Type: application/json
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the current page route; `governanceVersion` comes from Retrieve Conversation Governance Settings; `tags` is the complete visible edited set. The UX API rechecks owner or administrator authority, active lifecycle state, tag grammar, uniqueness, and the one-to-ten count. Field errors identify the rejected visible values, retryable failure preserves the browser draft, and stale or denied results return the latest lifecycle and allowed actions without changing the committed tags.

### Example Request Payload

```json
{
  "tags": [
    "design-systems",
    "accessibility",
    "frontend",
    "team:frontend"
  ]
}
```

### Example Response Payload

```json
{
  "outcome": "UPDATED",
  "governanceVersion": 8,
  "tags": [
    "design-systems",
    "accessibility",
    "frontend",
    "team:frontend"
  ],
  "conversationDisplayIdentity": "#design-systems + #accessibility + #frontend + #team:frontend",
  "returnTo": {
    "page": "CONVERSATION_THREAD",
    "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479"
  }
}
```

## Archive Conversation : (`POST /api/v0/governance/archive-conversation`)

Archives the current active conversation after explicit owner confirmation and an authoritative recheck of owner authority and actionable state. It ends active use without hard deletion, returns the retained archived state needed by the Tags and Lifecycle page, and preserves the unchanged conversation on retryable or stale-permission failure.

### Source Actions

- `docs/mockup/desktop/governance/settings.md` — `Archive Conversation`

### Mockup Files

- `docs/mockup/desktop/governance/settings.html`
- `docs/mockup/desktop/governance/settings.md`

### Route

```http
POST /api/v0/governance/archive-conversation?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
If-Match: "governance-{governanceVersion}"
Accept: application/json
```

### Request Context

The browser sends its managed session cookie and the opaque CSRF value supplied by the authenticated page bootstrap. `conversationUid` comes from the current page route, and `governanceVersion` comes from Retrieve Conversation Governance Settings. The browser invokes this route only after the owner accepts the visible retained-record confirmation and has no unsaved tag draft, so no JSON body is needed. The UX API rechecks owner authority, active lifecycle state, and the supplied version; retryable failure leaves the conversation active, while stale or denied results return the current lifecycle and allowed actions without archiving.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "outcome": "ARCHIVED",
  "governanceVersion": 8,
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "lifecycleState": "ARCHIVED",
  "archivedAt": "2026-07-30T15:42:00Z",
  "recordsRetained": true,
  "allowedActions": []
}
```
