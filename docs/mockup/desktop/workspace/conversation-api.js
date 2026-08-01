/**
 * Mock API for the conversation workspace.
 *
 * Stands in for the endpoints that read one conversation and its visible
 * message history, list the participants who can be addressed in it, and post,
 * delete, react to, note, and flag messages. Mutations update an in-memory
 * working copy for the prototype session only; nothing is written back to the
 * JSON file on disk.
 *
 * A message carries its mentions as plain `@handle` text. The server resolves
 * each handle against the conversation's active participants, so an unknown or
 * departed handle stays ordinary text rather than becoming a mention.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'conversation-data.json';
  var SESSION_KEY = 'tawk.createdConversations';
  var _fileData = null;
  var _nextTicketNumber = 1051;

  function copy(value) {
    return value === undefined || value === null ? value : JSON.parse(JSON.stringify(value));
  }

  function save(next) {
    _fileData = next;
  }

  async function file() {
    if (!_fileData) {
      var response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error('Unable to load ' + DATA_URL + ' (' + response.status + ')');
      }
      _fileData = await response.json();
      sessionConversations().forEach(function (conversation) {
        if (!find(_fileData, conversation.id)) {
          conversation.participants = [_fileData.identity.id];
          _fileData.conversations.push(conversation);
        }
      });
    }
    return _fileData;
  }

  function sessionConversations() {
    try {
      var stored = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '[]');
      return stored.map(function (conversation) {
        return {
          id: conversation.id,
          name: conversation.name,
          topic: conversation.topic,
          tags: conversation.tags,
          listed: conversation.listed,
          matching: conversation.matching,
          kind: conversation.kind || 'conversation',
          linkedTicket: conversation.linkedTicket,
          myRole: 'owner',
          otherOwnerCount: 0,
          memberCount: 1,
          canPost: true,
          messages: []
        };
      });
    } catch (error) {
      return [];
    }
  }

  function find(data, conversationId) {
    return data.conversations.filter(function (item) { return item.id === conversationId; })[0] || null;
  }

  var MENTION_PATTERN = /(^|[^\w-])@([a-z0-9]+(?:-[a-z0-9]+)*)/g;

  function participantsOf(data, conversation) {
    return (conversation.participants || [])
      .map(function (identityId) { return data.identities[identityId]; })
      .filter(Boolean);
  }

  function resolveMentions(data, conversation, text) {
    var addressable = participantsOf(data, conversation);
    var found = [];
    var seen = {};
    String(text || '').replace(MENTION_PATTERN, function (whole, before, handle) {
      var who = addressable.filter(function (item) { return item.handle === handle; })[0];
      if (who && !seen[handle]) {
        seen[handle] = true;
        found.push({
          handle: who.handle,
          identityId: who.id,
          displayName: who.displayName,
          type: who.type
        });
      }
      return whole;
    });
    return found;
  }

  function decorate(data, message, conversation) {
    var author = data.identities[message.authorId] || {
      id: message.authorId,
      displayName: 'Unknown identity',
      initials: '??',
      type: 'person',
      standing: 'former'
    };
    var result = copy(message);
    result.author = copy(author);
    result.isMine = message.authorId === data.identity.id;
    result.mentions = conversation ? resolveMentions(data, conversation, message.text) : [];
    result.mentionsMe = result.mentions.some(function (mention) {
      return mention.identityId === data.identity.id;
    });
    result.reactions = (message.reactions || []).map(function (reaction) {
      return {
        emoji: reaction.emoji,
        count: reaction.identityIds.length,
        mine: reaction.identityIds.indexOf(data.identity.id) !== -1,
        names: reaction.identityIds.map(function (identityId) {
          return (data.identities[identityId] || {}).displayName || 'Unknown';
        })
      };
    });
    return result;
  }

  /**
   * Retrieve the identity reading the conversation.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * Retrieve one conversation's settings, tags, and the reader's role in it.
   * @param {string} conversationId - Conversation to open.
   * @returns {Promise<object|null>} Conversation summary, or null when it is unavailable.
   */
  async function getConversation(conversationId) {
    var data = await file();
    var conversation = find(data, conversationId);
    if (!conversation) { return null; }
    var summary = copy(conversation);
    delete summary.messages;
    return summary;
  }

  /**
   * Retrieve the visible message history for a conversation, oldest first.
   * Soft-deleted messages are omitted entirely rather than replaced by a placeholder.
   * @param {string} conversationId - Conversation whose history is being read.
   * @returns {Promise<Array<object>>} Messages with author, reactions, and any attached note.
   */
  async function getConversationMessages(conversationId) {
    var data = await file();
    var conversation = find(data, conversationId);
    if (!conversation) { return []; }
    return conversation.messages
      .filter(function (message) { return !message.deleted; })
      .map(function (message) { return decorate(data, message, conversation); });
  }

  /**
   * List the identities that can be addressed in a conversation.
   * Only active participants are returned; an identity that has left, been
   * removed, or been banned can no longer be mentioned.
   * @param {string} conversationId - Conversation whose participants are being read.
   * @returns {Promise<Array<object>>} Participants with display name, handle, and identity type.
   */
  async function getConversationParticipants(conversationId) {
    var data = await file();
    var conversation = find(data, conversationId);
    if (!conversation) { return []; }
    return copy(participantsOf(data, conversation)).sort(function (left, right) {
      return left.displayName.localeCompare(right.displayName);
    });
  }

  /**
   * Retrieve the emoji offered by the reaction picker.
   * @returns {Promise<Array<string>>} Supported emoji in display order.
   */
  async function getReactionPalette() {
    var data = await file();
    return copy(data.reactionPalette);
  }

  /**
   * Post a message to a conversation as the signed-in identity.
   * Any `@handle` in the body is resolved against the conversation's active
   * participants and returned on the message as a resolved mention.
   * @param {string} conversationId - Conversation receiving the message.
   * @param {string} text - Message body as typed, mentions included inline.
   * @returns {Promise<object>} The stored message, decorated with author and mentions.
   */
  async function postMessage(conversationId, text) {
    var data = await file();
    var body = String(text || '').trim();
    if (!body) {
      throw new Error('A message cannot be empty.');
    }
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) {
      throw new Error('Conversation ' + conversationId + ' is not available.');
    }
    var now = new Date();
    var message = {
      id: 'm-' + now.getTime(),
      authorId: tmp.identity.id,
      at: now.toISOString(),
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      text: body,
      reactions: []
    };
    conversation.messages.push(message);
    save(tmp);
    return decorate(tmp, message, conversation);
  }

  /**
   * Soft-delete a message so it no longer appears in the conversation.
   * The author may delete their own message; owners and administrators may
   * delete any message as a moderation action.
   * @param {string} conversationId - Conversation containing the message.
   * @param {string} messageId - Message to remove from view.
   * @returns {Promise<object>} Deletion outcome, with a reason when refused.
   */
  async function deleteMessage(conversationId, messageId) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var message = conversation
      ? conversation.messages.filter(function (item) { return item.id === messageId; })[0]
      : null;
    if (!message) {
      return { deleted: false, reason: 'That message is no longer available.' };
    }
    var isMine = message.authorId === tmp.identity.id;
    var isModerator = conversation.myRole === 'owner' || conversation.myRole === 'administrator';
    if (!isMine && !isModerator) {
      return { deleted: false, reason: 'Only the author, an owner, or an administrator can delete this message.' };
    }
    message.deleted = true;
    save(tmp);
    return { deleted: true, messageId: messageId, asModerator: !isMine };
  }

  /**
   * Add or withdraw the signed-in identity's emoji reaction on a message.
   * @param {string} conversationId - Conversation containing the message.
   * @param {string} messageId - Message being reacted to.
   * @param {string} emoji - Emoji applied or withdrawn.
   * @returns {Promise<object>} The message's reactions after the change.
   */
  async function toggleMessageReaction(conversationId, messageId, emoji) {
    var data = await file();
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    var message = conversation
      ? conversation.messages.filter(function (item) { return item.id === messageId; })[0]
      : null;
    if (!message) {
      throw new Error('That message is no longer available.');
    }
    var reaction = (message.reactions || []).filter(function (item) { return item.emoji === emoji; })[0];
    if (!reaction) {
      reaction = { emoji: emoji, identityIds: [] };
      message.reactions.push(reaction);
    }
    var position = reaction.identityIds.indexOf(tmp.identity.id);
    if (position === -1) {
      reaction.identityIds.push(tmp.identity.id);
    } else {
      reaction.identityIds.splice(position, 1);
    }
    message.reactions = message.reactions.filter(function (item) { return item.identityIds.length > 0; });
    save(tmp);
    return decorate(tmp, message, conversation);
  }

  /**
   * Flag a message and open a numbered moderation ticket for its reviewers.
   * @param {string} conversationId - Conversation containing the reported message.
   * @param {string} messageId - Message being reported.
   * @param {string} reason - Reporter's explanation of the problem.
   * @returns {Promise<object>} The created ticket number and the message it concerns.
   */
  async function flagMessage(conversationId, messageId, reason) {
    var data = await file();
    var explanation = String(reason || '').trim();
    if (!explanation) {
      return { flagged: false, reason: 'Describe what is wrong with the message so a reviewer can act on it.' };
    }
    var conversation = find(data, conversationId);
    var message = conversation
      ? conversation.messages.filter(function (item) { return item.id === messageId; })[0]
      : null;
    if (!message) {
      return { flagged: false, reason: 'That message is no longer available.' };
    }
    var ticketNumber = _nextTicketNumber;
    _nextTicketNumber = _nextTicketNumber + 1;
    return {
      flagged: true,
      ticketNumber: ticketNumber,
      messageId: messageId,
      conversationId: conversationId
    };
  }

  /**
   * Attach a note to a message, or to the conversation when no message is given.
   * @param {string} conversationId - Conversation the note belongs to.
   * @param {object} noteData - Note payload: optional messageId and required body.
   * @returns {Promise<object>} The stored note as it will be displayed.
   */
  async function addNote(conversationId, noteData) {
    var data = await file();
    var body = String((noteData && noteData.body) || '').trim();
    if (!body) {
      return { saved: false, reason: 'A note needs some text.' };
    }
    var tmp = copy(data);
    var conversation = find(tmp, conversationId);
    if (!conversation) {
      return { saved: false, reason: 'That conversation is no longer available.' };
    }
    var note = {
      authorId: tmp.identity.id,
      authorName: tmp.identity.displayName,
      body: body
    };
    if (noteData && noteData.messageId) {
      var message = conversation.messages.filter(function (item) { return item.id === noteData.messageId; })[0];
      if (!message) {
        return { saved: false, reason: 'That message is no longer available.' };
      }
      message.note = note;
    } else {
      conversation.note = note;
    }
    save(tmp);
    return { saved: true, note: copy(note), messageId: (noteData && noteData.messageId) || null };
  }

  /**
   * End the signed-in identity's membership in a conversation.
   * Refused while the identity is the conversation's only remaining owner.
   * @param {string} conversationId - Conversation being left.
   * @returns {Promise<object>} Departure outcome, with a reason when refused.
   */
  async function leaveConversation(conversationId) {
    var data = await file();
    var conversation = find(data, conversationId);
    if (!conversation) {
      return { left: false, reason: 'That conversation is no longer available.' };
    }
    if (conversation.myRole === 'owner' && conversation.otherOwnerCount === 0) {
      return {
        left: false,
        reason: 'You are the only owner. Promote another member to owner, or archive the conversation instead.'
      };
    }
    var tmp = copy(data);
    tmp.conversations = tmp.conversations.filter(function (item) { return item.id !== conversationId; });
    save(tmp);
    return { left: true, conversationId: conversationId };
  }

  global.ConversationApi = {
    getSignedInIdentity: getSignedInIdentity,
    getConversation: getConversation,
    getConversationMessages: getConversationMessages,
    getConversationParticipants: getConversationParticipants,
    getReactionPalette: getReactionPalette,
    postMessage: postMessage,
    deleteMessage: deleteMessage,
    toggleMessageReaction: toggleMessageReaction,
    flagMessage: flagMessage,
    addNote: addNote,
    leaveConversation: leaveConversation
  };
})(window);
