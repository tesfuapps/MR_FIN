import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const PieChartIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#ffffff', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <Path d="M22 12A10 10 0 0 0 12 2v10z" />
  </Svg>
);

export const SwapIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#ffffff', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m16 3 4 4-4 4" />
    <Path d="M20 7H4" />
    <Path d="m8 21-4-4 4-4" />
    <Path d="M4 17h16" />
  </Svg>
);

export const UserIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#ffffff', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const MoreHorizontalIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#ffffff', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="12" r="2" />
    <Circle cx="19" cy="12" r="2" />
    <Circle cx="5" cy="12" r="2" />
  </Svg>
);

