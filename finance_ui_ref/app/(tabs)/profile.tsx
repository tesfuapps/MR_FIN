import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { TablerIcon, ICON_SIZE, TablerIconName } from '@/components/TablerIcons';
import { EditProfileModal } from '@/components/EditProfileModal';
import { useFinSpark } from '@/context/FinSparkContext';

interface SimData {
  [key: string]: number;
  amount: number;
  before: number;
  after: number;
  diff: number;
}

const SectionTitle: React.FC<{ icon: TablerIconName; text: string }> = ({ icon, text }) => (
  <View style={styles.sectionTitleRow}>
    <TablerIcon name={icon} color={Colors.accent} size={ICON_SIZE.compact} />
    <Text style={styles.sectionTitle}>{text}</Text>
  </View>
);

const ProfileScreen = () => {
  const {
    rent, equb, emergencyFund, profile,
    shimeTabPending, settleShimeTab, injectBooster,
    poolRemaining, daysRemaining, dynamicDailyPace, t, showToast,
  } = useFinSpark();

  const [simAmount, setSimAmount] = useState('');
  const [simData, setSimData] = useState<SimData | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const displayName = profile.name.trim() || t('appName');

  const handleSimulate = () => {
    const planned = parseFloat(simAmount);
    if (isNaN(planned) || planned <= 0) {
      showToast({
        id: `sim-invalid-${Date.now()}`,
        type: 'error', icon: '', title: t('invalid'),
        amount: '', detail: t('invalidAmount'), pace: '',
      });
      return;
    }
    const newPool = Math.max(0, poolRemaining - planned);
    const newPace = Math.round(newPool / daysRemaining);
    setSimData({ amount: planned, before: dynamicDailyPace, after: newPace, diff: dynamicDailyPace - newPace });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* User Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.profileRole} numberOfLines={2}>{profile.role}</Text>
            <Text style={styles.profileLocation} numberOfLines={1}>{profile.location}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditVisible(true)} activeOpacity={0.7}>
            <TablerIcon name="pencil" color={Colors.accent} size={ICON_SIZE.compact} />
          </TouchableOpacity>
        </View>

        {/* Macro Protected Reserves */}
        <View style={styles.sectionCard}>
          <SectionTitle icon="building-bank" text={t('macroReserves')} />
          <View style={styles.gridTwo}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('houseRent')}</Text>
              <Text style={styles.statValue}>{rent.toLocaleString()} {t('etb')}</Text>
              <Text style={styles.statusPaid}>{t('paidSettled')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('equbReserve')}</Text>
              <Text style={styles.statValue}>{equb.toLocaleString()} {t('etb')}</Text>
              <Text style={styles.statusIntact}>{t('untouchable')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('emergencyCushion')}</Text>
              <Text style={styles.statValue}>{emergencyFund.toLocaleString()} {t('etb')}</Text>
              <Text style={styles.statusProtected}>{t('protected')}</Text>
            </View>
          </View>
        </View>

        {/* Store Tabs & Coworker Loans */}
        <View style={styles.sectionCard}>
          <SectionTitle icon="receipt-2" text={t('storeTabs')} />
          {shimeTabPending ? (
            <View style={styles.shimeTabBox}>
              <View style={styles.tabLeft}>
                <View style={styles.tabBadgeRow}>
                  <Text style={styles.tabName}>{t('shimeShopTab')}</Text>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>{t('pending')}</Text>
                  </View>
                </View>
                <Text style={styles.tabSub}>{t('countedPrev')}</Text>
              </View>
              <View style={styles.tabRight}>
                <Text style={styles.shimeAmount}>210 {t('etb')}</Text>
                <TouchableOpacity style={styles.settleBtn} onPress={settleShimeTab} activeOpacity={0.7}>
                  <Text style={styles.settleBtnText}>{t('settle')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.settledBox}>
              <TablerIcon name="check" color={Colors.accent} size={ICON_SIZE.compact} />
              <Text style={styles.settledText}>{t('noPendingTabs')}</Text>
            </View>
          )}
        </View>

        {/* What-If Pace Simulator */}
        <View style={styles.sectionCard}>
          <SectionTitle icon="chart-bar" text={t('whatIf')} />
          <Text style={styles.simDesc}>{t('whatIfDesc', { n: daysRemaining })}</Text>
          <View style={styles.simInputRow}>
            <TextInput
              style={styles.simInput}
              placeholder={t('plannedPlaceholder')}
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={simAmount}
              onChangeText={setSimAmount}
            />
            <TouchableOpacity style={styles.simBtn} onPress={handleSimulate} activeOpacity={0.8}>
              <Text style={styles.simBtnText}>{t('simulate')}</Text>
            </TouchableOpacity>
          </View>

          {simData && (
            <View style={styles.simResultBox}>
              <Text style={styles.simResultText}>{t('simResult', simData)}</Text>
            </View>
          )}
        </View>

        {/* Quick Liquidity Booster */}
        <View style={styles.sectionCard}>
          <SectionTitle icon="bolt" text={t('liquidity')} />
          <Text style={styles.simDesc}>{t('liquidityDesc')}</Text>
          <View style={styles.boosterRow}>
            <TouchableOpacity style={styles.boosterBtn} onPress={() => injectBooster(500)} activeOpacity={0.7}>
              <Text style={styles.boosterText}>+500 {t('etb')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.boosterBtn, styles.boosterBtnHighlight]}
              onPress={() => injectBooster(1000)} activeOpacity={0.7}
            >
              <Text style={styles.boosterTextHighlight}>+1,000 {t('etb')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <EditProfileModal visible={editVisible} onClose={() => setEditVisible(false)} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', overflow: 'hidden' },
  scrollContent: { width: '100%', maxWidth: 520, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 90 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarRing: { padding: 3, borderRadius: 36, borderWidth: 2, borderColor: Colors.accent },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.onAccent, fontWeight: '900', fontSize: 26 },
  profileInfo: { marginLeft: 14, flex: 1, minWidth: 0 },
  profileName: { color: Colors.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  profileRole: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  profileLocation: { color: Colors.accent, fontSize: 11, fontWeight: '600', marginTop: 2 },
  editBtn: {
    borderWidth: 1, borderColor: Colors.accent, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8,
    backgroundColor: Colors.tint.accent12,
  },
  sectionCard: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, padding: 16, marginBottom: 14,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { color: Colors.text, fontSize: 14, fontWeight: '800' },
  gridTwo: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: {
    width: '48%', backgroundColor: Colors.bg, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 14, padding: 12,
  },
  statLabel: { color: Colors.textMuted, fontSize: 11 },
  statValue: { color: Colors.text, fontSize: 15, fontWeight: '800', fontFamily: 'SpaceMono', marginVertical: 4 },
  statusPaid: { color: Colors.accent, fontSize: 10, fontWeight: '700' },
  statusIntact: { color: Colors.info, fontSize: 10, fontWeight: '700' },
  statusProtected: { color: Colors.teal, fontSize: 10, fontWeight: '700' },
  shimeTabBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.tint.warning40,
    borderRadius: 14, padding: 12,
  },
  tabLeft: { flex: 1, minWidth: 0 },
  tabBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabName: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  pendingBadge: { backgroundColor: Colors.tint.warning20, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  pendingText: { color: Colors.warning, fontSize: 9, fontWeight: '700' },
  tabSub: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  tabRight: { alignItems: 'flex-end' },
  shimeAmount: { color: Colors.warning, fontSize: 14, fontWeight: '800', fontFamily: 'SpaceMono' },
  settleBtn: {
    backgroundColor: Colors.tint.accent15, borderWidth: 1, borderColor: Colors.accent,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4,
  },
  settleBtnText: { color: Colors.accent, fontSize: 10, fontWeight: '700' },
  settledBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, padding: 12, borderRadius: 12,
  },
  settledText: { color: Colors.accent, fontSize: 12, fontWeight: '700' },
  simDesc: { color: Colors.textMuted, fontSize: 12, marginBottom: 10, lineHeight: 16 },
  simInputRow: { flexDirection: 'row', gap: 8 },
  simInput: {
    flex: 1, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, color: Colors.text,
    fontSize: 13, fontFamily: 'SpaceMono',
  },
  simBtn: { backgroundColor: Colors.accent, paddingHorizontal: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  simBtnText: { color: Colors.onAccent, fontSize: 12, fontWeight: '800' },
  simResultBox: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 10, marginTop: 10 },
  simResultText: { color: Colors.text, fontSize: 11, lineHeight: 15 },
  boosterRow: { flexDirection: 'row', gap: 10 },
  boosterBtn: {
    flex: 1, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 12, borderRadius: 14, alignItems: 'center',
  },
  boosterBtnHighlight: { borderColor: Colors.purple, backgroundColor: Colors.tint.purple15 },
  boosterText: { color: Colors.text, fontSize: 13, fontWeight: '700', fontFamily: 'SpaceMono' },
  boosterTextHighlight: { color: Colors.purple, fontSize: 13, fontWeight: '800', fontFamily: 'SpaceMono' },
});
