# FinSpark Addis (Mr. Fin) 🇪🇹⚡

> **A Real Solution for Ethiopian Daily Economics & Micro-Cash Flow Management**  
> *Dynamic Daily Pace Budgeting • Dual-Ledger Isolation • Ethiopian Calendar (የኢትዮጵያ ዘመን አቆጣጠር)*

[![React Native](https://img.shields.io/badge/React_Native-0.76.6-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-52.0.27-000020?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 The Problem: Why Western Budgeting Fails in Addis Ababa

Most mainstream personal finance apps (YNAB, Mint, Copilot, Monarch) make assumptions that completely fail for the daily cash realities of Addis Ababa:
* **They assume bi-weekly direct deposits and credit cards**: In Addis, high-velocity physical cash and **Telebirr / CBE Birr** micro-transactions dominate everyday survival.
* **Accrual math causes the "End-of-Month Starvation" panic**: A monthly budget doesn't tell you how much you can spend *today* when hopping into a minibus taxi.
* **Bulk restocking breaks single-ledger apps**: Buying 3,800 ETB of cooking oil, onions, and berbere on Day 1 causes standard apps to warn that your daily meal budget is 0 ETB.

---

## 💡 How FinSpark Addis Succeeds

FinSpark Addis models how urban Ethiopians actually live through three core innovations:

### 1. Dynamic Daily Pacing
Instead of fixed daily budgets, FinSpark dynamically recalculates your daily living allowance after every purchase:
$$\text{Dynamic Daily Pace} = \frac{\text{Remaining Living Pool}}{\text{Remaining Days in Ethiopian Month}}$$

If you overspend on Friday in Bole, tomorrow's target dynamically contracts for the remaining days of **ጥቅምት (Tikimt)** or **ኅዳር (Hidar)** without shame or manual re-budgeting.

### 2. Dual-Ledger Isolation
FinSpark segregates your cash flow into two protected buckets:
* **🌿 Daily Living Pool**: Fares (minibus/bajaj), jebena buna, lunch (shiro/tibs), snacks, and daily pocket cash. Deducts directly from your dynamic daily pace.
* **📦 Pantry / Sinks Buffer**: 5L cooking oil, berbere batches, teff sacks, monthly rent, grooming/haircut, and subscriptions. **Isolated from your daily meal money**, so a bulk restock never falsely zeroes out your dinner allowance.

### 3. 🇪🇹 Full Ethiopian Calendar (የኢትዮጵያ ዘመን አቆጣጠር)
* Complete 13-month calendar engine (መስከረም through ጳጉሜ).
* Native Fidel script (ግዕዝ) with day names (*ዓርብ፣ ሐሙስ፣ ረቡዕ...*).
* Live 30-day interactive month grid with daily spend indicators (🔵 on pace, 🔴 over pace, 🟢 today).
* Automatic cycle countdown: e.g. *"እስከ ኅዳር ድረስ 4 ቀናት ቀርተዋል (4 days left in Tikimt)"*.

### 4. ⚡ 1-Tap Addis Micro-Transit & Coffee Grid
Fares are logged on the go between minibus stops with zero typing:
* 🚐 **Taxi Presets**: Kera-Wello (20 ETB), Alem Cinema (10 ETB), Return Home (20 ETB), Free Walk (0 ETB).
* ☕ **Food Presets**: Traditional Jebena Buna (50 ETB), Shay (30 ETB), 2 Fresh Injeras (50 ETB), Bread (20 ETB).

### 5. 🏛️ Macro Reserves & Coworker Tabs
* **Protected Reserves**: House Rent (3,000 ETB settled), Equb Untouchable Reserve (2,000 ETB), Emergency Cushion (2,500 ETB).
* **Store Tabs & Loans**: **Shime Shop Tab** (210 ETB pending) with a 1-tap Settle button, plus settled coworker tabs (Abela, Natu, Sami).
* **"What-If" Pace Simulator**: Input a planned purchase (e.g. 500 ETB) to preview how it will change your daily allowance for the rest of the cycle.
* **Quick Liquidity Booster**: Inject `+500 ETB` or `+1,000 ETB` from savings directly into the Living Pool.

---

## 📱 Architecture & Design System

The app is built on **React Native (Expo)** adopting an ultra-clean **pure-black OLED aesthetic**:
* **Semi-Circle Donut Gauge**: Live visual progress arc powered by `react-native-gifted-charts`.
* **Floating Glassmorphic Tab Bar**: Centered bottom navigation (`Home`, `Transactions`, `Profile & Reserves`).
* **Horizontal Scrolling Blocks**: Segmented category chips for Housing, Food, Transit, and Income.
* **Live State Provider**: Centralized React Context (`FinSparkContext`) with zero-latency updates.

---

## 📂 Project Structure

```text
MR_FIN/
├── README.md                      # Project documentation
├── .gitignore                     # Git exclusions (node_modules, builds)
├── antigravity_spec.md            # Google Antigravity project specification
├── finspark_addis.html            # Standalone PWA prototype v1
├── finspark_addis_v2.html         # Standalone PWA prototype v2 (glassmorphic)
├── finspark_addis_v3.html         # Standalone PWA prototype v3 (flagship web)
├── fin_manager.html               # Working modular single-file HTML prototype
└── finance_ui_ref/                # 📱 Production React Native / Expo App
    ├── app/
    │   ├── _layout.tsx            # Root layout with FinSparkProvider
    │   └── (tabs)/
    │       ├── _layout.tsx        # Floating pill tab bar configuration
    │       ├── index.tsx          # Home Screen (Donut, Pace, Calendar, 1-Tap)
    │       ├── transaction.tsx    # Filterable & searchable transaction ledger
    │       └── profile.tsx        # Macro reserves, Shime tab & What-If simulator
    ├── components/
    │   ├── Header.tsx             # Greeting + Amharic day badge + Avatar
    │   ├── PaceHero.tsx           # Dynamic daily pace dial & health indicator
    │   ├── EthiopianCalendarCard.tsx # 30-day interactive Ethiopian month tracker
    │   ├── QuickLogPresets.tsx    # 1-tap Addis minibus taxi & snack buttons
    │   ├── ExpenseBlock.tsx       # Horizontal scrolling category blocks
    │   ├── IncomeBlock.tsx        # Horizontal scrolling income blocks
    │   ├── SpendingBlock.tsx      # Real-time transaction feed
    │   ├── AddExpenseModal.tsx    # Modal to log custom Living vs Bulk expenses
    │   └── TabItems.tsx           # Floating tab bar active/inactive item renderer
    ├── context/
    │   └── FinSparkContext.tsx    # State management & dynamic pace math engine
    ├── utils/
    │   └── ethiopianCalendar.ts   # Gregorian <-> Ethiopian date converter
    ├── constants/
    │   ├── Colors.ts              # OLED black, Ethiopian gold, emerald & blue
    │   └── Icons.tsx              # SVG icon definitions
    └── data/
        ├── expenses.json          # Preloaded category distributions
        ├── income.json            # Salary, freelancing & Equb figures
        └── spending.json          # Historical 26-day Tikimt dataset
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Expo Go](https://expo.dev/go) app on your iOS or Android phone (optional, for physical device testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tesfuapps/MR_FIN.git
   cd MR_FIN/finance_ui_ref
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start --web
   ```

4. **View the app**:
   * **Web Browser**: Open [http://localhost:8081](http://localhost:8081) in Chrome or Edge (Press `F12` $\rightarrow$ `Ctrl + Shift + M` for smartphone frame).
   * **Mobile Device**: Scan the terminal QR code with the Expo Go app (Android) or Camera app (iOS).

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React Native (0.76.6)** | Native cross-platform mobile framework |
| **Expo (v52)** | Mobile tooling, runtime & asset management |
| **Expo Router (v4)** | File-based navigation & tab layout |
| **React Native Gifted Charts** | Donut charts & financial data visualization |
| **TypeScript (v5.3)** | Strict type safety for financial invariants |
| **Lucide / Expo Vector Icons** | Minimalist icon design |

---

## 👤 Author & Persona

* **Persona**: Tesfaye Tilahun ("Tesfish")
* **Role**: Printing Specialist & Creative Brand Strategist
* **Location**: Addis Ababa, Ethiopia 🇪🇹
* **GitHub**: [@tesfuapps](https://github.com/tesfuapps)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
