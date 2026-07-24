# Governance Routes Review

Review target: `docs/mockup/routes/governance-routes.md`
Reviewer: Route File Reviewer

## Summary

- Routes reviewed: 10
- Decisions: 9 PASS, 1 FAIL

## Route Findings

## Retrieve Conversation Governance : (`GET /api/v0/governance/retrieve-conversation-governance`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}`

Reason: The page route, selected governance page, and documented session cookie can form the request, but the only concrete response example is an array containing both `MEMBERS` and `SETTINGS` objects even though the prose says the selected view returns one view-specific result. The browser therefore lacks an unambiguous concrete response contract for either page.

Suggested fix:

Replace the combined array with two explicitly labeled response examples, each a single object keyed to its request `view`. For example, document the members response as:

```json
{
  "result": "SUCCEEDED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "view": "MEMBERS",
  "lifecycleStatus": "ACTIVE",
  "viewerRole": "OWNER",
  "activeCount": 5,
  "formerCount": 2,
  "ownerContinuity": {
    "isCurrentViewerLastActiveOwner": true,
    "message": "Promote another participant to owner or archive the conversation before leaving."
  },
  "participants": []
}
```

Document the `SETTINGS` response separately as a single object containing the concrete `tags`, `discovery`, `matching`, lifecycle, viewer-role, and `allowedActions` fields already shown in the route file.

## Promote Participant Role : (`POST /api/v0/governance/promote-participant-role`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/promote-participant-role`

The conversation route and prior authorized roster provide both public UIDs and the offered target role before confirmation; the concrete response supplies the authoritative role, row actions, and ownership-continuity result while keeping eligibility and authority decisions server-side.

## Remove Participant : (`DELETE /api/v0/governance/remove-participant`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/governance/remove-participant`

The page route and selected roster row provide the public request identifiers before the visible confirmation; the response returns the retained former-participant state and updated counts needed to redraw the roster, while owner protection and membership retention remain backend-owned.

## Ban Identity : (`POST /api/v0/governance/ban-identity`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/ban-identity`

The current conversation and selected active or former roster row supply the public UIDs at invocation; the concrete result gives the banned state, rejoin outcome, next action, and counts required by the page without exposing storage history or trusting the frontend to decide authority or owner continuity.

## Restore Banned Participant : (`POST /api/v0/governance/restore-banned-participant`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/restore-banned-participant`

The banned roster row and page route provide the public identifiers before confirmation; the response authoritatively restores the active role, returns the complete active row and counts required by the requirements-backed restoration flow, and correctly derives the retained role server-side.

## Create Posting Suspension : (`POST /api/v0/governance/create-posting-suspension`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/create-posting-suspension`

The page route, selected unsuspended roster row, and visible date, time, and time-zone context form the request; the response concretely returns the new public suspension UID, authoritative end, access state, and next actions needed for later update or end operations without leaking restriction-history internals.

## Update Posting Suspension : (`PATCH /api/v0/governance/update-posting-suspension`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/governance/update-posting-suspension`

The prior roster response supplies the public suspension UID and editable current end, while the form supplies the revised end and time-zone context; the concrete response returns the same carry-forward UID, revised authoritative values, access state, and actions, with validation and authority kept behind the UX API.

## End Posting Suspension : (`DELETE /api/v0/governance/end-posting-suspension`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/governance/end-posting-suspension`

The selected suspended row provides the public suspension UID before the visible confirmation and the page route provides conversation context; the response directly supports the active-row redraw with restored access and replacement actions while the backend resolves the participant and retains restriction history.

## Update Conversation Tags : (`PATCH /api/v0/governance/update-conversation-tags`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/governance/update-conversation-tags`

The page route and visible complete chip set supply the request after local editing; the response returns the committed display tags, count, lifecycle, and permitted actions needed to reconcile the page, while authoritative normalization, validation, permission, and lifecycle decisions remain server-side.

## Archive Conversation : (`POST /api/v0/governance/archive-conversation`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/archive-conversation`

The current conversation public UID and documented session cookie form the request after the owner’s visible confirmation, with unsaved drafts blocked locally; the concrete response returns the archived lifecycle state, effective time, retention confirmation, and empty action set without accepting frontend-supplied ownership or retention decisions.
