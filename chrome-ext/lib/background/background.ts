chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {},
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.bgScriptQuery == "post") {
      // fetch("http://localhost:3003/symmetry/test", {
      //   method: "POST",
      //   body: request.body,
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      // }).then(res => {
      //   sendResponse(res);
      // }).catch(err => {
      //   sendResponse(err);
      // })

      return true;
    }
  }
);
