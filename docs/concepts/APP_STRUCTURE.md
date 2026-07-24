# App Structure

## Summary

Tawk is a mixed-access product with a small public home that explains the tag-based conversation model and routes people toward identified access. All conversation discovery, joining, participation, governance, moderation, and automated bot activity are private because Tawk does not support anonymous participation. The private product is divided by materially different jobs: finding or starting conversations, participating in them, governing them, reviewing reported content, and operating as a token-authenticated bot.

## Application Areas

### Product Home

- **Access:** `Public`
- **Primary users:** Identified Person.
- **Purpose:** Introduce Tawk's listed and unlisted tagged-conversation model and provide a clear entry into identified human access.
- **Why this area is separate:** This is the product's only unauthenticated explanation and routing surface. Keeping it separate prevents private conversation identities, tags, and participation controls from being exposed before authentication.
- **Day-one scope:** A concise explanation of Tawk, the difference between listed and unlisted conversations, the identified-participation requirement, and a path to the selected human authentication entry. It does not expose conversation search results, private-only tags, or participant activity.

### Conversation Hub

- **Access:** `Private`
- **Primary users:** Identified Person, Conversation Owner, Conversation Administrator, Ordinary Member.
- **Purpose:** Help signed-in people find listed conversations, enter known unlisted tag combinations, join eligible conversations, and create new tagged conversations.
- **Why this area is separate:** Discovery and creation are selection and setup jobs that precede active conversation participation. Combining them with the message-focused workspace would obscure both search privacy rules and the user's current conversation context.
- **Day-one scope:** Listed-conversation tag search and eligible tag suggestions, non-identifying hidden-match feedback for unlisted conversations, joining after the applicable tag and ban checks, and creation of listed or unlisted conversations with one to ten tags and the supported matching choice.

### Conversation Workspace

- **Access:** `Private`
- **Primary users:** Identified Person acting as Conversation Owner, Conversation Administrator, or Ordinary Member.
- **Purpose:** Provide the shared space where active members read and post messages, react, add contextual notes, flag concerning content, and manage their own permitted participation.
- **Why this area is separate:** Ongoing conversation is the product's primary collaborative work mode and should remain focused on participant activity. Governance and ticket review introduce privileged, operational responsibilities that do not belong in every member's workspace.
- **Day-one scope:** Visible conversation history, message posting, permitted message deletion, emoji reactions, conversation- or message-related notes within the eventual visibility rules, message flagging with explanatory text, and leaving a conversation when role constraints allow it. Retained or archived records remain governed by the documented visibility rules.

### Conversation Governance

- **Access:** `Private`
- **Primary users:** Conversation Owner, Conversation Administrator.
- **Purpose:** Let authorized participants maintain a conversation's tags, membership, roles, participant restrictions, and lifecycle.
- **Why this area is separate:** Governance changes access and authority for an entire conversation, so it needs a clear privileged boundary from ordinary participation. It remains distinct from moderation review because membership and conversation settings are broader operational responsibilities than resolving a reported message.
- **Day-one scope:** Tag maintenance within the one-to-ten-tag constraint; active and former member review; permitted role promotion; removal, banning, unbanning, and posting suspension; ownership-continuity enforcement; and owner-controlled archival. Administrator actions exclude altering owners or archiving the conversation.

### Moderation Review

- **Access:** `Private`
- **Primary users:** Conversation Owner, Conversation Administrator.
- **Purpose:** Give authorized reviewers a focused place to assess numbered message reports, retain review context, and take supported moderation action.
- **Why this area is separate:** Ticket review is a case-oriented, privileged job with its own evidence, notes, and outcomes. Separating it from general governance keeps reported-content decisions coherent without burdening ordinary conversation administration.
- **Day-one scope:** Access to reports for conversations the reviewer governs; the flagged message, reporting identity, explanation, and related context; review notes; an optional linked private moderation conversation if used; and supported outcomes such as message deletion, posting suspension, participant removal, or banning. The unresolved ticket-status model is not assumed.

### Bot Participation

- **Access:** `Private`
- **Primary users:** Bot Participant, including bots acting as Conversation Owner, Conversation Administrator, or Ordinary Member.
- **Purpose:** Allow authenticated automated identities to create, find, join, and participate in conversations under the same membership and role model as people.
- **Why this area is separate:** Bots authenticate and operate non-interactively, so their product entry and participation mode is materially different from the human-facing private areas. Their conversation permissions remain shared with people rather than being duplicated as a bot-specific role system.
- **Day-one scope:** Token-authenticated profile use, tagged conversation creation and matching, eligible joining, messaging and reactions, message flagging, and the owner or administrator actions granted by the bot's role in a conversation. It does not introduce separate bot permissions, public bot access, or a broader developer platform.
