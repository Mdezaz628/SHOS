// Live Clinical Queue Visualization Card

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const QueueCard = ({ queue, queueData, style }) => {
  const q = queue || queueData;
  if (!q) return null;

  const currentToken = q.currentServingToken || q.currentServing || 19;
  const myToken = q.userToken || q.tokenNumber || 24;
  const ahead = q.peopleAhead !== undefined ? q.peopleAhead : Math.max(0, myToken - currentToken);
  const waitTime = q.estimatedWaitMinutes || q.estimatedWait || '~25 mins';
  const room = q.opdRoom || q.roomNumber || 'OPD-204';
  const doctor = q.doctorName || 'Dr. Vikram Malhotra';
  const dept = q.department || q.specialty || 'Cardiology OPD';

  return (
    <View style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveTag}>LIVE OPD QUEUE TELEMETRY</Text>
        </View>
        <Text style={styles.roomTag}>{room}</Text>
      </View>

      {/* Main Dual Token Display */}
      <View style={styles.tokenBoxRow}>
        {/* Your Token */}
        <View style={[styles.tokenBox, styles.tokenBoxUser]}>
          <Text style={styles.tokenBoxLabel}>YOUR TOKEN</Text>
          <Text style={styles.tokenBoxNumUser}>#{myToken}</Text>
          <Text style={styles.tokenBoxSub}>Patient Assigned</Text>
        </View>

        <View style={styles.dividerArrow}>
          <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
        </View>

        {/* Currently Serving Token */}
        <View style={[styles.tokenBox, styles.tokenBoxCurrent]}>
          <Text style={styles.tokenBoxLabelCurrent}>NOW SERVING</Text>
          <Text style={styles.tokenBoxNumCurrent}>#{currentToken}</Text>
          <Text style={styles.tokenBoxSubCurrent}>In Consultation</Text>
        </View>
      </View>

      {/* Telemetric Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>People Ahead</Text>
          <View style={styles.statValRow}>
            <Ionicons name="people-outline" size={15} color={COLORS.primary} />
            <Text style={styles.statVal}>{ahead}</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Estimated Wait</Text>
          <View style={styles.statValRow}>
            <Ionicons name="time-outline" size={15} color={COLORS.secondary} />
            <Text style={[styles.statVal, { color: COLORS.secondaryDark }]}>
              {typeof waitTime === 'number' ? `~${waitTime} mins` : waitTime}
            </Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Avg. Consult</Text>
          <View style={styles.statValRow}>
            <Ionicons name="timer-outline" size={15} color={COLORS.textDim} />
            <Text style={styles.statVal}>{q.averageConsultTimeMins || 7}m</Text>
          </View>
        </View>
      </View>

      {/* Doctor Footnote */}
      <View style={styles.doctorFooter}>
        <Ionicons name="medkit-outline" size={14} color={COLORS.primary} />
        <Text style={styles.doctorFooterText}>
          Consultant: <Text style={{ fontWeight: '700', color: COLORS.text }}>{doctor}</Text> • {dept}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primarySubtle,
    padding: 16,
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.critical,
  },
  liveTag: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  roomTag: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    color: COLORS.textMuted,
  },
  tokenBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tokenBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  tokenBoxUser: {
    backgroundColor: COLORS.primarySubtle,
    borderColor: COLORS.primary,
  },
  tokenBoxCurrent: {
    backgroundColor: COLORS.secondarySubtle,
    borderColor: COLORS.secondary,
  },
  dividerArrow: {
    paddingHorizontal: 4,
  },
  tokenBoxLabel: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
  },
  tokenBoxLabelCurrent: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.secondaryDark,
    textTransform: 'uppercase',
  },
  tokenBoxNumUser: {
    fontSize: 28,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.primaryDark,
    marginVertical: 2,
  },
  tokenBoxNumCurrent: {
    fontSize: 28,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.secondaryDark,
    marginVertical: 2,
  },
  tokenBoxSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  tokenBoxSubCurrent: {
    fontSize: 10,
    color: COLORS.secondaryDark,
    fontWeight: TYPOGRAPHY.medium,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.bold,
  },
  statValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  statVal: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  doctorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  doctorFooterText: {
    fontSize: 11,
    color: COLORS.textMuted,
    flex: 1,
  },
});

export default QueueCard;
