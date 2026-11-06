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

/** Canonical English ids are stored on transactions; labels are localised. */
export const BUILTIN_CATEGORIES: CategoryDef[] = [
  { id: 'Food', icon: '🍲', color: '#3b82f6', label: { en: 'Food', am: 'ምግብ' } },
  { id: 'Transit', icon: '🚕', color: '#f8fafc', label: { en: 'Transit', am: 'ትራንስፖርት' } },
  { id: 'Pantry', icon: '🛒', color: '#f59e0b', label: { en: 'Pantry', am: 'የጅምላ ግዢ' } },
  { id: 'Housing', icon: '🏠', color: '#8b5cf6', label: { en: 'Housing', am: 'መኖሪያ' } },
  { id: 'Grooming', icon: '💈', color: '#14b8a6', label: { en: 'Grooming', am: 'ውበትና ጸጉር' } },
  { id: 'Health', icon: '💊', color: '#ef4444', label: { en: 'Health', am: 'ጤና' } },
  { id: 'Utilities', icon: '💡', color: '#eab308', label: { en: 'Utilities', am: 'አገልግሎቶች' } },
  { id: 'Airtime', icon: '📱', color: '#22d3ee', label: { en: 'Airtime', am: 'የስልክ ክፍያ' } },
  { id: 'Education', icon: '📚', color: '#a78bfa', label: { en: 'Education', am: 'ትምህርት' } },
  { id: 'Other', icon: '💳', color: '#94a3b8', label: { en: 'Other', am: 'ሌላ' } },
];

export function allCategoryDefs(custom: CustomCategory[]): CategoryDef[] {
  return [
    ...BUILTIN_CATEGORIES,
    ...custom.map(c => ({
      id: c.id,
      icon: c.icon,
      color: '#10b981',
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
  return allCategoryDefs(custom).find(c => c.id === id)?.color || '#94a3b8';
}
