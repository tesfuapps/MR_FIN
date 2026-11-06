import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useFinSpark } from "@/context/FinSparkContext";

const SpendingBlock: React.FC = () => {
  const { transactions } = useFinSpark();
  const recentTransactions = transactions.slice(0, 5);

  const getCategoryIcon = (category: string, title: string) => {
    if (category === 'Transit') return '🚕';
    if (category === 'Food') {
      if (title.toLowerCase().includes('buna') || title.toLowerCase().includes('macchiato')) return '☕';
      return '🍲';
    }
    if (category === 'Pantry') return '🛒';
    if (category === 'Grooming') return '💈';
    if (category === 'Housing') return '🏠';
    return '💳';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent Spending</Text>
        <Text style={styles.subtitle}>{transactions.length} entries</Text>
      </View>

      {recentTransactions.map((item) => {
        const icon = getCategoryIcon(item.category, item.title);
        const isLiving = item.ledger === 'LIVING';

        return (
          <View key={item.id} style={styles.blockWrap}>
            <View style={styles.itemInfoWrap}>
              <View style={styles.iconWrap}>
                <Text style={styles.iconEmoji}>{icon}</Text>
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.nameTxt} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.dateTxt}>
                  {item.timeStr} • <Text style={isLiving ? styles.ledgerLiving : styles.ledgerBulk}>{item.ledger === 'LIVING' ? 'Living Pool' : 'Pantry/Sink'}</Text>
                </Text>
              </View>
            </View>
            <Text style={isLiving ? styles.amountLiving : styles.amountBulk}>
              -{item.amount.toLocaleString()} ETB
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default SpendingBlock;

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    marginBottom: 80, // Space for bottom floating bar
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  blockWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  itemInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  iconWrap: {
    backgroundColor: Colors.grey,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  textWrap: {
    flex: 1,
  },
  nameTxt: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  dateTxt: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  ledgerLiving: {
    color: Colors.tintColor,
    fontWeight: "600",
  },
  ledgerBulk: {
    color: Colors.gold,
    fontWeight: "600",
  },
  amountLiving: {
    color: Colors.tintColor,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "SpaceMono",
  },
  amountBulk: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "SpaceMono",
  },
});
