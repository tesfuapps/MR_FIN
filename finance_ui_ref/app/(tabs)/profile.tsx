import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useFinSpark } from '@/context/FinSparkContext';
import { EditProfileModal } from '@/components/EditProfileModal';

const ProfileScreen = () => {
  const {
    rent, equb, emergencyFund, profile,
    shimeTabPending, settleShimeTab, injectBooster, resetToSeed,
    poolRemaining, daysRemaining, dynamicDailyPace, t,
  } = useFinSpark();

  const [simAmount, setSimAmount] = useState('');
  const [simData, setSimData] = useState<{ amount: number; before: number; after: number; diff: number } | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const handleSimulate = () => {
    const planned = parseFloat(simAmount);
    if (isNaN(planned) || planned <= 0) {
      Alert.alert(t('invalid'), t('invalidAmount'));
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
              <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{profile.name}</Text>
            <Text style={styles.profileRole} numberOfLines={2}>{profile.role}</Text>
            <Text style={styles.profileLocation} numberOfLines={1}>📍 {profile.location}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditVisible(true)} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>✏️ {t('edit')}</Text>
          </TouchableOpacity>
        </View>

        {/* Macro Protected Reserves */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏛️ {t('macroReserves')}</Text>
          <View style={styles.gridTwo}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('houseRent')}</Text>
              <Text style={styles.statValue}>{rent.toLocaleString()} {t('etb')}</Text>
              <Text style={styles.statusPaid}>{t('paidSettled')} ✅</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('equbReserve')}</Text>
              <Text style={styles.statValue}>{equb.toLocaleString()} {t('etb')}</Text>
              <Text style={styles.statusIntact}>{t('untouchable')} ✅</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('emergencyCushion')}</Text>
              <Text style={styles.statValue}>{emergencyFund.toLocaleString()} {t('etb')}</Text>
              <Text style={styles.statusProtected}>{t('protected')} ✅</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('sideEarnings')}</Text>
              <Text style={[styles.statValue, { color: Colors.gold }]}>+6,000 {t('etb')}</Text>
              <Text style={styles.statusPaid}>{t('sideActive')}</Text>
            </View>
          </View>
        </View>

        {/* Store Tabs & Coworker Loans */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🤝 {t('storeTabs')}</Text>
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
              <Text style={styles.settledText}>{t('tabSettled', { name: t('shimeShopTab'), amount: 210 })} ✅</Text>
            </View>
          )}

          <View style={styles.settledList}>
            <Text style={styles.settledListTitle}>{t('settledPeerLoans')}</Text>
            <View style={styles.peerRow}>
              <Text style={styles.peerName}>Abela</Text>
              <Text style={styles.peerAmount}>400 {t('etb')} ✅</Text>
            </View>
            <View style={styles.peerRow}>
              <Text style={styles.peerName}>Natu Coffee</Text>
              <Text style={styles.peerAmount}>50 {t('etb')} ✅</Text>
            </View>
            <View style={styles.peerRow}>
              <Text style={styles.peerName}>Sami &amp; Sam OLY</Text>
              <Text style={styles.peerAmount}>100 {t('etb')} ✅</Text>
            </View>
          </View>
        </View>

        {/* What-If Pace Simulator */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🧮 {t('whatIf')}</Text>
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
          <Text style={styles.sectionTitle}>⚡ {t('liquidity')}</Text>
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

        {/* Reset Data */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => Alert.alert(t('resetTitle'), t('resetMsg'), [
            { text: t('cancel'), style: 'cancel' },
            { text: t('reset'), style: 'destructive', onPress: resetToSeed },
          ])}
          activeOpacity={0.7}
        >
          <Text style={styles.resetBtnText}>🔄 {t('resetSeed')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <EditProfileModal visible={editVisible} onClose={() => setEditVisible(false)} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black, alignItems: "center", overflow: "hidden" },
  scrollContent: { width: "100%", maxWidth: 520, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 90 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarRing: { padding: 3, borderRadius: 36, borderWidth: 2, borderColor: Colors.tintColor },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.tintColor, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.black, fontWeight: '900', fontSize: 26 },
  profileInfo: { marginLeft: 14, flex: 1, minWidth: 0 },
  profileName: { color: Colors.white, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  profileRole: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  profileLocation: { color: Colors.tintColor, fontSize: 11, fontWeight: '600', marginTop: 2 },
  editBtn: {
    borderWidth: 1, borderColor: Colors.tintColor, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8,
    backgroundColor: 'rgba(16,185,129,0.12)',
  },
  editBtnText: { color: Colors.tintColor, fontSize: 10, fontWeight: '800' },
  sectionCard: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, padding: 16, marginBottom: 14,
  },
  sectionTitle: { color: Colors.white, fontSize: 14, fontWeight: '800', marginBottom: 12 },
  gridTwo: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: {
    width: '48%', backgroundColor: Colors.black, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 14, padding: 12,
  },
  statLabel: { color: Colors.textMuted, fontSize: 11 },
  statValue: { color: Colors.white, fontSize: 15, fontWeight: '800', fontFamily: 'SpaceMono', marginVertical: 4 },
  statusPaid: { color: Colors.tintColor, fontSize: 10, fontWeight: '700' },
  statusIntact: { color: Colors.blue, fontSize: 10, fontWeight: '700' },
  statusProtected: { color: Colors.teal, fontSize: 10, fontWeight: '700' },
  shimeTabBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.black, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.4)',
    borderRadius: 14, padding: 12,
  },
  tabLeft: { flex: 1, minWidth: 0 },
  tabBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabName: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  pendingBadge: { backgroundColor: 'rgba(245, 158, 11, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  pendingText: { color: Colors.gold, fontSize: 9, fontWeight: '700' },
  tabSub: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  tabRight: { alignItems: 'flex-end' },
  shimeAmount: { color: Colors.gold, fontSize: 14, fontWeight: '800', fontFamily: 'SpaceMono' },
  settleBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)', borderWidth: 1, borderColor: Colors.tintColor,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4,
  },
  settleBtnText: { color: Colors.tintColor, fontSize: 10, fontWeight: '700' },
  settledBox: { backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border, padding: 12, borderRadius: 12 },
  settledText: { color: Colors.tintColor, fontSize: 12, fontWeight: '700' },
  settledList: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  settledListTitle: { color: Colors.textMuted, fontSize: 11, fontWeight: '600', marginBottom: 6 },
  peerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  peerName: { color: Colors.white, fontSize: 12 },
  peerAmount: { color: Colors.tintColor, fontSize: 12, fontWeight: '600', fontFamily: 'SpaceMono' },
  simDesc: { color: Colors.textMuted, fontSize: 12, marginBottom: 10, lineHeight: 16 },
  simInputRow: { flexDirection: 'row', gap: 8 },
  simInput: {
    flex: 1, backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, color: Colors.white,
    fontSize: 13, fontFamily: 'SpaceMono',
  },
  simBtn: { backgroundColor: Colors.tintColor, paddingHorizontal: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  simBtnText: { color: Colors.black, fontSize: 12, fontWeight: '800' },
  simResultBox: { backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 10, marginTop: 10 },
  simResultText: { color: Colors.white, fontSize: 11, lineHeight: 15 },
  boosterRow: { flexDirection: 'row', gap: 10 },
  boosterBtn: {
    flex: 1, backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 12, borderRadius: 14, alignItems: 'center',
  },
  boosterBtnHighlight: { borderColor: Colors.purple, backgroundColor: 'rgba(139, 92, 246, 0.15)' },
  boosterText: { color: Colors.white, fontSize: 13, fontWeight: '700', fontFamily: 'SpaceMono' },
  boosterTextHighlight: { color: Colors.purple, fontSize: 13, fontWeight: '800', fontFamily: 'SpaceMono' },
  resetBtn: {
    backgroundColor: Colors.cardBg, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 8,
  },
  resetBtnText: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
});
