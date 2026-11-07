# Mr. Fin 🇪🇹⚡

> **A Real Solution for Ethiopian Daily Economics & Micro-Cash Flow Management**
> *Dynamic Daily Pace Budgeting • Dual-Ledger Isolation • Ethiopian Calendar (የኢትዮጵያ ዘመን አቆጣጠር)*

[![React Native](https://img.shields.io/badge/React_Native-0.76.6-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-52.0.27-000020?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## The Problem

Most mainstream personal finance apps (YNAB, Mint, Copilot, Monarch) assume bi-weekly direct deposits, credit cards and a single monthly budget. Those assumptions fail for the daily cash reality of Addis Ababa:

* High-velocity physical cash and **Telebirr / CBE Birr** micro-transactions dominate everyday survival.
* A monthly total never answers *"how much can I spend today?"* while stepping into a minibus taxi.
* A 3,800 ETB bulk restock (cooking oil, onions, berbere) on Day 1 makes single-ledger apps report a daily meal budget of 0 ETB.

## How Mr. Fin Works

### 1. Dynamic Daily Pacing
Instead of a fixed daily budget, the daily living allowance is recalculated after every purchase:

```
Dynamic Daily Pace = Remaining Living Pool / Remaining Days in the Ethiopian Month
```

Overspending today contracts tomorrow's target for the rest of **ጥቅምት (Tikimt)** or **ኅዳር (Hidar)** without manual re-budgeting.

### 2. Dual-Ledger Isolation
Cash flow is split into two protected buckets:

| Ledger | Contents | Effect on daily pace |
| :--- | :--- | :--- |
| **`LIVING`** | Minibus/bajaj fares, jebena buna, shiro lunch, snacks, pocket cash | Deducted directly |
| **`BULK_CAPITAL`** | 5L cooking oil, berbere batches, teff sacks, rent, grooming, subscriptions | **Isolated** — never moves the pace needle |

### 3. Full Ethiopian Calendar
See [The calendar module](#the-calendar-module) below.

### 4. 1-Tap Addis Micro-Transit & Coffee Grid
Eight fixed presets (Kera-Wello 20 ETB, Alem Cinema 10 ETB, Buna 50 ETB, Shay 30 ETB, Injera 50 ETB, Dabo 20 ETB, …) log a `LIVING` expense with one tap.

### 5. Macro Reserves, Tabs & Simulators
Protected reserves (rent / Equb / emergency cushion), store tabs, a *What-If* pace simulator and a Quick Liquidity Booster live on the Profile tab.

---

## Phase 1 — Clean Slate & Design System

Phase 1 is complete. See [`PHASES.md`](PHASES.md) for the full 4-phase roadmap.

* **Empty by default.** No seed transactions and no hardcoded salary/rent/Equb figures. `DEFAULT_PROFILE` is all zeros/empty strings; the user enters every number in **Edit Profile**. `clearAllData()` wipes transactions, baselines, preferences and custom categories, and writes that empty state back to storage so it survives a reload. **Settings → "Clear my information"** is the confirmed control.
* **Empty states.** `components/EmptyState.tsx` gives Home, Transactions and the recent-spending feed a localised prompt instead of a blank/all-zero screen.
* **One colour system.** `constants/Colors.ts` is the only file allowed to contain hex/rgba values. Semantic tokens (`bg`, `surface`, `border`, `text`, `textMuted`, `accent`, `success`, `warning`, `danger`, `info`), translucent `tint`/`overlay`/`statusTint` families and the three pace status colours (`onTarget` / `nearPace` / `overPace`) are documented there with WCAG AA contrast ratios.
* **Tabler outline icons.** `components/TablerIcons.tsx` ships the MIT **outline** set as `react-native-svg` components (24 default / 20 compact / 28 hero, stroke width 2). Tab bar, header, blocks, modals and settings all use it. The legacy SVG asset bundle and `constants/Icons.tsx` were removed.
* **Compact chip toast.** `components/ChipToast.tsx` replaces the five-style `ToastNotification`. One pill, auto-dismiss, tap-to-dismiss, and an internal queue so rapid actions never overlap. Expense logging, profile updates, import/export, clear-data confirmation and validation errors all fire a chip.

> **No screenshots are embedded in this README** — the repository ships the runnable app instead.

---

## Architecture

```
app/_layout.tsx                 FinSparkProvider + global ChipToast
app/(tabs)/_layout.tsx          Expo Router floating pill tab bar
app/(tabs)/index.tsx            Home (donut, PaceHero, calendar, quick log, feeds)
app/(tabs)/transaction.tsx      Searchable / filterable transaction ledger
app/(tabs)/profile.tsx          Reserves, tabs, What-If, liquidity booster
app/(tabs)/settings.tsx         Language, profile, toast duration, categories, data manager
context/FinSparkContext.tsx     Single source of truth: state, pace math, actions, i18n, toasts
```

**State & persistence.** `FinSparkContext` holds `profile`, `preferences`, `transactions`, `customCategories` and `shimeTabPending`. `utils/storage.ts` uses `localStorage` on web and `AsyncStorage` on native. A fixed SSR anchor date keeps the first client render identical to Expo's static prerender; the live Ethiopian date is applied after hydration. Every change is serialized through `utils/dataManager.ts` (`AppState` v1), which also powers JSON backup, CSV export and validated import (replace / merge).

**Two-ledger model.** `FinTransaction.ledger` is `'LIVING' | 'BULK_CAPITAL'`. Only `LIVING` transactions feed `livingPoolSpent`, `poolRemaining`, `dynamicDailyPace`, `spentToday` and `todayRemaining`. `BULK_CAPITAL` feeds `bulkSpent` / `bulkRemaining` and is deliberately excluded from the pace calculation.

**i18n.** `utils/i18n.ts` holds a flat English table plus a type-checked Amharic table (`Record<TranslationKey, string>`), so a missing translation is a compile error. `t(key, vars)` handles `{placeholders}`.

**Design system.** `constants/Colors.ts` (tokens), `components/TablerIcons.tsx` (icons), `components/ChipToast.tsx` (feedback), `components/EmptyState.tsx` (empty states).

### The calendar module

`utils/ethiopianCalendar.ts` is a self-contained Gregorian ↔ Ethiopian converter:

* 13 months: twelve of 30 days (`መስከረም` … `ነሐሴ`) plus **ጳጉሜ (Pagume)**, the 13th intercalary month.
* Native Fidel month and weekday names (`ዓርብ`, `ሐሙስ`, `ረቡዕ`, …) in `am`, transliterated names in `en`.
* `gregorianToEthiopian(date)` returns `{ year, month, day, dayNameEn, dayNameAm }`; `getNextEthiopianMonth(index)` drives the cycle countdown.
* `components/EthiopianCalendarCard.tsx` renders the interactive 30-day grid with per-day spend dots, a "today" marker and a day-detail panel.
* The cycle boundary (`totalDays`, `currentDay`, `daysRemaining`) is the denominator of the dynamic pace formula, so budgeting follows the Ethiopian month, not the Gregorian one.

> Known limitation (tracked for a later phase): Pagume is currently a fixed 5 days; leap-year (6-day) handling is not yet implemented.

### The 4-rule engine

The deterministic `calculateMrFin` engine is specified and documented in [`PHASES.md`](PHASES.md) § Phase 2.1: **Rule 1** routes savings/bulk entries outside the living pool, **Rule 2** deducts from the living pool with a floor at 0, **Rule 3** computes dynamic pace, **Rule 4** derives today's remaining amount and the `On Target` / `Near Pace` / `Over Pace` badge. It is delivered as a pure, unit-tested function in Phase 2; Phase 1 only defines the status colours those badges use.

---

## Project Structure

```text
MR_FIN/
├── README.md                      # This file
├── PHASES.md                      # 4-phase delivery roadmap (source of truth)
├── antigravity_spec.md            # Vite/React/Tailwind PWA rewrite proposal
├── finspark_addis*.html …         # Standalone single-file HTML/PWA prototypes
├── fin_manager.html, index.html   # Earlier web prototypes + static web export
└── finance_ui_ref/                # Production React Native / Expo app
    ├── app/                       # Expo Router root + (tabs) screens
    ├── components/
    │   ├── TablerIcons.tsx        # Tabler outline icon set (MIT, react-native-svg)
    │   ├── ChipToast.tsx          # Single queued chip toast
    │   ├── EmptyState.tsx         # Localised empty-state card
    │   ├── PaceHero.tsx           # Dynamic pace dial + status badge
    │   ├── EthiopianCalendarCard.tsx
    │   ├── QuickLogPresets.tsx    # 1-tap Addis fares & coffee
    │   ├── AddExpenseModal.tsx / EditProfileModal.tsx
    │   ├── IncomeBlock.tsx / ExpenseBlock.tsx / SpendingBlock.tsx
    │   ├── Header.tsx / TabItems.tsx
    │   └── …                      # see the file tree in-repo
    ├── constants/Colors.ts        # ONLY file with hex/rgba values
    ├── context/FinSparkContext.tsx
    ├── utils/
    │   ├── ethiopianCalendar.ts   # Gregorian ↔ Ethiopian conversion
    │   ├── storage.ts             # localStorage / AsyncStorage adapter
    │   ├── dataManager.ts         # Backup, CSV, validated import
    │   ├── defaults.ts            # Empty-by-default state
    │   ├── categories.ts          # Built-in + custom category defs
    │   ├── i18n.ts                # EN / AM string tables
    │   └── types.ts               # Shared types
    ├── data/                      # Static display feeds (expenses / income / spending)
    ├── assets/                    # Fonts & images
    └── public/                    # PWA manifest, icons, service worker
```

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) v18+
* [Expo Go](https://expo.dev/go) (optional, for a physical device)

### Install & run

```bash
git clone https://github.com/tesfuapps/MR_FIN.git
cd MR_FIN/finance_ui_ref
npm install
npm start                 # Expo dev server
npm run web               # or: npx expo start --web  → http://localhost:8081
npm run android           # emulator / connected device
npm run ios
npm test                  # jest-expo
npm run lint              # expo lint
```

On web, press `F12` → device toolbar for a smartphone-sized frame. On mobile, scan the QR code with Expo Go (Android) or the Camera app (iOS).

### Static web export & deploy

`app.json` sets `web.output: "static"` and `web.bundler: "metro"`.

```bash
npx expo export -p web      # writes dist/
npx serve dist              # local preview of the static build
```

Deploy `dist/` to any static host. The repository includes `vercel.json`; with the Vercel CLI:

```bash
npm i -g vercel
vercel --prod              # from finance_ui_ref/, publish dist/
```

The export is fully client-side: all financial data stays in `localStorage` / `AsyncStorage`. There is no backend, no account system and no network dependency at runtime. **Export a JSON backup from Settings before clearing a device or switching browsers.**

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React Native 0.76.6 / Expo 52** | Cross-platform runtime & tooling |
| **Expo Router 4** | File-based navigation, tab layout, static web export |
| **TypeScript 5.3 (strict)** | Type safety for financial invariants |
| **react-native-svg** | Tabler outline icons, charts |
| **react-native-gifted-charts** | Semi-circle donut gauge |
| **@react-native-async-storage/async-storage** | On-device persistence |
| **Tabler Icons (MIT, outline)** | Single icon system |
| **jest-expo** | Test runner (Phase 2/3 pure-function coverage) |

---

## Roadmap

| Phase | Theme | Status |
| :--- | :--- | :--- |
| **1** | Foundation & Design System | ✅ Complete |
| **2** | Calculation Engine & Display (`calculateMrFin`, percentage bars, hide-amount) | Planned |
| **3** | Advice / Forecasting Engine | Planned |
| **4** | Accounts & Personalization | Planned |

Full checklists, engine pseudocode and exit criteria live in [`PHASES.md`](PHASES.md). Out of scope for now: cloud sync, multi-currency, AI/ML advice, backend database.

---

## Author & License

* **Persona**: Tesfaye Tilahun ("Tesfish") — Printing Specialist & Creative Brand Strategist, Addis Ababa, Ethiopia 🇪🇹
* **GitHub**: [@tesfuapps](https://github.com/tesfuapps)
* **License**: MIT — see [LICENSE](LICENSE)
