# AI Instructions: Enhancing the Param Guru Website

This document serves as the **Standard Operating Procedure (SOP)** for any AI agent or developer tasked with adding content or enhancing this website.

## ⚠️ Critical Directive: "Bhav" & Quality
This website is spiritual in nature. All technical decisions must align with maintaining the "Bhav" (Spiritual Emotion/Depth).
*   **Design**: Minimalist, premium, "Glassmorphism", centered, removing clutter.
*   **Language**: Respect the specific instructions in `PROMPTS.md`.

---

## 🚀 Workflow 1: Adding a New Page

**Goal**: Add a page for "Bhajans" (Devotional Songs).

**Step 1: Execute Automation**
Do NOT create files manually. Use the generator.
```bash
npm run gen:page Bhajans
```

**Step 2: Add Content (Media/Text)**
*   Open `src/pages/Bhajans.jsx`.
*   Use **Atomic Components** only. Do not write raw `<img>` or `<iframe>` tags unless necessary.
    ```jsx
    <MediaContainer
        type="youtube"
        src="https://www.youtube.com/embed/VIDEO_ID"
        caption="Morning Arati"
    />
    ```

**Step 3: Define Source Text (Hindi)**
*   Open `public/locales/hi/translation.json`.
*   Find the new key (e.g., `"bhajans": { ... }`).
*   Replace English placeholders with **High-Quality Hindi** text.
    *   *Note: This is the Source of Truth. The AI Translator will derive everything from this.*

**Step 4: Generate Global Content**
Run the sync script to generate English, French, German, Simplified Hindi, etc.
```bash
npm run i18n:sync
```

---

## 🛠 Workflow 2: Modifying Architecture

**Goal**: Add a Footer or Change Navigation style.

*   **Navigation**: Edit `src/config/routes.jsx` or `src/components/Layout.jsx`.
*   **Global Styles**: Edit `src/App.css`. Maintain the variable-based color system if implemented.

---

## 🧠 Workflow 3: Tuning Translations

**Goal**: The AI is translating "Guru" as "Teacher", but we want "Master".

1.  Open `scripts/PROMPTS.md`.
2.  Edit the `## [en]` section (or the System Prompt).
3.  Add the rule: `Do NOT translate 'Guru' as 'Teacher'; keep it as 'Guru' or use 'Master'.`
4.  **Force Refresh**: To apply this to *existing* content, you must clear the cache for that language.
    *   Delete `public/locales/en/*.meta.json`.
5.  Run `npm run i18n:sync`.

---

## 📦 Component Library Reference

### `<PageHeader />`
*   `title` (string): Main heading (use `t('key.title')`).
*   `subtitle` (string): Optional subtext (use `t('key.subtitle')`).

### `<MediaContainer />`
*   `type`: `'video'` | `'youtube'` | `'image'` | `'audio'`.
*   `src`: URL.
*   `caption`: Optional text below media.

---

## ✅ Final Verification Checklist
Before finishing a task, verify:
1.  [ ] Did you run `npm run i18n:sync`?
2.  [ ] Does the new page appear in the Navigation Menu?
3.  [ ] Does switching to "Simplified" mode work for the new content?
4.  [ ] Is the Hindi content accurate (Deep vs Simplified)?
