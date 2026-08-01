# Golden Penny - Personal Wealth OS: Complete Project Documentation

> **Notice for Antigravity AI Agent & Developers**: This document contains full technical specifications, architecture decisions, feature blueprints, file structures, and deployment instructions to seamlessly manage, build, push to GitHub, and deploy Golden Penny to an Ubuntu VPS (Coolify Panel).

---

## 1. Executive Summary & Application Overview

**Golden Penny (Personal Wealth OS)** is an enterprise-grade personal finance, wealth tracking, and automated cash-flow management application. It empowers users to monitor bank accounts, multi-currency transactions, mutual fund SIP investments, upcoming EMI/utility alerts with WhatsApp integration, AI-driven financial insights, and complete JSON data backups.

### Key Capabilities
- **Strict Multi-Currency Mode**: Real-time conversion across INR (₹), USD ($), EUR (€), and GBP (£).
- **Wealth & SIP Portfolio Tracker**: Tracks Nifty 50, Mutual Funds, Crypto, Gold, and future wealth compounding projections.
- **Alerts & Reminders Hub**: Monitors GST filings, EMIs, insurance renewals, credit card bills, and dispatches direct WhatsApp messages to `+91 9804791288` or browser push notifications.
- **Multi-LLM AI Engine**: Integrated support for Gemini 3.6 Flash, ChatGPT (`gpt-4o-mini`), and OpenRouter with key configuration and fallback AI parsing.
- **User Profile & Custom Avatars**: Custom photo URLs, profile editing, and user preference persistence.
- **Full Data Backup & Double-Confirmation Reset**: One-click JSON exports/imports and safety-controlled database resetting.
- **Responsive Dark/Gold Luxury Design System**: Framed with custom vector gold GP coin emblems (`Logo.tsx`, `/public/logo-emblem.svg`, `/public/logo-full.svg`).

---

## 2. Tech Stack & Architecture

- **Frontend Framework**: React 18+ with TypeScript & Vite
- **Styling**: Tailwind CSS with custom dark luxury glassmorphism palette (`#131316`, `#18181B`, `#27272A`, Gold `#F59E0B`)
- **Icons**: Lucide React (`lucide-react`)
- **Backend Service**: Custom Express Node.js Server (`server.ts` bundled into self-contained `dist/server.cjs` via `esbuild`)
- **AI Integration**: `@google/genai` TypeScript SDK (server-side proxy on `/api/chat` using `GEMINI_API_KEY`)
- **Port & Ingress**: Port `3000` (Production Cloud Run / Docker / Coolify container compatible)

---

## 3. Directory & File Structure

```
├── public/
│   ├── logo-emblem.svg          # High-resolution standalone Gold GP emblem (Transparent SVG)
│   ├── logo-full.svg            # Full horizontal Golden Penny typography logo (Transparent SVG)
├── src/
│   ├── components/
│   │   ├── accounts/            # Bank accounts & wallet connection cards
│   │   ├── ai/                  # Multi-LLM AI Assistant interface
│   │   ├── alerts/              # Payment Alerts, Reminders & WhatsApp dispatch
│   │   ├── bills/               # Bill tracker & subscription management
│   │   ├── budgets/             # Category budget limits & spend tracking
│   │   ├── common/
│   │   │   ├── AuthModal.tsx    # Security modal with Golden Penny logo
│   │   │   ├── Header.tsx       # Top navigation header with notifications bell
│   │   │   ├── Logo.tsx         # Vector SVG Gold GP Logo component (full/emblem)
│   │   │   ├── Modals.tsx       # Transaction entry modals
│   │   │   └── Sidebar.tsx      # Sidebar navigation with gold brand logo
│   │   ├── dashboard/           # Main financial metrics overview
│   │   ├── guide/               # 3-Part Master User Guide (Basic, Inter, Advanced & VPS)
│   │   ├── investments/         # Mutual Funds, SIP Calculator & Stock portfolio
│   │   ├── settings/            # Profile photo editor, Multi-currency, Backup/Restore & Reset
│   │   └── transactions/        # Statement table & AI Bank Statement CSV Parser
│   ├── context/
│   │   └── FinanceContext.tsx   # Global state manager for transactions, accounts, alerts, user profile & JSON backup
│   ├── mockData.ts              # Seed initial dataset for financial accounts
│   ├── types.ts                 # TypeScript interfaces (Transaction, Account, AlertItem, UserProfile, etc.)
│   ├── App.tsx                  # Main tab router & shell layout
│   └── main.tsx                 # React DOM entry point
├── server.ts                    # Express server entry point (Bundles into dist/server.cjs)
├── metadata.json                # AI Studio application metadata
├── package.json                 # Node dependencies, dev/build/start scripts
└── PROJECT_DOCUMENTATION.md     # Project documentation & Antigravity handoff guide
```

---

## 4. Key Implementation Logs & Bug Fixes

1. **Logo & Brand Asset Vectorization**:
   - Replaced temporary/broken image links with dedicated inline vector SVG components (`Logo.tsx`) and static transparent SVG files in `/public/logo-emblem.svg` and `/public/logo-full.svg`.
   - Styled with gold gradient fills (`#FFF1B8` -> `#F59E0B` -> `#D97706`) and dark transparent background compatibility.

2. **Server Deployment Fix (Cloud Run & VPS Compatibility)**:
   - Fixed CommonJS bundle runtime error (`ERR_INVALID_ARG_TYPE: fileURLToPath`) by removing `import.meta.url` references from `server.ts`.
   - Updated `server.ts` to read `process.env.PORT` dynamically with fallback to `3000`.
   - Static asset resolution updated to `path.join(process.cwd(), 'dist')`.

3. **Master User Guide & VPS Documentation**:
   - Created `/src/components/guide/UserGuideScreen.tsx` with 3 levels: Basic, Intermediate, and Advanced & VPS Deployment.
   - Added explicit steps for deploying on Ubuntu VPS via Coolify Panel.

4. **Multi-Currency & Data Management**:
   - Enforced strict currency symbols (INR `₹`, USD `$`, EUR `€`, GBP `£`) across all dashboards, tables, and PDF statement exports.
   - Built double-confirmation safety modal requiring user to type `RESET` before wiping local session data.
   - Added full JSON data backup export and merge-restore system in `FinanceContext.tsx`.

---

## 5. Deployment Instructions for Ubuntu VPS (Coolify Panel)

### Step 1: Export Code to GitHub via Antigravity
1. In AI Studio, click **Export** -> **Export to Antigravity**.
2. In Antigravity, run the Git commands to push the repository to your GitHub account (e.g., `https://github.com/your-username/golden-penny`).

### Step 2: Configure Coolify Panel on Ubuntu VPS
1. Open your Coolify Panel (`http://YOUR_VPS_IP:8000`).
2. Click **+ Add New Resource** -> **Public / Private GitHub Repository**.
3. Select the `golden-penny` repository and main branch.
4. Coolify will auto-detect Node.js / Nixpacks:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3000`
5. Click **Deploy**. Coolify will compile the frontend Vite assets and start the bundled `dist/server.cjs` server.

---

## 6. Environment Variables Required
Define these variables in your Coolify Environment Variables tab or `.env`:
```env
PORT=3000
NODE_ENV=production
GEMINI_API_KEY=your_gemini_api_key_here
```
