import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import { useFinSpark, LedgerType } from '@/context/FinSparkContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<Props> = ({ visible, onClose }) => {
  const { addTransaction, monthNameAm, currentDay } = useFinSpark();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [ledger, setLedger] = useState<LedgerType>('LIVING');

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!title.trim() || isNaN(num) || num <= 0) {
      Alert.alert('Invalid Entry', 'Please enter a valid title and positive amount in ETB.');
      return;
    }

    addTransaction(title.trim(), num, category, ledger);
    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalBox}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>ወጪ መመዝገቢያ (Log Expense)</Text>
              <Text style={styles.dateBadge}>የመዝገብ ቀን: {monthNameAm} {currentDay}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>የብር መጠን (Amount in ETB)</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Ledger Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>የወጪ ዓይነት (Account Ledger)</Text>
            <View style={styles.ledgerRow}>
              <TouchableOpacity
                style={[styles.ledgerBtn, ledger === 'LIVING' && styles.ledgerBtnActiveLiving]}
                onPress={() => setLedger('LIVING')}
                activeOpacity={0.7}
              >
                <Text style={[styles.ledgerBtnText, ledger === 'LIVING' && styles.ledgerBtnTextActive]}>
                  🌿 የዕለት ወጪ (Living Pool • Affects Daily Pace)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ledgerBtn, ledger === 'BULK_CAPITAL' && styles.ledgerBtnActiveBulk]}
                onPress={() => setLedger('BULK_CAPITAL')}
                activeOpacity={0.7}
              >
                <Text style={[styles.ledgerBtnText, ledger === 'BULK_CAPITAL' && styles.ledgerBtnTextActive]}>
                  📦 የጅምላ ማከማቻ (Pantry / Sinks • Isolated from Pace)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ዝርዝር መግለጫ (Description)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="ምሳሌ: 5 ሊትር ዘይት፣ ባጃጅ፣ የምሳ ሽሮ..."
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>መዝግብና ሒሳብ አሻሽል (Save & Update Pace)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  dateBadge: {
    color: Colors.tintColor,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    color: Colors.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
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
    paddingVertical: 12,
    color: Colors.white,
    fontSize: 13,
  },
  ledgerRow: {
    gap: 8,
  },
  ledgerBtn: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  ledgerBtnActiveLiving: {
    borderColor: Colors.tintColor,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  ledgerBtnActiveBulk: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  ledgerBtnText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  ledgerBtnTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: Colors.tintColor,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: Colors.black,
    fontSize: 13,
    fontWeight: '800',
  },
});
