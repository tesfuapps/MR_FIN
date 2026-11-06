import { View } from "react-native";
import React, { ReactNode } from "react";
import Colors from "@/constants/Colors";

interface TabItemsProps {
  focused: boolean;
  color?: string;
  children: ReactNode;
}

const TabItems: React.FC<TabItemsProps> = ({ focused, children }) => {
  const iconColor = focused ? "#000000" : Colors.textMuted;

  return (
    <View
      style={{
        borderRadius: 14,
        backgroundColor: focused ? Colors.tintColor : "transparent",
        alignItems: "center",
        justifyContent: "center",
        width: 42,
        height: 42,
      }}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            color: iconColor,
          })
        : children}
    </View>
  );
};

export default TabItems;
