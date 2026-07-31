(function () {
  "use strict";

  let data;

  async function init__PAGE_NAMESPACE__Api() {
    if (data) return;
    const response = await fetch("__PAGE_BASENAME__-data.json");
    data = await response.json();
  }

  // A real backend would authorize the viewer and load the page data.
  async function getPage({ fixture }) {
    return structuredClone(data.loadResponsesByFixture[fixture]);
  }

  window.__PAGE_NAMESPACE__Api = { init__PAGE_NAMESPACE__Api, getPage };
})();
