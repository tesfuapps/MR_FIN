import { Tabs } from "expo-router";
import React from "react";
import TabItems from "@/components/TabItems";
import { PieChartIcon, SwapIcon, UserIcon } from "@/components/TabIcons";
import Colors from "@/constants/Colors";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.cardBg,
          position: "absolute",
          bottom: 24,
          height: 60,
          width: 220,
          borderRadius: 22,
          borderWidth: 1,
          borderTopWidth: 1,
          borderColor: Colors.border,
          borderTopColor: Colors.border,
          alignSelf: "center",
          left: "50%",
          transform: [{ translateX: -110 }],
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 10,
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarActiveTintColor: "#000000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItems focused={focused}>
              <PieChartIcon color={focused ? "#000000" : Colors.textMuted} size={19} />
            </TabItems>
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItems focused={focused}>
              <SwapIcon color={focused ? "#000000" : Colors.textMuted} size={19} />
            </TabItems>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItems focused={focused}>
              <UserIcon color={focused ? "#000000" : Colors.textMuted} size={19} />
            </TabItems>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
