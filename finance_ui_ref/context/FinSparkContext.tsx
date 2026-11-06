import React, { createContext, useContext, useState, useMemo } from 'react';
import { gregorianToEthiopian, EthiopianDate, getNextEthiopianMonth, ETHIOPIAN_MONTHS } from '@/utils/ethiopianCalendar';

export type LedgerType = 'LIVING' | 'BULK_CAPITAL';

export interface FinTransaction {
  id: string;
  title: string;
  amount: number;
  ledger: LedgerType;
  category: string;
  day: number;
  dateStr: string;
  ethDateStr: string;
  timeStr: string;
}

interface FinSparkContextType {
  // Ethiopian Calendar Data
  ethDate: EthiopianDate;
  monthNameEn: string;
  monthNameAm: string;
  nextMonthEn: string;
  nextMonthAm: string;
  totalDays: number;
  currentDay: number;
  selectedMonthIndex: number;
  setSelectedMonthIndex: (idx: number) => void;

  // Financial State
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
}

const FinSparkContext = createContext<FinSparkContextType | undefined>(undefined);

export const FinSparkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live Ethiopian Date
  const ethDate = useMemo(() => gregorianToEthiopian(new Date()), []);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(ethDate.month); // 2 = Tikimt
  
  const currentMonthInfo = ETHIOPIAN_MONTHS[selectedMonthIndex - 1] || ETHIOPIAN_MONTHS[1];
  const nextMonthInfo = getNextEthiopianMonth(selectedMonthIndex);

  const totalDays = currentMonthInfo.days; // 30
  const currentDay = ethDate.day; // 27

  // Financial baseline
  const [salary] = useState(15000);
  const [rent] = useState(3000);
  const [equb] = useState(2000);
  const [emergencyFund] = useState(2500);
  const [livingPoolBaseline, setLivingPoolBaseline] = useState(8500);
  const [bulkBudget] = useState(12000);
  const [shimeTabPending, setShimeTabPending] = useState(true);

  const INITIAL_TRANSACTIONS: FinTransaction[] = [
    { id: '1', title: '5L Sunflower Cooking Oil', amount: 3800, ledger: 'BULK_CAPITAL', category: 'Pantry', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
    { id: '2', title: 'Berbere & Shiro Stock', amount: 2500, ledger: 'BULK_CAPITAL', category: 'Pantry', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
    { id: '3', title: 'House Rent (Tikimt)', amount: 3000, ledger: 'BULK_CAPITAL', category: 'Housing', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
    { id: '4', title: 'Taxi to Wello Sefer', amount: 20, ledger: 'LIVING', category: 'Transit', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
    { id: '5', title: 'Macchiato at Bole', amount: 30, ledger: 'LIVING', category: 'Food', day: 1, dateStr: 'Tikimt 01', ethDateStr: 'ጥቅምት 01', timeStr: 'Day 1' },
    { id: '6', title: 'Minibus to Mexico', amount: 25, ledger: 'LIVING', category: 'Transit', day: 5, dateStr: 'Tikimt 05', ethDateStr: 'ጥቅምት 05', timeStr: 'Day 5' },
    { id: '7', title: 'Haircut & Beard Trim', amount: 450, ledger: 'BULK_CAPITAL', category: 'Grooming', day: 12, dateStr: 'Tikimt 12', ethDateStr: 'ጥቅምት 12', timeStr: 'Day 12' },
    { id: '8', title: 'Special Shiro Lunch', amount: 180, ledger: 'LIVING', category: 'Food', day: 26, dateStr: 'Tikimt 26', ethDateStr: 'ጥቅምት 26', timeStr: 'Day 26' },
    { id: '9', title: 'Taxi to Kera', amount: 20, ledger: 'LIVING', category: 'Transit', day: currentDay, dateStr: `Tikimt ${currentDay}`, ethDateStr: `ጥቅምት ${currentDay}`, timeStr: 'Today 08:30' },
    { id: '10', title: 'Buna at Cafe', amount: 50, ledger: 'LIVING', category: 'Food', day: currentDay, dateStr: `Tikimt ${currentDay}`, ethDateStr: `ጥቅምት ${currentDay}`, timeStr: 'Today 09:15' }
  ];

  const [transactions, setTransactions] = useState<FinTransaction[]>(INITIAL_TRANSACTIONS);

  // Dynamic Pace Calculations
  const daysRemaining = Math.max(1, (totalDays - currentDay) + 1); // e.g. 4 days left
  const livingTransactions = transactions.filter(t => t.ledger === 'LIVING');
  const livingPoolSpent = livingTransactions.reduce((acc, t) => acc + t.amount, 0);
  const poolRemaining = Math.max(0, livingPoolBaseline - livingPoolSpent);
  const dynamicDailyPace = Math.round(poolRemaining / daysRemaining);

  const spentToday = livingTransactions
    .filter(t => t.day === currentDay)
    .reduce((acc, t) => acc + t.amount, 0);

  const todayRemaining = dynamicDailyPace - spentToday;
  const percentUsed = Math.min(100, Math.round((livingPoolSpent / livingPoolBaseline) * 100));

  const bulkSpent = transactions
    .filter(t => t.ledger === 'BULK_CAPITAL')
    .reduce((acc, t) => acc + t.amount, 0);
  const bulkRemaining = Math.max(0, bulkBudget - bulkSpent);

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
      timeStr: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const quickLog = (title: string, amount: number, category: string) => {
    addTransaction(title, amount, category, 'LIVING');
  };

  const injectBooster = (amount: number) => {
    setLivingPoolBaseline(prev => prev + amount);
  };

  const settleShimeTab = () => {
    setShimeTabPending(false);
  };

  const resetToSeed = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setLivingPoolBaseline(8500);
    setShimeTabPending(true);
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
      salary,
      rent,
      equb,
      emergencyFund,
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
