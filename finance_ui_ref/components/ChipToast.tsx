import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, Easing, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Colors from '@/constants/Colors';
import { TablerIcon, ICON_SIZE, TablerIconName } from '@/components/TablerIcons';
import { useFinSpark } from '@/context/FinSparkContext';
import { ToastData, ToastType } from '@/utils/types';

// Re-exported so any remaining type imports keep resolving.
export type { ToastData, ToastType } from '@/utils/types';

const TYPE_COLOR: Record<ToastType, string> = {
  success: Colors.status.onTarget,
  warning: Colors.status.nearPace,
  error: Colors.status.overPace,
  info: Colors.info,
};

const TYPE_ICON: Record<ToastType, TablerIconName> = {
  success: 'check',
  warning: 'alert-triangle',
  error: 'exclamation-circle',
  info: 'info-circle',
};

/**
 * Phase 1.5 — the single, compact chip toast.
 *
 * Replaces the five selectable styles in `ToastNotification`. Toasts emitted
 * by the context are queued here, so two rapid actions never overlap: only
 * one pill is on screen at a time and the rest play in order.
 */
export const ChipToast: React.FC = () => {
  const { toast, dismissToast, toastDuration } = useFinSpark();
  const [queue, setQueue] = useState<ToastData[]>([]);
  const [active, setActive] = useState<ToastData | null>(null);
  const seenId = useRef<string | null>(null);
  const slide = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Enqueue each distinct toast emitted by the context.
  useEffect(() => {
    if (toast && toast.id !== seenId.current) {
      seenId.current = toast.id;
      setQueue(prev => [...prev, toast]);
    }
  }, [toast]);

  // Promote the next queued chip once the current one is gone.
  useEffect(() => {
    if (!active && queue.length > 0) {
      setActive(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [active, queue]);

  const close = useCallback(() => {
    setActive(null);
    dismissToast();
  }, [dismissToast]);

  useEffect(() => {
    if (!active) return;
    slide.setValue(-24);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    if (toastDuration <= 0) return; // sticky: manual dismiss only

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slide, {
          toValue: -24, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start(() => close());
    }, toastDuration);

    return () => clearTimeout(timer);
  }, [active, toastDuration, slide, opacity, close]);

  if (!active) return null;

  const accent = TYPE_COLOR[active.type];

  return (
    <Animated.View
      style={[styles.wrap, { opacity, transform: [{ translateY: slide }] }]}
      pointerEvents="box-none"
    >
      <View style={[styles.chip, { borderColor: accent }]}>
        <TablerIcon name={TYPE_ICON[active.type]} color={accent} size={ICON_SIZE.compact} />
        {!!active.icon && <Text style={styles.glyph}>{active.icon}</Text>}
        <Text style={styles.message} numberOfLines={1}>{active.title}</Text>
        {!!active.amount && (
          <Text style={[styles.amount, { color: accent }]} numberOfLines={1}>{active.amount}</Text>
        )}
        <TouchableOpacity
          onPress={close}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <TablerIcon name="x" color={Colors.textMuted} size={ICON_SIZE.compact} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ChipToast;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 52,
    right: 12,
    left: 12,
    alignItems: 'flex-end',
    zIndex: 1000,
    elevation: 1000,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    maxWidth: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  glyph: { fontSize: 14 },
  message: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },
  amount: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'SpaceMono',
  },
});
