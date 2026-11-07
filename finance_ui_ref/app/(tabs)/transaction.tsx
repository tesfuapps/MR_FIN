import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { EmptyState } from '@/components/EmptyState';
import { useFinSpark, FinTransaction } from '@/context/FinSparkContext';

const TransactionScreen = () => {
  const {
    transactions, monthNameAm, monthNameEn, language, t,
    categoryDefs, categoryIcon, categoryLabel,
  } = useFinSpark();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'LIVING' | 'BULK_CAPITAL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = transactions.filter(tx => {
    const matchesFilter = filter === 'ALL' || tx.ledger === filter;
    const matchesCategory = categoryFilter === 'ALL' || tx.category === categoryFilter;
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      categoryLabel(tx.category).toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const renderItem = ({ item }: { item: FinTransaction }) => {
    const isLiving = item.ledger === 'LIVING';
    return (
      <View style={styles.txCard}>
        <View style={styles.cardLeft}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{categoryIcon(item.category)}</Text>
          </View>
          <View style={styles.txDetails}>
            <Text style={styles.txTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.txSub} numberOfLines={1}>
              <Text style={styles.ethDateHighlight}>{language === 'am' ? item.ethDateStr : (item.dateStr || item.ethDateStr)}</Text>
              {' • '}{categoryLabel(item.category)}{' • '}
              <Text style={isLiving ? styles.ledgerLiving : styles.ledgerBulk}>
                {isLiving ? t('livingLedgerShort') : t('bulkLedgerShort')}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={isLiving ? styles.amountLiving : styles.amountBulk} numberOfLines={1}>
          -{item.amount.toLocaleString()} {t('etb')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerWrapper}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('transactions')}</Text>
          <Text style={styles.periodText}>
            {language === 'am'
              ? `የ${monthNameAm} ወር መዝገብ`
              : `${monthNameEn} • ${t('monthRecord')}`}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Ledger filter */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
            onPress={() => setFilter('ALL')} activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
              {t('all')} ({transactions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'LIVING' && styles.filterPillActiveLiving]}
            onPress={() => setFilter('LIVING')} activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'LIVING' && styles.filterTextActive]}>
              🌿 {t('livingShort')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'BULK_CAPITAL' && styles.filterPillActiveBulk]}
            onPress={() => setFilter('BULK_CAPITAL')} activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'BULK_CAPITAL' && styles.filterTextActive]}>
              📦 {t('bulkShort')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category filter — new option for browsing logs */}
        <Text style={styles.catFilterLabel}>{t('filterByCategory')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catFilterRow}
        >
          <TouchableOpacity
            style={[styles.catPill, categoryFilter === 'ALL' && styles.catPillActive]}
            onPress={() => setCategoryFilter('ALL')} activeOpacity={0.7}
          >
            <Text style={[styles.catPillText, categoryFilter === 'ALL' && styles.catPillTextActive]}>
              {t('all')}
            </Text>
          </TouchableOpacity>
          {categoryDefs.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catPill, categoryFilter === cat.id && styles.catPillActive]}
              onPress={() => setCategoryFilter(cat.id)} activeOpacity={0.7}
            >
              <Text style={styles.catPillIcon}>{cat.icon}</Text>
              <Text style={[styles.catPillText, categoryFilter === cat.id && styles.catPillTextActive]} numberOfLines={1}>
                {categoryLabel(cat.id)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transaction list */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            transactions.length === 0 ? (
              <EmptyState icon="receipt-2" title={t('emptyTxTitle')} body={t('emptyTxSub')} />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>{t('emptyTitle')}</Text>
                <Text style={styles.emptySub}>{t('emptySub')}</Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black, alignItems: 'center', overflow: 'hidden' },
  innerWrapper: { width: '100%', maxWidth: 520, flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 8, marginBottom: 14 },
  screenTitle: { color: Colors.white, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  periodText: { color: Colors.tintColor, fontSize: 12, fontWeight: '700', marginTop: 2 },
  searchWrapper: { marginBottom: 12 },
  searchInput: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, color: Colors.white, fontSize: 13,
  },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterPill: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12,
  },
  filterPillActive: { backgroundColor: Colors.tintColor, borderColor: Colors.tintColor },
  filterPillActiveLiving: { backgroundColor: Colors.tintColor, borderColor: Colors.tintColor },
  filterPillActiveBulk: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  filterText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: Colors.black, fontWeight: '800' },
  catFilterLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', marginBottom: 6 },
  catFilterRow: { gap: 7, paddingBottom: 12 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 16, maxWidth: 130,
  },
  catPillActive: { borderColor: Colors.accent, backgroundColor: Colors.tint.accent16 },
  catPillIcon: { fontSize: 12 },
  catPillText: { color: Colors.textMuted, fontSize: 10, fontWeight: '700' },
  catPillTextActive: { color: Colors.white, fontWeight: '800' },
  listContent: { paddingBottom: 90 },
  txCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    padding: 14, borderRadius: 16, marginBottom: 8,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  iconCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.grey,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 18 },
  txDetails: { flex: 1 },
  txTitle: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  txSub: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  ethDateHighlight: { color: Colors.white, fontWeight: '600' },
  ledgerLiving: { color: Colors.tintColor, fontWeight: '600' },
  ledgerBulk: { color: Colors.gold, fontWeight: '600' },
  amountLiving: { color: Colors.tintColor, fontSize: 13, fontWeight: '800', fontFamily: 'SpaceMono' },
  amountBulk: { color: Colors.gold, fontSize: 13, fontWeight: '800', fontFamily: 'SpaceMono' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyTitle: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  emptySub: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
});
