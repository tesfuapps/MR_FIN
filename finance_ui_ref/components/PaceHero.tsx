import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useFinSpark } from '@/context/FinSparkContext';

export const PaceHero: React.FC = () => {
  const {
    monthNameAm, monthNameEn, nextMonthAm,
    currentDay, totalDays, dynamicDailyPace, spentToday, todayRemaining,
    poolRemaining, daysRemaining, language, t,
  } = useFinSpark();

  const isOver = todayRemaining < 0;
  const isTight = todayRemaining >= 0 && todayRemaining < dynamicDailyPace * 0.3;
  const statusColor = isOver ? Colors.red : isTight ? Colors.gold : Colors.tintColor;
  const statusLabel = isOver ? t('overPace') : isTight ? t('tight') : t('onTarget');

  const periodLabel = language === 'am'
    ? `${monthNameAm} • ${currentDay}ኛው ቀን ${t('of')} ${totalDays}`
    : `${monthNameEn.toUpperCase()} • DAY ${currentDay} OF ${totalDays}`;

  const spendProgress = dynamicDailyPace > 0
    ? Math.min(100, Math.round((spentToday / dynamicDailyPace) * 100))
    : 100;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.targetCol}>
          <View style={styles.liveBadgeRow}>
            <View style={[styles.pulseDot, { backgroundColor: statusColor }]} />
            <Text style={styles.sectionTitle}>{periodLabel}</Text>
          </View>
          <View style={styles.paceNumberRow}>
            <Text style={styles.paceNumber}>{dynamicDailyPace}</Text>
            <Text style={styles.paceUnit}>{t('etbPerDay')}</Text>
          </View>
        </View>

        <View style={[styles.badge, { borderColor: statusColor, backgroundColor: `${statusColor}1A` }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.subText}>
          {t('spentToday')} <Text style={styles.subBold}>{spentToday} {t('etb')}</Text>
        </Text>
        <Text style={styles.subText}>
          {t('todaysLeft')} <Text style={[styles.subBold, { color: statusColor }]}>{todayRemaining} {t('etb')}</Text>
        </Text>
      </View>

      <View style={styles.trackBg}>
        <View style={[styles.trackFill, { width: `${spendProgress}%`, backgroundColor: statusColor }]} />
      </View>

      <View style={styles.footerRow}>
        <View style={styles.footerCol}>
          <Text style={styles.footerLabel}>{t('remainingPool')}</Text>
          <Text style={styles.footerValue}>{poolRemaining.toLocaleString()} {t('etb')}</Text>
        </View>
        <View style={styles.footerColRight}>
          <Text style={styles.footerLabel}>{t('until')} {nextMonthAm}</Text>
          <Text style={[styles.footerValue, { color: Colors.gold }]}>{daysRemaining} {t('daysLeft')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg, borderRadius: 20, borderWidth: 1,
    borderColor: Colors.border, padding: 18, marginVertical: 12,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  targetCol: { flex: 1 },
  liveBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pulseDot: { width: 7, height: 7, borderRadius: 4 },
  sectionTitle: { color: Colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.6 },
  paceNumberRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
  paceNumber: { color: Colors.white, fontSize: 30, fontWeight: '900', fontFamily: 'SpaceMono' },
  paceUnit: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  badge: { borderWidth: 1, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 6 },
  subText: { color: Colors.textMuted, fontSize: 11 },
  subBold: { color: Colors.white, fontWeight: '700', fontFamily: 'SpaceMono' },
  trackBg: { height: 6, backgroundColor: Colors.grey, borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 4 },
  footerRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 14,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footerCol: { flex: 1 },
  footerColRight: { alignItems: 'flex-end' },
  footerLabel: { color: Colors.textMuted, fontSize: 10 },
  footerValue: { color: Colors.white, fontSize: 13, fontWeight: '700', marginTop: 2, fontFamily: 'SpaceMono' },
});
