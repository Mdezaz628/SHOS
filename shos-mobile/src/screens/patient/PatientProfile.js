import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const PatientProfile = ({ navigation }) => {
  const { currentUser, logout, setIsRoleModalVisible } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of SHOS?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Patient EHR Profile"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <Avatar name={currentUser?.name || 'Rahul Sharma'} size="large" role="patient" />
            <View style={styles.profileMeta}>
              <Text style={styles.name}>{currentUser?.name || 'Rahul Sharma'}</Text>
              <Text style={styles.roleText}>Outpatient & Ward Inpatient</Text>
              <View style={styles.uhidTag}>
                <Ionicons name="finger-print" size={12} color={COLORS.hospitalBlue} />
                <Text style={styles.uhidText}>UHID: {currentUser?.uhid || 'SHOS-2026-8942'}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Personal & Demographic Details */}
        <Text style={styles.sectionTitle}>DEMOGRAPHIC DETAILS</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age / Gender</Text>
            <Text style={styles.infoValue}>42 Yrs / Male</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Group</Text>
            <Text style={[styles.infoValue, { color: COLORS.triageRed, fontWeight: '800' }]}>O+ (Positive)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Number</Text>
            <Text style={styles.infoValue}>+91 98765 43210</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Registered Email</Text>
            <Text style={styles.infoValue}>{currentUser?.email || 'patient@shos.hospital'}</Text>
          </View>
        </Card>

        {/* Emergency Contact */}
        <Text style={styles.sectionTitle}>EMERGENCY CONTACT</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kin Name</Text>
            <Text style={styles.infoValue}>Sunita Sharma (Spouse)</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Emergency Phone</Text>
            <Text style={[styles.infoValue, { color: COLORS.hospitalBlue }]}>+91 98765 43211</Text>
          </View>
        </Card>

        {/* Insurance & TPA Coverage */}
        <Text style={styles.sectionTitle}>INSURANCE & TPA</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Provider</Text>
            <Text style={styles.infoValue}>Star Health Allied Insurance</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Policy Number</Text>
            <Text style={styles.infoValue}>SH-2026-MED-99410</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Claim Pre-Approval</Text>
            <StatusBadge status="approved" type="badge" />
          </View>
        </Card>

        {/* Known Allergies & Chronic Conditions */}
        <Text style={styles.sectionTitle}>ALLERGIES & MEDICAL HISTORY</Text>
        <Card style={styles.infoCard}>
          <View style={styles.alertItem}>
            <Ionicons name="alert-circle" size={18} color={COLORS.triageRed} />
            <Text style={styles.alertText}>Known Drug Allergy: <Text style={{ fontWeight: '700' }}>Penicillin</Text></Text>
          </View>
          <View style={styles.alertItem}>
            <Ionicons name="information-circle" size={18} color={COLORS.warning} />
            <Text style={styles.alertText}>Chronic: Type II Diabetes Mellitus (HbA1c 6.8%)</Text>
          </View>
        </Card>

        {/* Persona Switcher Quick Access */}
        <Button
          title="Switch Hospital Role (Demo)"
          variant="outline"
          size="medium"
          icon="swap-horizontal"
          onPress={() => setIsRoleModalVisible(true)}
          style={{ marginBottom: 12 }}
        />

        {/* Logout Button */}
        <Button
          title="Sign Out"
          variant="danger"
          size="medium"
          icon="log-out-outline"
          onPress={handleLogout}
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
  profileCard: {
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileMeta: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
  },
  roleText: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  uhidTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 4,
  },
  uhidText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 6,
  },
  infoCard: {
    marginBottom: 14,
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.slate,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  alertText: {
    fontSize: 13,
    color: COLORS.navy,
  },
});
