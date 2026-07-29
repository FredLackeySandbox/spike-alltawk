---
type: route-review-story
source_review: docs/mockup/routes/governance-routes-review.md
review_fingerprint: sha256:2eb30d67edbafaeb279eb8d8a41f27142cce19c59642f5efec076cb1b399c14e
source_feedback:
  - docs/feedback/user-review/mockup/routes/005-governance-routes-review.md
target_artifacts:
  - docs/mockup/routes/governance-routes.md
---

# Address Governance Route Review Failures

## Source Feedback

- `docs/feedback/user-review/mockup/routes/005-governance-routes-review.md`

## Source Review

- `docs/mockup/routes/governance-routes-review.md` — `sha256:2eb30d67edbafaeb279eb8d8a41f27142cce19c59642f5efec076cb1b399c14e`

## Target Artifacts

- `docs/mockup/routes/governance-routes.md`

## User Problem

The governance members page cannot render an actionable roster from the documented `MEMBERS` result because that concrete response reports nonzero participant counts but supplies an empty `participants` array. Consequently, the browser has no documented source for the public participant and suspension UIDs, offered actions, access and membership state, current suspension end, or IANA time-zone value that the promotion, removal, ban, restoration, and suspension flows say they carry into later requests.

This breaks the documented continuation path even though the individual mutation requests and responses are otherwise concrete: users cannot select a documented eligible row, confirm the corresponding action, or prefill and submit suspension changes from the preceding response. A few later examples also use participant values that do not match the participant represented by the selected banned or suspended roster entry, obscuring the intended lineage.

## Proposed Change

Update the `Retrieve Conversation Governance` route's concrete `MEMBERS` example in `docs/mockup/routes/governance-routes.md` to show the approved authorized roster with representative active, suspended, and banned entries, exact safe public UIDs, actions, and `America/New_York` display context. Reconcile the directly dependent governance mutation examples so every later request and response carries values and actions from the corresponding concrete roster entry. This is the smallest coherent documentation change that makes all eight failed route continuations independently formable and consistent.

## Requirements And Scope Notes

- The calibrated FAIL findings and their complete suggested-fix blocks are binding; implement them without reopening their decisions or substituting a different design.
- The `/api/v0` route prefix and safe public UIDs remain acceptable.
- Only the concrete named gaps in the calibrated findings are in scope: the contradictory empty `MEMBERS` roster, its missing participant/suspension/time-zone/action carry-forward data, and directly dependent stale example lineage.
- Keep authentication, authorization, eligibility, ownership continuity, restoration role derivation, and suspension resolution server-side as already documented.
- Preserve the existing route purposes, operation methods and paths, session-cookie transport, view selection, and PASS-only behavior.

## Affected Routes

- Retrieve Conversation Governance : (`GET /api/v0/governance/retrieve-conversation-governance`)
  - Operations reviewed: `GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}`
- Promote Participant Role : (`POST /api/v0/governance/promote-participant-role`)
  - Operations reviewed: `POST /api/v0/governance/promote-participant-role`
- Remove Participant : (`DELETE /api/v0/governance/remove-participant`)
  - Operations reviewed: `DELETE /api/v0/governance/remove-participant`
- Ban Identity : (`POST /api/v0/governance/ban-identity`)
  - Operations reviewed: `POST /api/v0/governance/ban-identity`
- Restore Banned Participant : (`POST /api/v0/governance/restore-banned-participant`)
  - Operations reviewed: `POST /api/v0/governance/restore-banned-participant`
- Create Posting Suspension : (`POST /api/v0/governance/create-posting-suspension`)
  - Operations reviewed: `POST /api/v0/governance/create-posting-suspension`
- Update Posting Suspension : (`PATCH /api/v0/governance/update-posting-suspension`)
  - Operations reviewed: `PATCH /api/v0/governance/update-posting-suspension`
- End Posting Suspension : (`DELETE /api/v0/governance/end-posting-suspension`)
  - Operations reviewed: `DELETE /api/v0/governance/end-posting-suspension`

## Acceptance Criteria

### 1. Retrieve Conversation Governance

For `GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}`, update the `Retrieve Conversation Governance` section's `Example Response Payload` → `Requested view: MEMBERS` documentation in `docs/mockup/routes/governance-routes.md`. The example must no longer report five active and two former participants while returning an empty roster. It must populate the concrete authorized roster so the page can render representative active, suspended, and banned entries and obtain the exact safe public participant and suspension UIDs, role and access state, permitted actions, and IANA time-zone value required by later actions. The documented response must be:

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

The `activeCount: 3`, `formerCount: 1`, and four returned participant entries must agree with one another and with the documented active/banned states.

### 2. Promote Participant Role

For `POST /api/v0/governance/promote-participant-role`, verify the `Promote Participant Role` section's `Request Context` and `Example Request Payload` documentation against the concrete `MEMBERS` response in `docs/mockup/routes/governance-routes.md`. The mutation requires its selected `participantUid` and offered target role from that prior roster; the roster must therefore include the following eligible participant object and exact promotion actions before confirmation:

```json
{
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "allowedActions": [
    "PROMOTE_TO_OWNER",
    "PROMOTE_TO_ADMINISTRATOR"
  ]
}
```

The documented request's `participantUid: "a3bb189e8bf943f4a3f107c4b6bb12e3"` and `targetRole: "ADMINISTRATOR"` must be obtainable from that participant row and its `PROMOTE_TO_ADMINISTRATOR` action; authority and current eligibility remain server-side.

The successful participant response must retain `participantUid: "a3bb189e8bf943f4a3f107c4b6bb12e3"` and `displayName: "Avery Brooks"`, set `role: "ADMINISTRATOR"`, `membershipState: "ACTIVE"`, and `accessState: "ACTIVE"`, return `allowedActions` of `PROMOTE_TO_OWNER`, `CREATE_POSTING_SUSPENSION`, `REMOVE_PARTICIPANT`, and `BAN_IDENTITY`, and keep `ownerContinuity.hasAnotherActiveOwner: false`.

### 3. Remove Participant

For `DELETE /api/v0/governance/remove-participant`, verify the `Remove Participant` section's `Request Context` and `Example Request Payload` documentation against the concrete `MEMBERS` response in `docs/mockup/routes/governance-routes.md`. The success response already supports redrawing the retained former row and counts, but the prior roster must provide the selected participant's safe public UID and removal action through this eligible active entry:

```json
{
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "membershipState": "ACTIVE",
  "allowedActions": [
    "REMOVE_PARTICIPANT"
  ]
}
```

The documented request's `participantUid: "a3bb189e8bf943f4a3f107c4b6bb12e3"` must carry forward from that active row, whose `allowedActions` includes `REMOVE_PARTICIPANT`. The successful retained former row must keep that same participant UID and `displayName: "Avery Brooks"`, set `role: "MEMBER"`, `membershipState: "REMOVED"`, `accessState: "INACTIVE"`, and `endedAt: "2026-07-23T16:42:00Z"`, offer `BAN_IDENTITY`, and return `activeCount: 2` and `formerCount: 2` for this operation-specific continuation from the approved three-active/one-former roster.

### 4. Ban Identity

For `POST /api/v0/governance/ban-identity`, verify the `Ban Identity` section's `Request Context` and `Example Request Payload` documentation against the concrete `MEMBERS` response in `docs/mockup/routes/governance-routes.md`. Eligibility and owner continuity remain UX API decisions and the success response remains UI-ready, but the selected active or former roster row must concretely provide the required `participantUid`. The approved ban-eligible entry is:

```json
{
  "participantUid": "a3bb189e8bf943f4a3f107c4b6bb12e3",
  "membershipState": "ACTIVE",
  "allowedActions": [
    "BAN_IDENTITY"
  ]
}
```

The documented request's `participantUid: "a3bb189e8bf943f4a3f107c4b6bb12e3"` must carry forward from that row, whose `allowedActions` includes `BAN_IDENTITY`. The successful banned row must retain that participant UID and `displayName: "Avery Brooks"`, set `role: "MEMBER"`, `membershipState: "BANNED"`, `accessState: "INACTIVE"`, `bannedAt: "2026-07-23T16:45:00Z"`, and `canRejoin: false`, offer only `RESTORE_BANNED_PARTICIPANT`, and return `activeCount: 2` and `formerCount: 2` for this operation-specific continuation.

### 5. Restore Banned Participant

For `POST /api/v0/governance/restore-banned-participant`, verify the `Restore Banned Participant` section's `Request Context`, `Example Request Payload`, and `Example Response Payload` documentation against the concrete `MEMBERS` response in `docs/mockup/routes/governance-routes.md`. The route must continue to derive the role to restore from authoritative history, but the browser must be able to carry the banned participant's public UID from this concrete roster entry:

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

The restoration request must use `participantUid: "4be219f68d0b4e6486fe7d9cc4e8717b"` from that banned row, and the successful restored participant must retain that same `participantUid`, display name `Release Notes Bot`, identity type `BOT`, and role `MEMBER` while changing to `membershipState: "ACTIVE"` and `accessState: "ACTIVE"`. The response must keep `restoredAt: "2026-07-23T16:48:00Z"`, return `allowedActions` of `PROMOTE_TO_OWNER`, `PROMOTE_TO_ADMINISTRATOR`, `CREATE_POSTING_SUSPENSION`, `REMOVE_PARTICIPANT`, and `BAN_IDENTITY`, and return `activeCount: 4` and `formerCount: 0` for this operation-specific continuation from the approved roster. The browser must not send the retained role as an instruction.

### 6. Create Posting Suspension

For `POST /api/v0/governance/create-posting-suspension`, verify the `Create Posting Suspension` section's `Request Context` and `Example Request Payload` documentation against the concrete `MEMBERS` response in `docs/mockup/routes/governance-routes.md`. The visible date and time continue to supply `endsAt`, and the success response continues to return the suspension UID needed by later operations, but the prior roster must supply both the selected active participant and the exact IANA time-zone context needed to form the request:

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

The request must carry `participantUid: "a3bb189e8bf943f4a3f107c4b6bb12e3"` and `displayTimeZone: "America/New_York"` from that response context, submit `endsAt: "2026-08-01T14:30:00Z"` from the visible date and time, and have `CREATE_POSTING_SUSPENSION` offered on the selected active row. The display label `ET` alone is not sufficient documentation for the request value. The successful response must retain that participant UID, set `accessState: "POSTING_SUSPENDED"`, return `suspensionUid: "9d19c22f3a024ee08c9bcf677dab8f2b"`, `endsAt: "2026-08-01T14:30:00Z"`, and `displayTimeZone: "America/New_York"`, and offer `UPDATE_POSTING_SUSPENSION`, `END_POSTING_SUSPENSION`, `REMOVE_PARTICIPANT`, and `BAN_IDENTITY`.

### 7. Update Posting Suspension

For `PATCH /api/v0/governance/update-posting-suspension`, verify the `Update Posting Suspension` section's `Request Context`, `Example Request Payload`, and `Example Response Payload` documentation against the concrete `MEMBERS` response in `docs/mockup/routes/governance-routes.md`. The revised visible date and time continue to supply the new `endsAt`, but the prior roster must provide the current suspension public UID, current end for form prefilling, and exact IANA time-zone context through this suspended participant:

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

The update request must carry `suspensionUid: "9d19c22f3a024ee08c9bcf677dab8f2b"` and `displayTimeZone: "America/New_York"` from that roster context, prefill the current `endsAt: "2026-08-01T14:30:00Z"`, and submit the documented revised `endsAt: "2026-08-08T18:00:00Z"`. `UPDATE_POSTING_SUSPENSION` must be offered on the same suspended row. The successful response must identify `participantUid: "c7d934725d23424daf163bf811a3506e"`, keep `accessState: "POSTING_SUSPENDED"` and the same suspension UID, return `endsAt: "2026-08-08T18:00:00Z"` and `displayTimeZone: "America/New_York"`, and offer `UPDATE_POSTING_SUSPENSION`, `END_POSTING_SUSPENSION`, `REMOVE_PARTICIPANT`, and `BAN_IDENTITY`.

### 8. End Posting Suspension

For `DELETE /api/v0/governance/end-posting-suspension`, verify the `End Posting Suspension` section's `Request Context`, `Example Request Payload`, and `Example Response Payload` documentation against the concrete `MEMBERS` response in `docs/mockup/routes/governance-routes.md`. The route and visible confirmation timing remain as documented, and the success result must remain directly renderable, but the exact suspension UID required by the request must come from this concrete suspended roster entry:

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

The end request must carry `suspensionUid: "9d19c22f3a024ee08c9bcf677dab8f2b"` from that row, and `END_POSTING_SUSPENSION` must be offered on the same participant. The successful response must identify `participantUid: "c7d934725d23424daf163bf811a3506e"`, restore `accessState: "ACTIVE"`, set `postingSuspension` to `null`, keep `endedAt: "2026-07-23T16:52:00Z"`, and provide replacement `allowedActions` of `CREATE_POSTING_SUSPENSION`, `REMOVE_PARTICIPANT`, and `BAN_IDENTITY`.

### 9. Cross-route consistency

In `docs/mockup/routes/governance-routes.md`, the final concrete `Retrieve Conversation Governance` `MEMBERS` response and all later governance request, response, and request-context examples must agree on each carried `participantUid`, `suspensionUid`, `endsAt`, `displayTimeZone`, membership/access state, and `allowedActions`. Treat each mutation example as its own operation-specific continuation from the applicable concrete roster row: promotion, removal, ban, and create-suspension use Avery Brooks (`a3bb189e8bf943f4a3f107c4b6bb12e3`); restoration uses Release Notes Bot (`4be219f68d0b4e6486fe7d9cc4e8717b`); and update-suspension and end-suspension use Patchwork Bot (`c7d934725d23424daf163bf811a3506e`) with suspension `9d19c22f3a024ee08c9bcf677dab8f2b`. Each operation must use the action offered by its source row, and operation-specific post-mutation counts must start from the approved `activeCount: 3` and `formerCount: 1`. No stale empty-roster text, contradictory counts, mismatched participant/suspension lineage, or stale carry-forward value may remain.

## Out Of Scope

- Editing any file other than `docs/mockup/routes/governance-routes.md`.
- Changes to PASS-only routes except directly shared examples required by the failed routes.
- Backend or frontend implementation.
- Mockup HTML changes.
- Schema or concept changes.
- Generated specification changes.
- Product or API redesign.

## Open Questions

None
