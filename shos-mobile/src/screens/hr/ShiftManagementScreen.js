import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const ShiftManagementScreen = ({ navigation }) => {
  const [selectedShift, setSelectedShift] = useState('morning');
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapData, setSwapData] = useState({
    requester: 'Sister Sunita (ICU)',
    targetColleague: '',
    reason: '',
  });

  const shifts = [
    { id: 'morning', label: '🌅 Morning Shift', time: '07:00 AM - 03:00 PM', onDuty: 14, required: 14 },
    { id: 'evening', label: '🌇 Evening Shift', time: '03:00 PM - 11:00 PM', onDuty: 11, required: 12 },
    { id: 'night', label: '🌙 Night Shift', time: '11:00 PM - 07:00 AM', onDuty: 7, required: 9 },
  ];

  const shiftRosters = {
    morning: [
      { id: 'S-1', name: 'Dr. Vikram Malhotra', role: 'Senior Consultant', dept: 'Cardiology', checkIn: '06:55 AM', status: 'checked_in' },
      { id: 'S-2', name: 'Sister Priya Nair', role: 'Staff Nurse In-Charge', dept: 'Cardiac Care Unit', checkIn: '06:50 AM', status: 'checked_in' },
      { id: 'S-3', name: 'Dr. Anita Rao', role: 'Chief Pathologist', dept: 'Pathology Lab', checkIn: '07:10 AM', status: 'checked_in' },
      { id: 'S-4', name: 'Rajesh Yadav', role: 'ALS Ambulance Pilot', dept: 'Trauma Fleet', checkIn: '06:45 AM', status: 'checked_in' },
    ],
    evening: [
      { id: 'S-5', name: 'Dr. Ananya Sen', role: 'Consultant Pulmonologist', dept: 'Pulmonology', checkIn: '02:50 PM', status: 'checked_in' },
      { id: 'S-6', name: 'Sister Kavita', role: 'Senior Staff Nurse', dept: 'Emergency ER', checkIn: 'Pending', status: 'pending' },
      { id: 'S-7', name: 'Ramesh Kumar', role: 'Pharmacist', dept: 'Central Pharmacy', checkIn: '03:00 PM', status: 'checked_in' },
    ],
    night: [
      { id: 'S-8', name: 'Dr. R. K. Sen', role: 'Emergency Medical Registrar', dept: 'ER & Trauma', checkIn: 'Pending', status: 'pending' },
      { id: 'S-9', name: 'Sister Sunita', role: 'ICU Critical Care Nurse', dept: 'Intensive Care Unit', checkIn: 'Pending', status: 'pending' },
    ],
  };

  const currentRoster = shiftRosters[selectedShift] || shiftRosters.morning;

  const handleSwapSubmit = () => {
    if (!swapData.targetColleague || !swapData.reason) {
      Alert.alert('Incomplete Form', 'Please enter colleague name and valid reason for shift swap.');
      return;
    }
    setSwapModalOpen(false);
    Alert.alert(
      'Shift Swap Dispatched',
      `Swap request for ${swapData.requester} sent to ${swapData.targetColleague} and HR approval desk.`
    );
    setSwapData({ requester: 'Sister Sunita (ICU)', targetColleague: '', reason: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Shift Management & Roster"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shift Selector Tabs */}
        <View style={styles.shiftTabsRow}>
          {shifts.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.shiftTab, selectedShift === s.id && styles.shiftTabActive]}
              onPress={() => setSelectedShift(s.id)}
            >
              <Text style={[styles.shiftTabTitle, selectedShift === s.id && styles.shiftTextActive]}>
                {s.label}
              </Text>
              <Text style={[styles.shiftTabTime, selectedShift === s.id && styles.shiftTextActive]}>
                {s.time}
              </Text>
              <View style={[styles.shiftHeadcount, s.onDuty < s.required && styles.shortageHeadcount]}>
                <Text style={styles.shiftHeadcountText}>
                  {s.onDuty}/{s.required} Staff {s.onDuty < s.required && '⚠️'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shortage Alert if night or evening */}
        {selectedShift === 'night' && (
          <View style={styles.alertNotice}>
            <Ionicons name="warning" size={20} color={COLORS.triageRed} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>NIGHT SHIFT SHORTAGE DETECTED</Text>
              <Text style={styles.alertDesc}>
                2 Critical Care Nurses short for tonight. Recommended reassigning from morning post-duty standby.
              </Text>
            </View>
          </View>
        )}

        {/* Active Duty Staff Roster */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            ALLOCATED STAFF ROSTER ({currentRoster.length})
          </Text>
          <TouchableOpacity onPress={() => setSwapModalOpen(true)}>
            <Text style={styles.swapActionText}>Request Swap ⇄</Text>
          </TouchableOpacity>
        </View>

        {currentRoster.map((staff) => (
          <Card key={staff.id} style={styles.staffCard}>
            <View style={styles.staffHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.staffName}>{staff.name}</Text>
                <Text style={styles.staffRole}>{staff.role} • {staff.dept}</Text>
              </View>
              <View
                style={[
                  styles.checkBadge,
                  staff.status === 'checked_in' ? styles.badgeIn : styles.badgePending,
                ]}
              >
                <Text
                  style={[
                    styles.checkBadgeText,
                    staff.status === 'checked_in' ? styles.textIn : styles.textPending,
                  ]}
                >
                  {staff.status === 'checked_in' ? `In: ${staff.checkIn}` : 'Awaiting In'}
                </Text>
              </View>
            </View>

            <View style={styles.actionFooter}>
              <Button
                title="Mark Biometric Check-In"
                variant="outline"
                size="small"
                icon="finger-print"
                onPress={() => Alert.alert('Attendance Logged', `${staff.name} attendance recorded via biometric terminal.`)}
              />
            </View>
          </Card>
        ))}

        <Button
          title="Dispatch Shift Swap Request"
          variant="primary"
          size="large"
          icon="swap-horizontal"
          onPress={() => setSwapModalOpen(true)}
          style={{ width: '100%', marginTop: 14, marginBottom: 24 }}
        />
      </ScrollView>

      {/* Swap Modal */}
      <Modal
        visible={swapModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSwapModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shift Swap Requisition</Text>
              <TouchableOpacity onPress={() => setSwapModalOpen(false)}>
                <Ionicons name="close" size={22} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            <Input
              label="Requesting Staff *"
              value={swapData.requester}
              editable={false}
            />

            <Input
              label="Swap With Colleague *"
              placeholder="e.g. Sister Anjali (Ward B)"
              value={swapData.targetColleague}
              onChangeText={(t) => setSwapData((p) => ({ ...p, targetColleague: t }))}
            />

            <Input
              label="Reason for Emergency Swap *"
              placeholder="e.g. Family medical emergency"
              value={swapData.reason}
              onChangeText={(t) => setSwapData((p) => ({ ...p, reason: t }))}
              multiline
              numberOfLines={3}
            />

            <Button
              title="Submit Shift Swap"
              variant="primary"
              size="large"
              icon="send"
              onPress={handleSwapSubmit}
              style={{ width: '100%', marginTop: 16 }}
            />
          </View>
        </View>
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
  shiftTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  shiftTab: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  shiftTabActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  shiftTabTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.navy,
    textAlign: 'center',
  },
  shiftTabTime: {
    fontSize: 9,
    color: COLORS.slate,
    marginTop: 2,
    textAlign: 'center',
  },
  shiftTextActive: {
    color: COLORS.cardBg,
  },
  shiftHeadcount: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  shortageHeadcount: {
    backgroundColor: '#FEF2F2',
  },
  shiftHeadcountText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.navy,
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
    lineHeight: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
  },
  swapActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  staffCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
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
  checkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeIn: {
    backgroundColor: '#D1FAE5',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  checkBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textIn: {
    color: COLORS.triageGreen,
  },
  textPending: {
    color: '#B45309',
  },
  actionFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
  },
});
