import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'hi',
        fallbackLng: 'hi',
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        backend: {
            loadPath: () => {
                const timestamp = new Date().getTime();
                console.log('Context: i18n loading with timestamp:', timestamp);
                return `/locales/{{lng}}/{{ns}}.json?v=${timestamp}`;
            },
        },
    });

export default i18n;
