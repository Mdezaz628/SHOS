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
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

export const ParkingDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Vehicle Entry Modal
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState('Car (Patient)');
  const [allocatedSlot, setAllocatedSlot] = useState('A-04');
  const [generatedPass, setGeneratedPass] = useState(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const zoneASlots = [
    { slot: 'A01', status: 'available', color: COLORS.triageGreen },
    { slot: 'A02', status: 'occupied', color: COLORS.triageRed },
    { slot: 'A03', status: 'available', color: COLORS.triageGreen },
    { slot: 'A04', status: 'available', color: COLORS.triageGreen },
    { slot: 'A05', status: 'occupied', color: COLORS.triageRed },
    { slot: 'A06', status: 'reserved', color: COLORS.warning },
  ];

  const handleCreateEntry = () => {
    if (!vehicleNo) {
      Alert.alert('Required', 'Please enter the vehicle registration plate.');
      return;
    }
    const passData = {
      passId: `PRK-2026-${Date.now().toString().slice(-4)}`,
      vehicle: vehicleNo.toUpperCase(),
      type: vehicleType,
      slot: allocatedSlot,
      entryTime: '06 Sep 2026, 01:50 PM',
    };
    setGeneratedPass(passData);
    setIsEntryModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Campus Parking Gate Terminal"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Gate Officer Header */}
        <View style={styles.gateHeader}>
          <View>
            <Text style={styles.gateLabel}>CAMPUS MAIN GATE 1 • BOOM BARRIER</Text>
            <Text style={styles.officerName}>{currentUser?.name || 'Manoj Singh'}</Text>
            <Text style={styles.gateMeta}>Automated ANPR & QR Smart Parking</Text>
          </View>
          <Button
            title="Fast Vehicle Entry"
            variant="primary"
            size="small"
            icon="car-sport"
            onPress={() => setIsEntryModalOpen(true)}
          />
        </View>

        {/* Phase 21 Parking Stats */}
        <Text style={styles.sectionHeading}>PARKING INVENTORY</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Slots"
            value="120"
            change="Campus A+B"
            changeType="neutral"
            icon="grid"
            color={COLORS.hospitalBlue}
          />
          <StatCard
            label="Available"
            value="34"
            change="Vacant"
            changeType="positive"
            icon="checkmark-circle"
            color={COLORS.triageGreen}
          />
          <StatCard
            label="Occupied"
            value="82"
            change="Parked"
            changeType="negative"
            icon="car"
            color={COLORS.triageRed}
          />
          <StatCard
            label="Reserved"
            value="4"
            change="Doctors / ER"
            changeType="neutral"
            icon="bookmark"
            color={COLORS.warning}
          />
        </View>

        {/* Generated QR Pass Banner if any */}
        {generatedPass && (
          <Card style={styles.passCard}>
            <View style={styles.passHeader}>
              <Ionicons name="qr-code" size={24} color={COLORS.hospitalBlue} />
              <Text style={styles.passTitle}>Active Digital Parking Pass</Text>
            </View>
            <View style={styles.passDetails}>
              <Text style={styles.passNumber}>{generatedPass.vehicle}</Text>
              <Text style={styles.passSlot}>Assigned Bay: {generatedPass.slot}</Text>
              <Text style={styles.passTime}>Entry: {generatedPass.entryTime}</Text>
            </View>
          </Card>
        )}

        {/* Zone A Slot Matrix */}
        <Text style={styles.sectionHeading}>ZONE A (OPD & VISITOR PARKING)</Text>
        <Card style={styles.matrixCard}>
          <View style={styles.gridContainer}>
            {zoneASlots.map((s, idx) => (
              <View key={idx} style={styles.slotItem}>
                <Ionicons name="car-sport" size={24} color={s.color} />
                <Text style={styles.slotName}>{s.slot}</Text>
                <Text style={[styles.slotStatus, { color: s.color }]}>{s.status}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Vehicle Entry Modal */}
      <Modal
        visible={isEntryModalOpen}
        title="Issue Fast Vehicle Parking Pass"
        onClose={() => setIsEntryModalOpen(false)}
      >
        <Input
          label="Vehicle Plate Number *"
          placeholder="e.g. KA-01-MJ-4190"
          value={vehicleNo}
          onChangeText={setVehicleNo}
          autoCapitalize="characters"
          leftIcon="car-outline"
        />

        <Input
          label="Category / Visitor"
          value={vehicleType}
          onChangeText={setVehicleType}
        />

        <Input
          label="Assigned Parking Slot"
          value={allocatedSlot}
          onChangeText={setAllocatedSlot}
        />

        <Button
          title="Generate Digital QR Pass"
          variant="primary"
          size="medium"
          icon="qr-code-outline"
          onPress={handleCreateEntry}
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
  gateHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gateLabel: {
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
  gateMeta: {
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
  passCard: {
    backgroundColor: COLORS.tealLight,
    borderColor: COLORS.hospitalBlue,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  passHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  passTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  passDetails: {
    gap: 4,
  },
  passNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.navy,
  },
  passSlot: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  passTime: {
    fontSize: 11,
    color: COLORS.slate,
  },
  matrixCard: {
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  slotItem: {
    width: '30%',
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  slotName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 6,
  },
  slotStatus: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginTop: 2,
  },
});
