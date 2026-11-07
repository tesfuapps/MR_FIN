import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { PieChart } from 'react-native-gifted-charts';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import ExpenseBlock from '@/components/ExpenseBlock';
import IncomeBlock from '@/components/IncomeBlock';
import SpendingBlock from '@/components/SpendingBlock';
import { PaceHero } from '@/components/PaceHero';
import { EthiopianCalendarCard } from '@/components/EthiopianCalendarCard';
import { QuickLogPresets } from '@/components/QuickLogPresets';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { EditProfileModal } from '@/components/EditProfileModal';
import { EmptyState } from '@/components/EmptyState';
import ExpenseList from '@/data/expenses.json';
import IncomeList from '@/data/income.json';
import { useFinSpark } from '@/context/FinSparkContext';

const Page = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const {
    livingPoolSpent, livingPoolBaseline, bulkBudget, transactions, percentUsed,
    monthNameAm, monthNameEn, language, t,
  } = useFinSpark();

  const monthLabel = language === 'am' ? monthNameAm : monthNameEn;
  // Phase 1.1 — no transactions and no budgets means a genuinely fresh start.
  const isEmpty = transactions.length === 0 && livingPoolBaseline === 0 && bulkBudget === 0;

  const remainingPct = Math.max(0, 100 - percentUsed);
  const pieData = [
    {
      value: percentUsed,
      color: percentUsed > 90 ? Colors.status.overPace : Colors.status.onTarget,
      focused: true,
      text: `${percentUsed}%`,
    },
    {
      value: remainingPct,
      color: Colors.surfaceAlt,
      focused: false,
      text: `${remainingPct}%`,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ header: () => <Header /> }} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {isEmpty && (
            <EmptyState
              icon="wallet"
              title={t('emptyHomeTitle')}
              body={t('emptyHomeSub')}
              actionLabel={t('emptyHomeAction')}
              onAction={() => setProfileVisible(true)}
            />
          )}

          {/* Top Summary & Semi-Circle Donut Chart */}
          <View style={styles.topSummaryRow}>
            <View style={styles.summaryTextCol}>
              <Text style={styles.summaryLabel} numberOfLines={1}>
                {t('monthlySpent')} · {monthLabel}
              </Text>
              <Text style={styles.summaryAmount} numberOfLines={1}>
                {livingPoolSpent.toLocaleString()}
                <Text style={styles.currencySub}> {t('etb')}</Text>
              </Text>
              <Text style={styles.poolBaselineText} numberOfLines={1}>
                {t('of')} {livingPoolBaseline.toLocaleString()} {t('etb')} {t('baseline')}
              </Text>
            </View>

            <View style={styles.chartWrapper}>
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
                semiCircle
                radius={58}
                innerRadius={44}
                innerCircleColor={Colors.bg}
                centerLabelComponent={() => (
                  <View style={styles.chartCenterLabel}>
                    <Text style={styles.chartCenterPct}>{percentUsed}%</Text>
                    <Text style={styles.chartCenterSub}>{t('used')}</Text>
                  </View>
                )}
              />
            </View>
          </View>

          {/* Dynamic Daily Pace Card */}
          <PaceHero />

          {/* Ethiopian Calendar 30-Day Tracker */}
          <EthiopianCalendarCard />

          {/* 1-Tap Addis Micro-Transit & Buna */}
          <QuickLogPresets onPressCustom={() => setModalVisible(true)} />

          {/* Expense Categories with + Add Item */}
          <ExpenseBlock list={ExpenseList} onPressAdd={() => setModalVisible(true)} />

          {/* Income & Untouchable Reserves */}
          <IncomeBlock list={IncomeList} />

          {/* Recent Spending Feed */}
          <SpendingBlock />
        </ScrollView>

        {/* Add Expense Modal (with category selector) */}
        <AddExpenseModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        <EditProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 520,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100,
    overflow: 'hidden',
  },
  topSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryTextCol: { flex: 1 },
  summaryLabel: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  summaryAmount: {
    color: Colors.text,
    fontWeight: '900',
    fontSize: 28,
    fontFamily: 'SpaceMono',
    marginTop: 2,
  },
  currencySub: { fontSize: 16, fontWeight: '400', color: Colors.textMuted },
  poolBaselineText: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },
  chartWrapper: { paddingVertical: 8, alignItems: 'center', marginLeft: 8 },
  chartCenterLabel: { justifyContent: 'center', alignItems: 'center' },
  chartCenterPct: {
    fontSize: 16, color: Colors.text, fontWeight: 'bold', fontFamily: 'SpaceMono',
  },
  chartCenterSub: { fontSize: 8, color: Colors.textMuted },
});
