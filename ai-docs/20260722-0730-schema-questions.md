# Schema Questions

## Sources and reconciliation

This report reviewed:

- `ai-docs/20260722-0719-schema-review.md`
- `ai-docs/20260722-0724-schema-changes.md`

The review contains 14 numbered recommendations (`SR-01` through `SR-14`) and five separately identified simplification candidates. The changes report assigns those simplification candidates IDs `SC-01` through `SC-05`, producing 19 decisions in total. All 19 decisions were accepted; none was partially implemented or rejected. The difference between “14 recommendations” and “19 accepted” is therefore report-count metadata, not a product disagreement.

Terms used below: an **enum** is a fixed list of allowed values; a **lifecycle state** is a status showing the current phase of a record; an **invariant** is a rule the application must keep true after every successful write; and an **active uniqueness rule** identifies which combination of fields may occur only once among records that have not been removed.

## Conversation identity and membership

### Q-01 — Required title for listed conversations

- **Affected schema item:** `docs/schemas/conversation.yaml`, object `Conversation`, fields `title`, `description`, `visibility`, and `purpose`.
- **Current state:** `Conversation.title` and `Conversation.description` are optional for every conversation. A listed standard conversation can therefore be returned as an identifiable search result with only its UUID and tags available for presentation.
- **Requirement context:** Listed conversations must expose an identifiable result that a user can select and join, but the requirements explicitly leave open whether a conversation needs a title or description beyond tags and discovery settings.
- **Direct question:** Should `Conversation.title` be required when `purpose` is `standard` and `visibility` is `listed`, while remaining optional for unlisted and moderation-discussion conversations? Answer **yes** or **no**.
- **Why it matters:** A required title gives search results a stable human-readable label; leaving it optional commits the UI to presenting tags or another identifier instead.
- **Decision unlocked:** The answer determines whether `conversation.yaml` should add a conditional `required` rule for `title` and whether creation clients must collect a title for listed conversations.

### Q-02 — Reuse of a Membership when an identity rejoins

- **Affected schema item:** `docs/schemas/membership.yaml`, object `Membership`, fields `id`, `conversationId`, `identityId`, `currentStatus`, and `lastActivatedAt`; `docs/schemas/membership-event.yaml`, object `Membership Event`, field `type: rejoined`; `docs/schemas/membership-role-period.yaml`, object `Membership Role Period`, field `membershipId`.
- **Current state:** `Membership` is described as the durable relationship between one identity and one conversation, and `Membership Event.type` includes `rejoined`, but the dictionary does not explicitly prohibit creating a second Membership for the same `(conversationId, identityId)` pair. Application code could either reactivate the existing record or create another record.
- **Requirement context:** A person who leaves is not automatically banned and may rejoin. Membership and role history must be retained, while the requirements explicitly ask whether rejoining creates a new participation period on the existing Membership.
- **Direct question:** When an identity rejoins a conversation after `currentStatus: left` or `removed`, must the application reactivate the existing `Membership` record rather than create a new Membership? Answer **yes** or **no**.
- **Why it matters:** Reusing one Membership keeps role periods, events, former-member visibility, and authorization history under one stable identifier; multiple Membership records require a different rule for selecting the current relationship.
- **Decision unlocked:** A **yes** answer adds a dictionary uniqueness invariant for `(conversationId, identityId)` and defines rejoin as updating the existing Membership plus adding new event and role-period records. A **no** answer requires a rule for linking and selecting among historical Membership records.

## Tag representation

### Q-03 — Display casing policy

- **Affected schema item:** `docs/schemas/tag.yaml`, object `Tag`, fields `normalizedValue` and `displayValue`; `docs/schemas/DICTIONARY.md`, `Tag` entry.
- **Current state:** `Tag.normalizedValue` is required lowercase text used for comparison. `Tag.displayValue` is optional and may preserve uppercase letters, so two application paths could display the same tag differently depending on whether `displayValue` is populated.
- **Requirement context:** Tags must compare case-insensitively, but the requirements leave the display policy open: preserve creator capitalization, always show lowercase, or maintain a separate display form.
- **Direct question:** Choose one POC policy: **A)** always display `normalizedValue` in lowercase and remove `displayValue`, or **B)** preserve creator capitalization in `displayValue` and require it on every Tag.
- **Why it matters:** One explicit policy prevents inconsistent search suggestions and conversation labels for the same shared tag.
- **Decision unlocked:** The answer determines whether `Tag.displayValue` is removed or made required and what creation and update behavior the dictionary must document.

### Q-04 — Number of hyphen separators

- **Affected schema item:** `docs/schemas/tag.yaml`, object `Tag`, regular-expression `pattern` constraints on `normalizedValue` and `displayValue`.
- **Current state:** Both patterns allow any number of nonconsecutive hyphens inside each tag component, so values such as `north-america-east` are valid while leading, trailing, or consecutive hyphens are invalid.
- **Requirement context:** A hyphen may be used only as a separator and cannot begin or end a component, but the requirements explicitly leave open whether “a single hyphen” means one per component or any number of separated hyphens.
- **Direct question:** Should each key or value component allow **A)** any number of nonconsecutive hyphens, as the schema does now, or **B)** at most one hyphen?
- **Why it matters:** The choice changes which user-entered tags are accepted and avoids storing values that a later grammar decision would require the team to migrate.
- **Decision unlocked:** The answer fixes the hyphen portion of both tag patterns and their field descriptions.

### Q-05 — Number of colon separators

- **Affected schema item:** `docs/schemas/tag.yaml`, object `Tag`, regular-expression `pattern` constraints on `normalizedValue` and `displayValue`; `docs/schemas/DICTIONARY.md`, `Tag` entry.
- **Current state:** Both patterns allow zero or one colon, treating it as the optional separator between one key and one value. Values such as `region:country:city` are rejected.
- **Requirement context:** The requirements show a key/value form such as `key:value` but explicitly leave multiple-colon behavior unresolved.
- **Direct question:** Should a tag allow **A)** at most one colon, as the schema does now, or **B)** multiple colon-separated components?
- **Why it matters:** Colon count determines whether the stored value has a simple two-part meaning or a deeper hierarchy that search and display code must parse consistently.
- **Decision unlocked:** The answer fixes the colon portion of both tag patterns and whether the dictionary may continue deriving a simple-versus-key/value classification from one optional colon.

## Moderation tickets and authority

### Q-06 — Ticket terminal lifecycle and resolution metadata

- **Affected schema item:** `docs/schemas/moderation-ticket.yaml`, object `Moderation Ticket`, fields `status`, `resolvedAt`, `resolvedById`, and `resolutionSummary`.
- **Current state:** `status` allows `open`, `inReview`, `resolved`, and `closed`. The schema does not define a difference between `resolved` and `closed`, and it allows either terminal value without a resolution time, actor, or outcome summary.
- **Requirement context:** Owners and administrators must be able to review and retain numbered reports, but exact ticket statuses and closure behavior are explicitly unresolved.
- **Direct question:** For the POC, should the lifecycle be `open` → `inReview` → `resolved`, with `closed` removed and every `resolved` ticket required to contain `resolvedAt`, `resolvedById`, and `resolutionSummary`? Answer **yes** or **no**.
- **Why it matters:** A single terminal state with complete outcome metadata prevents the API and UI from interpreting “resolved” and “closed” differently or presenting completed tickets with no auditable result.
- **Decision unlocked:** A **yes** answer permits exact enum and conditional rules in `moderation-ticket.yaml`. A **no** answer means the product owner must define the distinct meaning and metadata requirements of both terminal states before those rules can be added.

### Q-07 — Administrator authority for all moderation actions

- **Affected schema item:** `docs/schemas/moderation-action.yaml`, object `Moderation Action`, fields `actorIdentityId` and `type`; `docs/schemas/DICTIONARY.md`, `Moderation Action` entry.
- **Current state:** The schema describes `actorIdentityId` as an owner or administrator and does not reserve any `type` value—`deleteMessage`, `removeParticipant`, `banParticipant`, `unbanParticipant`, `suspendPosting`, or `liftPostingSuspension`—for owners only. The likely application behavior is that both roles may perform every listed action, except administrators still cannot alter owners under the separate ownership invariant.
- **Requirement context:** The main moderation flow says owners and administrators may take the listed actions, but the open-questions section separately asks whether any moderation action should be owner-only.
- **Direct question:** May an active administrator perform every current `Moderation Action.type` against a non-owner participant? Answer **yes** or **no**.
- **Why it matters:** Authorization code needs one stable rule; otherwise two endpoints could grant different authority for the same action.
- **Decision unlocked:** A **yes** answer confirms the current dictionary description. A **no** answer requires the product owner to name the owner-only enum values before an action-by-role invariant can be documented.

## Notes

### Q-08 — Final note visibility policy

- **Affected schema item:** `docs/schemas/note.yaml`, object `Note`, field `visibility` and target fields `conversationId`, `messageId`, and `moderationTicketId`; `docs/schemas/DICTIONARY.md`, `Note` entry.
- **Current state:** `Note.visibility` is optional and, when present, allows `authorOnly`, `moderators`, `owners`, or `participants`. No default is defined for any note target, so separate clients could omit the field and expose the note to different audiences.
- **Requirement context:** People may add conversation or message notes, and owners or administrators may add operational notes to conversations or tickets. The requirements say a visibility setting is required once the visibility model is finalized.
- **Direct question:** Should the POC retain all four current visibility values and require the author to select one explicitly whenever a Note is created? Answer **yes** or **no**.
- **Why it matters:** Explicit selection avoids an implicit default that could expose personal or moderation text to unintended readers.
- **Decision unlocked:** A **yes** answer makes `visibility` required without adding a default. A **no** answer requires the product owner to identify which enum values to remove or which exact default applies to each target type.

### Q-09 — Visibility changes after note creation

- **Affected schema item:** `docs/schemas/note.yaml`, object `Note`, fields `visibility` and `updatedAt`; `docs/schemas/DICTIONARY.md`, `Note` entry.
- **Current state:** The schema permits `visibility` and contains `updatedAt`, but it does not say whether an existing Note's audience may be changed. Application implementations could treat the field as editable or immutable.
- **Requirement context:** The requirements explicitly leave note-visibility mutability unresolved, and note audiences can include private and moderation-only readers.
- **Direct question:** May `Note.visibility` change after creation? Answer **yes** or **no**.
- **Why it matters:** Expanding an existing note's audience can disclose text written under a narrower expectation, while forbidding changes requires a replacement-note workflow when the author chose the wrong audience.
- **Decision unlocked:** The answer determines whether the dictionary should define an immutable field or document who may change it and whether that change needs audit history.

## Confidential moderation discussions

### Q-10 — Whether a linked discussion is created

- **Affected schema item:** `docs/schemas/conversation.yaml`, object `Conversation`, fields `purpose: moderationDiscussion` and `moderationTicketId`; relationship from `Conversation.moderationTicketId` to `Moderation Ticket.id`.
- **Current state:** The schema supports a ticket-linked moderation discussion but does not require every Moderation Ticket to have one. It also does not store a backward discussion identifier on `Moderation Ticket`, so zero or multiple linked discussions are structurally possible.
- **Requirement context:** Reviewers may open a related confidential conversation, but the requirements explicitly leave open whether that discussion is required for every ticket, optional on request, or deferred from the POC.
- **Direct question:** Choose one POC policy: **A)** exactly one discussion for every ticket, **B)** zero or one discussion created on reviewer request, or **C)** no moderation discussions in the POC.
- **Why it matters:** The choice controls whether ticket creation must also create a conversation and whether the application must prevent multiple discussions from pointing to the same ticket.
- **Decision unlocked:** The answer defines the relationship count between Moderation Ticket and moderation-discussion Conversation and the corresponding application invariant.

### Q-11 — Who may join a confidential moderation discussion

- **Affected schema item:** `docs/schemas/conversation.yaml`, object `Conversation`, fields `purpose`, `visibility`, `matchingMode`, and `moderationTicketId`; related `docs/schemas/membership.yaml`, object `Membership`, relationship to the source ticket's `conversationId`.
- **Current state:** Agent 2 made every moderation discussion unlisted with `matchingMode: allTags`, but ordinary unlisted-conversation behavior still allows any non-banned identity that supplies all tags to join. “Unlisted” suppresses discovery; it does not itself authorize confidential access.
- **Requirement context:** A moderation discussion is described as private or confidential and appears in participating administrators' conversation lists, but no invitation or access-list model is defined.
- **Direct question:** Should joining use **A)** explicit addition limited to active owners and administrators of the ticket's source conversation, or **B)** the normal unlisted all-tag join flow?
- **Why it matters:** Under option B, someone who learns the complete tag set could join sensitive moderation work even though the discussion never appears in search.
- **Decision unlocked:** The answer determines whether the dictionary needs a moderator-eligibility invariant and an explicit-add join path for `purpose: moderationDiscussion`.

## Emoji reactions

### Q-12 — Supported emoji representation

- **Affected schema item:** `docs/schemas/emoji-reaction.yaml`, object `Emoji Reaction`, field `emoji`.
- **Current state:** `Emoji Reaction.emoji` accepts any string from 1 to 64 characters. The application could therefore store a Unicode emoji, an emoji sequence, or an arbitrary textual reaction code without a consistent interpretation.
- **Requirement context:** Reactions should behave similarly to Slack reactions, but the supported emoji set remains explicitly unresolved.
- **Direct question:** Should `Emoji Reaction.emoji` store **A)** any valid Unicode emoji sequence, or **B)** a code from a fixed POC allowlist?
- **Why it matters:** The choice controls input validation, rendering consistency, and whether clients can introduce reaction values that other clients do not understand.
- **Decision unlocked:** The answer determines whether the field needs Unicode-emoji validation outside JSON Schema or a documented enum/allowlist of reaction codes.

### Q-13 — Number of active reactions per identity and message

- **Affected schema item:** `docs/schemas/emoji-reaction.yaml`, object `Emoji Reaction`, fields `messageId`, `identityId`, `emoji`, and `removedAt`; `docs/schemas/DICTIONARY.md`, `Emoji reactions` invariant.
- **Current state:** No active uniqueness rule exists. The application can create duplicate active rows for the same `(messageId, identityId, emoji)` and can also store several different emojis from one identity on one message.
- **Requirement context:** A reaction belongs to the message and reacting identity, but whether one identity may add multiple reactions to one message is explicitly unresolved.
- **Direct question:** Choose one rule: **A)** one active reaction total per `(messageId, identityId)`, or **B)** one active reaction per `(messageId, identityId, emoji)`, allowing the identity to use several different emojis.
- **Why it matters:** Without a rule, retries can create duplicate counts; the stricter option may instead block an intended multi-reaction experience.
- **Decision unlocked:** The answer defines the DynamoDB key or conditional-write invariant for active Emoji Reaction records and the toggle behavior when a user selects an existing reaction.

## Archived conversations

### Q-14 — Search, read, write, and join behavior after archival

- **Affected schema item:** `docs/schemas/conversation.yaml`, object `Conversation`, field `status: archived`; relationships to `Message`, `Membership`, and `Conversation Tag` in `docs/schemas/DICTIONARY.md`.
- **Current state:** An archived Conversation now has consistent `archivedAt` and `archivedById` metadata, and all related records remain stored. No rule says whether it remains searchable, readable, writable, or joinable, so different routes could apply different behavior.
- **Requirement context:** Archival replaces hard deletion and retains messages, memberships, tags, and moderation history. The requirements explicitly leave archived search and participant-view behavior unresolved.
- **Direct question:** Should the POC use this policy: archived conversations are excluded from all discovery, remain readable to identities that were members at archival time, are read-only for everyone, and accept no new joins? Answer **yes** or **no**.
- **Why it matters:** A single policy prevents one API path from accepting a new message or membership while another presents the same conversation as inactive.
- **Decision unlocked:** A **yes** answer defines the archive authorization and query invariants without adding fields. A **no** answer requires the product owner to identify which of search, prior-member reading, posting, reacting, moderation, or joining remains allowed.

## Items resolved without a question

Agent 2 fully resolved the requirements-backed recommendations below, so no product answer is needed for those decisions:

- **Cross-record integrity:** `SR-01` documents one-to-ten active Conversation Tags and unique active tags and positions; `SR-02` protects the final active owner; `SR-06` defines valid non-overlapping Membership Role Periods; `SR-10` links each Moderation Ticket to the correct Message and eligible reporter and requires a unique ticket number; `SR-11` links Emoji Reaction to the correct Conversation and active member; `SR-12` links Posting Suspension to its Membership and defines its time-derived state; and `SR-13` restricts Bot Credential use to active bot identities and valid expiration windows.
- **Per-record lifecycle and audit consistency:** `SR-03` makes moderation discussions unlisted and ticket-linked; `SR-04` pairs archived status with archive actor and time; `SR-05` removes current roles from left and removed Membership records; `SR-07` pairs Conversation Tag removal actor and time; `SR-08` pairs Message deletion actor and time and documents deletion authority; `SR-09` requires suspension actions to identify their Posting Suspension; and `SR-14` requires role details for Membership Event transitions.
- **Requirements-backed simplification:** `SC-01` removes redundant `Tag.kind`; `SC-02` removes derived `Posting Suspension.status`; `SC-03` removes the misleading single `Message.moderationTicketId`; `SC-04` makes Membership Event and Moderation Action append-only by removing `updatedAt`; and `SC-05` removes the undefined `Identity.deletedAt` lifecycle.

These resolved decisions still require application enforcement where the dictionary says a rule spans multiple records, but that implementation responsibility does not create another schema product question.
