# Tawk Data Dictionary

This dictionary summarizes the durable records needed for Tawk's identity, conversation, membership, messaging, and moderation workflows.

| Schema file | Object | Purpose |
|---|---|---|
| `bot-credential.yaml` | Bot Credential | Authenticates bot identities with revocable token digests. |
| `conversation-tag.yaml` | Conversation Tag | Retains each assignment between a conversation and a reusable tag. |
| `conversation.yaml` | Conversation | Stores a tagged messaging space, discovery rules, purpose, and archive state. |
| `emoji-reaction.yaml` | Emoji Reaction | Records an identity's retained emoji response to a message. |
| `identity.yaml` | Identity | Represents a non-anonymous person or bot and its visible profile. |
| `membership-event.yaml` | Membership Event | Explains each join, role change, departure, removal, ban, or restoration. |
| `membership-role-period.yaml` | Membership Role Period | Preserves time-bounded conversation role assignments. |
| `membership.yaml` | Membership | Stores the current relationship between an identity and a conversation. |
| `message.yaml` | Message | Retains participant-authored conversation content and soft-deletion state. |
| `moderation-action.yaml` | Moderation Action | Audits concrete actions taken by conversation moderators. |
| `moderation-ticket.yaml` | Moderation Ticket | Tracks a numbered participant report tied to a message and conversation. |
| `note.yaml` | Note | Attaches contextual text to one conversation, message, or moderation ticket. |
| `posting-suspension.yaml` | Posting Suspension | Applies a time-limited posting restriction without ending membership. |
| `tag.yaml` | Tag | Stores a normalized reusable value for conversation discovery and joining. |

## Object details

### Bot Credential

Bot Credential separates authentication secrets from a bot's visible Identity record and stores only a digest rather than the plaintext token. Its lifecycle fields allow credentials to be revoked, expired, rotated, and audited without changing the bot's conversation memberships. A revoked credential requires `revokedAt`; an active credential cannot contain `revokedAt`.

### Conversation Tag

Conversation Tag implements the reusable many-to-many relationship between Conversation and Tag. Effective add/remove fields preserve tag-management history, while `position` supports a deterministic one-to-ten active-tag ordering. `removedAt` and `removedById` must appear together so every removal has both a time and an actor.

### Conversation

Conversation is the aggregate root for messages, memberships, discovery behavior, and archival. A moderation discussion is represented as an unlisted conversation with a special purpose, `matchingMode: allTags`, and a required link to its Moderation Ticket, preserving the common participation model. Unlisted discovery hides the discussion from identifiable search results but is not, by itself, authorization to join a confidential discussion. A standard conversation cannot carry `moderationTicketId`. An archived conversation requires both `archivedAt` and `archivedById`; an active conversation cannot carry either archive field.

### Emoji Reaction

Emoji Reaction connects an active participant and an emoji to a Message in the same Conversation. A removal timestamp keeps withdrawn reactions available to history while omitting them from the active reaction display.

### Identity

Identity gives every person and bot a stable, non-anonymous actor record and required display name. Optional proper-name and human-authentication fields preserve room for the authentication and profile decisions that remain open. `status: disabled` prevents access while preserving the stable actor record needed to attribute retained messages and audit history; there is no separate identity-deletion lifecycle in the current requirements.

### Membership Event

Membership Event is the append-only explanatory audit stream for participation transitions, including rejoining and moderation-driven changes. It complements role periods by recording who initiated a change, why it happened, and which ticket prompted it when applicable. Role-change, ban, unban, join, and rejoin entries require role values that show the transition defined by their `type`.

### Membership Role Period

Membership Role Period preserves every owner, administrator, member, or none assignment with effective timestamps. These periods make historical authorization and ownership changes inspectable without overwriting prior roles. Role periods for one `membershipId` cannot overlap, and only one period may remain open without `effectiveTo`.

### Membership

Membership is the durable identity-to-conversation relationship used for current authorization and member-list behavior. It is retained when someone leaves, is removed, or is banned, and it points conceptually to role periods and events for full history. `currentRole` exists only for `currentStatus: active` or `currentStatus: banned`; `none` is reserved for a ban. Authorization requires `currentStatus: active` as well as an allowed `currentRole`.

### Message

Message retains content and its original author relationship even after the author leaves. Soft-deletion metadata hides deleted content from conversation views without physically removing the record. `deletedAt` requires `deletedById`; deletion actor and reason fields cannot appear on a visible message. A ticket-driven deletion is linked through `Moderation Action.moderationTicketId` and `Moderation Action.targetMessageId`, rather than a single backward ticket field on Message, because more than one ticket may report the same message.

### Moderation Action

Moderation Action is an append-only record of each message deletion, participant removal or ban, restoration, or posting restriction performed by an owner or administrator. Its optional ticket and target links connect the audit entry to the reviewed report and affected records. `suspendPosting` and `liftPostingSuspension` actions require `postingSuspensionId` so the audit record identifies the exact restriction created or lifted.

### Moderation Ticket

Moderation Ticket captures the reporter, reported message, source conversation, explanatory reason, and a unique human-readable number. Its deliberately small provisional status set supports review and resolution while making the unresolved workflow explicit.

### Note

Note provides context on exactly one Conversation, Message, or Moderation Ticket. Its provisional, optional visibility field acknowledges that the final personal, moderator, owner, and participant audience model has not yet been chosen.

### Posting Suspension

Posting Suspension denies message creation for a bounded interval while leaving Membership active. It records the imposing moderator, required end time, optional early lift, and related ticket for permission checks and audit history. `liftedAt` and `liftedById` must appear together. Its operational state is derived rather than stored: a suspension is lifted when `liftedAt` exists, active while the current time is within `startsAt` and `endsAt` without a lift, and otherwise not active.

### Tag

Tag stores a canonical lowercase value so comparisons are case-insensitive and associations can be reused across conversations. Whether a tag is simple or key/value is derived from the optional colon in `normalizedValue`, avoiding a second stored classification that could disagree with the value. An optional display value preserves creator casing if the product later chooses that display policy; autocomplete eligibility is derived only from active listed Conversation Tag associations.

## Relationship summary

Identity owns Bot Credentials and participates in Conversations through Membership records. Each Membership has temporal Membership Role Periods and Membership Events; Conversations have one to ten active Conversation Tags pointing to shared Tags, plus Messages whose Emoji Reactions remain attributable to identities. A reported Message creates a Moderation Ticket, which can collect Notes, Moderation Actions, Posting Suspensions, and an optional linked moderation-discussion Conversation.

## Application and transaction invariants

An **invariant** is a rule that must remain true after every successful write. A **transaction** is a group of writes that either all succeed or all fail. The YAML schemas validate one record at a time; they cannot prove that referenced records exist or that rules spanning several records are true. The application and DynamoDB write layer must enforce the following rules separately from per-record schema validation:

- **Conversation tags:** For each `Conversation.id`, application writes must atomically preserve between one and ten active `Conversation Tag` records, where active means `removedAt` is absent. Active records must have unique `(conversationId, tagId)` and `(conversationId, position)` pairs. Conversation creation must write the Conversation, its first-owner Membership and Membership Role Period, and all initial Conversation Tag records in one transaction. Tag removal must reject removal of the final active tag.
- **Conversation ownership:** Any write that ends an active owner Membership or owner Membership Role Period must prove that another active owner exists for the same `conversationId`, unless the same transaction sets `Conversation.status` to `archived`. An administrator cannot create, end, or alter an owner Membership Role Period; only an owner can do so.
- **Role periods:** `Membership Role Period.membershipId` must reference a Membership whose `conversationId` and `identityId` equal the copied period fields. `effectiveTo`, when present, must be later than `effectiveFrom`. Periods for one `membershipId` must not overlap, and at most one may omit `effectiveTo`. A role change must end the current period and create the next period atomically.
- **Message deletion:** `Message.deletedById` must identify either `Message.authorIdentityId` or an identity that had an active owner or administrator Membership in `Message.conversationId` at `deletedAt`. This authorization check preserves the rule that authors delete their own messages while moderators may delete other messages.
- **Moderation actions and suspensions:** For a `Moderation Action.type` of `suspendPosting` or `liftPostingSuspension`, the referenced Posting Suspension must have `identityId` equal to `Moderation Action.targetIdentityId` and `conversationId` equal to `Moderation Action.conversationId`. `Posting Suspension.membershipId` must reference a Membership whose `identityId` and `conversationId` equal the copied suspension fields. `Posting Suspension.endsAt` must be later than `startsAt`. Permission checks must use the interval and any early lift consistently with the derived-state rule in the Posting Suspension entry above.
- **Moderation tickets:** `Moderation Ticket.messageId` must reference a Message whose `conversationId` equals `Moderation Ticket.conversationId`. `Moderation Ticket.reportingIdentityId` must have had an active Membership allowed to view that message at `reportedAt`. `ticketNumber` must be globally unique; the DynamoDB write layer must use a conditional write or counter allocation so concurrent reports cannot receive the same number.
- **Emoji reactions:** `Emoji Reaction.messageId` must reference a Message whose `conversationId` equals `Emoji Reaction.conversationId`. `Emoji Reaction.identityId` must have an active Membership in that conversation when the reaction is created. No uniqueness rule is defined yet for `(messageId, identityId, emoji)` because the number of reactions one identity may add remains an explicit product question.
- **Bot credentials:** `Bot Credential.identityId` must reference an Identity with `type: bot`. An active credential can authenticate only while its Identity has `status: active` and, when `expiresAt` is present, the current time is earlier than `expiresAt`.

Record-level schema validation and application-level relationship validation are separate checks. A record that conforms to one YAML schema can still be rejected when one of these cross-record invariants is not satisfied.
