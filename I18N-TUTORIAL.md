# Internationalization (I18N) Developer Guide

**IMPORTANT**: This project requires strict adherence to the I18N framework.
**Rule**: NEVER hardcode text in components. ALWAYS use `t('key')`.

## 1. How to Add Text (The Workflow)

When you create a new component or page:

1.  **Do NOT write text directly.**
    *   ❌ `<p>Hello World</p>`
    *   ✅ `<p>{t('hello_world')}</p>`

2.  **Add the key to `public/locales/en/translation.json` first.**
    ```json
    {
      "hello_world": "Hello World"
    }
    ```

3.  **Use the hook in your component:**
    ```javascript
    import { useTranslation } from 'react-i18next';
    
    const MyComponent = () => {
      const { t } = useTranslation();
      return <div>{t('hello_world')}</div>;
    }
    ```

## 2. Maintaining Other Languages

*   The translation files are located in `public/locales/{lang}/translation.json`.
*   Supported languages: `en`, `hi`, `fr`, `de`, `zh`, `ja`, `ru`.
*   **Task**: Whenever you add a key to English, you ideally should add it to the others (even if you just copy the English text temporarily).

## 3. Automation Note
If adding a large number of pages, ensure the `setup_locales.js` script or a similar utility is updated if you decide to restructure the translation files (e.g. using namespaces), but for now, the single `translation.json` per language is the standard.
