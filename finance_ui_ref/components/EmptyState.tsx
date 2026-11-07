import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { TablerIcon, ICON_SIZE, TablerIconName } from '@/components/TablerIcons';

interface EmptyStateProps {
  icon: TablerIconName;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

/**
 * Phase 1.1 — a friendly, localised prompt for screens with no data.
 * Replaces blank feeds / all-zero panels on the empty-by-default state.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon, title, body, actionLabel, onAction, compact = false,
}) => (
  <View style={[styles.card, compact && styles.cardCompact]}>
    <View style={styles.iconWrap}>
      <TablerIcon name={icon} color={Colors.accent} size={compact ? ICON_SIZE.default : ICON_SIZE.hero} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
    {actionLabel && onAction && (
      <TouchableOpacity style={styles.action} onPress={onAction} activeOpacity={0.7}>
        <TablerIcon name="plus" color={Colors.onAccent} size={ICON_SIZE.compact} />
        <Text style={styles.actionText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default EmptyState;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 12,
  },
  cardCompact: {
    paddingVertical: 18,
    marginVertical: 6,
    borderRadius: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.tint.accent15,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 300,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 14,
  },
  actionText: {
    color: Colors.onAccent,
    fontSize: 11,
    fontWeight: '800',
  },
});
