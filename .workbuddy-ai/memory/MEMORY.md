# FinSpark Addis — Project Memory

## Repo
- GitHub: https://github.com/tesfuapps/MR_FIN.git
- Local: C:\Users\OLY-104\WorkBuddy AI\Mr. Fin
- Branch: main

## Architecture
- `finance_ui_ref/` — Production React Native / Expo app (TypeScript)
  - Components: PaceHero, EthiopianCalendarCard, QuickLogPresets, ExpenseBlock, IncomeBlock, SpendingBlock, AddExpenseModal, Header, TabItems, TabIcons
  - Context: FinSparkContext (state + dynamic pace math)
  - Utils: ethiopianCalendar.ts (Gregorian→Ethiopian converter)
  - Colors: deep navy-black (#0b0f19), card bg (#131b2e), emerald tint (#10b981), gold (#f59e0b)
- Root HTML files: Compiled Expo web build for Vercel deployment
- HTML Prototypes: finspark_addis.html (v1), finspark_addis_v2.html (glassmorphic), finspark_addis_v3.html (finance-app-ui design), fin_manager.html (modular)
- Deployed: mrfinance-teal.vercel.app

## Key Decisions
- v3 design adopted from sai-zack-dev/finance-app-ui repo (floating pill tab bar, semi-circle donut, horizontal cards, pure-black aesthetic)
- Ethiopian calendar engine with JDN-based conversion, 13 months, Amharic Fidel
- Dual-ledger system: LIVING (affects daily pace) vs BULK_CAPITAL (isolated from pace)
- Dynamic daily pace = remainingPool / daysRemaining

## Fixes Applied
- 2026-11-06: Horizontal overflow fix — wrapped FlatList carousels in overflow:hidden, changed QuickLogPresets from width:23% to flex:1+minWidth:0, injected overflow-x:hidden CSS in all 8 deployed HTML files + 4 prototypes, fixed viewport meta with viewport-fit=cover, replaced translateX:-110 tab bar centering with marginHorizontal:auto
