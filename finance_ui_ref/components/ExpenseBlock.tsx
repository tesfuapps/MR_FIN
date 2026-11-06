import { View, Text, FlatList, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { ExpenseType } from '@/type';
import Colors from '@/constants/Colors';

interface Props {
  list: ExpenseType[];
  onPressAdd?: () => void;
}

const ExpenseBlock: React.FC<Props> = ({ list, onPressAdd }) => {
  const renderItem: ListRenderItem<Partial<ExpenseType>> = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity 
          style={styles.addItem} 
          onPress={onPressAdd}
          activeOpacity={0.7}
        >
          <Text style={styles.addPlus}>+</Text>
          <Text style={styles.addText}>Add Item</Text>
        </TouchableOpacity>
      );
    }

    let bgColor = Colors.tintColor;
    let txtColor = Colors.black;

    if (item.name === "Food & Drinks") {
      bgColor = Colors.blue;
      txtColor = Colors.black;
    } else if (item.name === "Transit") {
      bgColor = Colors.white;
      txtColor = Colors.black;
    } else if (item.name === "Misc") {
      bgColor = Colors.gold;
      txtColor = Colors.black;
    }

    return (
      <View style={[styles.expenseBlock, { backgroundColor: bgColor }]}>
        <Text style={[styles.categoryName, { color: txtColor }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.amountText, { color: txtColor }]}>{item.amount?.toLocaleString()} ETB</Text>
        <View style={styles.blockWrap}>
          <Text style={[styles.pctText, { color: txtColor }]}>{item.percentage}%</Text>
        </View>
      </View>
    );
  };

  const staticItem = [{ name: "Add Item" }];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Categories</Text>
      <FlatList 
        data={staticItem.concat(list)} 
        renderItem={renderItem} 
        horizontal 
        showsHorizontalScrollIndicator={false} 
      />
    </View>
  );
};

export default ExpenseBlock;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 14,
  },
  expenseBlock: {
    width: 110,
    padding: 14,
    borderRadius: 18,
    marginRight: 14,
    gap: 8,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 115,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  blockWrap: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pctText: {
    fontSize: 11,
    fontWeight: '700',
  },
  addItem: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    width: 100,
    padding: 14,
    borderRadius: 18,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 115,
    gap: 6,
  },
  addPlus: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '300',
  },
  addText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
