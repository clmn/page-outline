import type { MessageToContent, MessageToPopup, Settings, Heading } from './types';

// Send message to content script
export const sendMessageToContent = (message: MessageToContent): Promise<any> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            resolve(response);
          });
        } else {
          resolve(null);
        }
      });
    } else {
      resolve(null);
    }
  });
};

// Save settings to Chrome storage
export const saveSettings = (settings: Settings): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ settings }, () => {
        resolve();
      });
    } else {
      // For development outside Chrome extension environment
      localStorage.setItem('pageOutliner_settings', JSON.stringify(settings));
      resolve();
    }
  });
};

// Load settings from Chrome storage
export const loadSettings = (): Promise<Settings> => {
  const defaultSettings: Settings = {
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

  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('settings', (result) => {
        if (result.settings) {
          resolve(result.settings);
        } else {
          resolve(defaultSettings);
        }
      });
    } else {
      // For development outside Chrome extension environment
      const savedSettings = localStorage.getItem('pageOutliner_settings');
      if (savedSettings) {
        resolve(JSON.parse(savedSettings));
      } else {
        resolve(defaultSettings);
      }
    }
  });
};

// Add message listener for popup
export const addMessageListener = (callback: (message: MessageToPopup) => void): () => void => {
  const listener = (message: MessageToPopup) => {
    callback(message);
  };

  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }

  return () => {};
};
