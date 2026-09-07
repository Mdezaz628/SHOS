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
import { Button } from '../../components/common/Button';
import { useHospitalData } from '../../context/HospitalDataContext';

export const AdmissionBedScreen = ({ navigation }) => {
  const { beds } = useHospitalData();
  const [activeWard, setActiveWard] = useState('ward_a');
  const [selectedBed, setSelectedBed] = useState(null);

  const handleNurseCall = () => {
    Alert.alert(
      'Nurse Station Alerted 🚨',
      'Nursing Officer Sister Priya Nair has received your emergency bedside call for Ward A - Bed 04. Nurse arriving within 2 minutes.',
      [{ text: 'Acknowledged' }]
    );
  };

  const wards = [
    { id: 'ward_a', label: 'Ward A (CCU)', floor: '2nd Floor Block B', occupied: 4, total: 6 },
    { id: 'ward_b', label: 'Ward B (General)', floor: '3rd Floor Block A', occupied: 5, total: 6 },
    { id: 'icu', label: 'ICU (Critical Care)', floor: '1st Floor Block C', occupied: 5, total: 6 },
  ];

  const wardData = {
    ward_a: [
      { number: 'Bed 01', type: 'Telemetry Step-Down', status: 'available', color: COLORS.triageGreen, icon: 'checkmark-circle', amenities: ['Oxygen Line', 'Telemetry', 'Attendant Couch'], nurse: 'Sister Sunita' },
      { number: 'Bed 02', type: 'Cardiac Monitor', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'K. S. Verma (71M)', amenities: ['Oxygen Line', 'ECG Monitor'], nurse: 'Sister Priya' },
      { number: 'Bed 03', type: 'Telemetry Step-Down', status: 'available', color: COLORS.triageGreen, icon: 'checkmark-circle', amenities: ['Oxygen Line', 'IV Infusion'], nurse: 'Sister Sunita' },
      { number: 'Bed 04', type: 'Cardiac Telemetry Bed', status: 'your_bed', color: COLORS.hospitalBlue, icon: 'person-circle', patient: 'Rahul Sharma (42M) - YOU', amenities: ['Central Oxygen', 'Telemetry', 'Reclining Couch', 'Ventilator Ready'], nurse: 'Sister Priya Nair' },
      { number: 'Bed 05', type: 'Observation', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Arun D. (55M)', amenities: ['Oxygen Line'], nurse: 'Sister Priya' },
      { number: 'Bed 06', type: 'Sanitizing Post-Discharge', status: 'cleaning', color: COLORS.warning, icon: 'sparkles', amenities: ['Deep Cleaning in Progress'], nurse: 'Housekeeping Staff' },
    ],
    ward_b: [
      { number: 'Bed 07', type: 'General Medical', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Meena K. (38F)', amenities: ['Central Oxygen'], nurse: 'Sister Anjali' },
      { number: 'Bed 08', type: 'General Medical', status: 'available', color: COLORS.triageGreen, icon: 'checkmark-circle', amenities: ['Standard Bed'], nurse: 'Sister Anjali' },
      { number: 'Bed 09', type: 'General Medical', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Suraj P. (60M)', amenities: ['IV Drip'], nurse: 'Sister Kavita' },
      { number: 'Bed 10', type: 'General Medical', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Farida B. (45F)', amenities: ['Oxygen Line'], nurse: 'Sister Kavita' },
      { number: 'Bed 11', type: 'General Medical', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Nitin J. (52M)', amenities: ['Standard Bed'], nurse: 'Sister Anjali' },
      { number: 'Bed 12', type: 'General Medical', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Gopal S. (67M)', amenities: ['Oxygen Line'], nurse: 'Sister Kavita' },
    ],
    icu: [
      { number: 'ICU-01', type: 'Level 3 Advanced ICU', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Critical Observation', amenities: ['Invasive Ventilator', 'Arterial Line', 'Syringe Pumps'], nurse: 'ICU Specialist Staff' },
      { number: 'ICU-02', type: 'Level 3 Advanced ICU', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Cardiac Post-Op', amenities: ['Biphasic Defibrillator', 'Ventilator'], nurse: 'ICU Specialist Staff' },
      { number: 'ICU-03', type: 'Level 3 Advanced ICU', status: 'available', color: COLORS.triageGreen, icon: 'checkmark-circle', amenities: ['Ventilator Ready', 'Central Air & O2'], nurse: 'Duty Intensivist' },
      { number: 'ICU-04', type: 'Level 3 Advanced ICU', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Neuro Trauma', amenities: ['Ventilator', 'ICP Monitor'], nurse: 'ICU Specialist Staff' },
      { number: 'ICU-05', type: 'Level 3 Advanced ICU', status: 'occupied', color: COLORS.triageRed, icon: 'close-circle', patient: 'Sepsis Protocol', amenities: ['Hemofiltration', 'Ventilator'], nurse: 'ICU Specialist Staff' },
      { number: 'ICU-06', type: 'Level 3 Advanced ICU', status: 'cleaning', color: COLORS.warning, icon: 'sparkles', amenities: ['Terminal Sterilization'], nurse: 'Sanitation Team' },
    ],
  };

  const currentWardsBeds = wardData[activeWard] || wardData.ward_a;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Inpatient Ward & Bed Census"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admission Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.wardTitle}>Ward A — Cardiac Care Unit</Text>
              <Text style={styles.wardSubtitle}>Room 204 • 2nd Floor Block B</Text>
            </View>
            <StatusBadge status="admitted" type="badge" />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Assigned Bed</Text>
              <Text style={styles.itemVal}>Bed 04 (Telemetry Recliner)</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Attending Doctor</Text>
              <Text style={styles.itemVal}>Dr. Vikram Malhotra (Cardiology)</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Admission Date</Text>
              <Text style={styles.itemVal}>04 Sep 2026, 09:15 AM</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemLabel}>Ward Nurse In-Charge</Text>
              <Text style={styles.itemVal}>Sister Priya Nair (Station #2)</Text>
            </View>
          </View>

          {/* Nurse Call Button */}
          <Button
            title="Emergency Call Duty Nurse Station"
            variant="primary"
            size="medium"
            icon="notifications"
            onPress={handleNurseCall}
            style={styles.callNurseBtn}
          />
        </Card>

        {/* Multi-Ward Filter Tabs */}
        <Text style={styles.sectionHeading}>SELECT HOSPITAL WARD</Text>
        <View style={styles.wardTabsRow}>
          {wards.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={[
                styles.wardTab,
                activeWard === w.id && styles.wardTabActive,
              ]}
              onPress={() => setActiveWard(w.id)}
            >
              <Text style={[styles.wardTabTitle, activeWard === w.id && styles.wardTabTextActive]}>
                {w.label}
              </Text>
              <Text style={[styles.wardTabSub, activeWard === w.id && styles.wardTabTextActive]}>
                {w.occupied}/{w.total} Beds
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Visual Bed Grid Matrix (Web Feature Parity) */}
        <Card style={styles.matrixCard}>
          <View style={styles.matrixHeader}>
            <Text style={styles.matrixTitle}>
              {wards.find((w) => w.id === activeWard)?.label.toUpperCase()} — LIVE BED RADAR
            </Text>
            <Text style={styles.matrixSubtitle}>
              {wards.find((w) => w.id === activeWard)?.floor}
            </Text>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.triageGreen }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.triageRed }]} />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.hospitalBlue }]} />
              <Text style={styles.legendText}>Your Bed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.legendText}>Sanitizing</Text>
            </View>
          </View>

          <View style={styles.gridContainer}>
            {currentWardsBeds.map((b, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.gridBed,
                  b.status === 'your_bed' && styles.gridBedActive,
                ]}
                onPress={() => setSelectedBed(b)}
                activeOpacity={0.7}
              >
                <Ionicons name={b.icon} size={24} color={b.color} />
                <Text style={styles.bedNum}>{b.number}</Text>
                <Text style={[styles.bedStatus, { color: b.color }]}>
                  {b.status === 'your_bed' ? 'Assigned (You)' : b.status}
                </Text>
                <Text style={styles.bedTapHint}>Tap details</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Bed Detail Inspection Modal */}
      <Modal
        visible={!!selectedBed}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedBed(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalBedNum}>{selectedBed?.number}</Text>
                <Text style={styles.modalBedType}>{selectedBed?.type}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedBed(null)}>
                <Ionicons name="close" size={22} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalStatusRow}>
              <Text style={styles.modalStatusLabel}>Current Status:</Text>
              <Text style={[styles.modalStatusVal, { color: selectedBed?.color }]}>
                {selectedBed?.status.toUpperCase()}
              </Text>
            </View>

            {selectedBed?.patient && (
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Patient Occupant:</Text>
                <Text style={styles.modalInfoVal}>{selectedBed.patient}</Text>
              </View>
            )}

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Duty Nurse / Tech:</Text>
              <Text style={styles.modalInfoVal}>{selectedBed?.nurse}</Text>
            </View>

            <Text style={styles.amenitiesHeader}>ATTACHED MEDICAL AMENITIES</Text>
            <View style={styles.amenitiesWrap}>
              {selectedBed?.amenities?.map((item, i) => (
                <View key={i} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.hospitalTeal} />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Close Bed Inspector"
              variant="outline"
              size="medium"
              onPress={() => setSelectedBed(null)}
              style={{ marginTop: 16 }}
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
  summaryCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  wardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
  },
  wardSubtitle: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  detailsGrid: {
    backgroundColor: COLORS.offWhite,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 12,
    color: COLORS.slate,
  },
  itemVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  callNurseBtn: {
    width: '100%',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  wardTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  wardTab: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wardTabActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  wardTabTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  wardTabSub: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 2,
  },
  wardTabTextActive: {
    color: COLORS.cardBg,
  },
  matrixCard: {
    marginBottom: 16,
  },
  matrixHeader: {
    marginBottom: 12,
  },
  matrixTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
    letterSpacing: 0.5,
  },
  matrixSubtitle: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.slate,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  gridBed: {
    width: '31%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  gridBedActive: {
    borderColor: COLORS.hospitalBlue,
    borderWidth: 2,
    backgroundColor: COLORS.tealLight,
  },
  bedNum: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 4,
  },
  bedStatus: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  bedTapHint: {
    fontSize: 9,
    color: COLORS.slate,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 10,
  },
  modalBedNum: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.navy,
  },
  modalBedType: {
    fontSize: 12,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
    marginTop: 2,
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  modalStatusLabel: {
    fontSize: 12,
    color: COLORS.slate,
  },
  modalStatusVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: COLORS.slate,
  },
  modalInfoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  amenitiesHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  amenitiesWrap: {
    gap: 6,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.offWhite,
    padding: 8,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 12,
    color: COLORS.navy,
  },
});
