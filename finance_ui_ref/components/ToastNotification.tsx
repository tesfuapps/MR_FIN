import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useFinSpark } from '@/context/FinSparkContext';
import { ToastData, ToastType, ToastStyle } from '@/utils/types';

// Kept as re-exports so any remaining imports of these types still resolve.
export type { ToastData, ToastType, ToastStyle } from '@/utils/types';

/**
 * Five selectable notification styles. The chosen style, duration and copy
 * all come from FinSparkContext so Settings can preview them live.
 */
export const ToastNotification: React.FC = () => {
  const { toast, dismissToast, toastStyle, toastDuration, t } = useFinSpark();

  const isBottom = toastStyle === 'snackbar';
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const offscreen = isBottom ? 300 : -300;
    if (!toast) {
      slideAnim.setValue(offscreen);
      opacityAnim.setValue(0);
      return;
    }

    slideAnim.setValue(offscreen);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    if (toastDuration <= 0) return; // sticky: manual dismiss only

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: offscreen,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => dismissToast());
    }, toastDuration);

    return () => clearTimeout(timer);
  }, [toast, toastStyle, toastDuration, isBottom]);

  if (!toast) return null;

  const typeColor =
    toast.type === 'success' ? Colors.tintColor :
    toast.type === 'warning' ? Colors.gold :
    toast.type === 'error' ? Colors.red : Colors.blue;

  const typeLabel =
    toast.type === 'success' ? t('toastOnTarget') :
    toast.type === 'warning' ? t('toastTight') :
    toast.type === 'error' ? t('toastOverPace') : t('toastLogged');

  const transform: any[] = toastStyle === 'chip'
    ? [{ translateY: Animated.multiply(slideAnim, 0.08) }, { translateX: Animated.multiply(slideAnim, -0.35) }]
    : [{ translateY: slideAnim }];

  const containerStyle: any = [
    styles.container,
    isBottom ? styles.containerBottom : styles.containerTop,
    toastStyle === 'chip' && styles.containerChip,
    { transform, opacity: opacityAnim },
  ];

  const renderBody = () => {
    switch (toastStyle) {
      case 'minimal':
        return (
          <View style={[styles.minimalBar, { backgroundColor: typeColor }]}>
            <Text style={styles.minimalIcon}>{toast.icon}</Text>
            <Text style={styles.minimalTitle} numberOfLines={1}>{toast.title}</Text>
            <Text style={styles.minimalAmount}>{toast.amount}</Text>
            <Text style={styles.minimalLabel}>{typeLabel}</Text>
          </View>
        );

      case 'snackbar':
        return (
          <View style={styles.snackbar}>
            <Text style={styles.snackIcon}>{toast.icon}</Text>
            <View style={styles.snackTextCol}>
              <Text style={styles.snackTitle} numberOfLines={1}>{toast.title}</Text>
              <Text style={styles.snackDetail} numberOfLines={1}>{toast.detail}</Text>
            </View>
            <Text style={[styles.snackAmount, { color: typeColor }]}>{toast.amount}</Text>
            <TouchableOpacity onPress={dismissToast} style={styles.snackDismiss} activeOpacity={0.7}>
              <Text style={styles.snackDismissText}>{t('ok')}</Text>
            </TouchableOpacity>
          </View>
        );

      case 'banner':
        return (
          <View style={[styles.banner, { borderColor: typeColor, backgroundColor: typeColor + '1F' }]}>
            <View style={styles.bannerTop}>
              <Text style={styles.bannerIcon}>{toast.icon}</Text>
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerTitle} numberOfLines={1}>{toast.title}</Text>
                <Text style={styles.bannerDetail} numberOfLines={2}>{toast.detail}</Text>
                <Text style={[styles.bannerLabel, { color: typeColor }]}>{typeLabel} • {toast.pace}</Text>
              </View>
              <Text style={[styles.bannerAmount, { color: typeColor }]} numberOfLines={1}>{toast.amount}</Text>
            </View>
            <View style={[styles.bannerProgress, { backgroundColor: typeColor }]} />
          </View>
        );

      case 'chip':
        return (
          <View style={[styles.chip, { borderColor: typeColor, backgroundColor: typeColor + '26' }]}>
            <Text style={styles.chipIcon}>{toast.icon}</Text>
            <Text style={[styles.chipAmount, { color: typeColor }]}>{toast.amount}</Text>
            <Text style={styles.chipLabel}>{typeLabel}</Text>
            <TouchableOpacity onPress={dismissToast} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.chipClose}>✕</Text>
            </TouchableOpacity>
          </View>
        );

      default: // classic
        return (
          <View style={[styles.toast, { borderLeftColor: typeColor }]}>
            <View style={[styles.iconWrap, { backgroundColor: typeColor + '22' }]}>
              <Text style={styles.icon}>{toast.icon}</Text>
            </View>
            <View style={styles.contentCol}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>{toast.title}</Text>
                <Text style={[styles.amount, { color: typeColor }]}>{toast.amount}</Text>
              </View>
              <Text style={styles.detail} numberOfLines={1}>{toast.detail}</Text>
              <View style={styles.paceRow}>
                <View style={[styles.pacePill, { backgroundColor: typeColor + '18', borderColor: typeColor }]}>
                  <Text style={[styles.paceLabel, { color: typeColor }]}>{typeLabel}</Text>
                </View>
                <Text style={styles.paceText}>{t('pace')}: <Text style={styles.paceValue}>{toast.pace}</Text></Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <Animated.View style={containerStyle} pointerEvents="box-none">
      <TouchableOpacity onPress={dismissToast} activeOpacity={1} style={styles.dismissLayer}>
        {renderBody()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  containerTop: {
    top: 0,
    paddingHorizontal: 12,
    paddingTop: 50,
  },
  containerBottom: {
    bottom: 96,
    paddingHorizontal: 16,
  },
  containerChip: {
    paddingTop: 54,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  dismissLayer: {
    width: '100%',
  },

  // ── Classic ────────────────────────────────────────────────────────────
  toast: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    padding: 12,
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  contentCol: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: Colors.white, fontSize: 13, fontWeight: '700', flex: 1, marginRight: 8 },
  amount: { fontSize: 14, fontWeight: '800', fontFamily: 'SpaceMono' },
  detail: { color: Colors.textMuted, fontSize: 11 },
  paceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  pacePill: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  paceLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  paceText: { color: Colors.textMuted, fontSize: 10 },
  paceValue: { color: Colors.white, fontWeight: '700', fontFamily: 'SpaceMono' },

  // ── Minimal ────────────────────────────────────────────────────────────
  minimalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  minimalIcon: { fontSize: 16 },
  minimalTitle: { color: Colors.black, fontSize: 12, fontWeight: '800', flex: 1 },
  minimalAmount: { color: Colors.black, fontSize: 12, fontWeight: '900', fontFamily: 'SpaceMono' },
  minimalLabel: { color: 'rgba(0,0,0,0.6)', fontSize: 8, fontWeight: '800' },

  // ── Snackbar ───────────────────────────────────────────────────────────
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1c2740',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  snackIcon: { fontSize: 18 },
  snackTextCol: { flex: 1, minWidth: 0 },
  snackTitle: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  snackDetail: { color: Colors.textMuted, fontSize: 10, marginTop: 1 },
  snackAmount: { fontSize: 12, fontWeight: '900', fontFamily: 'SpaceMono' },
  snackDismiss: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  snackDismissText: { color: Colors.white, fontSize: 10, fontWeight: '800' },

  // ── Banner ─────────────────────────────────────────────────────────────
  banner: {
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
  },
  bannerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bannerIcon: { fontSize: 26 },
  bannerTextCol: { flex: 1, minWidth: 0 },
  bannerTitle: { color: Colors.white, fontSize: 15, fontWeight: '800' },
  bannerDetail: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  bannerLabel: { fontSize: 9, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
  bannerAmount: { fontSize: 20, fontWeight: '900', fontFamily: 'SpaceMono', maxWidth: 110, textAlign: 'right' },
  bannerProgress: { height: 3, borderRadius: 2, marginTop: 12, opacity: 0.9 },

  // ── Chip ───────────────────────────────────────────────────────────────
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipIcon: { fontSize: 15 },
  chipAmount: { fontSize: 12, fontWeight: '900', fontFamily: 'SpaceMono' },
  chipLabel: { color: Colors.textMuted, fontSize: 8, fontWeight: '800' },
  chipClose: { color: Colors.textMuted, fontSize: 11, marginLeft: 2 },
});
