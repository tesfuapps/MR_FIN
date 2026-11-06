import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

export const PieChartIcon: React.FC<{ color?: string; size?: number }> = ({
  color = "#ffffff",
  size = 20,
}) => <Ionicons name="pie-chart" size={size} color={color} />;

export const SwapIcon: React.FC<{ color?: string; size?: number }> = ({
  color = "#ffffff",
  size = 20,
}) => <Ionicons name="swap-horizontal" size={size} color={color} />;

export const UserIcon: React.FC<{ color?: string; size?: number }> = ({
  color = "#ffffff",
  size = 20,
}) => <Ionicons name="person" size={size} color={color} />;

export const MoreHorizontalIcon: React.FC<{ color?: string; size?: number }> = ({
  color = "#ffffff",
  size = 20,
}) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />;
