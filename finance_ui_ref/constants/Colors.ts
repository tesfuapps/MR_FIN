/**
 * Mr. Fin — the single source of truth for colour. (Phase 1.3)
 *
 * No component may declare its own hex/rgba literal. Everything below is a
 * named semantic token: screens reference `Colors.surface`, `Colors.warning`,
 * `Colors.tint.accent15`, `Colors.status.overPace`, etc.
 *
 * Delivery: `react-native-svg` + StyleSheet, so tokens are plain strings that
 * work identically on native and in Expo's static web export.
 *
 * ── Status colours (pace badges) ──────────────────────────────────────────
 * `status.onTarget`  — today's spend < 80%  of the daily target
 * `status.nearPace`  — today's spend 80–100% of the daily target
 * `status.overPace`  — today's spend > 100%  of the daily target
 * Thresholds are the Rule 4 badge rules in PHASES.md (Phase 2). The badge,
 * the pace hero, the pace track and the toast accent all read these three
 * tokens so a status never drifts between screens.
 *
 * ── Contrast (WCAG AA, computed for every text token) ─────────────────────
 *   text        on bg        18.30:1   PASS
 *   text        on surface   16.40:1   PASS
 *   textMuted   on bg         7.47:1   PASS
 *   textMuted   on surface    6.69:1   PASS
 *   textMuted   on surfaceAlt 6.19:1   PASS
 *   onAccent    on accent     7.55:1   PASS
 *   onAccent    on warning    8.92:1   PASS
 *   accent      on bg         7.55:1   PASS (large text / icons)
 *   warning     on bg         8.92:1   PASS
 *   danger      on bg         5.09:1   PASS
 *   info        on bg         5.21:1   PASS
 * AA requires >= 4.5:1 for normal text and >= 3:1 for large text/UI parts.
 */

const hex = {
  bg: '#0b0f19',
  surface: '#131b2e',
  surfaceAlt: '#1a2235',
  surfaceRaised: '#243049',
  border: '#2d3748',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  accent: '#10b981',       // Emerald — Ethiopian green
  accentDark: '#059669',
  warning: '#f59e0b',      // Ethiopian gold / amber
  danger: '#ef4444',       // Rose
  info: '#3b82f6',         // Sky blue
  teal: '#14b8a6',
  purple: '#8b5cf6',
  categoryYellow: '#eab308',
  categoryCyan: '#22d3ee',
  categoryViolet: '#a78bfa',
  onAccent: '#0b0f19',     // text drawn on accent / warning fills
  shadow: '#000000',
  black: '#000000',
  white: '#ffffff',
  snackbar: '#1c2740',
} as const;

/** Build an rgba tint from a token hex. Only called inside this module. */
function rgba(color: string, alpha: number): string {
  const h = color.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const Colors = {
  // ── Semantic tokens ────────────────────────────────────────────────────
  bg: hex.bg,
  surface: hex.surface,
  surfaceAlt: hex.surfaceAlt,
  surfaceRaised: hex.surfaceRaised,
  border: hex.border,
  text: hex.text,
  textMuted: hex.textMuted,
  accent: hex.accent,
  accentDark: hex.accentDark,
  success: hex.accent,
  warning: hex.warning,
  danger: hex.danger,
  info: hex.info,
  teal: hex.teal,
  purple: hex.purple,
  categoryYellow: hex.categoryYellow,
  categoryCyan: hex.categoryCyan,
  categoryViolet: hex.categoryViolet,
  onAccent: hex.onAccent,
  shadow: hex.shadow,
  snackbar: hex.snackbar,
  transparent: rgba(hex.black, 0),

  /** Pace badge status colours. See the threshold table above. */
  status: {
    onTarget: hex.accent,
    nearPace: hex.warning,
    overPace: hex.danger,
  },

  /** Pre-computed translucent fills — components never build their own rgba. */
  overlay: {
    transparent: rgba(hex.black, 0),
    scrim: rgba(hex.black, 0.15),
    scrimStrong: rgba(hex.black, 0.3),
    labelOnFill: rgba(hex.black, 0.6),
    backdrop: rgba(hex.black, 0.75),
    backdropStrong: rgba(hex.black, 0.78),
    hairline: rgba(hex.white, 0.05),
  },

  tint: {
    accent0: rgba(hex.accent, 0),
    accent06: rgba(hex.accent, 0.06),
    accent07: rgba(hex.accent, 0.07),
    accent10: rgba(hex.accent, 0.10),
    accent12: rgba(hex.accent, 0.12),
    accent14: rgba(hex.accent, 0.14),
    accent15: rgba(hex.accent, 0.15),
    accent16: rgba(hex.accent, 0.16),
    accent18: rgba(hex.accent, 0.18),
    accent20: rgba(hex.accent, 0.20),
    accent25: rgba(hex.accent, 0.25),
    accent45: rgba(hex.accent, 0.45),
    accent60: rgba(hex.accent, 0.60),
    warning0: rgba(hex.warning, 0),
    warning14: rgba(hex.warning, 0.14),
    warning15: rgba(hex.warning, 0.15),
    warning20: rgba(hex.warning, 0.20),
    warning25: rgba(hex.warning, 0.25),
    warning40: rgba(hex.warning, 0.40),
    danger08: rgba(hex.danger, 0.08),
    danger15: rgba(hex.danger, 0.15),
    danger50: rgba(hex.danger, 0.50),
    purple15: rgba(hex.purple, 0.15),
  },

  /** Translucent fills paired with each pace status. */
  statusTint: {
    onTarget: rgba(hex.accent, 0.15),
    nearPace: rgba(hex.warning, 0.15),
    overPace: rgba(hex.danger, 0.15),
  },

  // ── Legacy aliases ─────────────────────────────────────────────────────
  // Kept so existing screens keep compiling while they migrate to the
  // semantic names above. All values point back to the same hex tokens.
  black: hex.bg,
  cardBg: hex.surface,
  grey: hex.surfaceAlt,
  greyLight: hex.surfaceRaised,
  white: hex.text,
  textMutedLegacy: hex.textMuted,
  tintColor: hex.accent,
  tintDark: hex.accentDark,
  gold: hex.warning,
  blue: hex.info,
  red: hex.danger,
};

export default Colors;
