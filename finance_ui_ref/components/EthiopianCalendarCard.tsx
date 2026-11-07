import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { useFinSpark } from '@/context/FinSparkContext';
import { ETHIOPIAN_MONTHS } from '@/utils/ethiopianCalendar';

export const EthiopianCalendarCard: React.FC = () => {
  const {
    ethDate,
    monthNameEn,
    monthNameAm,
    nextMonthAm,
    currentDay,
    totalDays,
    daysRemaining,
    transactions,
    selectedMonthIndex,
    setSelectedMonthIndex,
    language,
    t,
  } = useFinSpark();

  const [expanded, setExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(currentDay);

  // Group transactions by day to show dots on the calendar
  const daySpendMap = React.useMemo(() => {
    const map: { [day: number]: { count: number; totalLiving: number } } = {};
    transactions.forEach(t => {
      if (!map[t.day]) {
        map[t.day] = { count: 0, totalLiving: 0 };
      }
      map[t.day].count += 1;
      if (t.ledger === 'LIVING') {
        map[t.day].totalLiving += t.amount;
      }
    });
    return map;
  }, [transactions]);

  // Selected day transactions
  const selectedDayTx = transactions.filter(t => t.day === selectedDay);

  return (
    <View style={styles.card}>
      {/* Top Bar with Amharic Date */}
      <View style={styles.topRow}>
        <View style={styles.dateCol}>
          <View style={styles.flagBadgeRow}>
            <Text style={styles.ethFlag}>🇪🇹</Text>
            <Text style={styles.ethDateTitle}>{ethDate.formattedAm}</Text>
          </View>
          <Text style={styles.ethDateSub}>
            {language === 'am'
              ? `${monthNameAm} • ${currentDay}ኛው ቀን`
              : `${monthNameEn} • ${currentDay} / ${totalDays}`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setExpanded(prev => !prev)}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleBtnText}>
            {expanded ? `▲ ${t('hide')}` : `▼ ${t('calendar')}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cycle Countdown Pill */}
      <View style={styles.countdownBanner}>
        <Text style={styles.countdownText}>
          {language === 'am' ? (
            <>⏳ እስከ <Text style={styles.highlightNextMonth}>{nextMonthAm}</Text> ድረስ{' '}
              <Text style={styles.highlightDays}>{daysRemaining} ቀናት</Text> ቀርተዋል</>
          ) : (
            <>⏳ <Text style={styles.highlightDays}>{daysRemaining} {t('days')}</Text> left until{' '}
              <Text style={styles.highlightNextMonth}>{nextMonthAm}</Text></>
          )}
        </Text>
      </View>

      {/* Expanded 30-Day Grid */}
      {expanded && (
        <View style={styles.expandedSection}>
          {/* Horizontal Month Switcher */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthScroll}
          >
            {ETHIOPIAN_MONTHS.map(m => (
              <TouchableOpacity
                key={m.index}
                style={[
                  styles.monthPill,
                  selectedMonthIndex === m.index && styles.monthPillActive,
                ]}
                onPress={() => setSelectedMonthIndex(m.index)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.monthPillText,
                    selectedMonthIndex === m.index && styles.monthPillTextActive,
                  ]}
                >
                  {language === 'am' ? m.am : m.en}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 30-Day Grid */}
          <Text style={styles.gridHeaderLabel}>
            {language === 'am'
              ? `የ${monthNameAm} ወር ቀናት (1 – ${totalDays})`
              : t('monthDays', { n: totalDays })}
          </Text>

          <View style={styles.daysGrid}>
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(dayNum => {
              const isToday = dayNum === currentDay;
              const isSelected = dayNum === selectedDay;
              const isFuture = dayNum > currentDay;
              const hasSpend = daySpendMap[dayNum];

              return (
                <TouchableOpacity
                  key={dayNum}
                  style={[
                    styles.dayCell,
                    isToday && styles.dayCellToday,
                    isSelected && !isToday && styles.dayCellSelected,
                    isFuture && styles.dayCellFuture,
                  ]}
                  onPress={() => setSelectedDay(dayNum)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday && styles.dayNumberToday,
                      isFuture && styles.dayNumberFuture,
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {hasSpend && (
                    <View
                      style={[
                        styles.dot,
                        hasSpend.totalLiving > 250
                          ? styles.dotHigh
                          : styles.dotLow,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Day Spending Details */}
          {selectedDay && (
            <View style={styles.dayDetailsBox}>
              <View style={styles.dayDetailsHeader}>
                <Text style={styles.dayDetailsTitle}>
                  {t('daySpendTitle', {
                    month: language === 'am' ? monthNameAm : monthNameEn,
                    day: selectedDay,
                    n: selectedDayTx.length,
                  })}
                </Text>
                {selectedDay === currentDay && (
                  <View style={styles.todayPill}>
                    <Text style={styles.todayPillText}>{t('today')}</Text>
                  </View>
                )}
              </View>

              {selectedDayTx.length === 0 ? (
                <Text style={styles.noTxText}>{t('noSpendingDay')}</Text>
              ) : (
                selectedDayTx.map(t => (
                  <View key={t.id} style={styles.dayTxRow}>
                    <Text style={styles.dayTxTitle} numberOfLines={1}>
                      • {t.title}
                    </Text>
                    <Text
                      style={
                        t.ledger === 'LIVING'
                          ? styles.dayTxAmountLiving
                          : styles.dayTxAmountBulk
                      }
                    >
                      -{t.amount} ETB
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateCol: {
    flex: 1,
  },
  flagBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ethFlag: {
    fontSize: 16,
  },
  ethDateTitle: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  ethDateSub: {
    color: Colors.tintColor,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  toggleBtn: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  toggleBtnText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  countdownBanner: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  countdownText: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
  highlightNextMonth: {
    color: Colors.gold,
    fontWeight: '700',
  },
  highlightDays: {
    color: Colors.tintColor,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  expandedSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  monthScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  monthPill: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  monthPillActive: {
    backgroundColor: Colors.tintColor,
    borderColor: Colors.tintColor,
  },
  monthPillText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  monthPillTextActive: {
    color: Colors.black,
    fontWeight: '800',
  },
  gridHeaderLabel: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    marginVertical: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    width: '12.5%',
    aspectRatio: 1,
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayCellToday: {
    width: '12.5%',
    aspectRatio: 1,
    backgroundColor: Colors.tintColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: Colors.tintColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  dayCellSelected: {
    width: '12.5%',
    aspectRatio: 1,
    backgroundColor: Colors.grey,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayCellFuture: {
    width: '12.5%',
    aspectRatio: 1,
    backgroundColor: Colors.overlay.scrimStrong,
    borderWidth: 1,
    borderColor: Colors.overlay.hairline,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayNumber: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  dayNumberToday: {
    color: Colors.black,
    fontWeight: '900',
  },
  dayNumberFuture: {
    color: Colors.textMuted,
    opacity: 0.4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 3,
  },
  dotLow: {
    backgroundColor: Colors.blue,
  },
  dotHigh: {
    backgroundColor: Colors.red,
  },
  dayDetailsBox: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  dayDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayDetailsTitle: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  todayPill: {
    backgroundColor: Colors.tint.accent20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayPillText: {
    color: Colors.tintColor,
    fontSize: 9,
    fontWeight: '800',
  },
  noTxText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },
  dayTxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  dayTxTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    flex: 1,
  },
  dayTxAmountLiving: {
    color: Colors.tintColor,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  dayTxAmountBulk: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
});
