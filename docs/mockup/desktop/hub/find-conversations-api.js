/**
 * Mock API for tag-based conversation discovery.
 *
 * Stands in for the search endpoints that suggest eligible tags, return
 * identifiable listed conversations, report non-identifying hidden-match counts
 * for unlisted conversations, and record a new membership on join.
 *
 * Tag suggestions are derived from listed conversations only, so a tag that
 * exists solely on unlisted conversations can never leak through completion.
 * Unlisted conversations are stored here with their tags alone and carry no name
 * or topic, so there is nothing for the discovery surface to disclose even by
 * accident.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'find-conversations-data.json';
  var _fileData = null;

  function copy(value) {
    return value === undefined || value === null ? value : JSON.parse(JSON.stringify(value));
  }

  function normalise(tag) {
    return String(tag || '').trim().toLowerCase();
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
    }
    return _fileData;
  }

  /**
   * Retrieve the identity of the signed-in person performing the search.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * Retrieve the tags offered as a starting point on an empty search.
   * @returns {Promise<Array<string>>} Suggested opening tags.
   */
  async function getStarterTags() {
    var data = await file();
    return copy(data.starterTags);
  }

  /**
   * Suggest tags eligible for discovery that begin with or contain the fragment.
   * Only tags carried by at least one listed conversation are eligible.
   * @param {string} fragment - Partial tag text the user has typed.
   * @param {Array<string>} excluded - Tags already present in the filter.
   * @returns {Promise<Array<object>>} Eligible tag values with listed-conversation counts.
   */
  async function suggestTags(fragment, excluded) {
    var data = await file();
    var typed = normalise(fragment);
    var skip = (excluded || []).map(normalise);
    var counts = {};

    data.listedConversations.forEach(function (conversation) {
      conversation.tags.forEach(function (tag) {
        var key = normalise(tag);
        counts[key] = (counts[key] || 0) + 1;
      });
    });

    return Object.keys(counts)
      .filter(function (tag) { return skip.indexOf(tag) === -1; })
      .filter(function (tag) { return typed === '' ? false : tag.indexOf(typed) !== -1; })
      .sort(function (left, right) {
        var leftStarts = left.indexOf(typed) === 0 ? 0 : 1;
        var rightStarts = right.indexOf(typed) === 0 ? 0 : 1;
        return leftStarts - rightStarts || left.localeCompare(right);
      })
      .slice(0, 7)
      .map(function (tag) {
        return { value: tag, listedConversationCount: counts[tag] };
      });
  }

  /**
   * Search listed conversations that match the supplied tag filter.
   * Inclusive conversations match on any shared tag; exclusive conversations
   * match only when every one of their tags is present in the filter.
   * @param {Array<string>} tags - Tags currently in the search filter.
   * @returns {Promise<Array<object>>} Identifiable listed results with match details.
   */
  async function searchListedConversations(tags) {
    var data = await file();
    var filter = (tags || []).map(normalise);
    if (!filter.length) {
      return [];
    }

    return data.listedConversations
      .map(function (conversation) {
        var conversationTags = conversation.tags.map(normalise);
        var matched = conversationTags.filter(function (tag) { return filter.indexOf(tag) !== -1; });
        var isMatch = conversation.matching === 'exclusive'
          ? matched.length === conversationTags.length
          : matched.length > 0;
        if (!isMatch) {
          return null;
        }
        var result = copy(conversation);
        result.matchedTags = matched;
        result.matchedAllTags = matched.length === conversationTags.length;
        return result;
      })
      .filter(Boolean)
      .sort(function (left, right) {
        return right.matchedTags.length - left.matchedTags.length
          || right.memberCount - left.memberCount;
      });
  }

  /**
   * Report how many unlisted conversations remain consistent with the filter.
   * The response never carries a hidden conversation's name, topic, or tags, and
   * only discloses an identifier once the filter covers every tag of exactly one
   * hidden conversation, which is the point at which joining becomes possible.
   * @param {Array<string>} tags - Tags currently in the search filter.
   * @returns {Promise<object>} Hidden match count and, when resolved, a joinable identifier.
   */
  async function getHiddenMatchSummary(tags) {
    var data = await file();
    var filter = (tags || []).map(normalise);
    if (!filter.length) {
      return { count: 0, joinable: false, conversationId: null };
    }

    var consistent = data.unlistedConversations.filter(function (conversation) {
      var conversationTags = conversation.tags.map(normalise);
      return filter.every(function (tag) { return conversationTags.indexOf(tag) !== -1; });
    });

    var fullyMatched = consistent.filter(function (conversation) {
      return conversation.tags.every(function (tag) { return filter.indexOf(normalise(tag)) !== -1; });
    });

    var resolved = consistent.length === 1 && fullyMatched.length === 1;
    return {
      count: consistent.length,
      joinable: resolved,
      conversationId: resolved ? fullyMatched[0].id : null
    };
  }

  /**
   * Record an active membership for the signed-in identity in a conversation.
   * Rejects the join when the identity is banned from that conversation.
   * Updates the in-memory working copy for the prototype session only.
   * @param {string} conversationId - Conversation the identity is joining.
   * @returns {Promise<object>} Join outcome with the conversation identifier or a refusal reason.
   */
  async function joinConversation(conversationId) {
    var data = await file();
    var tmp = copy(data);

    if ((tmp.bannedFromConversations || []).indexOf(conversationId) !== -1) {
      var banned = tmp.listedConversations.filter(function (item) { return item.id === conversationId; })[0];
      return {
        joined: false,
        conversationId: conversationId,
        reason: (banned && banned.banReason) || 'You are banned from this conversation.'
      };
    }

    tmp.listedConversations.forEach(function (item) {
      if (item.id === conversationId) {
        item.alreadyJoined = true;
        item.memberCount = item.memberCount + 1;
      }
    });
    save(tmp);

    return { joined: true, conversationId: conversationId, role: 'member' };
  }

  global.FindConversationsApi = {
    getSignedInIdentity: getSignedInIdentity,
    getStarterTags: getStarterTags,
    suggestTags: suggestTags,
    searchListedConversations: searchListedConversations,
    getHiddenMatchSummary: getHiddenMatchSummary,
    joinConversation: joinConversation
  };
})(window);
