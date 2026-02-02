# Author's Guide: Editing & Publishing

This guide outlines the mandatory workflow for editing content on the ParamGuru website. Our system is designed to ensure that all content originates in **Hindi** and is properly "Transcreated" into all other languages before publishing.

## 1. The Golden Rule
**ALWAYS edit content in Hindi first.**
The source of truth for this website is `public/locales/hi/translation.json`.
**NEVER** manually edit the English (en), French (fr), or other language JSON files. They will be overwritten by the automation.

## 2. Editing Workflow

### Step 1: Update Hindi Content
Open `public/locales/hi/translation.json` in your editor. Add or modify the keys as needed.

```json
{
  "new_section": {
    "title": "नया शीर्षक",
    "content": "यहाँ अपनी आध्यात्मिक सामग्री लिखें..."
  }
}
```

### Step 2: Run the Transcreation Engine
Before you can see your changes in other languages, you must run the synchronization script. This script uses AI to transcreate your Hindi content.

```bash
npm run i18n:sync
```

_Note: You need a valid `GEMINI_API_KEY` in your `.env` file for this to work._

### Step 3: Verify locally
Run the development server to check your changes:

```bash
npm run dev
```

Switch between languages using the Language Selector to ensure the AI generated appropriate translations.

## 3. Publishing / Building
When you run the build command, the system will **automatically** force a translation sync to ensure no outdated translations reach production.

```bash
npm run build
```

If the translation fails (e.g., missing API key), the build will fail. This is a safety mechanism.

## Summary Checklist
- [ ] Edited `public/locales/hi/translation.json`
- [ ] Ran `npm run i18n:sync`
- [ ] Verified UI in `npm run dev`
- [ ] Committed changes
