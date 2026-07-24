# User Types

## Summary

Tawk has no anonymous participant. Every actor is either an identified person using the private application or a token-authenticated bot using the same conversation membership model. Within each conversation, a person or bot acts as an owner, administrator, or ordinary member; these role-based user types overlap the identity types because either kind of identity can hold any supported conversation role.

## User Types

### Identified Person

- **Access:** Private, external, human.
- **Role:** A signed-in human who discovers or joins conversations and participates under a visible profile.
- **What makes this user type distinct:** An identified person uses the human authentication mechanism selected for the POC and directly interacts with Tawk. Unlike a bot, this actor is human-operated; the person's authority in any particular conversation still depends on whether they are an owner, administrator, or ordinary member there.

#### Abilities

- **Use an identified profile:** Sign in and participate under a required display name so conversation activity is attributable to a visible person rather than an anonymous visitor.
- **Discover and join listed conversations:** Search with eligible tags, review identifiable listed matches, and join a matching conversation when not banned.
- **Join known unlisted conversations:** Supply the complete tag combination for an unlisted conversation and join it without the application exposing hidden conversation identities or private-only tags during discovery.
- **Create tagged conversations:** Create a listed or unlisted conversation with one to ten tags, choose the supported listed matching behavior, and become its first owner.
- **Participate according to conversation role:** Use the abilities of an ordinary member, administrator, or owner in each conversation according to the person's current role there.

### Bot Participant

- **Access:** Private, external, non-human.
- **Role:** An automated identity that authenticates with a token and creates, joins, or participates in conversations.
- **What makes this user type distinct:** A bot is distinguished by token-based authentication and automated operation, not by a separate permission model. Once it has joined a conversation, it can hold the same owner, administrator, or ordinary-member role as a person.

#### Abilities

- **Authenticate as an identified bot:** Access Tawk with a valid token and act under a visible bot profile rather than anonymously.
- **Find and join tagged conversations:** Use the same listed and unlisted tag-matching rules as people to locate or enter conversations when not banned.
- **Create tagged conversations:** Create a listed or unlisted conversation with one to ten tags, choose the supported listed matching behavior, and become its first owner.
- **Participate according to conversation role:** Use the same ordinary-member, administrator, or owner abilities as a person according to the bot's current role in each conversation.

### Conversation Owner

- **Access:** Private, trusted, human or non-human.
- **Role:** The identity ultimately responsible for governing a particular conversation.
- **What makes this user type distinct:** An owner can manage tags, participants, roles, moderation, and archival, including promoting another member to owner or administrator. Owners alone carry the continuity obligation that a conversation must retain at least one owner, and they have authority over owner membership that administrators do not.

#### Abilities

- **Manage conversation tags:** Add and remove tags while keeping the conversation within the required one-to-ten-tag boundary.
- **Govern roles and ownership:** Promote members to owner or administrator, manage owner membership, and preserve at least one active owner before leaving unless the conversation is archived.
- **Manage participants:** Review active and former membership, remove or ban participants, and restore banned participants.
- **Moderate conversation conduct:** Review flagged-message tickets, record relevant notes or use a linked private moderation discussion, delete messages, and apply or lift time-bounded posting suspensions.
- **Archive the conversation:** End active use of the conversation without physically deleting its retained messages, memberships, tags, tickets, or history.
- **Participate in the conversation:** Exchange messages, delete permitted messages, react, add notes, flag content, and leave when the ownership-continuity rule permits it.

### Conversation Administrator

- **Access:** Private, trusted, human or non-human.
- **Role:** A delegated operator who manages and moderates a particular conversation without controlling its owners.
- **What makes this user type distinct:** An administrator can manage tags and participants, review reports, delete messages, and apply posting restrictions. Unlike an owner, an administrator cannot add, remove, or otherwise alter owners and does not control conversation archival.

#### Abilities

- **Manage conversation tags:** Add and remove tags while keeping the conversation within the required one-to-ten-tag boundary.
- **Manage non-owner participants:** Review active and former membership, remove or ban participants, and restore banned participants without adding, removing, or altering owners.
- **Moderate conversation conduct:** Review flagged-message tickets, record relevant notes or use a linked private moderation discussion, delete messages, and apply or lift time-bounded posting suspensions.
- **Participate in the conversation:** Exchange messages, delete permitted messages, react, add notes, flag content, and leave without exercising owner-only authority.

### Ordinary Member

- **Access:** Private, external, human or non-human.
- **Role:** An active conversation participant without conversation-management authority.
- **What makes this user type distinct:** An ordinary member takes part in conversation activity and can manage only their own participation and permitted content. Unlike owners and administrators, this user type cannot change tags or roles, manage other participants, or perform moderator actions.

#### Abilities

- **Exchange messages:** Read and post messages in active conversations and delete the member's own messages while retained history remains intact.
- **React to messages:** Add emoji reactions to visible messages as an active participant.
- **Add contextual notes:** Attach notes to conversations or messages within the supported visibility model.
- **Report concerning content:** Flag a message with an explanatory reason so owners and administrators can review it through a numbered moderation ticket.
- **Manage own participation:** Leave a conversation while existing undeleted messages remain attributable to the member's identity.
