// Hospital Appointment Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { StatusBadge } from '../common/StatusBadge';

export const AppointmentCard = ({ appointment, onCancel, onReschedule, onPress, style }) => {
  if (!appointment) return null;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.tokenBadge}>
          <Text style={styles.tokenLabel}>TOKEN</Text>
          <Text style={styles.tokenNumber}>#{appointment.tokenNumber}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.deptName}>{appointment.department}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.textDim} />
            <Text style={styles.timeText}>{appointment.date} • {appointment.timeSlot}</Text>
          </View>
        </View>

        <StatusBadge status={appointment.status} size="sm" />
      </View>

      <View style={styles.middleStrip}>
        <View style={styles.stripCol}>
          <Text style={styles.stripLabel}>Patient</Text>
          <Text style={styles.stripValue}>{appointment.patientName}</Text>
        </View>
        <View style={styles.stripCol}>
          <Text style={styles.stripLabel}>OPD Location</Text>
          <Text style={styles.stripValue}>{appointment.opdRoom}</Text>
        </View>
        <View style={styles.stripCol}>
          <Text style={styles.stripLabel}>Queue Status</Text>
          <Text style={[styles.stripValue, { color: COLORS.secondary }]}>
            {appointment.queuePosition > 0 ? `${appointment.queuePosition} ahead (~${appointment.estimatedWaitMins}m)` : 'Now Serving'}
          </Text>
        </View>
      </View>

      {(onCancel || onReschedule) && appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
        <View style={styles.actionsRow}>
          {onCancel && (
            <TouchableOpacity style={styles.actionBtnCancel} onPress={onCancel}>
              <Text style={styles.actionCancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {onReschedule && (
            <TouchableOpacity style={styles.actionBtnReschedule} onPress={onReschedule}>
              <Text style={styles.actionRescheduleText}>Reschedule Slot</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenBadge: {
    backgroundColor: COLORS.primarySubtle,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
  },
  tokenLabel: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  tokenNumber: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.primaryDark,
    marginTop: 1,
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  deptName: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.medium,
    marginTop: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textDim,
  },
  middleStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  stripCol: {
    flex: 1,
  },
  stripLabel: {
    fontSize: 9,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.bold,
  },
  stripValue: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSubtle,
  },
  actionBtnCancel: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.critical,
  },
  actionCancelText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.critical,
  },
  actionBtnReschedule: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primarySubtle,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionRescheduleText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
});

export default AppointmentCard;
