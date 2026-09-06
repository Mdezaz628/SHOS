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
import { ROLE_LABELS, ROLE_ICONS } from '../../constants/roles';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, currentRole, logout, setIsRoleModalVisible } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of SHOS?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const roleTitle = ROLE_LABELS[currentRole] || 'Hospital Staff';
  const roleIcon = ROLE_ICONS[currentRole] || 'person';

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Profile"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <Avatar name={currentUser?.name || 'Hospital User'} size={64} roleColor={COLORS.hospitalBlue} />
            <View style={styles.profileMeta}>
              <Text style={styles.name}>{currentUser?.name || 'Hospital User'}</Text>
              <Text style={styles.roleText}>{roleTitle}</Text>
              <View style={styles.badgeTag}>
                <Ionicons name={roleIcon} size={12} color={COLORS.hospitalBlue} />
                <Text style={styles.badgeText}>
                  {currentUser?.uhid || currentUser?.staffId || currentUser?.id || 'ID: #STF-001'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Contact & Professional Info */}
        <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{currentUser?.name || 'Hospital User'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Role</Text>
            <Text style={[styles.infoValue, { color: COLORS.hospitalBlue, fontWeight: '700' }]}>{roleTitle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registered Email</Text>
            <Text style={styles.infoValue}>{currentUser?.email || `${currentRole}@shos.hospital`}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Contact</Text>
            <Text style={styles.infoValue}>{currentUser?.phone || '+91 98765 43210'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.activeTag}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active & Verified</Text>
            </View>
          </View>
        </Card>

        {/* Hospital Affiliation */}
        <Text style={styles.sectionTitle}>FACILITY ACCESS</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hospital Branch</Text>
            <Text style={styles.infoValue}>SHOS Central Multi-Specialty</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Security Clearance</Text>
            <Text style={styles.infoValue}>Level 3 Clinical Access</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Accreditation</Text>
            <Text style={styles.infoValue}>NABH & ISO 27799 Compliant</Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <Button
          title="Switch Hospital Role (15 Personas)"
          variant="outline"
          size="medium"
          icon="swap-horizontal"
          onPress={() => setIsRoleModalVisible(true)}
          style={{ marginBottom: 12 }}
        />

        <Button
          title="Sign Out of Terminal"
          variant="danger"
          size="medium"
          icon="log-out-outline"
          onPress={handleLogout}
          style={{ marginBottom: 30 }}
        />
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
    fontSize: 13,
    color: COLORS.slate,
    marginTop: 2,
    fontWeight: '600',
  },
  badgeTag: {
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
  badgeText: {
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
    marginTop: 4,
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
    fontWeight: '600',
    color: COLORS.navy,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
});

export default ProfileScreen;
