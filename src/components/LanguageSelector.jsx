import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const matches = {
    en: 'English',
    hi: 'Hindi (हिन्दी)',
    fr: 'French (Français)',
    de: 'German (Deutsch)',
    zh: 'Chinese (中文)',
    ja: 'Japanese (日本語)',
    ru: 'Russian (Русский)',
};

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <div className="language-selector">
            <select onChange={changeLanguage} value={i18n.language} aria-label="Language Selector">
                {Object.keys(matches).map((key) => (
                    <option key={key} value={key}>
                        {matches[key]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
