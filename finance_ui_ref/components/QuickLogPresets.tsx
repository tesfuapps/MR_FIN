import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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

export const QuickLogPresets: React.FC = () => {
  const { quickLog } = useFinSpark();

  const handlePress = (item: PresetItem) => {
    quickLog(item.desc, item.amount, item.category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>⚡ 1-Tap Addis Quick Log</Text>
        <Text style={styles.subtitle}>Minibus & Buna</Text>
      </View>

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
    gap: 6,
    width: '100%',
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    minWidth: 0,
    maxWidth: '24%',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    marginBottom: 3,
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
    marginTop: 2,
    fontFamily: 'SpaceMono',
  },
  amountFree: {
    color: Colors.teal,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: 'SpaceMono',
  },
});

