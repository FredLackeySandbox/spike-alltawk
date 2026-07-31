(function () {
  "use strict";

  let data;

  /** Load the deterministic members fixture once. */
  async function initMembersApi() {
    if (data) return;
    const response = await fetch("members-data.json");
    data = await response.json();
  }

  /** A real backend would authorize the viewer and load the conversation roster. */
  async function getRoster(request) {
    return structuredClone(data.rostersByFixture[request.fixture]);
  }

  /** A real backend would authorize and persist the requested membership change. */
  async function updateMember(request) {
    return structuredClone(data.updateMember);
  }

  window.MembersApi = { initMembersApi, getRoster, updateMember };
})();
