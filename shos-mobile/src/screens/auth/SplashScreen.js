import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Ionicons name="pulse" size={48} color={COLORS.cardBg} />
      </View>

      <Text style={styles.brandTitle}>SHOS</Text>
      <Text style={styles.brandSubtitle}>Smart Hospital Operations System</Text>
      <Text style={styles.tagline}>
        One Intelligent Platform for Complete Hospital Operations
      </Text>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={COLORS.hospitalTeal} />
        <Text style={styles.loadingText}>Loading hospital clinical grid...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerVersion}>v2.4.0 • Enterprise Healthcare Architecture</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: COLORS.hospitalBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.hospitalBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.cardBg,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.hospitalTeal,
    marginTop: 4,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: COLORS.slateLight,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  loaderContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
  },
  footerVersion: {
    fontSize: 11,
    color: COLORS.slate,
  },
});
