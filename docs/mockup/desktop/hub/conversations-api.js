/**
 * Mock API for the signed-in person's conversation list.
 *
 * Stands in for the endpoints that return the current identity and the
 * conversations in which that identity holds an active membership.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'conversations-data.json';
  var _fileData = null;

  function copy(value) {
    return value === undefined || value === null ? value : JSON.parse(JSON.stringify(value));
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
   * Retrieve the identity of the signed-in person.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * List the conversations in which the signed-in identity is an active member.
   * Ordered most recently active first, as the upstream list endpoint would be.
   * @returns {Promise<Array<object>>} Conversation summaries including tags and current role.
   */
  async function getJoinedConversations() {
    var data = await file();
    var list = copy(data.conversations);
    list.sort(function (left, right) {
      return String(right.lastActivityAt).localeCompare(String(left.lastActivityAt));
    });
    return list;
  }

  global.ConversationsApi = {
    getSignedInIdentity: getSignedInIdentity,
    getJoinedConversations: getJoinedConversations
  };
})(window);
