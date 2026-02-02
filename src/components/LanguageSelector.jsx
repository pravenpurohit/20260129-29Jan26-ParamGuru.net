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
    bn: 'Bengali (বাংলা)',
    as: 'Assamese (অসমীয়া)',
    gu: 'Gujarati (ગુજરાતી)',
    pa: 'Punjabi (પંજાબી)',
    or: 'Odia (ଓଡ଼ିଆ)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    kn: 'Kannada (ಕನ್ನಡ)',
    ml: 'Malayalam (മലയാളം)',
    ur: 'Urdu (اردو)',
    sa: 'Sanskrit (संस्कृतम्)',
    mni: 'Manipuri (মৈতৈলোন্)'
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
