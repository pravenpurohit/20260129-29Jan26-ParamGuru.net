# Author's Guide: Editing & Publishing

This guide outlines the mandatory workflow for editing content on the ParamGuru website. Our system is designed to ensure that all content originates in **Hindi** and is properly "Transcreated" into all other languages before publishing.

## 1. The Golden Rule
**ALWAYS edit content in Hindi first.**
The source of truth for this website is `public/locales/hi/translation.json`.
**NEVER** manually edit the English (en), French (fr), or other language JSON files. They will be overwritten by the automation.

## 2. Editing Workflow

### Step 1: Create a New Page (Optional)
If adding a completely new topic (e.g., "Meditation"), use the automation tool:
```bash
npm run gen:page Meditation
```
This creates the file, sets up the menu connection, and prepares the translation keys.

### Step 2: Update Hindi Content
Open `public/locales/hi/translation.json` in your editor. Add or modify the keys for your page.

```json
{
  "meditation": {
    "title": "ध्यान",
    "description": "ध्यान की विधि..."
  }
}
```

### Step 3: Run the Transcreation Engine (Single-Pass)
We use a sophisticated AI engine that generates **two versions** (High & Simplified) for every language in a single step.

```bash
npm run i18n:sync
```
*   **Efficiency**: This process is optimized to be 2x faster and use 50% fewer resources.
*   *Note: You need a valid `GEMINI_API_KEY` in your `.env` file.*

### Step 4: Verify locally
Run the development server to check your changes:

```bash
npm run dev
```

Switch between **"Original Spiritual"** (High) and **"Simplified B1"** (Simple) modes using the toggle at the top of the page. Ensure the AI captured the nuance correctly.

## 3. Publishing / Building
When you run the build command, the system will **automatically** force a translation sync to ensure no outdated translations reach production.

```bash
npm run build
```

## Summary Checklist
- [ ] used `npm run gen:page` for new pages?
- [ ] Edited `public/locales/hi/translation.json`?
- [ ] Ran `npm run i18n:sync`?
- [ ] Verified both registers (High/Simple) in `npm run dev`?
