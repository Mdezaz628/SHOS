// Hospital Notification Stream Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const NotificationCard = ({ notification, onPress, style }) => {
  if (!notification) return null;

  const isUnread = !notification.read;
  const isCritical = notification.priority === 'Critical';

  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'Emergency':
        return 'alert-circle';
      case 'Appointment':
        return 'calendar';
      case 'Laboratory':
        return 'flask';
      case 'Pharmacy':
        return 'medical';
      case 'AI Operational':
        return 'hardware-chip';
      case 'HR':
        return 'people';
      default:
        return 'notifications';
    }
  };

  const getCategoryColor = () => {
    if (isCritical) return COLORS.critical;
    if (notification.category === 'AI Operational') return '#8b5cf6';
    if (notification.category === 'Appointment') return COLORS.primary;
    if (notification.category === 'Laboratory') return COLORS.secondary;
    return COLORS.textDim;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isUnread && styles.cardUnread,
        isCritical && styles.cardCritical,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftCol}>
        <View style={[styles.iconCircle, { backgroundColor: getCategoryColor() + '18' }]}>
          <Ionicons name={getCategoryIcon()} size={18} color={getCategoryColor()} />
        </View>
      </View>

      <View style={styles.contentCol}>
        <View style={styles.topRow}>
          <Text style={styles.categoryTag}>{notification.category}</Text>
          <Text style={styles.timeText}>{notification.time}</Text>
        </View>

        <Text style={[styles.title, isUnread && styles.titleUnread]}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>

      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardUnread: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  cardCritical: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  leftCol: {
    marginRight: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textDim,
  },
  title: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
    marginTop: 2,
  },
  titleUnread: {
    fontWeight: TYPOGRAPHY.heavy,
  },
  message: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: 3,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 6,
    marginTop: 6,
  },
});

export default NotificationCard;
