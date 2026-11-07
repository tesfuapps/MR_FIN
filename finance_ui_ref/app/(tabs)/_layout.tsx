import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import TabItems from '@/components/TabItems';
import { TablerIcon, ICON_SIZE, TablerIconName } from '@/components/TablerIcons';

/** Phase 1.4 — Tabler outline icons, 20px compact size, stroke width 2. */
const tabIcon = (name: TablerIconName, focused: boolean) => (
  <TabItems focused={focused}>
    <TablerIcon name={name} size={ICON_SIZE.compact} color={focused ? Colors.onAccent : Colors.textMuted} />
  </TabItems>
);

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        // Without this, Expo's static web export emits a default white header
        // titled "index" into index.html. React removes it on hydration, but if
        // the JS bundle ever fails to load the raw SSR shell stays on screen as
        // a white "index" board. Hide the header for every tab at the source.
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          height: 60,
          width: 288,
          maxWidth: '92%',
          borderRadius: 22,
          borderWidth: 1,
          borderTopWidth: 1,
          borderColor: Colors.border,
          borderTopColor: Colors.border,
          alignSelf: 'center',
          marginHorizontal: 'auto',
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 10,
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarActiveTintColor: Colors.onAccent,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => tabIcon('chart-pie', focused) }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarIcon: ({ focused }) => tabIcon('arrows-exchange', focused),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => tabIcon('user', focused),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => tabIcon('settings', focused),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
