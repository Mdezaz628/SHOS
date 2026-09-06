// Reusable Error State with Retry Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Unable to Load Records',
  message = 'A clinical telemetry connection issue occurred. Please verify your connection or try again.',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={32} color={COLORS.critical} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="critical"
          size="sm"
          icon="refresh-outline"
          style={styles.retryBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.criticalSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginVertical: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: COLORS.critical,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.criticalDark,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 290,
    lineHeight: 18,
  },
  retryBtn: {
    marginTop: 16,
  },
});

export default ErrorState;
