# App Pages (Desktop Mockup)

Derived from `docs/concepts/REQUIREMENTS.md`, `docs/concepts/USER_TYPES.md`, and `docs/concepts/APP_STRUCTURE.md`.

All paths are relative to `docs/mockup/desktop/`.

Tawk is a tag-based messaging product. The mockup is organized as six micro-apps that mirror the application areas in `APP_STRUCTURE.md`. Every page shares typography, color, spacing, and tag presentation, but each area is shaped by its own job: explaining the product, finding a conversation, talking in one, governing one, resolving a report, or operating a bot identity.

---

## Micro-app: Product Home (Public)

### Home

- **Title:** Tawk
- **Relative path:** `index.html`
- **Micro-app/section:** Product Home
- **Primary job:** Let a first-time visitor understand what a tagged conversation is and how listed and unlisted conversations differ, then enter identified access.
- **Project-appropriate pattern:** Single-column explanatory landing page with a short worked example of tags.
- **Purpose:** This is the product's only unauthenticated surface. It exists because Tawk's core idea (tags as both discovery and access) is unusual enough that a person needs it explained before signing in. It shows a concrete tag example rather than abstract marketing claims.
- **Required behavior:**
  - Explain listed versus unlisted conversations side by side, using real example tag sets.
  - State plainly that participation requires an identity and that anonymous use is not supported.
  - Provide the entry into the private product (sign-in path) and a secondary path for bot operators.
- **Density budget:** Sparse. One narrative column. A visitor should be able to read the whole page without scrolling past three ideas.
- **Must omit:** Live conversation search, any real conversation names, any tag that belongs only to an unlisted conversation, participant counts, pricing/tiers, testimonials, feature-grid marketing blocks.
- **Navigation:** Entry point of the mockup. Goes to `hub/conversations.html` (sign in as a person) and `bots/bots.html` (bot operator path).

---

## Micro-app: Conversation Hub (Private)

### Your Conversations

- **Title:** Your Conversations
- **Relative path:** `hub/conversations.html`
- **Micro-app/section:** Conversation Hub
- **Primary job:** Let a signed-in person return to a conversation they already belong to, and start the find-or-create path.
- **Project-appropriate pattern:** Simple list of joined conversations, each identified by its name, topic, and tag set.
- **Purpose:** This is the private landing surface. A conversation is recognised by its name first and its tags second, so the list leads with the name and carries the tags underneath as the thing that actually addresses it. It exists so a returning member is not forced back through search.
- **Required behavior:**
  - List the current identity's active conversations with their name, topic, tags, role badge, and last activity in relative terms.
  - Show linked moderation discussion conversations in the same list, since they behave like any other conversation.
  - Offer the two forward actions: find a conversation, or create one.
- **Density budget:** Sparse to moderate. A plain list of rows, no metrics, no columns of counts.
- **Must omit:** Unread-count dashboards, message previews for every row, activity charts, archived-conversation management, a global left sidebar of every product area.
- **Navigation:** Arrives from `../index.html`. Goes to `find-conversations.html`, `create-conversation.html`, and `../workspace/conversation.html`.

### Find a Conversation

- **Title:** Find a Conversation
- **Relative path:** `hub/find-conversations.html`
- **Micro-app/section:** Conversation Hub
- **Primary job:** Build a tag filter and join a conversation that matches it.
- **Project-appropriate pattern:** Tag-token search field with autocomplete, plus a results list below it.
- **Purpose:** This is the heart of the discovery concept and the page that proves the privacy rule. One search surface serves both cases on purpose: listed conversations resolve to identifiable results, while unlisted conversations can only ever surface as a non-identifying hidden-match count until every one of their tags has been supplied. Splitting these into two pages would misrepresent the product, because the user does not know in advance which kind they are looking for.
- **Required behavior:**
  - Suggest tags as the user types, never suggesting a tag that exists only on unlisted conversations.
  - Add and remove tag tokens, updating listed results as the filter changes, and show each listed result's name and topic alongside which tags matched inclusively versus by exclusive (all-tags) matching.
  - Report unlisted matches only as a count, disclosing neither their name, topic, nor tags, and enable Join for a hidden conversation only when the filter narrows it to exactly one fully matched conversation.
  - Block joining with a clear reason when the identity is banned from that conversation.
- **Density budget:** Moderate. The search field and results carry the page; each result is one compact row, not a card grid of metadata.
- **Must omit:** Filters unrelated to tags (date, size, activity), sort controls, faceted sidebars, saved searches, any display of an unlisted conversation's tags or name, brute-force protections or rate-limit messaging (out of scope).
- **Navigation:** Arrives from `conversations.html`. Goes to `../workspace/conversation.html` on join, and to `create-conversation.html` when nothing matches.

### Create a Conversation

- **Title:** Create a Conversation
- **Relative path:** `hub/create-conversation.html`
- **Micro-app/section:** Conversation Hub
- **Primary job:** Name a new conversation, define its tag set and visibility, and become its owner.
- **Project-appropriate pattern:** Short single-column setup form with live name and tag validation.
- **Purpose:** Creation is a setup job with real constraints (a required name, one to ten tags, tag grammar, listed versus unlisted, exclusive matching only when listed). It is a separate page because those rules need room to be explained and validated as the user types, which would clutter the search surface.
- **Required behavior:**
  - Require a name and accept an optional topic, both within stated length limits, and explain that the name identifies the conversation while the tags address it.
  - Accept one to ten tags, rejecting whitespace, Unicode, leading/trailing hyphens, and showing the remaining tag allowance.
  - Toggle listed versus unlisted, enabling the exclusive-matching choice only for listed conversations and stating that unlisted conversations always require all tags.
  - Show a plain preview of how the conversation will behave in search, then confirm creation with the creator named as first owner.
- **Density budget:** Sparse. One form, one preview, no side panels.
- **Must omit:** Member invitations, avatars, category pickers, advanced permission settings, scheduling.
- **Navigation:** Arrives from `conversations.html` or `find-conversations.html`. Goes to `../workspace/conversation.html` on creation.

---

## Micro-app: Conversation Workspace (Private)

### Conversation

- **Title:** Conversation
- **Relative path:** `workspace/conversation.html`
- **Micro-app/section:** Conversation Workspace
- **Primary job:** Read and post messages in a conversation the user belongs to.
- **Project-appropriate pattern:** Familiar message thread with a composer, per-message actions, and inline reactions.
- **Purpose:** This is the product's primary work mode and should feel like a real chat surface. Everything else on the page exists to support the reading and writing of messages: reactions, the author's own delete, flagging, and notes are per-message actions rather than separate destinations.
- **Required behavior:**
  - Render the message history with author identity, distinguishing bot authors and visually de-emphasizing former members while keeping their messages readable.
  - Post a message, delete the user's own message so it disappears entirely without a placeholder, and add emoji reactions that show who reacted.
  - Address a participant by typing `@` in the composer, which offers the conversation's active people and bots by handle, completes the one chosen, and renders the result as a visible mention in the posted message. A message that mentions the reader is marked as such.
  - Flag a message through a dialog requiring an explanatory reason, confirming with the resulting ticket number.
  - Attach a note to a message or to the conversation, and leave the conversation, with the last-owner rule blocking departure and explaining why.
- **Density budget:** Moderate. A single message column with a light header strip carrying the conversation's name, topic, tags, and role-appropriate links. No secondary sidebar.
- **Must omit:** A permanent member roster panel, unread markers, threads/replies, typing indicators, file uploads, search within the conversation, message IDs and timestamps beyond a readable time, "message deleted" tombstones (explicitly forbidden by requirements), and any notification, inbox, or alert surface built on top of mentions.
- **Navigation:** Arrives from `../hub/conversations.html` or `../hub/find-conversations.html`. Owners and administrators can go to `../governance/members.html`, `../governance/settings.html`, and `../moderation/reports.html`.

---

## Micro-app: Conversation Governance (Private)

### Members and Roles

- **Title:** Members and Roles
- **Relative path:** `governance/members.html`
- **Micro-app/section:** Conversation Governance
- **Primary job:** Review who belongs to a conversation and change a participant's standing.
- **Project-appropriate pattern:** Roster table, because comparing identity, role, and standing across rows is the whole task.
- **Purpose:** Membership is temporal in Tawk: people leave, get removed, get banned, and get restored, and owners must be able to see former members that ordinary members cannot. A table is justified here specifically because the moderator is scanning and comparing many participants.
- **Required behavior:**
  - List active members with their handle, role, and joined date, and show former, removed, and banned identities in a de-emphasized state that is available to owners and administrators only.
  - Promote a member to administrator or owner, with owner-only controls disabled and explained for an administrator viewer.
  - Remove, ban, unban, and apply a time-bounded posting suspension, each confirming the effect in plain language.
  - Enforce the ownership-continuity rule when the last owner attempts to step down.
- **Density budget:** Dense, by exception. This is the one roster-comparison task in the product, and the table is limited to identity, role, standing, and actions.
- **Must omit:** Full role-history audit trails, membership record IDs, raw effective-start/end timestamps, permission matrices, bulk selection, CSV export, per-member activity statistics.
- **Navigation:** Arrives from `../workspace/conversation.html`. Goes to `settings.html`, `../moderation/reports.html`, and back to the conversation.

### Conversation Settings

- **Title:** Conversation Settings
- **Relative path:** `governance/settings.html`
- **Micro-app/section:** Conversation Governance
- **Primary job:** Maintain a conversation's name, topic, tags, and visibility, and archive it when its work is done.
- **Project-appropriate pattern:** Short settings page with a name/topic editor, a tag editor, and a clearly separated destructive-adjacent action.
- **Purpose:** The name and topic say what a conversation is, while the tags decide who can reach it, so both belong on the same quiet surface where the consequences of a change can be stated. Archival lives here because it is the product's delete action and belongs with the conversation's lifecycle rather than with its people.
- **Required behavior:**
  - Edit the name and topic within their length limits, saving them together and confirming the change, with the name required and the topic optional.
  - Add and remove tags under the one-to-ten limit with the same grammar validation as creation, warning that changing the tags of an unlisted conversation changes how it can be reached.
  - Show current visibility and matching mode, allowing the matching change only where the requirements permit it.
  - Offer archival as an owner-only action behind a confirmation that states data is retained, with the control visibly unavailable and explained for an administrator.
- **Density budget:** Sparse. Three small sections on one column.
- **Must omit:** Notification preferences, retention policy controls, integrations, danger-zone lists of unsupported destructive actions, hard delete, conversation transfer wizards.
- **Navigation:** Arrives from `members.html` or `../workspace/conversation.html`. Returns to the conversation.

---

## Micro-app: Moderation Review (Private)

### Reports

- **Title:** Reports
- **Relative path:** `moderation/reports.html`
- **Micro-app/section:** Moderation Review
- **Primary job:** Pick the next reported message that needs a decision.
- **Project-appropriate pattern:** Case queue list, ordered by how long a report has been waiting.
- **Purpose:** Reviewers govern more than one conversation, so reports need a single place to be triaged. The page is a queue, not a dashboard: it exists to get the reviewer into a specific report quickly.
- **Required behavior:**
  - List numbered reports across the conversations this reviewer governs, showing the reported message excerpt, the conversation's tags, who reported it, and how long it has waited.
  - Separate reports still awaiting a decision from those already acted on, without inventing a formal status workflow (unresolved in requirements).
  - Open a report for review.
- **Density budget:** Moderate. A queue of compact rows.
- **Must omit:** Moderation metrics or KPI cards, assignment/ownership of tickets, SLA countdowns, status pipelines, charts, reports from conversations the viewer does not govern.
- **Navigation:** Arrives from `../workspace/conversation.html` or `../governance/members.html`. Goes to `report.html`.

### Report Review

- **Title:** Report Review
- **Relative path:** `moderation/report.html`
- **Micro-app/section:** Moderation Review
- **Primary job:** Decide what to do about one reported message.
- **Project-appropriate pattern:** Single-case review page: the evidence first, then the available actions.
- **Purpose:** A decision needs context that the queue cannot carry: the flagged message in its surrounding conversation, the reporter's explanation, and the author's standing. This page keeps that evidence and the supported outcomes together so the reviewer can act once and record why.
- **Required behavior:**
  - Show the flagged message with a small amount of surrounding conversation, the reporting identity, and the submitted reason.
  - Offer the supported outcomes: delete the message, suspend posting until a chosen time, remove the participant, or ban the participant, each confirming what it does.
  - Record a review note, and optionally open a linked private moderation conversation that then behaves like any other conversation.
- **Density budget:** Moderate. Evidence panel plus an action panel, nothing else.
- **Must omit:** Ticket state machines, assignment and reassignment, audit logs of every view, reporter history profiles, canned-response libraries, appeal flows.
- **Navigation:** Arrives from `reports.html`. Actions can lead to `../governance/members.html`; a linked discussion leads to `../workspace/conversation.html`.

---

## Micro-app: Bot Participation (Private)

### Bots

- **Title:** Bots
- **Relative path:** `bots/bots.html`
- **Micro-app/section:** Bot Participation
- **Primary job:** Let an operator see their bot identities, retrieve a bot's token, and check where each bot participates.
- **Project-appropriate pattern:** Short list of identity cards, each showing its credential state and conversation memberships.
- **Purpose:** Bots are first-class identities with the same conversation roles as people, so the only thing this area needs to add is the token-based entry point and a view of where a bot currently participates. It is deliberately one page because Tawk is not building a developer platform.
- **Required behavior:**
  - List the operator's bot identities with display name and the conversations each has joined, including the role held there.
  - Keep each token masked, revealing or copying it on an explicit action, and allow regenerating a token with a plain warning about what breaks.
  - Register a new bot identity with a display name.
- **Density budget:** Sparse. A few identity cards.
- **Must omit:** API documentation, webhook configuration, usage analytics, rate-limit dashboards, scopes and permission editors, OAuth flows, separate bot-only conversation permissions.
- **Navigation:** Arrives from `../index.html`. Goes to `../hub/conversations.html` and `../workspace/conversation.html`.

---

## Shared Assets

- `assets/styles.css` — the single design system for all six micro-apps.

## Review Notes

Applied during the scope review pass:

- **Conversation search kept as one page.** Listed and unlisted discovery share a search surface deliberately; the privacy rule is only demonstrable when both behaviors coexist in one filter. Confirmed against `REQUIREMENTS.md` §"Unlisted conversation discovery and joining".
- **No sign-in page built.** The human authentication mechanism is unresolved (open question 2), so the mockup treats the transition from `index.html` to `hub/conversations.html` as already-identified rather than inventing a credential screen.
- **Conversations carry a name and a topic.** Open question 17 asked whether a conversation needs a title or description. Resolved by the product owner on 1 Aug 2026: it needs both. A name is required at creation and editable afterwards; a topic is optional. The name identifies the conversation to a reader, the tags still address it, and the two are deliberately independent so that renaming a conversation never changes who can reach it. Neither the name nor the topic of an unlisted conversation is ever disclosed by search, which continues to report hidden matches as a bare count.
- **Roster table is the only dense surface.** `governance/members.html` is the single page permitted a table, on the grounds that comparing participants is its primary task. No other page may add one.
- **Identities have handles, and messages can mention them.** Added by the product owner on 1 Aug 2026; the requirements do not describe mentions. Every identity, person or bot, carries a handle in the same grammar as a tag (lowercase Latin letters, numbers, hyphens between words), so `@priya-r` and `@kiln-log-bot` read alike and bots are addressable exactly as people are. Only a conversation's active participants are offered for completion, since mentioning someone who has left or been banned would be meaningless. A mention is presentational and relational only: it marks who is being addressed and flags messages that address the reader. It creates no notification, inbox, alert, or unread state, none of which the requirements support. Handles are shown on the membership roster so they can be looked up.
- **Notes carry no visibility control.** The visibility model is unresolved (open question 13), so notes are shown as author-attributed text without a visibility selector.
- **Archived-conversation behavior is not simulated.** Open question 16 leaves search and participant-view behavior undefined, so archival confirms and returns rather than demonstrating a post-archive state.
- **Ticket statuses are not modeled.** Open question 11 is open, so `moderation/reports.html` separates awaiting-decision from acted-on without a status pipeline.
