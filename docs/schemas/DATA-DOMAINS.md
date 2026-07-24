# Data Domains

## Purpose

This guide assigns every Tawk schema object to one authoritative logical domain, even when other domains consume it. It preserves the ownership, authorization, sensitivity, freshness, workload, consistency, and extension evidence needed to place future objects safely.

## How To Use This Guide

Domains are architecture and governance boundaries, not physical stores or deployment units. **Provisional** marks the best-supported choice where evidence is incomplete; **Open** marks a decision the sources do not resolve.

## Identity and Authentication

### Purpose

Own the stable identities of people and bots and the credentials through which bots authenticate. Conversation-specific authority belongs to Participation Governance rather than this domain.

### Domain Profile

**Primary workflows and access patterns**

- Resolve an identified actor and visible profile.
- Authenticate a bot by credential and identity status.
- Find credentials for one bot identity and support credential rotation or revocation.

**Actors and access**

- Identified people and bots read visible profile data where conversation activity is shown.
- Identity administration and the selected human authentication mechanism govern identity writes; bot credential issuance and revocation require trusted access.

**Tenant and authorization boundary**

Tawk has no organization-level tenant in the sources. Identity is application-wide, while conversation access must be derived through Membership and must never be inferred from an authentication-provider subject or credential identifier.

**Security posture**

Identity profiles contain public-facing display data and potentially sensitive personal or provider identifiers. Bot Credential contains secret-derived credential material; a digest or prefix is not ordinary harmless configuration.

**Workload and cache posture**

Visible profile lookup is frequently consumed by conversation views, but current identity status is required for authentication and access decisions. Credential and status checks require fresh reads unless a future coherence rule is established.

**Consistency boundary**

A Bot Credential must reference a bot Identity. Authentication succeeds only when both credential and identity status permit it and any credential expiration has not passed.

**Belongs here when**

An object defines an application-wide actor, profile, authentication credential, or authentication lifecycle controlled independently of any conversation.

**Does not belong here when**

An object grants conversation-specific participation, role, moderation authority, or content access; those rights belong to the conversation-scoped domains.

**Open decisions**

- **Open:** The human authentication mechanism and its write authority are not selected.
- **Open:** Whether Identity stores a separate proper name remains unresolved.

### Objects

#### Identity

**Schema file**

`identity.yaml`

**Why it belongs here**

It is the stable application-wide actor record for every person or bot.

**Record role**

Authoritative mutable record for actor type, visible profile, and current identity status.

**Ownership path**

Direct application-wide owner key `id`; conversation authorization is derived separately through Membership.

**Authoritative writers and readers**

The identity/profile workflow writes it. Authentication, conversation participation, content attribution, governance, and moderation read it, with display fields visible wherever attributable activity is permitted.

**Sensitivity**

Mixed public and sensitive personal/provider data: `displayName` is public within permitted product surfaces, while `properName` and `humanAuthSubject` require restricted handling.

**Freshness and cache posture**

Fresh read required for authentication and access because `status: disabled` prevents use; display-only copies may be reused only with appropriate coherence and access controls.

**Consistency and lineage**

Retained content and audit records continue to reference the stable identity after participation ends. Bot Credentials may reference only identities whose `type` is `bot`.

#### Bot Credential

**Schema file**

`bot-credential.yaml`

**Why it belongs here**

It authenticates one bot identity and has an authentication-specific issuance, expiration, rotation, and revocation lifecycle.

**Record role**

Authoritative mutable record for a bot authentication credential; the plaintext token is not retained.

**Ownership path**

Derived through `identityId` to an Identity with `type: bot`.

**Authoritative writers and readers**

Trusted credential-management processes issue, update, and revoke it. Authentication reads it; ordinary conversation participants and product views do not.

**Sensitivity**

Secret or credential material, including `tokenDigest`, plus credential-identifying and usage metadata.

**Freshness and cache posture**

Fresh read required for authentication because credential status, revocation, expiration, and the referenced Identity status determine acceptance.

**Consistency and lineage**

An active credential cannot have `revokedAt`; a revoked credential requires it. Authentication must also confirm that the referenced bot Identity is active.

## Conversation Definition and Discovery

### Purpose

Own conversation identity, lifecycle, visibility, tag matching, and the reusable vocabulary used to discover or enter conversations. It governs what a conversation is, not who currently has permission within it.

### Domain Profile

**Primary workflows and access patterns**

- Create or archive a conversation and retrieve its current settings.
- Maintain one to ten ordered active tag assignments.
- Search listed conversations by eligible tags and evaluate a complete tag set for unlisted joining without disclosing hidden identities.
- Suggest tags only when active listed-conversation usage makes them eligible.

**Actors and access**

- Identified people or bots create conversations and become first owners.
- Current owners and administrators manage tags; only owners archive.
- Identified users may read listed discovery data, while unlisted conversation identity and private-only tags remain restricted until join conditions and authorization checks pass.

**Tenant and authorization boundary**

The conversation is the tenant-like boundary for its private data, but tags are application-wide shared values and do not confer authorization. Unlisted tag knowledge is a join condition, not a substitute for checking bans and Membership state.

**Security posture**

Listed discovery metadata is eligible for identified-user discovery. Unlisted conversation identity, tag combinations, moderation-discussion linkage, and descriptive metadata are tenant-private and may expose sensitive operational context.

**Workload and cache posture**

Discovery uses tag-oriented matching and conversation settings; current visibility, archive state, active assignments, and ban state must be coherent before identifying or joining a conversation. Private tag knowledge must not leak through autocomplete or shared caches.

**Consistency boundary**

Conversation creation must establish the Conversation, first-owner Membership and role period, and initial tags together. Active Conversation Tags must remain unique, ordered, and between one and ten; archive and moderation-discussion invariants must remain consistent.

**Belongs here when**

An object defines conversation identity, lifecycle, discoverability, matching behavior, or a vocabulary and assignment used to identify and find conversations.

**Does not belong here when**

An object expresses participant authorization, authored content, authentication, or moderation-case workflow, even when it references a conversation.

**Open decisions**

- **Open:** Listed search handling of extra tags and exact unlisted matching behavior are unresolved.
- **Open:** Tag display casing and some grammar details remain unresolved.
- **Open:** Archived-conversation discovery and participant visibility are unresolved.
- **Open:** The effect of changing an unlisted conversation's tags on existing or joining users is unresolved.
- **Open:** Conversation title and description requirements are unresolved.

### Objects

#### Conversation

**Schema file**

`conversation.yaml`

**Why it belongs here**

It is the aggregate root for a messaging space's purpose, discovery behavior, and active or archived lifecycle.

**Record role**

Authoritative mutable record for conversation identity, settings, purpose, and lifecycle.

**Ownership path**

Direct conversation owner key `id`; governance authority derives through active owner or administrator Membership, with archival restricted to owners.

**Authoritative writers and readers**

Identified creators establish it; permitted owners and administrators change settings, and owners archive it. Discovery, participation, governance, content, and moderation workflows read it subject to visibility and membership rules.

**Sensitivity**

Listed conversation discovery fields may be discoverable to identified users. Unlisted identities, tag relationships, descriptions, and moderation-discussion links are tenant-private and may be sensitive.

**Freshness and cache posture**

Current projection: display copies require coherence with visibility, matching, purpose, and archive changes. Fresh read is required before discovery disclosure, joining, governance, or writes.

**Consistency and lineage**

A moderation discussion must be unlisted, use all-tag matching, and link to a Moderation Ticket; a standard conversation cannot carry that link. Archive state and actor/time metadata move together, and archival may substitute for preserving a final active owner.

#### Tag

**Schema file**

`tag.yaml`

**Why it belongs here**

It is the shared controlled vocabulary used to identify, discover, and join conversations.

**Record role**

Reference or controlled configuration with an authoritative normalized value.

**Ownership path**

Application-wide key `id`; tags are explicitly not owned by an identity or conversation.

**Authoritative writers and readers**

Conversation creation and tag-management workflows create or reuse values. Identified discovery and conversation views read tags only under eligibility and visibility rules.

**Sensitivity**

A tag value is not inherently public. Tags known only from unlisted conversations are sensitive discovery information and must not be suggested.

**Freshness and cache posture**

Current authoritative reference: presentation or matching copies require coherence with value changes. Tag-suggestion eligibility is a separate derived result that must remain coherent with active listed Conversation Tag assignments and must preserve unlisted confidentiality.

**Consistency and lineage**

`normalizedValue` is the canonical comparison value; `displayValue` is optional and subordinate. Autocomplete eligibility is derived from current active listed Conversation Tag assignments.

#### Conversation Tag

**Schema file**

`conversation-tag.yaml`

**Why it belongs here**

It authoritatively records a tag's ordered assignment to a conversation and preserves assignment history.

**Record role**

Authoritative mutable association period with retained add and removal provenance.

**Ownership path**

Directly conversation-owned through `conversationId`; `tagId` references the application-wide Tag.

**Authoritative writers and readers**

Current owners and administrators add or remove assignments. Discovery, joining, conversation presentation, governance, and moderation context consume active assignments subject to conversation visibility.

**Sensitivity**

Inherits the conversation's discovery boundary; an assignment on an unlisted conversation can reveal private tag and conversation linkage.

**Freshness and cache posture**

Fresh read required for join, discovery disclosure, and tag-management validation. Presentation copies require coherence with additions, removals, ordering, visibility, and archive changes.

**Consistency and lineage**

Active assignments must be unique by conversation/tag and conversation/position, ordered from one through ten, and never fall below one. Removal time and actor appear together.

## Participation Governance

### Purpose

Own the current and historical relationship between an identity and a conversation, including role authority and temporary posting restrictions. These records are the source of conversation-scoped authorization.

### Domain Profile

**Primary workflows and access patterns**

- Check current membership, role, ban state, and posting eligibility before access or mutation.
- List active members and, for authorized governors, retained former members.
- Change roles, leave, remove, ban, unban, or rejoin while preserving history.
- Inspect role periods and membership events for authorization history and audit explanation.

**Actors and access**

- Participants manage permitted self-actions.
- Owners govern all roles and preserve ownership continuity; administrators govern non-owner participants.
- Owners and administrators read former-member history, while ordinary members cannot.

**Tenant and authorization boundary**

Every object is conversation-scoped through `conversationId` directly or through a Membership. Authorization requires current Membership state and permitted role; copied identity or conversation identifiers do not independently prove access.

**Security posture**

Tenant-private governance data includes participation status, role history, bans, restriction reasons, actors, and ticket links. It can reveal disciplinary and historical information not available to ordinary members.

**Workload and cache posture**

Current membership, role, ban, and posting-restriction decisions require fresh reads. Historical periods and events are stable after closure or creation but remain private and authorization-scoped.

**Consistency boundary**

Membership current state, non-overlapping role periods, explanatory events, and moderation outcomes must agree. Changes must preserve at least one active owner unless the conversation is archived.

**Belongs here when**

An object determines or explains conversation-scoped participation, role authority, membership lifecycle, or the ability to post.

**Does not belong here when**

An object merely authenticates an actor, defines a conversation, contains participant-authored content, or records the moderation case and decision evidence that prompted a governance change.

**Open decisions**

- **Open:** Rejoining behavior and whether an existing Membership receives a new participation period are unresolved.
- **Open:** Posting-prevention states beyond bans and time-limited suspensions are unresolved.
- **Open:** The sources do not settle whether every moderation action is available equally to owners and administrators.

### Objects

#### Membership

**Schema file**

`membership.yaml`

**Why it belongs here**

It is the authoritative current relationship used to decide an identity's participation and role in one conversation.

**Record role**

Authoritative mutable record of current conversation participation and role.

**Ownership path**

Directly conversation-owned through `conversationId`, for the participant identified by `identityId`.

**Authoritative writers and readers**

Join and self-leave workflows, owners, and role-permitted administrators write it. All private conversation workflows read current state; only owners and administrators may inspect former-member records.

**Sensitivity**

Tenant-private access-control and disciplinary data, including role, leave, removal, and ban state.

**Freshness and cache posture**

Fresh read required for authorization, joining, viewing, governance, posting, moderation, and mutation decisions.

**Consistency and lineage**

Active and banned states require a current role, with `none` reserved for bans; left and removed states have no current role. Role Periods and Membership Events preserve the history behind current state.

#### Membership Role Period

**Schema file**

`membership-role-period.yaml`

**Why it belongs here**

It preserves the time-bounded role assignments that establish historical conversation authority.

**Record role**

Immutable snapshot after a period closes; the current open period is mutable only to end it.

**Ownership path**

Derived through `membershipId` to a Membership; copied `conversationId` and `identityId` must match that Membership.

**Authoritative writers and readers**

Join and permitted role-governance workflows create and end periods. Governance, historical authorization checks, message-deletion validation, and audit investigation read them.

**Sensitivity**

Tenant-private authorization history with actor attribution.

**Freshness and cache posture**

Fresh read required when proving authority at a current or historical decision time. A closed period is immutable by identifier but remains authorization-scoped.

**Consistency and lineage**

Periods for one Membership cannot overlap, and only one may be open. A role change ends the current period and creates its successor together; copied owner fields must agree with Membership.

#### Membership Event

**Schema file**

`membership-event.yaml`

**Why it belongs here**

It is the explanatory history for joins, role changes, departures, removals, bans, and restorations.

**Record role**

Append-only audit evidence for membership transitions.

**Ownership path**

Derived through `membershipId` to a conversation-owned Membership; `conversationId` and `identityId` identify the same governed relationship.

**Authoritative writers and readers**

Participation and governance workflows append events when transitions occur. Authorized governors and audit investigations read them; ticket review may consume ticket-linked lineage.

**Sensitivity**

Tenant-private audit evidence that may include disciplinary reasons, actor identities, role history, and moderation-ticket linkage.

**Freshness and cache posture**

Immutable by identifier after creation, but copies must preserve tenant authorization and sensitivity.

**Consistency and lineage**

Transition type and role fields must describe the same state change as Membership and Membership Role Period. Ticket-linked events preserve the moderation cause when applicable.

#### Posting Suspension

**Schema file**

`posting-suspension.yaml`

**Why it belongs here**

It authoritatively changes one Membership's posting permission for a bounded period without ending participation.

**Record role**

Authoritative mutable restriction record, terminally stable after expiration or early lift.

**Ownership path**

Derived through `membershipId` to a Membership; copied `conversationId` and `identityId` must match it.

**Authoritative writers and readers**

Authorized owners or administrators impose or lift restrictions. Message-posting authorization reads them; moderation reads them through ticket and action lineage.

**Sensitivity**

Tenant-private disciplinary data, including target identity, moderator, reason, interval, and optional ticket linkage.

**Freshness and cache posture**

Fresh read required for posting permission and lift decisions; potentially stale copies must not authorize a post.

**Consistency and lineage**

The end must follow the start, and lift time and actor appear together. Related Moderation Actions must identify this exact restriction and agree on conversation and target identity.

## Conversation Content

### Purpose

Own participant-authored messages, reactions, and contextual notes attached to conversation work. Content remains attributable and retained even when participation or visibility changes.

### Domain Profile

**Primary workflows and access patterns**

- Read chronological conversation messages and post as an active participant.
- Soft-delete permitted messages and notes while retaining provenance.
- Add or withdraw reactions on visible messages.
- Retrieve notes by their single conversation, message, or moderation-ticket subject.

**Actors and access**

- Active members, including bots, author messages and reactions under their Identity.
- Authors delete their own permitted content; owners and administrators may delete messages through moderation authority.
- Note readers and writers depend on a visibility model that remains unresolved.

**Tenant and authorization boundary**

Content authorization derives through the containing conversation and current Membership, including when a Note attaches indirectly through Message or Moderation Ticket. An author identity alone does not grant conversation access.

**Security posture**

Message bodies, note bodies, reactions, deletion reasons, authorship, and contextual links are tenant-private. Notes may contain particularly sensitive moderation or personal context.

**Workload and cache posture**

Conversation reads favor chronological content and message-linked reactions. Current visibility and soft-deletion state require coherent reads; content retained after deletion must not leak back into participant views.

**Consistency boundary**

Content must remain in the same conversation as its authorizing membership and referenced subjects. Soft-deletion metadata, reaction references, and single-subject Note attachment rules must remain valid.

**Belongs here when**

An object is participant-authored conversational content, a response to that content, or contextual text attached to conversation work.

**Does not belong here when**

An object defines access, discovery, identity authentication, or the authoritative moderation case and action history.

**Open decisions**

- **Open:** Note audiences and whether visibility may change are unresolved.
- **Open:** The supported emoji set and multiplicity per identity and message are unresolved.

### Objects

#### Message

**Schema file**

`message.yaml`

**Why it belongs here**

It is the authoritative retained communication authored inside a conversation.

**Record role**

Authoritative mutable record whose body and authorship persist while visibility may change through soft deletion.

**Ownership path**

Directly conversation-owned through `conversationId`; posting authority derives from the author's active Membership and posting eligibility.

**Authoritative writers and readers**

Active permitted participants create messages. Authors may soft-delete their own, and owners or administrators may soft-delete under moderation authority. Authorized conversation participants read visible messages.

**Sensitivity**

Tenant-private user-authored content with identity attribution and potentially sensitive deletion rationale.

**Freshness and cache posture**

Current projection for participant views: cached copies require coherence with soft deletion and conversation access. Fresh authorization and posting checks are required before writes.

**Consistency and lineage**

Authorship remains pinned to the original Identity after Membership ends. Deletion requires an authorized author or historical owner/administrator, and ticket-driven deletion is explained by Moderation Action rather than a Message-owned ticket link.

#### Emoji Reaction

**Schema file**

`emoji-reaction.yaml`

**Why it belongs here**

It is a participant-authored response subordinate to one Message.

**Record role**

Authoritative mutable association whose removal is retained.

**Ownership path**

Derived through `messageId` to a Message and its conversation; copied `conversationId` must agree, and `identityId` identifies the reacting participant.

**Authoritative writers and readers**

Active participants who can view the Message add or withdraw reactions. Authorized conversation participants read active reactions.

**Sensitivity**

No override to the domain posture; it exposes participant identity and expressive activity within a private conversation.

**Freshness and cache posture**

Current projection: display copies require coherence with removal, Message visibility, and current conversation authorization.

**Consistency and lineage**

The referenced Message must belong to the copied conversation, and the reacting Identity must have active Membership at creation. Reaction uniqueness remains open.

#### Note

**Schema file**

`note.yaml`

**Why it belongs here**

It is authored contextual content with exactly one conversation-work subject, even when that subject is a moderation ticket.

**Record role**

Authoritative mutable content record with retained soft-deletion state.

**Ownership path**

Derived through exactly one of `conversationId`, `messageId`, or `moderationTicketId` to the governing conversation; `authorIdentityId` supplies attribution, not authorization by itself.

**Authoritative writers and readers**

Identified participants author conversation or message notes, and owners or administrators author operational ticket notes. Readers and permitted deletion actors depend on the unresolved visibility model.

**Sensitivity**

Tenant-private content that may contain personal, participant, or moderation information; the absent or provisional visibility value must not be interpreted as broad access.

**Freshness and cache posture**

Open: no safe cache posture can be established until note visibility and mutation rules are settled. Any copy must respect subject-conversation authorization and soft deletion.

**Consistency and lineage**

Exactly one subject link is present. Message- and ticket-linked Notes inherit their subject's conversation boundary and preserve author attribution.

## Moderation Case Management

### Purpose

Own reports of concerning messages and the append-only evidence of moderator decisions. It records why and by whom moderation occurred while consuming authoritative content and governance state.

### Domain Profile

**Primary workflows and access patterns**

- Create and retrieve a globally numbered report for a message.
- List reports only for conversations the reviewer governs.
- Review flagged content, reporter explanation, contextual Notes, and optional confidential discussion.
- Record actions and trace their affected message, participant, Membership Event, or Posting Suspension.

**Actors and access**

- Active participants who may view a message submit reports.
- Current conversation owners and administrators review tickets, write moderation evidence, and take role-permitted actions.
- Ordinary members cannot browse moderation cases or operational history.

**Tenant and authorization boundary**

Each ticket and action is governed by `conversationId`; reviewer access must be proven from current Membership and role. A global ticket number is an identifier, not an authorization boundary.

**Security posture**

Sensitive tenant-private case data includes reported content linkage, reporter identity, allegations, assignment, resolution, moderator rationale, target identities, and confidential discussion linkage.

**Workload and cache posture**

Review uses conversation-scoped case queues and ticket detail. Current ticket state, reviewer authority, target state, and action eligibility require fresh reads; append-only actions are stable but remain private.

**Consistency boundary**

A ticket's Message and reporter eligibility must match its conversation. Actions must agree with their target objects, and resulting Message, Membership, or Posting Suspension changes remain authoritative in their owning domains.

**Belongs here when**

An object represents a report, moderation-case lifecycle, or durable evidence of a moderator decision.

**Does not belong here when**

An object is the authoritative participant restriction, membership state, message state, or linked discussion Conversation changed or consumed by moderation.

**Open decisions**

- **Open:** Ticket statuses, assignment rules, notifications, and closure behavior are unresolved; current status values are provisional.
- **Open:** The division of moderation actions between owners and administrators is unresolved.
- **Open:** Whether a linked moderation-discussion Conversation is required, optional, or deferred is unresolved.

### Objects

#### Moderation Ticket

**Schema file**

`moderation-ticket.yaml`

**Why it belongs here**

It is the authoritative case record created when a participant reports a Message.

**Record role**

Authoritative mutable case record with a provisional current workflow state.

**Ownership path**

Directly conversation-owned through `conversationId`; `messageId` must reference a Message in that conversation, and reporter authorization derives from Membership at `reportedAt`.

**Authoritative writers and readers**

Eligible active participants create tickets. Current owners and administrators for the conversation read and update review fields under the eventual workflow rules.

**Sensitivity**

Sensitive tenant-private report data, including reporter identity, reported-message linkage, allegation text, assignment, and resolution detail.

**Freshness and cache posture**

Fresh read required for case workflow, assignment, resolution, and action eligibility. The globally unique ticket number must not be used to bypass conversation authorization.

**Consistency and lineage**

The Message must belong to the same conversation, and the reporter must have been allowed to view it when reported. The ticket number is globally unique; related Notes, Actions, suspensions, events, and an optional moderation-discussion Conversation preserve case lineage.

#### Moderation Action

**Schema file**

`moderation-action.yaml`

**Why it belongs here**

It is the append-only evidence of a concrete moderator decision, distinct from the authoritative target state it changes.

**Record role**

Append-only audit evidence for moderation actions.

**Ownership path**

Directly conversation-owned through `conversationId`; actor authority derives from an owner or administrator Membership at `occurredAt`.

**Authoritative writers and readers**

Authorized owners or administrators append actions while moderating conduct or a ticket. Authorized case reviewers and audit investigations read them; target domains consume the lineage.

**Sensitivity**

Sensitive tenant-private audit evidence containing moderator, target, reason, ticket, message, and restriction links.

**Freshness and cache posture**

Immutable by identifier after creation, but copies remain tenant-authorized and sensitive. Current target state must be read from the target's authoritative domain.

**Consistency and lineage**

Action type determines required target links. Suspension actions must reference the exact Posting Suspension and agree on conversation and target Identity; message deletion, Membership changes, and restriction state remain authoritative outside this domain.

## Shared Object Relationships

### Identity

**Authoritative domain**

Identity and Authentication

**Consuming domains**

- Conversation Definition and Discovery
- Participation Governance
- Conversation Content
- Moderation Case Management

**Dependency type**

Current-state read and audit lineage.

**Logical use**

Consumers attribute creators, participants, authors, reporters, moderators, and historical actors to stable identified people or bots.

**Freshness or consistency implication**

Current status must be fresh for authentication and access, while historical attribution remains pinned to the stable identity.

### Conversation

**Authoritative domain**

Conversation Definition and Discovery

**Consuming domains**

- Participation Governance
- Conversation Content
- Moderation Case Management

**Dependency type**

Current-state read and authorization context.

**Logical use**

Consumers scope membership, content, tickets, and actions to one conversation and honor its lifecycle and privacy.

**Freshness or consistency implication**

Fresh visibility and archive state are required before disclosure or mutation; an unlisted conversation remains private even when referenced elsewhere.

### Tag

**Authoritative domain**

Conversation Definition and Discovery

**Consuming domains**

- Participation Governance
- Conversation Content
- Moderation Case Management

**Dependency type**

Current-state read and contextual presentation.

**Logical use**

Governance, conversation, and moderation surfaces show conversation context using the conversation's active tags.

**Freshness or consistency implication**

Consumers must not expose private-only tags and must use active Conversation Tag assignments.

### Membership

**Authoritative domain**

Participation Governance

**Consuming domains**

- Conversation Definition and Discovery
- Conversation Content
- Moderation Case Management

**Dependency type**

Current-state read.

**Logical use**

Consumers decide whether an identity may join, view, post, react, govern, or moderate a conversation.

**Freshness or consistency implication**

Authorization and ban decisions require fresh current status and role; stale copies cannot grant access.

### Membership Role Period

**Authoritative domain**

Participation Governance

**Consuming domains**

- Conversation Content
- Moderation Case Management

**Dependency type**

Pinned historical reference and audit lineage.

**Logical use**

Consumers prove whether an actor had owner or administrator authority when a historical deletion or moderation action occurred.

**Freshness or consistency implication**

Closed periods are stable, but authorization must use the period effective at the action time and preserve tenant privacy.

### Membership Event

**Authoritative domain**

Participation Governance

**Consuming domains**

- Moderation Case Management

**Dependency type**

Audit lineage.

**Logical use**

Ticket review and investigation use events to explain membership transitions caused by moderation.

**Freshness or consistency implication**

Events must agree with the Membership and role-period transition they explain.

### Posting Suspension

**Authoritative domain**

Participation Governance

**Consuming domains**

- Conversation Content
- Moderation Case Management

**Dependency type**

Current-state read and audit lineage.

**Logical use**

Message posting checks enforce the restriction, while moderation records why it was imposed or lifted.

**Freshness or consistency implication**

Posting decisions require fresh interval and lift state; Moderation Action links must identify the same target and conversation.

### Message

**Authoritative domain**

Conversation Content

**Consuming domains**

- Moderation Case Management

**Dependency type**

Current-state read and pinned report evidence.

**Logical use**

Tickets identify the reported Message, and moderation actions may change its visibility through soft deletion.

**Freshness or consistency implication**

The ticket preserves the reported Message identity, while current participant views must honor its latest deletion state.

### Note

**Authoritative domain**

Conversation Content

**Consuming domains**

- Moderation Case Management

**Dependency type**

Current-state read.

**Logical use**

Authorized reviewers use ticket-attached Notes as contextual case material.

**Freshness or consistency implication**

Access must remain restricted until the visibility model is settled, and soft-deleted Notes must not reappear through stale copies.

### Moderation Ticket

**Authoritative domain**

Moderation Case Management

**Consuming domains**

- Conversation Definition and Discovery
- Participation Governance
- Conversation Content

**Dependency type**

Current-state read and audit lineage.

**Logical use**

A moderation-discussion Conversation, membership changes, Posting Suspensions, and Notes link their historical reason to the originating case.

**Freshness or consistency implication**

The stable ticket link preserves provenance but does not make the mutable ticket record immutable or grant access; every consumer must enforce the governing conversation boundary.

### Moderation Action

**Authoritative domain**

Moderation Case Management

**Consuming domains**

- Participation Governance
- Conversation Content

**Dependency type**

Audit lineage.

**Logical use**

Target domains use actions to explain message deletion, participant state changes, and posting restrictions without treating the action as their current-state authority.

**Freshness or consistency implication**

Consumers must read current state from Message, Membership, or Posting Suspension and keep action target links consistent with the recorded conversation.
