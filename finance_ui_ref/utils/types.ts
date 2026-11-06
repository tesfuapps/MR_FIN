/** Shared domain types. Kept dependency-free so both the context and the
 *  data-manager / toast modules can import them without circular imports. */

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

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  icon: string;
  title: string;
  amount: string;
  detail: string;
  pace: string;
}

/** Selectable notification presentation styles (Settings → Notifications). */
export type ToastStyle = 'classic' | 'minimal' | 'snackbar' | 'banner' | 'chip';

export const TOAST_STYLES: ToastStyle[] = ['classic', 'minimal', 'snackbar', 'banner', 'chip'];
