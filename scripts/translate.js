
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
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

// --- Initialization ---
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
    const instructionRegex = /^\*\s*\*\*([a-z]{2,3}(?:_simple)?)(?:\s*\(.*?\))?:\*\*\s*(.*)/;

    lines.forEach(line => {
        const match = line.trim().match(instructionRegex);
        if (match) {
            const key = match[1];
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

// Initialize Model
const model = genAI.getGenerativeModel({
    model: CONFIG.modelName,
    systemInstruction: {
        role: "system",
        parts: [{ text: PROMPTS.system }],
    },
});

// --- Helpers ---
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

function getHash(text) {
    return crypto.createHash("sha256").update(text || "").digest("hex");
}

// --- Translation Function ---
async function translateBatchWithRetry(batch, targetLang, retries = 0) {
    // Construct Prompt with Dual Instructions
    const highKey = targetLang;
    const simpleKey = `${targetLang}_simple`;

    // Fallback if key missing (e.g. for regional languages if not explicit)
    const highInstr = PROMPTS.languages[highKey] || "Translate with deep spiritual reverence.";
    const simpleInstr = PROMPTS.languages[simpleKey] || "Translate into plain, common language (B1 Level).";

    const prompt = `Transform the following Hindi JSON content into ${targetLang}. 
    
    You must provide TWO versions for every key:
    1. 'high': ${highInstr}
    2. 'simple': ${simpleInstr}

    Input JSON:
    ${JSON.stringify(batch, null, 2)}
    
    Output Format:
    Valid JSON where each key maps to an object { "high": "...", "simple": "..." }
    `;

    try {
        const currentModelName = retries === 0 ? CONFIG.modelName : (CONFIG.fallbackModels[retries - 1] || CONFIG.modelName);
        console.log(`[${targetLang}] Attempt ${retries + 1}: Using model ${currentModelName}`);

        const currentModel = genAI.getGenerativeModel({
            model: currentModelName,
            systemInstruction: model.systemInstruction
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
            return translateBatchWithRetry(batch, targetLang, retries + 1);
        }
        return null;
    }
}

// --- Main Sync Function ---
async function syncLanguage(targetLang, sourceDataFlat) {
    if (targetLang === CONFIG.sourceLang) {
        // For source lang (Hindi), we typically only need 'simplified' generated, 
        // but to keep logic uniform we can skip 'high' update or just copy source to high.
        // For now, let's process it normally but usually source->source translation is redundant.
        // However, 'hi_simple' is valid. The prompt handles 'hi' instruction as 'Tatsama' which matches source.
        // We will proceed.
    }

    const highPath = path.join(CONFIG.localesDir, targetLang, `translation.json`);
    const simplePath = path.join(CONFIG.localesDir, targetLang, `simplified.json`);
    // We share one meta file for the source hash since the source is the same for both
    const metaPath = path.join(CONFIG.localesDir, targetLang, `meta.json`);

    // Load Existing Data
    let highData = {};
    let simpleData = {};
    let metaData = {};

    try { highData = fs.existsSync(highPath) ? JSON.parse(fs.readFileSync(highPath, 'utf8')) : {}; } catch (e) { }
    try { simpleData = fs.existsSync(simplePath) ? JSON.parse(fs.readFileSync(simplePath, 'utf8')) : {}; } catch (e) { }
    try { metaData = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : {}; } catch (e) { }

    const highFlat = flattenKeys(highData);
    const simpleFlat = flattenKeys(simpleData);

    // 1. Identify Pending Keys
    const pendingKeys = [];
    let removedCount = 0;

    // Check for modifications or missing keys
    Object.keys(sourceDataFlat).forEach(key => {
        const sourceText = sourceDataFlat[key];
        const sourceHash = getHash(sourceText);

        const isMissingVariable = !highFlat.hasOwnProperty(key) || !simpleFlat.hasOwnProperty(key);
        const isChanagedVariable = metaData[key] !== sourceHash;

        if (isMissingVariable || isChanagedVariable) {
            pendingKeys.push(key);
            if (isChanagedVariable && !isMissingVariable) {
                console.log(`[${targetLang}] Key '${key}' changed. Re-translating.`);
            }
        }
        // Update hash buffer (will save later)
        metaData[key] = sourceHash;
    });

    // Clean orphans from memory (not saving yet)
    Object.keys(highFlat).forEach(k => { if (!sourceDataFlat[k]) { delete highFlat[k]; removedCount++; } });
    Object.keys(simpleFlat).forEach(k => { if (!sourceDataFlat[k]) { delete simpleFlat[k]; } });
    // Clean orphans from meta
    Object.keys(metaData).forEach(k => { if (!sourceDataFlat[k]) { delete metaData[k]; } });

    if (pendingKeys.length === 0 && removedCount === 0) {
        console.log(`[${targetLang}] Up to date.`);
        // Save meta to ensure consistency
        fs.writeFileSync(metaPath, JSON.stringify(sortObjectKeys(metaData), null, 2));
        return;
    }

    console.log(`[${targetLang}] Processing ${pendingKeys.length} keys (${removedCount} removed).`);

    // 2. Process Batches
    let newHigh = {};
    let newSimple = {};

    for (let i = 0; i < pendingKeys.length; i += CONFIG.batchSize) {
        const batchKeys = pendingKeys.slice(i, i + CONFIG.batchSize);
        console.log(`[${targetLang}] Batch ${Math.floor(i / CONFIG.batchSize) + 1}/${Math.ceil(pendingKeys.length / CONFIG.batchSize)}...`);

        const batchObj = {};
        batchKeys.forEach(k => batchObj[k] = sourceDataFlat[k]);

        const batchUnflat = unflattenKeys(batchObj);

        // CALL AI
        const dualResult = await translateBatchWithRetry(batchUnflat, targetLang);

        if (dualResult) {
            const dualFlat = flattenKeys(dualResult); // { "key1.high": "...", "key1.simple": "..." }

            // Separate into High and Simple arrays
            // dualResult structure is { key: { high: ..., simple: ... } }
            // deeply nested keys like nav.home -> { nav: { home: { high: ..., simple: ... } } }

            // Proper extraction:
            // We iterate the batch keys, and look them up in the dualResult
            // Note: dualResult has the same structure as input, but leaves are objects {high, simple}

            // Helper to extract leaf value from nested object by dot-path
            const getValue = (obj, pathStr) => {
                return pathStr.split('.').reduce((acc, part) => acc && acc[part], obj);
            };

            batchKeys.forEach(key => {
                const val = getValue(dualResult, key);
                if (val && val.high && val.simple) {
                    newHigh[key] = val.high;
                    newSimple[key] = val.simple;
                } else {
                    console.warn(`[${targetLang}] Missing dual output for key: ${key}`);
                }
            });
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 1000));
    }

    // 3. Merge and Save
    Object.assign(highFlat, newHigh);
    Object.assign(simpleFlat, newSimple);

    const finalHigh = sortObjectKeys(unflattenKeys(highFlat));
    const finalSimple = sortObjectKeys(unflattenKeys(simpleFlat));
    const finalMeta = sortObjectKeys(metaData);

    fs.writeFileSync(highPath, JSON.stringify(finalHigh, null, 2));
    fs.writeFileSync(simplePath, JSON.stringify(finalSimple, null, 2));
    fs.writeFileSync(metaPath, JSON.stringify(finalMeta, null, 2));

    console.log(`[${targetLang}] Sync Complete.`);
}

async function main() {
    console.log("Starting Transcreation Sync (Single-Pass Dual-Mode)...");

    const sourcePath = path.join(CONFIG.localesDir, CONFIG.sourceLang, "translation.json");
    if (!fs.existsSync(sourcePath)) {
        console.error(`Source file not found: ${sourcePath}`);
        process.exit(1);
    }

    const sourceData = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    const sourceDataFlat = flattenKeys(sourceData);

    console.log(`Source Language: ${CONFIG.sourceLang}`);
    console.log(`Total Source Keys: ${Object.keys(sourceDataFlat).length}`);

    for (const lang of CONFIG.targetLangs) {
        await syncLanguage(lang, sourceDataFlat);
    }

    console.log("Global Sync Complete!");
}

main();
