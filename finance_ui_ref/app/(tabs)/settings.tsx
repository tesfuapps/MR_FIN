import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useFinSpark } from '@/context/FinSparkContext';
import { EditProfileModal } from '@/components/EditProfileModal';
import { Language } from '@/utils/i18n';
import { ToastStyle } from '@/utils/types';
import {
  TOAST_STYLE_META, TOAST_DURATION_OPTIONS,
} from '@/utils/defaults';
import { ImportMode } from '@/utils/dataManager';

/** DOM-based helpers — used only when running on web (static export). */
function webDownload(text: string, filename: string, mime: string): boolean {
  const g: any = globalThis as any;
  const doc = g.document;
  if (!doc) return false;
  try {
    const blob = new g.Blob([text], { type: mime });
    const url = g.URL.createObjectURL(blob);
    const a = doc.createElement('a');
    a.href = url;
    a.download = filename;
    doc.body.appendChild(a);
    a.click();
    doc.body.removeChild(a);
    g.setTimeout(() => g.URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

function webPickFile(onText: (text: string) => void): boolean {
  const g: any = globalThis as any;
  const doc = g.document;
  if (!doc) return false;
  try {
    const input = doc.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv,application/json,text/csv';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new g.FileReader();
      reader.onload = () => onText(String(reader.result || ''));
      reader.readAsText(file);
    };
    input.style.display = 'none';
    doc.body.appendChild(input);
    input.click();
    g.setTimeout(() => {
      try { doc.body.removeChild(input); } catch { /* already removed */ }
    }, 60000);
    return true;
  } catch {
    return false;
  }
}

async function copyText(text: string): Promise<boolean> {
  const g: any = globalThis as any;
  try {
    if (g.navigator && g.navigator.clipboard && g.navigator.clipboard.writeText) {
      await g.navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

const SettingsScreen = () => {
  const {
    language, setLanguage, t, profile,
    toastStyle, setToastStyle, toastDuration, setToastDuration, previewToast,
    categoryDefs, customCategories, addCustomCategory, removeCustomCategory,
    categoryLabel, transactions,
    exportJSON, exportCSV, importData, clearAllData, showToast,
  } = useFinSpark();

  const [editVisible, setEditVisible] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState<ImportMode>('replace');
  const [status, setStatus] = useState('');

  const dateTag = new Date().toISOString().slice(0, 10);

  const handleExport = (kind: 'json' | 'csv' | 'copy') => {
    const text = kind === 'csv' ? exportCSV() : exportJSON();
    if (kind === 'copy') {
      copyText(text).then(ok => {
        setStatus(t('copied'));
        if (!ok) setImportText(text); // native fallback: show it for manual copy
      });
      return;
    }
    const filename = kind === 'csv'
      ? `mr-fin-transactions-${dateTag}.csv`
      : `mr-fin-backup-${dateTag}.json`;
    const ok = webDownload(text, filename, kind === 'csv' ? 'text/csv' : 'application/json');
    setStatus(ok ? `${t(kind === 'csv' ? 'exportCsv' : 'exportJson')} ✓` : t('importDesc'));
    if (!ok) setImportText(text); // native fallback: let the user copy it
  };

  const handleImport = () => {
    const result = importData(importText, importMode);
    if (result.ok) {
      setStatus(`${t('importSuccess')} — ${t('importSuccessMsg', { n: result.count })}`);
      setImportText('');
      showToast({
        id: `import-${Date.now()}`,
        type: 'success', icon: '📥',
        title: t('importSuccess'),
        amount: `+${result.count}`,
        detail: t('importSuccessMsg', { n: result.count }),
        pace: '',
      });
    } else {
      setStatus(t('importErrorMsg'));
      Alert.alert(t('importError'), t('importErrorMsg'));
    }
  };

  const handleClear = () => {
    Alert.alert(t('clearTitle'), t('clearMsg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('reset'), style: 'destructive',
        onPress: () => { clearAllData(); setStatus(t('resetSeed')); },
      },
    ]);
  };

  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    addCustomCategory(newCat.trim());
    setNewCat('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/mr-fin-logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>⚙️ {t('settingsTitle')}</Text>
          <Text style={styles.subtitle}>{t('settingsSub')}</Text>
        </View>

        {/* ── 1. Language ────────────────────────────────────────────── */}
        <View style={styles.card}>
          <SectionTitle icon="🌐" text={t('language')} />
          <Text style={styles.desc}>{t('languageDesc')}</Text>
          <View style={styles.languageRow}>
            {(['en', 'am'] as Language[]).map(lang => {
              const active = language === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[styles.langBtn, active && styles.langBtnActive]}
                  onPress={() => setLanguage(lang)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.langFlag, active && styles.langFlagActive]}>
                    {lang === 'en' ? '🇬🇧' : '🇪🇹'}
                  </Text>
                  <Text style={[styles.langName, active && styles.langNameActive]}>
                    {lang === 'en' ? t('english') : t('amharic')}
                  </Text>
                  <Text style={[styles.langCode, active && styles.langCodeActive]}>
                    {lang === 'en' ? 'ENG' : 'AMH'}
                  </Text>
                  {active && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── 2. Profile ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <SectionTitle icon="👤" text={t('editProfile')} />
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileCol}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileRole} numberOfLines={1}>{profile.role}</Text>
              <Text style={styles.profileLocation} numberOfLines={1}>📍 {profile.location}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setEditVisible(true)} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>✏️ {t('editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── 3. Notification toasts ─────────────────────────────────── */}
        <View style={styles.card}>
          <SectionTitle icon="🔔" text={t('notifications')} />
          <Text style={styles.desc}>{t('notificationsDesc')}</Text>
          <Text style={styles.subLabel}>{t('toastStyle')}</Text>
          {TOAST_STYLE_META.map(meta => {
            const active = toastStyle === meta.id;
            return (
              <TouchableOpacity
                key={meta.id}
                style={[styles.styleCard, active && styles.styleCardActive]}
                onPress={() => setToastStyle(meta.id as ToastStyle)}
                activeOpacity={0.7}
              >
                <Text style={styles.styleIcon}>{meta.icon}</Text>
                <View style={styles.styleTextCol}>
                  <Text style={styles.styleName}>{t(meta.labelKey)}</Text>
                  <Text style={styles.styleDesc}>{t(meta.descKey)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.previewBtn}
                  onPress={() => { setToastStyle(meta.id as ToastStyle); previewToast(); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.previewBtnText}>▶ {t('preview')}</Text>
                </TouchableOpacity>
                {active && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.subLabel, { marginTop: 14 }]}>{t('toastDuration')}</Text>
          <View style={styles.chipRow}>
            {TOAST_DURATION_OPTIONS.map(opt => {
              const active = toastDuration === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.durationChip, active && styles.durationChipActive]}
                  onPress={() => setToastDuration(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.durationText, active && styles.durationTextActive]}>
                    {t(opt.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── 4. Categories ──────────────────────────────────────────── */}
        <View style={styles.card}>
          <SectionTitle icon="🏷️" text={t('categoriesSection')} />
          <Text style={styles.desc}>{t('categoriesDesc')}</Text>

          <Text style={styles.subLabel}>{t('builtIn')}</Text>
          <View style={styles.chipRow}>
            {categoryDefs.filter(c => !customCategories.some(x => x.id === c.id)).map(cat => (
              <View key={cat.id} style={styles.catChip}>
                <Text style={styles.catChipIcon}>{cat.icon}</Text>
                <Text style={styles.catChipText}>{categoryLabel(cat.id)}</Text>
              </View>
            ))}
          </View>

          {customCategories.length > 0 && (
            <>
              <Text style={[styles.subLabel, { marginTop: 12 }]}>{t('custom')}</Text>
              <View style={styles.chipRow}>
                {customCategories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, styles.catChipCustom]}
                    onPress={() => removeCustomCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.catChipIcon}>{cat.icon}</Text>
                    <Text style={styles.catChipText}>{cat.label}</Text>
                    <Text style={styles.catRemove}>✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              placeholder={t('categoryPlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={newCat}
              onChangeText={setNewCat}
              onSubmitEditing={handleAddCategory}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddCategory} activeOpacity={0.7}>
              <Text style={styles.addBtnText}>＋ {t('add')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 5. Data manager ────────────────────────────────────────── */}
        <View style={styles.card}>
          <SectionTitle icon="💾" text={t('dataManager')} />
          <Text style={styles.desc}>{t('dataManagerDesc')}</Text>
          <Text style={styles.savedNote}>● {t('savedLocally')}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{transactions.length}</Text>
              <Text style={styles.statLabel}>{t('entries')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{categoryDefs.length}</Text>
              <Text style={styles.statLabel}>{t('categoriesSection')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { fontSize: 13 }]}>
                {language === 'am' ? 'AMH' : 'ENG'}
              </Text>
              <Text style={styles.statLabel}>{t('language')}</Text>
            </View>
          </View>

          <Text style={styles.subLabel}>{t('exportJson')} / {t('exportCsv')}</Text>
          <View style={styles.buttonRow}>
            <ActionButton label={t('exportJson')} icon="⬇️" onPress={() => handleExport('json')} />
            <ActionButton label={t('exportCsv')} icon="📊" onPress={() => handleExport('csv')} />
            <ActionButton label={t('copyJson')} icon="📋" onPress={() => handleExport('copy')} />
          </View>

          <Text style={[styles.subLabel, { marginTop: 16 }]}>{t('importJson')}</Text>
          <Text style={styles.desc}>{t('importDesc')}</Text>
          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={styles.fileBtn}
              onPress={() => webPickFile(setImportText)}
              activeOpacity={0.7}
            >
              <Text style={styles.fileBtnText}>📂 {t('chooseFile')}</Text>
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder={t('pastePlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={importText}
            onChangeText={setImportText}
            textAlignVertical="top"
          />
          <View style={styles.modeRow}>
            {(['replace', 'merge'] as ImportMode[]).map(mode => (
              <TouchableOpacity
                key={mode}
                style={[styles.modeChip, importMode === mode && styles.modeChipActive]}
                onPress={() => setImportMode(mode)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modeText, importMode === mode && styles.modeTextActive]}>
                  {mode === 'replace' ? t('replace') : t('merge')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleImport} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>📥 {t('importBtn')}</Text>
          </TouchableOpacity>

          {status ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText} numberOfLines={3}>{status}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.dangerBtn} onPress={handleClear} activeOpacity={0.7}>
            <Text style={styles.dangerText}>🗑️ {t('clearAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerGap} />
      </ScrollView>

      <EditProfileModal visible={editVisible} onClose={() => setEditVisible(false)} />
    </SafeAreaView>
  );
};

const SectionTitle: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.sectionTitleRow}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <Text style={styles.sectionTitle}>{text}</Text>
  </View>
);

const ActionButton: React.FC<{ label: string; icon: string; onPress: () => void }> = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionLabel} numberOfLines={2}>{label}</Text>
  </TouchableOpacity>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    overflow: 'hidden',
  },
  scroll: {
    width: '100%',
    maxWidth: 520,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: { marginBottom: 14, paddingHorizontal: 4 },
  brandLogo: { width: 170, height: 90, alignSelf: 'center', marginBottom: 8 },
  title: { color: Colors.white, fontSize: 22, fontWeight: '900', letterSpacing: -0.4 },
  subtitle: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionIcon: { fontSize: 16 },
  sectionTitle: { color: Colors.white, fontSize: 15, fontWeight: '800' },
  desc: { color: Colors.textMuted, fontSize: 11, lineHeight: 16, marginBottom: 12 },
  subLabel: { color: Colors.tintColor, fontSize: 10, fontWeight: '800', marginBottom: 8, letterSpacing: 0.4 },

  languageRow: { flexDirection: 'row', gap: 10 },
  langBtn: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  langBtnActive: { borderColor: Colors.tintColor, backgroundColor: 'rgba(16,185,129,0.14)' },
  langFlag: { fontSize: 24, opacity: 0.6 },
  langFlagActive: { opacity: 1 },
  langName: { color: Colors.textMuted, fontSize: 13, fontWeight: '700', marginTop: 6 },
  langNameActive: { color: Colors.white, fontWeight: '900' },
  langCode: { color: Colors.textMuted, fontSize: 9, marginTop: 2, letterSpacing: 1 },
  langCodeActive: { color: Colors.tintColor },
  check: { position: 'absolute', top: 8, right: 10, color: Colors.tintColor, fontSize: 13, fontWeight: '900' },

  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.tintColor, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.black, fontSize: 22, fontWeight: '900' },
  profileCol: { flex: 1 },
  profileName: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  profileRole: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  profileLocation: { color: Colors.tintColor, fontSize: 11, marginTop: 2, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: Colors.tintColor, borderRadius: 14,
    paddingVertical: 12, alignItems: 'center', marginTop: 8,
  },
  primaryBtnText: { color: Colors.black, fontSize: 12, fontWeight: '800' },

  styleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, padding: 10, marginBottom: 8, position: 'relative',
  },
  styleCardActive: { borderColor: Colors.tintColor, backgroundColor: 'rgba(16,185,129,0.10)' },
  styleIcon: { fontSize: 20 },
  styleTextCol: { flex: 1, minWidth: 0 },
  styleName: { color: Colors.white, fontSize: 12, fontWeight: '800' },
  styleDesc: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  previewBtn: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 6,
  },
  previewBtnText: { color: Colors.tintColor, fontSize: 10, fontWeight: '800' },
  activeDot: {
    position: 'absolute', top: 6, right: 6,
    width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.tintColor,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  durationChip: {
    backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7,
  },
  durationChipActive: { borderColor: Colors.tintColor, backgroundColor: Colors.tintColor },
  durationText: { color: Colors.textMuted, fontSize: 11, fontWeight: '700' },
  durationTextActive: { color: Colors.black, fontWeight: '900' },

  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6,
  },
  catChipCustom: { borderColor: Colors.tintColor },
  catChipIcon: { fontSize: 13 },
  catChipText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  catRemove: { color: Colors.red, fontSize: 10, marginLeft: 3, fontWeight: '800' },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  addInput: {
    flex: 1, backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9,
    color: Colors.white, fontSize: 12,
  },
  addBtn: {
    backgroundColor: 'rgba(16,185,129,0.18)', borderWidth: 1, borderColor: Colors.tintColor,
    borderRadius: 12, paddingHorizontal: 14, justifyContent: 'center',
  },
  addBtnText: { color: Colors.tintColor, fontSize: 12, fontWeight: '800' },

  savedNote: { color: Colors.tintColor, fontSize: 10, fontWeight: '700', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statBox: {
    flex: 1, backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingVertical: 10, alignItems: 'center',
  },
  statValue: { color: Colors.white, fontSize: 18, fontWeight: '900', fontFamily: 'SpaceMono' },
  statLabel: { color: Colors.textMuted, fontSize: 9, marginTop: 2 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1, backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 6, alignItems: 'center', gap: 4,
  },
  actionIcon: { fontSize: 16 },
  actionLabel: { color: Colors.white, fontSize: 9, fontWeight: '700', textAlign: 'center' },
  fileBtn: {
    borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.tintColor,
    borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginBottom: 8,
    backgroundColor: 'rgba(16,185,129,0.07)',
  },
  fileBtnText: { color: Colors.tintColor, fontSize: 12, fontWeight: '800' },
  textArea: {
    backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 10, color: Colors.white, fontSize: 10,
    fontFamily: 'SpaceMono', minHeight: 82, maxHeight: 130,
  },
  modeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  modeChip: {
    flex: 1, backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingVertical: 9, alignItems: 'center',
  },
  modeChipActive: { borderColor: Colors.gold, backgroundColor: 'rgba(245,158,11,0.14)' },
  modeText: { color: Colors.textMuted, fontSize: 11, fontWeight: '700' },
  modeTextActive: { color: Colors.gold, fontWeight: '900' },
  statusBox: {
    backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.tintColor,
    borderRadius: 10, padding: 10, marginTop: 10,
  },
  statusText: { color: Colors.white, fontSize: 10, fontFamily: 'SpaceMono' },
  dangerBtn: {
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.5)', borderRadius: 14,
    paddingVertical: 12, alignItems: 'center', marginTop: 14,
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  dangerText: { color: Colors.red, fontSize: 12, fontWeight: '800' },
  footerGap: { height: 70 },
});
