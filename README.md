# ParamGuru Website

A modern, spiritual website built with **React**, **Vite**, and a custom **AI Transcreation Engine** (Single-Pass Dual-Output).

## 📚 Documentation
This repository is strictly documented. Please refer to the specific guide for your role:

*   **🤖 AI Agents & Developers**: [AI_INSTRUCTIONS.md](./AI_INSTRUCTIONS.md) (SOPs, Workflows, Code Review Protocol)
*   **✍️ Content Creators**: [CONTRIBUTING_AUTHORS.md](./CONTRIBUTING_AUTHORS.md) (How to add/edit content)
*   **🏗 Architects**: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) (File tree, Logic, System design)
*   **✅ Quality Assurance**: [CODE_REVIEW_PROMPT.md](./CODE_REVIEW_PROMPT.md) (Mandatory Review Protocol)

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Development
```bash
npm run dev
```

### 3. Add a New Page
```bash
npm run gen:page PageName
```

### 4. Sync Translations
```bash
# Requires .env with GEMINI_API_KEY
npm run i18n:sync
```

## 🧠 Core Features
*   **Dual Mode UI**: Seamless toggle between "Spiritual" (High) and "Simplified" (Conversational) registers.
*   **Smart Sync**: Only translates changed keys (Hash-based detection).
*   **Responsive**: "Glassmorphism" design that works mainly on mobile.
