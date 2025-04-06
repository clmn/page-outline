import type { Heading, Settings } from './types';

// Generate a unique ID for each heading
export const generateHeadingId = (text: string, index: number): string => {
  // Remove special characters and replace spaces with dashes
  const baseId = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  
  return `heading-${baseId}-${index}`;
};

// Find all headings in the document
export const findHeadings = (settings: Settings): Heading[] => {
  const headings: Heading[] = [];
  const enabledSelectors: string[] = [];
  
  if (settings.enabledHeadings.h1) enabledSelectors.push('h1');
  if (settings.enabledHeadings.h2) enabledSelectors.push('h2');
  if (settings.enabledHeadings.h3) enabledSelectors.push('h3');
  if (settings.enabledHeadings.h4) enabledSelectors.push('h4');
  
  if (enabledSelectors.length === 0) return headings;
  
  const selector = enabledSelectors.join(', ');
  const headingElements = document.querySelectorAll<HTMLHeadingElement>(selector);
  
  headingElements.forEach((element, index) => {
    const level = parseInt(element.tagName.charAt(1));
    const text = element.textContent?.trim() || '';
    const id = element.id || generateHeadingId(text, index);
    
    // Ensure the element has an ID for anchoring
    if (!element.id) {
      element.id = id;
    }
    
    headings.push({
      id,
      text,
      level,
      element
    });
  });
  
  return headings;
};

// Scroll to a specific heading
export const scrollToHeading = (id: string, smooth: boolean): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start'
    });
  }
};

// Get the current visible heading in the viewport
export const getCurrentHeading = (headings: Heading[]): Heading | undefined => {
  if (!headings.length) return undefined;
  
  // Sort headings by their position on the page
  const headingsWithPosition = headings.map(heading => ({
    heading,
    position: heading.element.getBoundingClientRect().top
  }));
  
  // Find the first heading that is visible in the viewport or just above it
  const viewportHeight = window.innerHeight;
  const buffer = 100; // Buffer zone to improve user experience
  
  // First check if there's any heading in the viewport
  const visibleHeadings = headingsWithPosition.filter(
    ({ position }) => position >= -buffer && position < viewportHeight - buffer
  );
  
  if (visibleHeadings.length > 0) {
    // Return the first visible heading
    return visibleHeadings[0].heading;
  }
  
  // If no heading is visible, find the one just above the viewport
  const headingsAbove = headingsWithPosition.filter(({ position }) => position < 0);
  if (headingsAbove.length > 0) {
    // Sort to find the closest one above
    headingsAbove.sort((a, b) => b.position - a.position);
    return headingsAbove[0].heading;
  }
  
  // If nothing is found above, return the first heading
  return headings[0];
};
