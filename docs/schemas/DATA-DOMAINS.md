# Data Domains

## Purpose

Define the storage-neutral ownership and governance boundaries for Tawk data. Every schema object has one authoritative domain even when other domains consume it.

## How To Use This Guide

Domains describe logical ownership, authorization, lifecycle, and governance boundaries; they do not prescribe physical stores, services, queues, caches, or deployment units. **Provisional** marks the best-supported classification when evidence is incomplete, while **Open** marks a material decision the sources do not establish.

## Identity and Authentication

### Purpose

Owns identified actor profiles and bot authentication credentials. It determines who may authenticate, not what an actor may do inside a conversation.

### Justification

Identity status and bot credential validity form an application-wide authentication and attribution boundary governed independently of conversation-scoped roles; credentials also contain authentication material with a stronger security posture than visible profiles.

### Domain Profile

**Primary workflows and access patterns**

- Authenticate a person through the selected human mechanism or a bot through a valid credential.
- Resolve a stable identity for profile display and retained authorship or audit attribution.
- Disable an identity or revoke, expire, rotate, and inspect a bot credential.

**Actors and access**

- Each identified person or bot uses its visible profile; the sources do not define profile-administration authority.
- Authentication processing reads identity status and credential validity, while conversation participants read permitted display profile data.

**Tenant and authorization boundary**

Identity is application-wide; no organization or tenant key is defined. Conversation authority is derived separately through Membership, never from identity type, credential identifiers, or provider subjects.

**Security posture**

Profiles combine display data visible with authorized conversation activity and private provider identifiers. Bot credential digests, prefixes, lifecycle state, and usage timestamps are sensitive credential material even though plaintext tokens are not retained.

**Workload and cache posture**

Profile display may use coherent copies, but authentication must use fresh identity status and credential state. Credential lookup and revocation checks cannot rely on potentially stale data.

**Consistency boundary**

A Bot Credential must reference an Identity with `type: bot`; authentication also requires that both the credential and Identity are active and that an optional credential expiry has not passed.

**Belongs here when**

A new object defines an application-wide actor, profile, authentication factor, credential lifecycle, or authentication eligibility.

**Does not belong here when**

The object governs conversation-scoped participation, roles, content, moderation, or another domain's resource authorization.

**Open decisions**

- **Open:** The human authentication mechanism and its administration boundary are not selected.
- **Open:** Whether a profile retains a separate proper name in addition to the required display name is unresolved.

### Objects

#### Identity

**Schema file**

`identity.yaml`

**Why it belongs here**

It is the stable application-wide actor and visible profile used for authentication eligibility, authorship, and audit attribution.

**Record role**

Authoritative mutable record for a person or bot profile and its enabled state.

**Ownership path**

Direct application-wide identity key `id`; no tenant owner key is defined.

**Authoritative writers and readers**

Profile and authentication administration write it, although the responsible actor is unspecified; authentication, conversation participation, content display, and audit workflows read it.

**Sensitivity**

The display name is visible with conversation activity; `properName` and `humanAuthSubject` are sensitive personal/provider data.

**Freshness and cache posture**

Fresh read required for authentication and access denial based on `status`; visible profile copies require coherence with profile changes.

**Consistency and lineage**

Its type constrains Bot Credential ownership, and its stable identifier preserves attribution after memberships end or the identity is disabled.

#### Bot Credential

**Schema file**

`bot-credential.yaml`

**Why it belongs here**

It authenticates one bot identity and has a credential lifecycle independent of that bot's conversation memberships.

**Record role**

Authoritative mutable record for a revocable and optionally expiring bot credential.

**Ownership path**

Owned directly through `identityId`, which must resolve to an Identity whose type is `bot`.

**Authoritative writers and readers**

Credential issuance and administration write lifecycle state; bot authentication reads the digest, status, expiry, and owning Identity status.

**Sensitivity**

Secret or credential material: `tokenDigest`, identifying prefix, lifecycle timestamps, and usage timestamps require restricted access; the plaintext token is explicitly not retained.

**Freshness and cache posture**

Fresh read required for authentication, revocation, expiry, and identity-disablement decisions.

**Consistency and lineage**

An active credential authenticates only while its owning bot Identity is active and the optional expiry remains in the future; revoked state requires `revokedAt`.

## Tag Vocabulary

### Purpose

Owns the canonical, reusable tag values shared across conversations. It does not own conversation-specific tag assignments or decide who may join a conversation.

### Justification

Tags are explicitly shared identifiers owned by neither users nor conversations, with application-wide normalization and reuse rules; that neutral vocabulary governance is distinct from the owner- or administrator-governed assignment of tags to a particular conversation.

### Domain Profile

**Primary workflows and access patterns**

- Normalize and reuse case-insensitive simple or key/value tags.
- Resolve a canonical tag during conversation creation, assignment, discovery, and known-unlisted entry.
- Supply autocomplete candidates only through eligibility derived from active assignments to listed conversations.

**Actors and access**

- Identified people and bots may introduce or use tag values through conversation workflows.
- Discovery users may read only values eligible for suggestions; conversation owners and administrators govern assignments, not the shared values themselves.

**Tenant and authorization boundary**

Tags are application-wide and have no user, conversation, organization, or tenant owner. A tag's existence never authorizes access to a conversation.

**Security posture**

The canonical vocabulary is controlled reference data, but a value used only by unlisted conversations is privacy-sensitive and must not be exposed through autocomplete.

**Workload and cache posture**

Canonical values support exact normalized lookup. Autocomplete is a derived view whose eligibility must remain coherent with current listed Conversation Tag assignments and Conversation visibility.

**Consistency boundary**

Tag normalization must remain canonical and case-insensitive; suggestion eligibility is derived rather than stored authority and must follow active listed-conversation associations.

**Belongs here when**

A new object defines a reusable, conversation-neutral tag value or a controlled rule intrinsic to the vocabulary itself.

**Does not belong here when**

The object assigns a tag to a conversation, ranks that assignment, exposes a conversation in discovery, or governs joining and access.

**Open decisions**

- **Open:** Display casing policy and the final exact tag grammar remain unresolved.

### Objects

#### Tag

**Schema file**

`tag.yaml`

**Why it belongs here**

It is the canonical application-wide value reused by any number of conversations and owned by none of them.

**Record role**

Reference or controlled configuration for a normalized tag value.

**Ownership path**

Direct application-wide key `id`; there is no tenant, identity, or conversation owner.

**Authoritative writers and readers**

Conversation creation and tag-management workflows may establish canonical values; conversation assignment, matching, joining, and eligible autocomplete read them.

**Sensitivity**

The value is not inherently public: a tag associated only with unlisted conversations must be treated as private discovery data and excluded from suggestions.

**Freshness and cache posture**

Current controlled configuration: reusable copies of the canonical value require coherence with normalization or display changes. Autocomplete eligibility is derived or replaceable and must never become an independent source of exposure truth.

**Consistency and lineage**

`normalizedValue` is the case-insensitive authority; optional `displayValue` must not change equality, and discovery eligibility depends on current cross-domain assignments.

## Conversations and Discovery

### Purpose

Owns each conversation's purpose, discovery and matching policy, lifecycle, and governed tag assignments. It is the aggregate boundary for creating, finding, joining, and archiving a tagged space.

### Justification

Conversation owners and administrators govern discovery policy, lifecycle, and tag assignments under privacy and ownership-continuity rules, creating a conversation-scoped authority boundary distinct from shared tag vocabulary, participant authorization history, and content authored inside the space.

### Domain Profile

**Primary workflows and access patterns**

- Create a listed or unlisted conversation with one to ten active tag assignments and a first owner.
- Find identifiable listed matches or evaluate non-identifying hidden matches from supplied tags.
- Change tag assignments, resolve joined-conversation context, and archive a conversation.
- Link an unlisted moderation-discussion conversation to the ticket it discusses.

**Actors and access**

- Any identified person or token-authenticated bot may create or attempt to find and join a conversation.
- Owners and administrators manage tags; only owners archive.
- Listed discovery exposes eligible conversation identity, while unlisted discovery withholds identity and private tags until the complete unique match rule is satisfied.

**Tenant and authorization boundary**

The Conversation is the conversation-scoped resource boundary. Membership grants participation; possession of tags, `moderationTicketId`, or a conversation identifier alone does not authorize access.

**Security posture**

Listed discovery attributes are discoverable only to identified users. Unlisted identity, tag combinations, moderation-discussion purpose, descriptions, and ticket linkage are tenant-private and may be confidential.

**Workload and cache posture**

Common access shapes are joined-conversation lists, tag-set matching, privacy-safe hidden-match counts, and direct conversation context. Current visibility, archive state, matching mode, and active tag assignments require coherent reads for discovery and joining.

**Consistency boundary**

Creation must establish the Conversation, first-owner Membership and role period, and one to ten active Conversation Tags together. Active tag assignments must have unique tag and position values, and removing the final active tag is forbidden.

**Belongs here when**

A new object is governed by a conversation owner or administrator and defines that conversation's discovery identity, lifecycle, settings, or assignment of shared classification values.

**Does not belong here when**

The object is a reusable global value, establishes an identity's participation or role, contains participant-authored content, or records a moderation case or action.

**Open decisions**

- **Open:** Extra-tag behavior for listed and unlisted matching and the interface for multiple complete hidden matches are unresolved.
- **Open:** Archived-conversation visibility and read behavior are unresolved.
- **Open:** Whether titles or descriptions are required and how changes to unlisted tags affect existing access paths are unresolved.
- **Open:** Whether a linked moderation-discussion conversation is required, optional, or deferred is unresolved; when it exists, it remains a Conversation owned here.

### Objects

#### Conversation

**Schema file**

`conversation.yaml`

**Why it belongs here**

It is the aggregate root that defines the tagged space's discovery mode, purpose, and active or archived lifecycle.

**Record role**

Authoritative mutable record for conversation policy and lifecycle.

**Ownership path**

Direct conversation key `id`; governance authority derives through an active Membership in the same conversation with the required owner or administrator role.

**Authoritative writers and readers**

The creator establishes it; owners and permitted administrators govern supported settings, while only owners archive. Identified discovery users, members, and dependent domains read the permitted state.

**Sensitivity**

Listed identity is discoverable to identified users; unlisted identity, tag linkage, and moderation ticket linkage are tenant-private or confidential.

**Freshness and cache posture**

Fresh read required for join, archive, and authorization-sensitive discovery decisions; ordinary presentation copies require coherence with visibility and lifecycle changes.

**Consistency and lineage**

Archive fields must agree with status; purpose controls ticket linkage and unlisted all-tag matching. Archival is coordinated with the last-owner rule and retains all dependent history.

#### Conversation Tag

**Schema file**

`conversation-tag.yaml`

**Why it belongs here**

It records an owner- or administrator-governed assignment that controls one conversation's classification, discovery, and joining behavior.

**Record role**

Authoritative mutable temporal association, stable after removal.

**Ownership path**

Owned through `conversationId`; `tagId` references the shared Tag without transferring assignment ownership.

**Authoritative writers and readers**

Conversation owners and administrators add or remove assignments; creation, discovery, joining, tag management, and the Tag domain's autocomplete-eligibility derivation read them.

**Sensitivity**

Assignments on unlisted conversations are tenant-private and must not leak private tag combinations; actor identifiers and removal history are internal operational data.

**Freshness and cache posture**

Fresh read required for matching, joining, and last-tag enforcement; removed assignment history is immutable by identifier once its end metadata is complete.

**Consistency and lineage**

Each conversation must retain one to ten active assignments with unique `(conversationId, tagId)` and positions; `removedAt` and `removedById` change together.

## Membership and Authorization

### Purpose

Owns the current and historical relationship between an identity and a conversation. It is the authority for participation state, conversation role, ownership continuity, and historical role evidence.

### Justification

Membership state is the conversation-scoped authorization boundary used across joining, viewing, posting, governance, and moderation, and its temporal role and event history must preserve authority after current state changes; that security and lineage responsibility is distinct from conversation settings and authored content.

### Domain Profile

**Primary workflows and access patterns**

- Verify current membership and role for viewing, posting, member lists, governance, and moderation.
- Join, rejoin, leave, remove, ban, unban, or change a participant's role.
- List active participants and expose former participants only to authorized owners or administrators.
- Reconstruct role periods and explanatory membership transitions for historical authorization and audit.

**Actors and access**

- Identified people and bots hold memberships under the same role model.
- Owners manage roles including ownership; administrators manage non-owner participants but cannot alter owners.
- Ordinary members read only the current participant view permitted by the conversation.

**Tenant and authorization boundary**

Every record is owned by the `conversationId` and identity relationship established by Membership. `identityId`, external provider data, or globally unique identifiers alone never grant conversation access.

**Security posture**

Membership status, roles, ban state, change reasons, actor attribution, and historical periods are tenant-private authorization and operational data.

**Workload and cache posture**

Current membership and role require fresh reads for every consequential permission decision. History is owner- or administrator-scoped and closed periods or append-only events may be reused only with authorization preserved.

**Consistency boundary**

Membership, its current open role period, and Membership Events must describe the same transitions. Role changes close and open periods together, active ownership cannot drop to zero unless the Conversation is archived, and copied conversation and identity keys must match Membership.

**Belongs here when**

A new object defines or explains an identity's conversation participation, role, ban state, authorization interval, or membership transition.

**Does not belong here when**

The object defines application authentication, conversation settings, participant-authored content, or the moderation case and sanction evidence that causes a membership change.

**Open decisions**

- **Open:** The exact rejoin treatment on an existing Membership and any additional eligibility restrictions are unresolved.
- **Open:** Whether posting can be denied for reasons other than bans and time-limited Posting Suspensions is unresolved.

### Objects

#### Membership

**Schema file**

`membership.yaml`

**Why it belongs here**

It is the authoritative current identity-to-conversation relationship used for participation and role authorization.

**Record role**

Authoritative mutable record for current participation and role state.

**Ownership path**

Owned by `conversationId`, with `identityId` identifying the participant; authorization is derived from `currentStatus: active` and an allowed `currentRole`.

**Authoritative writers and readers**

Join and self-leave workflows plus authorized owner or administrator governance write it. All conversation participation, governance, messaging, and moderation permission checks read it.

**Sensitivity**

Tenant-private authorization data including current role, inactive or banned state, and actor-attributed end history.

**Freshness and cache posture**

Fresh read required for viewing, joining, posting, leaving, role changes, moderation authority, and banned-identity checks.

**Consistency and lineage**

It must agree with its role periods and events; current active and banned states constrain `currentRole`, and ownership changes must preserve another active owner unless archival occurs in the same change.

#### Membership Role Period

**Schema file**

`membership-role-period.yaml`

**Why it belongs here**

It preserves the effective interval for each role so historical conversation authority remains inspectable.

**Record role**

Authoritative mutable temporal record while open, then an immutable snapshot after `effectiveTo`.

**Ownership path**

Owned through `membershipId`; copied `conversationId` and `identityId` must equal the referenced Membership values.

**Authoritative writers and readers**

Join and authorized role-governance workflows open or close periods; permission investigation and audit readers use the historical intervals.

**Sensitivity**

Tenant-private role and authorization history with assigning and ending actor identifiers.

**Freshness and cache posture**

Fresh read required when an open period informs current authority; a closed period is immutable by identifier but remains restricted to authorized use.

**Consistency and lineage**

Periods for one Membership cannot overlap and only one may remain open; a role change ends the prior period and creates the next atomically.

#### Membership Event

**Schema file**

`membership-event.yaml`

**Why it belongs here**

It is the append-only explanation of how participation and role state changed, including moderation-driven transitions.

**Record role**

Append-only audit evidence for a membership transition.

**Ownership path**

Owned through `membershipId` and its matching `conversationId` and `identityId`; optional `moderationTicketId` provides cause lineage, not ownership.

**Authoritative writers and readers**

Join, leave, role-management, and moderation workflows append events; authorized governance, moderation, and audit investigation read them.

**Sensitivity**

Tenant-private audit evidence that may include role changes, ban state, actor identity, reasons, and moderation-ticket linkage.

**Freshness and cache posture**

Immutable by identifier after creation; reusable copies must preserve conversation authorization and sensitive-reason handling.

**Consistency and lineage**

Transition type constrains role values, and the event must explain the corresponding Membership and role-period change while retaining optional ticket provenance.

## Messaging

### Purpose

Owns participant-authored conversation messages and retained emoji responses. It preserves authorship and visibility state after membership changes without owning participant authorization.

### Justification

Messages and reactions are authored interaction records with retention, soft-removal, chronological access, and content sensitivity distinct from the authorization history that permits creation and the case-oriented moderation records that may later change visibility.

### Domain Profile

**Primary workflows and access patterns**

- Read a conversation's visible message history in chronological context.
- Post a message as an active participant and retain attribution after departure.
- Soft-delete a permitted message and add or withdraw an emoji reaction.
- Supply the reported message and surrounding context for moderation review.

**Actors and access**

- Active members, whether people or bots, create messages and reactions.
- Authors delete their own messages; owners and administrators may delete messages under conversation authority.
- Only actors allowed to view the conversation may read content and reactions.

**Tenant and authorization boundary**

Every record is owned by `conversationId`; read and write permission derives from fresh Membership state, with historical role evidence used where a deletion authorization must be reconstructed.

**Security posture**

Message bodies, deleted content, deletion reasons, authorship, and reactions are tenant-private user content. Soft-deleted bodies remain sensitive even when hidden from participant views.

**Workload and cache posture**

Conversation-scoped chronological reads and reaction display dominate. Visible-content views must remain coherent with soft deletion and withdrawal; posting and reaction writes require fresh authorization.

**Consistency boundary**

Message deletion metadata changes together and the deletion actor must be the author or an authorized moderator at deletion time. Reactions must reference a Message in the same Conversation and an active participant at creation.

**Belongs here when**

A new object is participant-authored conversational content, a retained response to that content, or a subordinate replaceable presentation of message history.

**Does not belong here when**

The object grants participation, records a report or moderation sanction, or adds separately governed annotation content with its own audience rules.

**Open decisions**

- **Open:** The supported emoji set and uniqueness or multiplicity rules for one identity's reactions remain unresolved.

### Objects

#### Message

**Schema file**

`message.yaml`

**Why it belongs here**

It is the authoritative participant-authored content record for a conversation and retains its author relationship after departure.

**Record role**

Authoritative mutable record with retained content and soft-deletion visibility state.

**Ownership path**

Owned by `conversationId`; `authorIdentityId` attributes authorship, while permission derives through the author's Membership at posting time.

**Authoritative writers and readers**

Active participants create messages; the author or an authorized owner or administrator may soft-delete them. Authorized participants and moderation reviewers read permitted content.

**Sensitivity**

Tenant-private message content, authorship, retained deleted body, deletion actor, and optional deletion reason.

**Freshness and cache posture**

Current authoritative content: any cached visible-history projection requires coherence with message soft-deletion changes; creation and deletion authorization require fresh Membership or historical role evidence.

**Consistency and lineage**

Deletion fields must agree, and moderator deletion lineage is preserved through Moderation Action rather than a single backward ticket reference.

#### Emoji Reaction

**Schema file**

`emoji-reaction.yaml`

**Why it belongs here**

It is a subordinate participant response to one Message and follows that Message's conversation access boundary.

**Record role**

Authoritative mutable association with soft-removal state.

**Ownership path**

Owned through `messageId` and its `conversationId`; `identityId` identifies the reacting active participant.

**Authoritative writers and readers**

Active participants add or withdraw their reactions; authorized message viewers read active reaction displays.

**Sensitivity**

No override to the domain posture; reacting identity and response remain tenant-private conversation activity.

**Freshness and cache posture**

Current authoritative association: any cached active-reaction projection requires coherence with `removedAt`; creation must use fresh Membership authorization.

**Consistency and lineage**

The referenced Message and copied `conversationId` must agree, and the reacting identity must have active Membership when the reaction is created.

## Moderation

### Purpose

Owns message reports, moderator decisions, action evidence, and time-bounded posting restrictions. It preserves case provenance and the consequences of privileged conduct review.

### Justification

Moderation is a conversation-scoped privileged trust boundary with case-specific sensitive evidence, authorized owner or administrator writers, append-only action lineage, and sanction state used for permission decisions; these governance and audit requirements differ from ordinary content and general membership administration.

### Domain Profile

**Primary workflows and access patterns**

- Create a numbered report from a visible message and participant explanation.
- List and review cases only for conversations the reviewer governs.
- Retain evidence, resolution context, and supported actions such as deletion, removal, banning, restoration, or posting restriction.
- Check whether a time-bounded posting restriction is currently effective.

**Actors and access**

- An active participant who can view a message creates its ticket.
- Conversation owners and administrators read reports and write supported actions, suspensions, and resolution data; exact action parity is unresolved.
- Affected participants do not gain access to privileged case data merely because they are targets or reporters.

**Tenant and authorization boundary**

Each case and action is owned by `conversationId`; reporter, target, ticket number, or linked message identifiers do not grant access. Moderator authority derives through fresh conversation Membership.

**Security posture**

Reports, reasons, flagged content linkage, assignments, reviewer outcomes, sanction details, and action rationales are sensitive tenant-private moderation data.

**Workload and cache posture**

Access includes conversation-scoped case lists, ticket detail, audit investigation, and active posting-restriction checks. Authorization, sanction, external mutation, and resolution decisions require fresh reads; append-only action evidence may be reused only within its access boundary.

**Consistency boundary**

Tickets must match their Message conversation and eligible reporter. Actions must match their targets and linked suspensions; restrictions must match Membership, identity, and conversation and derive active state from their interval and optional lift.

**Belongs here when**

A new object represents a conduct report, privileged review decision, moderation action, sanction, or immutable evidence explaining a moderator-triggered consequence.

**Does not belong here when**

The object is the underlying message, the resulting membership state, general conversation governance, or annotation content whose audience is governed independently.

**Open decisions**

- **Open:** Final ticket statuses, assignment rules, notifications, and closure behavior are unresolved.
- **Open:** Whether owners and administrators may perform every supported moderation action is unresolved.
- **Open:** Whether every ticket has a linked private discussion is unresolved; any such discussion remains owned by Conversations and Discovery.

### Objects

#### Moderation Ticket

**Schema file**

`moderation-ticket.yaml`

**Why it belongs here**

It is the authoritative case record for a participant report and its review state.

**Record role**

Authoritative mutable operational case record, stable only after a defined terminal outcome.

**Ownership path**

Owned by `conversationId`; `messageId` identifies the evidence and `reportingIdentityId` the reporter, while reviewer authorization derives from Membership in that conversation.

**Authoritative writers and readers**

An eligible participant creates the report; authorized owners or administrators review and update it. Unauthorized conversations and ordinary case-list readers are excluded.

**Sensitivity**

Sensitive moderation data including reporter identity, flagged-message link, participant explanation, assignment, outcome, and resolution summary.

**Freshness and cache posture**

Terminally stable only after a final terminal workflow is established; until then, current review state requires coherent or fresh reads for decisions.

**Consistency and lineage**

The Message must belong to the same Conversation, the reporter must have been allowed to view it at `reportedAt`, and `ticketNumber` must remain application-unique.

#### Moderation Action

**Schema file**

`moderation-action.yaml`

**Why it belongs here**

It is the immutable evidence of each concrete action a moderator takes while governing conduct or resolving a case.

**Record role**

Append-only audit evidence for a moderation action.

**Ownership path**

Owned by `conversationId`; `actorIdentityId` must have the required active Membership, while optional ticket and target references preserve lineage.

**Authoritative writers and readers**

Authorized owners or administrators append actions; authorized moderation, governance, and audit readers inspect them.

**Sensitivity**

Sensitive operational evidence including actor, target identities or messages, action type, reason, ticket linkage, and sanction linkage.

**Freshness and cache posture**

Immutable by identifier after creation, but copies must preserve tenant authorization and must not replace fresh current-state checks.

**Consistency and lineage**

Action type constrains target fields; suspension actions must reference the exact Posting Suspension with matching target identity and conversation, and ticket-driven changes retain ticket provenance.

#### Posting Suspension

**Schema file**

`posting-suspension.yaml`

**Why it belongs here**

It is a moderator-imposed sanction whose effective interval directly governs posting while leaving Membership active.

**Record role**

Authoritative mutable temporal restriction, terminally stable after expiry or early lift.

**Ownership path**

Owned by `conversationId` and linked through `membershipId` to the affected `identityId`; an optional ticket supplies cause lineage.

**Authoritative writers and readers**

Authorized owners or administrators impose or lift the restriction; message-posting authorization, governance, moderation, and audit workflows read it.

**Sensitivity**

Sensitive tenant-private sanction data including affected identity, imposing or lifting actors, reason, interval, and ticket linkage.

**Freshness and cache posture**

Fresh read required for posting authorization and lifting decisions; it is stable only after the interval ends or an early lift is final.

**Consistency and lineage**

Membership, identity, and conversation must agree; `endsAt` follows `startsAt`, lift fields change together, and action records identify the exact restriction imposed or lifted.

## Annotations

### Purpose

Owns identified user-authored contextual notes attached to conversations, messages, or moderation tickets. It keeps note authorship, visibility, and soft-deletion governance independent of each target's authoritative record.

### Justification

A Note may cross conversation, messaging, and moderation targets while remaining authored and potentially visible to an audience different from the target's ordinary readers; its unresolved audience policy and independent soft-deletion lifecycle create a distinct security and governance boundary rather than making each target domain authoritative for note content.

### Domain Profile

**Primary workflows and access patterns**

- Add contextual notes to a Conversation or Message.
- Add operational review notes to a Moderation Ticket.
- Read target-scoped notes according to the eventual audience policy.
- Soft-delete a retained note without altering its target.

**Actors and access**

- Identified participants author notes; owners and administrators also add operational notes.
- Read, update, and delete authority cannot be finalized until the visibility model is resolved.

**Tenant and authorization boundary**

Authorization derives through exactly one target relationship and the target Conversation, then must be narrowed by the Note's audience policy. An author or target identifier alone is not sufficient access.

**Security posture**

Note bodies, author identity, target linkage, visibility, and deletion metadata are sensitive user or moderator content. A note described as configuration or context is not harmless when it includes message or case details.

**Workload and cache posture**

Target-scoped note lists are expected. Current visibility and soft-deletion state require coherent reads, and authorization must not rely on stale audience or membership data.

**Consistency boundary**

Each Note attaches to exactly one target. The target must resolve to a Conversation authorization boundary, and changes to note visibility or deletion must remain independent of the target's authority.

**Belongs here when**

A new object is user-authored contextual annotation with its own author, audience, or retention state and can attach across authoritative domains.

**Does not belong here when**

The content is the authoritative target record, append-only system audit evidence, a moderation action, or a derived presentation without independent user-authored meaning.

**Open decisions**

- **Open:** Supported note audiences, whether visibility may change, and who may read, edit, or delete each kind of note are unresolved and materially affect authorization.

### Objects

#### Note

**Schema file**

`note.yaml`

**Why it belongs here**

It has independent authorship, audience, and soft-deletion state while attaching to exactly one resource owned by another domain.

**Record role**

Authoritative mutable record for contextual user-authored content.

**Ownership path**

Owned through exactly one of `conversationId`, `messageId`, or `moderationTicketId` and that target's governing Conversation; `authorIdentityId` attributes authorship but does not establish the authorization boundary. Final audience authority is Open.

**Authoritative writers and readers**

Identified participants and authorized moderators create notes; exact read, update, and deletion authority depends on the unresolved visibility model.

**Sensitivity**

Sensitive personal, conversation, or moderation content; ticket notes can inherit the stronger moderation-case posture.

**Freshness and cache posture**

Current authoritative content: cached note views require coherence with visibility and soft-deletion changes, while every read must use fresh target authorization and the eventual audience rule.

**Consistency and lineage**

Exactly one target reference is required; target lineage must preserve the governing Conversation even when the direct target is a Message or Moderation Ticket.

## Shared Object Relationships

### Identity

**Authoritative domain**

Identity and Authentication

**Consuming domains**

- Conversations and Discovery
- Membership and Authorization
- Messaging
- Moderation
- Annotations

**Dependency type**

Current-state read and audit lineage.

**Logical use**

Consumers attribute creators, participants, authors, moderators, targets, and note authors to stable identified actors.

**Freshness or consistency implication**

Authentication uses fresh enabled state, while retained historical references preserve attribution after disablement and do not independently grant resource access.

### Bot Credential

**Authoritative domain**

Identity and Authentication

**Consuming domains**

- Conversations and Discovery
- Membership and Authorization
- Messaging
- Moderation
- Annotations

**Dependency type**

Current-state read.

**Logical use**

A bot must authenticate before performing the same conversation actions available to a person in its role.

**Freshness or consistency implication**

Every authenticated bot action depends on current credential validity and current Identity status in addition to domain-specific authorization.

### Tag

**Authoritative domain**

Tag Vocabulary

**Consuming domains**

- Conversations and Discovery

**Dependency type**

Current-state read and projection/index use.

**Logical use**

Conversation Tag references canonical values for assignment, matching, joining, display, and eligible autocomplete.

**Freshness or consistency implication**

Autocomplete is a subordinate derivation of active listed assignments and must not expose a tag merely because its canonical record exists.

### Conversation

**Authoritative domain**

Conversations and Discovery

**Consuming domains**

- Membership and Authorization
- Messaging
- Moderation
- Annotations

**Dependency type**

Current-state read and ownership path.

**Logical use**

Consumers derive their tenant boundary, lifecycle context, and permitted access from the governing conversation.

**Freshness or consistency implication**

Archive, visibility, and purpose changes must remain coherent with dependent behavior, but conversation identifiers alone never authorize access.

### Conversation Tag

**Authoritative domain**

Conversations and Discovery

**Consuming domains**

- Tag Vocabulary

**Dependency type**

Projection/index use.

**Logical use**

The Tag Vocabulary domain derives whether a canonical value is eligible for autocomplete from active assignments to listed conversations.

**Freshness or consistency implication**

The derived autocomplete view must track assignment removal and Conversation visibility without becoming an authority for joining.

### Membership

**Authoritative domain**

Membership and Authorization

**Consuming domains**

- Conversations and Discovery
- Messaging
- Moderation
- Annotations

**Dependency type**

Current-state read.

**Logical use**

Consumers verify join eligibility, current participation, content access, posting, conversation governance, moderation authority, and target-scoped note access.

**Freshness or consistency implication**

All consequential permission checks require fresh active status and role; stale membership data cannot authorize viewing, posting, joining, or moderation.

### Membership Role Period

**Authoritative domain**

Membership and Authorization

**Consuming domains**

- Messaging
- Moderation

**Dependency type**

Audit lineage.

**Logical use**

Historical intervals establish whether an actor held the required role when a retained message deletion or moderation action occurred.

**Freshness or consistency implication**

Closed periods are stable evidence, while an open period must remain consistent with current Membership and cannot be treated as historical final truth.

### Membership Event

**Authoritative domain**

Membership and Authorization

**Consuming domains**

- Moderation

**Dependency type**

Audit lineage.

**Logical use**

Moderation investigation uses membership events to explain removal, ban, unban, and role transitions caused by a ticket or action.

**Freshness or consistency implication**

The append-only event must agree with the resulting Membership and role period and retain the originating ticket reference when applicable.

### Moderation Action

**Authoritative domain**

Moderation

**Consuming domains**

- Membership and Authorization
- Messaging

**Dependency type**

Work handoff and audit lineage.

**Logical use**

Participant removal, ban, restoration, and message-deletion workflows apply the authorized consequence in the consuming domain while retaining the moderator action as evidence.

**Freshness or consistency implication**

The action's conversation and target must agree with the resulting Membership transition or Message deletion, and the immutable action does not replace a fresh current-state authorization check.

### Message

**Authoritative domain**

Messaging

**Consuming domains**

- Moderation
- Annotations

**Dependency type**

Current-state read and audit lineage.

**Logical use**

Moderation Ticket identifies the reported content, Moderation Action identifies a deleted target, and Note may attach contextual content to the message.

**Freshness or consistency implication**

Ticket creation must pin the message and conversation relationship, while readers honor current visibility and stronger authorized review access for retained deleted content.

### Moderation Ticket

**Authoritative domain**

Moderation

**Consuming domains**

- Conversations and Discovery
- Membership and Authorization
- Annotations

**Dependency type**

Current-state read and audit lineage.

**Logical use**

A moderation-discussion Conversation links to its case, membership transitions retain case provenance, and ticket notes attach review context.

**Freshness or consistency implication**

The linked records must preserve ticket and Conversation alignment; ticket linkage never grants access to the confidential discussion or case.

### Posting Suspension

**Authoritative domain**

Moderation

**Consuming domains**

- Membership and Authorization
- Messaging

**Dependency type**

Current-state read.

**Logical use**

Participation remains active in Membership while message creation checks whether a moderator-imposed restriction is currently effective.

**Freshness or consistency implication**

Posting decisions require the current interval and lift state and cannot use a stale cached restriction result.

### Note

**Authoritative domain**

Annotations

**Consuming domains**

- Conversations and Discovery
- Messaging
- Moderation

**Dependency type**

Current-state read.

**Logical use**

Target domains display contextual notes without making those notes part of the target's authoritative state.

**Freshness or consistency implication**

Consumers must resolve the target Conversation and apply current note visibility and deletion rules; until the audience model is decided, broader access is unsafe.
