# FinSpark Addis — Google Antigravity Agent Project Specification & Evaluation

> **Project Target:** FinSpark Addis (Ethiopian Daily Pace Budget & Dual-Ledger Cash Flow Manager)  
> **Platform Target:** Google Antigravity IDE / Agent Suite  
> **Owner / Persona:** Tesfaye Tilahun ("Tesfish"), Printing Specialist & Creative Brand Strategist, Addis Ababa, Ethiopia  
> **Current Prototype:** Standalone PWA (`fin_manager.html`) with dynamic pace recalculation, Addis one-tap presets, dual-ledger accounting, and real Tikimt cycle data.

---

## 1. Executive Summary & Vision

FinSpark Addis is an agent-built financial management PWA designed specifically for the daily micro-economy of urban Ethiopia (Addis Ababa). Unlike Western budgeting apps (Mint, YNAB) that assume bi-weekly direct deposits and credit-card tracking, FinSpark solves the **daily liquidity survival problem**:
1. **Dynamic Daily Pace Engine:** Calculates `Daily Target = Remaining Living Pool ÷ Remaining Cycle Days`. If an individual spends 20 ETB today against a 271 ETB target, tomorrow's target automatically recalculates up, providing instant feedback without shame.
2. **Dual-Ledger Isolation:** Separates operational micro-expenses (taxis, buna, injera) from bulk capital investments (1L cooking oil, 1kg onion, berbere, subscriptions, toiletries). This prevents pantry restocks from artificially wiping out daily meal allowances.
3. **Micro-Transit & Peer Tab Integration:** One-tap logging for city transit nodes (Kera, Wello Sefer, Alem Cinema, Edna Mall) and coworker loan/tab tracking (e.g. Shime Shop tab, Abela/Natu reimbursements).

---

## 2. Technical Evaluation: Current Prototype vs. Antigravity Agent Roadmap

### What We Think (Architectural Critique)

| Dimension | Current Prototype (`fin_manager.html`) | Antigravity 2.0 Target Architecture | Assessment & Next Steps |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Single-file HTML5 + Tailwind CDN + Vanilla JS | React 19 + Vite + Tailwind CSS + Lucide React | Clean, zero-build prototype; Antigravity agents can decompose into modular components (`<PaceHero>`, `<QuickLogGrid>`, `<DualLedgerModal>`). |
| **Data Persistence** | `localStorage` with JSON state & recovery | IndexedDB via Dexie.js + Optional Supabase Sync | Offline-first is essential for Addis network connectivity; Dexie ensures offline resilience without sync stalls. |
| **PWA Capabilities** | Responsive mobile viewport & meta tags | Web App Manifest + Service Worker (Workbox) | Ready to be installed as a standalone APK or PWA directly on Android/iOS home screen. |
| **AI Integration** | Deterministic heuristics ("Mr. Fin" Coach) | Gemini 2.5 Flash / Agent API via Antigravity SDK | Enable natural Amharic/English voice transcription ("Kera taxi 20 birr") to auto-parse and log expenses. |
| **Testing & CI** | Heuristic static AST checks (`check_web_app.py`) | Vitest unit tests + Playwright E2E simulation | Automated validation of financial pace edge cases (zero remaining days, leap cycles, negative balance protection). |

---

## 3. Core Business Logic & Invariants

```typescript
// Core Financial Formulas
interface CycleState {
  cycleName: string;            // e.g. "Tikimt Budget Tracker"
  period: string;               // e.g. "Tikimt 04 – Hidar 03"
  totalDays: number;            // Standard: 30 days
  currentDay: number;           // e.g. Day 26
  salary: number;               // 15,000 ETB
  rent: number;                 // 3,000 ETB (Fixed deduction)
  equb: number;                 // 2,000 ETB (Untouchable reserve)
  baseEmergency: number;        // 2,500 ETB (Core protected cushion)
  livingPoolBaseline: number;   // 8,500 ETB (7,500 base + 1,000 booster)
  livingPoolSpent: number;      // 7,144 ETB through Day 25
  todaySpentLiving: number;     // Active day spend
}

// 1. Dynamic Daily Pace
function computePace(state: CycleState): number {
  const daysRemaining = (state.totalDays - state.currentDay) + 1;
  const remainingPool = state.livingPoolBaseline - (state.livingPoolSpent + state.todaySpentLiving);
  if (daysRemaining <= 0) return 0;
  return Math.round(remainingPool / daysRemaining);
}

// 2. Dual-Ledger Routing Rule
// IF category in ['Bulk Pantry', 'Grooming', 'Telecom', 'Social Tibs', 'Subscriptions']
// THEN route to Savings Account Buffer (0 ETB Living Pool deduction).
// ELSE route to Daily Living Pool (deducts from remaining days pace).
```

---

## 4. Antigravity Agent Prompt & Task Instructions

To continue developing this application in **Google Antigravity**, paste the following prompt directly into an Antigravity Agent session:

```markdown
You are an autonomous engineering agent working in Google Antigravity.
Your objective is to upgrade "FinSpark Addis" from a single-file prototype into a modular, production-ready Progressive Web App (PWA) with offline persistence.

### Codebase Context
- Primary prototype: artifacts/file_generation/ttl=63d/output/fin_manager.html
- Domain: Ethiopian daily pace budget manager for Addis Ababa, Ethiopia.
- Currency: Ethiopian Birr (ETB).

### Task Deliverables
1. Decompose the single HTML prototype into a clean Vite + React + Tailwind CSS project structure:
   - `src/components/PaceHero.tsx`: Dynamic target calculation, progress ring, health badge.
   - `src/components/QuickLogGrid.tsx`: One-tap presets for Addis Ababa transit (Kera, Wello Sefer, Alem Cinema) and snacks/drinks (Buna, Shay, Injera).
   - `src/components/DualLedgerSwitcher.tsx`: Toggle between Living Pool and Savings Buffer.
   - `src/components/HistoryList.tsx`: Day-by-day logs with over/under variance indicators.
   - `src/components/CoachCard.tsx`: "Mr. Fin" AI recommendations and what-if calculator.
2. Implement robust offline persistence using Dexie.js (IndexedDB) with automatic state hydration and export/import functionality.
3. Configure full PWA support with `manifest.json`, modern app icons, and an offline-caching Service Worker.
4. Add comprehensive unit tests in Vitest covering the dynamic pace recalculation engine and ledger routing rules.
```

---

## 5. Summary Recommendation

The **FinSpark Addis** prototype is mathematically sound, deeply grounded in real Addis Ababa daily economics, and has already succeeded in keeping Tesfish's Tikimt budget on target. Feeding this into Google Antigravity provides the perfect foundation to turn a personal tracker into a scalable, high-performance product.
