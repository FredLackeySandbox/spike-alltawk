# Moderation Routes Review

Review target: `docs/mockup/routes/moderation-routes.md`
Reviewer: Route File Reviewer

## Summary

- Routes reviewed: 8
- Decisions: 7 PASS, 1 FAIL

## Route Findings

## Retrieve Reviewable Reports : (`GET /api/v0/moderation/retrieve-reviewable-reports`)

**Decision:** PASS

Operations reviewed: `GET /api/v0/moderation/retrieve-reviewable-reports?originConversationUid={conversationUid}`

The optional conversation UID is available from the queue URL or may be omitted, the named session cookie supplies reviewer context, and the response provides the governed filters and report fields needed to render and continue without exposing unauthorized conversations or internal identifiers.

## Retrieve Moderation Ticket : (`GET /api/v0/moderation/retrieve-moderation-ticket`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/moderation/retrieve-moderation-ticket?reportNumber={reportNumber}&conversationUid={conversationUid}`

Reason: The queue response supplies both query values, but the only concrete ticket response shows `postingSuspension` as null even though an already-suspended ticket must supply the suspension UID and current end time needed by Update Posting Suspension. The response also crosses presentation composition into the UX API by returning `sourceConversationUrl` and `relatedDiscussion.conversationUrl` instead of public UIDs from which the page can construct its own links.

Suggested fix:

Add a concrete existing-suspension ticket response variant that carries the exact update values, and replace navigation-route strings with public conversation UIDs:

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

## Create Reviewer Note : (`POST /api/v0/moderation/create-reviewer-note`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/moderation/create-reviewer-note`

The ticket URL, reviewer-entered note, and documented session cookie provide every request value, while the response returns the attributed, timestamped note needed for immediate ordered insertion and leaves identity and authority decisions behind the UX API.

## Delete Reported Message : (`DELETE /api/v0/moderation/delete-reported-message`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/moderation/delete-reported-message`

The ticket URL and prior ticket response provide the report, conversation, and public message UIDs at confirmation time, and the response supplies the deletion state, retained-evidence outcome, and changed actions needed by the page without exposing storage deletion details or private identifiers.

## Create Posting Suspension : (`POST /api/v0/moderation/create-posting-suspension`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/moderation/create-posting-suspension`

The ticket URL, prior ticket response, and suspension form supply all request values, and the concrete response returns the new public suspension UID and effective end time required for the visible Change continuation while keeping eligibility and authorization checks server-owned.

## Update Posting Suspension : (`PATCH /api/v0/moderation/update-posting-suspension`)

**Decision:** PASS

Operations reviewed: `PATCH /api/v0/moderation/update-posting-suspension`

The loaded or create-suspension response supplies the public participant and suspension identifiers plus current end time, while the form and visible shortening acknowledgment supply the replacement inputs; the response returns one authoritative updated restriction and directly renderable outcome without leaking internal state.

## Remove Participant : (`DELETE /api/v0/moderation/remove-participant`)

**Decision:** PASS

Operations reviewed: `DELETE /api/v0/moderation/remove-participant`

The ticket URL and prior ticket response supply the report, conversation, and public participant identifiers before confirmation, and the response provides the former-participant state, rejoin result, effect, and action availability needed by the page while the server retains role and membership decisions.

## Ban Participant : (`POST /api/v0/moderation/ban-participant`)

**Decision:** PASS

Operations reviewed: `POST /api/v0/moderation/ban-participant`

The ticket URL and prior ticket response supply every public request identifier at confirmation time, and the response gives the banned and no-rejoin outcome plus updated action availability needed by the UI while authorization, role constraints, and retained-history handling remain server-controlled.
