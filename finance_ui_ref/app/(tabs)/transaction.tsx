import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useFinSpark, FinTransaction } from '@/context/FinSparkContext';

const TransactionScreen = () => {
  const { transactions, monthNameAm, monthNameEn } = useFinSpark();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'LIVING' | 'BULK_CAPITAL'>('ALL');

  const filtered = transactions.filter(t => {
    const matchesFilter = filter === 'ALL' || t.ledger === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const renderItem = ({ item }: { item: FinTransaction }) => {
    const isLiving = item.ledger === 'LIVING';
    const icon = getCategoryIcon(item.category, item.title);

    return (
      <View style={styles.txCard}>
        <View style={styles.cardLeft}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{icon}</Text>
          </View>
          <View style={styles.txDetails}>
            <Text style={styles.txTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.txSub}>
              <Text style={styles.ethDateHighlight}>{item.ethDateStr || item.dateStr}</Text> • {item.timeStr} • <Text style={isLiving ? styles.ledgerLiving : styles.ledgerBulk}>
                {isLiving ? 'የዕለት ወጪ (Living)' : 'የጅምላ (Pantry)'}
              </Text>
            </Text>
          </View>
        </View>

        <Text style={isLiving ? styles.amountLiving : styles.amountBulk}>
          -{item.amount.toLocaleString()} ETB
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>የወጪዎች ዝርዝር (Transactions)</Text>
        <Text style={styles.periodText}>የ{monthNameAm} ({monthNameEn}) ወር መዝገብ</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="በመግለጫ ወይም በዓይነት ፈልግ..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
          onPress={() => setFilter('ALL')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>ሁሉም ({transactions.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'LIVING' && styles.filterPillActiveLiving]}
          onPress={() => setFilter('LIVING')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'LIVING' && styles.filterTextActive]}>🌿 የዕለት</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'BULK_CAPITAL' && styles.filterPillActiveBulk]}
          onPress={() => setFilter('BULK_CAPITAL')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'BULK_CAPITAL' && styles.filterTextActive]}>📦 የጅምላ/መጠባበቂያ</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>የተገኘ መዝገብ የለም</Text>
            <Text style={styles.emptySub}>ምንም የሚመሳሰል የወጪ መረጃ አልተገኘም</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 8,
    marginBottom: 14,
  },
  screenTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  periodText: {
    color: Colors.tintColor,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  searchWrapper: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.white,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  filterPillActive: {
    backgroundColor: Colors.tintColor,
    borderColor: Colors.tintColor,
  },
  filterPillActiveLiving: {
    backgroundColor: Colors.tintColor,
    borderColor: Colors.tintColor,
  },
  filterPillActiveBulk: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.black,
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 90,
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  txSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  ethDateHighlight: {
    color: Colors.white,
    fontWeight: '600',
  },
  ledgerLiving: {
    color: Colors.tintColor,
    fontWeight: '600',
  },
  ledgerBulk: {
    color: Colors.gold,
    fontWeight: '600',
  },
  amountLiving: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  amountBulk: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
