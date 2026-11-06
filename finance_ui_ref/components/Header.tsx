import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useFinSpark } from "@/context/FinSparkContext";
import { useRouter } from "expo-router";

const Header = () => {
  const { monthNameEn, monthNameAm, currentDay, totalDays, ethDate } = useFinSpark();
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: Colors.black }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Avatar Ring */}
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>T</Text>
            </View>
          </View>
          <View style={{ marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.title}>Hi, Tesfish</Text>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{ethDate.dayNameAm}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>
              {monthNameAm} ({monthNameEn}) • {currentDay} / {totalDays}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.push("/profile")} 
          style={styles.btn}
          activeOpacity={0.7}
        >
          <Text style={styles.btnText}>Reserves</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  avatarRing: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.tintColor,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.tintColor,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.black,
    fontWeight: "900",
    fontSize: 18,
  },
  title: {
    color: Colors.white,
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: -0.3,
  },
  dayBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: Colors.tintColor,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  dayBadgeText: {
    color: Colors.tintColor,
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  btn: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  btnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
