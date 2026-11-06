import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Colors from "@/constants/Colors";
import { useFinSpark } from "@/context/FinSparkContext";

const SpendingBlock: React.FC = () => {
  const { transactions, lastTransactionId, t, categoryIcon, categoryLabel } = useFinSpark();
  const recentTransactions = transactions.slice(0, 5);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const prevTxId = useRef<string | null>(null);

  useEffect(() => {
    if (lastTransactionId && lastTransactionId !== prevTxId.current) {
      prevTxId.current = lastTransactionId;
      flashAnim.setValue(1);
      Animated.timing(flashAnim, { toValue: 0, duration: 2000, useNativeDriver: false }).start();
    }
  }, [lastTransactionId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('recentSpending')}</Text>
        <Text style={styles.subtitle}>{transactions.length} {t('entries')}</Text>
      </View>

      {recentTransactions.map((item) => {
        const isLiving = item.ledger === 'LIVING';
        const isNew = item.id === lastTransactionId;

        const flashBg = isNew
          ? flashAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                isLiving ? 'rgba(16, 185, 129, 0)' : 'rgba(245, 158, 11, 0)',
                isLiving ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
              ],
            })
          : 'rgba(0,0,0,0)';

        return (
          <Animated.View
            key={item.id}
            style={[styles.blockWrap, isNew && { backgroundColor: flashBg as any }]}
          >
            <View style={styles.itemInfoWrap}>
              <View style={styles.iconWrap}>
                <Text style={styles.iconEmoji}>{categoryIcon(item.category)}</Text>
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.nameTxt} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.dateTxt} numberOfLines={1}>
                  {item.timeStr} • {categoryLabel(item.category)} •{' '}
                  <Text style={isLiving ? styles.ledgerLiving : styles.ledgerBulk}>
                    {isLiving ? t('livingPool') : t('pantrySink')}
                  </Text>
                </Text>
              </View>
            </View>
            <Text style={isLiving ? styles.amountLiving : styles.amountBulk}>
              -{item.amount.toLocaleString()} {t('etb')}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default SpendingBlock;

const styles = StyleSheet.create({
  container: { marginVertical: 14, marginBottom: 80 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  subtitle: { color: Colors.textMuted, fontSize: 12 },
  blockWrap: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    padding: 12, borderRadius: 16, marginBottom: 8,
  },
  itemInfoWrap: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, marginRight: 8 },
  iconWrap: {
    backgroundColor: Colors.grey, width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 18 },
  textWrap: { flex: 1 },
  nameTxt: { color: Colors.white, fontSize: 13, fontWeight: "700" },
  dateTxt: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  ledgerLiving: { color: Colors.tintColor, fontWeight: "600" },
  ledgerBulk: { color: Colors.gold, fontWeight: "600" },
  amountLiving: { color: Colors.tintColor, fontSize: 14, fontWeight: "700", fontFamily: "SpaceMono" },
  amountBulk: { color: Colors.gold, fontSize: 14, fontWeight: "700", fontFamily: "SpaceMono" },
});
