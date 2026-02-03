
import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LANGUAGES = {
    // Indic
    hi: { label: 'Hindi (हिन्दी)', group: 'Indic' },
    bn: { label: 'Bengali (বাংলা)', group: 'Indic' },
    as: { label: 'Assamese (অসমীয়া)', group: 'Indic' },
    gu: { label: 'Gujarati (ગુજરાતી)', group: 'Indic' },
    pa: { label: 'Punjabi (પંજાબી)', group: 'Indic' },
    or: { label: 'Odia (ଓଡ଼ିଆ)', group: 'Indic' },
    ta: { label: 'Tamil (தமிழ்)', group: 'Indic' },
    te: { label: 'Telugu (తెలుగు)', group: 'Indic' },
    kn: { label: 'Kannada (ಕನ್ನಡ)', group: 'Indic' },
    ml: { label: 'Malayalam (മലയാളം)', group: 'Indic' },
    ur: { label: 'Urdu (اردو)', group: 'Indic' },
    sa: { label: 'Sanskrit (संस्कृतम्)', group: 'Indic' },
    mni: { label: 'Manipuri (মৈতৈলোন্)', group: 'Indic' },

    // Global
    en: { label: 'English', group: 'Global' },
    fr: { label: 'French (Français)', group: 'Global' },
    de: { label: 'German (Deutsch)', group: 'Global' },
    zh: { label: 'Chinese (中文)', group: 'Global' },
    ja: { label: 'Japanese (日本語)', group: 'Global' },
    ru: { label: 'Russian (Русский)', group: 'Global' },
};


const LanguageSelector = ({ complexityMode, setComplexityMode }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sortedLanguages = useMemo(() => {
        const userLocales = navigator.languages || [navigator.language];
        const suggested = [];
        const indic = [];
        const global = [];

        Object.keys(LANGUAGES).forEach(code => {
            const langData = { code, ...LANGUAGES[code] };
            const isSuggested = userLocales.some(locale =>
                locale.toLowerCase().startsWith(code.toLowerCase())
            );

            if (isSuggested) {
                suggested.push(langData);
            } else if (langData.group === 'Indic') {
                indic.push(langData);
            } else {
                global.push(langData);
            }
        });

        return { suggested, indic, global };
    }, []);

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    const currentLangLabel = LANGUAGES[i18n.language]?.label || 'Select Language';

    return (
        <div className="language-selector-wrapper">

            {/* Mode Segmented Control */}
            <div className="mode-segmented-control">
                <button
                    onClick={() => setComplexityMode('translation')}
                    className={`mode-btn ${complexityMode === 'translation' ? 'active' : ''}`}
                >
                    <span>🕉️</span>
                    <span>Original Spiritual</span>
                </button>

                <button
                    onClick={() => setComplexityMode('simplified')}
                    className={`mode-btn ${complexityMode === 'simplified' ? 'active' : ''}`}
                >
                    <span>😊</span>
                    <span>Simplified</span>
                </button>
            </div>

            {/* Language Dropdown */}
            <div className="language-selector-container" ref={dropdownRef}>
                <button
                    className={`lang-toggle-btn ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Change Language"
                    aria-expanded={isOpen}
                >
                    <span className="globe-icon">🌐</span>
                    <span className="current-lang-label">{currentLangLabel}</span>
                    <span className="arrow-icon">▼</span>
                </button>

                {isOpen && (
                    <div className="lang-dropdown">
                        {sortedLanguages.suggested.length > 0 && (
                            <div className="lang-group">
                                <h4 className="group-title">Suggested</h4>
                                {sortedLanguages.suggested.map(lang => (
                                    <button
                                        key={lang.code}
                                        className={`lang-option ${i18n.language === lang.code ? 'selected' : ''}`}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="lang-group">
                            <h4 className="group-title">Indian Languages</h4>
                            <div className="lang-grid">
                                {sortedLanguages.indic.map(lang => (
                                    <button
                                        key={lang.code}
                                        className={`lang-option ${i18n.language === lang.code ? 'selected' : ''}`}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lang-group">
                            <h4 className="group-title">Global Languages</h4>
                            <div className="lang-grid">
                                {sortedLanguages.global.map(lang => (
                                    <button
                                        key={lang.code}
                                        className={`lang-option ${i18n.language === lang.code ? 'selected' : ''}`}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageSelector;
