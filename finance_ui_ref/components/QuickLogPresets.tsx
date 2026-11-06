import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useFinSpark } from '@/context/FinSparkContext';

interface PresetItem {
  icon: string;
  label: string;
  amount: number;
  category: string;
  desc: string;
}

const PRESETS: PresetItem[] = [
  { icon: '🚕', label: 'Kera-Wello', amount: 20, category: 'Transit', desc: 'Taxi to Wello Sefer' },
  { icon: '🚖', label: 'Alem Cinema', amount: 10, category: 'Transit', desc: 'Taxi to Alem Cinema' },
  { icon: '🏠', label: 'Return', amount: 20, category: 'Transit', desc: 'Return Taxi to Kera' },
  { icon: '🚶', label: 'Walk/Lift', amount: 0, category: 'Transit', desc: 'Free Walk / Lift' },
  { icon: '☕', label: 'Buna', amount: 50, category: 'Food', desc: 'Traditional Buna' },
  { icon: '🍵', label: 'Shay', amount: 30, category: 'Food', desc: 'Shay (Tea)' },
  { icon: '🫓', label: 'Injera', amount: 50, category: 'Food', desc: '2 Fresh Injeras' },
  { icon: '🥖', label: 'Bread', amount: 20, category: 'Food', desc: 'Dabo / Bread' },
];

interface Props {
  /** Opens the Add Expense modal for a fully custom entry. */
  onPressCustom?: () => void;
}

export const QuickLogPresets: React.FC<Props> = ({ onPressCustom }) => {
  const { quickLog } = useFinSpark();

  const handlePress = (item: PresetItem) => {
    quickLog(item.desc, item.amount, item.category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>⚡ 1-Tap Addis Quick Log</Text>
        <Text style={styles.subtitle}>Minibus &amp; Buna</Text>
      </View>

      {/* Exactly two rows of four. flexBasis 22% + gap leaves no room for a
          fifth card, and flexShrink:0 stops the browser squeezing all eight
          into one unreadable line. */}
      <View style={styles.grid}>
        {PRESETS.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
            <Text style={item.amount === 0 ? styles.amountFree : styles.amount}>
              {item.amount === 0 ? 'Free' : `${item.amount} ETB`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* New option: log any amount / category / ledger. */}
      <TouchableOpacity
        style={styles.customTile}
        activeOpacity={0.7}
        onPress={onPressCustom}
      >
        <Text style={styles.customPlus}>＋</Text>
        <View style={styles.customTextWrap}>
          <Text style={styles.customTitle}>Custom expense</Text>
          <Text style={styles.customSub}>Any amount, category or ledger</Text>
        </View>
        <Text style={styles.customArrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  title: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    overflow: 'hidden',
  },
  card: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '22%',
    maxWidth: '22%',
    minWidth: 0,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  label: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  amount: {
    color: Colors.tintColor,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
    fontFamily: 'SpaceMono',
  },
  amountFree: {
    color: Colors.teal,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
    fontFamily: 'SpaceMono',
  },
  customTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(16,185,129,0.45)',
    backgroundColor: 'rgba(16,185,129,0.06)',
  },
  customPlus: {
    color: Colors.tintColor,
    fontSize: 20,
    fontWeight: '700',
  },
  customTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  customTitle: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  customSub: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  customArrow: {
    color: Colors.tintColor,
    fontSize: 20,
    fontWeight: '700',
  },
});
