/**
 * Mock API for the moderation report queue.
 *
 * Stands in for the endpoint that returns numbered message reports for the
 * conversations the signed-in identity owns or administers. Reports belonging to
 * conversations the identity does not govern are never returned.
 */
(function (global) {
  'use strict';

  var DATA_URL = 'reports-data.json';
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
   * Retrieve the identity reviewing the reports.
   * @returns {Promise<object>} Display name, initials, and identity type.
   */
  async function getSignedInIdentity() {
    var data = await file();
    return copy(data.identity);
  }

  /**
   * List reports that still need a decision, longest waiting first.
   * @returns {Promise<Array<object>>} Reports awaiting a moderator decision.
   */
  async function getReportsAwaitingDecision() {
    var data = await file();
    return copy(data.reports)
      .filter(function (report) { return report.state === 'awaiting'; })
      .sort(function (left, right) {
        return String(left.openedAt).localeCompare(String(right.openedAt));
      });
  }

  /**
   * List reports a moderator has already acted on, most recent first.
   * @returns {Promise<Array<object>>} Reports with a recorded outcome.
   */
  async function getReportsAlreadyActedOn() {
    var data = await file();
    return copy(data.reports).filter(function (report) { return report.state === 'acted'; });
  }

  global.ReportsApi = {
    getSignedInIdentity: getSignedInIdentity,
    getReportsAwaitingDecision: getReportsAwaitingDecision,
    getReportsAlreadyActedOn: getReportsAlreadyActedOn
  };
})(window);
