# Product Requirements: Tawk

**Version:** 1.0 — Draft  
**Date:** 2026-07-22  
**Status:** POC / Pre-production  
**Changelog:** Initial draft

---

## 1. Overview

### What this is

Tawk is a messaging application in which people and bots create or join conversations using combinations of tags. Conversations may be publicly listed for discovery or unlisted so that participants must know the complete tag combination before they can join.

Conversation owners and administrators manage tags, membership, moderation, and reported messages. People and bots participate under identified profiles; anonymous participation is not supported.

### Why we're building it

Tawk explores whether tags can serve both as a flexible discovery system for public conversations and as a lightweight access mechanism for unlisted conversations. The POC also needs to prove that people and bots can participate in the same conversation model while conversation-level roles provide enough control for basic administration and moderation.

### What success looks like for the POC

The POC is successful when it demonstrates that:

- An identified person or token-authenticated bot can create a conversation with between one and ten tags.
- A conversation can be configured as listed or unlisted.
- Users can search for listed conversations by entering or selecting tags and then join a matching conversation.
- An unlisted conversation does not expose its identity or tags through search suggestions, and a user can join it only after supplying all of its tags.
- Listed conversations can use either inclusive matching or an exclusive matching option.
- Conversation owners and administrators can manage tags and participants according to their assigned permissions.
- Participants can post messages, delete permitted messages, and react to messages with emojis.
- Participants can flag messages for review, and owners or administrators can take moderation action.
- Conversation, membership, message, and moderation history can be retained without hard deletion.
- The React application and Node.js API can run locally in Docker using DynamoDB.

---

## 2. Who uses this

### People

People use Tawk to find conversations by tag, join them, exchange messages, react to messages, add notes, and flag content that needs moderator attention. Every person must have an identity; anonymous participation is not allowed.

A person's profile must provide a display name. The product may also distinguish between a proper name and a display name, but that distinction has not been finalized.

### Bots

Bots create and join conversations using token-based credentials. Once inside a conversation, a bot follows the same conversation membership and role model as a person. Bots do not receive a separate class of conversation permissions merely because they are automated.

### Conversation owners

The person or bot that creates a conversation becomes its first owner. Owners can manage conversation tags, promote members to owner or administrator, manage participants, ban or unban identities, moderate messages, and archive the conversation.

A conversation must always have at least one owner. The last remaining owner cannot leave until another member has been promoted to owner, unless the conversation is archived instead.

### Conversation administrators

Administrators help operate and moderate a conversation. They can add or remove tags, remove or ban participants, restore banned participants, review flagged messages, delete messages, and suspend a participant's ability to post.

Administrators cannot add, remove, or otherwise alter owners.

### Ordinary members

Ordinary members participate in conversations, post and delete their own messages, add emoji reactions, leave conversations, add notes, and flag messages. They cannot manage conversation tags, roles, or other participants.

---

## 3. Core features

### Identity and profiles

**What it does:** Gives every person and bot a visible, non-anonymous identity.

**How it works:** A person signs in using the human authentication mechanism selected for the POC. A bot authenticates using a token. Each identity has a profile containing at least a display name, which is shown alongside its conversation activity.

**Rules and constraints:**

- Anonymous participation is not allowed.
- Bots authenticate with tokens.
- A profile must have a display name.
- Whether profiles also store a separate proper name is unresolved.
- Dedicated impersonation-prevention functionality is out of scope for the POC.
- The human authentication mechanism remains to be selected.

### Conversation creation and settings

**What it does:** Allows an identified person or bot to create a tagged conversation.

**How it works:** The creator supplies at least one tag, may add up to ten tags, selects whether the conversation is listed, and, for a listed conversation, may select exclusive tag matching. The creator becomes the first owner.

**Rules and constraints:**

- Every conversation must have at least one tag and no more than ten tags.
- A conversation is either listed or unlisted.
- Exclusive matching is configurable only for listed conversations.
- Unlisted conversations always require all conversation tags to match.
- Owners and administrators can add or remove tags after creation.
- A conversation cannot be left without an owner.
- Conversation deletion is implemented as archival rather than physical deletion.

### Tags

**What it does:** Provides the vocabulary used to identify, discover, and join conversations.

**How it works:** A tag may be a simple value such as `name` or a key/value pair such as `key:value`. Users may invent tags that have already been used by others; tags are shared identifiers and are not owned by any user or conversation.

**Rules and constraints:**

- Tags use English-alphabet Latin letters and numbers.
- Unicode and whitespace are not allowed.
- Tags are case-insensitive.
- A tag component may contain a hyphen only as a separator.
- A component cannot begin or end with a hyphen.
- Tags belonging only to unlisted conversations must never be offered through tag completion.
- The storage and display rules for letter casing remain unresolved.

### Listed conversation discovery

**What it does:** Lets users find publicly listed conversations through tag-based search.

**How it works:** As a user types, Tawk suggests matching tags that are eligible for discovery. The user selects suggested tags to build a search filter. The application updates the list of matching listed conversations, and the user can select a result and join immediately.

For a listed conversation without exclusive matching, matching at least one of the conversation's tags is sufficient for that conversation to appear. For a listed conversation with exclusive matching, the user must match all tags assigned to that conversation.

**Rules and constraints:**

- Only listed conversations expose their identity in search results.
- Tags used exclusively by unlisted conversations cannot appear in suggestions.
- No invitation or approval queue is required before joining a matching conversation.
- A banned identity cannot rejoin.
- The exact behavior when a search contains additional tags beyond those assigned to a conversation remains unresolved.

### Unlisted conversation discovery and joining

**What it does:** Allows a user who knows an unlisted conversation's complete tag combination to join without exposing the conversation through normal search.

**How it works:** The user enters or selects tags. Search may report that a number of hidden conversations match, but it must not reveal their names, identities, or private tags. A user can proceed to join an unlisted conversation only after matching all of that conversation's tags and narrowing the hidden result to one conversation.

**Rules and constraints:**

- Unlisted conversations never appear as identifiable search results.
- Every tag assigned to an unlisted conversation must be supplied before it can be joined.
- A hidden result must not disclose the conversation's identity.
- Tags known only from unlisted conversations must not be suggested through autocomplete.
- A banned identity cannot join, even with the correct tags.
- Brute-force resistance and a formal privacy or abuse threat model are out of scope for the POC.

### Conversation membership and roles

**What it does:** Tracks who belongs to a conversation, their current role, and their role history.

**How it works:** Each participant has a membership record for each conversation. The record stores role assignments over time using effective start and end dates. Supported roles are owner, administrator, member, and none. A role of none retains the identity in the membership data while granting no participation rights, which is used to represent a ban.

**Rules and constraints:**

- People and bots use the same membership and role model.
- Owners can promote members to owner or administrator.
- Administrators cannot alter owners.
- Owners and administrators can remove, ban, and unban participants.
- The last owner cannot leave until another owner exists.
- When a member leaves, their membership is ended rather than hard-deleted.
- Owners and administrators can see former members in the membership list, shown as inactive or grayed out.
- Ordinary members cannot see former members in the membership list.
- Messages written by a former member remain visible, with the former member's displayed identity shown in a grayed-out state.

### Messaging

**What it does:** Allows conversation members to exchange persistent messages.

**How it works:** Active members and bots can post messages to conversations in which they have permission to participate. A member can delete their own message. Owners and administrators can delete messages as part of moderation.

**Rules and constraints:**

- Deleted messages are soft-deleted in storage.
- A deleted message does not remain visible as a “message deleted” placeholder in the conversation.
- Messages are never physically deleted from the database as part of normal product behavior.
- Messages remain visible after their author leaves the conversation unless the message itself is deleted.
- An archived conversation retains its messages.

### Emoji reactions

**What it does:** Allows participants to respond to messages with emojis.

**How it works:** A participant selects an emoji on a message in a manner similar to reactions in Slack. The reaction is associated with both the message and the reacting identity.

**Rules and constraints:**

- Reactions are available to active participants who can view the message.
- The supported emoji set and whether users may add multiple reactions to the same message remain unresolved.

### Message flagging and moderation tickets

**What it does:** Lets a participant report a message and gives conversation owners and administrators a record for reviewing it.

**How it works:** A participant flags a message and enters a description of what is offensive, incorrect, or otherwise concerning. Tawk creates a numbered moderation ticket linked to the flagged message, its conversation, and the identity that submitted the flag.

Owners and administrators review the ticket and may delete the message, remove or ban a participant, or suspend a participant's ability to post until a specified time.

**Rules and constraints:**

- Every flag must identify the reported message, source conversation, and reporting identity.
- The reporting participant can provide explanatory text.
- Moderation tickets receive unique numbers.
- Owners and administrators for the affected conversation receive access to the report.
- Posting suspension must support an end date or time.
- A suspended participant may remain a member while being prevented from posting.
- The exact ticket workflow and status values remain unresolved.

### Notes and private moderation discussion

**What it does:** Provides contextual notes about conversations, messages, and moderation work.

**How it works:** A user may create a note on a conversation or message. Owners and administrators may also attach operational notes to a conversation or moderation ticket. A related conversation may be created for confidential discussion of a ticket and linked back to that ticket.

**Rules and constraints:**

- The visibility model for personal, administrator, and owner notes remains unresolved.
- A moderation discussion conversation behaves like any other conversation and appears in the participating administrators' conversation lists.
- A moderation discussion conversation must retain a relationship to its ticket.
- Whether a related moderation conversation is required or optional remains unresolved.

### Conversation archival

**What it does:** Ends active use of a conversation while retaining its data.

**How it works:** An owner archives the conversation. Its messages, memberships, tags, tickets, and other records remain stored.

**Rules and constraints:**

- Archival replaces hard deletion of a conversation.
- The last owner may archive a conversation instead of transferring ownership.
- Inactivity does not automatically archive a conversation.
- The behavior of archived conversations in search and participant views remains unresolved.

---

## 4. Key user flows

### Create a listed conversation

1. An identified person or token-authenticated bot starts conversation creation.
2. The creator enters between one and ten valid tags.
3. The creator marks the conversation as listed.
4. The creator chooses whether the listed conversation requires exclusive tag matching.
5. Tawk creates the conversation and assigns the creator the owner role.
6. The conversation becomes eligible for tag-based discovery according to its matching mode.

### Find and join a listed conversation

1. An identified user opens conversation search.
2. The user types part of a tag.
3. Tawk suggests matching tags, excluding tags that exist only on unlisted conversations.
4. The user selects one or more tags to build the search filter.
5. Tawk displays matching listed conversations.
6. The user selects a conversation.
7. Tawk verifies that the user is not banned from that conversation.
8. Tawk records the user's active membership and opens the conversation.

### Join an unlisted conversation

1. An identified user enters tags they already know.
2. Tawk evaluates unlisted conversations without revealing their identities or tags.
3. While the supplied tags do not fully match an unlisted conversation, Tawk exposes only a count of hidden matches, if applicable.
4. The user continues entering tags until all tags for an unlisted conversation are matched and the result identifies only one hidden conversation.
5. The user selects Join.
6. Tawk verifies that the user is not banned.
7. Tawk records the user's active membership and opens the conversation.

### Exchange and manage messages

1. An active participant opens a conversation.
2. The participant posts a message.
3. Other active participants read the message and may add emoji reactions.
4. The author may delete their own message.
5. An owner or administrator may delete the message as a moderation action.
6. A deleted message disappears from the visible conversation but remains soft-deleted in storage.

### Flag and review a message

1. A participant selects Flag on a message.
2. The participant enters a reason for the report.
3. Tawk creates a numbered ticket linked to the message, conversation, and reporting identity.
4. The conversation's owners and administrators review the ticket.
5. Reviewers may record notes or open a related private conversation for further discussion.
6. A reviewer may delete the message, suspend the participant's posting ability, remove the participant, or ban the participant.
7. The action and relevant notes remain associated with the ticket.

### Ban and restore a participant

1. An owner or administrator opens the conversation's member list.
2. The moderator selects an active or former participant.
3. The moderator bans the identity by assigning a membership role of none and ending its active permissions.
4. The banned identity can no longer participate or rejoin the conversation.
5. An owner or administrator may later unban the identity and restore an appropriate active role.

### Transfer ownership and leave

1. An owner chooses to leave a conversation.
2. Tawk checks whether another active owner exists.
3. If another owner exists, Tawk ends the departing owner's membership.
4. If the departing owner is the last owner, Tawk prevents departure.
5. The owner must first promote another member to owner or archive the conversation.

---

## 5. Technical requirements

### Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Node.js | Runs the backend API and database-related packages. |
| Framework | React with JavaScript; Fastify or Hono | React provides the client application. The API framework has not yet been selected between Fastify and Hono. |
| Database | Amazon DynamoDB | Stores application data using a non-relational database model. |
| ORM | Not specified | DynamoDB access packages and data-access design remain to be selected. |
| Auth | Bot tokens; human authentication not specified | Anonymous access is not permitted. |
| Payments | None | There are no free or paid product tiers in the POC. |
| Hosting/Deployment | Docker for local development; eventual AWS Lambda wrapper or harness | The API is packaged in a Docker-based local environment and should be structured so it can later run through a Lambda adapter. |

### Technical constraints

- The frontend must use React with JavaScript. This is an explicit decision from the 2026-07-22 technical brain dump.
- The backend must run on Node.js. This is an explicit decision from the 2026-07-22 technical brain dump.
- The API must use either Fastify or Hono; the final choice is unresolved.
- DynamoDB is the required database.
- Local development and execution must be supported through Docker.
- The backend should be structured so that a Lambda wrapper or harness can be added later.
- Persistent records use soft deletion or temporal end dates rather than physical deletion.
- Messages and other retained content are not hard-deleted.
- Basic rate limiting will be applied at the firewall layer, but specific thresholds and infrastructure are not defined.
- No Unicode or whitespace is allowed in tags.
- Tag comparisons are case-insensitive.
- A conversation supports no more than ten tags.

### Data model

The POC requires at least the following concepts:

- **Identity:** Represents a person or bot. It stores the identity type and profile information, including a display name. Bot identities also require token credentials.
- **Conversation:** Stores the conversation's active or archived state, listed or unlisted setting, and listed-conversation matching mode.
- **Tag:** Stores a normalized, case-insensitive tag value. A tag can be reused by any number of conversations and is not owned by an identity.
- **Conversation tag:** Associates a conversation with between one and ten tags.
- **Membership:** Associates an identity with a conversation and records whether the identity is currently active, has left, has been removed, or is banned.
- **Membership role period:** Records an owner's, administrator's, member's, or banned identity's role over a specific period using start and end timestamps.
- **Message:** Belongs to a conversation and an author. It retains its original relationship to the author even after that identity leaves. A soft-deletion state controls whether it remains visible.
- **Emoji reaction:** Associates an identity and emoji with a message.
- **Moderation ticket:** Has a unique ticket number and links to the flagged message, its conversation, and the reporting identity. It may also track moderation actions and discussion.
- **Posting suspension:** Associates an identity with a conversation and records the period during which the identity cannot post.
- **Note:** Belongs to an author and may be attached to a message, conversation, or moderation ticket. It requires a visibility setting once the visibility model is finalized.
- **Related moderation conversation:** A normal conversation that optionally links back to a moderation ticket for confidential discussion.

---

## 6. Out of scope for the POC

- Anonymous participation.
- Dedicated impersonation-prevention functionality.
- A formal privacy or abuse threat model for unlisted conversations.
- Protection against brute-force guessing of unlisted conversation tags beyond requiring the complete tag set and suppressing private tag suggestions.
- Paid plans, free-versus-paid tiers, or payments.
- Conversation participation caps.
- Application-level API or bot rate-limit plans beyond basic firewall rate limiting.
- Retention guarantees or configurable retention policies.
- Hard deletion of messages or other retained conversation records.
- Automatic archival based on inactivity.
- Production hosting and a complete AWS Lambda deployment, although the API should be compatible with a future Lambda wrapper or harness.
- Production-grade scale, availability, and operational guarantees not required to demonstrate the concept.

---

## 7. Open questions

1. **Fastify or Hono:** Which Node.js API framework will be used? This affects project structure, middleware, validation, and the future Lambda wrapper.
2. **Human authentication:** How do people authenticate? Anonymous access is prohibited, but no human identity provider, credential method, or session mechanism has been selected.
3. **Profile names:** Does an identity store both a proper name and a display name, or only a display name?
4. **Tag casing:** Tags are compared case-insensitively, but should the system preserve the creator's capitalization for display, always display lowercase, or allow a separate display form?
5. **Exact tag grammar:** Does “a single hyphen” mean one hyphen per key or value component, or any number of nonconsecutive separator hyphens? The allowed behavior for multiple colons also needs to be defined.
6. **Listed search semantics:** When a user selects several tags, how are extra search tags handled? The requirements define inclusive and exclusive conversation matching but do not fully define whether the search filter uses AND, OR, or another rule across all selected tags.
7. **Hidden-result joining:** Must a user's submitted tags exactly equal an unlisted conversation's tag set, or is supplying all required tags plus unrelated tags acceptable?
8. **Multiple hidden matches:** What should happen if the user has supplied all required tags for more than one unlisted conversation? The current concept says the user must narrow the result to one conversation, but the interface behavior is unspecified.
9. **Conversation rejoining:** When a participant voluntarily leaves and later rejoins, should Tawk create a new membership period on the existing membership record, and are any restrictions applied?
10. **Posting permissions:** Beyond bans and time-limited posting suspensions, are there other reasons or states that can prevent a member from posting?
11. **Moderation tickets:** What statuses, assignment rules, notifications, and closure behavior does a ticket require for the POC?
12. **Moderation authority:** Can both owners and administrators apply every listed moderation action, including posting suspension, or are any actions owner-only?
13. **Notes visibility:** Which visibility choices are supported for notes—for example, author only, all administrators, owners only, or all participants—and can visibility be changed after creation?
14. **Moderation discussions:** Is a linked private conversation required for every moderation ticket, optional when a reviewer requests it, or deferred from the POC?
15. **Emoji behavior:** Which emoji set is supported, and can one identity add more than one different reaction to a message?
16. **Archived conversations:** Should archived conversations disappear from search, become read-only for existing members, or remain accessible in another form?
17. **Conversation metadata:** Beyond tags, listed state, matching mode, and archive state, does a conversation require a title or description? Search results need some identifiable presentation, but the brain dumps do not define it.
18. **Tag changes on unlisted conversations:** If an owner or administrator changes the tags, what happens to existing members, saved links, or users currently attempting to join?
19. **Firewall rate limiting:** What infrastructure applies the rate limit, and what basic threshold is sufficient for the POC?
20. **DynamoDB access layer:** Which library or data-access pattern will be used, and how will temporal membership history and multi-entity lookups be modeled efficiently?

---

## 8. Assumptions

- “Tawk” is the working product name.
- Every action that creates, joins, posts to, reacts within, or moderates a conversation is performed by an identified person or bot.
- A bot can own or administer a conversation because bots share the same membership model as people.
- The most recent role decision applies: owners and administrators may both add and remove conversation tags.
- A role of none represents a retained but banned membership rather than absence of a membership record.
- Leaving, removal, banning, and role changes are recorded as time-based membership history.
- A user who voluntarily leaves is not automatically banned and may be eligible to rejoin.
- Listed conversations can be joined immediately when their tag rules are satisfied; no approval queue or invitation is required.
- Unlisted conversations use mandatory all-tag matching and do not expose identifying search results.
- Exclusive matching is an option for listed conversations only.
- Deleted messages disappear from the visible conversation while remaining stored as soft-deleted records.
- A former participant's undeleted messages remain visible, and their displayed identity is visually de-emphasized.
- Owners and administrators can inspect former membership records; ordinary members cannot.
- Conversation archival is the product's delete action.
- There is no automatic conversation lifecycle behavior based on inactivity.
- All data is retained for the POC unless it is hidden through soft deletion or an ended temporal record.
- Docker is the required local deployment target; AWS Lambda compatibility is a future-facing technical constraint rather than a completed deployment requirement.
