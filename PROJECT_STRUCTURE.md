# Param Guru Website - Project Structure & Logic

This document provides a comprehensive overview of the Param Guru website codebase, designed to help AI agents and developers understand the architecture, translation engine, and automation workflows.

## 1. High-Level Overview
*   **Type**: Static Web Application (SPA)
*   **Framework**: React (Vite)
*   **Routing**: `react-router-dom` (Client-Side Routing)
*   **Styling**: Vanilla CSS (Scoped & Utility-based)
*   **I18N**: `react-i18next` with **Dual Language Mode** (Deep/Spiritual vs. Simplified/Conversational).
*   **Translation Engine**: Custom Node.js script using Google Gemini 2.5 Pro.

## 2. Directory Structure

```
/
├── public/
│   ├── assets/             # Static images/media
│   └── locales/            # Translation JSON files (Generated)
│       ├── hi/             # SOURCE OF TRUTH (Hindi)
│       │   ├── translation.json       # Deep/Spiritual Hindi
│       │   ├── simplified.json        # Conversational Hindi
│       │   └── *.meta.json            # Hashing metadata for Smart Sync
│       └── [lang]/         # Target Languages (en, fr, de, etc.)
├── scripts/
│   ├── translate.js        # The Core Translation Engine
│   ├── generate-page.js    # Automation script to Scaffold Pages
│   └── PROMPTS.md          # Externalized Prompts & Rules for Translation
├── src/
│   ├── components/
│   │   ├── common/         # Atomic "Lego" Components (PageHeader, MediaContainer)
│   │   ├── Layout.jsx      # Main Wrapper (Nav, LanguageSelector, Content)
│   │   └── LanguageSelector.jsx # UI for seamless Language/Mode switching
│   ├── config/
│   │   └── routes.jsx      # Single Source of Truth for Routing & Menu
│   ├── pages/              # Page Components (Home, Teachings, etc.)
│   ├── App.jsx             # Router Configuration (Consumes routes.jsx)
│   └── i18n.js             # i18next Configuration
├── package.json            # Scripts & Dependencies
└── vite.config.js          # Build Configuration
```

## 3. Core Systems

### A. The "Smart" Translation Engine
Located in `scripts/translate.js`, executed via `npm run i18n:sync`.
*   **Source of Truth**: Hindi (`public/locales/hi/translation.json`).
*   **Logic**:
    1.  Reads Source Keys.
    2.  Checks hashes (`.meta.json`) to detect *only* changed/new keys (Smart Sync).
    3.  **Dual output**: Generates both `translation.json` (Deep) and `simplified.json` (Simple) for *every* language.
    4.  **Simplified Hindi Algorithm**: For Hindi, it *rewrites* the source text into conversational Hindustani using a special prompt.
    5.  **Prompt System**: Loads generic and language-specific instructions from `scripts/PROMPTS.md`.
    6.  **Safety**: Validates against negative connotations.

### B. Config-Driven Routing
*   **File**: `src/config/routes.jsx`
*   **Logic**: Exports an array of route objects (`path`, `key`, `element`, `showInNav`).
*   **Usage**:
    *   `App.jsx`: Maps this array to create `<Route>` elements.
    *   `Layout.jsx`: Maps this array to create the Navigation Menu.

### C. Scalability Automation
*   **Script**: `scripts/generate-page.js`
*   **Command**: `npm run gen:page <PageName>`
*   **Function**:
    1.  Creates `src/pages/<PageName>.jsx` using Atomic Components.
    2.  Injects the new route into `src/config/routes.jsx`.
    3.  Adds placeholder keys to `public/locales/hi/translation.json`.

## 4. Key Workflows

### Adding Content
1.  **Create Page**: `npm run gen:page MyNewPage`
2.  **Add Media**: Use `<MediaContainer src="..." type="youtube" />` in the new file.
3.  **Add Text**: Update `public/locales/hi/translation.json` with the Hindi content.
4.  **Sync**: Run `npm run i18n:sync` to generate all other languages.

### Changing Translation Tone
1.  Edit `scripts/PROMPTS.md`.
2.  Delete `.meta.json` files (to force re-translation).
3.  Run `npm run i18n:sync`.
