import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';

interface TabItemsProps {
  focused: boolean;
  children: ReactNode;
}

/** Phase 1.4 — active tab pill; the child icon is a Tabler outline SVG. */
const TabItems: React.FC<TabItemsProps> = ({ focused, children }) => {
  const iconColor = focused ? Colors.onAccent : Colors.textMuted;

  return (
    <View style={[styles.pill, focused && styles.pillActive]}>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, { color: iconColor })
        : children}
    </View>
  );
};

export default TabItems;

const styles = StyleSheet.create({
  pill: {
    borderRadius: 14,
    backgroundColor: Colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
  },
  pillActive: { backgroundColor: Colors.accent },
});
