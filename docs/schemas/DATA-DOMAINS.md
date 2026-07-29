# Data Domains

## Purpose

This guide maps Tawk's durable schema objects to logical ownership and governance boundaries. Every object has exactly one authoritative domain even when other domains consume it.

## How To Use This Guide

Domains describe ownership, authorization, lifecycle, and consistency boundaries; they do not prescribe physical stores or deployment units. **Provisional** marks the best-supported choice where evidence is incomplete, while **Open** marks a material decision the sources do not resolve.

## Identity

### Purpose

Own identified people and bots, their visible profiles, and the credentials that let bots authenticate.

### Justification

Identity is a separate boundary because actor identity and authentication are global to the application rather than owned by any conversation, and credential revocation and identity disablement must be governed before conversation-scoped authorization is evaluated.

### Domain Profile

**Primary workflows and access patterns**

- Resolve a person or bot by stable identity for attribution and profile display.
- Authenticate a bot by credential and inspect or revoke that bot's credentials.
- Check whether an identity is active before allowing application access.

**Actors and access**

- The selected human-authentication flow creates or updates person identities; the bot-credential issuance actor is not defined.
- Authorized conversation surfaces read participant-visible profile fields only in contexts their viewers may access, while authentication components read and write credential state and identity access state.

**Tenant and authorization boundary**

Identity is application-wide; conversation authority is derived through Membership rather than from an identity or credential identifier alone.

**Security posture**

Profiles include participant-visible display identity plus potentially sensitive proper names and external authentication subjects. Bot Credential contains secret-derived credential material even though plaintext tokens are not retained.

**Workload and cache posture**

Profile display may use coherent copies, but identity status and credential validity require fresh reads for authentication and access decisions.

**Consistency boundary**

A Bot Credential must reference a bot Identity. Authentication requires both an active credential and active Identity, plus a non-expired credential when an expiry is present.

**Belongs here when**

An object defines an application-wide actor, profile, authentication credential, or actor access lifecycle independent of conversation membership.

**Does not belong here when**

The object's authority is scoped to a conversation role, participation state, message, tag, or moderation case.

**Open decisions**

- **Open:** The human authentication mechanism and its authority over `humanAuthSubject` are not selected.
- **Open:** Bot token issuance and administration actors are not defined.
- **Open:** Whether profiles retain both proper and display names remains unresolved.

### Objects

#### Identity

**Schema file**

`identity.yaml`

**Why it belongs here**

It is the stable application-wide actor record used by every conversation-scoped capability.

**Record role**

Authoritative mutable record for actor type, visible profile, and application access status.

**Ownership path**

Directly owned by `Identity.id`; no conversation or provider identifier establishes its authority.

**Authoritative writers and readers**

The unresolved human-authentication/profile process and bot provisioning process write it; authorized product surfaces read it for attributable activity, and authorization checks read its access state.

**Sensitivity**

Participant-visible display name with potentially sensitive proper name and external human-authentication subject.

**Freshness and cache posture**

Fresh read required for access status; profile copies are safe only with coherence and the correct audience.

**Consistency and lineage**

Disabled identities remain stable attribution targets for retained messages and audit history. Bot credentials may authenticate only identities whose `type` is `bot`.

#### Bot Credential

**Schema file**

`bot-credential.yaml`

**Why it belongs here**

It governs authentication of one bot Identity independently of that bot's conversation memberships.

**Record role**

Authoritative mutable record for credential validity, revocation, expiry, and use metadata.

**Ownership path**

`identityId` points to the bot Identity that owns the credential.

**Authoritative writers and readers**

The unresolved bot credential-management process issues, rotates, and revokes it; authentication components read it and may update `lastUsedAt`.

**Sensitivity**

Secret or credential material: the digest and identifying prefix remain sensitive even though the plaintext token is never stored.

**Freshness and cache posture**

Fresh read required for every authentication decision because revocation, expiry, and Identity disablement must take effect.

**Consistency and lineage**

An active credential cannot carry `revokedAt`; a revoked credential requires it. Authentication also depends on the referenced Identity remaining an active bot.

## Discovery

### Purpose

Own conversation identity and lifecycle, the shared tag vocabulary, and effective tag assignments used to create, discover, and enter conversations.

### Justification

Discovery is a separate boundary because it governs application-wide tag meaning and privacy-sensitive listed versus unlisted lookup behavior, while conversation-scoped participation and content have different writers, authorization rules, and retained lifecycles.

### Domain Profile

**Primary workflows and access patterns**

- Create a listed or unlisted conversation with one to ten ordered tags.
- Suggest only tags eligible through active listed-conversation assignments.
- Match identifiable listed conversations or count hidden unlisted matches without disclosing their identity.
- Maintain tags and archive a conversation under conversation-role authority.

**Actors and access**

- Identified people and bots create conversations and tags.
- Conversation owners and administrators maintain tag assignments; only owners archive conversations.
- Identified users read listed discovery data. Standard unlisted identifiers and private-only tags remain protected until their join rules are satisfied; confidential moderation-discussion data remains limited to authorized participants and cannot be exposed by tag knowledge alone.

**Tenant and authorization boundary**

Conversation is the owner boundary for lifecycle and tag assignments. Tags are globally reusable and unowned, so `Tag.id` never grants access to a conversation; in particular, knowing the tags of a confidential moderation discussion is not sufficient authorization to join it.

**Security posture**

Listed discovery attributes are visible to identified users. Unlisted conversation identity, private tag combinations, optional title and description, and moderator-discussion links are tenant-private and may be moderation-sensitive.

**Workload and cache posture**

Search and autocomplete may use coherent derived results, but join eligibility, unlisted privacy, active tag count, and archival decisions require current authoritative state.

**Consistency boundary**

Conversation creation changes Conversation, the first-owner Membership and Membership Role Period, and initial Conversation Tags together. Active assignments must preserve one to ten tags, and autocomplete eligibility is derived from active listed assignments.

**Belongs here when**

An object defines conversation identity or lifecycle, canonical tag meaning, effective conversation-tag assignment, or privacy-sensitive discovery behavior.

**Does not belong here when**

The object governs who participates, authored conversation content, actor authentication, or report-driven moderation.

**Open decisions**

- **Open:** Extra-tag matching and multiple hidden-match behavior are not fully defined and affect safe unlisted lookup.
- **Open:** Archived-conversation search and participant visibility are unresolved.
- **Open:** Tag display casing and some tag grammar details remain unresolved.
- **Open:** The effect of changing an unlisted conversation's tags on in-progress joins or saved access is not defined.
- **Open:** Conversation title and description requirements remain unresolved.
- **Open:** Authority and behavior for changing visibility or matching mode after creation are not established; any future rule must preserve listed and unlisted privacy guarantees.
- **Open:** The eligibility rule for joining a confidential moderation-discussion Conversation is not defined; its unlisted `allTags` configuration hides discovery data but must not be treated as sufficient authorization.

### Objects

#### Conversation

**Schema file**

`conversation.yaml`

**Why it belongs here**

It is the authoritative record for a conversation's discoverability, matching behavior, purpose, and archival lifecycle.

**Record role**

Authoritative mutable record for conversation discovery and lifecycle state.

**Ownership path**

Directly owned by `Conversation.id`; governance authority is derived through an active Membership and allowed role in that conversation.

**Authoritative writers and readers**

Identified creators establish it; owners and administrators govern its tag assignments, while only owners archive it. Authority to change other Conversation settings after creation is not established. Discovery, participation, content, and moderation workflows read it.

**Sensitivity**

Listed records expose discovery identity to identified users; unlisted and moderation-discussion records are tenant-private and can reveal confidential tag combinations or ticket linkage.

**Freshness and cache posture**

Fresh read required for joining, archival, and correctness decisions; discovery copies require coherence with visibility, matching mode, status, purpose, and active tag changes. A moderation-discussion join must also enforce its still-open confidential eligibility rule rather than rely on tag knowledge alone.

**Consistency and lineage**

Unlisted conversations use `allTags`; moderation discussions are unlisted, use `allTags`, and pin a Moderation Ticket. Archival requires actor and time, and ownership continuity must be enforced with Participation state.

#### Tag

**Schema file**

`tag.yaml`

**Why it belongs here**

It defines the shared canonical vocabulary used by conversation discovery and joining.

**Record role**

Reference or controlled configuration for a globally reusable normalized tag.

**Ownership path**

Directly owned by `Tag.id`; it has no identity or conversation owner.

**Authoritative writers and readers**

Identified conversation creators or tag managers can introduce reusable values; discovery and conversation configuration read them.

**Sensitivity**

The value is not automatically public: a tag known only through unlisted assignments must not be exposed through autocomplete.

**Freshness and cache posture**

Current-state reference; normalized values may be reused, but discovery eligibility must be recalculated from current Conversation and Conversation Tag state.

**Consistency and lineage**

`normalizedValue` is the canonical case-insensitive meaning. Whether `displayValue` preserves creator casing remains open.

#### Conversation Tag

**Schema file**

`conversation-tag.yaml`

**Why it belongs here**

It is the retained authoritative assignment connecting the shared tag vocabulary to one conversation.

**Record role**

Authoritative mutable record for an effective, ordered tag assignment that becomes stable after removal.

**Ownership path**

`conversationId` is the direct owner; `tagId` references the shared Tag and does not confer conversation access.

**Authoritative writers and readers**

Conversation owners and administrators add and remove assignments; discovery, joining, and conversation settings read active assignments.

**Sensitivity**

Assignments on an unlisted conversation are tenant-private even when the same Tag appears in listed conversations.

**Freshness and cache posture**

Fresh read required for join matching, privacy-safe suggestions, and the one-to-ten invariant; derived discovery results require coherence.

**Consistency and lineage**

Active assignments require unique tag and position within the conversation, must number one to ten, and cannot remove the final active tag. Removal time and actor appear together.

## Participation

### Purpose

Own the current and historical relationship between an identity and a conversation, including role authority, joining, leaving, removal, banning, and restoration.

### Justification

Participation is a separate boundary because Membership is the conversation tenant and authorization boundary for ordinary use and governance, and its current state must remain consistent with temporal role history and append-only change evidence independently of actor identity, conversation discovery, or authored content.

### Domain Profile

**Primary workflows and access patterns**

- Check current membership and role for viewing, joining, posting, governance, and moderation.
- List active participants and, for authorized moderators, retained former participants.
- Join, rejoin, leave, remove, ban, unban, and change roles while preserving history.
- Inspect role periods and explanatory events for historical authorization or audit.

**Actors and access**

- Identified actors create their eligible membership by joining.
- Owners and administrators manage participants within role limits; only owners alter owner roles.
- Active participants read the permitted roster, while owners and administrators may inspect former membership history.

**Tenant and authorization boundary**

`Membership.conversationId` establishes the conversation scope; authorization requires current active status and an allowed current role, not merely an identity, external identifier, or historical role.

**Security posture**

Membership and role state are tenant-private. Former participation, bans, reasons, actor identities, and ticket links are privileged governance or audit data.

**Workload and cache posture**

Current Membership is a fresh-read authorization record. Closed role periods and append-only events may be reused by identifier within conversation-authorized audit contexts.

**Consistency boundary**

Membership current state, non-overlapping role periods, and explanatory events must describe the same transition. A conversation must retain an active owner unless it is archived in the same change.

**Belongs here when**

An object defines current or historical conversation participation, role authority, or an explanatory participation transition.

**Does not belong here when**

The object defines global actor authentication, conversation discovery, authored content, or a conduct restriction and audit trail imposed through moderation.

**Open decisions**

- **Open:** Rejoin behavior and how new participation periods are represented on the retained Membership are not finalized.
- **Open:** Whether posting can be denied for reasons other than bans and Posting Suspensions is unresolved.

### Objects

#### Membership

**Schema file**

`membership.yaml`

**Why it belongs here**

It is the current authoritative relationship used to decide whether one identity may participate in one conversation.

**Record role**

Authoritative mutable record for current conversation participation and role.

**Ownership path**

`conversationId` is the tenant owner and `identityId` identifies the participant; authorization is derived from both plus `currentStatus` and `currentRole`.

**Authoritative writers and readers**

Eligible identities create or reactivate their membership; owners and administrators change non-owner participation, and owners govern owner roles. All conversation-scoped capabilities read it for authorization.

**Sensitivity**

Tenant-private access and role state; former, removed, and banned states have restricted visibility.

**Freshness and cache posture**

Fresh read required for viewing, joining, posting, role management, moderation authority, and ban enforcement.

**Consistency and lineage**

Current state must agree with the open Membership Role Period and the latest Membership Event. Ending the last active owner is forbidden unless the Conversation is archived in the same change.

#### Membership Role Period

**Schema file**

`membership-role-period.yaml`

**Why it belongs here**

It preserves the time-bounded authority history of one Membership.

**Record role**

Authoritative mutable record while open; terminally stable after the role period ends.

**Ownership path**

`membershipId` is the direct owner, and its copied `conversationId` and `identityId` must match that Membership.

**Authoritative writers and readers**

The participation transition workflow opens and closes periods under owner or administrator authority; governance and audit workflows read them.

**Sensitivity**

Tenant-private historical authorization, including bans represented by role `none` and the assigning or ending actors.

**Freshness and cache posture**

Terminally stable after `effectiveTo`; the current open period requires fresh reads and must not substitute for current Membership authorization.

**Consistency and lineage**

Periods for one Membership cannot overlap, at most one may remain open, and a role change closes the current period and opens its successor together.

#### Membership Event

**Schema file**

`membership-event.yaml`

**Why it belongs here**

It explains the cause, actor, and optional moderation lineage for each participation transition.

**Record role**

Append-only audit evidence for membership and role changes.

**Ownership path**

`membershipId` is the direct owner; copied conversation and identity fields derive from that Membership.

**Authoritative writers and readers**

The participation transition workflow appends it; authorized owners, administrators, and audit processes read it.

**Sensitivity**

Privileged tenant audit data including reasons, actor identity, role changes, bans, and optional ticket linkage.

**Freshness and cache posture**

Immutable by identifier after creation, but reuse remains limited to authorized tenant and audit contexts.

**Consistency and lineage**

Event role values must describe the transition type, and `moderationTicketId` preserves lineage when moderation prompted the change.

## Content

### Purpose

Own participant-authored messages, retained emoji responses, and contextual notes attached to conversation work.

### Justification

Content is a separate boundary because participants author and interact with retained expressive content under conversation access, while its visibility, soft deletion, attribution, and potentially personal or moderator-only audiences differ from discovery configuration, participation authority, and case-governed moderation evidence.

### Domain Profile

**Primary workflows and access patterns**

- Read chronological visible messages and post within an active conversation.
- Soft-delete a message under author or moderator authority.
- Add or withdraw emoji reactions on visible messages.
- Attach, read, and soft-delete contextual notes according to their eventual audience.

**Actors and access**

- Active people and bots author messages and reactions and may add notes.
- Authors delete their own permitted content; owners and administrators may delete messages and may use privileged notes.
- Readers require conversation access plus any object-specific visibility rule.

**Tenant and authorization boundary**

Conversation and current Membership determine ordinary content access. A Note may impose a narrower audience, but that audience model is unresolved.

**Security posture**

Tenant-private user-generated content can contain sensitive personal information. Deleted message bodies remain retained, and ticket notes or restricted notes may contain privileged moderation context.

**Workload and cache posture**

Thread reads and message-context lookups are conversation-scoped. Current deletion, reaction removal, note deletion, and note audience state require coherent or fresh reads before display.

**Consistency boundary**

Message authorship remains attributable after membership ends. Reactions must reference a Message in the same Conversation, and a Note targets exactly one Conversation, Message, or Moderation Ticket.

**Belongs here when**

An object is participant-authored expressive content, a lightweight response to that content, or contextual annotation whose primary lifecycle is content creation and visibility.

**Does not belong here when**

The object establishes participation authority, discovery settings, authentication, or the authoritative workflow and enforcement evidence for a moderation case.

**Open decisions**

- **Open:** Note audiences, access when `visibility` is absent, audience-change authority, and visibility enforcement are not finalized; Note placement here is **Provisional** because ticket notes may ultimately require a stronger moderation ownership boundary.
- **Open:** The supported emoji set and per-identity reaction multiplicity are unresolved.

### Objects

#### Message

**Schema file**

`message.yaml`

**Why it belongs here**

It is the authoritative participant-authored content record for a conversation thread.

**Record role**

Authoritative mutable record with retained body and mutable soft-deletion metadata.

**Ownership path**

`conversationId` is the tenant owner; `authorIdentityId` preserves attribution, while current Membership governs access and posting.

**Authoritative writers and readers**

Active participants create messages; the author or a conversation owner or administrator may soft-delete them. Authorized participants read visible messages, and moderators read reported context.

**Sensitivity**

Tenant-private message content and deletion rationale; soft-deleted content remains sensitive even when omitted from participant views.

**Freshness and cache posture**

Fresh read required before display or moderation action so soft deletion and current conversation access are honored.

**Consistency and lineage**

Deletion actor must be the author or an identity with active owner or administrator authority at deletion time. Ticket-driven deletion lineage is preserved by Moderation Action.

#### Emoji Reaction

**Schema file**

`emoji-reaction.yaml`

**Why it belongs here**

It is a participant-authored retained response whose meaning and display are subordinate to one Message.

**Record role**

Authoritative mutable record for a reaction association and its soft removal.

**Ownership path**

`messageId` is the direct content owner; copied `conversationId` must match the Message, and `identityId` identifies the reacting participant.

**Authoritative writers and readers**

Active participants add and withdraw their reactions; authorized conversation participants read active reactions.

**Sensitivity**

Tenant-private interaction metadata; no override to Message content access.

**Freshness and cache posture**

Current-state read; displayed reaction sets require coherence with `removedAt`, Message visibility, and current conversation access.

**Consistency and lineage**

The referenced Message must belong to the copied Conversation, and the reacting Identity must have active Membership when the reaction is created.

#### Note

**Schema file**

`note.yaml`

**Why it belongs here**

**Provisional:** It is authored contextual content attached to conversation work, although ticket-note governance may justify a future split after the visibility model is decided.

**Record role**

Authoritative mutable record for contextual content, audience, and soft deletion.

**Ownership path**

Exactly one of `conversationId`, `messageId`, or `moderationTicketId` is the direct target; access derives through that target's Conversation plus the Note audience.

**Authoritative writers and readers**

Identified participants or moderators create notes in permitted contexts; author and moderator edit/delete authority is not fully defined, and readers depend on the unresolved visibility model.

**Sensitivity**

Potentially sensitive user-authored or moderator-only content; a ticket note may include report evidence or operational reasoning.

**Freshness and cache posture**

Fresh read required until visibility and deletion authority are defined; potentially stale or broadly shared copies must not determine or expand the audience.

**Consistency and lineage**

Each Note targets exactly one supported object. Ticket notes retain lineage to Moderation Ticket, while message notes derive conversation scope through Message.

## Moderation

### Purpose

Own reports of concerning messages, moderator enforcement decisions, and time-bounded posting restrictions.

### Justification

Moderation is a separate boundary because owners and administrators govern sensitive report evidence and enforcement under conversation-scoped trust, with case lineage, append-only action evidence, and fresh restriction checks that differ materially from ordinary participation and content lifecycles.

### Domain Profile

**Primary workflows and access patterns**

- Create a numbered report from a visible message.
- List and review reports only for conversations the reviewer governs.
- Record message deletion, participant changes, and posting-restriction actions with ticket lineage when applicable.
- Check, impose, and lift time-bounded posting restrictions.

**Actors and access**

- Active participants create reports.
- Conversation owners and administrators read tickets and take supported actions; the exact division of moderation authority remains open.
- Messaging and Participation consume enforcement results but do not own moderation evidence.

**Tenant and authorization boundary**

`conversationId` governs ticket, action, and suspension access; reviewer authority derives from fresh active Membership and role state in that conversation.

**Security posture**

Sensitive tenant-private report reasons, reported content references, reviewer assignment or resolution, enforcement rationales, affected identities, and operational notes require privileged access.

**Workload and cache posture**

Review uses conversation-scoped case lists and ticket detail. Authorization, current workflow state, posting permission, and enforcement mutations require fresh authoritative reads.

**Consistency boundary**

Tickets must reference a Message in the same Conversation and an eligible reporter. Actions and suspensions must agree on conversation, target, ticket lineage, and restriction identity; message or membership mutations preserve their own authoritative state.

**Belongs here when**

An object represents a participant report, privileged conduct decision, enforcement restriction, or immutable evidence of a moderator action.

**Does not belong here when**

The object merely describes current participation, ordinary authored content, actor authentication, or conversation discovery configuration.

**Open decisions**

- **Open:** Ticket statuses, assignments, notifications, and closure behavior are not finalized, so the schema's current workflow fields are provisional.
- **Open:** Whether every supported moderation action is available equally to owners and administrators is unresolved.
- **Open:** Whether a private moderation discussion is optional or required remains unresolved.

### Objects

#### Moderation Ticket

**Schema file**

`moderation-ticket.yaml`

**Why it belongs here**

It is the authoritative case record for a participant report and its privileged review lifecycle.

**Record role**

Authoritative mutable record with provisional workflow state.

**Ownership path**

`conversationId` is the tenant owner; `messageId` identifies the reported evidence and `reportingIdentityId` identifies the reporter.

**Authoritative writers and readers**

An active participant who could view the Message creates it; owners and administrators for the Conversation review and update it.

**Sensitivity**

Sensitive report reason, reporter identity, message reference, assignment, resolution actor, and resolution summary.

**Freshness and cache posture**

Fresh read required for reviewer authorization and workflow changes; case-list copies require coherence and must stay conversation-scoped.

**Consistency and lineage**

The Message must belong to the same Conversation, the reporter must have been eligible to view it at report time, and `ticketNumber` is application-unique. Actions, notes, events, suspensions, and an optional moderation-discussion Conversation may reference it.

#### Moderation Action

**Schema file**

`moderation-action.yaml`

**Why it belongs here**

It is the append-only evidence of a privileged enforcement decision, whether or not a ticket prompted it.

**Record role**

Append-only audit evidence for moderator actions.

**Ownership path**

`conversationId` is the tenant owner; actor authority derives from active owner or administrator Membership at `occurredAt`.

**Authoritative writers and readers**

Authorized owners or administrators append it; authorized moderators and audit processes read it.

**Sensitivity**

Privileged enforcement history including actor, target identity or message, reason, restriction reference, and optional ticket lineage.

**Freshness and cache posture**

Immutable by identifier after creation, but fresh authorization is required before action and reuse remains tenant-restricted.

**Consistency and lineage**

Action type determines its required target. Suspension actions reference the exact Posting Suspension, and ticket-driven actions retain the Moderation Ticket link.

#### Posting Suspension

**Schema file**

`posting-suspension.yaml`

**Why it belongs here**

It is a moderator-imposed conduct restriction whose authoritative meaning is the enforcement decision, even though Messaging consumes it for posting eligibility.

**Record role**

Authoritative mutable record for a bounded restriction and optional early lift.

**Ownership path**

`membershipId` identifies the restricted relationship, while copied `conversationId` and `identityId` must match that Membership.

**Authoritative writers and readers**

Authorized owners or administrators impose or lift it; posting authorization, moderators, and audit workflows read it.

**Sensitivity**

Tenant-private enforcement state including affected identity, imposing or lifting moderator, reason, timing, and optional ticket.

**Freshness and cache posture**

Fresh read required for every posting decision; active state is derived from the current time interval and any early lift.

**Consistency and lineage**

`endsAt` follows `startsAt`; lift time and actor appear together. Moderation Action identifies the exact restriction created or lifted, and copied membership fields must agree.

## Shared Object Relationships

### Identity

**Authoritative domain**

Identity

**Consuming domains**

- Discovery
- Participation
- Content
- Moderation

**Dependency type**

Current-state read and audit lineage.

**Logical use**

All domains attribute actions and retained history to an identified person or bot, while authentication status determines application access.

**Freshness or consistency implication**

Fresh Identity status is required for access; retained identifiers remain valid attribution even after disablement.

### Conversation

**Authoritative domain**

Discovery

**Consuming domains**

- Participation
- Content
- Moderation

**Dependency type**

Current-state read and pinned tenant reference.

**Logical use**

The consuming domains scope memberships, content, reports, and enforcement to one conversation.

**Freshness or consistency implication**

Current status and privacy state must be honored, and no copied `conversationId` independently grants access.

### Tag and Conversation Tag

**Authoritative domain**

Discovery

**Consuming domains**

- Participation

**Dependency type**

Current-state read.

**Logical use**

Participation uses the authoritative active tag set to determine whether an identified actor can join a listed or known unlisted conversation.

**Freshness or consistency implication**

Join checks must not use stale assignments or autocomplete results, particularly for unlisted privacy.

### Membership

**Authoritative domain**

Participation

**Consuming domains**

- Discovery
- Content
- Moderation

**Dependency type**

Current-state read.

**Logical use**

Discovery uses role state for tag maintenance and archival, Content uses it for viewing and posting, and Moderation uses it for reporter and reviewer authority.

**Freshness or consistency implication**

Every authorization, ban, owner-continuity, and enforcement mutation decision requires current Membership state.

### Membership Role Period

**Authoritative domain**

Participation

**Consuming domains**

- Content
- Moderation

**Dependency type**

Pinned historical reference and audit lineage.

**Logical use**

Historical periods explain whether an actor held a required role when a retained message deletion or moderation action occurred.

**Freshness or consistency implication**

Closed periods are stable, but the current open period does not replace a fresh Membership check.

### Membership Event

**Authoritative domain**

Participation

**Consuming domains**

- Moderation

**Dependency type**

Current-state read and audit lineage.

**Logical use**

Moderation follows an optional ticket reference from a participation transition to the case that prompted it.

**Freshness or consistency implication**

The event remains immutable evidence and must agree with the authoritative Membership transition.

### Message

**Authoritative domain**

Content

**Consuming domains**

- Moderation

**Dependency type**

Current-state read and pinned evidence reference.

**Logical use**

A Moderation Ticket reports one Message, and reviewers use its retained content and conversation lineage as evidence.

**Freshness or consistency implication**

Ticket lineage remains pinned after soft deletion, while participant display and further action must honor current deletion and authorization state.

### Note

**Authoritative domain**

Content

**Consuming domains**

- Moderation

**Dependency type**

Current-state read and audit lineage.

**Logical use**

Moderation uses Notes attached to tickets as reviewer context.

**Freshness or consistency implication**

Until the audience model is finalized, ticket notes require fresh, narrowly authorized reads and must not be exposed through general content caches.

### Moderation Ticket

**Authoritative domain**

Moderation

**Consuming domains**

- Discovery
- Participation
- Content

**Dependency type**

Audit lineage.

**Logical use**

A moderation-discussion Conversation links to its case, moderation-driven Membership Events preserve the prompting ticket, and ticket-targeted Notes attach reviewer context to it.

**Freshness or consistency implication**

References must preserve the ticket's conversation scope, and a ticket reference never grants access to the case or a confidential discussion by itself. Ticket-targeted Note access derives through that scope and current reviewer authority; current ticket workflow state is not needed merely to validate historical lineage.

### Moderation Action

**Authoritative domain**

Moderation

**Consuming domains**

- Participation
- Content

**Dependency type**

Work handoff and audit lineage.

**Logical use**

Participation and Content use the action as evidence for moderator-driven membership changes, posting restrictions, and message deletion while retaining their own authoritative current state.

**Freshness or consistency implication**

The action must agree with the affected Membership, Posting Suspension, or Message and does not replace a fresh read of that object's current state.

### Posting Suspension

**Authoritative domain**

Moderation

**Consuming domains**

- Content
- Participation

**Dependency type**

Current-state read and enforcement handoff.

**Logical use**

Content checks the restriction before accepting a message, while Participation presents and governs participant restriction context.

**Freshness or consistency implication**

Posting decisions require current interval and lift state and must not rely on potentially stale copies.
