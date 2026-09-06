// Hospital Pathology & Radiology Report Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { StatusBadge } from '../common/StatusBadge';

export const LabReportCard = ({ report, onView, onDownload, style }) => {
  if (!report) return null;

  const isCompleted = report.status === 'Completed';

  const getCategoryIcon = () => {
    switch (report.category) {
      case 'X-Ray':
      case 'CT':
      case 'MRI':
        return 'scan-outline';
      case 'Blood Test':
        return 'water-outline';
      default:
        return 'flask-outline';
    }
  };

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={getCategoryIcon()} size={18} color={COLORS.primary} />
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.title}>{report.testName}</Text>
          <Text style={styles.category}>{report.category} • Ref: {report.orderNumber}</Text>
          <Text style={styles.doctorText}>Ordered by {report.orderedBy}</Text>
        </View>

        <StatusBadge status={report.status} size="sm" />
      </View>

      <View style={styles.middleStrip}>
        <View style={styles.stripCol}>
          <Text style={styles.stripLabel}>Order Date</Text>
          <Text style={styles.stripVal}>{report.orderDate}</Text>
        </View>
        <View style={styles.stripCol}>
          <Text style={styles.stripLabel}>Sample / Barcode</Text>
          <Text style={styles.stripVal}>{report.barcode || report.sampleType}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {onView && (
          <TouchableOpacity style={styles.viewBtn} onPress={onView} activeOpacity={0.7}>
            <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
            <Text style={styles.viewBtnText}>View Findings</Text>
          </TouchableOpacity>
        )}

        {isCompleted && onDownload && (
          <TouchableOpacity style={styles.downloadBtn} onPress={onDownload} activeOpacity={0.7}>
            <Ionicons name="download-outline" size={14} color={COLORS.secondaryDark} />
            <Text style={styles.downloadBtnText}>PDF Report</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    marginBottom: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  category: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.semibold,
    marginTop: 1,
  },
  doctorText: {
    fontSize: 10,
    color: COLORS.textDim,
    marginTop: 1,
  },
  middleStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
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
  stripVal: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.text,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSubtle,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primarySubtle,
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.secondarySubtle,
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.secondaryDark,
  },
});

export default LabReportCard;
