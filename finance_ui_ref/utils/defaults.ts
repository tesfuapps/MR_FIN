import { Language, TranslationKey } from './i18n';
import { ToastStyle } from './types';
import { CustomCategory } from './categories';

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  salary: number;
  rent: number;
  equb: number;
  emergencyFund: number;
  livingPoolBaseline: number;
  bulkBudget: number;
}

export interface Preferences {
  language: Language;
  toastStyle: ToastStyle;
  toastDuration: number; // ms; 0 = sticky (manual dismiss only)
}

/**
 * Empty-by-default profile. The app boots with no demo figures — the user owns
 * every number and enters them via the Edit Profile screen. (Phase 1.1)
 */
export const DEFAULT_PROFILE: ProfileData = {
  name: '',
  role: '',
  location: '',
  salary: 0,
  rent: 0,
  equb: 0,
  emergencyFund: 0,
  livingPoolBaseline: 0,
  bulkBudget: 0,
};

/** No pending store tabs in a fresh, empty state. */
export const DEFAULT_SHIME_PENDING = false;

export const DEFAULT_PREFERENCES: Preferences = {
  language: 'en',
  toastStyle: 'chip',
  toastDuration: 3500,
};

export const DEFAULT_CUSTOM_CATEGORIES: CustomCategory[] = [];

export const TOAST_DURATION_OPTIONS: { labelKey: TranslationKey; value: number }[] = [
  { labelKey: 'short', value: 2500 },
  { labelKey: 'normal', value: 3500 },
  { labelKey: 'long', value: 6000 },
  { labelKey: 'sticky', value: 0 },
];
