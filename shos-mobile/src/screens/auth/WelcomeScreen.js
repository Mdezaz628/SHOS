import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const WelcomeScreen = ({ navigation }) => {
  const { setIsRoleModalVisible } = useAuth();

  const features = [
    { icon: 'calendar', title: 'Smart Appointments', desc: 'OPD slots with dynamic queue ETA estimation' },
    { icon: 'bed', title: 'Ward & ICU Tracking', desc: 'Live bed census, oxygen & telemetry monitoring' },
    { icon: 'medkit', title: 'Doctor Clinical Desk', desc: 'Comprehensive EHR, digital Rx, and lab orders' },
    { icon: 'sparkles', title: 'AI Hospital Engine', desc: 'Resource demand forecasting and anomaly alerts' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Branding */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="pulse" size={28} color={COLORS.cardBg} />
            </View>
            <View>
              <Text style={styles.brandTitle}>SHOS</Text>
              <Text style={styles.brandBadge}>AI HOSPITAL SYSTEM</Text>
            </View>
          </View>
          <Text style={styles.headline}>One Intelligent Platform for Complete Hospital Operations</Text>
          <Text style={styles.subheadline}>
            Unifying Patients, Doctors, Nurses, Ambulance EMTs, Labs, and Hospital Leadership under one coordinated system.
          </Text>
        </View>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          {features.map((item, idx) => (
            <View key={idx} style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={item.icon} size={20} color={COLORS.hospitalBlue} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Sign In to Your Account"
            variant="primary"
            size="large"
            icon="log-in-outline"
            onPress={() => navigation.navigate('Login')}
            style={styles.actionBtn}
          />
          <Button
            title="Register as New Patient"
            variant="outline"
            size="large"
            icon="person-add-outline"
            onPress={() => navigation.navigate('Register')}
            style={styles.actionBtn}
          />

          {/* Quick Demo Switcher Prompt */}
          <TouchableOpacity
            style={styles.demoBox}
            activeOpacity={0.8}
            onPress={() => setIsRoleModalVisible(true)}
          >
            <View style={styles.demoIconWrap}>
              <Ionicons name="flash" size={20} color={COLORS.hospitalTeal} />
            </View>
            <View style={styles.demoTextWrap}>
              <Text style={styles.demoTitle}>Explore All 15 Roles Demo</Text>
              <Text style={styles.demoDesc}>Tap here to switch directly between Doctor, Admin, Nurse, EMT, etc.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.hospitalTeal} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.hospitalBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 1,
  },
  brandBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navy,
    lineHeight: 28,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 13,
    color: COLORS.slate,
    lineHeight: 19,
  },
  featureGrid: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  featureDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  actions: {
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    padding: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  demoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(13, 148, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  demoTextWrap: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cardBg,
  },
  demoDesc: {
    fontSize: 11,
    color: COLORS.slateLight,
    marginTop: 2,
  },
});
