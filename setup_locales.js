import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'public', 'locales');

const languages = {
    en: {
        title: "ParamGuru",
        welcome: "Website implementation coming soon.",
        instruction: "Please upload your photos to public/assets and CSV files to public/data.",
        change_language: "Change Language"
    },
    hi: {
        title: "परमगुरु",
        welcome: "वेबसाइट का कार्यान्वयन जल्द आ रहा है।",
        instruction: "कृपया अपनी तस्वीरें public/assets और CSV फाइलें public/data में अपलोड करें।",
        change_language: "भाषा बदलें"
    },
    fr: {
        title: "ParamGuru",
        welcome: "La mise en œuvre du site Web arrive bientôt.",
        instruction: "Veuillez télécharger vos photos sur public/assets et vos fichiers CSV sur public/data.",
        change_language: "Changer de langue"
    },
    de: {
        title: "ParamGuru",
        welcome: "Die Website-Implementierung kommt bald.",
        instruction: "Bitte laden Sie Ihre Fotos in public/assets und CSV-Dateien in public/data hoch.",
        change_language: "Sprache ändern"
    },
    zh: {
        title: "ParamGuru",
        welcome: "网站实施即将推出。",
        instruction: "请将您的照片上传到 public/assets，将 CSV 文件上传到 public/data。",
        change_language: "改变语言"
    },
    ja: {
        title: "ParamGuru",
        welcome: "ウェブサイトの実装は近日公開予定です。",
        instruction: "写真を public/assets に、CSV ファイルを public/data にアップロードしてください。",
        change_language: "言語を変更"
    },
    ru: {
        title: "ParamGuru",
        welcome: "Реализация веб-сайта скоро появится.",
        instruction: "Пожалуйста, загрузите свои фотографии в public/assets и CSV-файлы в public/data.",
        change_language: "Сменить язык"
    }
};

if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
}

for (const [lang, translations] of Object.entries(languages)) {
    const langDir = path.join(localesDir, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }

    const filePath = path.join(langDir, 'translation.json');
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`Created ${lang}/translation.json`);
}
