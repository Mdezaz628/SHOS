import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const SettingsScreen = ({ navigation }) => {
  const { logout, setIsRoleModalVisible } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBiometric, setIsBiometric] = useState(true);
  const [isAudioChime, setIsAudioChime] = useState(true);
  const [isPushAlerts, setIsPushAlerts] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Settings & System Prefs"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>SECURITY & AUTHENTICATION</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingMeta}>
              <Text style={styles.settingTitle}>Biometric Lock (FaceID / Fingerprint)</Text>
              <Text style={styles.settingDesc}>Fast unlock for clinical terminal</Text>
            </View>
            <Switch
              value={isBiometric}
              onValueChange={setIsBiometric}
              trackColor={{ false: COLORS.border, true: COLORS.hospitalBlue }}
            />
          </View>
        </Card>

        <Text style={styles.sectionHeading}>APP & NOTIFICATION PREFERENCES</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingMeta}>
              <Text style={styles.settingTitle}>Queue Audio Announcements</Text>
              <Text style={styles.settingDesc}>Chime when token is within 2 slots</Text>
            </View>
            <Switch
              value={isAudioChime}
              onValueChange={setIsAudioChime}
              trackColor={{ false: COLORS.border, true: COLORS.hospitalTeal }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingMeta}>
              <Text style={styles.settingTitle}>Push Notification Alerts</Text>
              <Text style={styles.settingDesc}>Lab reports, critical alerts & appointments</Text>
            </View>
            <Switch
              value={isPushAlerts}
              onValueChange={setIsPushAlerts}
              trackColor={{ false: COLORS.border, true: COLORS.hospitalTeal }}
            />
          </View>
        </Card>

        <Text style={styles.sectionHeading}>ACCOUNT & PROFILE</Text>
        <Button
          title="View My Profile"
          variant="primary"
          size="medium"
          icon="person-circle-outline"
          onPress={() => navigation.navigate('Profile')}
          style={{ marginBottom: 12 }}
        />

        <Text style={styles.sectionHeading}>RAPID PROTOTYPE DEMO</Text>
        <Button
          title="Switch Hospital Role (15 Roles)"
          variant="outline"
          size="medium"
          icon="swap-horizontal"
          onPress={() => setIsRoleModalVisible(true)}
          style={{ marginBottom: 12 }}
        />

        <Text style={styles.sectionHeading}>HOSPITAL STANDARDS</Text>
        <Card style={styles.aboutCard}>
          <View style={styles.aboutRow}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.hospitalTeal} />
            <View style={styles.aboutMeta}>
              <Text style={styles.aboutTitle}>SHOS — Smart Hospital Operations</Text>
              <Text style={styles.aboutVersion}>Release 2.4.0 • NABH & ISO 27799 Certified</Text>
              <Text style={styles.aboutTagline}>One Intelligent Platform for Complete Hospital Operations</Text>
            </View>
          </View>
        </Card>

        <Button
          title="Sign Out of Terminal"
          variant="danger"
          size="medium"
          icon="log-out-outline"
          onPress={handleSignOut}
        />

        <View style={{ height: 30 }} />
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
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  settingsCard: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingMeta: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  aboutCard: {
    marginBottom: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutMeta: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  aboutVersion: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    marginTop: 2,
  },
  aboutTagline: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 2,
  },
});
