import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  gregorianToEthiopian,
  EthiopianDate,
  getNextEthiopianMonth,
  ETHIOPIAN_MONTHS,
} from '@/utils/ethiopianCalendar';
import { Language, tr, TranslateFn, TranslationKey } from '@/utils/i18n';
import {
  FinTransaction,
  LedgerType,
  ToastData,
  ToastType,
  ToastStyle,
} from '@/utils/types';
import {
  CategoryDef,
  CustomCategory,
  allCategoryDefs,
  getCategoryIcon as iconForCategory,
  getCategoryLabel as labelForCategory,
} from '@/utils/categories';
import {
  DEFAULT_PROFILE,
  DEFAULT_PREFERENCES,
  DEFAULT_CUSTOM_CATEGORIES,
  ProfileData,
  Preferences,
} from '@/utils/defaults';
import { loadRawState, saveRawState, clearRawState } from '@/utils/storage';
import {
  AppState,
  ImportMode,
  ImportResult,
  createBackup,
  parseBackup,
  mergeTransactions,
  transactionsToCSV,
} from '@/utils/dataManager';

// Re-export so existing imports (`import { FinTransaction } from '@/context/…'`)
// keep working.
export type { FinTransaction, LedgerType } from '@/utils/types';

/**
 * A fixed anchor keeps the first client render identical to Expo's static
 * prerender (which bakes HTML at build time). The real date is applied in a
 * mount effect, right after hydration — this removes the React #418/#422
 * mismatch that `new Date()` in render used to cause.
 */
const SSR_ANCHOR = new Date(2026, 10, 6, 12, 0, 0); // 2019 ጥቅምት 27
export const INITIAL_ETH_DATE: EthiopianDate = gregorianToEthiopian(SSR_ANCHOR);
const SEED_DAY = INITIAL_ETH_DATE.day;

const SEED_TRANSACTIONS: FinTransaction[] = [
  { id: '1', title: '5L Sunflower Cooking Oil', amount: 3800, ledger: 'BULK_CAPITAL', category: 'Pantry', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
  { id: '2', title: 'Berbere & Shiro Stock', amount: 2500, ledger: 'BULK_CAPITAL', category: 'Pantry', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
  { id: '3', title: 'House Rent (Tikimt)', amount: 3000, ledger: 'BULK_CAPITAL', category: 'Housing', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
  { id: '4', title: 'Taxi to Wello Sefer', amount: 20, ledger: 'LIVING', category: 'Transit', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
  { id: '5', title: 'Macchiato at Bole', amount: 30, ledger: 'LIVING', category: 'Food', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
  { id: '6', title: 'Minibus to Mexico', amount: 25, ledger: 'LIVING', category: 'Transit', day: 5, dateStr: 'Tikimt 05', ethDateStr: 'ጥቅምት 05', timeStr: 'Day 5' },
  { id: '7', title: 'Haircut & Beard Trim', amount: 450, ledger: 'BULK_CAPITAL', category: 'Grooming', day: 12, dateStr: 'Tikimt 12', ethDateStr: 'ጥቅምት 12', timeStr: 'Day 12' },
  { id: '8', title: 'Special Shiro Lunch', amount: 180, ledger: 'LIVING', category: 'Food', day: 26, dateStr: 'Tikimt 26', ethDateStr: 'ጥቅምት 26', timeStr: 'Day 26' },
  { id: '9', title: 'Taxi to Kera', amount: 20, ledger: 'LIVING', category: 'Transit', day: SEED_DAY, dateStr: `Tikimt ${SEED_DAY}`, ethDateStr: `ጥቅምት ${SEED_DAY}`, timeStr: 'Today 08:30' },
  { id: '10', title: 'Buna at Cafe', amount: 50, ledger: 'LIVING', category: 'Food', day: SEED_DAY, dateStr: `Tikimt ${SEED_DAY}`, ethDateStr: `ጥቅምት ${SEED_DAY}`, timeStr: 'Today 09:15' },
];

interface FinSparkContextType {
  // Ethiopian calendar
  ethDate: EthiopianDate;
  monthNameEn: string;
  monthNameAm: string;
  nextMonthEn: string;
  nextMonthAm: string;
  totalDays: number;
  currentDay: number;
  selectedMonthIndex: number;
  setSelectedMonthIndex: (idx: number) => void;

  // Financial state
  salary: number;
  rent: number;
  equb: number;
  emergencyFund: number;
  livingPoolBaseline: number;
  bulkBudget: number;
  transactions: FinTransaction[];
  shimeTabPending: boolean;

  // Computed metrics
  daysRemaining: number;
  livingPoolSpent: number;
  poolRemaining: number;
  dynamicDailyPace: number;
  spentToday: number;
  todayRemaining: number;
  percentUsed: number;
  bulkSpent: number;
  bulkRemaining: number;

  // Actions
  addTransaction: (title: string, amount: number, category: string, ledger: LedgerType) => void;
  quickLog: (title: string, amount: number, category: string) => void;
  injectBooster: (amount: number) => void;
  settleShimeTab: () => void;
  resetToSeed: () => void;
  clearAllData: () => void;

  // Localisation
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslateFn;

  // Profile
  profile: ProfileData;
  updateProfile: (next: ProfileData) => void;

  // Categories
  categoryDefs: CategoryDef[];
  customCategories: CustomCategory[];
  addCustomCategory: (label: string, icon?: string) => string;
  removeCustomCategory: (id: string) => void;
  categoryLabel: (id: string) => string;
  categoryIcon: (id: string) => string;

  // Toasts
  toast: ToastData | null;
  toastStyle: ToastStyle;
  toastDuration: number;
  setToastStyle: (style: ToastStyle) => void;
  setToastDuration: (ms: number) => void;
  showToast: (data: ToastData) => void;
  previewToast: () => void;
  dismissToast: () => void;
  lastTransactionId: string | null;

  // Data manager
  exportJSON: () => string;
  exportCSV: () => string;
  importData: (text: string, mode: ImportMode) => ImportResult;
  hydrated: boolean;
}

const FinSparkContext = createContext<FinSparkContextType | undefined>(undefined);

export const FinSparkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ethDate, setEthDate] = useState<EthiopianDate>(INITIAL_ETH_DATE);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(INITIAL_ETH_DATE.month);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(DEFAULT_CUSTOM_CATEGORIES);
  const [transactions, setTransactions] = useState<FinTransaction[]>(SEED_TRANSACTIONS);
  const [shimeTabPending, setShimeTabPending] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const t: TranslateFn = useCallback(
    (key: TranslationKey, vars) => tr(key, preferences.language, vars),
    [preferences.language],
  );

  const applyState = useCallback((state: AppState, mode: ImportMode) => {
    setProfile(state.profile);
    setPreferences(state.preferences);
    setCustomCategories(state.customCategories);
    setShimeTabPending(state.shimeTabPending);
    if (mode === 'merge') {
      setTransactions(prev => mergeTransactions(prev, state.transactions));
    } else {
      setTransactions(state.transactions);
    }
  }, []);

  // Hydrate persisted state + apply the live Ethiopian date after mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = await loadRawState();
      if (!cancelled && raw) {
        const result = parseBackup(raw);
        if (result.ok && result.state) applyState(result.state, 'replace');
      }
      if (!cancelled) {
        const live = gregorianToEthiopian(new Date());
        setEthDate(live);
        setSelectedMonthIndex(live.month);
        setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, [applyState]);

  // Persist every change. Skipped until hydration so we never overwrite saved
  // data with the seed state.
  useEffect(() => {
    if (!hydrated) return;
    const state: AppState = {
      version: 1,
      profile,
      preferences,
      transactions,
      customCategories,
      shimeTabPending,
    };
    saveRawState(JSON.stringify(state));
  }, [hydrated, profile, preferences, transactions, customCategories, shimeTabPending]);

  const currentMonthInfo = ETHIOPIAN_MONTHS[selectedMonthIndex - 1] || ETHIOPIAN_MONTHS[1];
  const nextMonthInfo = getNextEthiopianMonth(selectedMonthIndex);
  const totalDays = currentMonthInfo.days;
  const currentDay = ethDate.day;

  const livingPoolBaseline = profile.livingPoolBaseline;
  const bulkBudget = profile.bulkBudget;

  const daysRemaining = Math.max(1, (totalDays - currentDay) + 1);
  const livingTransactions = useMemo(
    () => transactions.filter(tx => tx.ledger === 'LIVING'),
    [transactions],
  );
  const livingPoolSpent = livingTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const poolRemaining = Math.max(0, livingPoolBaseline - livingPoolSpent);
  const dynamicDailyPace = Math.round(poolRemaining / daysRemaining);
  const spentToday = livingTransactions
    .filter(tx => tx.day === currentDay)
    .reduce((acc, tx) => acc + tx.amount, 0);
  const todayRemaining = dynamicDailyPace - spentToday;
  const percentUsed = Math.min(100, Math.round((livingPoolSpent / livingPoolBaseline) * 100));
  const bulkSpent = transactions
    .filter(tx => tx.ledger === 'BULK_CAPITAL')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const bulkRemaining = Math.max(0, bulkBudget - bulkSpent);

  const categoryDefs = useMemo(
    () => allCategoryDefs(customCategories),
    [customCategories],
  );
  const categoryLabel = useCallback(
    (id: string) => labelForCategory(id, preferences.language, customCategories),
    [preferences.language, customCategories],
  );
  const categoryIcon = useCallback(
    (id: string) => iconForCategory(id, customCategories),
    [customCategories],
  );

  const typeLabel = useCallback((type: ToastType): string => {
    switch (type) {
      case 'success': return t('toastOnTarget');
      case 'warning': return t('toastTight');
      case 'error': return t('toastOverPace');
      default: return t('toastLogged');
    }
  }, [t]);

  const addTransaction = (title: string, amount: number, category: string, ledger: LedgerType) => {
    const newTx: FinTransaction = {
      id: Date.now().toString(),
      title,
      amount,
      category,
      ledger,
      day: currentDay,
      dateStr: `${currentMonthInfo.en} ${currentDay}`,
      ethDateStr: `${currentMonthInfo.am} ${currentDay}`,
      timeStr: `${t('today')} ` + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTransactions(prev => [newTx, ...prev]);
    setLastTransactionId(newTx.id);

    const newLivingTx = ledger === 'LIVING'
      ? [...livingTransactions, newTx]
      : livingTransactions;
    const newLivingSpent = newLivingTx.reduce((acc, tx) => acc + tx.amount, 0);
    const newPoolRem = Math.max(0, livingPoolBaseline - newLivingSpent);
    const newPace = Math.round(newPoolRem / daysRemaining);
    const newSpentToday = newLivingTx
      .filter(tx => tx.day === currentDay)
      .reduce((acc, tx) => acc + tx.amount, 0);
    const newTodayRem = newPace - newSpentToday;

    let toastType: ToastType = 'success';
    if (ledger === 'LIVING') {
      if (newTodayRem < 0) toastType = 'error';
      else if (newTodayRem < newPace * 0.3) toastType = 'warning';
    }

    const detailLine = ledger === 'LIVING'
      ? `${t('leftToday')}: ${newTodayRem} ${t('etb')} • ${t('pool')}: ${newPoolRem.toLocaleString()} ${t('etb')}`
      : `${t('pantrySink')} • ${t('isolated')}`;

    setToast({
      id: newTx.id,
      type: toastType,
      icon: categoryIcon(category),
      title: title.length > 25 ? title.substring(0, 25) + '...' : title,
      amount: `-${amount.toLocaleString()} ${t('etb')}`,
      detail: detailLine,
      pace: `${newPace.toLocaleString()} ${t('etb')}/${t('day').toLowerCase()}`,
    });
  };

  const quickLog = (title: string, amount: number, category: string) => {
    addTransaction(title, amount, category, 'LIVING');
  };

  const injectBooster = (amount: number) => {
    setProfile(prev => ({ ...prev, livingPoolBaseline: prev.livingPoolBaseline + amount }));
    const newBaseline = livingPoolBaseline + amount;
    const newPoolRem = Math.max(0, newBaseline - livingPoolSpent);
    const newPace = Math.round(newPoolRem / daysRemaining);
    setToast({
      id: Date.now().toString(),
      type: 'info',
      icon: '⚡',
      title: `+${amount.toLocaleString()} ${t('etb')} ${t('booster')}`,
      amount: `+${amount.toLocaleString()} ${t('etb')}`,
      detail: `${t('poolBoosted')} ${newBaseline.toLocaleString()} ${t('etb')}`,
      pace: `${newPace.toLocaleString()} ${t('etb')}/${t('day').toLowerCase()}`,
    });
  };

  const settleShimeTab = () => {
    setShimeTabPending(false);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      icon: '✅',
      title: t('shimeSettled'),
      amount: `-210 ${t('etb')}`,
      detail: t('storeTabCleared'),
      pace: `${dynamicDailyPace.toLocaleString()} ${t('etb')}/${t('day').toLowerCase()}`,
    });
  };

  const dismissToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((data: ToastData) => setToast(data), []);

  const previewToast = useCallback(() => {
    setToast({
      id: `preview-${Date.now()}`,
      type: 'success',
      icon: '✨',
      title: t('sampleExpense'),
      amount: `-120 ${t('etb')}`,
      detail: `${t('leftToday')}: ${Math.max(0, todayRemaining - 120).toLocaleString()} ${t('etb')}`,
      pace: `${dynamicDailyPace.toLocaleString()} ${t('etb')}/${t('day').toLowerCase()}`,
    });
  }, [t, todayRemaining, dynamicDailyPace]);

  const resetToSeed = () => {
    setTransactions(SEED_TRANSACTIONS);
    setProfile(DEFAULT_PROFILE);
    setShimeTabPending(true);
  };

  const clearAllData = () => {
    clearRawState();
    resetToSeed();
  };

  const updateProfile = (next: ProfileData) => setProfile(next);
  const setLanguage = (lang: Language) => setPreferences(prev => ({ ...prev, language: lang }));
  const setToastStyle = (style: ToastStyle) => setPreferences(prev => ({ ...prev, toastStyle: style }));
  const setToastDuration = (ms: number) => setPreferences(prev => ({ ...prev, toastDuration: ms }));

  const addCustomCategory = (label: string, icon = '🏷️'): string => {
    const clean = label.trim();
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    if (!clean) return id;
    setCustomCategories(prev => [...prev, { id, label: clean, icon }]);
    return id;
  };
  const removeCustomCategory = (id: string) =>
    setCustomCategories(prev => prev.filter(c => c.id !== id));

  const buildState = (): AppState => ({
    version: 1,
    profile,
    preferences,
    transactions,
    customCategories,
    shimeTabPending,
  });
  const exportJSON = () => createBackup(buildState());
  const exportCSV = () => transactionsToCSV(transactions);
  const importData = (text: string, mode: ImportMode): ImportResult => {
    const result = parseBackup(text);
    if (result.ok && result.state) {
      if (mode === 'replace') {
        applyState(result.state, 'replace');
      } else {
        // Merge only transactions; keep current profile, preferences and
        // custom categories unless the backup is the only source of them.
        setTransactions(prev => mergeTransactions(prev, result.state!.transactions));
        if (!customCategories.length && result.state!.customCategories.length) {
          setCustomCategories(result.state!.customCategories);
        }
      }
    }
    return result;
  };

  return (
    <FinSparkContext.Provider value={{
      ethDate,
      monthNameEn: currentMonthInfo.en,
      monthNameAm: currentMonthInfo.am,
      nextMonthEn: nextMonthInfo.en,
      nextMonthAm: nextMonthInfo.am,
      totalDays,
      currentDay,
      selectedMonthIndex,
      setSelectedMonthIndex,
      salary: profile.salary,
      rent: profile.rent,
      equb: profile.equb,
      emergencyFund: profile.emergencyFund,
      livingPoolBaseline,
      bulkBudget,
      transactions,
      shimeTabPending,
      daysRemaining,
      livingPoolSpent,
      poolRemaining,
      dynamicDailyPace,
      spentToday,
      todayRemaining,
      percentUsed,
      bulkSpent,
      bulkRemaining,
      addTransaction,
      quickLog,
      injectBooster,
      settleShimeTab,
      resetToSeed,
      clearAllData,
      language: preferences.language,
      setLanguage,
      t,
      profile,
      updateProfile,
      categoryDefs,
      customCategories,
      addCustomCategory,
      removeCustomCategory,
      categoryLabel,
      categoryIcon,
      toast,
      toastStyle: preferences.toastStyle,
      toastDuration: preferences.toastDuration,
      setToastStyle,
      setToastDuration,
      showToast,
      previewToast,
      dismissToast,
      lastTransactionId,
      exportJSON,
      exportCSV,
      importData,
      hydrated,
    }}>
      {children}
    </FinSparkContext.Provider>
  );
};

export const useFinSpark = () => {
  const context = useContext(FinSparkContext);
  if (!context) {
    throw new Error('useFinSpark must be used within a FinSparkProvider');
  }
  return context;
};
