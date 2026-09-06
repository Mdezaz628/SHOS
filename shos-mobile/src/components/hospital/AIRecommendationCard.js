import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Card } from '../common/Card';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

export const AIRecommendationCard = ({
  recommendation,
  onApprove,
  onReject,
  onPress,
}) => {
  if (!recommendation) return null;

  const isPending = recommendation.status === 'pending' || !recommendation.status;
  const isApproved = recommendation.status === 'approved';
  const isRejected = recommendation.status === 'rejected';

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'critical':
      case 'high':
        return COLORS.triageRed;
      case 'medium':
        return COLORS.triageYellow;
      default:
        return COLORS.triageGreen;
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      {/* Header with Title and Priority */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={18} color={COLORS.hospitalBlue} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {recommendation.title || 'AI Recommendation'}
          </Text>
          <Text style={styles.category}>
            {recommendation.category || 'Operations'} • Model: {recommendation.model || 'DemandPredictor-v2'}
          </Text>
        </View>
        <PriorityBadge priority={recommendation.priority || 'medium'} />
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {recommendation.description || recommendation.recommendation}
      </Text>

      {/* Clinical / Operational Reasoning Box */}
      {recommendation.reasoning && (
        <View style={styles.reasoningBox}>
          <View style={styles.reasoningHeader}>
            <Ionicons name="information-circle-outline" size={14} color={COLORS.slate} />
            <Text style={styles.reasoningLabel}>Decision Support Reasoning</Text>
          </View>
          <Text style={styles.reasoningText} numberOfLines={2}>
            {recommendation.reasoning}
          </Text>
        </View>
      )}

      {/* Impact & Confidence Metrics */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Impact</Text>
          <View style={styles.impactValueRow}>
            <View
              style={[
                styles.impactDot,
                { backgroundColor: getImpactColor(recommendation.impact) },
              ]}
            />
            <Text
              style={[
                styles.metricValue,
                { color: getImpactColor(recommendation.impact) },
              ]}
            >
              {recommendation.impact || 'Medium'}
            </Text>
          </View>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Confidence</Text>
          <Text style={styles.metricValue}>
            {recommendation.confidence
              ? `${Math.round(recommendation.confidence * 100)}%`
              : '94%'}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Time Horizon</Text>
          <Text style={styles.metricValue}>
            {recommendation.targetTimeframe || 'Next 4 Hours'}
          </Text>
        </View>
      </View>

      {/* Status or Human Review Action Buttons */}
      <View style={styles.footer}>
        {isPending ? (
          <View style={styles.actionsRow}>
            <Button
              title="Reject"
              variant="outline"
              size="small"
              icon="close-circle-outline"
              onPress={() => onReject && onReject(recommendation.id)}
              style={styles.rejectButton}
              textStyle={styles.rejectButtonText}
            />
            <Button
              title="Approve & Apply"
              variant="primary"
              size="small"
              icon="checkmark-circle-outline"
              onPress={() => onApprove && onApprove(recommendation.id)}
              style={styles.approveButton}
            />
          </View>
        ) : (
          <View style={styles.decidedRow}>
            <StatusBadge
              status={isApproved ? 'approved' : 'rejected'}
              type="badge"
            />
            <Text style={styles.reviewedBy}>
              Reviewed: {recommendation.reviewedAt || 'Just now'}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.navy,
    lineHeight: 20,
  },
  category: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: COLORS.navyLight,
    lineHeight: 18,
    marginBottom: 10,
  },
  reasoningBox: {
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  reasoningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reasoningLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasoningText: {
    fontSize: 12,
    color: COLORS.navy,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.slate,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  impactValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  footer: {
    marginTop: 2,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  rejectButton: {
    borderColor: COLORS.triageRed,
    paddingHorizontal: 12,
  },
  rejectButtonText: {
    color: COLORS.triageRed,
    fontWeight: '600',
  },
  approveButton: {
    paddingHorizontal: 14,
  },
  decidedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewedBy: {
    fontSize: 11,
    color: COLORS.slate,
  },
});
