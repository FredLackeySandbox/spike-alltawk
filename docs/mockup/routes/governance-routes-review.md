# Governance Routes Review

Review target: `docs/mockup/routes/governance-routes.md`
Reviewer: Route File Reviewer

## Summary

- Routes reviewed: 10
- Decisions: 10 PASS, 0 FAIL

## Route Findings

## Retrieve Conversation Governance : (`GET /api/v0/governance/retrieve-conversation-governance`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/governance/retrieve-conversation-governance?conversationUid={conversationUid}&view={governanceView}`

The page route, page-selected view, and documented session cookie form the request; the two concrete view-specific responses supply the authorized roster or settings state and safe public UIDs without exposing storage details.

## Promote Participant Role : (`POST /api/v0/governance/promote-participant-role`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/promote-participant-role`

The conversation route and prior roster row provide the public participant UID and offered target role, while the response returns the authoritative role, allowed row actions, and ownership-continuity state without asking the browser to assert permission.

## Remove Participant : (`DELETE /api/v0/governance/remove-participant`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/governance/remove-participant`

The request uses the conversation route and selected roster participant UID after local confirmation; the response provides the retained former row and updated counts while owner continuity and authorization remain server-enforced.

## Ban Identity : (`POST /api/v0/governance/ban-identity`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/ban-identity`

The prior authorized roster supplies the selected public participant UID, and the response directly supplies the banned retained state, rejoin outcome, updated counts, and next allowed action without leaking internal membership records.

## Restore Banned Participant : (`POST /api/v0/governance/restore-banned-participant`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/restore-banned-participant`

The request carries only the conversation and selected banned participant public UIDs; the API derives the restored role from retained history and returns the complete active roster entry, counts, and safe next actions.

## Create Posting Suspension : (`POST /api/v0/governance/create-posting-suspension`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/create-posting-suspension`

The roster, visible end fields, and prior display-time-zone context provide every request value, and the concrete response returns the exact suspension UID, authoritative end, access state, and actions needed for later update or end operations.

## Update Posting Suspension : (`PATCH /api/v0/governance/update-posting-suspension`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/governance/update-posting-suspension`

The prior roster or create response supplies the public suspension UID and prefilled timing context, while the revised visible fields form the update and the response returns the same UID with the authoritative new end and current actions.

## End Posting Suspension : (`DELETE /api/v0/governance/end-posting-suspension`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/governance/end-posting-suspension`

The prior roster or create response supplies the current public suspension UID, and the success response directly restores active access, clears the suspension, and returns replacement allowed actions without requiring frontend policy decisions.

## Update Conversation Tags : (`PATCH /api/v0/governance/update-conversation-tags`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/governance/update-conversation-tags`

The conversation route and complete visible tag draft form the request; server-side permission, lifecycle, normalization, and validation remain authoritative, and the response returns the committed display tags and safe page action state.

## Archive Conversation : (`POST /api/v0/governance/archive-conversation`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/governance/archive-conversation`

The page route, documented session cookie, and visible owner confirmation are sufficient to invoke archival, while the response returns the authoritative archived state, timestamp, retained-record confirmation, and cleared actions without exposing internal lifecycle data.
