---
type: route-review-feedback
source_review: docs/mockup/routes/conversation-routes-review.md
review_fingerprint: sha256:690b8e4c7cffbd01e854c157ad3a5a6c4b9ad45584392c8639f5b2f62a08cb7b
target_artifact: docs/mockup/routes/conversation-routes.md
---

# Conversation Routes Review Feedback

This immutable feedback snapshot was created from `docs/mockup/routes/conversation-routes-review.md` at fingerprint `sha256:690b8e4c7cffbd01e854c157ad3a5a6c4b9ad45584392c8639f5b2f62a08cb7b` for route-story creation.

## Failing Route Findings

## Retrieve Conversation Workspace : (`GET /api/v0/conversation/retrieve-workspace`)

**Decision:** FAIL

Operations reviewed: `GET /api/v0/conversation/retrieve-workspace?conversationUid={conversationUid}`

Reason: The page route and documented session cookie supply the request, and most response data is display-ready, but neither participant summaries nor retrieved message authors identify the current participant. Display-name comparison is not a reliable substitute, so the page cannot safely render its required “You” labels, current-participant roster treatment, and own-message treatment.

Suggested fix:

Add a server-derived current-participant flag to each participant summary and message author in the workspace response:

```json
{
  "participants": [
    {
      "displayName": "Maya Chen",
      "participantType": "PERSON",
      "roleLabel": "Owner",
      "presence": "ACTIVE",
      "isCurrentParticipant": true
    }
  ],
  "messages": [
    {
      "author": {
        "displayName": "Maya Chen",
        "participantType": "PERSON",
        "roleLabel": "Owner",
        "isFormerParticipant": false,
        "isCurrentParticipant": true
      }
    }
  ]
}
```
