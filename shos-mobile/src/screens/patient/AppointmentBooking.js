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
import { Avatar } from '../../components/common/Avatar';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useHospitalData } from '../../context/HospitalDataContext';
import { useAuth } from '../../context/AuthContext';

export const AppointmentBooking = ({ route, navigation }) => {
  const { doctor } = route.params || {};
  const { addAppointment } = useHospitalData();
  const { currentUser } = useAuth();

  const [selectedDate, setSelectedDate] = useState('2026-09-06');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [consultType, setConsultType] = useState('In-Person OPD');
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedToken, setConfirmedToken] = useState(null);

  const dates = [
    { label: 'Today', date: '2026-09-06', day: 'Sat' },
    { label: 'Tomorrow', date: '2026-09-07', day: 'Sun' },
    { label: 'Monday', date: '2026-09-08', day: 'Mon' },
  ];

  const timeSlots = [
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:15 AM',
    '12:00 PM',
    '02:30 PM',
    '03:45 PM',
    '04:30 PM',
  ];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const tokenNo = Math.floor(Math.random() * 20) + 20;
    const newApp = {
      id: `APP-2026-${Date.now().toString().slice(-4)}`,
      doctorName: doctor?.name || 'Dr. Vikram Malhotra',
      doctorId: doctor?.id || 'DOC-102',
      specialty: doctor?.specialty || 'Cardiology',
      department: doctor?.specialty || doctor?.department || 'Cardiology',
      patientName: currentUser?.name || 'Rahul Sharma',
      patientId: currentUser?.uhid || 'SHOS-2026-8942',
      uhid: currentUser?.uhid || 'SHOS-2026-8942',
      date: selectedDate,
      timeSlot: selectedSlot,
      time: selectedSlot,
      roomNumber: doctor?.roomNumber || 'OPD-204',
      type: consultType,
      complaint: complaint || 'Routine cardiac consultation',
      status: 'confirmed',
      tokenNumber: tokenNo,
    };

    try {
      const { apiClient } = require('../../api/client');
      await apiClient.post('/appointments', newApp);
    } catch (e) {
      console.log('[AppointmentBooking] Offline fallback for local state:', e.message);
    }

    addAppointment(newApp);
    setIsSubmitting(false);
    setConfirmedToken(tokenNo);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Schedule OPD Visit"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Doctor Banner */}
        <Card style={styles.doctorBanner}>
          <View style={styles.docRow}>
            <Avatar name={doctor?.name || 'Dr. Vikram Malhotra'} size="medium" role="doctor" />
            <View style={styles.docInfo}>
              <Text style={styles.docName}>{doctor?.name || 'Dr. Vikram Malhotra'}</Text>
              <Text style={styles.docSpecialty}>{doctor?.specialty || 'Interventional Cardiology'}</Text>
              <Text style={styles.docMeta}>Room {doctor?.roomNumber || 'OPD-204'} • OPD Consultation Fee: ₹{doctor?.fee || '800'}</Text>
            </View>
          </View>
        </Card>

        {/* Date Selector */}
        <Text style={styles.sectionHeading}>SELECT CONSULTATION DATE</Text>
        <View style={styles.dateRow}>
          {dates.map((d) => (
            <TouchableOpacity
              key={d.date}
              style={[
                styles.dateCard,
                selectedDate === d.date && styles.dateCardActive,
              ]}
              onPress={() => setSelectedDate(d.date)}
            >
              <Text style={[styles.dayLabel, selectedDate === d.date && styles.textActive]}>
                {d.day}
              </Text>
              <Text style={[styles.dateLabel, selectedDate === d.date && styles.textActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Slot Grid */}
        <Text style={styles.sectionHeading}>AVAILABLE OPD SLOTS</Text>
        <View style={styles.slotsGrid}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotBtn,
                selectedSlot === slot && styles.slotBtnActive,
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Ionicons
                name="time-outline"
                size={14}
                color={selectedSlot === slot ? COLORS.cardBg : COLORS.hospitalBlue}
              />
              <Text
                style={[
                  styles.slotText,
                  selectedSlot === slot && styles.textActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Consultation Mode */}
        <Text style={styles.sectionHeading}>MODE</Text>
        <View style={styles.modeRow}>
          {['In-Person OPD', 'Tele-Consultation'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeBtn,
                consultType === mode && styles.modeBtnActive,
              ]}
              onPress={() => setConsultType(mode)}
            >
              <Ionicons
                name={mode === 'In-Person OPD' ? 'business' : 'videocam'}
                size={16}
                color={consultType === mode ? COLORS.cardBg : COLORS.navy}
              />
              <Text
                style={[
                  styles.modeText,
                  consultType === mode && styles.textActive,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Symptoms / Notes */}
        <Text style={styles.sectionHeading}>CHIEF COMPLAINT / SYMPTOMS</Text>
        <Input
          placeholder="e.g. Mild chest tightness on exertion for 3 days..."
          value={complaint}
          onChangeText={setComplaint}
          numberOfLines={3}
          multiline
        />

        {/* Confirmation Button */}
        <Button
          title={isSubmitting ? 'Reserving Slot...' : 'Confirm Appointment'}
          variant="primary"
          size="large"
          icon="calendar"
          onPress={handleConfirm}
          loading={isSubmitting}
          style={styles.confirmBtn}
        />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Official Digital OPD Appointment Token Slip Modal (Web Parity) */}
      <Modal
        visible={!!confirmedToken}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setConfirmedToken(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tokenSlipCard}>
            <View style={styles.tokenSlipHeader}>
              <View style={styles.hospitalLogoRow}>
                <Ionicons name="medkit" size={20} color={COLORS.hospitalBlue} />
                <Text style={styles.slipHospitalName}>SHOS MULTISPECIALTY HOSPITAL</Text>
              </View>
              <Text style={styles.slipTitle}>OFFICIAL OPD APPOINTMENT TOKEN SLIP</Text>
            </View>

            {/* Huge Token Circle */}
            <View style={styles.tokenHero}>
              <Text style={styles.tokenHeroLabel}>ASSIGNED QUEUE TOKEN</Text>
              <Text style={styles.tokenHeroNum}>#{confirmedToken}</Text>
              <Text style={styles.tokenHeroHint}>Please report 10 mins before time slot</Text>
            </View>

            {/* Slip Details Grid */}
            <View style={styles.slipDetailsBox}>
              <View style={styles.slipRow}>
                <Text style={styles.slipLabel}>Specialist Doctor:</Text>
                <Text style={styles.slipVal}>{doctor?.name || 'Dr. Vikram Malhotra'}</Text>
              </View>
              <View style={styles.slipRow}>
                <Text style={styles.slipLabel}>Department:</Text>
                <Text style={styles.slipVal}>{doctor?.specialty || 'Cardiology'}</Text>
              </View>
              <View style={styles.slipRow}>
                <Text style={styles.slipLabel}>Consultation Room:</Text>
                <Text style={[styles.slipVal, { color: COLORS.hospitalBlue, fontWeight: '800' }]}>
                  {doctor?.roomNumber || 'Room OPD-204 (2nd Floor)'}
                </Text>
              </View>
              <View style={styles.slipRow}>
                <Text style={styles.slipLabel}>Date & Slot:</Text>
                <Text style={styles.slipVal}>{selectedDate} • {selectedSlot}</Text>
              </View>
              <View style={styles.slipRow}>
                <Text style={styles.slipLabel}>Patient UHID:</Text>
                <Text style={styles.slipVal}>{currentUser?.uhid || 'SHOS-2026-8942'}</Text>
              </View>
              <View style={[styles.slipRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.slipLabel}>Patient Name:</Text>
                <Text style={styles.slipVal}>{currentUser?.name || 'Rahul Sharma'}</Text>
              </View>
            </View>

            {/* Simulated Digital Security Barcode */}
            <View style={styles.barcodeWrap}>
              <Ionicons name="qr-code-outline" size={44} color={COLORS.navy} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.barcodeCode}>SHOS-OPD-{confirmedToken}-2026</Text>
                <Text style={styles.barcodeSub}>Scan at OPD Kiosk / Waiting Hall Display</Text>
              </View>
            </View>

            <View style={styles.slipActions}>
              <Button
                title="View in Live OPD Queue"
                variant="primary"
                size="large"
                icon="time"
                onPress={() => {
                  setConfirmedToken(null);
                  navigation.navigate('Queue');
                }}
                style={{ width: '100%', marginBottom: 8 }}
              />
              <Button
                title="Save & Return to Dashboard"
                variant="outline"
                size="medium"
                onPress={() => {
                  setConfirmedToken(null);
                  navigation.goBack();
                }}
                style={{ width: '100%' }}
              />
            </View>
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
  doctorBanner: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docInfo: {
    marginLeft: 12,
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
  },
  docSpecialty: {
    fontSize: 12,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
    marginTop: 2,
  },
  docMeta: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dateCard: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateCardActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  dayLabel: {
    fontSize: 11,
    color: COLORS.slate,
    fontWeight: '600',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 2,
  },
  textActive: {
    color: COLORS.cardBg,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  slotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  slotBtnActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  modeBtnActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  confirmBtn: {
    width: '100%',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  tokenSlipCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  tokenSlipHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 12,
    marginBottom: 14,
  },
  hospitalLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  slipHospitalName: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  slipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
    letterSpacing: 0.5,
  },
  tokenHero: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14,
  },
  tokenHeroLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 1,
  },
  tokenHeroNum: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
    lineHeight: 48,
    marginVertical: 2,
  },
  tokenHeroHint: {
    fontSize: 11,
    color: COLORS.navy,
    fontWeight: '600',
  },
  slipDetailsBox: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14,
  },
  slipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  slipLabel: {
    fontSize: 11,
    color: COLORS.slate,
    fontWeight: '600',
  },
  slipVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  barcodeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  barcodeCode: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
    letterSpacing: 1,
  },
  barcodeSub: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 2,
  },
  slipActions: {
    width: '100%',
  },
});
