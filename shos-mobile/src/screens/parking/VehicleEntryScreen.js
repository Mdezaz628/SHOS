// Vehicle Entry & Fast Pass Generation Screen
// Ported from shos-web/src/pages/parking/VehicleEntryForm.jsx & ParkingStaffDashboard.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const VehicleEntryScreen = ({ navigation }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [category, setCategory] = useState('Patient / Visitor');
  const [selectedZone, setSelectedZone] = useState('Zone A (Portico)');
  const [selectedSlot, setSelectedSlot] = useState('A04');

  // Active Parked Vehicles List
  const [activeVehicles, setActiveVehicles] = useState([
    {
      id: 'PRK-2026-8921',
      vehicle: 'DL-03-CC-1024',
      category: 'Patient Car',
      slot: 'A02',
      zone: 'Zone A',
      driver: 'Sunita Sharma',
      entryTime: '08:15 AM',
      hourlyRate: '₹20/hr',
    },
    {
      id: 'PRK-2026-8920',
      vehicle: 'UP-16-BZ-8821',
      category: 'Visitor Sedan',
      slot: 'A05',
      zone: 'Zone A',
      driver: 'Alok Gupta',
      entryTime: '08:45 AM',
      hourlyRate: '₹20/hr',
    },
    {
      id: 'PRK-2026-8919',
      vehicle: 'HR-26-DK-4091',
      category: 'Doctor Sedan',
      slot: 'B04',
      zone: 'Zone B',
      driver: 'Dr. Vivek Mehra',
      entryTime: '07:50 AM',
      hourlyRate: 'Exempt (Staff)',
    },
    {
      id: 'PRK-2026-8918',
      vehicle: 'KA-04-EM-0108',
      category: 'Ambulance STAT',
      slot: 'A04',
      zone: 'Zone A',
      driver: 'Pilot Rajesh K.',
      entryTime: '09:10 AM',
      hourlyRate: 'Exempt (ER)',
    },
  ]);

  // Generated Digital Slip Modal
  const [generatedPass, setGeneratedPass] = useState(null);
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);

  const categories = [
    { label: 'Patient / Visitor', icon: 'person-outline', rate: '₹20/hr' },
    { label: 'Doctor / Consultant', icon: 'medkit-outline', rate: 'Complimentary' },
    { label: 'Hospital Staff', icon: 'id-card-outline', rate: 'Staff Pass' },
    { label: 'Ambulance / STAT', icon: 'medical-outline', rate: 'Zero Fare Priority' },
    { label: 'VIP / Government', icon: 'shield-outline', rate: 'Exempt' },
  ];

  const availableBays = [
    { zone: 'Zone A (Portico)', slot: 'A01', type: 'Fast OPD', free: true },
    { zone: 'Zone A (Portico)', slot: 'A03', type: 'Fast OPD', free: true },
    { zone: 'Zone A (Portico)', slot: 'A06', type: 'Discharge Bay', free: true },
    { zone: 'Zone B (Multi-Level)', slot: 'B08', type: 'Long Stay', free: true },
    { zone: 'Zone B (Multi-Level)', slot: 'B12', type: 'Covered', free: true },
    { zone: 'Basement P2', slot: 'P2-15', type: 'Staff/Reserved', free: true },
  ];

  const handleIssuePass = () => {
    if (!vehicleNumber.trim()) {
      Alert.alert('Plate Number Required', 'Please enter the vehicle registration plate number.');
      return;
    }

    const passId = `PRK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const entryTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPass = {
      id: passId,
      vehicle: vehicleNumber.toUpperCase().trim(),
      category,
      slot: selectedSlot,
      zone: selectedZone,
      driver: driverName.trim() || 'Attendant',
      entryTime: entryTimeString,
      hourlyRate: category.includes('Doctor') || category.includes('Ambulance') ? 'Exempt' : '₹20/hr (First 30m Free)',
    };

    setActiveVehicles([newPass, ...activeVehicles]);
    setGeneratedPass(newPass);
    setIsPassModalVisible(true);

    // Reset fields
    setVehicleNumber('');
    setDriverName('');
    setContactNumber('');
  };

  const handleCheckoutVehicle = (vehicle) => {
    Alert.alert(
      'Checkout & Release Bay',
      `Release vehicle ${vehicle.vehicle} from slot ${vehicle.slot}?\nParked at ${vehicle.entryTime}.\nTotal Calculated Parking Fee: ${vehicle.hourlyRate === 'Exempt' ? '₹0 (Exempt)' : '₹40'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Exit & Collect Receipt',
          onPress: () => {
            setActiveVehicles(activeVehicles.filter((v) => v.id !== vehicle.id));
            Alert.alert('Bay Released', `Slot ${vehicle.slot} is now VACANT and green in Central ANPR Grid.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Vehicle Entry & Fast Pass"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Barrier Status Banner */}
        <View style={styles.barrierBanner}>
          <View style={styles.bannerIconWrap}>
            <Ionicons name="scan-circle" size={24} color={COLORS.hospitalBlue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>ANPR AUTOMATED BOOM BARRIER #1</Text>
            <Text style={styles.bannerDesc}>
              Camera: Online (99.8%) • Auto-Plate OCR Active • Free slots: 38
            </Text>
          </View>
          <View style={styles.livePill}>
            <Text style={styles.liveText}>READY</Text>
          </View>
        </View>

        {/* Vehicle Registration Input Card */}
        <Card style={styles.formCard}>
          <Text style={styles.cardHeader}>ISSUE NEW ENTRY TOKEN</Text>

          {/* Plate Number */}
          <Text style={styles.inputLabel}>VEHICLE REGISTRATION NUMBER *</Text>
          <View style={styles.plateInputContainer}>
            <View style={styles.indBadge}>
              <Text style={styles.indText}>IND</Text>
            </View>
            <TextInput
              style={styles.plateInput}
              placeholder="e.g. KA-05-MH-2026"
              placeholderTextColor={COLORS.slate}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              autoCapitalize="characters"
              maxLength={15}
            />
            {vehicleNumber.length > 0 && (
              <TouchableOpacity onPress={() => setVehicleNumber('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={COLORS.slate} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Presets */}
          <View style={styles.presetRow}>
            {['DL-01-AB-1234', 'KA-04-ER-9911', 'MH-02-CD-5678'].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={styles.presetChip}
                onPress={() => setVehicleNumber(preset)}
              >
                <Text style={styles.presetChipText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category Select */}
          <Text style={[styles.inputLabel, { marginTop: 14 }]}>VEHICLE CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map((c) => {
              const isSelected = category === c.label;
              return (
                <TouchableOpacity
                  key={c.label}
                  style={[styles.catChip, isSelected && styles.catChipActive]}
                  onPress={() => setCategory(c.label)}
                >
                  <Ionicons
                    name={c.icon}
                    size={14}
                    color={isSelected ? COLORS.cardBg : COLORS.hospitalBlue}
                  />
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Driver & Contact */}
          <View style={styles.doubleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>DRIVER / PATIENT NAME</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Name (Optional)"
                placeholderTextColor={COLORS.slate}
                value={driverName}
                onChangeText={setDriverName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>MOBILE PHONE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="10 Digits"
                placeholderTextColor={COLORS.slate}
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Bay Assignment */}
          <Text style={[styles.inputLabel, { marginTop: 14 }]}>ASSIGN VACANT PARKING BAY</Text>
          <View style={styles.bayGrid}>
            {availableBays.map((bay) => {
              const isSelected = selectedSlot === bay.slot;
              return (
                <TouchableOpacity
                  key={bay.slot}
                  style={[styles.bayCard, isSelected && styles.bayCardActive]}
                  onPress={() => {
                    setSelectedSlot(bay.slot);
                    setSelectedZone(bay.zone);
                  }}
                >
                  <View style={styles.bayHeader}>
                    <Text style={[styles.baySlot, isSelected && styles.baySlotActive]}>
                      {bay.slot}
                    </Text>
                    <View style={styles.vacantDot} />
                  </View>
                  <Text style={styles.bayZone}>{bay.zone}</Text>
                  <Text style={styles.bayType}>{bay.type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            title="Generate Digital Parking Pass & Open Barrier"
            variant="primary"
            size="large"
            icon="qr-code"
            onPress={handleIssuePass}
            style={{ marginTop: 18 }}
          />
        </Card>

        {/* Active Parked Vehicles Audit List */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionHeading}>ACTIVE PARKED VEHICLES ({activeVehicles.length})</Text>
          <Text style={styles.listMeta}>Tap checkout on vehicle exit</Text>
        </View>

        {activeVehicles.map((item) => (
          <Card key={item.id} style={styles.vehicleCard}>
            <View style={styles.vehicleCardTop}>
              <View style={styles.plateTag}>
                <Ionicons name="car-sport" size={16} color={COLORS.hospitalBlue} />
                <Text style={styles.plateTagText}>{item.vehicle}</Text>
              </View>
              <View style={styles.slotPill}>
                <Text style={styles.slotPillText}>{item.slot} • {item.zone}</Text>
              </View>
            </View>

            <View style={styles.vehicleDetailsRow}>
              <View>
                <Text style={styles.driverText}>{item.driver}</Text>
                <Text style={styles.categorySub}>{item.category} • Rate: {item.hourlyRate}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.timeLabel}>ENTRY TIME</Text>
                <Text style={styles.timeValue}>{item.entryTime}</Text>
              </View>
            </View>

            <View style={styles.cardActionsRow}>
              <Text style={styles.tokenRef}>Token: {item.id}</Text>
              <Button
                title="Checkout & Release"
                variant="outline"
                size="small"
                icon="exit-outline"
                onPress={() => handleCheckoutVehicle(item)}
              />
            </View>
          </Card>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Digital Parking Pass Modal */}
      <Modal
        visible={isPassModalVisible}
        title="Smart Parking Pass Issued"
        onClose={() => setIsPassModalVisible(false)}
      >
        {generatedPass && (
          <View style={styles.passModalContent}>
            <View style={styles.passHospitalHeader}>
              <Ionicons name="shield-checkmark" size={24} color={COLORS.triageGreen} />
              <View>
                <Text style={styles.passHospitalTitle}>SHOS SMART CAMPUS PARKING</Text>
                <Text style={styles.passHospitalSub}>Official Gate Entry Slip • Barrier 1</Text>
              </View>
            </View>

            {/* Big Plate Number Display */}
            <View style={styles.passPlateBox}>
              <Text style={styles.passPlateText}>{generatedPass.vehicle}</Text>
              <Text style={styles.passCategoryText}>{generatedPass.category.toUpperCase()}</Text>
            </View>

            {/* Bay & Time Info */}
            <View style={styles.passInfoGrid}>
              <View style={styles.passInfoItem}>
                <Text style={styles.passInfoLabel}>ASSIGNED BAY</Text>
                <Text style={styles.passInfoValue}>{generatedPass.slot}</Text>
                <Text style={styles.passInfoSub}>{generatedPass.zone}</Text>
              </View>
              <View style={styles.passInfoItem}>
                <Text style={styles.passInfoLabel}>ENTRY TIME</Text>
                <Text style={styles.passInfoValue}>{generatedPass.entryTime}</Text>
                <Text style={styles.passInfoSub}>Today</Text>
              </View>
            </View>

            {/* Barcode Mock Visual */}
            <View style={styles.barcodeBox}>
              <View style={styles.barcodeLines}>
                {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3].map((w, i) => (
                  <View
                    key={i}
                    style={{
                      width: w * 2.5,
                      height: 44,
                      backgroundColor: COLORS.navy,
                      marginHorizontal: 1.5,
                    }}
                  />
                ))}
              </View>
              <Text style={styles.barcodeNumber}>{generatedPass.id}</Text>
            </View>

            <Text style={styles.passTerms}>
              Please display this pass on the vehicle dashboard. First 30 mins free for Outpatient visitors. SHOS Campus is CCTV monitored.
            </Text>

            <Button
              title="Done • Print / Transmit Slip"
              variant="primary"
              size="medium"
              icon="checkmark-done"
              onPress={() => {
                setIsPassModalVisible(false);
                Alert.alert('Barrier Opened', `Boom Barrier 1 opened for vehicle ${generatedPass.vehicle}. Slip transmitted via SMS.`);
              }}
              style={{ marginTop: 12 }}
            />
          </View>
        )}
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
  barrierBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 10,
  },
  bannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  bannerDesc: {
    fontSize: 11,
    color: COLORS.navy,
    marginTop: 1,
  },
  livePill: {
    backgroundColor: COLORS.triageGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveText: {
    color: COLORS.cardBg,
    fontSize: 10,
    fontWeight: '800',
  },
  formCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.navy,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  plateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderWidth: 2,
    borderColor: COLORS.hospitalBlue,
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  indBadge: {
    backgroundColor: '#0F52BA',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  indText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  plateInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  },
  clearBtn: {
    padding: 4,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  presetChip: {
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  presetChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate,
  },
  catScroll: {
    marginBottom: 12,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  catChipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  catChipTextActive: {
    color: COLORS.cardBg,
  },
  doubleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.navy,
  },
  bayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bayCard: {
    width: '31%',
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  bayCardActive: {
    borderColor: COLORS.hospitalBlue,
    backgroundColor: COLORS.tealLight,
  },
  bayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baySlot: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  baySlotActive: {
    color: COLORS.hospitalBlue,
  },
  vacantDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.triageGreen,
  },
  bayZone: {
    fontSize: 9,
    color: COLORS.slate,
    marginTop: 2,
  },
  bayType: {
    fontSize: 8,
    color: COLORS.hospitalTeal,
    fontWeight: '700',
    marginTop: 2,
  },
  listHeader: {
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
  listMeta: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
  },
  vehicleCard: {
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  vehicleCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  plateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plateTagText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.navy,
    fontFamily: 'monospace',
  },
  slotPill: {
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  slotPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  vehicleDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  driverText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  categorySub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 1,
  },
  timeLabel: {
    fontSize: 9,
    color: COLORS.slate,
    fontWeight: '800',
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  tokenRef: {
    fontSize: 10,
    color: COLORS.slate,
    fontFamily: 'monospace',
  },
  passModalContent: {
    paddingVertical: 8,
  },
  passHospitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  passHospitalTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.navy,
  },
  passHospitalSub: {
    fontSize: 11,
    color: COLORS.slate,
  },
  passPlateBox: {
    backgroundColor: COLORS.offWhite,
    borderWidth: 2,
    borderColor: COLORS.navy,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  passPlateText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  passCategoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    marginTop: 4,
    letterSpacing: 1,
  },
  passInfoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  passInfoItem: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  passInfoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.slate,
  },
  passInfoValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
    marginTop: 2,
  },
  passInfoSub: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 1,
  },
  barcodeBox: {
    backgroundColor: COLORS.offWhite,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  barcodeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  barcodeNumber: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: COLORS.slate,
  },
  passTerms: {
    fontSize: 10,
    color: COLORS.slate,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 8,
  },
});
