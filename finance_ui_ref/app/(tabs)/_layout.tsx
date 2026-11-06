import { Tabs } from "expo-router";
import React from "react";
import TabItems from "@/components/TabItems";
import Colors from "@/constants/Colors";
import { FontAwesome, AntDesign, SimpleLineIcons } from "@expo/vector-icons";

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
        tabBarActiveTintColor: Colors.black,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabItems focused={focused} color={color}>
              <SimpleLineIcons name="pie-chart" size={18} color={color} />
            </TabItems>
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabItems focused={focused} color={color}>
              <AntDesign name="swap" size={18} color={color} />
            </TabItems>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabItems focused={focused} color={color}>
              <FontAwesome name="user-o" size={18} color={color} />
            </TabItems>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
