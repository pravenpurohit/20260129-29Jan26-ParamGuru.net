import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageName = process.argv[2];

if (!pageName) {
    console.error("Please provide a page name. Usage: npm run gen:page PageName");
    process.exit(1);
}

// 1. Create Page Component
const pagesDir = path.join(__dirname, '../src/pages');
const componentPath = path.join(pagesDir, `${pageName}.jsx`);

if (fs.existsSync(componentPath)) {
    console.error(`Page ${pageName} already exists.`);
    process.exit(1);
}

import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';
import MediaContainer from '../components/common/MediaContainer';
import SEO from '../components/common/SEO';

function ${ pageName } () {
    const { t } = useTranslation();
    const key = '${pageName.toLowerCase()}';

    return (
        <div className="${pageName.toLowerCase()}-container">
            <SEO
                title={t(\`\${key}.title\`)}
            description={t(\`\${key}.description\`)}
            />

            <PageHeader
                title={t(\`\${key}.title\`)}
            subtitle={t(\`\${key}.subtitle\`)} 
            />

            <div className="content-block" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <p>{t(\`\${key}.description\`)}</p>

                {/* 
                   Example Media Usage:
                   
                   1. YouTube Video:
                   <MediaContainer 
                       type="youtube"
                       src="https://www.youtube.com/embed/YOUR_ID"
                       caption="Spiritual Discourse"
                   />

                   2. Audio Track:
                   <MediaContainer 
                       type="audio"
                       src="/assets/audio/chant.mp3"
                       caption="Morning Chants"
                   />

                   3. Direct Video File:
                   <MediaContainer 
                       type="video"
                       src="/assets/video/lecture.mp4"
                       caption="Master's Speech"
                   />
                */}
            </div>
        </div>
    );
}

export default ${ pageName };
`;

fs.writeFileSync(componentPath, componentTemplate);
console.log(`Created ${ componentPath } `);

// 2. Update Routes Config
const routesPath = path.join(__dirname, '../src/config/routes.jsx');
let routesContent = fs.readFileSync(routesPath, 'utf8');

// Add Import
if (!routesContent.includes(`import ${ pageName } `)) {
    routesContent = `import ${ pageName } from '../pages/${pageName}'; \n` + routesContent;
}

// Add Route Entry
const routeEntry = `
{
    path: "/${pageName.toLowerCase()}",
        key: "${pageName.toLowerCase()}",
            element: <${pageName} />,
                showInNav: true
}, `;

// Insert before the last closing bracket, ensuring preceding comma
const lastObjectRegex = /\s*}\s*];\s*$/;
const match = routesContent.match(lastObjectRegex);

if (match) {
    // Found the end. We assume the last item ends with '}', so we append ',' and then the new item.
    // However, if the last item already has a comma (rare in this specific manual file), this might double it. 
    // But standard JSON-like structure here usually ends } without comma.
    // Safer approach: Replace the last } with },

    // Actually, simpler: replace the array closing `]; ` with `, ${ routeEntry } \n]; `
    // But we need to make sure we don't duplicate commas if one exists.
    // Let's just assume standard formatting where last item lacks comma.

    routesContent = routesContent.replace(/\s*];\s*$/, `, \n${ routeEntry } \n]; `);
} else {
    // Fallback if regex fails (e.g. empty array)
    routesContent = routesContent.replace(/];\s*$/, `${ routeEntry } \n]; `);
}

fs.writeFileSync(routesPath, routesContent);
console.log(`Updated ${ routesPath } `);

// 3. Update Translation (Source: Hindi)
const hiPath = path.join(__dirname, '../public/locales/hi/translation.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const key = pageName.toLowerCase();
hiData[key] = {
    title: `${ pageName } (Hindi Title)`,
    subtitle: `${ pageName } (Hindi Subtitle)`,
    description: `${ pageName } description...`
};

// Add nav key
if (!hiData.nav) hiData.nav = {};
hiData.nav[key] = pageName; // Default to English name, user should translate

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log(`Updated ${ hiPath } `);

console.log(`\nSUCCESS: Page ${ pageName } created!`);
console.log(`Run 'npm run i18n:sync' to generate other languages.`);
