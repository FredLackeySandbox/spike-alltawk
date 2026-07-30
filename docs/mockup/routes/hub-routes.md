# Conversation Hub Routes

## Create Conversation : (`POST /api/v0/hub/create-conversation`)

Creates a new listed or unlisted conversation from the visible setup choices on the Create a Conversation page and establishes the identified creator as its first owner. This is a true create operation: it does not require a pre-existing conversation identifier or version, and successful continuation supplies the public conversation identifier needed to open the new workspace.

### Source Actions

- `docs/mockup/desktop/hub/create.md` — `Create Conversation`

### Mockup Files

- `docs/mockup/desktop/hub/create.html`
- `docs/mockup/desktop/hub/create.md`

### Route

```http
POST /api/v0/hub/create-conversation
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
Content-Type: application/json
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie established by the product's selected human-authentication flow. It sends the public-safe CSRF value issued for that browser session as `X-CSRF-Token: {opaqueCsrfRef}`. `tags` and `visibility` come from the stable visible form snapshot captured when the person selects Create; `matchingMode` comes from the visible listed-only choice and is omitted for `UNLISTED` creation. The UX API validates the session and CSRF context, derives the creator and active identity server-side, enforces the tag and access rules, and creates the conversation and first-owner membership atomically. A missing or expired session returns a display-ready `SESSION_REQUIRED` response without creating anything; the browser retains the draft.

### Example Request Payload

```json
{
  "tags": [
    "community-design",
    "atlanta"
  ],
  "visibility": "LISTED",
  "matchingMode": "INCLUSIVE"
}
```

### Example Response Payload

```json
{
  "state": "CREATED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "membershipRole": "OWNER",
  "workspacePath": "/conversation/thread.html?conversationUid=f47ac10b58cc4372a5670e02b2c3d479"
}
```

A validation response uses `state: "VALIDATION_FAILED"` with display-ready field feedback and omits `conversationUid`, `membershipRole`, and `workspacePath`. Service failure and timeout responses use `state: "TEMPORARILY_UNAVAILABLE"` or `state: "TIMED_OUT"`, set `canRetry` to true, omit creation fields, and leave the browser-held draft unchanged.

## Retrieve Listed Tag Suggestions : (`GET /api/v0/hub/retrieve-listed-tag-suggestions`)

Retrieves the authoritative, privacy-filtered tag suggestions needed while a person builds a listed-discovery query on the Find a Conversation page. The operation uses the visible partial tag text and already selected tags, returns discovery-eligible suggestions only, and is not invoked in known-unlisted mode.

### Source Actions

- `docs/mockup/desktop/hub/find.md` — `Retrieve Listed Tag Suggestions`

### Mockup Files

- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/find.md`

### Route

```http
GET /api/v0/hub/retrieve-listed-tag-suggestions?partialTag={partialTag}&selectedTag={selectedTag}
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie. `partialTag` is the normalized text currently visible in the tag input. Each currently selected visible chip is sent as a repeated `selectedTag` query value; when there are no chips, that query key is omitted. The UX API validates the session, derives the identified person server-side, and returns only discovery-eligible listed tags while excluding selected tags and all private-only tags. A missing or expired session returns a display-ready `SESSION_REQUIRED` response and no suggestions.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "query": "a",
  "suggestions": [
    "accessibility",
    "api-design"
  ]
}
```

An eligible lookup with no matches returns the normalized `query` and an empty `suggestions` array. Private-only tags are omitted in every branch.

## Search Listed Conversations : (`GET /api/v0/hub/search-listed-conversations`)

Evaluates the visible selected tag set against authoritative listed conversations and returns privacy-safe, display-ready results for the Find a Conversation page. Each result must include a public conversation identifier so the subsequent visible Join action is invokable without relying on fixture keys or hidden frontend state.

### Source Actions

- `docs/mockup/desktop/hub/find.md` — `Search Listed Conversations`

### Mockup Files

- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/find.md`

### Route

```http
GET /api/v0/hub/search-listed-conversations?selectedTag={selectedTag}
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie. Each visible selected-tag chip is sent as a repeated `selectedTag` query value. The browser associates the response with its current visible selection and discards a superseded response; it does not send an identity, matching rule, eligibility decision, or hidden conversation context. The UX API validates the session, derives the identified person, applies listed-discovery and eligibility rules server-side, and returns public conversation UIDs only for displayable listed results. A missing or expired session returns `SESSION_REQUIRED` and no result data.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "state": "MATCHES",
  "selectedTags": [
    "product-design"
  ],
  "results": [
    {
      "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
      "tags": [
        "product-design",
        "accessibility",
        "research"
      ],
      "participantCue": "18 participants",
      "activityCue": "Active 12 minutes ago",
      "matchingMode": "INCLUSIVE",
      "allowedActions": [
        "JOIN"
      ]
    }
  ]
}
```

No-match responses use `state: "EMPTY"`, echo `selectedTags`, and return an empty `results` array. Recoverable failures use `state: "TEMPORARILY_UNAVAILABLE"`, echo `selectedTags`, set `canRetry` to true, and omit `results`; the echoed selection lets the page discard a stale response without losing its visible chips.

## Join Listed Conversation : (`POST /api/v0/hub/join-listed-conversation`)

Revalidates the identified person's eligibility for the selected listed conversation and establishes or resumes active membership before continuing to its workspace. The selected public conversation identifier comes from the visible listed-search result, while the identified actor and current eligibility remain server-authoritative.

### Source Actions

- `docs/mockup/desktop/hub/find.md` — `Join Listed Conversation`

### Mockup Files

- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/find.md`

### Route

```http
POST /api/v0/hub/join-listed-conversation
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
Content-Type: application/json
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie and the public-safe CSRF value issued for that session as `X-CSRF-Token: {opaqueCsrfRef}`. `conversationUid` comes from the selected visible item in the immediately preceding `Search Listed Conversations` response. The UX API validates the session and CSRF context, derives the actor server-side, verifies that the public UID still identifies a listed conversation the actor may join, and establishes or resumes active membership. A missing or expired session returns `SESSION_REQUIRED`; an invalid or no-longer-visible selection returns a display-ready unavailable result without exposing private membership information.

### Example Request Payload

```json
{
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479"
}
```

### Example Response Payload

```json
{
  "state": "JOINED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "membershipRole": "MEMBER",
  "workspacePath": "/conversation/thread.html?conversationUid=f47ac10b58cc4372a5670e02b2c3d479"
}
```

An ineligible response uses `state: "NOT_ELIGIBLE"`, echoes only the selected public `conversationUid`, and omits `membershipRole` and `workspacePath`. A recoverable failure uses `state: "TEMPORARILY_UNAVAILABLE"`, echoes `conversationUid`, sets `canRetry` to true, and omits continuation fields so the still-visible result can be retried.

## Evaluate Known Unlisted Conversation Tags : (`POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`)

Privately evaluates the complete current set of user-entered known tags without disclosing an unlisted conversation's identity or private tag data. A complete unique eligible result returns only a public-safe opaque continuation value that can be carried into the subsequent Join action; partial, ambiguous, nonmatching, banned, and failed states remain non-identifying.

### Source Actions

- `docs/mockup/desktop/hub/find.md` — `Evaluate Known Unlisted Conversation Tags`

### Mockup Files

- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/find.md`

### Route

```http
POST /api/v0/hub/evaluate-known-unlisted-conversation-tags
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
Content-Type: application/json
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie and the public-safe CSRF value issued for that session as `X-CSRF-Token: {opaqueCsrfRef}`. `tags` is the complete current set of visible selected-tag chips in known-unlisted mode; no private lookup identifier or hidden conversation UID is available to the browser. The UX API validates the session and CSRF context, derives the identified person, evaluates the supplied combination privately, and returns only a privacy-safe match state, count, allowed action, and—only for a complete unique eligible match—a public-safe `continuationUid`. A missing or expired session returns `SESSION_REQUIRED` and no hidden-match information.

### Example Request Payload

```json
{
  "tags": [
    "release-triage",
    "incident-ops"
  ]
}
```

### Example Response Payload

```json
{
  "matchState": "COMPLETE_ELIGIBLE",
  "hiddenMatchCount": 1,
  "continuationUid": "7d4448409dc04b2f9d1661130f63ccaf",
  "allowedActions": [
    "JOIN"
  ]
}
```

Empty, partial, nonmatching, and ambiguous responses omit `continuationUid`, return `allowedActions: []`, and expose only a privacy-safe `matchState` and `hiddenMatchCount`. A complete ineligible match uses `matchState: "COMPLETE_NOT_ELIGIBLE"` with no continuation or hidden identity. A recoverable failure uses `matchState: "TEMPORARILY_UNAVAILABLE"`, sets `canRetry` to true, and omits the count, continuation, hidden identity, and private tags.

## Join Unlisted Conversation : (`POST /api/v0/hub/join-unlisted-conversation`)

Continues from a complete unique hidden-match evaluation, revalidates the identified person's eligibility, and establishes active membership without exposing the unlisted conversation to an ineligible person. Invocation uses the public-safe opaque continuation value returned by the evaluation together with the complete user-entered tag set still visible on the page, rather than a hidden conversation identifier.

### Source Actions

- `docs/mockup/desktop/hub/find.md` — `Join Unlisted Conversation`

### Mockup Files

- `docs/mockup/desktop/hub/find.html`
- `docs/mockup/desktop/hub/find.md`

### Route

```http
POST /api/v0/hub/join-unlisted-conversation
Cookie: tawk_session={opaqueSessionRef}
X-CSRF-Token: {opaqueCsrfRef}
Content-Type: application/json
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie and the public-safe CSRF value issued for that session as `X-CSRF-Token: {opaqueCsrfRef}`. `continuationUid` is the public-safe opaque handle returned by the immediately preceding `Evaluate Known Unlisted Conversation Tags` response, and `tags` is the unchanged complete set of visible selected-tag chips used for that evaluation. The UX API validates the session and CSRF context, derives the actor, resolves and revalidates the opaque continuation server-side, compares the submitted tag set with the evaluated set, and establishes membership only if current eligibility still permits it. A missing or expired session returns `SESSION_REQUIRED`; an expired, superseded, or mismatched continuation requires private reevaluation and reveals no hidden conversation detail.

### Example Request Payload

```json
{
  "continuationUid": "7d4448409dc04b2f9d1661130f63ccaf",
  "tags": [
    "release-triage",
    "incident-ops"
  ]
}
```

### Example Response Payload

```json
{
  "state": "JOINED",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "membershipRole": "MEMBER",
  "workspacePath": "/conversation/thread.html?conversationUid=f47ac10b58cc4372a5670e02b2c3d479"
}
```

An ineligible response uses `state: "NOT_ELIGIBLE"` and omits `conversationUid`, `membershipRole`, and `workspacePath`. An expired or superseded continuation uses `state: "CONTINUATION_EXPIRED"`, sets `reevaluationRequired` to true, and reveals no hidden conversation detail. A recoverable failure uses `state: "TEMPORARILY_UNAVAILABLE"` with `canRetry: true` while the public continuation remains valid.

## Retrieve Joined Conversations : (`GET /api/v0/hub/retrieve-joined-conversations`)

Loads the identified person's authoritative active joined-conversation projection for the Your Conversations page, including display-ready tags, role, recent activity cues, and public identifiers for visible Resume choices. This common hub load also covers empty, retryable failure, and unavailable-session outcomes without exposing private conversation data when the browser has no valid identified session.

### Source Actions

- `docs/mockup/desktop/hub/index.md` — `Retrieve Joined Conversations`

### Mockup Files

- `docs/mockup/desktop/hub/index.html`
- `docs/mockup/desktop/hub/index.md`

### Route

```http
GET /api/v0/hub/retrieve-joined-conversations
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie; the page sends no person UID or membership filter. The UX API validates the session, derives the identified person, and returns only that person's active joined-conversation projection, including public conversation UIDs for visible Resume actions. A missing or expired cookie produces `state: "SESSION_REQUIRED"` with `sessionState: "UNAVAILABLE"` and a public recovery path, while omitting member and conversation data.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "state": "POPULATED",
  "sessionState": "AVAILABLE",
  "member": {
    "displayName": "Rowan Ellis",
    "initials": "RE"
  },
  "conversationCount": 2,
  "conversations": [
    {
      "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
      "kind": "STANDARD",
      "tags": [
        "product-design",
        "accessibility",
        "research"
      ],
      "membershipRole": "OWNER",
      "recentActivityCue": "Maya Chen: “The keyboard walkthrough is ready for a second pass.”",
      "activityTimeLabel": "12 min ago",
      "allowedActions": [
        "RESUME"
      ]
    },
    {
      "conversationUid": "6ba7b8109dad41d180b400c04fd430c8",
      "kind": "MODERATION",
      "tags": [
        "mod-review",
        "ticket-1048"
      ],
      "membershipRole": "ADMINISTRATOR",
      "recentActivityCue": "Priya Nair: “I added the relevant context for tomorrow’s review.”",
      "activityTimeLabel": "Yesterday",
      "allowedActions": [
        "RESUME"
      ]
    }
  ]
}
```

An identified person with no active memberships receives `state: "EMPTY"`, `sessionState: "AVAILABLE"`, `conversationCount: 0`, and an empty `conversations` array. A recoverable load failure uses `state: "TEMPORARILY_UNAVAILABLE"` with `canRetry: true` and omits private list data. An unavailable session uses `state: "SESSION_REQUIRED"`, `sessionState: "UNAVAILABLE"`, and a public `recoveryPath`, and omits member and conversation data.

## Resolve Joined Conversation Access : (`GET /api/v0/hub/resolve-joined-conversation-access`)

Resolves the selected visible joined-conversation item against current authoritative membership before the Your Conversations page opens its private workspace. The selected public conversation identifier comes from the prior joined-list response, allowing the operation to distinguish active access, stale removed or banned membership, and a transient resolution failure without relying on hidden frontend state.

### Source Actions

- `docs/mockup/desktop/hub/index.md` — `Resolve Joined Conversation Access`

### Mockup Files

- `docs/mockup/desktop/hub/index.html`
- `docs/mockup/desktop/hub/index.md`

### Route

```http
GET /api/v0/hub/resolve-joined-conversation-access?conversationUid={conversationUid}
Cookie: tawk_session={opaqueSessionRef}
```

### Request Context

The same-origin browser sends the browser-managed `tawk_session={opaqueSessionRef}` cookie. `conversationUid` comes from the selected visible Resume item in the preceding `Retrieve Joined Conversations` response and is sent as the query value. The UX API validates the session, derives the identified person, resolves current membership for the selected public UID, and returns a browser-safe workspace path only for active access. A missing or expired session returns `SESSION_REQUIRED`; a stale removed or banned membership returns `NO_LONGER_AVAILABLE` so the page can remove only that card, while a transient lookup failure leaves the list intact and allows retry.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "accessState": "ACTIVE",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "workspacePath": "/conversation/thread.html?conversationUid=f47ac10b58cc4372a5670e02b2c3d479"
}
```

A stale removed or banned membership returns `accessState: "NO_LONGER_AVAILABLE"`, echoes the selected public `conversationUid`, sets `removeFromJoined` to true, and omits `workspacePath`. A transient resolution failure returns `accessState: "TEMPORARILY_UNAVAILABLE"`, echoes `conversationUid`, sets `canRetry` to true, omits `workspacePath`, and leaves the visible joined list unchanged.
