(function () {
  "use strict";

  let data;

  /** Load this page's deterministic response fixture once. */
  async function init__PAGE_NAMESPACE__Api() {
    if (!data) {
      data = fetch("__PAGE_BASENAME__-data.json").then((response) => {
        if (!response.ok) throw new Error("Unable to load page fixture");
        return response.json();
      });
    }
    await data;
  }

  /**
   * A real backend would authorize the request and load the page resource.
   * Request: { fixture }
   * Response fixture: getPageByFixture[fixture]
   */
  async function getPage({ fixture }) {
    const fixtureData = await data;
    return structuredClone(fixtureData.getPageByFixture[fixture]);
  }

  window.__PAGE_NAMESPACE__Api = { init__PAGE_NAMESPACE__Api, getPage };
})();
