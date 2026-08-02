# App Structure

## Summary

Tawk is a mixed-access product with a small public home that explains the service and starts human authentication, followed by protected areas for identified participation. The private product separates general conversation discovery, live conversation participation, durable conversation administration, confidential moderation work, and token-authenticated bot access because those jobs have materially different audiences and trust boundaries.

## Application Areas

### Product Home

- **Access:** `Public`
- **Primary users:** Person, before authentication.
- **Purpose:** Introduce Tawk's tag-based conversation model and direct people into supported authentication before they discover, join, create, or participate in conversations.
- **Why this area is separate:** Tawk needs one proportional unauthenticated product surface, while all conversation identities, search results, and participation remain behind authentication. It should not be duplicated as a landing area for each private part of the product.
- **Day-one scope:** Explain listed and unlisted conversations at a high level, make the identified-participation requirement clear, and provide entry into OIDC or passwordless-email authentication.

### Conversation Hub

- **Access:** `Private`
- **Primary users:** Person, including people acting as Conversation Owner, Conversation Administrator, or Ordinary Member.
- **Purpose:** Give authenticated people one place to discover eligible conversations, join by tags, create conversations, and return to conversations associated with their identity.
- **Why this area is separate:** Finding or starting a conversation is a cross-conversation job, distinct from participating inside one conversation or operating its privileged controls. Combining discovery with a live conversation would obscure the privacy boundary around unlisted results and make movement among conversations harder to understand.
- **Day-one scope:** Support listed-conversation tag search, privacy-preserving exact-tag joining for unlisted conversations, conversation creation with required metadata and discovery settings, current conversation access, conversation-list entry points to moderation discussions for eligible reviewers, archived-conversation visibility where required, and basic profile context for the signed-in identity.

### Conversation Space

- **Access:** `Private`
- **Primary users:** Person and Bot acting as Conversation Owner, Conversation Administrator, or Ordinary Member.
- **Purpose:** Support active participation within one conversation under its current membership and role rules.
- **Why this area is separate:** Persistent messaging, threads, reactions, notes, and reporting form a focused shared context that should not be mixed with cross-conversation discovery or privileged administration. Keeping this boundary explicit also makes the effects of leaving, suspension, banning, and archival understandable.
- **Day-one scope:** Provide the retained conversation context for active members, including messages and threads, standard and conversation-scoped custom emoji reactions, permitted contextual notes, message deletion within role authority, message flagging with an explanation, active-member context, and leaving the conversation. Hide or withhold content when ticket, membership, ban, suspension, deletion, or archival rules require it.

### Conversation Administration

- **Access:** `Private`
- **Primary users:** Conversation Owner and Conversation Administrator.
- **Purpose:** Manage the durable configuration, membership, role, and lifecycle controls for a conversation.
- **Why this area is separate:** These protected controls can alter access and conversation continuity and therefore should not compete with ordinary participation. This area is also distinct from ticket review, which is confidential case work with its own lifecycle and evidence.
- **Day-one scope:** Support permitted tag changes, participant and former-member management, removal, banning and restoration, owner and administrator assignments within each role's authority, posting restrictions, conversation-scoped custom emoji administration, owner-controlled top-level note availability, and owner-only archival. Enforce the requirement that every active conversation retains an owner.

### Moderation Center

- **Access:** `Private`
- **Primary users:** Conversation Owner and Conversation Administrator.
- **Purpose:** Review reported messages through confidential, conversation-scoped moderation cases and record terminal decisions and related actions.
- **Why this area is separate:** Moderation tickets have restricted visibility, distinct statuses, private discussions, and consequences that differ from routine conversation administration. A dedicated area keeps reporters' identities and case discussions away from ordinary conversation participants while preserving a coherent review workflow.
- **Day-one scope:** Provide access to eligible numbered tickets, each ticket's required confidential discussion and moderator notes, status progression, message and thread hold state, warnings, posting suspensions and participant actions taken during review, and terminal keep-message or remove-message dispositions. Preserve the independence of simultaneous tickets for the same message and the privacy of their reporters.

### Bot Access

- **Access:** `Private`
- **Primary users:** Bot, including bots acting as Conversation Owner, Conversation Administrator, or Ordinary Member.
- **Purpose:** Let identified automated actors perform supported Tawk activities through token-authenticated programmatic access while following the same conversation roles and rules as people.
- **Why this area is separate:** Bots require a non-human interaction boundary and token credentials rather than the human application and its email-based authentication. Separating the access surface must not create a separate permission model or bypass conversation membership controls.
- **Day-one scope:** Support bot authentication and the bot-relevant forms of conversation creation, tag-based discovery and joining, messaging, reactions, notes, reporting, membership, role-authorized administration, moderation, and archival. Keep bot identity visible and apply the same listed, unlisted, ban, suspension, ownership, and retention constraints used for people.
