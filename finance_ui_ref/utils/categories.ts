import Colors from '@/constants/Colors';
import { Language } from './i18n';

export interface CategoryDef {
  id: string;
  icon: string;
  color: string;
  label: Record<Language, string>;
}

export interface CustomCategory {
  id: string;
  label: string;
  icon: string;
}

/**
 * Category colours all come from the Phase 1 token palette — no module
 * outside `constants/Colors.ts` declares a hex value.
 */
export const BUILTIN_CATEGORIES: CategoryDef[] = [
  { id: 'Food', icon: '🍲', color: Colors.info, label: { en: 'Food', am: 'ምግብ' } },
  { id: 'Transit', icon: '🚕', color: Colors.text, label: { en: 'Transit', am: 'ትራንስፖርት' } },
  { id: 'Pantry', icon: '🛒', color: Colors.warning, label: { en: 'Pantry', am: 'የጅምላ ግዢ' } },
  { id: 'Housing', icon: '🏠', color: Colors.purple, label: { en: 'Housing', am: 'መኖሪያ' } },
  { id: 'Grooming', icon: '💈', color: Colors.teal, label: { en: 'Grooming', am: 'ውበትና ጸጉር' } },
  { id: 'Health', icon: '💊', color: Colors.danger, label: { en: 'Health', am: 'ጤና' } },
  { id: 'Utilities', icon: '💡', color: Colors.categoryYellow, label: { en: 'Utilities', am: 'አገልግሎቶች' } },
  { id: 'Airtime', icon: '📱', color: Colors.categoryCyan, label: { en: 'Airtime', am: 'የስልክ ክፍያ' } },
  { id: 'Education', icon: '📚', color: Colors.categoryViolet, label: { en: 'Education', am: 'ትምህርት' } },
  { id: 'Other', icon: '💳', color: Colors.textMuted, label: { en: 'Other', am: 'ሌላ' } },
];

export function allCategoryDefs(custom: CustomCategory[]): CategoryDef[] {
  return [
    ...BUILTIN_CATEGORIES,
    ...custom.map(c => ({
      id: c.id,
      icon: c.icon,
      color: Colors.accent,
      label: { en: c.label, am: c.label } as Record<Language, string>,
    })),
  ];
}

export function getCategoryIcon(id: string, custom: CustomCategory[]): string {
  return allCategoryDefs(custom).find(c => c.id === id)?.icon || '💳';
}

export function getCategoryLabel(
  id: string,
  lang: Language,
  custom: CustomCategory[],
): string {
  return allCategoryDefs(custom).find(c => c.id === id)?.label[lang] || id;
}

export function getCategoryColor(id: string, custom: CustomCategory[]): string {
  return allCategoryDefs(custom).find(c => c.id === id)?.color || Colors.textMuted;
}
