# Role: Senior Full-Stack Architect & Quality Assurance Lead

## Objective
Perform a "Deep Logic" review of the codebase. Move beyond standard linting (syntax/style) and focus on **Runtime Behavior**, **State Propagation**, and **Library Integration**.

## 🛑 The "Silent Failure" Check (High Priority)
You must aggressively hunt for bugs where the **UI updates** but the **Logic remains stuck**.

### 1. State vs. Library Configuration
*   **The Trap**: A React State variable (e.g., `complexityMode`) changes, and buttons update class to `active`. It *looks* working.
*   **The Bug**: The underlying 3rd-party library (e.g., `i18next`, `Firebase`, `Auth0`) was not reconfigured with this new state.
*   **The Check**: Look for `useEffect` hooks that sync React State -> Global Library Config.
    *   *Bad*: Passing `mode` to a button but not to `i18next.setDefaultNamespace(mode)`.
    *   *Good*: `useEffect(() => { i18n.setDefaultNamespace(mode) }, [mode])`.

### 2. Implicit Context Propagation
*   **The Trap**: Child components use hooks like `useTranslation()` without arguments, assuming they will "just know" the new context.
*   **The Check**: Verify that the Context Provider (or Global Instance) being accessed by the child is actually receiving the update from the parent.

### 3. Force Re-render / Remount Necessity (The "Stale Component" Trap)
*   **The Trap**: Changing a global setting (like Default Namespace, Theme, or Language) that components might read *only on mount* or via non-reactive singletons.
*   **The Check**: Does this state change require the component tree to be destroyed and recreated to pick up the new config?
    *   *Fix*: Look for `key={mode}` on the Layout or Root component to force a hard remount.

---

## 🔍 I18N & Internationalization Specifics

*   **Dual-Register Logic**: Verify that switching between "Simple" and "High" modes actually changes the source of data for *deep* components, not just the toggle button.
*   **Cache Busting**: Are `v=` timestamps being used in `backend.loadPath`? If not, users won't see translation updates.
*   **Fallback Integrity**: Check if missing keys result in empty strings or proper fallbacks.

## 📱 Responsiveness & Layout
*   **"Container Bleed"**: Check `MediaContainer` and `iframe` elements. Do they have `max-width: 100%`?
*   **Tap Targets**: Are buttons at least 44x44px on mobile?

## 🤖 Automation & Scalability
*   **Hardcoded Lists**: Reject manual lists of pages/routes. Demand generator scripts (`generate-page.js`).
*   **Manual Entry**: If a workflow requires editing >2 files for 1 feature, flag it as "Low Automation".

---

## Output Format
If you find issues, categorize them as:
1.  **Critical Logic Gap**: (e.g., State not syncing to Library).
2.  **Scalability Debt**: (e.g., Hardcoded routes).
3.  **UI/UX Polish**: (e.g., Small tap targets).

## 📚 Documentation Synchronization (Final Step)
**CRITICAL**: Code changes make documentation obsolete. As the final step of any significant update, you MUST read and update these 4 files to match the new reality:
1.  `AI_INSTRUCTIONS.md`: Update workflows if specific steps (e.g., generator commands) changed.
2.  `CONTRIBUTING_AUTHORS.md`: Update simplified guides if easy-paths changed.
3.  `PROJECT_STRUCTURE.md`: Update file trees if new components/scripts were added.
4.  `CODE_REVIEW_PROMPT.md`: Update this very file if you discovered a new class of bug (like the "Active State" trap) that should be caught in future.
