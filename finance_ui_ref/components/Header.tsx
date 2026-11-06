import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useFinSpark } from "@/context/FinSparkContext";
import { useRouter } from "expo-router";

const Header = () => {
  const {
    monthNameEn, monthNameAm, currentDay, totalDays, ethDate,
    language, profile, t,
  } = useFinSpark();
  const router = useRouter();

  const monthLabel = language === 'am' ? monthNameAm : monthNameEn;
  const dayLabel = language === 'am' ? ethDate.dayNameAm : ethDate.dayNameEn;

  return (
    <SafeAreaView style={{ backgroundColor: Colors.black }}>
      <View style={styles.container}>
        <View style={styles.leftRow}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.textCol}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {t('hi')}, {profile.name}
              </Text>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText} numberOfLines={1}>{dayLabel}</Text>
              </View>
            </View>
            <Text style={styles.subtitle} numberOfLines={1}>
              {monthLabel} • {currentDay} / {totalDays}
            </Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            onPress={() => router.push("/settings" as any)}
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.iconBtnText}>⚙</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={styles.btn}
            activeOpacity={0.7}
          >
            <Text style={styles.btnText} numberOfLines={1}>{t('reserves')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 8,
  },
  leftRow: { flexDirection: "row", alignItems: "center", flex: 1, minWidth: 0 },
  avatarRing: { padding: 2, borderRadius: 22, borderWidth: 2, borderColor: Colors.tintColor },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.tintColor, alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: Colors.black, fontWeight: "900", fontSize: 16 },
  textCol: { marginLeft: 10, flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { color: Colors.white, fontWeight: "800", fontSize: 15, letterSpacing: -0.3, flexShrink: 1 },
  dayBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)', borderWidth: 1,
    borderColor: Colors.tintColor, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 6,
  },
  dayBadgeText: { color: Colors.tintColor, fontSize: 9, fontWeight: '700' },
  subtitle: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn: {
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.cardBg,
    width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
  },
  iconBtnText: { color: Colors.tintColor, fontSize: 15 },
  btn: {
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.cardBg,
    paddingVertical: 6, paddingHorizontal: 9, borderRadius: 12,
  },
  btnText: { color: Colors.white, fontSize: 10, fontWeight: "600" },
});
