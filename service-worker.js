chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-script.js']
    });
  } catch (error) {
    console.error('Error injecting content script:', error);
  }
});

// Remove the clipboard message handler from service worker