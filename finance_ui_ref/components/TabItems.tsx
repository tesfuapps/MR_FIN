import { View } from "react-native";
import React, { ReactNode } from "react";
import Colors from "@/constants/Colors";

interface TabItemsProps {
  focused: boolean;
  color: string;
  children: ReactNode;
}

const TabItems: React.FC<TabItemsProps> = ({ focused, children }) => {
  return (
    <View
      style={{
        borderRadius: 14,
        backgroundColor: focused ? Colors.tintColor : "transparent",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
      }}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            color: focused ? Colors.black : Colors.textMuted,
          })
        : children}
    </View>
  );
};

export default TabItems;
