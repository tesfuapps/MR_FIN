import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import Colors from '@/constants/Colors';
import { TablerIcon, ICON_SIZE } from '@/components/TablerIcons';
import { useFinSpark, LedgerType } from '@/context/FinSparkContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<Props> = ({ visible, onClose }) => {
  const {
    addTransaction, monthNameAm, monthNameEn, currentDay, language, t,
    categoryDefs, categoryLabel, addCustomCategory, showToast,
  } = useFinSpark();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [ledger, setLedger] = useState<LedgerType>('LIVING');
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');

  // Keep the selection valid if a custom category was deleted in Settings.
  useEffect(() => {
    if (visible && !categoryDefs.some(c => c.id === category)) {
      setCategory(categoryDefs[0]?.id || 'Food');
    }
  }, [visible, categoryDefs, category]);

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!title.trim() || isNaN(num) || num <= 0) {
      showToast({
        id: `invalid-${Date.now()}`,
        type: 'error',
        icon: '',
        title: t('invalidEntry'),
        amount: '',
        detail: t('invalidEntryMsg'),
        pace: '',
      });
      return;
    }
    addTransaction(title.trim(), num, category, ledger);
    setTitle('');
    setAmount('');
    setAddingCategory(false);
    setNewCategoryLabel('');
    onClose();
  };

  const handleAddCategory = () => {
    const clean = newCategoryLabel.trim();
    if (!clean) return;
    const id = addCustomCategory(clean);
    setCategory(id);
    setNewCategoryLabel('');
    setAddingCategory(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalBox}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>{t('logExpense')}</Text>
              <Text style={styles.dateBadge}>
                {t('recordDate')}: {language === 'am' ? monthNameAm : monthNameEn} {currentDay}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <TablerIcon name="x" color={Colors.textMuted} size={ICON_SIZE.compact} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('amountEtb')}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Category — the new selectable option when logging */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('category')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {categoryDefs.map(cat => {
                  const active = cat.id === category;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catChip, active && styles.catChipActive]}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.catIcon}>{cat.icon}</Text>
                      <Text style={[styles.catText, active && styles.catTextActive]} numberOfLines={1}>
                        {categoryLabel(cat.id)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={[styles.catChip, styles.catChipNew]}
                  onPress={() => setAddingCategory(prev => !prev)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.catText}>＋ {t('newCategory')}</Text>
                </TouchableOpacity>
              </ScrollView>

              {addingCategory && (
                <View style={styles.newCatRow}>
                  <TextInput
                    style={styles.newCatInput}
                    placeholder={t('categoryPlaceholder')}
                    placeholderTextColor={Colors.textMuted}
                    value={newCategoryLabel}
                    onChangeText={setNewCategoryLabel}
                    onSubmitEditing={handleAddCategory}
                  />
                  <TouchableOpacity style={styles.newCatAdd} onPress={handleAddCategory} activeOpacity={0.7}>
                    <Text style={styles.newCatAddText}>{t('add')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Ledger */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('ledgerType')}</Text>
              <View style={styles.ledgerRow}>
                <TouchableOpacity
                  style={[styles.ledgerBtn, ledger === 'LIVING' && styles.ledgerBtnActiveLiving]}
                  onPress={() => setLedger('LIVING')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.ledgerBtnText, ledger === 'LIVING' && styles.ledgerBtnTextActive]}>
                    🌿 {t('ledgerLiving')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.ledgerBtn, ledger === 'BULK_CAPITAL' && styles.ledgerBtnActiveBulk]}
                  onPress={() => setLedger('BULK_CAPITAL')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.ledgerBtnText, ledger === 'BULK_CAPITAL' && styles.ledgerBtnTextActive]}>
                    📦 {t('ledgerBulk')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('description')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t('descriptionPlaceholder')}
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>{t('saveUpdatePace')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
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
  modalTitle: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  dateBadge: { color: Colors.tintColor, fontSize: 11, fontWeight: '700', marginTop: 2 },
  closeBtn: { color: Colors.textMuted, fontSize: 18, fontWeight: '700' },
  scroll: { flexGrow: 0 },
  inputGroup: { marginBottom: 12 },
  label: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  amountInput: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.white,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  textInput: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: Colors.white,
    fontSize: 13,
  },
  catRow: { gap: 7, paddingBottom: 4 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: 140,
  },
  catChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.tint.accent16,
  },
  catChipNew: { borderStyle: 'dashed', borderColor: Colors.tint.accent60 },
  catIcon: { fontSize: 14 },
  catText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  catTextActive: { color: Colors.white, fontWeight: '800' },
  newCatRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  newCatInput: {
    flex: 1,
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.white,
    fontSize: 12,
  },
  newCatAdd: {
    backgroundColor: Colors.tintColor,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  newCatAddText: { color: Colors.black, fontSize: 12, fontWeight: '800' },
  ledgerRow: { gap: 8 },
  ledgerBtn: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  ledgerBtnActiveLiving: { borderColor: Colors.accent, backgroundColor: Colors.tint.accent15 },
  ledgerBtnActiveBulk: { borderColor: Colors.warning, backgroundColor: Colors.tint.warning15 },
  ledgerBtnText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  ledgerBtnTextActive: { color: Colors.white, fontWeight: '700' },
  submitBtn: {
    backgroundColor: Colors.tintColor,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: { color: Colors.black, fontSize: 13, fontWeight: '800' },
});
