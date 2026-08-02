# Tawk Data Dictionary

This dictionary summarizes the durable data objects derived from the MVP requirements. The schemas are implementation-neutral JSON Schema documents encoded as YAML; DynamoDB access patterns and physical table design can be chosen separately.

| Schema file | Object | Purpose |
|---|---|---|
| `audit-event.yaml` | Audit Event | Retains important changes across conversation, membership, message, and moderation records. |
| `bot-credential.yaml` | Bot Credential | Authenticates a bot through a revocable token without retaining the raw token. |
| `conversation-tag.yaml` | Conversation Tag | Records the time-bounded assignment of a shared tag to a conversation. |
| `conversation.yaml` | Conversation | Stores the messaging space, discovery mode, note setting, and archival state. |
| `emoji-reaction.yaml` | Emoji Reaction | Connects an identity and an emoji to a message. |
| `emoji.yaml` | Emoji | Defines a standard or uploaded custom emoji available for reactions. |
| `human-authentication.yaml` | Human Authentication | Connects a human identity to a verified OIDC or passwordless-email sign-in method. |
| `identity.yaml` | Identity | Represents every identified human or bot that uses Tawk. |
| `membership-role-period.yaml` | Membership Role Period | Preserves role assignments and bans over time. |
| `membership.yaml` | Membership | Tracks the retained relationship and current participation state between an identity and a conversation. |
| `message-thread.yaml` | Message Thread | Groups replies and records whether a reported thread is paused. |
| `message.yaml` | Message | Stores persistent authored content and its visible, review-hidden, or soft-deleted state. |
| `moderation-action.yaml` | Moderation Action | Records an owner or administrator's moderation decision. |
| `moderation-ticket.yaml` | Moderation Ticket | Tracks a numbered message report, review lifecycle, and confidential discussion conversation. |
| `note.yaml` | Note | Stores context-sensitive private, participant, or moderator notes. |
| `posting-suspension.yaml` | Posting Suspension | Defines a time-limited restriction on a member's ability to post. |
| `tag.yaml` | Tag | Stores one reusable normalized tag used for discovery and joining. |

## Object details

### Audit Event

Audit events provide an append-only explanation of historically important state changes that are not fully evident from the latest object state. Each event is written once and uses `createdAt` as its immutable persistence timestamp; it has no update lifecycle. `AuditEvent.details` may hold a small explanation or selected before-and-after values, but it is non-authoritative and must not duplicate complete source records. The referenced source schema remains the authoritative record.

### Bot Credential

Bot credentials let automated identities authenticate through tokens while storing only a token hash. `BotCredential.tokenPrefix` is optional implementation support for credential formats that use prefix-based lookup; it is not required product data. Lifecycle fields support expiry, revocation, and last-used visibility independently from the bot's public profile.

### Conversation Tag

Conversation tags implement the many-to-many relationship between conversations and shared tags. Effective timestamps and actor identifiers preserve tag history while application rules enforce one to ten current assignments per conversation. An ended assignment has both `ConversationTag.effectiveTo` and `ConversationTag.removedById`; a current assignment has neither field.

### Conversation

The conversation is the main messaging container and stores its required title, description, listed or unlisted visibility, matching mode, purpose, access mode, and active or archived state. A `Conversation` with `purpose: general` uses `accessMode: tagJoin`. A `Conversation` with `purpose: moderationDiscussion` uses `accessMode: ticketReviewers`, is unlisted, and cannot be joined through tags.

### Emoji Reaction

An emoji reaction records which active participant applied which emoji to a message. Keeping reactions separate supports Slack-like aggregation and allows participants to remove a reaction without deleting its history.

### Emoji

Emoji records give standard and custom reactions a shared identity. Custom definitions carry the uploaded PNG, JPEG, or animated GIF metadata and may be scoped to an identity or conversation. A conversation-scoped custom emoji may be created only by an identity that is a current owner or administrator of that conversation.

### Human Authentication

Human authentication records ensure each person signs in through OIDC or passwordless email and resolves to a verified email address. Separating sign-in connections from profiles allows an identity to retain stable conversation history if authentication details change.

### Identity

Identity provides the common actor model used by both people and bots, including the required display name and optional human profile attributes. Human-specific email guarantees are expressed conditionally, while credentials live in their dedicated authentication records.

### Membership Role Period

Membership role periods retain owner, administrator, member, and `none` assignments with effective start and end times. `MembershipRolePeriod.startReason` records why a period began. When a period ends, `effectiveTo`, `endReason`, and `endedById` are all required; current periods omit all three. These records support promotion, demotion, leaving, rejoining, banning, and unbanning while enabling enforcement of the invariant that every active conversation has an owner.

### Membership

Membership is the stable link between one identity and one conversation and exposes its current active, left, removed, or banned state. An active membership has no current-cycle ending fields. A left, removed, or banned membership requires `endedAt`, `endedById`, and the matching `endReason`. Join counters and timestamps accommodate repeated voluntary leave-and-rejoin cycles without discarding former-member history.

### Message Thread

Message threads group a root message and its replies inside a conversation. `MessageThread.status` is `paused` while any message in the thread has a moderation ticket whose status is not `closed`, so no participant can reply while any report remains unresolved. `MessageThread.pausedAt` and `MessageThread.resumedAt` record the most recent transition; append-only `AuditEvent` records retain earlier pause and resume transitions.

### Message

Messages retain their original author and conversation even after the author leaves. Their lifecycle distinguishes normal visibility, temporary hiding during review, and soft deletion, allowing the product to remove content from views without physical deletion. Review hiding is derived from every `ModerationTicket` for the message instead of one stored ticket identifier.

### Moderation Action

Moderation actions are append-only records of message deletion or restoration, identity warnings, participant removal or bans, and posting-suspension changes. Each `ModerationAction.actionType` permits only its relevant target fields: message actions target `targetMessageId`; participant removal, ban, and unban actions target `targetIdentityId`; `warnIdentity` requires `targetIdentityId`, `ticketId`, and `rationale`; suspension creation targets both `targetIdentityId` and `postingSuspensionId`; and suspension lifting targets `postingSuspensionId`. This keeps the acting moderator, affected record, and ticket inspectable without contradictory targets. A warning is retained as an action only; no karma, warning-point, or reputation score is defined.

### Moderation Ticket

Moderation tickets connect a reporter and explanation to the affected message and conversation using a unique user-facing number. They carry the MVP status lifecycle and identify the required confidential conversation in which owners and administrators discuss that one report. A closed ticket requires `ModerationTicket.disposition` with either `keepMessage` or `removeMessage`; disposition is absent before closure. `closed` is a terminal lifecycle state, meaning the ticket cannot transition to another status or be reopened. Reviewer assignment is not stored because assignment rules remain a product decision; access is determined by owner and administrator roles in the source conversation.

### Note

Notes attach contextual text to exactly one conversation, thread, message, or moderation ticket. Conversation notes allow `private` or `conversationParticipants`; thread notes allow `private` or `threadParticipants`; and moderation-ticket notes require `moderators`. For a message note, the application must inspect the referenced `Message.threadId`: a message inside a thread allows `private` or `threadParticipants`, while a message outside a thread allows `private` or `conversationParticipants`. An active note has no deletion fields, while a deleted note requires both `deletedAt` and `deletedById`. Only `Note.authorIdentityId` may change `Note.visibility`, only while `Note.status` is `active`, and only to another audience allowed for that target context. Each visibility change updates `Note.updatedAt` and creates an append-only `AuditEvent` with `subjectType: note`, `subjectId: Note.id`, `actorIdentityId: Note.authorIdentityId`, `action: noteVisibilityChanged`, the change time in `occurredAt`, and `details` containing only `previousVisibility` and `newVisibility`.

### Posting Suspension

Posting suspensions prevent a current member from posting during a defined time interval without ending membership. They record who imposed the restriction, its optional moderation ticket, and any early lift.

### Tag

Tags provide reusable lowercase identifiers that are not owned by any conversation or identity. `Tag.value` is either one 1-to-15-character component or two independently validated 1-to-15-character components separated by exactly one colon, for a maximum total length of 31 characters. Each component uses lowercase Latin letters, digits, and internal hyphens and cannot begin or end with a hyphen. Whether a tag is suggested is derived from its active listed-conversation assignments.

## Relationship summary

Identities authenticate through human authentication records or bot credentials, then participate through one retained membership per conversation and time-bounded role periods. Conversations receive one to ten current tags through conversation-tag records and contain messages, threads, reactions, and notes. Each message report creates its own moderation ticket and required confidential conversation; moderation actions, posting suspensions, notes, and audit events preserve the resulting review and enforcement history.

## Cross-record integrity rules

These are application/data-access constraints because a standalone JSON Schema document cannot count or compare separate records:

- `Membership` has composite uniqueness on `(conversationId, identityId)`: one retained membership represents every leave-and-rejoin cycle for one identity in one conversation.
- At most one `MembershipRolePeriod` for a `membershipId` may omit `effectiveTo`. That current role must agree with `Membership.status`: an active membership has one current `owner`, `administrator`, or `member` role; a banned membership has one current `none` role; and a left or removed membership has no current role period.
- Every active `Conversation` must have at least one active owner membership. The last owner cannot leave or be changed to another role until another active owner exists; archival is the allowed alternative.
- A conversation has one to ten current `ConversationTag` records. A current assignment is unique on `(conversationId, tagId)` and omits `effectiveTo`; historical ended assignments may repeat that pair.
- An active `EmojiReaction`, identified by omission of `removedAt`, is unique on `(messageId, identityId, emojiId)`. Removing and later re-adding the same reaction creates or reactivates history without producing two simultaneous identical reactions.
- `ModerationTicket.ticketNumber` is globally unique. `ModerationTicket.discussionConversationId` is also globally unique so one confidential discussion cannot serve unrelated tickets.
- Multiple `ModerationTicket` records, including multiple tickets whose status is not `closed`, may reference the same `ModerationTicket.messageId`. Each ticket remains a distinct report and has its own globally unique `ModerationTicket.discussionConversationId`.
- `ModerationTicket.discussionConversationId` must reference a conversation different from `ModerationTicket.conversationId`. The referenced conversation must have `purpose: moderationDiscussion`, `accessMode: ticketReviewers`, and `visibility: unlisted`; it is excluded from search and tag-based joining. Only identities with a current owner or administrator role in the source ticket's conversation may enter the discussion or read `ModerationTicket.reportedById`; reporters cannot use one report to discover the identities behind other reports.
- `ModerationTicket.status: closed` is terminal. Application and data-access logic must reject every attempt to change the status, disposition, or lifecycle timestamps of a closed ticket.
- Closing a ticket with `ModerationTicket.disposition: removeMessage` requires an append-only `ModerationAction` with the same `ticketId`, `actionType: deleteMessage`, and `targetMessageId` equal to `ModerationTicket.messageId`. A `keepMessage` disposition records the per-ticket decision and does not by itself restore the message while another ticket remains unresolved.
- For a message that has not been deleted, `Message.status` must be `hiddenPendingReview` while any `ModerationTicket` for `Message.id` has a status other than `closed`. If the message belongs to a thread, `MessageThread.status` must be `paused` under the same aggregate condition. After the last ticket closes, a message with no `removeMessage` disposition becomes `visible` and its thread becomes `active`, with `MessageThread.resumedAt` updated. Any accepted `removeMessage` disposition leaves `Message.status` as `deleted`. Thread pause and resume transitions must also create append-only `AuditEvent` records so earlier transitions remain available after `pausedAt` or `resumedAt` is updated.
- A `ModerationAction` with `actionType: warnIdentity` must reference a ticket through `ticketId`, must include `rationale`, and may target only `ModerationTicket.reportedById` or the `Message.authorIdentityId` of the ticket's reported message. `ModerationAction.actorIdentityId` must be an identity with a current owner or administrator role in `ModerationTicket.conversationId`.
- When `Emoji.type` is `custom` and `Emoji.scope` is `conversation`, `Emoji.ownerIdentityId` must have an active `Membership` in `Emoji.conversationId`, and that membership's current `MembershipRolePeriod.role` must be `owner` or `administrator` when the emoji is created.
- Date-time ordering is enforced by the framework-neutral API/data package. `effectiveTo` must be later than `effectiveFrom`; `PostingSuspension.endsAt` must be later than `startsAt`; `PostingSuspension.liftedAt`, when present, must fall between those values; and every `updatedAt` must be at or after its record's `createdAt`.
