import React, { useState } from 'react';
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
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const HRDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { staff, updateStaffStatus } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);
  const [filterRole, setFilterRole] = useState('ALL');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const filteredStaff = (staff || []).filter(s => {
    if (filterRole === 'ALL') return true;
    return s.department?.toUpperCase().includes(filterRole) || s.role?.toUpperCase().includes(filterRole);
  });

  const handleStaffTouch = (member) => {
    const isDuty = member.status === 'on-duty';
    Alert.alert(
      `Staff: ${member.name}`,
      `${member.role} • ${member.department}\nPhone: ${member.phone || 'Direct Extension #104'}\nCurrent Status: ${member.status?.toUpperCase()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Mark ${isDuty ? 'Off-Duty' : 'On-Duty'}`,
          onPress: () => {
            updateStaffStatus(member.id, isDuty ? 'off-duty' : 'on-duty');
            Alert.alert('Status Updated', `${member.name} marked as ${isDuty ? 'OFF-DUTY' : 'ON-DUTY'}.`);
          },
        },
        {
          text: 'Paging / Shift Alert',
          onPress: () => {
            Alert.alert('Pager Dispatched', `Urgent shift notification SMS dispatched to ${member.name} (${member.phone}).`);
          },
        },
      ]
    );
  };

  const scheduleGrid = [
    { role: 'Doctors', mon: '✓', tue: '✓', wed: '✓', thu: '✓', fri: '✓' },
    { role: 'Nurses', mon: '✓', tue: '✓', wed: '✓', thu: '✓', fri: '-' },
    { role: 'Support', mon: '✓', tue: '-', wed: '✓', thu: '✓', fri: '✓' },
    { role: 'Lab Techs', mon: '✓', tue: '✓', wed: '✓', thu: '-', fri: '✓' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Human Resources & Roster"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* HR Header */}
        <View style={styles.hrHeader}>
          <Text style={styles.hrLabel}>PEOPLE OPERATIONS & WORKFORCE GOVERNANCE</Text>
          <Text style={styles.officerName}>{currentUser?.name || 'Arun Iyer'}</Text>
          <Text style={styles.hrMeta}>24x7 Clinical Roster & Shortage Mitigation</Text>
        </View>

        {/* Workforce Census */}
        <Text style={styles.sectionHeading}>HOSPITAL WORKFORCE CENSUS</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Active"
            value={String(staff?.length || 24)}
            change="Provisioned"
            changeType="neutral"
            icon="people"
            color={COLORS.hospitalBlue}
            onPress={() => setFilterRole('ALL')}
          />
          <StatCard
            label="On Duty"
            value={String(staff?.filter(s => s.status === 'on-duty')?.length || 18)}
            change="Active"
            changeType="positive"
            icon="checkmark-circle"
            color={COLORS.triageGreen}
            onPress={() => setFilterRole('ALL')}
          />
          <StatCard
            label="Clinical Staff"
            value={String(staff?.filter(s => s.role?.includes('Dr.') || s.role?.includes('Nurse'))?.length || 12)}
            change="Doctors & Nurses"
            changeType="neutral"
            icon="medkit"
            color={COLORS.hospitalTeal}
            onPress={() => setFilterRole('ICU')}
          />
          <StatCard
            label="Support Staff"
            value="6"
            change="Transfer & Pharma"
            changeType="positive"
            icon="shield"
            color={COLORS.warning}
            onPress={() => setFilterRole('TRANSFER')}
          />
        </View>

        {/* Shortage Critical Notice */}
        <View style={styles.alertNotice}>
          <Ionicons name="warning" size={20} color={COLORS.triageRed} />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>STAFF SHORTAGE PREDICTION</Text>
            <Text style={styles.alertDesc}>
              AI predicts 2 Nursing Officers short for tonight's CCU night shift (00:00 - 08:00) due to emergency leave. Tap roster cards below to reassign staff.
            </Text>
          </View>
        </View>

        {/* Today's Staff Workload & Active Roster */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>TODAY'S ON-DUTY STAFF WORKLOAD ({filteredStaff.length})</Text>
          <Text style={styles.sectionSub}>Touch to manage</Text>
        </View>

        {filteredStaff.map((member) => {
          const isOnDuty = member.status === 'on-duty';

          return (
            <TouchableOpacity
              key={member.id}
              style={[styles.staffCard, !isOnDuty && styles.staffCardOff]}
              activeOpacity={0.7}
              onPress={() => handleStaffTouch(member)}
            >
              <View style={styles.staffHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.staffName}>{member.name}</Text>
                  <Text style={styles.staffRole}>{member.role} • {member.department}</Text>
                </View>
                <View style={[styles.statusBadge, isOnDuty ? styles.statusBadgeOn : styles.statusBadgeOff]}>
                  <Text style={[styles.statusText, isOnDuty ? styles.statusTextOn : styles.statusTextOff]}>
                    {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
                  </Text>
                </View>
              </View>

              <View style={styles.staffFooter}>
                <View style={styles.contactRow}>
                  <Ionicons name="call" size={13} color={COLORS.hospitalBlue} />
                  <Text style={styles.contactText}>{member.phone || '+91 98110 22331'}</Text>
                </View>
                <View style={styles.tapPrompt}>
                  <Text style={styles.tapPromptText}>Touch to Reassign</Text>
                  <Ionicons name="chevron-forward" size={12} color={COLORS.hospitalBlue} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Phase 25 Shift Management Calendar */}
        <Text style={[styles.sectionHeading, { marginTop: 12 }]}>WEEKLY SHIFT COVERAGE MATRIX</Text>
        <Card style={styles.matrixCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colHeader, { flex: 2 }]}>Role</Text>
            <Text style={styles.colHeader}>Mon</Text>
            <Text style={styles.colHeader}>Tue</Text>
            <Text style={styles.colHeader}>Wed</Text>
            <Text style={styles.colHeader}>Thu</Text>
            <Text style={styles.colHeader}>Fri</Text>
          </View>

          {scheduleGrid.map((row, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.cellRole, { flex: 2 }]}>{row.role}</Text>
              <Text style={[styles.cellVal, row.mon === '✓' ? styles.present : styles.absent]}>{row.mon}</Text>
              <Text style={[styles.cellVal, row.tue === '✓' ? styles.present : styles.absent]}>{row.tue}</Text>
              <Text style={[styles.cellVal, row.wed === '✓' ? styles.present : styles.absent]}>{row.wed}</Text>
              <Text style={[styles.cellVal, row.thu === '✓' ? styles.present : styles.absent]}>{row.thu}</Text>
              <Text style={[styles.cellVal, row.fri === '✓' ? styles.present : styles.absent]}>{row.fri}</Text>
            </View>
          ))}

          <Button
            title="Auto-Balance Shifts"
            variant="outline"
            size="small"
            icon="swap-horizontal"
            onPress={() => Alert.alert('Roster Balanced', 'Auto-adjusted staff roster saved and SMS shift alerts dispatched to duty nurses.')}
            style={{ marginTop: 12 }}
          />
        </Card>

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
  hrHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  hrLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  officerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  hrMeta: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  alertNotice: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderColor: COLORS.triageRed,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.triageRed,
    letterSpacing: 0.5,
  },
  alertDesc: {
    fontSize: 11,
    color: COLORS.navy,
    marginTop: 2,
    lineHeight: 16,
  },
  matrixCard: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 8,
    marginBottom: 8,
  },
  colHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    alignItems: 'center',
  },
  cellRole: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  cellVal: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  present: {
    color: COLORS.triageGreen,
  },
  absent: {
    color: COLORS.triageRed,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
  },
  staffCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  staffCardOff: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  staffName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  staffRole: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeOn: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeOff: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statusTextOn: {
    color: COLORS.triageGreen,
  },
  statusTextOff: {
    color: COLORS.slate,
  },
  staffFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  tapPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tapPromptText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
});
