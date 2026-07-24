# Hub Routes

## Create Conversation : (`POST /api/v0/hub/create-conversation`)

Creates a new listed or unlisted conversation from the setup form and establishes the identified creator as its first owner in the same operation. This route is specific to `create.html`; it accepts no pre-existing conversation identifier or version, and a successful result supplies the public conversation identifier and browser-safe continuation needed to open the new workspace. Validation, service failure, and timeout outcomes must leave the submitted draft reusable without implying that a conversation was created.

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

The browser automatically sends the HttpOnly `tawk_session` cookie established before entry to the private hub. `X-CSRF-Token` comes from the private page bootstrap and is retained by the browser in memory for state-changing requests; neither value belongs in JSON or browser storage. The human identity provider remains unspecified. The UX API validates both values, derives the identified creator, enforces the visible tag and access constraints, and creates the conversation and first-owner membership atomically.

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
  "currentRole": "OWNER",
  "workspaceUrl": "/conversation/f47ac10b58cc4372a5670e02b2c3d479"
}
```

A validation response returns `state: "VALIDATION_FAILED"` with `fieldFeedback` entries shaped as `{"field": "TAGS", "message": "Add at least one valid tag."}` and omits `conversationUid`, `currentRole`, and `workspaceUrl`. A service failure returns `state: "TEMPORARILY_UNAVAILABLE"` with `canRetry: true`; a timed-out attempt returns `state: "TIMED_OUT"` with `canRetry: true`. Both failure branches omit creation fields and leave the browser's submitted draft unchanged.

## Retrieve Listed Tag Suggestions : (`GET /api/v0/hub/retrieve-listed-tag-suggestions`)

Returns the privacy-filtered tag vocabulary used by listed discovery while the person types or changes selected chips on `find.html`. The route uses the visible partial tag and selected tags to prioritize usable matches, excludes already selected values, and never returns tags eligible only for unlisted conversations. An empty result is a valid response, and known-unlisted mode does not invoke this route.

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

`partialTag` comes from the current visible listed-search input and may be empty; `selectedTag` is repeated once for every selected visible chip and is omitted when no chip is selected. The browser URL-encodes those values and automatically sends its HttpOnly `tawk_session` cookie. The UX API validates the session and returns only discovery-eligible suggestions that exclude the selected tags. Known-unlisted mode never invokes this route, and the human identity provider remains unspecified.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "partialTag": "des",
  "suggestions": [
    "design-systems"
  ]
}
```

An eligible lookup with no matches returns an empty `suggestions` array and never includes tags used only by unlisted conversations.

## Search Listed Conversations : (`GET /api/v0/hub/search-listed-conversations`)

Evaluates the visible selected-tag set against authoritative listed conversations and returns only identifiable, display-ready matches for `find.html`. Each result supplies a public conversation identifier for the later Join action together with the visible tag combination and participation/activity cues needed by the result list. The response distinguishes populated, empty, and recoverable failure outcomes without exposing unlisted conversations.

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

`selectedTag` is repeated once for every currently visible validated chip and is omitted only when the page intentionally shows its local “Add a tag to begin” state without invoking the route. The browser URL-encodes those values and automatically sends its HttpOnly `tawk_session` cookie. The UX API validates the session, applies the server-owned listed matching rules, and returns the normalized `selectedTags` it evaluated. The page compares that echo with its current chips and discards a stale response rather than replacing a newer search.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "state": "MATCHES",
  "selectedTags": [
    "product-design"
  ],
  "conversations": [
    {
      "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
      "tags": [
        "product-design",
        "accessibility",
        "research"
      ],
      "participantCount": 18,
      "activityLabel": "Active 12 minutes ago",
      "matchingMode": "INCLUSIVE"
    }
  ]
}
```

No-match responses use `state: "EMPTY"`, echo the normalized `selectedTags`, and return an empty `conversations` array. Recoverable failures use `state: "TEMPORARILY_UNAVAILABLE"`, echo the normalized `selectedTags`, set `canRetry: true`, and omit `conversations`; the echo lets the page discard a stale failure while the retained visible tags remain available for retry.

## Join Listed Conversation : (`POST /api/v0/hub/join-listed-conversation`)

Uses the public conversation identifier selected from a listed-search response to verify the identified person's current eligibility and establish or resume active membership. A successful response supplies the public conversation identifier and browser-safe workspace continuation; an ineligible or banned result exposes no private membership detail, and a transient failure leaves the visible result available for retry. No approval or invitation state is introduced.

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

`conversationUid` comes from the selected visible result returned by `GET /api/v0/hub/search-listed-conversations`. The browser automatically sends the HttpOnly `tawk_session` cookie, and `X-CSRF-Token` comes from the private page bootstrap held in browser memory. The UX API validates both values, derives the identified person, rechecks eligibility and current membership server-side, and establishes or resumes active membership without accepting role or permission decisions from the browser.

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
  "workspaceUrl": "/conversation/f47ac10b58cc4372a5670e02b2c3d479"
}
```

An ineligible response uses `state: "NOT_ELIGIBLE"`, echoes the selected public `conversationUid`, and omits `workspaceUrl`. A recoverable failure uses `state: "TEMPORARILY_UNAVAILABLE"`, echoes `conversationUid`, sets `canRetry: true`, and omits `workspaceUrl` so the still-visible result can be retried.

## Evaluate Known Unlisted Conversation Tags : (`POST /api/v0/hub/evaluate-known-unlisted-conversation-tags`)

Privately evaluates the complete current set of user-entered tags against unlisted conversations for `find.html`. Empty, partial, nonmatching, and ambiguous evaluations return only privacy-safe state and an allowed hidden-match count; they never disclose a hidden conversation identifier or its tags. Only one complete eligible match yields a browser-safe opaque continuation value for the later Join action, while a complete ineligible match keeps Join unavailable without additional conversation detail.

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

`tags` contains only the currently visible validated chips entered in known-unlisted mode; the page does not invoke this route while the set is empty. The browser automatically sends the HttpOnly `tawk_session` cookie, and `X-CSRF-Token` comes from the private page bootstrap held in browser memory. The UX API validates both values, privately evaluates the tag set, and returns only a privacy-safe count and state. A complete unique eligible result may additionally return a public-safe, session-bound `unlistedJoinChallengeUid`; it is a continuation identifier, not the hidden conversation's identifier or a credential.

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
  "state": "COMPLETE_ELIGIBLE",
  "hiddenMatchCount": 1,
  "canJoin": true,
  "unlistedJoinChallengeUid": "a3bb189e8bf9479690a48e72b8fc5d23"
}
```

Partial, nonmatching, and ambiguous responses omit `unlistedJoinChallengeUid`, keep `canJoin` false, and return only a privacy-safe `state` and `hiddenMatchCount`. A complete ineligible match returns `state: "COMPLETE_NOT_ELIGIBLE"` with `canJoin: false` and no hidden identity details. A recoverable evaluation failure returns `state: "TEMPORARILY_UNAVAILABLE"` with `canRetry: true`, omits the count, challenge UID, and hidden-conversation detail, and lets the page retain the entered tags for retry.

## Join Unlisted Conversation : (`POST /api/v0/hub/join-unlisted-conversation`)

Continues from the public-safe opaque value returned by the latest complete unique unlisted evaluation and revalidates the identified person's eligibility before establishing active membership. The browser has both that carry-forward value and the still-visible entered tag combination at invocation time, so the later payload contract can remain minimal while the server continues the hidden flow without receiving undisclosed frontend context. Success returns the newly accessible public conversation identifier and browser-safe workspace continuation; denial and transient failure reveal no hidden conversation detail.

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

`unlistedJoinChallengeUid` is the public-safe, session-bound continuation returned by the latest complete eligible `POST /api/v0/hub/evaluate-known-unlisted-conversation-tags` response. The browser automatically sends the same HttpOnly `tawk_session` cookie, and `X-CSRF-Token` comes from the private page bootstrap held in browser memory. The UX API validates all three values, recovers the hidden match and submitted tag evaluation server-side, and rechecks current eligibility. The browser never sends a hidden conversation identifier, raw tag-derived secret, role, or permission decision.

### Example Request Payload

```json
{
  "unlistedJoinChallengeUid": "a3bb189e8bf9479690a48e72b8fc5d23"
}
```

### Example Response Payload

```json
{
  "state": "JOINED",
  "conversationUid": "6ba7b8109dad41d180b400c04fd430c8",
  "workspaceUrl": "/conversation/6ba7b8109dad41d180b400c04fd430c8"
}
```

A valid challenge for an ineligible identity returns `state: "NOT_ELIGIBLE"` and omits both `conversationUid` and `workspaceUrl`; the page shows the privacy-safe denial and disables Join. An expired, superseded, or wrong-session challenge returns `state: "CHALLENGE_EXPIRED"` with `reevaluationRequired: true`, omits hidden-conversation details, and prompts the page to evaluate the still-visible tags again. A recoverable failure returns `state: "TEMPORARILY_UNAVAILABLE"` with `canRetry: true`, allowing the browser to retry the same public challenge while it remains valid.

## Retrieve Joined Conversations : (`GET /api/v0/hub/retrieve-joined-conversations`)

Loads the identified person's display-ready active joined-conversation projection for `index.html`, including standard conversations and private moderation discussions in which that person participates. The response supplies visible tags, role, recent activity cues, and a public conversation identifier for each Resume choice, ordered newest first. It supports populated, empty, recoverable failure, and unavailable-session outcomes without returning former memberships or private hub data to an unidentified browser.

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

The browser automatically sends the HttpOnly `tawk_session` cookie when the private hub loads or the user selects Retry; there are no path, query, or body values. The UX API validates the session, derives the identified person, and returns only that person's active joined standard and private moderation conversations, already ordered newest first. A missing or invalid cookie yields a generic session-required response with no private list data so the page can hide the hub and link back to the public entry point.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "state": "POPULATED",
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
      "role": "OWNER",
      "recentActivity": {
        "authorDisplayName": "Maya Chen",
        "excerpt": "The keyboard walkthrough is ready for a second pass.",
        "relativeTime": "12 min ago"
      }
    },
    {
      "conversationUid": "6ba7b8109dad41d180b400c04fd430c8",
      "kind": "MODERATION",
      "tags": [
        "mod-review",
        "ticket-1048"
      ],
      "role": "ADMINISTRATOR",
      "recentActivity": {
        "authorDisplayName": "Priya Nair",
        "excerpt": "I added the relevant context for tomorrow’s review.",
        "relativeTime": "Yesterday"
      }
    }
  ]
}
```

An identified person with no active memberships receives `state: "EMPTY"`, `conversationCount: 0`, and an empty `conversations` array. A recoverable failure uses `state: "TEMPORARILY_UNAVAILABLE"` with `canRetry: true` and omits private list data. A missing or invalid session returns `state: "SESSION_REQUIRED"` with `recoveryUrl: "/"` and no `conversationCount` or `conversations`.

## Resolve Joined Conversation Access : (`GET /api/v0/hub/resolve-joined-conversation-access`)

Rechecks authoritative access when the person selects a conversation returned by the joined-conversation route. The selected public conversation identifier is available from the visible Resume control; active access returns a browser-safe workspace continuation, stale removed or banned membership tells the hub to remove that item and refresh its count, and a transient resolution failure preserves the list for retry. The route never opens a different conversation or returns private workspace data before active membership is confirmed.

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

`conversationUid` is URL-encoded as a query parameter and comes from the selected visible Resume control returned by `GET /api/v0/hub/retrieve-joined-conversations`. The browser automatically sends its HttpOnly `tawk_session` cookie. The UX API validates the session, derives the identified person, and rechecks current conversation and membership state before returning a browser-safe workspace handoff URL. It never trusts browser-supplied role, membership status, or list position.

### Example Request Payload

No JSON request body is sent for this route.

### Example Response Payload

```json
{
  "accessState": "ACTIVE",
  "conversationUid": "f47ac10b58cc4372a5670e02b2c3d479",
  "workspaceUrl": "/conversation/f47ac10b58cc4372a5670e02b2c3d479"
}
```

A stale removed or banned membership returns `accessState: "NO_LONGER_AVAILABLE"`, echoes the selected public `conversationUid`, sets `removeFromJoined` to true, and omits `workspaceUrl`; the page removes only that visible card and recomputes its displayed count. A transient resolution failure returns `accessState: "TEMPORARILY_UNAVAILABLE"`, echoes the selected public `conversationUid`, sets `canRetry: true`, omits `workspaceUrl`, and leaves the list unchanged.
