/**
 * Mock API for bot identities.
 *
 * Stands in for the endpoints that list the operator's bot identities and their
 * conversation memberships, reveal or reissue a bot's authentication token, and
 * register a new bot identity. A bot's conversation permissions come from its
 * role in each conversation, exactly as they do for a person, so nothing here
 * grants or edits permissions.
 *
 * Mutations update an in-memory working copy for the prototype session only.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'bots-data.json';
  var _fileData = null;

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
    }
    return _fileData;
  }

  function mask(token) {
    return token.slice(0, 8) + '·'.repeat(12) + token.slice(-4);
  }

  function withoutToken(bot) {
    var result = copy(bot);
    result.tokenPreview = mask(bot.token);
    delete result.token;
    return result;
  }

  /**
   * Retrieve the identity operating these bots.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * List the operator's bot identities and where each one participates.
   * Tokens are returned masked; the full value requires an explicit reveal.
   * @returns {Promise<Array<object>>} Bot identities with memberships and masked tokens.
   */
  async function getBotIdentities() {
    var data = await file();
    return data.bots.map(withoutToken);
  }

  /**
   * Reveal a bot's full authentication token for copying.
   * @param {string} botId - Bot identity whose token is being revealed.
   * @returns {Promise<object>} The token value, or a reason it is unavailable.
   */
  async function revealBotToken(botId) {
    var data = await file();
    var bot = data.bots.filter(function (item) { return item.id === botId; })[0];
    if (!bot) { return { revealed: false, reason: 'That bot identity no longer exists.' }; }
    return { revealed: true, token: bot.token, issuedOn: bot.tokenIssuedOn };
  }

  /**
   * Issue a new authentication token for a bot, invalidating the previous one.
   * @param {string} botId - Bot identity being reissued.
   * @returns {Promise<object>} The replacement token, or a reason it was refused.
   */
  async function regenerateBotToken(botId) {
    var data = await file();
    var tmp = copy(data);
    var bot = tmp.bots.filter(function (item) { return item.id === botId; })[0];
    if (!bot) { return { regenerated: false, reason: 'That bot identity no longer exists.' }; }
    bot.token = 'twk_bot_' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 18);
    bot.tokenIssuedOn = 'Today';
    save(tmp);
    return { regenerated: true, token: bot.token, issuedOn: bot.tokenIssuedOn };
  }

  /**
   * Register a new bot identity with a display name and a first token.
   * @param {string} displayName - Visible name the bot posts under.
   * @returns {Promise<object>} The created bot identity and its token, or a rejection reason.
   */
  async function registerBotIdentity(displayName) {
    var data = await file();
    var name = String(displayName || '').trim();
    if (!name) { return { registered: false, reason: 'A bot needs a display name so its posts are attributable.' }; }
    if (data.bots.some(function (bot) { return bot.displayName.toLowerCase() === name.toLowerCase(); })) {
      return { registered: false, reason: 'You already have a bot with that display name.' };
    }

    var tmp = copy(data);
    var initials = name.replace(/[^a-zA-Z]+/g, ' ').trim().split(/\s+/)
      .slice(0, 2).map(function (part) { return part.charAt(0).toUpperCase(); }).join('') || 'BT';
    var bot = {
      id: 'id-bot-' + Date.now(),
      displayName: name,
      initials: initials,
      createdOn: 'Today',
      lastSeen: 'Never posted',
      token: tmp.newBotToken,
      tokenIssuedOn: 'Today',
      memberships: []
    };
    tmp.bots.push(bot);
    tmp.newBotToken = 'twk_bot_' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 18);
    save(tmp);
    return { registered: true, bot: withoutToken(bot), token: bot.token };
  }

  global.BotsApi = {
    getSignedInIdentity: getSignedInIdentity,
    getBotIdentities: getBotIdentities,
    revealBotToken: revealBotToken,
    regenerateBotToken: regenerateBotToken,
    registerBotIdentity: registerBotIdentity
  };
})(window);
