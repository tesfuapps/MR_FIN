/**
 * Tabler Icons — outline variant (MIT).
 * https://github.com/tabler/tabler-icons
 *
 * Delivery method: react-native-svg components (already a project dependency)
 * rather than a web SVG sprite, so the same icons render natively and during
 * Expo's static web export. Every path comes from the official 24x24 outline
 * set: stroke width 2, round caps/joins, no fills. (Phase 1.4)
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import Colors from '@/constants/Colors';

export const TABLER_PATHS = {
  'chart-pie': [
    "M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8",
    "M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5",
  ],
  'arrows-exchange': [
    "M7 10h14l-4 -4",
    "M17 14h-14l4 4",
  ],
  'user': [
    "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",
    "M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2",
  ],
  'settings': [
    "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z",
    "M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",
  ],
  'world': [
    "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
    "M3.6 9h16.8",
    "M3.6 15h16.8",
    "M11.5 3a17 17 0 0 0 0 18",
    "M12.5 3a17 17 0 0 1 0 18",
  ],
  'bell': [
    "M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6",
    "M9 17v1a3 3 0 0 0 6 0v-1",
  ],
  'tags': [
    "M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z",
    "M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592",
    "M7 10h-.01",
  ],
  'database': [
    "M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0",
    "M4 6v6a8 3 0 0 0 16 0v-6",
    "M4 12v6a8 3 0 0 0 16 0v-6",
  ],
  'trash': [
    "M4 7l16 0",
    "M10 11l0 6",
    "M14 11l0 6",
    "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12",
    "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",
  ],
  'download': [
    "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
    "M7 11l5 5l5 -5",
    "M12 4l0 12",
  ],
  'chart-bar': [
    "M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z",
    "M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z",
    "M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z",
    "M4 20h14",
  ],
  'clipboard': [
    "M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2",
    "M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z",
  ],
  'folder-open': [
    "M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2",
  ],
  'upload': [
    "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
    "M7 9l5 -5l5 5",
    "M12 4l0 12",
  ],
  'check': [
    "M5 12l5 5l10 -10",
  ],
  'eye': [
    "M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
    "M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6",
  ],
  'x': [
    "M18 6l-12 12",
    "M6 6l12 12",
  ],
  'plus': [
    "M12 5l0 14",
    "M5 12l14 0",
  ],
  'pencil': [
    "M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4",
    "M13.5 6.5l4 4",
  ],
  'dots': [
    "M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  ],
  'currency-dollar': [
    "M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2",
    "M12 3v3m0 12v3",
  ],
  'wallet': [
    "M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12",
    "M20 12v4h-4a2 2 0 0 1 0 -4h4",
  ],
  'pig-money': [
    "M15 11v.01",
    "M5.173 8.378a3 3 0 1 1 4.656 -1.377",
    "M16 4v3.803a6.019 6.019 0 0 1 2.658 3.197h1.341a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-1.342c-.336 .95 -.907 1.8 -1.658 2.473v2.027a1.5 1.5 0 0 1 -3 0v-.583a6.04 6.04 0 0 1 -1 .083h-4a6.04 6.04 0 0 1 -1 -.083v.583a1.5 1.5 0 0 1 -3 0v-2l0 -.027a6 6 0 0 1 4 -10.473h2.5l4.5 -3h0z",
  ],
  'credit-card': [
    "M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z",
    "M3 10l18 0",
    "M7 15l.01 0",
    "M11 15l2 0",
  ],
  'bolt': [
    "M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11",
  ],
  'search': [
    "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0",
    "M21 21l-6 -6",
  ],
  'calendar': [
    "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z",
    "M16 3v4",
    "M8 3v4",
    "M4 11h16",
    "M11 15h1",
    "M12 15v3",
  ],
  'info-circle': [
    "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
    "M12 9h.01",
    "M11 12h1v4h1",
  ],
  'alert-triangle': [
    "M12 9v4",
    "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z",
    "M12 16h.01",
  ],
  'coin': [
    "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
    "M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1",
    "M12 7v10",
  ],
  'receipt-2': [
    "M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2",
    "M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5",
  ],
  'circle-plus': [
    "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
    "M9 12h6",
    "M12 9v6",
  ],
  'building-bank': [
    "M3 21l18 0",
    "M3 10l18 0",
    "M5 6l7 -3l7 3",
    "M4 10l0 11",
    "M20 10l0 11",
    "M8 14l0 3",
    "M12 14l0 3",
    "M16 14l0 3",
  ],
  'exclamation-circle': [
    "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
    "M12 9v4",
    "M12 16v.01",
  ],
} as const;

export type TablerIconName = keyof typeof TABLER_PATHS;

export const ICON_SIZE = { hero: 28, default: 24, compact: 20 } as const;
export const ICON_STROKE = 2;

export interface TablerIconProps {
  name: TablerIconName;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export const TablerIcon: React.FC<TablerIconProps> = ({
  name,
  color = Colors.text,
  size = ICON_SIZE.default,
  strokeWidth = ICON_STROKE,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {(TABLER_PATHS[name] as readonly string[]).map((d, i) => (
      <Path key={i} d={d} fill="none" />
    ))}
  </Svg>
);

export default TablerIcon;
