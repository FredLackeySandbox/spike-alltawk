# User Types

## Summary

Tawk has two identified actor classes: people and bots. Active participants in either class hold one of three conversation-scoped roles: owner, administrator, or ordinary member. These dimensions overlap rather than form five mutually exclusive categories. Owner and administrator trust applies only within the conversation where the role is assigned; anonymous participation and an application-wide administrative user type are not part of the MVP.

## User Types

### Person

- **Access:** Private, external, human.
- **Role:** Uses Tawk through a verified OIDC or passwordless-email identity and participates in conversations under an assigned conversation role.
- **What makes this user type distinct:** A person has a human profile and verified email-based authentication connections. Unlike a bot, a person uses human sign-in methods, while authority inside each conversation still comes from the same owner, administrator, or member role model.

#### Abilities

- **Authenticate as an identified person:** Sign in through OIDC or passwordless email and retain one Tawk identity across linked verified email-based authentication connections.
- **Present a recognizable profile:** Participate under a required display name with available name, profile image, and other supported identity-provider attributes.

### Bot

- **Access:** Private, external, non-human.
- **Role:** Uses a token-authenticated identity to create, join, and participate in conversations under an assigned conversation role.
- **What makes this user type distinct:** A bot is an automated actor with revocable token credentials rather than human authentication. It receives no special conversation permissions and can hold the same owner, administrator, or member roles as a person.

#### Abilities

- **Authenticate as an identified bot:** Access Tawk through token credentials under a persistent, named bot identity.
- **Present a recognizable bot profile:** Participate under a required display name while using the same conversation-role boundaries as people.

### Conversation Owner

- **Access:** Private, trusted within an assigned conversation, human or non-human.
- **Role:** Holds ultimate responsibility for an active conversation, including its continuity, membership leadership, and archival.
- **What makes this user type distinct:** An owner is the only conversation role that can create or alter other owners, and every active conversation must retain at least one. The role may be held by either an identified person or a bot.

#### Abilities

- **Create and configure a conversation:** Create a titled and described conversation with its initial tags, discovery mode, and listed-conversation matching behavior, then maintain its tags and top-level note availability.
- **Govern privileged roles and continuity:** Promote members to owner or administrator, change those assignments within the owner's authority, and ensure an active conversation always retains at least one owner.
- **Operate and moderate the conversation:** Manage participant access, reported content, posting restrictions, conversation-scoped custom emoji, and confidential ticket discussions using the full moderation authority defined for the conversation.
- **Participate as an active member:** Use the baseline messaging, reaction, note, reporting, and membership capabilities available to active conversation participants.
- **Archive the conversation:** End active use when appropriate while preserving the conversation and its retained history.

### Conversation Administrator

- **Access:** Private, trusted within an assigned conversation, human or non-human.
- **Role:** Helps operate and moderate a conversation without controlling ownership.
- **What makes this user type distinct:** An administrator can manage tags, participants, reported content, and posting restrictions, but cannot add, remove, or otherwise alter owners. The role may be held by either an identified person or a bot.

#### Abilities

- **Maintain conversation organization:** Add or remove conversation tags and provide conversation-scoped custom emoji without changing ownership.
- **Manage participant access:** Remove, ban, or restore participants and apply or lift time-limited posting restrictions while leaving owner assignments untouched.
- **Review and resolve reported content:** Review tickets in their confidential discussions, warn the reporter or message author when warranted, and close each ticket with a keep-message or remove-message decision.
- **Participate as an active member:** Use the baseline messaging, reaction, note, reporting, and membership capabilities available to active conversation participants.

### Ordinary Member

- **Access:** Private, external, human or non-human.
- **Role:** Participates in a conversation without conversation-management authority.
- **What makes this user type distinct:** An ordinary member communicates, reacts, takes notes, and reports concerns but cannot manage tags, roles, or other participants. The role may be held by either an identified person or a bot.

#### Abilities

- **Discover and join conversations:** Find listed conversations through tag search, join an unlisted conversation by supplying its exact complete tag set, and join immediately when eligible.
- **Manage personal membership:** Leave and later rejoin a conversation when eligible, while remaining unable to join or participate when banned or when the conversation is archived.
- **Exchange messages and reactions:** Read and post conversation messages and threaded replies, delete one's own messages, and add or remove standard or available custom emoji reactions.
- **Keep contextual notes:** Add notes to allowed conversation, thread, or message contexts and choose or change among the audiences permitted for that context.
- **Report concerning content:** Flag a message with an explanation so it receives its own numbered moderation ticket without exposing other reporters.
