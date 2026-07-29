---
type: route-review-feedback
source_review: docs/mockup/routes/governance-routes-review.md
review_fingerprint: sha256:2eb30d67edbafaeb279eb8d8a41f27142cce19c59642f5efec076cb1b399c14e
target_artifact: docs/mockup/routes/governance-routes.md
---

# Governance Routes Review Feedback

This immutable snapshot captures the failing findings from `docs/mockup/routes/governance-routes-review.md` at review fingerprint `sha256:2eb30d67edbafaeb279eb8d8a41f27142cce19c59642f5efec076cb1b399c14e`.

## Failing Route Findings

## Retrieve Conversation Governance : (`GET /api/v0/governance/retrieve-conversation-governance`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}`

Reason: The page route, selected view, and documented session cookie can form the request, but the concrete `MEMBERS` response reports five active and two former participants while returning an empty `participants` array. It therefore cannot render the required roster or supply the participant and suspension public UIDs needed by the page's later actions.

Suggested fix:

Populate the concrete `MEMBERS` response with the actual authorized roster. Show representative active, suspended, and banned entries with exact public UIDs, role/access state, permitted actions, and the IANA time-zone value used by the suspension form:

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

## Promote Participant Role : (`POST /api/v0/governance/promote-participant-role`)

**Decision:** FAIL

Operations reviewed: `POST /api/v0/governance/promote-participant-role`

Reason: The mutation's own request and response are concrete and keep authority decisions server-side, but its required `participantUid` and offered target role are said to come from the prior roster response. The only concrete `MEMBERS` example has no participant entry, so the page cannot obtain those carry-forward values before confirmation.

Suggested fix:

Add an eligible participant object to the concrete `MEMBERS` response with `participantUid` and exact promotion actions:

```json
{
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "allowedActions": [
    "PROMOTE_TO_OWNER",
    "PROMOTE_TO_ADMINISTRATOR"
  ]
}
```

## Remove Participant : (`DELETE /api/v0/governance/remove-participant`)

**Decision:** FAIL

Operations reviewed: `DELETE /api/v0/governance/remove-participant`

Reason: The conversation UID and session are documented, and the success response can redraw the former row and counts, but the selected participant's public UID exists only in prose because the concrete prior `MEMBERS` response contains no roster rows.

Suggested fix:

Add an eligible active participant to the concrete `MEMBERS` response with the exact carry-forward identifier and action:

```json
{
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "membershipState": "ACTIVE",
  "allowedActions": [
    "REMOVE_PARTICIPANT"
  ]
}
```

## Ban Identity : (`POST /api/v0/governance/ban-identity`)

**Decision:** FAIL

Operations reviewed: `POST /api/v0/governance/ban-identity`

Reason: The route correctly leaves ban eligibility and owner continuity to the UX API, and its success result is UI-ready, but the required selected `participantUid` is not present in the concrete prior roster response for either an active or former row.

Suggested fix:

Add a ban-eligible participant entry to the concrete `MEMBERS` response:

```json
{
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "membershipState": "ACTIVE",
  "allowedActions": [
    "BAN_IDENTITY"
  ]
}
```

## Restore Banned Participant : (`POST /api/v0/governance/restore-banned-participant`)

**Decision:** FAIL

Operations reviewed: `POST /api/v0/governance/restore-banned-participant`

Reason: The route properly derives the role to restore from authoritative history and returns the complete active row, but the concrete prior `MEMBERS` response has no banned participant entry from which the browser can carry `participantUid` into the request.

Suggested fix:

Add the banned roster entry and its restore action to the concrete `MEMBERS` response:

```json
{
  "participantUid": "4be219f68d0b4e6486fe7d9cc4e8717b",
  "role": "MEMBER",
  "membershipState": "BANNED",
  "allowedActions": [
    "RESTORE_BANNED_PARTICIPANT"
  ]
}
```

## Create Posting Suspension : (`POST /api/v0/governance/create-posting-suspension`)

**Decision:** FAIL

Operations reviewed: `POST /api/v0/governance/create-posting-suspension`

Reason: The visible date and time can supply `endsAt`, and the success response concretely returns the suspension UID needed later, but the empty concrete roster supplies neither the target `participantUid` nor the `America/New_York` value sent as `displayTimeZone`; the mockup itself displays only the label `ET`.

Suggested fix:

Add the selected active participant and exact IANA time-zone context to the concrete `MEMBERS` response so the browser can form this request:

```json
{
  "displayTimeZone": "America/New_York",
  "participants": [
    {
      "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
      "accessState": "ACTIVE",
      "allowedActions": [
        "CREATE_POSTING_SUSPENSION"
      ]
    }
  ]
}
```

## Update Posting Suspension : (`PATCH /api/v0/governance/update-posting-suspension`)

**Decision:** FAIL

Operations reviewed: `PATCH /api/v0/governance/update-posting-suspension`

Reason: The revised date and time are visible and the mutation response is adequate, but the concrete prior `MEMBERS` response does not show the exact `suspensionUid`, current `endsAt`, or `America/New_York` time-zone value that the route says prefill and form the request.

Suggested fix:

Add a suspended participant with the exact carry-forward suspension object and time-zone context to the concrete `MEMBERS` response:

```json
{
  "displayTimeZone": "America/New_York",
  "participants": [
    {
      "participantUid": "c7d934725d23424daf163bf811a3506e",
      "accessState": "POSTING_SUSPENDED",
      "postingSuspension": {
        "suspensionUid": "9d19c22f3a024ee08c9bcf677dab8f2b",
        "endsAt": "2026-08-01T14:30:00Z"
      },
      "allowedActions": [
        "UPDATE_POSTING_SUSPENSION"
      ]
    }
  ]
}
```

## End Posting Suspension : (`DELETE /api/v0/governance/end-posting-suspension`)

**Decision:** FAIL

Operations reviewed: `DELETE /api/v0/governance/end-posting-suspension`

Reason: The conversation route and confirmation timing are documented and the success response restores a directly renderable active state, but the exact `suspensionUid` required by the request appears only in prose because the concrete prior roster response contains no suspended row.

Suggested fix:

Add the public suspension reference and end action to a concrete suspended roster entry:

```json
{
  "participantUid": "c7d934725d23424daf163bf811a3506e",
  "postingSuspension": {
    "suspensionUid": "9d19c22f3a024ee08c9bcf677dab8f2b",
    "endsAt": "2026-08-01T14:30:00Z"
  },
  "allowedActions": [
    "END_POSTING_SUSPENSION"
  ]
}
```
