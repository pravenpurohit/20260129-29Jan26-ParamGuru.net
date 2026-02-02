
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    sourceLang: "hi",
    targetLangs: [
        "en", "fr", "de", "zh", "ja", "ru",
        "bn", "as", "gu", "pa", "or", "ta", "te", "kn", "ml", "ur", "sa", "mni"
    ],
    localesDir: path.join(__dirname, "../public/locales"),
    batchSize: 15,
    modelName: "gemini-1.5-pro",
    maxRetries: 3,
};

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: CONFIG.modelName,
    systemInstruction: {
        role: "system",
        parts: [
            {
                text: `You are a Senior Principal Architect and Computational Linguist specializing in 'Transcreation' of high-context spiritual philosophy.
Your task is to translate Hindi content into a target language, but NOT literally. You must act as a 'Spiritual Bridge'.

The content is deep Indian spiritual philosophy (Vedanta/Bhakti).
Literal translations lose the 'bhav' (spiritual emotion).
You must expand, explain, and contextualize concepts to preserve the depth.

### Gold Standard Reference (Few-Shot Examples)
Analyze how the Hindi concepts are expanded in English below. Apply this same level of depth to all target languages.

input: {
  "prem_sadna_intro": {
    "title": "प्रेम साधना (Prem Sadna)",
    "preface_heading": "प्रस्तावना",
    "core_philosophy": "प्रेम साधना नहीं है। प्रेम स्वयं समाधि है। श्रद्धा और भक्ति निचली चीजें हैं, प्रेम ऊँची अवस्था है जो भाग्यशालियों को मिल पाती है। प्रेम में प्रेमी और प्रेम पात्र मिल के एक हो जाते हैं, वहाँ न द्वैत रहता है न अद्वैत। बुद्धि खो जाती है, मन लापता हो जाता है, इसी को 'समाधि' कहा जाता है।",
    "meditation_secret": "जो मन को अन्य क्रियाओं द्वारा निर्विषय कर लेते हैं प्रभुज्ञान से या उस आनन्द से वंचित रह जाते हैं। इसी वास्ते जड़ समाधियों में चाहे वह कई दिन की हो जायें, जागने पर वैसा ही निकलेगा जैसा समाधि के पहिले था। इस वास्ते ईश्वर दर्शन की इच्छा रखने वालों को मन को निर्विषय तो बनाना है परन्तु वह या तो किसी सद्गुरु के ध्यान में उसे निर्विषय बनावें या भगवान के किसी स्वरूप में उसे लय कर दें।",
    "power_of_satsang": "सन्त ईश्वर के स्वरूप होते हैं। ईश्वर उन्हीं में बोलता है; इसीलिए सन्तों के शब्द हृदय को पकड़ लेते हैं। वह शब्द बालकों के से शब्द होते हैं परन्तु सन्त उनमें एक और वस्तु भर देते हैं। जहाँ सूर्य का प्रकाश हमें संसार का दर्शन कराता है, वहाँ सन्त के शब्दों का प्रकाश हमें ईश्वर दर्शन कराना है - अर्थात् सन्त आत्म-प्रकाश देते हैं। इसलिए सन्तों का संग या सत्संग ही उपासना कहलाती है।",
    "divine_madness": "जब साधक के हृदय में प्रेम का स्रोत बहने लगता है तब जिज्ञासु उसके साक्षात्कार (दर्शन) के लिये बैचेन हो जाता है। उस समय न उसको क्षुधा रहती है, न प्यास, न निद्रा रहती है, न ज्ञान। दिन रात विरहाग्नि में जलता हुआ बड़-बड़ाया करता है। संसारी लोग ऐसे मनुष्यों को या तो पागल कहते हैं या मदान्ध। वह नहीं जानते कि प्रभु दर्शन के लिए वही अन्तिम द्वार है।",
    "universal_attraction": "प्रेम में एक आकर्षण है, वही हृदय का सुन्दर खिंचाव है। इसी आकर्षण शक्ति से ही तो सारा ब्रह्माण्ड बँधा हुआ है। सूर्य, चन्द्र, ग्रह, नक्षत्र, जीव, जन्तु सब इस आकर्षण में बँधे हुए हैं। जब इस प्रेम अर्थात् आकर्षण में न्यूनता आ जाती है, तभी यह सब अलग-अलग होकर छिन्न-भिन्न हो जाते हैं।"
  }
}

output: {
  "prem_sadna_intro": {
    "title": " The Practice of Divine Love",
    "preface_heading": "Preface",
    "core_philosophy": "Love is not merely a practice or a discipline; Love is *Samadhi* (divine absorption) itself. While faith and devotion are stepping stones, Love is the exalted state reserved for the fortunate few. In true Love, the lover and the Beloved merge into one, transcending concepts of duality or non-duality. In this state, the intellect dissolves and the mind vanishes—this total immersion is what is truly called 'Samadhi'.",
    "meditation_secret": "Those who mechanically silence their minds through forced techniques often remain deprived of true Divine Knowledge and Bliss. They may enter a stale stupor for days, but they awake exactly as they were before. Therefore, seekers of God must indeed quiet the mind, but they should do so by merging it into the loving meditation of a *Sadguru* (True Master) or a divine form.",
    "power_of_satsang": "Saints are the living embodiment of the Divine; it is God who speaks through them. This is why the words of Saints grip the heart. Their words may seem simple, like those of a child, but they are charged with a divine substance. Just as the sun reveals the world to us, the light of a Saint's words reveals God. Thus, *Satsang* (keeping the company of Truth/Saints) is the highest form of worship.",
    "divine_madness": "When the fountain of Love erupts in the heart, the seeker becomes desperate for a glimpse of the Divine. Hunger, thirst, sleep, and worldly knowledge vanish. Burning day and night in the sacred fire of separation (*Viraha*), they may mutter to themselves. The world may call them mad or intoxicated, not realizing that this 'madness' is the final gateway to God-realization.",
    "universal_attraction": "Love is the great gravitational force; it is the beautiful pull of the heart. It is this very power of attraction that holds the entire cosmos together. The sun, the moon, the planets, and all living beings are bound by this magnetic force. When this Love—this attraction—diminishes, things fall apart and scatter into chaos."
  }
}
`,
            },
        ],
    },
});

// --- Language Instructions ---
const LANGUAGE_INSTRUCTIONS = {
    // English & European
    en: "Focus on non-biblical, universal spiritual terminology. Use 'Divine' instead of 'God' where appropriate, 'Self' for Atman, and 'Absorption' for Samadhi.",
    fr: "Use philosophical and mystical French vocabulary (e.g., 'l'Absolu', 'la Félicité'). Ensure the tone is poetic and resonant with French existentialist or mystical literature.",
    de: "Use vocabulary resonating with German Idealism or Mysticism (Eckhartian depth). Use 'Das Göttliche', 'Erleuchtung', 'Hingabe'. Preserve Capitalization of Nouns.",
    ru: "Use terms with resonance in Russian religious philosophy/mysticism (Solovyov, Berdyaev) but retain specific Indian terms (Sansara, Dharma) if no perfect equivalent exists. Tone should be soulful ('dushevny').",

    // East Asian
    zh: "Use Daoist/Buddhist parallels for concepts like Dharma (Fa/Dao) and Karma (Ye), but explicitly clarify the Indian Vedantic context. Do not equate fully if the meaning differs. Use Traditional Chinese characters if appropriate for high culture, or Simplified if standard.",
    ja: "Use Zen/Buddhist terminology for non-dual concepts (e.g., 'Satori' for realization, but 'Samadhi' is understood). Use polite and reverent forms (Keigo) suitable for spiritual discourse.",

    // South Asian (Indic) - General Rule: Retain Tatsama
    bn: "Heavily Sanskritized 'Sadhu Bhasha' influence is preferred for spiritual text. Retain Sanskrit terms (Tatsama) like 'Dharma', 'Prem', 'Bhakti' as they carry the vibration better than colloquial Bengali.",
    as: "Similar to Bengali, use High Assamese with clear Sanskrit roots for spiritual terms. Retain the 'bhav'.",
    or: "Use Literary Odia. Retain Sanskrit terms widely used in Jagannath culture/Bhakti traditions of Odisha.",
    gu: "Use the language of Narsi Mehta/Bhakti tradition. Strong emotional resonance. Retain Sanskrit spiritual vocabulary.",
    pa: "Use Gurmukhi script. Resonance with Gurbani/Sikh spiritual terminology is excellent (e.g., 'Akal', 'Nirankar', 'Bhakti'). Use respectful language.",
    mr: "Use the language of Sant Tukaram/Varkari tradition. It is deeply emotional and philosophical.",

    // Dravidian - Specific nuances
    ta: "Use deep literary/Bhakti Tamil (Tevaram/Tiruvacakam style). While Tamil has its own pure spiritual vocabulary, for specific Vedantic terms like 'Samadhi' or 'Atman', retain them if a pure Tamil equivalent loses the specific nuance. Balance 'Senthamizh' with necessary Sanskrit loans.",
    te: "Telugu spiritual discourse is historically heavily Sanskritized. Maintain this high register. Do not use colloquial Telugu.",
    kn: "Use the 'Halegannada' or 'Nadugannada' resonance found in Vachana Sahitya if appropriate, or modern high-register Kannada rich in Sanskrit.",
    ml: "Malayalam has the highest Sanskrit influence. Use this to your advantage to create highly resonant spiritual text (Manipravalam style influence).",

    // Others
    ur: "CRITICAL: Use high-register, spiritually resonant Urdu vocabulary (Perso-Arabic roots) appropriate for Sufi/Bhakti contexts (e.g., 'Ishq-e-Haqiqi', 'Fana', 'Ma'arifat'). Avoid Hindi/Sanskrit terms if a soulful Urdu equivalent exists.",
    sa: "Translate into simple, elegant Sanskrit. Use clear Vibhakti. This acts as a 'back-translation' to the source roots.",
    mni: "Use Meitei Mayek script. Bridge the concepts to Meitei spiritual philosophy (Sanamahi) where parallels exist, but keep Vedantic core intact."
};


// --- Helper Functions ---

function flattenKeys(obj, prefix = "") {
    return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + "." : "";
        if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
        ) {
            Object.assign(acc, flattenKeys(obj[key], pre + key));
        } else {
            acc[pre + key] = obj[key];
        }
        return acc;
    }, {});
}

function unflattenKeys(data) {
    const result = {};
    Object.keys(data).sort().forEach(key => {
        const keys = key.split('.');
        let current = result;
        keys.forEach((k, i) => {
            if (i === keys.length - 1) {
                current[k] = data[key];
            } else {
                current[k] = current[k] || {};
                current = current[k];
            }
        });
    });
    return result;
}

// Function to recursively sort keys of an object
function sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return obj;
    }
    return Object.keys(obj).sort().reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
    }, {});
}


async function translateBatchWithRetry(batch, targetLang, retries = 0) {
    let prompt = `Translate the following Hindi JSON content into ${targetLang}. 
    Return ONLY valid JSON.
    
    Target Language: ${targetLang}
    
    TARGET LANGUAGE INSTRUCTIONS (CRITICAL):
    ${LANGUAGE_INSTRUCTIONS[targetLang] || "Translate with deep spiritual reverence."}
    
    Input JSON:
    ${JSON.stringify(batch, null, 2)}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error(`Error translating batch for ${targetLang} (Attempt ${retries + 1}):`, error.message);
        if (retries < CONFIG.maxRetries) {
            console.log(`Retrying in ${(retries + 1) * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, (retries + 1) * 2000));
            return translateBatchWithRetry(batch, targetLang, retries + 1);
        }
        return null;
    }
}

async function processLanguage(targetLang, sourceDataFlat) {
    const targetPath = path.join(CONFIG.localesDir, targetLang, "translation.json");
    let targetData = {};
    let targetDataFlat = {};

    if (fs.existsSync(targetPath)) {
        try {
            targetData = JSON.parse(fs.readFileSync(targetPath, "utf8"));
            targetDataFlat = flattenKeys(targetData);
        } catch (e) {
            console.warn(`Could not parse existing ${targetLang} file. Starting fresh.`);
        }
    } else {
        fs.mkdirSync(path.join(CONFIG.localesDir, targetLang), { recursive: true });
    }

    // 1. Cleanup: Remove Orphan Keys (in Target but not in Source)
    let removedCount = 0;
    Object.keys(targetDataFlat).forEach(key => {
        if (!sourceDataFlat.hasOwnProperty(key)) {
            delete targetDataFlat[key];
            removedCount++;
        }
    });
    if (removedCount > 0) {
        console.log(`[${targetLang}] Removed ${removedCount} orphan keys.`);
    }

    // 2. Identify Missing Keys (in Source but not in Target)
    const missingKeys = [];
    Object.keys(sourceDataFlat).forEach(key => {
        if (!targetDataFlat.hasOwnProperty(key) || targetDataFlat[key] === "") {
            missingKeys.push(key);
        }
    });

    if (missingKeys.length === 0 && removedCount === 0) {
        console.log(`[${targetLang}] Up to date.`);
        // Still, let's sort and write to ensure order
        const sortedData = sortObjectKeys(unflattenKeys(targetDataFlat));
        fs.writeFileSync(targetPath, JSON.stringify(sortedData, null, 2));
        return;
    }

    console.log(`[${targetLang}] Found ${missingKeys.length} missing keys.`);

    let newTranslationsFlat = {};

    // 3. Translate Missing Keys in Batches
    for (let i = 0; i < missingKeys.length; i += CONFIG.batchSize) {
        const batchKeys = missingKeys.slice(i, i + CONFIG.batchSize);
        const batchObj = {};
        batchKeys.forEach((key) => {
            batchObj[key] = sourceDataFlat[key];
        });

        console.log(
            `[${targetLang}] Translating batch ${Math.floor(i / CONFIG.batchSize) + 1}/${Math.ceil(
                missingKeys.length / CONFIG.batchSize
            )}...`
        );

        // Unflatten batch for better context in translation
        const batchObjUnflattened = unflattenKeys(batchObj);

        const translatedBatch = await translateBatchWithRetry(batchObjUnflattened, targetLang);

        if (translatedBatch) {
            const flatTranslated = flattenKeys(translatedBatch);
            Object.assign(newTranslationsFlat, flatTranslated);
        }

        // Rate limit protection
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 4. Merge & Sort
    Object.assign(targetDataFlat, newTranslationsFlat);
    const finalData = unflattenKeys(targetDataFlat);
    const sortedFinalData = sortObjectKeys(finalData);

    fs.writeFileSync(targetPath, JSON.stringify(sortedFinalData, null, 2));
    console.log(`[${targetLang}] Updated and Sorted.`);
}

async function main() {
    const sourcePath = path.join(CONFIG.localesDir, CONFIG.sourceLang, "translation.json");
    if (!fs.existsSync(sourcePath)) {
        console.error(`Source file not found: ${sourcePath}`);
        process.exit(1);
    }

    const sourceData = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    const sourceDataFlat = flattenKeys(sourceData);

    console.log("Starting Transcreation Sync...");
    console.log(`Source Language: ${CONFIG.sourceLang}`);
    console.log(`Total Source Keys: ${Object.keys(sourceDataFlat).length}`);

    for (const lang of CONFIG.targetLangs) {
        await processLanguage(lang, sourceDataFlat);
    }

    console.log("Sync Complete!");
}

main();
