import {
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { IncomeType } from "@/type";
import { DollarIcon, WalletAddMoneyIcon, WalletCardIcon } from "@/constants/Icons";
import { Feather } from "@expo/vector-icons";

const IncomeBlock = ({ list }: { list: IncomeType[] }) => {
  const renderItem: ListRenderItem<Partial<IncomeType>> = ({ item }) => {
    let icon = <DollarIcon width={22} height={22} color={Colors.white} />;
    if (item.name === "Freelancing") {
      icon = <WalletCardIcon width={22} height={22} color={Colors.white} />;
    } else if (item.name === "Equb Reserve") {
      icon = <WalletAddMoneyIcon width={22} height={22} color={Colors.gold} />;
    }

    return (
      <View style={styles.incomeBlock}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.iconWrap}>
            {icon}
          </View>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameTxt}>{item.name}</Text>
        <Text style={styles.amountTxt}>{item.amount?.toLocaleString()} ETB</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Income & Reserves</Text>
      <FlatList
        data={list}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default IncomeBlock;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 14,
  },
  incomeBlock: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    borderRadius: 20,
    marginRight: 14,
    width: 150,
    gap: 8,
  },
  nameTxt: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  amountTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "SpaceMono",
  },
  iconWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 6,
    borderRadius: 14,
  },
});
