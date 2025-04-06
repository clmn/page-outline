import { findHeadings, scrollToHeading, getCurrentHeading } from './lib/headingUtils';
import type { Settings, Heading, MessageToContent, MessageToPopup } from './lib/types';

let headings: Heading[] = [];
let settings: Settings;
let observer: IntersectionObserver | null = null;
let scrollTimeout: number | null = null;

// Load settings from storage
const loadSettings = async (): Promise<Settings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('settings', (result) => {
      if (result.settings) {
        resolve(result.settings);
      } else {
        resolve({
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
        });
      }
    });
  });
};

// Scan the page for headings and add anchors
const scanAndAddAnchors = async () => {
  // Load settings first
  settings = await loadSettings();
  
  // Find all headings
  headings = findHeadings(settings);
  
  // Send headings to popup
  const message: MessageToPopup = {
    action: headings.length > 0 ? 'headingsFound' : 'noHeadingsFound',
    headings: headings.length > 0 ? headings : undefined,
    currentPage: {
      title: document.title,
      url: window.location.href
    }
  };
  
  chrome.runtime.sendMessage(message);
  
  // Set up intersection observer to detect which heading is currently visible
  setupIntersectionObserver();
};

// Set up an intersection observer to track visible headings
const setupIntersectionObserver = () => {
  if (observer) {
    observer.disconnect();
  }
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        // When a heading enters the viewport, notify the popup
        if (entry.isIntersecting) {
          const headingId = entry.target.id;
          const heading = headings.find(h => h.id === headingId);
          
          if (heading) {
            chrome.runtime.sendMessage({
              action: 'currentHeadingChanged',
              currentHeading: heading
            });
          }
        }
      });
    },
    { threshold: 0.1 }
  );
  
  // Observe all headings
  headings.forEach(heading => {
    observer.observe(heading.element);
  });
};

// Handle scroll events to determine current heading
const handleScroll = () => {
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout);
  }
  
  scrollTimeout = window.setTimeout(() => {
    const currentHeading = getCurrentHeading(headings);
    
    if (currentHeading) {
      chrome.runtime.sendMessage({
        action: 'currentHeadingChanged',
        currentHeading
      });
    }
  }, 100);
};

// Initialize the content script
const initialize = async () => {
  // Initial scan
  await scanAndAddAnchors();
  
  // Listen for scroll events
  window.addEventListener('scroll', handleScroll);
  
  // Monitor DOM changes for dynamic content
  const bodyObserver = new MutationObserver(async (mutations) => {
    // Check if there are significant changes that might affect headings
    const significantChanges = mutations.some(mutation => {
      return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
    });
    
    if (significantChanges) {
      await scanAndAddAnchors();
    }
  });
  
  // Watch for changes in the body
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Clean up on unload
  window.addEventListener('unload', () => {
    if (observer) {
      observer.disconnect();
    }
    
    bodyObserver.disconnect();
    window.removeEventListener('scroll', handleScroll);
  });
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message: MessageToContent, sender, sendResponse) => {
  switch (message.action) {
    case 'getHeadings':
      // Return already processed headings if available, otherwise scan the page
      if (headings.length > 0) {
        chrome.runtime.sendMessage({
          action: 'headingsFound',
          headings,
          currentHeading: getCurrentHeading(headings),
          currentPage: {
            title: document.title,
            url: window.location.href
          }
        });
      } else {
        scanAndAddAnchors();
      }
      break;
      
    case 'navigateToHeading':
      if (message.headingId) {
        scrollToHeading(message.headingId, settings?.smoothScroll ?? true);
      }
      break;
      
    case 'refreshOutline':
      scanAndAddAnchors();
      break;
  }
  
  sendResponse({ received: true });
  return true;
});

// Initialize the content script when the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
