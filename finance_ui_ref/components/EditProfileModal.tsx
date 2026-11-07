import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import Colors from '@/constants/Colors';
import { TablerIcon, ICON_SIZE } from '@/components/TablerIcons';
import { useFinSpark } from '@/context/FinSparkContext';
import { ProfileData } from '@/utils/defaults';
import { TranslationKey } from '@/utils/i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type NumericField =
  | 'salary' | 'rent' | 'equb' | 'emergencyFund'
  | 'livingPoolBaseline' | 'bulkBudget';

type FieldKey = NumericField | 'emergency' | 'livingBaseline';

const NUMBER_FIELDS: { key: FieldKey; labelKey: TranslationKey }[] = [
  { key: 'salary', labelKey: 'salary' },
  { key: 'rent', labelKey: 'rent' },
  { key: 'equb', labelKey: 'equb' },
  { key: 'emergency', labelKey: 'emergency' },
  { key: 'livingBaseline', labelKey: 'livingBaseline' },
  { key: 'bulkBudget', labelKey: 'bulkBudget' },
];

export const EditProfileModal: React.FC<Props> = ({ visible, onClose }) => {
  const { profile, updateProfile, t, showToast } = useFinSpark();
  const fireError = (message: string) => showToast({
    id: `profile-error-${Date.now()}`,
    type: 'error',
    icon: '',
    title: t('invalid'),
    amount: '',
    detail: message,
    pace: '',
  });

  const [draft, setDraft] = useState<ProfileData>({ ...profile });
  const [error, setError] = useState('');

  // Re-sync when the modal opens (e.g. profile changed via import).
  useEffect(() => {
    if (visible) {
      setDraft({ ...profile });
      setError('');
    }
  }, [visible, profile]);

  const setField = (key: keyof ProfileData, value: string) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!draft.name.trim()) {
      setError(t('invalidEntryMsg'));
      fireError(t('invalidEntryMsg'));
      return;
    }
    const numeric: NumericField[] = [
      'salary', 'rent', 'equb', 'emergencyFund', 'livingPoolBaseline', 'bulkBudget',
    ];
    const parsed: Partial<ProfileData> = {};
    for (const key of numeric) {
      const value = Number(draft[key]);
      if (!Number.isFinite(value) || value < 0) {
        setError(t('invalidAmount'));
        fireError(t('invalidAmount'));
        return;
      }
      parsed[key] = value;
    }
    updateProfile({
      name: draft.name.trim(),
      role: draft.role.trim(),
      location: draft.location.trim(),
      ...parsed,
    } as ProfileData);
    showToast({
      id: `profile-${Date.now()}`,
      type: 'success',
      icon: '👤',
      title: t('profileUpdated'),
      amount: '',
      detail: t('profileUpdatedMsg'),
      pace: '',
    });
    onClose();
  };

  const textField = (key: keyof ProfileData, labelKey: TranslationKey, placeholder?: string) => (
    <View style={styles.field} key={key}>
      <Text style={styles.label}>{t(labelKey)}</Text>
      <TextInput
        style={styles.input}
        value={String(draft[key] ?? '')}
        onChangeText={v => setField(key, v)}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalBox}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextBox}>
              <View style={styles.titleRow}>
                <TablerIcon name="pencil" color={Colors.accent} size={ICON_SIZE.compact} />
                <Text style={styles.modalTitle}>{t('editProfileTitle')}</Text>
              </View>
              <Text style={styles.modalSub}>{t('settingsSub')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <TablerIcon name="x" color={Colors.textMuted} size={ICON_SIZE.compact} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {textField('name', 'fullName')}
            {textField('role', 'role')}
            {textField('location', 'location')}

            <Text style={styles.sectionLabel}>{t('macroReserves')}</Text>
            <View style={styles.grid}>
              {NUMBER_FIELDS.map(item => {
                const key: NumericField =
                  item.key === 'emergency' ? 'emergencyFund' :
                  item.key === 'livingBaseline' ? 'livingPoolBaseline' :
                  item.key as NumericField;
                return (
                  <View style={styles.fieldHalf} key={key}>
                    <Text style={styles.label}>{t(item.labelKey)}</Text>
                    <TextInput
                      style={styles.input}
                      value={String(draft[key] ?? '')}
                      onChangeText={v => setField(key, v)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                );
              })}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveText}>{t('saveChanges')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay.backdropStrong,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '88%',
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerTextBox: { flex: 1, marginRight: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modalTitle: { color: Colors.white, fontSize: 17, fontWeight: '800' },
  modalSub: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  closeBtn: { color: Colors.textMuted, fontSize: 18, fontWeight: '700' },
  scroll: { flexGrow: 0 },
  field: { marginBottom: 10 },
  label: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', marginBottom: 5 },
  input: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: Colors.white,
    fontSize: 13,
  },
  sectionLabel: {
    color: Colors.tintColor,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 8,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fieldHalf: { width: '47%', marginBottom: 10 },
  error: { color: Colors.red, fontSize: 11, marginTop: 4 },
  footerRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  saveBtn: {
    flex: 1.4,
    backgroundColor: Colors.tintColor,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: { color: Colors.black, fontSize: 12, fontWeight: '800' },
});
