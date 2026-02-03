# AI Instructions: Enhancing the Param Guru Website

This document serves as the **Standard Operating Procedure (SOP)** for any AI agent or developer tasked with adding content or enhancing this website.

## ⚠️ Critical Directive: "Bhav" & Quality
This website is spiritual in nature. All technical decisions must align with maintaining the "Bhav" (Spiritual Emotion/Depth).
*   **Design**: Minimalist, premium, "Glassmorphism", centered, removing clutter.
*   **Language**: Respect the specific instructions in `PROMPTS.md`.
*   **Performance**: Zero token waste. Maximum automation.

---

## 🚀 Workflow 1: Adding a New Page (Gold Standard)

**Goal**: Add a page for "Bhajans" (Devotional Songs).

**Step 1: Execute Automation**
**NEVER** create files manually. Use the generator. It auto-wires SEO, Media templates, Routes, and Translations.
```bash
npm run gen:page Bhajans
```

**Step 2: Add Content (Media/Text)**
*   Open `src/pages/Bhajans.jsx`.
*   The generator provides **Commented Templates** for Video/Audio. Uncomment and fill them.
*   **SEO**: Ensure the `<SEO />` component title/description keys are mapped.
*   **Media**: Use the atomic `<MediaContainer />`.
    ```jsx
    // YouTube
    <MediaContainer type="youtube" src="https://..." caption="Morning Arati" />
    
    // Native Audio (MP3)
    <MediaContainer type="audio" src="/assets/audio/chant.mp3" caption="Chanting" />
    
    // Native Video (MP4)
    <MediaContainer type="video" src="/assets/video/discourse.mp4" caption="Lecture" />
    ```

**Step 3: Define Source Text (Hindi)**
*   Open `public/locales/hi/translation.json`.
*   Find the new key (e.g., `"bhajans": { "title": "...", "description": "..." }`).
*   Replace English placeholders with **High-Quality Hindi** text.
*   *Note: This is the Source of Truth. The AI Translator will derive all other languages from this.*

**Step 4: Generate Global Content (Single-Pass)**
Run the sync script. It uses a **Single-Pass Dual-Output** engine to generate High & Simple registers in one go (50% token cost).
```bash
npm run i18n:sync
```

---

## 🛠 Workflow 2: Modifying Architecture

**Goal**: Add a Footer or Change Navigation style.

*   **Navigation**: Edit `src/config/routes.jsx` (Central Config) or `src/components/Layout.jsx`.
*   **Footer**: Edit `src/components/Footer.jsx`.
*   **SEO**: Edit `src/components/common/SEO.jsx` (Helmet wrapper).
*   **Global Styles**: Edit `src/App.css`. Maintain the variable-based `index.css` system.

---

## 🧠 Workflow 3: Tuning Translations

**Goal**: The AI is translating "Guru" as "Teacher", but we want "Master".

1.  Open `scripts/PROMPTS.md`.
2.  Edit the `## [en]` section (or the System Prompt).
3.  Add the rule: `Do NOT translate 'Guru' as 'Teacher'; keep it as 'Guru' or use 'Master'.`
4.  **Force Refresh**: To apply this to *existing* content, you must clear the cache for that language.
    *   Delete `public/locales/en/meta.json` (Unified Metadata).
5.  Run `npm run i18n:sync` (It will re-generate both registers).

---

## 📦 Component Library Reference

### `<SEO />`
*   `title` (string): Page Title (Suffixes "| Param Guru" automatically).
*   `description` (string): Meta Description for Search Engines.

### `<PageHeader />`
*   `title` (string): Main h1 heading.
*   `subtitle` (string): Optional subtext.

### `<MediaContainer />`
*   `type`: `'video'` (MP4) | `'audio'` (MP3) | `'youtube'` | `'image'`.
*   `src`: URL.
*   `caption`: Optional text below media.

---

## ✅ Final Verification Checklist
Before finishing a task, verify:
1.  [ ] Did you run `npm run i18n:sync`?
2.  [ ] Did the **Single-Pass** sync complete without errors?
3.  [ ] Does the new page appear in the Navigation Menu?
4.  [ ] Does switching to "Simplified" mode work for the new content?
5.  [ ] Is the Hindi content accurate (Deep vs Simplified)?
