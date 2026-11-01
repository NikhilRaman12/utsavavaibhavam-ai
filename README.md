# 🪔 UtsavaVaibhavam AI (उत्सववैभवम् AI)

### *Multimodal Agentic AI Event Experience, Scenography & Run-of-Show Orchestration Platform*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Backend-Express%20%2B%20TSX-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Google GenAI SDK](https://img.shields.io/badge/AI-@google%2Fgenai%202.32-F59E0B)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Project Overview

**UtsavaVaibhavam AI (उत्सववैभवम् AI)** bridges cultural grandeur (*Utsava & Vaibhavam*) with a multimodal, consumer-grade **GenAI Event Experience Platform**. Built for families, luxury wedding producers, cultural committees, and corporate hosts, it replaces fragmented spreadsheets with a visual-first experience workspace for **South Indian Temple & Heritage Muhurthams (Kumbakonam), Royal Multi-Day Shaadis, Western Receptions, Milestone Birthdays, and Community Festivals**.

### 🔗 Live Demo & Preview Links
- **Shared Application Preview**: [https://ais-pre-kyyfh2afsrg6kj4hm5phrr-75524930862.asia-east1.run.app](https://ais-pre-kyyfh2afsrg6kj4hm5phrr-75524930862.asia-east1.run.app)
- **GitHub Repository**: [https://github.com/NikhilRaman12/utsavavaibhavam-ai](https://github.com/NikhilRaman12/utsavavaibhavam-ai)

---

## 🏗️ System Architecture

UtsavaVaibhavam AI runs as a unified full-stack TypeScript application (`server.ts`) serving both an Express API layer (`/api/agent/*`) and the React 19 + Tailwind CSS v4 SPA via Vite middleware in development and static asset serving in production. All Gemini API calls execute strictly server-side using the official `@google/genai` SDK so API keys are never exposed in client bundles.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                     React 19 + TypeScript Frontend (SPA)                   │
│  ┌──────────────┐ ┌────────────────┐ ┌───────────────┐ ┌────────────────┐  │
│  │  Vibe Feed & │ │ Chrono Visual  │ │ 360° Spatial  │ │ Smart Wallet & │  │
│  │ Story Reels  │ │  Storyboard    │ │ Venue Canvas  │ │ Vendor Concierge│ │
│  └──────┬───────┘ └───────┬────────┘ └───────┬───────┘ └───────┬────────┘  │
│         └─────────────────┴─────────┬────────┴─────────────────┘           │
│                                     ▼                                      │
│        Multimodal Omni-Bar (Voice Memo · Vision Scan · PDF Exporter)       │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ HTTP JSON (/api/agent/*)
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                  Express.js Server (`server.ts` on Port 3000)              │
│   • POST /api/agent/architect         (gemini-3.8-flash structured JSON)   │
│   • POST /api/agent/multimodal-vision (gemini-3.8-flash image analysis)    │
│   • POST /api/agent/voice-brief       (gemini-3.5-transcribe + flash)      │
│   • POST /api/agent/tts-announce      (gemini-3.8-flash-lite-tts WAV)      │
│   • POST /api/agent/grounding-search  (gemini-3.8-flash + googleSearch)    │
│   • POST /api/agent/optimize-budget   (gemini-3.8-flash value engineer)    │
│   • POST /api/agent/generate-rfp      (gemini-3.8-flash vendor SLA/RFP)    │
│   • POST /api/agent/chat              (gemini-3.8-flash executable actions)│
└────────────────────────────────────────────────────────────────────────────┘
```

### Repository Structure
```text
├── .env.example                        # Safe environment variable template (placeholders only)
├── .gitignore                          # Excludes node_modules, dist, .env*, logs, and secrets
├── index.html                          # Entry HTML with Google Fonts (Playfair, Plus Jakarta, JetBrains Mono)
├── metadata.json                       # Application metadata and capability declarations
├── package.json                        # Scripts and dependencies (@google/genai, react, express, jspdf)
├── server.ts                           # Full-stack Express + Vite server & 8 Gemini API routes
├── tsconfig.json                       # TypeScript compiler configuration
├── vite.config.ts                      # Vite + React + Tailwind v4 configuration
└── src/
    ├── App.tsx                         # Main Multimodal Event Experience workspace
    ├── index.css                       # Editorial Warm Ivory & Marigold Gold design system tokens
    ├── main.tsx                        # React 19 DOM root mount
    ├── components/
    │   ├── PdfExportModal.tsx          # Interactive A4 PDF preview & customization modal
    │   ├── ScenographyArtwork.tsx      # 9 custom architectural SVG scenography moodboards
    │   └── SpatialVenueCanvas.tsx      # Interactive 360° Spatial Venue Blueprint & hotspot inspector
    ├── data/
    │   └── eventArchetypes.ts          # Pre-configured Kumbakonam, Shaadi, Wedding, Birthday & Gala templates
    ├── types/
    │   └── event.ts                    # TypeScript interfaces for timelines, visual cues, budgets & vendors
    └── utils/
        └── pdfExporter.ts              # Multi-page vector A4 PDF generator (jsPDF + HTML5 Canvas thumbnails)
```

---

## ✨ Key Features

1. **Instagram-Style Ceremony Story Reels & Lookbook Vibe Feed**:
   - Interactive horizontal Story Rings for every event milestone—tap any ring to launch a fullscreen Story Player with scenography artwork, lighting/DMX cues, and spoken AI voiceover.
   - Editorial Lookbook Feed with 1-click **"Lock into My Event Plan"** promotion that simultaneously updates the Chrono Storyboard and Smart Wallet.
2. **Pre-Loaded Kumbakonam Chola Heritage Muhurtham Sample Plan (`₹18,48,000` / `350 Guests`)**:
   - Complete Tamil Brahmin / Cauvery Delta wedding blueprint at **Mantra Koodam / Cauvery Heritage Mandapam, Kumbakonam**, featuring *Janavasam*, *Kashi Yatra*, *Agrahara Brass Oonjal Swing*, *Subha Muhurtham Mangalya Dharanam*, *3-Batch 24-Item Banana Leaf Elai Sapadu*, *Live Brass Davarah-Tumbler Degree Filter Coffee*, and *GI-Tagged Swamimalai Bronze Lamp Thamboolam*.
3. **Chrono-Synchronized Visual Storyboard with Image Attachments**:
   - High-impact milestones feature visual reference banners, lighting/audio cues, and an interactive **Attach / Edit Visual Reference Studio** supporting 9 custom architectural SVG presets, local photo uploads (`FileReader`), or custom image URLs.
4. **Interactive 360° Spatial Venue Canvas**:
   - Top-down architectural floorplan with clickable spatial zones displaying capacity, acoustic isolation, lighting specs, power loads, and rain/crowd contingencies.
5. **Smart Wallet & Gemini Value-Engineering**:
   - Real-time dual-currency (`₹ INR` and `$ USD`) tracking of Target Budget, Committed Spend, Paid-to-Date, Per-Guest Spend, and Category Share-of-Spend, paired with 1-click AI budget rebalancing.
6. **Vendor Concierge with Live Google Search Grounding & Automated RFP/SLA Generator**:
   - Discover real local venues, caterers, and decorators with verifiable web citations using `gemini-3.8-flash` + `googleSearch`, and generate formal RFP emails and SLA contract clauses per vendor.
7. **Multimodal Vision Scanner, Voice Briefs & Spoken AI Emcee (TTS)**:
   - Upload any decor photo or vendor quote for instant cost & color-palette extraction (`gemini-3.8-flash`), record spoken voice notes (`gemini-3.5-transcribe`), or play natural spoken stage announcements (`gemini-3.8-flash-lite-tts`).
8. **Multi-Page Formatted A4 PDF Production Report Exporter**:
   - Generates and downloads a vector A4 PDF (`jspdf`) complete with an executive cover banner, KPI summary strip, RGB color palette swatches, Run-of-Show cards with embedded visual thumbnails & lighting cues, category allocation bars, itemized budget ledger, vendor SLA roster, and sign-off block.

---

## ⚙️ Prerequisites

- **Node.js**: `v18.18+` or `v20+` (recommended)
- **Package Manager**: `npm` (v9+) or `bun`
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/apikey)

---

## 🚀 Installation & Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NikhilRaman12/utsavavaibhavam-ai.git
   cd utsavavaibhavam-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env` and add your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   PORT="3000"
   ```

---

## 💻 Run, Build & Verification Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the full-stack Express + Vite server with `tsx server.ts` on `http://localhost:3000` |
| `npm run build` | Compiles the production frontend bundle into `dist/` via Vite |
| `npm run lint` | Runs TypeScript static type-checking (`tsc --noEmit`) across frontend and server code |
| `npm start` | Runs the production server (`node server.ts`) serving built assets and `/api/agent/*` routes |

---

## ☁️ Deployment Instructions

### Option 1: Google Cloud Run / Container Deployment
1. Build the frontend assets:
   ```bash
   npm run build
   ```
2. Set the `GEMINI_API_KEY` environment secret and `NODE_ENV=production` in your Cloud Run service or container runtime.
3. Start the server on port `3000` (or `$PORT`):
   ```bash
   npx tsx server.ts
   ```

### Option 2: Standard Node.js / VPS Host (Render, Railway, Fly.io)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx tsx server.ts`
- **Environment Variables**: `GEMINI_API_KEY`, `NODE_ENV=production`, `PORT=3000`

---

## ⚠️ Limitations & Security Notes

- **API Key Requirement**: Live AI synthesis, multimodal vision scanning, voice transcription, TTS audio playback, and Google Search grounding require a valid `GEMINI_API_KEY` set in the server environment. All pre-loaded event archetypes (including the Kumbakonam Wedding Plan), interactive storyboard editing, budget calculations, and PDF report exports work offline/client-side without an API key.
- **Session Persistence**: Event plan edits and uploaded visual reference photos are maintained in browser state during your active session; export your plan via **Export PDF Report (`.pdf`)** or **Download Raw Markdown (`.md`)** to archive copies locally.
- **Zero Client-Side Secret Exposure**: Never place `GEMINI_API_KEY` in `VITE_*` variables; all Gemini SDK calls are proxied through `/api/agent/*` in `server.ts`.

---

## 📜 License

Distributed under the MIT License.
