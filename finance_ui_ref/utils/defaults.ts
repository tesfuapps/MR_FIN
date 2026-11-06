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

export const DEFAULT_PROFILE: ProfileData = {
  name: 'Tesfish',
  role: 'Printing Specialist & Brand Strategist',
  location: 'Addis Ababa, Ethiopia',
  salary: 15000,
  rent: 3000,
  equb: 2000,
  emergencyFund: 2500,
  livingPoolBaseline: 8500,
  bulkBudget: 12000,
};

export const DEFAULT_PREFERENCES: Preferences = {
  language: 'en',
  toastStyle: 'classic',
  toastDuration: 3500,
};

export const DEFAULT_CUSTOM_CATEGORIES: CustomCategory[] = [];

/** Keys used by the toast-style picker, in display order. */
export const TOAST_STYLE_META: {
  id: ToastStyle;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  icon: string;
}[] = [
  { id: 'classic', labelKey: 'styleClassic', descKey: 'styleClassicDesc', icon: '🗂️' },
  { id: 'minimal', labelKey: 'styleMinimal', descKey: 'styleMinimalDesc', icon: '📏' },
  { id: 'snackbar', labelKey: 'styleSnackbar', descKey: 'styleSnackbarDesc', icon: '🍫' },
  { id: 'banner', labelKey: 'styleBanner', descKey: 'styleBannerDesc', icon: '📣' },
  { id: 'chip', labelKey: 'styleChip', descKey: 'styleChipDesc', icon: '🏷️' },
];

export const TOAST_DURATION_OPTIONS: { labelKey: TranslationKey; value: number }[] = [
  { labelKey: 'short', value: 2500 },
  { labelKey: 'normal', value: 3500 },
  { labelKey: 'long', value: 6000 },
  { labelKey: 'sticky', value: 0 },
];
