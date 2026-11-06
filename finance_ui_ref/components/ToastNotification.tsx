import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Colors from '@/constants/Colors';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  icon: string;
  title: string;
  amount: string;
  detail: string;
  pace: string;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      // Slide in from top
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 3.5s
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -300,
            duration: 300,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => onDismiss());
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      slideAnim.setValue(-300);
      opacityAnim.setValue(0);
    }
  }, [toast]);

  if (!toast) return null;

  const typeColor =
    toast.type === 'success' ? Colors.tintColor :
    toast.type === 'warning' ? Colors.gold :
    toast.type === 'error' ? Colors.red :
    Colors.blue;

  const typeLabel =
    toast.type === 'success' ? 'ON TARGET' :
    toast.type === 'warning' ? 'TIGHT' :
    toast.type === 'error' ? 'OVER PACE' :
    'LOGGED';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
      pointerEvents="none"
    >
      <View style={[styles.toast, { borderLeftColor: typeColor }]}>
        {/* Left: Icon */}
        <View style={[styles.iconWrap, { backgroundColor: typeColor + '22' }]}>
          <Text style={styles.icon}>{toast.icon}</Text>
        </View>

        {/* Middle: Details */}
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
            <Text style={styles.paceText}>Pace: <Text style={styles.paceValue}>{toast.pace}</Text></Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
    paddingHorizontal: 12,
    paddingTop: 50,
  },
  toast: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    padding: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  contentCol: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
  },
  detail: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  paceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  pacePill: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  paceLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  paceText: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  paceValue: {
    color: Colors.white,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
});
