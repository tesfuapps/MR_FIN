import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { IncomeType } from "@/type";
import { DollarIcon, WalletAddMoneyIcon, WalletCardIcon } from "@/constants/Icons";
import { MoreHorizontalIcon } from "@/components/TabIcons";
import { useFinSpark } from "@/context/FinSparkContext";

const AM_LABELS: Record<string, string> = {
  Salary: 'ደመወዝ',
  Freelancing: 'ፍሪላንስ',
  'Equb Reserve': 'የእቁብ መጠባበቂያ',
};

const IncomeBlock = ({ list }: { list: IncomeType[] }) => {
  const { language, t } = useFinSpark();
  const localize = (name: string) => language === 'am' ? (AM_LABELS[name] || name) : name;

  const renderItem: ListRenderItem<Partial<IncomeType>> = ({ item }) => {
    let icon = <DollarIcon width={22} height={22} color={Colors.white} />;
    if (item.name === "Freelancing") {
      icon = <WalletCardIcon width={22} height={22} color={Colors.white} />;
    } else if (item.name === "Equb Reserve") {
      icon = <WalletAddMoneyIcon width={22} height={22} color={Colors.gold} />;
    }

    return (
      <View style={styles.incomeBlock}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.iconWrap}>{icon}</View>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MoreHorizontalIcon color={Colors.textMuted} size={18} />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameTxt} numberOfLines={1}>{localize(item.name || '')}</Text>
        <Text style={styles.amountTxt}>{item.amount?.toLocaleString()} {t('etb')}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('incomeTitle')}</Text>
      <View style={styles.carouselWrapper}>
        <FlatList
          data={list}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        />
      </View>
    </View>
  );
};

export default IncomeBlock;

const styles = StyleSheet.create({
  container: { marginVertical: 10, overflow: 'hidden' },
  carouselWrapper: { overflow: 'hidden', width: '100%' },
  carouselContent: { paddingRight: 20 },
  title: { color: Colors.white, fontWeight: "700", fontSize: 16, marginBottom: 14 },
  incomeBlock: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    padding: 14, borderRadius: 20, marginRight: 10, width: 132, gap: 6,
  },
  nameTxt: { color: Colors.white, fontSize: 13, fontWeight: "600" },
  amountTxt: { color: Colors.white, fontSize: 15, fontWeight: "700", fontFamily: "SpaceMono" },
  iconWrap: { borderWidth: 1, borderColor: Colors.border, padding: 5, borderRadius: 12 },
});
