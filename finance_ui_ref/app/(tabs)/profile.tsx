import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useFinSpark } from '@/context/FinSparkContext';

const ProfileScreen = () => {
  const {
    rent,
    equb,
    emergencyFund,
    shimeTabPending,
    settleShimeTab,
    injectBooster,
    resetToSeed,
    poolRemaining,
    daysRemaining,
    dynamicDailyPace,
  } = useFinSpark();

  const [simAmount, setSimAmount] = useState('');
  const [simResult, setSimResult] = useState<string | null>(null);

  const handleSimulate = () => {
    const planned = parseFloat(simAmount);
    if (isNaN(planned) || planned <= 0) {
      Alert.alert('Invalid', 'Enter a valid expense amount in ETB.');
      return;
    }

    const newPool = Math.max(0, poolRemaining - planned);
    const newPace = Math.round(newPool / daysRemaining);
    const diff = dynamicDailyPace - newPace;

    setSimResult(
      `Spending ${planned} ETB today reduces your remaining pace from ${dynamicDailyPace} ETB/day to ${newPace} ETB/day (-${diff} ETB/day drop).`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* User Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>T</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Tesfish</Text>
            <Text style={styles.profileRole}>Printing Specialist & Brand Strategist</Text>
            <Text style={styles.profileLocation}>📍 Addis Ababa, Ethiopia</Text>
          </View>
        </View>

        {/* Macro Protected Reserves */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏛️ Macro Reserves & Fixed Sinks</Text>
          <View style={styles.gridTwo}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>House Rent</Text>
              <Text style={styles.statValue}>{rent.toLocaleString()} ETB</Text>
              <Text style={styles.statusPaid}>Paid & Settled ✅</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Equb Reserve</Text>
              <Text style={styles.statValue}>{equb.toLocaleString()} ETB</Text>
              <Text style={styles.statusIntact}>Untouchable ✅</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Emergency Cushion</Text>
              <Text style={styles.statValue}>{emergencyFund.toLocaleString()} ETB</Text>
              <Text style={styles.statusProtected}>Protected ✅</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Side Earnings</Text>
              <Text style={[styles.statValue, { color: Colors.gold }]}>+6,000 ETB</Text>
              <Text style={styles.statusPaid}>Oct–Nov Active</Text>
            </View>
          </View>
        </View>

        {/* Store Tabs & Coworker Loans */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🤝 Store Tabs & Peer Loans</Text>
          {shimeTabPending ? (
            <View style={styles.shimeTabBox}>
              <View>
                <View style={styles.tabBadgeRow}>
                  <Text style={styles.tabName}>Shime Shop Tab</Text>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pending</Text>
                  </View>
                </View>
                <Text style={styles.tabSub}>Counted in previous budget cycle</Text>
              </View>
              <View style={styles.tabRight}>
                <Text style={styles.shimeAmount}>210 ETB</Text>
                <TouchableOpacity
                  style={styles.settleBtn}
                  onPress={settleShimeTab}
                  activeOpacity={0.7}
                >
                  <Text style={styles.settleBtnText}>Settle</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.settledBox}>
              <Text style={styles.settledText}>Shime Shop Tab (210 ETB) Settled ✅</Text>
            </View>
          )}

          <View style={styles.settledList}>
            <Text style={styles.settledListTitle}>Settled Peer Loans:</Text>
            <View style={styles.peerRow}>
              <Text style={styles.peerName}>Abela</Text>
              <Text style={styles.peerAmount}>400 ETB ✅</Text>
            </View>
            <View style={styles.peerRow}>
              <Text style={styles.peerName}>Natu Coffee</Text>
              <Text style={styles.peerAmount}>50 ETB ✅</Text>
            </View>
            <View style={styles.peerRow}>
              <Text style={styles.peerName}>Sami & Sam OLY</Text>
              <Text style={styles.peerAmount}>100 ETB ✅</Text>
            </View>
          </View>
        </View>

        {/* What-If Pace Simulator */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🧮 "What-If" Pace Simulator</Text>
          <Text style={styles.simDesc}>
            Test how a planned purchase today will reshape your daily allowance for the remaining {daysRemaining} days.
          </Text>
          <View style={styles.simInputRow}>
            <TextInput
              style={styles.simInput}
              placeholder="Planned ETB (e.g. 300)"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={simAmount}
              onChangeText={setSimAmount}
            />
            <TouchableOpacity style={styles.simBtn} onPress={handleSimulate} activeOpacity={0.8}>
              <Text style={styles.simBtnText}>Simulate</Text>
            </TouchableOpacity>
          </View>

          {simResult && (
            <View style={styles.simResultBox}>
              <Text style={styles.simResultText}>{simResult}</Text>
            </View>
          )}
        </View>

        {/* Quick Liquidity Booster */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚡ Quick Liquidity Transfer</Text>
          <Text style={styles.simDesc}>
            Inject funds from savings buffer into the Living Pool to boost daily pace.
          </Text>
          <View style={styles.boosterRow}>
            <TouchableOpacity
              style={styles.boosterBtn}
              onPress={() => injectBooster(500)}
              activeOpacity={0.7}
            >
              <Text style={styles.boosterText}>+500 ETB</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.boosterBtn, styles.boosterBtnHighlight]}
              onPress={() => injectBooster(1000)}
              activeOpacity={0.7}
            >
              <Text style={styles.boosterTextHighlight}>+1,000 ETB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Data */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            Alert.alert(
              'Reset Data',
              'Reset to the canonical 26-day Tikimt dataset?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: resetToSeed },
              ]
            );
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.resetBtnText}>🔄 Reset to 26-Day Tikimt Seed Data</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 90, // Space for bottom floating bar
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.tintColor,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.tintColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.black,
    fontWeight: '900',
    fontSize: 26,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  profileRole: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  profileLocation: {
    color: Colors.tintColor,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  gridTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  statValue: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
    marginVertical: 4,
  },
  statusPaid: {
    color: Colors.tintColor,
    fontSize: 10,
    fontWeight: '700',
  },
  statusIntact: {
    color: Colors.blue,
    fontSize: 10,
    fontWeight: '700',
  },
  statusProtected: {
    color: Colors.teal,
    fontSize: 10,
    fontWeight: '700',
  },
  shimeTabBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderRadius: 14,
    padding: 12,
  },
  tabBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabName: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingText: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '700',
  },
  tabSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  tabRight: {
    alignItems: 'flex-end',
  },
  shimeAmount: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  settleBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: Colors.tintColor,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  settleBtnText: {
    color: Colors.tintColor,
    fontSize: 10,
    fontWeight: '700',
  },
  settledBox: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 12,
  },
  settledText: {
    color: Colors.tintColor,
    fontSize: 12,
    fontWeight: '700',
  },
  settledList: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  settledListTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  peerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  peerName: {
    color: Colors.white,
    fontSize: 12,
  },
  peerAmount: {
    color: Colors.tintColor,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  simDesc: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  simInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  simInput: {
    flex: 1,
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'SpaceMono',
  },
  simBtn: {
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simBtnText: {
    color: Colors.black,
    fontSize: 12,
    fontWeight: '800',
  },
  simResultBox: {
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  simResultText: {
    color: Colors.white,
    fontSize: 11,
    lineHeight: 15,
  },
  boosterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  boosterBtn: {
    flex: 1,
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  boosterBtnHighlight: {
    borderColor: Colors.purple,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  boosterText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  boosterTextHighlight: {
    color: Colors.purple,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  resetBtn: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  resetBtnText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
});
