/**
 * Mock API for reviewing one moderation report.
 *
 * Stands in for the endpoints that read a numbered report with the flagged
 * message and its surrounding context, record a review note, apply a supported
 * moderation outcome, and open a private discussion conversation linked back to
 * the report. Mutations update an in-memory working copy for the prototype
 * session only.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'report-data.json';
  var SESSION_KEY = 'tawk.createdConversations';
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

  function find(data, ticketNumber) {
    return data.reports.filter(function (item) {
      return String(item.ticketNumber) === String(ticketNumber);
    })[0] || null;
  }

  function rememberForSession(conversation) {
    try {
      var stored = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '[]');
      stored = stored.filter(function (item) { return item && item.id !== conversation.id; });
      stored.push(conversation);
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    } catch (error) {
      /* Storage is unavailable; the prototype simply forgets the new conversation. */
    }
  }

  function settle(data, report, outcome) {
    report.state = 'acted';
    report.outcome = outcome;
    report.actedOn = 'Today';
    report.actedBy = data.identity.displayName;
  }

  /**
   * Retrieve the identity reviewing the report.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * Retrieve one report with its flagged message, context, reporter, and notes.
   * @param {string|number} ticketNumber - Report number being opened.
   * @returns {Promise<object|null>} The report, or null when it is unavailable.
   */
  async function getReport(ticketNumber) {
    var data = await file();
    return copy(find(data, ticketNumber));
  }

  /**
   * Record a review note against a report.
   * @param {string|number} ticketNumber - Report receiving the note.
   * @param {string} body - Note text as written by the reviewer.
   * @returns {Promise<object>} Outcome with the stored note or a rejection reason.
   */
  async function addReviewNote(ticketNumber, body) {
    var data = await file();
    var text = String(body || '').trim();
    if (!text) { return { saved: false, reason: 'A note needs some text.' }; }
    var tmp = copy(data);
    var report = find(tmp, ticketNumber);
    if (!report) { return { saved: false, reason: 'That report is no longer available.' }; }
    var note = {
      authorName: tmp.identity.displayName,
      body: text,
      at: 'Just now'
    };
    report.notes.push(note);
    save(tmp);
    return { saved: true, note: copy(note) };
  }

  /**
   * Delete the reported message and close the report with that outcome.
   * @param {string|number} ticketNumber - Report being decided.
   * @returns {Promise<object>} Outcome with the recorded decision or a refusal reason.
   */
  async function deleteReportedMessage(ticketNumber) {
    var data = await file();
    var tmp = copy(data);
    var report = find(tmp, ticketNumber);
    if (!report) { return { applied: false, reason: 'That report is no longer available.' }; }
    report.reportedMessage.deleted = true;
    settle(tmp, report, 'Message deleted');
    save(tmp);
    return { applied: true, outcome: report.outcome };
  }

  /**
   * Suspend the reported author's ability to post until a stated date.
   * The author keeps their membership and can still read the conversation.
   * @param {string|number} ticketNumber - Report being decided.
   * @param {string} until - Human-readable end of the suspension.
   * @returns {Promise<object>} Outcome with the recorded decision or a refusal reason.
   */
  async function suspendReportedAuthorPosting(ticketNumber, until) {
    var data = await file();
    if (!until) { return { applied: false, reason: 'A posting suspension needs an end date.' }; }
    var tmp = copy(data);
    var report = find(tmp, ticketNumber);
    if (!report) { return { applied: false, reason: 'That report is no longer available.' }; }
    report.author.postingSuspendedUntil = until;
    settle(tmp, report, 'Posting suspended until ' + until);
    save(tmp);
    return { applied: true, outcome: report.outcome };
  }

  /**
   * Remove the reported author from the conversation and close the report.
   * @param {string|number} ticketNumber - Report being decided.
   * @returns {Promise<object>} Outcome with the recorded decision or a refusal reason.
   */
  async function removeReportedAuthor(ticketNumber) {
    var data = await file();
    var tmp = copy(data);
    var report = find(tmp, ticketNumber);
    if (!report) { return { applied: false, reason: 'That report is no longer available.' }; }
    report.author.removed = true;
    settle(tmp, report, 'Participant removed');
    save(tmp);
    return { applied: true, outcome: report.outcome };
  }

  /**
   * Ban the reported author's identity from the conversation and close the report.
   * @param {string|number} ticketNumber - Report being decided.
   * @returns {Promise<object>} Outcome with the recorded decision or a refusal reason.
   */
  async function banReportedAuthor(ticketNumber) {
    var data = await file();
    var tmp = copy(data);
    var report = find(tmp, ticketNumber);
    if (!report) { return { applied: false, reason: 'That report is no longer available.' }; }
    report.author.banned = true;
    report.author.role = 'none';
    settle(tmp, report, 'Identity banned');
    save(tmp);
    return { applied: true, outcome: report.outcome };
  }

  /**
   * Close the report without acting against the message or its author.
   * @param {string|number} ticketNumber - Report being decided.
   * @returns {Promise<object>} Outcome with the recorded decision or a refusal reason.
   */
  async function closeReportWithoutAction(ticketNumber) {
    var data = await file();
    var tmp = copy(data);
    var report = find(tmp, ticketNumber);
    if (!report) { return { applied: false, reason: 'That report is no longer available.' }; }
    settle(tmp, report, 'Reviewed, no action taken');
    save(tmp);
    return { applied: true, outcome: report.outcome };
  }

  /**
   * Open a private conversation for discussing the report, linked back to it.
   * The discussion behaves like any other conversation and appears in the
   * participating reviewers' conversation lists.
   * @param {string|number} ticketNumber - Report the discussion belongs to.
   * @returns {Promise<object>} The linked discussion conversation identifier.
   */
  async function openModerationDiscussion(ticketNumber) {
    var data = await file();
    var tmp = copy(data);
    var report = find(tmp, ticketNumber);
    if (!report) { return { opened: false, reason: 'That report is no longer available.' }; }
    if (report.discussionConversationId) {
      return { opened: true, conversationId: report.discussionConversationId, alreadyExisted: true };
    }

    var conversationId = 'c-mod' + report.ticketNumber;
    report.discussionConversationId = conversationId;
    save(tmp);
    rememberForSession({
      id: conversationId,
      tags: ['moderation', 'ticket:' + report.ticketNumber],
      listed: false,
      matching: 'all',
      kind: 'moderation-discussion',
      linkedTicket: report.ticketNumber
    });
    return { opened: true, conversationId: conversationId, alreadyExisted: false };
  }

  global.ReportApi = {
    getSignedInIdentity: getSignedInIdentity,
    getReport: getReport,
    addReviewNote: addReviewNote,
    deleteReportedMessage: deleteReportedMessage,
    suspendReportedAuthorPosting: suspendReportedAuthorPosting,
    removeReportedAuthor: removeReportedAuthor,
    banReportedAuthor: banReportedAuthor,
    closeReportWithoutAction: closeReportWithoutAction,
    openModerationDiscussion: openModerationDiscussion
  };
})(window);
