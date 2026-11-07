import React from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExpenseType } from '@/type';
import Colors from '@/constants/Colors';
import { TablerIcon, ICON_SIZE } from '@/components/TablerIcons';
import { useFinSpark } from '@/context/FinSparkContext';

interface Props {
  list: ExpenseType[];
  onPressAdd?: () => void;
}

const AM_LABELS: Record<string, string> = {
  Housing: 'መኖሪያ',
  'Food & Drinks': 'ምግብና መጠጥ',
  Transit: 'ትራንስፖርት',
  Misc: 'ሌላ',
};

const ExpenseBlock: React.FC<Props> = ({ list, onPressAdd }) => {
  const { language, t } = useFinSpark();
  const localize = (name: string) => language === 'am' ? (AM_LABELS[name] || name) : name;

  const renderItem: ListRenderItem<Partial<ExpenseType>> = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity style={styles.addItem} onPress={onPressAdd} activeOpacity={0.7}>
          <TablerIcon name="plus" color={Colors.text} size={ICON_SIZE.default} />
          <Text style={styles.addText}>{t('addItem')}</Text>
        </TouchableOpacity>
      );
    }

    let bgColor: string = Colors.accent;
    let txtColor: string = Colors.onAccent;

    if (item.name === 'Food & Drinks') {
      bgColor = Colors.info;
    } else if (item.name === 'Transit') {
      bgColor = Colors.text;
    } else if (item.name === 'Misc') {
      bgColor = Colors.warning;
    }

    return (
      <View style={[styles.expenseBlock, { backgroundColor: bgColor }]}>
        <Text style={[styles.categoryName, { color: txtColor }]} numberOfLines={1}>
          {localize(item.name || '')}
        </Text>
        <Text style={[styles.amountText, { color: txtColor }]}>
          {item.amount?.toLocaleString()} {t('etb')}
        </Text>
        <View style={styles.blockWrap}>
          <Text style={[styles.pctText, { color: txtColor }]}>{item.percentage}%</Text>
        </View>
      </View>
    );
  };

  const staticItem = [{ name: 'Add Item' }];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('expenseCategories')}</Text>
      <View style={styles.carouselWrapper}>
        <FlatList
          data={staticItem.concat(list)}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        />
      </View>
    </View>
  );
};

export default ExpenseBlock;

const styles = StyleSheet.create({
  container: { marginVertical: 10, overflow: 'hidden' },
  carouselWrapper: { overflow: 'hidden', width: '100%' },
  carouselContent: { paddingRight: 20 },
  title: { color: Colors.text, fontWeight: '700', fontSize: 16, marginBottom: 14 },
  expenseBlock: {
    width: 96, padding: 12, borderRadius: 18, marginRight: 10, gap: 6,
    alignItems: 'flex-start', justifyContent: 'space-between', minHeight: 105,
  },
  categoryName: { fontSize: 11, fontWeight: '700' },
  amountText: { fontSize: 13, fontWeight: '800', fontFamily: 'SpaceMono' },
  blockWrap: { backgroundColor: Colors.overlay.scrim, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  pctText: { fontSize: 10, fontWeight: '700' },
  addItem: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border,
    backgroundColor: Colors.surface, width: 88, padding: 12, borderRadius: 18,
    marginRight: 10, alignItems: 'center', justifyContent: 'center', minHeight: 105, gap: 6,
  },
  addText: { color: Colors.text, fontSize: 12, fontWeight: '600' },
});
