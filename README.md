# PageOutliner Chrome Extension

A Chrome extension that automatically generates a clickable table of contents from H1-H4 headings on any webpage.

## Features

- Automatically scans web pages for H1-H4 headings
- Creates a navigable outline/table of contents
- Allows quick navigation through long web pages
- Customizable settings for display preferences
- Supports automatic scrolling and smooth scrolling options

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `client` directory from this project
5. The extension should now be installed and visible in your Chrome toolbar

## Development

This extension is built using:
- TypeScript
- React
- Chrome Extension APIs

## Project Structure

- `client/src/content.ts` - Content script that runs on web pages
- `client/src/background.ts` - Background service worker
- `client/src/components/` - React components for the extension popup
- `client/manifest.json` - Extension configuration
