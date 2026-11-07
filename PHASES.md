# Mr. Fin — 4-Phase Delivery Roadmap

> A deterministic, rules-based personal finance companion for the Ethiopian context.
> No AI. The math is the intelligence.

---

## Overview

| Phase | Theme | Outcome |
|-------|-------|---------|
| **1** | Foundation & Design System | Clean slate: wiped data, README, one color system, Tabler outline icons, chip toast |
| **2** | Calculation Engine & Display | `calculateMrFin` 4-rule engine, percentage bars, hide-amount privacy mode |
| **3** | Advice / Forecasting Engine | Rule-based advice cards: pace verdict, projections, balance health |
| **4** | Accounts & Personalization | Google OAuth (local-only), custom expenses with custom icons |

**Dependency order:** 1 → 2 → 3 → 4 (Phase 3 consumes Phase 2's metrics; Phase 4 needs the Phase 1 design system.)

---

## Phase 1 — Foundation & Design System

*Theme: "Make it clean and consistent."*

### 1.1 Clear all information
- [ ] Remove all seed/demo transactions (`INITIAL_TRANSACTIONS` in `context/FinSparkContext.tsx`)
- [ ] Replace hardcoded baseline values (`salary`, `rent`, `equb`, `emergencyFund`) with user-owned, empty-by-default state
- [ ] Add a `clearAllData()` action that wipes transactions + resets every baseline
- [ ] Add **"Clear my information"** control in Settings with a confirmation step
- [ ] Design empty states for Home / Transaction / Advice screens (no data → friendly prompt, not a blank screen)
- [ ] Persist cleared state so it survives reload (storage layer)

### 1.2 README
- [ ] Project overview & screenshots
- [ ] Setup: install, start, web export, deploy
- [ ] Architecture: Expo Router tabs, `FinSparkContext`, two-ledger model (LIVING / BULK_CAPITAL)
- [ ] Ethiopian calendar module (`utils/ethiopianCalendar.ts`) explained
- [ ] The 4-rule engine documented (see Phase 2)
- [ ] Roadmap pointer → this file

### 1.3 Unified color system
- [ ] Consolidate every color into `constants/Colors.ts` as named semantic tokens
  (`bg`, `surface`, `border`, `text`, `textMuted`, `accent`, `success`, `warning`, `danger`, `info`)
- [ ] Audit all components — remove hardcoded hex/rgba literals
- [ ] Define and document **status colors** used by pace badges: `On Target` / `Near Pace` / `Over Pace`
- [ ] Verify contrast (WCAG AA) on all text tokens

### 1.4 Tabler Icons — outline variant
- Source: <https://github.com/tabler/tabler-icons> (MIT), **outline** style only
- [ ] Settle on delivery method: `react-native-svg` components (preferred — already a dependency) vs. web SVG sprite
- [ ] Replace all icons in: bottom tab bar, header, blocks (Income/Expense/Spending), modals, settings
- [ ] Remove legacy glyph/vector-font icon code and its assets
- [ ] Standardize icon sizes (24 default / 20 compact / 28 hero) and stroke width (2)

### 1.5 Compact chip toast
- [ ] One reusable `<ChipToast>` component (replaces current `ToastNotification` behavior)
- [ ] Compact pill shape, icon + message, auto-dismiss, queue support (no overlap)
- [ ] Wire into: expense logging, income logging, clear-data confirmation, errors

**Exit criteria:** app boots with zero demo data, README present, zero stray hex colors, all icons are Tabler outline, every user action fires a chip toast.

---

## Phase 2 — Calculation Engine & Display

*Theme: "The math, shown beautifully."*

### 2.1 The 4-rule engine — `calculateMrFin`

```ts
function calculateMrFin(
  inputAmount: number,
  bucket: 'living' | 'savings',
  state: AppState
) {
  // Rule 1: Route Ledger
  if (bucket === 'savings') {
    state.savingsOutflows.push({ amount: inputAmount, date: state.currentDate });
    return state; // 0 impact on living pool pace!
  }

  // Rule 2: Deduct from Living Pool
  state.todaySpent += inputAmount;
  const totalSpent = state.pastDaysCumulativeSpend + state.todaySpent;
  const remainingPool = Math.max(0, state.livingPoolBaseline - totalSpent);

  // Rule 3: Dynamic Pace
  const daysRemaining = Math.max(1, (state.totalCycleDays - state.currentDay) + 1);
  const dailyTarget = Math.round(
    (state.livingPoolBaseline - state.pastDaysCumulativeSpend) / daysRemaining
  );

  // Rule 4: Today's Left & Status
  const todayLeft = Math.max(0, dailyTarget - state.todaySpent);
  const percentUsed = dailyTarget > 0 ? (state.todaySpent / dailyTarget) * 100 : 0;

  let statusBadge = 'On Target';
  if (percentUsed > 100) statusBadge = 'Over Pace';
  else if (percentUsed > 80) statusBadge = 'Near Pace';

  return { remainingPool, daysRemaining, dailyTarget, todayLeft, statusBadge };
}
```

- [ ] Extract into `utils/calculateMrFin.ts` — **pure function, no mutation of caller state**
  (return a new state instead of `state.todaySpent += ...` side effects)
- [ ] Define the `AppState` type: `livingPoolBaseline`, `pastDaysCumulativeSpend`,
  `todaySpent`, `totalCycleDays`, `currentDay`, `currentDate`, `savingsOutflows`
- [ ] Integrate into `FinSparkContext`: every `addTransaction` / `quickLog` routes through the engine
- [ ] **Savings bucket** bypasses the living pool entirely (Rule 1) — verify bulk/savings entries
  never move the pace needle
- [ ] Unit tests (Jest): Rule 1 routing, Rule 2 deduction + floor at 0, Rule 3 pace math,
  Rule 4 badge thresholds (79% → On Target, 80% → Near Pace, 101% → Over Pace)

### 2.2 Percentage bar UI
- [ ] `<PercentageBar>` component: label, value, animated fill, color mapped to status badge
- [ ] Apply to: living pool usage, today's usage vs `dailyTarget`, savings/bulk budget
- [ ] Animated fill that is seek/deterministic-safe (no randomness on re-render)
- [ ] Accessible: `accessibilityRole="progressbar"` + textual %

### 2.3 Hide amount feature
- [ ] Global `hideAmounts` flag in context, persisted to storage
- [ ] Settings toggle + quick switch (header eye icon)
- [ ] Amount renderer `<Amount>` that masks to `••••` when active — used **everywhere**
  (blocks, transaction list, percentage bars, toasts, advice cards)
- [ ] Ensure hidden state persists across reload

**Exit criteria:** every logged amount flows through `calculateMrFin`, bars reflect live status,
privacy mode hides all figures app-wide, engine covered by passing tests.

---

## Phase 3 — Advice / Forecasting Engine

*Theme: "The app thinks — not AI."*

Pure rules, pure functions. Inputs → deterministic advice text.

### 3.1 Inputs (all already derivable from Phase 2)
`dailyTarget`, `todaySpent`, `todayLeft`, `percentUsed`, `remainingPool`,
`daysRemaining`, `remainingPool / daysRemaining` (forward pace),
`livingPoolBaseline`, `bulkRemaining`, salary / rent / equb / emergency fund.

### 3.2 Advisor rules (initial set)
- [ ] **Pace verdict** — from `statusBadge`: On Target / Near Pace / Over Pace
- [ ] **End-of-month projection** — `projectedSpend = pastDaysCumulativeSpend + (forwardPace × daysRemaining)`
  → lands under / at / over `livingPoolBaseline`
- [ ] **Safe daily spend for rest of cycle** — `remainingPool / daysRemaining`, shown as a number
- [ ] **Recovery advice** — if over pace: how many days at how much to return to target
- [ ] **Buffer health** — emergency fund vs monthly outflow ratio → Healthy / Thin / Depleted
- [ ] **Savings check** — did savings contributions happen this cycle? Nudge if zero
- [ ] **Category pressure** — top spending category vs its share of the pool, flag if >40%
- [ ] Each rule returns `{ id, severity, title, body, metric? }` — severity drives status color

### 3.3 Advice UI
- [ ] Advice cards on Home (top 2) and a dedicated Advice/Forecast screen (all)
- [ ] Card anatomy: icon (Tabler outline) + severity color + one-line metric + body
- [ ] Month projection summary using percentage bar (Phase 2 component)
- [ ] All amounts respect hide-amount mode

### 3.4 Determinism guarantee
- [ ] Same state in → identical advice out (unit-tested)
- [ ] No dates/randomness inside rules; cycle boundaries come from Ethiopian calendar module

**Exit criteria:** a user can open the app and read a specific, computed recommendation
("You are over pace by 120 ETB — spend at most 145 ETB/day for the next 6 days").

---

## Phase 4 — Accounts & Personalization

*Theme: "Make it yours."*

### 4.1 Google sign-in (OAuth only, local storage)
- [ ] `expo-auth-session` + `expo-crypto` Google sign-in (installed / configured)
- [ ] Request `profile` + `email` scopes; use PKCE flow
- [ ] **No backend**: store only `name`, `email`, `avatar`, `sub` locally; all financial data stays on-device
- [ ] Sign-in / sign-out controls in Profile + Settings
- [ ] Guard: clearing data does **not** sign the user out (and vice versa)
- [ ] Handle token expiry / offline gracefully (stay signed in with cached profile)

### 4.2 Custom Expense — user-defined icon
- [ ] Custom category model: `{ id, label, icon, color? }` persisted to storage
- [ ] "Create custom expense" flow in the expense modal: name + pick a Tabler outline icon + optional color
- [ ] Icon picker: searchable grid of the installed Tabler outline set
- [ ] Custom categories appear alongside built-ins everywhere (quick log, filters, stats)
- [ ] Delete / rename custom category with safe fallback for its existing transactions
- [ ] Custom category colors drawn **only** from the Phase 1 token palette

### 4.3 Final polish
- [ ] Cross-phase QA: all Phase 1–3 features still behave with a signed-in user + custom categories
- [ ] Empty states, error states, chip toasts everywhere
- [ ] Production web export + deploy, README screenshots refreshed

**Exit criteria:** users sign in with Google (data stays local), build their own expense
categories with chosen icons, and the full roadmap is shipped and documented.

---

## Notes

- **Testing:** Jest is already configured (`jest-expo`). Phases 2 and 3 are pure-function
  heavy — target high coverage there first.
- **Icons:** Tabler Icons is MIT licensed — safe to bundle. Outline variant only, for consistency.
- **Color discipline:** no component may declare its own hex value after Phase 1.
- **Out of scope (for now):** cloud sync, multi-currency, AI/ML advice, backend database.
