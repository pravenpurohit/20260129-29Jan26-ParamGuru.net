
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
        "en", "fr", "de", "zh", "ja", "ru", "hi",
        "bn", "as", "gu", "pa", "or", "ta", "te", "kn", "ml", "ur", "sa", "mni"
    ],
    localesDir: path.join(__dirname, "../public/locales"),
    batchSize: 15,
    modelName: "gemini-2.5-pro",
    fallbackModels: ["gemini-pro-latest", "gemini-2.0-flash"],
    maxRetries: 3,
};

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// --- Prompt Loader ---
function loadPrompts() {
    const promptPath = path.join(__dirname, "PROMPTS.md");
    if (!fs.existsSync(promptPath)) {
        console.error("Error: scripts/PROMPTS.md not found.");
        process.exit(1);
    }
    const content = fs.readFileSync(promptPath, "utf8");

    // Extract Sections for Sanitized System Prompt
    // 1. Core: Start to "2. LANGUAGE MODULES"
    const coreMatch = content.match(/^[\s\S]*?(?=\n\*\*2\. LANGUAGE MODULES)/);
    // 2. Verification: "3. MANDATORY VERIFICATION" to "4. OUTPUT FORMAT"
    const verificationMatch = content.match(/\*\*3\. MANDATORY VERIFICATION[\s\S]*?(?=\n\*\*4\. OUTPUT FORMAT)/);
    // 3. Chain of Thought: "5. EXAMPLE CHAIN OF THOUGHT" to End
    const cotMatch = content.match(/### \*\*5\. EXAMPLE CHAIN OF THOUGHT[\s\S]*/);

    const systemPrompt = [
        coreMatch ? coreMatch[0].trim() : "",
        "### ---",
        verificationMatch ? verificationMatch[0].trim() : "",
        "### ---",
        cotMatch ? cotMatch[0].trim() : ""
    ].join('\n\n');

    // Parse Language Instructions
    const langInstructions = {};
    const lines = content.split('\n');

    // Regex to match lines like: * **en (English - Philosophical):** Instruction...
    // or: * **en_simple (English - Simplified B1):** Instruction...
    const instructionRegex = /^\*\s*\*\*([a-z]{2,3}(?:_simple)?)(?:\s*\(.*?\))?:\*\*\s*(.*)/;

    lines.forEach(line => {
        const match = line.trim().match(instructionRegex);
        if (match) {
            const key = match[1]; // e.g., 'en' or 'en_simple'
            const instruction = match[2];
            langInstructions[key] = instruction;
        }
    });

    return {
        system: systemPrompt,
        languages: langInstructions
    };
}

const PROMPTS = loadPrompts();

// Initialize Gemini with Default System Instruction
const model = genAI.getGenerativeModel({
    model: CONFIG.modelName,
    systemInstruction: {
        role: "system",
        parts: [{ text: PROMPTS.system }],
    },
});

// --- Helper Functions ---

function flattenKeys(obj, prefix = "") {
    return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + "." : "";
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
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

function sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return obj;
    }
    return Object.keys(obj).sort().reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
    }, {});
}

async function translateBatchWithRetry(batch, targetLang, retries = 0, systemInstruction = null, promptSuffix = "") {
    // Use default system instruction if not provided
    const sysInstr = systemInstruction || model.systemInstruction;

    // Determine language instruction
    // Lookup e.g. 'en' or 'en_simple'
    const instructionKey = promptSuffix === 'SIMPLIFIED_MODE' ? `${targetLang}_simple` : targetLang;
    const langInstr = PROMPTS.languages[instructionKey] || "Translate with deep spiritual reverence.";

    let prompt = `Transform the following Hindi JSON content into ${targetLang}. Return ONLY valid JSON.
    
    Target Key: ${instructionKey}
    
    SPECIFIC INSTRUCTIONS FOR THIS REGISTER:
    ${langInstr}

    Input JSON:
    ${JSON.stringify(batch, null, 2)}
    
    Output Format:
    Valid JSON matching the input keys.
    `;

    try {
        const currentModelName = retries === 0 ? CONFIG.modelName : (CONFIG.fallbackModels[retries - 1] || CONFIG.modelName);
        console.log(`[${targetLang}] Attempt ${retries + 1}: Using model ${currentModelName}`);

        const currentModel = genAI.getGenerativeModel({
            model: currentModelName,
            systemInstruction: sysInstr
        });

        const result = await currentModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error(`Error translating batch for ${targetLang} (Attempt ${retries + 1}):`, error.message);
        if (retries < (CONFIG.fallbackModels.length + 1)) {
            const delay = (retries + 1) * 2000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return translateBatchWithRetry(batch, targetLang, retries + 1, sysInstr, promptSuffix);
        }
        return null;
    }
}

import crypto from "crypto";

async function processLanguage(targetLang, sourceDataFlat, namespace = "translation") {
    // Special Case: Skip Deep Translation for Source Language (Hindi)
    // We only want to generate Simplified Hindi, not re-translate Deep Hindi to Deep Hindi.
    if (targetLang === CONFIG.sourceLang && namespace === "translation") {
        return;
    }

    const targetPath = path.join(CONFIG.localesDir, targetLang, `${namespace}.json`);
    const metaPath = path.join(CONFIG.localesDir, targetLang, `${namespace}.meta.json`);

    let targetData = {};
    let targetDataFlat = {};
    let metaData = {};

    // Load existing Data
    if (fs.existsSync(targetPath)) {
        try {
            targetData = JSON.parse(fs.readFileSync(targetPath, "utf8"));
            targetDataFlat = flattenKeys(targetData);
        } catch (e) {
            console.warn(`Could not parse existing ${targetLang}/${namespace} file. Starting fresh.`);
        }
    } else {
        fs.mkdirSync(path.join(CONFIG.localesDir, targetLang), { recursive: true });
    }

    // Load Meta Data
    if (fs.existsSync(metaPath)) {
        try {
            metaData = JSON.parse(fs.readFileSync(metaPath, "utf8"));
        } catch (e) { console.warn("Meta file corrupted/missing, rebuilding."); }
    }

    // Helper: Generate Hash
    const getHash = (text) => crypto.createHash("sha256").update(text || "").digest("hex");

    // 1. Cleanup: Remove Orphan Keys (in Target but not in Source)
    let removedCount = 0;
    Object.keys(targetDataFlat).forEach(key => {
        if (!sourceDataFlat.hasOwnProperty(key)) {
            delete targetDataFlat[key];
            delete metaData[key];
            removedCount++;
        }
    });

    // 2. Identify Pending Keys (Missing OR Changed)
    const pendingKeys = [];

    Object.keys(sourceDataFlat).forEach(key => {
        const sourceText = sourceDataFlat[key];
        const sourceHash = getHash(sourceText);

        const isMissing = !targetDataFlat.hasOwnProperty(key);
        const isChanged = metaData[key] !== sourceHash; // True if hash doesn't match stored hash

        if (isMissing || isChanged) {
            pendingKeys.push(key);
            // Log reason for clarity
            if (isChanged && !isMissing) {
                console.log(`[${targetLang}:${namespace}] Key '${key}' changed. Re-translating.`);
            }
        }

        // Always update meta to new hash (will be saved at end)
        metaData[key] = sourceHash;
    });

    if (pendingKeys.length === 0 && removedCount === 0) {
        console.log(`[${targetLang}:${namespace}] Up to date.`);
        // Ensure meta is synced even if no translations needed (e.g. if we just rebuilt meta)
        fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2));
        return;
    }

    console.log(`[${targetLang}:${namespace}] Processing ${pendingKeys.length} keys (${removedCount} removed).`);

    let newTranslationsFlat = {};

    // 3. Translate Pending Keys in Batches
    for (let i = 0; i < pendingKeys.length; i += CONFIG.batchSize) {
        const batchKeys = pendingKeys.slice(i, i + CONFIG.batchSize);
        const batchObj = {};

        batchKeys.forEach((key) => {
            batchObj[key] = sourceDataFlat[key];
        });

        console.log(
            `[${targetLang}:${namespace}] Batch ${Math.floor(i / CONFIG.batchSize) + 1}/${Math.ceil(pendingKeys.length / CONFIG.batchSize)}...`
        );

        const batchObjUnflattened = unflattenKeys(batchObj);

        // Determine instructions based on namespace
        const isSimplified = namespace === "simplified";
        // The Global System prompt is robust enough. We only need to switch the specific language instruction key.
        // We pass a flag to the function to help it select the right key.
        const modeFlag = isSimplified ? "SIMPLIFIED_MODE" : "";

        const translatedBatch = await translateBatchWithRetry(
            batchObjUnflattened,
            targetLang,
            0,
            null, // Use default model system instruction which contains the master prompt
            modeFlag
        );

        if (translatedBatch) {
            const flatTranslated = flattenKeys(translatedBatch);
            Object.assign(newTranslationsFlat, flatTranslated);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 4. Merge & Save
    Object.assign(targetDataFlat, newTranslationsFlat);

    // Write Translation File
    const finalData = unflattenKeys(targetDataFlat);
    const sortedFinalData = sortObjectKeys(finalData);
    fs.writeFileSync(targetPath, JSON.stringify(sortedFinalData, null, 2));

    // Write Meta File (Hashes)
    // We only keep hashes for keys that exist in the final target data
    const finalMeta = {};
    Object.keys(targetDataFlat).forEach(key => {
        if (metaData[key]) finalMeta[key] = metaData[key];
    });
    fs.writeFileSync(metaPath, JSON.stringify(sortObjectKeys(finalMeta), null, 2));

    console.log(`[${targetLang}:${namespace}] Sync Complete.`);
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

    // Process All Languages matches in CONFIG.targetLangs (including 'hi')
    for (const lang of CONFIG.targetLangs) {
        // Deep Mode
        await processLanguage(lang, sourceDataFlat, "translation");
        // Simplified Mode
        await processLanguage(lang, sourceDataFlat, "simplified");
    }

    console.log("Sync Complete!");
}

main();
