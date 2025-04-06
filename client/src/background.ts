// This script runs in the background when the extension is installed

// Initialize when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('PageOutliner extension installed');
  
  // Set default settings
  chrome.storage.sync.get('settings', (result) => {
    if (!result.settings) {
      const defaultSettings = {
        autoScroll: true,
        smoothScroll: true,
        showHeadingLabels: true,
        position: 'popup',
        enabledHeadings: {
          h1: true,
          h2: true,
          h3: true,
          h4: true
        }
      };
      
      chrome.storage.sync.set({ settings: defaultSettings });
    }
  });
});

// Add context menu items
chrome.contextMenus.create({
  id: 'refreshOutline',
  title: 'Refresh Page Outline',
  contexts: ['all']
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'refreshOutline' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'refreshOutline' });
  }
});

// Listen for tab updates to refresh outline
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.tabs.sendMessage(tabId, { action: 'refreshOutline' });
  }
});

// Keep service worker active
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'keepAlive') {
    sendResponse({ status: 'alive' });
  }
  return true;
});
