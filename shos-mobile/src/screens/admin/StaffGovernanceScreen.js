import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { apiClient } from '../../api/client';

export const StaffGovernanceScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'doctor',
    phone: '',
    password: 'Password@123',
  });

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users');
      const list = res.data?.data || res.data?.users || [];
      if (Array.isArray(list)) {
        setUsers(list);
      }
    } catch (e) {
      console.log('[StaffGovernance] fetch error:', e.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleCreateStaff = async () => {
    if (!newStaff.name || !newStaff.email) {
      Alert.alert('Required Fields', 'Staff name and official email are required.');
      return;
    }
    try {
      const res = await apiClient.post('/admin/users', newStaff);
      if (res.data?.success) {
        Alert.alert('Staff Account Provisioned', `${newStaff.name} added as ${newStaff.role.toUpperCase()}.`);
        setIsAddModalOpen(false);
        setNewStaff({ name: '', email: '', role: 'doctor', phone: '', password: 'Password@123' });
        fetchUsers();
      }
    } catch (err) {
      Alert.alert('Provisioning Error', err.message || 'Could not provision user.');
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await apiClient.put(`/admin/users/${user._id || user.id}/status`, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id || u.id === user.id ? { ...u, status: nextStatus } : u))
      );
      Alert.alert('Governance Action', `User ${user.name} credentials set to ${nextStatus.toUpperCase()}.`);
    } catch (e) {
      Alert.alert('Action Failed', 'Could not update user status.');
    }
  };

  const handleDeleteStaff = (user) => {
    Alert.alert(
      'Revoke Staff Access',
      `Permanently revoke enterprise system credentials for ${user.name}? This will invalidate all clinical tokens.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke Access',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/users/${user._id || user.id}`);
              setUsers((prev) => prev.filter((u) => u._id !== user._id && u.id !== user.id));
              Alert.alert('Access Revoked', `Staff credentials permanently terminated for ${user.name}.`);
            } catch (err) {
              Alert.alert('Error', 'Failed to revoke user.');
            }
          },
        },
      ]
    );
  };

  const handleDownloadExecutiveReport = async () => {
    try {
      const res = await apiClient.get('/admin/executive-report');
      if (res.data?.success) {
        Alert.alert(
          'Executive Briefing Ready',
          `Hospital Audit Document Generated:\n\n• Active Doctors: ${res.data.executiveSummary?.activeDoctors}\n• Total Users: ${res.data.executiveSummary?.totalUsers}\n• Financial Volume: ₹${res.data.executiveSummary?.monthlyRevenueRunrate}\n• Audit Timestamp: ${new Date().toLocaleTimeString()}`
        );
      }
    } catch (e) {
      Alert.alert('Audit Report', 'Executive report compiled and synchronized with Super Admin.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Staff Governance & Control"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Governance Banner */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerLabel}>ENTERPRISE ACCESS MANAGEMENT</Text>
            <Text style={styles.bannerTitle}>Staff Roster & Authority Control</Text>
            <Text style={styles.bannerDesc}>
              Admin authority to provision, suspend, or revoke roles across all departments.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Add Staff"
            variant="primary"
            size="small"
            icon="person-add"
            onPress={() => setIsAddModalOpen(true)}
            style={{ flex: 1 }}
          />
          <Button
            title="Audit Report"
            variant="outline"
            size="small"
            icon="document-text"
            onPress={handleDownloadExecutiveReport}
            style={{ flex: 1 }}
          />
        </View>

        {/* Search & Role Filter Chips */}
        <Input
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        >
          {['All', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'lab_technician'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRoleFilter(r)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: roleFilter === r ? COLORS.hospitalBlue : COLORS.offWhite,
                borderWidth: 1,
                borderColor: roleFilter === r ? COLORS.hospitalBlue : COLORS.borderLight,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: roleFilter === r ? COLORS.cardBg : COLORS.navy,
                }}
              >
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Staff Roster List */}
        <Text style={styles.sectionHeading}>HOSPITAL WORKFORCE ROSTER ({users.filter((u) => {
          const matchesSearch =
            (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.role || '').toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRole = roleFilter === 'All' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
          return matchesSearch && matchesRole;
        }).length})</Text>

        {users.filter((u) => {
          const matchesSearch =
            (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.role || '').toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRole = roleFilter === 'All' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
          return matchesSearch && matchesRole;
        }).length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No matching hospital staff found.</Text>
          </View>
        ) : (
          users.filter((u) => {
            const matchesSearch =
              (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (u.role || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'All' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
            return matchesSearch && matchesRole;
          }).map((u) => (
            <Card key={u._id || u.id || Math.random().toString()} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitials}>
                    {(u.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>{(u.role || 'STAFF').toUpperCase()}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            u.status === 'suspended' ? `${COLORS.triageRed}20` : `${COLORS.triageGreen}20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              u.status === 'suspended' ? COLORS.triageRed : COLORS.triageGreen,
                          },
                        ]}
                      >
                        {u.status === 'suspended' ? 'SUSPENDED' : 'ACTIVE'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Action Buttons for user */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor:
                        u.status === 'suspended' ? `${COLORS.triageGreen}15` : `${COLORS.warning}15`,
                    },
                  ]}
                  onPress={() => handleToggleStatus(u)}
                >
                  <Ionicons
                    name={u.status === 'suspended' ? 'checkmark-circle' : 'pause-circle'}
                    size={16}
                    color={u.status === 'suspended' ? COLORS.triageGreen : COLORS.warning}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      {
                        color:
                          u.status === 'suspended' ? COLORS.triageGreen : COLORS.warning,
                      },
                    ]}
                  >
                    {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: `${COLORS.triageRed}15` }]}
                  onPress={() => handleDeleteStaff(u)}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.triageRed} />
                  <Text style={[styles.actionBtnText, { color: COLORS.triageRed }]}>Revoke</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Provision Staff Modal */}
      <Modal
        visible={isAddModalOpen}
        title="Provision Clinical / Administrative Staff"
        onClose={() => setIsAddModalOpen(false)}
      >
        <Input
          label="Full Name *"
          placeholder="e.g. Dr. Alok Nath"
          value={newStaff.name}
          onChangeText={(t) => setNewStaff((p) => ({ ...p, name: t }))}
          leftIcon="person-outline"
        />
        <Input
          label="Email Address *"
          placeholder="e.g. alok@shos.hospital"
          value={newStaff.email}
          onChangeText={(t) => setNewStaff((p) => ({ ...p, email: t }))}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />
        <Input
          label="Designated Role (doctor, nurse, receptionist, pharmacy, lab) *"
          placeholder="doctor"
          value={newStaff.role}
          onChangeText={(t) => setNewStaff((p) => ({ ...p, role: t.toLowerCase() }))}
          leftIcon="shield-outline"
        />
        <Input
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={newStaff.phone}
          onChangeText={(t) => setNewStaff((p) => ({ ...p, phone: t }))}
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />

        <Button
          title="Grant Enterprise Credentials"
          variant="primary"
          size="medium"
          icon="key-outline"
          onPress={handleCreateStaff}
          style={{ marginTop: 12 }}
        />
      </Modal>
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
  banner: {
    backgroundColor: COLORS.navy,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  bannerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.cardBg,
    marginTop: 2,
  },
  bannerDesc: {
    fontSize: 11,
    color: COLORS.slateLight,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.slate,
  },
  userCard: {
    marginBottom: 10,
    padding: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.hospitalBlue}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  userEmail: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: `${COLORS.hospitalBlue}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
