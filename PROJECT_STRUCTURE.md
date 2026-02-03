# Param Guru Website - Project Structure & Logic

This document provides a comprehensive overview of the Param Guru website codebase, designed to help AI agents and developers understand the architecture, translation engine, and automation workflows.

## 1. High-Level Overview
*   **Type**: Static Web Application (SPA)
*   **Framework**: React (Vite)
*   **Routing**: `react-router-dom` (Client-Side Routing)
*   **Styling**: Vanilla CSS (Scoped & Utility-based)
*   **I18N**: `react-i18next` with **Dual Language Mode** (Deep/Spiritual vs. Simplified/Conversational).
*   **Translation Engine**: Custom Node.js script (Single-Pass Dual-Output) using Google Gemini 2.5 Pro.

## 2. Directory Structure

```
/
├── public/
│   ├── assets/             # Static Audio/Video/Images
│   └── locales/            # Translation JSON files (Generated)
│       ├── hi/             # SOURCE OF TRUTH (Hindi)
│       │   ├── translation.json       # Deep/Spiritual Hindi
│       │   └── simplified.json        # Conversational Hindi
│       └── [lang]/         # Target Languages (en, fr, de, etc.)
│           ├── translation.json       # High Register Output
│           ├── simplified.json        # Simplified Register Output
│           └── meta.json              # Unified Hash Metadata (Smart Sync)
├── scripts/
│   ├── translate.js        # Core Engine: Single-Pass Dual-Output Generator
│   ├── generate-page.js    # Scaffolding Automation (SEO, Media, Routes)
│   └── PROMPTS.md          # Externalized Prompts & Rules for Translation
├── src/
│   ├── components/
│   │   ├── common/         # Atomic "Lego" Components
│   │   │   ├── PageHeader.jsx
│   │   │   ├── MediaContainer.jsx  # Handles Audio/Video/YouTube
│   │   │   └── SEO.jsx             # React Helmet Wrapper
│   │   ├── Layout.jsx      # Main Wrapper (Nav, Footer, LangSelector)
│   │   ├── Footer.jsx      # Global Footer
│   │   └── LanguageSelector.jsx # UI for Mode Switching
│   ├── config/
│   │   └── routes.jsx      # Single Source of Truth for Routing & Menu
│   ├── pages/              # Page Components (Home, Teachings, etc.)
│   ├── App.jsx             # Router Configuration
│   └── i18n.js             # i18next Configuration
├── package.json            # Scripts & Dependencies
└── vite.config.js          # Build Configuration
```

## 3. Core Systems

### A. The "Single-Pass" Translation Engine
Located in `scripts/translate.js`.
*   **Strategy**: Sends one API call per language to generate *both* registers.
*   **Efficiency**: 50% Token Reduction compared to legacy dual-pass systems.
*   **Logic**:
    1.  Reads `public/locales/hi/translation.json`.
    2.  Checks `meta.json` to process only changed keys.
    3.  Prompt: "Trace this to [Lang]. Output nested JSON: `{ high: '...', simple: '...' }`."
    4.  Response is auto-split into `translation.json` and `simplified.json`.

### B. Scalability Automation
*   **Script**: `scripts/generate-page.js`
*   **Command**: `npm run gen:page <PageName>`
*   **Output**:
    1.  Creates `src/pages/<PageName>.jsx` with `<SEO>`, `<PageHeader>`, and `<MediaContainer>` templates.
    2.  Auto-injects route into `src/config/routes.jsx`.
    3.  Auto-adds keys to `hi/translation.json`.

## 4. Key Workflows

### Adding Content (The "1-Click" Flow)
1.  `npm run gen:page MyTopic`
2.  Edit `src/pages/MyTopic.jsx` (Add Media).
3.  Edit `locales/hi/translation.json` (Add Hindi Text).
4.  `npm run i18n:sync` (Generate World Languages).

### Changing Translation Tone
1.  Edit `scripts/PROMPTS.md`.
2.  Delete `public/locales/[lang]/meta.json` (Force Refresh).
3.  Run `npm run i18n:sync`.
