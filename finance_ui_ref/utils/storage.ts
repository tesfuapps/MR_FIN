/**
 * Tiny persistence adapter.
 *
 * Web (including static export): localStorage — synchronous and available
 * during hydration. Native: AsyncStorage. All access is guarded so the
 * module is safe to import during Expo's static server-side prerender.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@finspark/state/v1';

function webStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    /* private mode / SSR */
  }
  return null;
}

export async function loadRawState(): Promise<string | null> {
  const local = webStorage();
  if (local) {
    try {
      return local.getItem(STORAGE_KEY);
    } catch {
      /* fall through */
    }
  }
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function saveRawState(raw: string): Promise<void> {
  const local = webStorage();
  if (local) {
    try {
      local.setItem(STORAGE_KEY, raw);
      return;
    } catch {
      /* quota / private mode — try native path */
    }
  }
  try {
    await AsyncStorage.setItem(STORAGE_KEY, raw);
  } catch {
    /* storage unavailable; app still works in-memory */
  }
}

export async function clearRawState(): Promise<void> {
  const local = webStorage();
  if (local) {
    try {
      local.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
