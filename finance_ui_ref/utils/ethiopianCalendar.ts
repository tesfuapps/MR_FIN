/**
 * Ethiopian Calendar (የኢትዮጵያ ዘመን አቆጣጠር) Utility
 * 
 * 12 months of 30 days each, plus 13th month (Pagume) of 5 or 6 days.
 * Includes both English transliteration and Amharic Fidel script.
 */

export interface EthiopianDate {
  year: number;
  month: number; // 1 to 13
  day: number;   // 1 to 30 (or 1 to 5/6 for Pagume)
  monthNameEn: string;
  monthNameAm: string;
  dayNameEn: string;
  dayNameAm: string;
  formattedEn: string;
  formattedAm: string;
}

export const ETHIOPIAN_MONTHS = [
  { index: 1, en: 'Meskerem', am: 'መስከረም', days: 30 },
  { index: 2, en: 'Tikimt', am: 'ጥቅምት', days: 30 },
  { index: 3, en: 'Hidar', am: 'ኅዳር', days: 30 },
  { index: 4, en: 'Tahsas', am: 'ታኅሣሥ', days: 30 },
  { index: 5, en: 'Tir', am: 'ጥር', days: 30 },
  { index: 6, en: 'Yekatit', am: 'የካቲት', days: 30 },
  { index: 7, en: 'Megabit', am: 'መጋቢት', days: 30 },
  { index: 8, en: 'Miazia', am: 'ሚያዝያ', days: 30 },
  { index: 9, en: 'Ginbot', am: 'ግንቦት', days: 30 },
  { index: 10, en: 'Sene', am: 'ሰኔ', days: 30 },
  { index: 11, en: 'Hamle', am: 'ሐምሌ', days: 30 },
  { index: 12, en: 'Nehase', am: 'ነሐሴ', days: 30 },
  { index: 13, en: 'Pagume', am: 'ጳጉሜ', days: 5 }, // 6 in leap years
];

export const ETHIOPIAN_DAYS = [
  { en: 'Sunday', am: 'እሑድ' },
  { en: 'Monday', am: 'ሰኞ' },
  { en: 'Tuesday', am: 'ማክሰኞ' },
  { en: 'Wednesday', am: 'ረቡዕ' },
  { en: 'Thursday', am: 'ሐሙስ' },
  { en: 'Friday', am: 'ዓርብ' },
  { en: 'Saturday', am: 'ቅዳሜ' },
];

/**
 * Converts a standard JavaScript Date (Gregorian) to Ethiopian Date.
 */
export function gregorianToEthiopian(date: Date = new Date()): EthiopianDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1; // 1-12
  const gDay = date.getDate();
  const dayOfWeek = date.getDay(); // 0-6

  // Gregorian to Julian Day Number (JDN)
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;
  const jdn = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // JDN to Ethiopian Date
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  
  const ethYear = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  const monthInfo = ETHIOPIAN_MONTHS[Math.min(ethMonth - 1, 12)];
  const dayInfo = ETHIOPIAN_DAYS[dayOfWeek];

  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay,
    monthNameEn: monthInfo.en,
    monthNameAm: monthInfo.am,
    dayNameEn: dayInfo.en,
    dayNameAm: dayInfo.am,
    formattedEn: `${dayInfo.en}, ${monthInfo.en} ${ethDay}, ${ethYear}`,
    formattedAm: `${dayInfo.am}፣ ${monthInfo.am} ${ethDay} ቀን ${ethYear} ዓ.ም`,
  };
}

/**
 * Get the next Ethiopian month name (e.g. Tikimt -> Hidar)
 */
export function getNextEthiopianMonth(currentMonthIndex: number) {
  const nextIdx = (currentMonthIndex % 13) + 1;
  return ETHIOPIAN_MONTHS[nextIdx - 1];
}

