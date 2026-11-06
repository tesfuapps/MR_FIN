/**
 * Backup / restore helpers.
 *
 * JSON is the full-fidelity format (transactions + profile + preferences +
 * custom categories). CSV is a spreadsheet-friendly transaction-only export
 * that can also be imported back.
 */
import { FinTransaction, LedgerType, ToastStyle, TOAST_STYLES } from './types';
import { Language } from './i18n';
import { CustomCategory } from './categories';
import { DEFAULT_PREFERENCES, DEFAULT_PROFILE, Preferences, ProfileData } from './defaults';

export interface AppState {
  version: 1;
  profile: ProfileData;
  preferences: Preferences;
  transactions: FinTransaction[];
  customCategories: CustomCategory[];
  shimeTabPending: boolean;
}

export interface BackupFile {
  app: 'Mr. Fin';
  version: 1;
  exportedAt: string;
  data: AppState;
}

export type ImportMode = 'replace' | 'merge';

export interface ImportResult {
  ok: boolean;
  state?: AppState;
  count: number;
  source: 'json' | 'csv' | 'invalid';
}

const CSV_HEADERS = [
  'id', 'title', 'amount', 'ledger', 'category',
  'day', 'dateStr', 'ethDateStr', 'timeStr',
] as const;

function num(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function csvCell(value: unknown): string {
  return '"' + String(value ?? '').replace(/"/g, '""') + '"';
}

export function transactionsToCSV(transactions: FinTransaction[]): string {
  const lines = [CSV_HEADERS.join(',')];
  transactions.forEach(t => {
    lines.push([
      t.id, t.title, t.amount, t.ledger, t.category,
      t.day, t.dateStr, t.ethDateStr, t.timeStr,
    ].map(csvCell).join(','));
  });
  return lines.join('\n');
}

/** Minimal RFC-4180-ish parser (handles quoted fields and escaped quotes). */
function parseCSVLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

function sanitizeTransaction(raw: any, index: number): FinTransaction | null {
  if (!raw || typeof raw !== 'object') return null;
  const amount = num(raw.amount, NaN);
  if (!Number.isFinite(amount) || amount < 0) return null;
  const ledger: LedgerType = raw.ledger === 'BULK_CAPITAL' ? 'BULK_CAPITAL' : 'LIVING';
  return {
    id: str(raw.id) || `import-${Date.now()}-${index}`,
    title: str(raw.title, 'Imported expense'),
    amount,
    ledger,
    category: str(raw.category, 'Other'),
    day: Math.max(1, Math.round(num(raw.day, 1))),
    dateStr: str(raw.dateStr),
    ethDateStr: str(raw.ethDateStr),
    timeStr: str(raw.timeStr, 'Imported'),
  };
}

function sanitizeProfile(raw: any): ProfileData {
  const p = raw && typeof raw === 'object' ? raw : {};
  return {
    name: str(p.name, DEFAULT_PROFILE.name),
    role: str(p.role, DEFAULT_PROFILE.role),
    location: str(p.location, DEFAULT_PROFILE.location),
    salary: num(p.salary, DEFAULT_PROFILE.salary),
    rent: num(p.rent, DEFAULT_PROFILE.rent),
    equb: num(p.equb, DEFAULT_PROFILE.equb),
    emergencyFund: num(p.emergencyFund, DEFAULT_PROFILE.emergencyFund),
    livingPoolBaseline: num(p.livingPoolBaseline, DEFAULT_PROFILE.livingPoolBaseline),
    bulkBudget: num(p.bulkBudget, DEFAULT_PROFILE.bulkBudget),
  };
}

function sanitizePreferences(raw: any): Preferences {
  const p = raw && typeof raw === 'object' ? raw : {};
  const language: Language = p.language === 'am' ? 'am' : 'en';
  const toastStyle: ToastStyle = TOAST_STYLES.includes(p.toastStyle)
    ? p.toastStyle
    : DEFAULT_PREFERENCES.toastStyle;
  const duration = num(p.toastDuration, DEFAULT_PREFERENCES.toastDuration);
  return {
    language,
    toastStyle,
    toastDuration: duration === 0 ? 0 : Math.min(15000, Math.max(1500, duration)),
  };
}

function sanitizeCategories(raw: any): CustomCategory[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: CustomCategory[] = [];
  raw.forEach((c: any, i: number) => {
    if (!c || typeof c !== 'object') return;
    const label = str(c.label).trim();
    if (!label) return;
    const id = str(c.id) || `custom-${Date.now()}-${i}`;
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, label, icon: str(c.icon, '🏷️') });
  });
  return out;
}

function buildState(raw: any, transactions: FinTransaction[]): AppState {
  return {
    version: 1,
    profile: sanitizeProfile(raw.profile),
    preferences: sanitizePreferences(raw.preferences),
    transactions,
    customCategories: sanitizeCategories(raw.customCategories),
    shimeTabPending: typeof raw.shimeTabPending === 'boolean' ? raw.shimeTabPending : true,
  };
}

export function createBackup(state: AppState): string {
  const backup: BackupFile = {
    app: 'Mr. Fin',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  return JSON.stringify(backup, null, 2);
}

/** Accept a Mr. Fin JSON backup, a raw state object, or a transactions CSV. */
export function parseBackup(text: string): ImportResult {
  const trimmed = (text || '').trim();
  if (!trimmed) return { ok: false, count: 0, source: 'invalid' };

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    let parsed: any;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return { ok: false, count: 0, source: 'invalid' };
    }
    const raw = Array.isArray(parsed)
      ? { transactions: parsed }
      : (parsed && typeof parsed === 'object' && parsed.data ? parsed.data : parsed);
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.transactions)) {
      return { ok: false, count: 0, source: 'invalid' };
    }
    const transactions = raw.transactions
      .map(sanitizeTransaction)
      .filter((t: FinTransaction | null): t is FinTransaction => t !== null);
    return { ok: true, state: buildState(raw, transactions), count: transactions.length, source: 'json' };
  }

  // CSV fallback
  const lines = trimmed.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { ok: false, count: 0, source: 'invalid' };
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);
  if (idx('title') === -1 || idx('amount') === -1) {
    return { ok: false, count: 0, source: 'invalid' };
  }
  const transactions: FinTransaction[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    const get = (name: string) => (idx(name) >= 0 ? cells[idx(name)] : undefined);
    const tx = sanitizeTransaction({
      id: get('id'),
      title: get('title'),
      amount: get('amount'),
      ledger: get('ledger'),
      category: get('category'),
      day: get('day'),
      dateStr: get('datestr'),
      ethDateStr: get('ethdatestr'),
      timeStr: get('timestr'),
    }, i);
    if (tx) transactions.push(tx);
  }
  if (!transactions.length) return { ok: false, count: 0, source: 'invalid' };
  return {
    ok: true,
    state: buildState({}, transactions),
    count: transactions.length,
    source: 'csv',
  };
}

export function mergeTransactions(
  existing: FinTransaction[],
  incoming: FinTransaction[],
): FinTransaction[] {
  const ids = new Set(existing.map(t => t.id));
  const additions = incoming.map(t => (ids.has(t.id) ? { ...t, id: `${t.id}-${Date.now()}` } : t));
  return [...additions, ...existing];
}
