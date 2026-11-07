import React from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { IncomeType } from '@/type';
import { TablerIcon, ICON_SIZE, TablerIconName } from '@/components/TablerIcons';
import { useFinSpark } from '@/context/FinSparkContext';

const AM_LABELS: Record<string, string> = {
  Salary: 'ደመወዝ',
  Freelancing: 'ፍሪላንስ',
  'Equb Reserve': 'የእቁብ መጠባበቂያ',
};

/** Phase 1.4 — Tabler outline icons replace the bundled SVG asset set. */
const ICON_FOR: Record<string, TablerIconName> = {
  Salary: 'currency-dollar',
  Freelancing: 'wallet',
  'Equb Reserve': 'pig-money',
};

const IncomeBlock = ({ list }: { list: IncomeType[] }) => {
  const { language, t } = useFinSpark();
  const localize = (name: string) => language === 'am' ? (AM_LABELS[name] || name) : name;

  const renderItem: ListRenderItem<Partial<IncomeType>> = ({ item }) => {
    const name = item.name || '';
    const iconName: TablerIconName = ICON_FOR[name] || 'coin';
    const iconColor = name === 'Equb Reserve' ? Colors.warning : Colors.text;

    return (
      <View style={styles.incomeBlock}>
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <TablerIcon name={iconName} color={iconColor} size={ICON_SIZE.compact} />
          </View>
          <TablerIcon name="dots" color={Colors.textMuted} size={ICON_SIZE.compact} />
        </View>
        <Text style={styles.nameTxt} numberOfLines={1}>{localize(name)}</Text>
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
  title: { color: Colors.text, fontWeight: '700', fontSize: 16, marginBottom: 14 },
  incomeBlock: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    padding: 14, borderRadius: 20, marginRight: 10, width: 132, gap: 6,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameTxt: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  amountTxt: { color: Colors.text, fontSize: 15, fontWeight: '700', fontFamily: 'SpaceMono' },
  iconWrap: { borderWidth: 1, borderColor: Colors.border, padding: 5, borderRadius: 12 },
});
