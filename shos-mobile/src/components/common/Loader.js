// Reusable Clinical Loading Spinner & Pulse

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const Loader = ({ message = 'Synchronizing clinical records...', fullScreen = false }) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  message: {
    marginTop: 12,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.medium,
  },
});

export default Loader;
