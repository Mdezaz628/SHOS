import React, { useState } from 'react';
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

      {/* Booking Confirmation Dialog */}
      <ConfirmationModal
        visible={!!confirmedToken}
        title="Appointment Confirmed!"
        message={`Your appointment with ${doctor?.name || 'Dr. Vikram Malhotra'} has been scheduled.\n\nYour Assigned Token: #${confirmedToken}\nOPD Room: ${doctor?.roomNumber || 'OPD-204'}\nSlot: ${selectedSlot}`}
        confirmText="View in Live Queue"
        onConfirm={() => {
          setConfirmedToken(null);
          navigation.navigate('Queue');
        }}
        onCancel={() => {
          setConfirmedToken(null);
          navigation.goBack();
        }}
      />
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
});
