import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

/**
 * Filled inline SVG tab icons.
 *
 * IMPORTANT: These must stay as real <svg> elements. Vector font glyph icons
 * (e.g. @expo/vector-icons Ionicons) render as empty <div> nodes during Expo
 * static web rendering, which shows up as blank squares in the deployed
 * bottom tab bar on mobile browsers.
 */
interface IconProps {
  color?: string;
  size?: number;
}

export const PieChartIcon: React.FC<IconProps> = ({
  color = "#ffffff",
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path
      fill={color}
      d="M11 2a9 9 0 1 0 9 9h-9V2z"
    />
    <Path
      fill={color}
      d="M13 2.05A9 9 0 0 1 21.95 11H13V2.05z"
    />
  </Svg>
);

export const SwapIcon: React.FC<IconProps> = ({
  color = "#ffffff",
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path
      fill={color}
      d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"
    />
  </Svg>
);

export const UserIcon: React.FC<IconProps> = ({
  color = "#ffffff",
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path
      fill={color}
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </Svg>
);

export const MoreHorizontalIcon: React.FC<IconProps> = ({
  color = "#ffffff",
  size = 20,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="5" cy="12" r="2" fill={color} />
    <Circle cx="12" cy="12" r="2" fill={color} />
    <Circle cx="19" cy="12" r="2" fill={color} />
  </Svg>
);
