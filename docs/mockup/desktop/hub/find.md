---
paired_html: docs/mockup/desktop/hub/find.html
description: "Find and join a listed conversation or a known unlisted conversation by tags."
---

# Backend Data Actions

## Retrieve Listed Tag Suggestions

### Page States

- Listed search is active while the user types a partial tag or changes the selected tag chips.
- Listed suggestion retrieval must exclude tags that are eligible only for unlisted conversations; known-unlisted mode does not invoke suggestion retrieval at all.

### Evidence

- `docs/mockup/desktop/hub/find.html` — the rendered listed mode shows fixture-backed eligible suggestions filtered by the current text and selected tags, while switching to known-unlisted mode removes the suggestion region entirely.
- `docs/concepts/REQUIREMENTS.md` — type-ahead suggestions may include only discovery-eligible tags and must never disclose tags used exclusively by unlisted conversations.
- `docs/concepts/APP_PAGES.md` — the page must suggest only tags eligible for listed discovery.

### Backend Need

The product must retrieve the authoritative, privacy-filtered tag vocabulary eligible for listed discovery. Empty suggestion results and known-unlisted mode must not reveal private-only tags.

### Visible Inputs

- The current partial tag text.
- The already selected tags that should not be suggested again.

### Required Outcomes

- Matching eligible tags are returned as selectable suggestions, with prefix matches prioritized when applicable.
- No-match input produces an empty suggestion state without exposing private-only tags.
- Switching to known-unlisted mode stops listed suggestion retrieval and shows no suggestions.
- Invalid or duplicate tag entry remains visibly rejected without changing the selected tags.

## Search Listed Conversations

### Page States

- Listed mode evaluates whenever the selected tag set changes.
- The evaluation may be loading, populated, empty, failed, retried, or superseded by a newer tag selection.

### Evidence

- `docs/mockup/desktop/hub/find.html` — a timer-backed evaluation filters fixture conversations by inclusive or exclusive matching, renders identifiable tag combinations and activity cues, discards stale evaluation tokens, and exposes empty, failure, and retry states while retaining selected tags.
- `docs/concepts/REQUIREMENTS.md` — listed search must return identifiable matching conversations, apply the listed matching mode, and exclude unlisted conversations.
- `docs/concepts/APP_PAGES.md` — listed mode must update a compact identifiable result list progressively.

### Backend Need

The product must evaluate the selected tags against authoritative listed conversations and return only privacy-safe, display-ready matches. Results must reflect current matching rules and provide stable identifiers needed for the user's visible Join choice.

### Visible Inputs

- The selected set of validated tags.

### Required Outcomes

- Pending evaluation is visible and stale responses do not replace a newer query.
- Matches identify listed conversations by visible tag combinations and include the user-facing participation and activity cues shown by the page.
- No matches produce a non-destructive empty state.
- Failure retains the selected tags and permits retry.

## Join Listed Conversation

### Page States

- An eligible listed result exposes Join after a successful listed search.
- Joining may be pending, rejected because the identified person is banned or otherwise ineligible, failed with retry, or successful.

### Evidence

- `docs/mockup/desktop/hub/find.html` — each listed result carries a selection identifier; Join displays a pending state, checks fixture eligibility, exposes banned and flaky-failure branches, records an active member membership in session storage on success, and then opens the conversation workspace.
- `docs/concepts/REQUIREMENTS.md` — a listed match may be joined immediately without an approval queue after verifying that the identified user is not banned and recording active membership.
- `docs/concepts/APP_PAGES.md` — eligible listed results must allow immediate joining and successful join opens the workspace.

### Backend Need

The product must verify the identified person's current eligibility and durably establish or resume active membership in the selected listed conversation. It must not grant access to a banned identity and must return enough continuation information to open the joined conversation.

### Visible Inputs

- The selected listed conversation's public identifier carried forward from the visible search result.

### Required Outcomes

- Pending join prevents duplicate attempts for the current selection.
- Success records active member participation and continues to the conversation workspace.
- A banned or otherwise ineligible identity receives a concise denial without additional private membership detail.
- A transient failure preserves the result and permits retry.

## Evaluate Known Unlisted Conversation Tags

### Page States

- Known-unlisted mode evaluates an empty, partial, complete unique, ambiguous, or nonmatching supplied tag set.
- Evaluation may be loading, failed, retried, or superseded by a newer tag selection.

### Evidence

- `docs/mockup/desktop/hub/find.html` — fixture-backed hidden combinations are evaluated without rendering identifying values; partial or ambiguous input returns only a possible count, one complete eligible match enables Join, a banned complete match disables Join, and failure/retry branches retain the supplied tags without disclosure.
- `docs/concepts/REQUIREMENTS.md` — unlisted discovery may reveal only a hidden-match count until all tags identify one conversation, must not expose identity or private tags, and must require a complete unique match before joining.
- `docs/concepts/APP_PAGES.md` — known-unlisted mode must reveal only a hidden count until one complete unique match enables Join.

### Backend Need

The product must privately compare the supplied tags with authoritative unlisted conversations while disclosing only the minimum state needed to continue. A complete unique eligible result must yield a public-safe continuation choice without revealing the hidden conversation's identity before membership is established.

### Visible Inputs

- The complete current set of user-entered known tags.

### Required Outcomes

- Empty input explains that the user must enter tags they already know and provides no suggestions.
- Partial, nonmatching, or ambiguous input returns only a privacy-safe hidden-match count and keeps Join disabled.
- One complete eligible match enables Join without disclosing hidden identity or private membership details.
- One complete banned match denies Join without additional conversation detail.
- Failure retains the entered tags, reveals no hidden details, and permits retry; stale evaluation results are discarded.

## Join Unlisted Conversation

### Page States

- One complete unique eligible hidden match exposes Join.
- Joining may be pending, failed with retry, rejected for ineligibility, or successful.

### Evidence

- `docs/mockup/desktop/hub/find.html` — the hidden Join handler uses the matched combination as a carry-forward key, displays pending and flaky retry states, blocks banned membership, records an active member membership in session storage on success, and opens the workspace.
- `docs/concepts/REQUIREMENTS.md` — the product must verify the identified user is not banned, record active membership only after all unlisted tags identify one conversation, and avoid exposing the conversation during discovery.
- `docs/concepts/APP_PAGES.md` — a complete unique hidden match enables Join and successful join opens the conversation workspace.

### Backend Need

The product must continue from the privacy-safe complete-match result, revalidate the identified person's eligibility, and durably establish active membership without exposing the unlisted conversation to an ineligible user. Success must provide the conversation continuation needed to open the workspace.

### Visible Inputs

- The complete user-entered tag combination.
- The public-safe hidden-match continuation value carried forward from the completed evaluation.

### Required Outcomes

- Pending join prevents duplicate attempts for the current match.
- Success records active member participation and continues to the conversation workspace.
- A banned or otherwise ineligible identity receives a concise denial without hidden conversation detail.
- A transient failure preserves the complete match and permits retry.
