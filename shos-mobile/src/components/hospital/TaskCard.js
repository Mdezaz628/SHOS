// Clinical & Operational Task Workflow Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export const TaskCard = ({ task, onAdvanceStatus, onStatusChange, style }) => {
  if (!task) return null;

  const advanceHandler = onAdvanceStatus || onStatusChange;

  const getNextActionLabel = () => {
    switch (task.status) {
      case 'pending':
      case 'Assigned':
        return 'Accept Task';
      case 'Accepted':
        return 'Start Escort';
      case 'in_progress':
      case 'In Progress':
        return 'Complete Handover';
      default:
        return 'Completed';
    }
  };

  const getNextStatus = () => {
    switch (task.status) {
      case 'pending':
      case 'Assigned':
        return 'Accepted';
      case 'Accepted':
        return 'In Progress';
      case 'in_progress':
      case 'In Progress':
        return 'Completed';
      default:
        return 'Completed';
    }
  };

  const isDone = task.status === 'Completed' || task.status === 'completed';

  const handleAction = () => {
    if (advanceHandler && !isDone) {
      advanceHandler(task.id, getNextStatus());
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleAction}
      style={[styles.card, isDone && styles.cardDone, style]}
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>{task.title}</Text>
        <PriorityBadge priority={task.priority} />
      </View>

      <Text style={styles.patientName}>{task.patientName || 'Assigned Hospital Patient'}</Text>

      <View style={styles.routeBox}>
        <View style={styles.routePoint}>
          <Ionicons name="radio-button-on" size={12} color={COLORS.secondary} />
          <Text style={styles.routeText} numberOfLines={1}>From: {task.fromLocation || task.from || 'Main OPD'}</Text>
        </View>
        <View style={styles.routePoint}>
          <Ionicons name="location" size={12} color={COLORS.primary} />
          <Text style={styles.routeText} numberOfLines={1}>To: {task.toLocation || task.to || 'Diagnostic Wing'}</Text>
        </View>
      </View>

      {task.notes && (
        <Text style={styles.notesText}>Notes: {task.notes}</Text>
      )}

      <View style={styles.footerRow}>
        <StatusBadge status={task.status} size="sm" />

        {!isDone && advanceHandler && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleAction}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>{getNextActionLabel()}</Text>
            <Ionicons name="arrow-forward" size={13} color={COLORS.textWhite} />
          </TouchableOpacity>
        )}
      </View>
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
  cardDone: {
    opacity: 0.7,
    backgroundColor: COLORS.surfaceSubtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  patientName: {
    fontSize: 12,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  routeBox: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: 8,
    gap: 4,
    marginBottom: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
  },
  notesText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.textDim,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSubtle,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textWhite,
  },
});

export default TaskCard;
