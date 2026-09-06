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
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { MedicineCard } from '../../components/hospital/MedicineCard';
import { useHospitalData } from '../../context/HospitalDataContext';

export const PharmacyDashboard = ({ navigation }) => {
  const { prescriptions, medicines } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);
  const [localRx, setLocalRx] = useState(prescriptions);
  const [localMeds, setLocalMeds] = useState(medicines || []);
  const [workloadFilter, setWorkloadFilter] = useState('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const pendingCount = (localRx || []).filter((r) => r.status === 'active' || r.status === 'pending').length;
  const lowStockCount = (localMeds || []).filter((m) => (m.stockQuantity || m.stock || 0) < 50).length;

  const handleDispense = (rx) => {
    Alert.alert(
      'Dispense Prescription',
      `Dispense medicines for Patient ${rx.patientName}?\nBatch barcode checks verified.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Dispense',
          onPress: () => {
            setLocalRx((prev) =>
              prev.map((item) => (item.id === rx.id ? { ...item, status: 'dispensed' } : item))
            );
            Alert.alert('Prescription Dispensed', `Medicines packaged and inventory deducted for ${rx.patientName}.`);
          },
        },
      ]
    );
  };

  const handleRestock = (med) => {
    setLocalMeds((prev) =>
      prev.map((m) =>
        m.id === med.id
          ? {
              ...m,
              stockQuantity: (m.stockQuantity || m.stock || 0) + 100,
              stock: (m.stock || m.stockQuantity || 0) + 100,
            }
          : m
      )
    );
    Alert.alert(
      'Formulary Restocked',
      `Restocked +100 units for ${med.name}.\nNew Batch: BTH-${Date.now().toString().slice(-4)}\nInventory ledger updated.`
    );
  };

  const filteredRx = (localRx || []).filter((r) => {
    if (workloadFilter === 'all') return true;
    if (workloadFilter === 'pending') return r.status === 'active' || r.status === 'pending';
    if (workloadFilter === 'dispensed') return r.status === 'dispensed';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Central Hospital Dispensary"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Pharmacy Stats (Touch to filter) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.sectionHeading}>DISPENSARY OPERATIONS</Text>
          <Text style={{ fontSize: 11, color: COLORS.hospitalBlue, fontWeight: '600' }}>Tap card to filter</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Pending eRx"
            value={pendingCount.toString()}
            change={workloadFilter === 'pending' ? '● Active Filter' : 'In Queue'}
            changeType="warning"
            icon="receipt"
            color={COLORS.warning}
            onPress={() => setWorkloadFilter(workloadFilter === 'pending' ? 'all' : 'pending')}
            style={workloadFilter === 'pending' ? { borderColor: COLORS.warning, borderWidth: 2 } : null}
          />
          <StatCard
            label="Low Stock Alert"
            value={lowStockCount.toString()}
            change="Refill Due"
            changeType="negative"
            icon="alert-circle"
            color={COLORS.triageRed}
            onPress={() => Alert.alert('Low Stock Formulary', `${lowStockCount} items below safety threshold (50 units). Restock triggered.`)}
          />
          <StatCard
            label="Total SKUs"
            value={medicines.length.toString()}
            change="Active Items"
            changeType="positive"
            icon="medical"
            color={COLORS.hospitalBlue}
            onPress={() => setWorkloadFilter('all')}
          />
        </View>

        {/* Doctor Prescriptions Waiting for Dispensation with Touch Interactivity */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View>
            <Text style={styles.sectionHeading}>PRESCRIPTION QUEUE ({filteredRx.length})</Text>
            <Text style={{ fontSize: 11, color: COLORS.slate }}>Tap card to dispense medicines & verify dosages</Text>
          </View>
          {workloadFilter !== 'all' && (
            <TouchableOpacity onPress={() => setWorkloadFilter('all')}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.hospitalBlue }}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredRx.map((rx) => {
          const isDispensed = rx.status === 'dispensed';

          return (
            <TouchableOpacity
              key={rx.id}
              activeOpacity={0.8}
              onPress={() => handleDispense(rx)}
            >
              <Card style={styles.rxCard}>
                <View style={styles.rxHeader}>
                  <View>
                    <Text style={styles.patientName}>{rx.patientName}</Text>
                    <Text style={styles.rxMeta}>
                      Prescribed by Dr. {rx.doctorName} • Rx #{rx.id}
                    </Text>
                  </View>
                  <StatusBadge status={rx.status || 'pending'} type="badge" />
                </View>

                {/* Medicine items */}
                <View style={styles.medsBox}>
                  {rx.medicines?.map((m, idx) => (
                    <View key={idx} style={styles.medRow}>
                      <Ionicons name="tablet-portrait" size={14} color={COLORS.hospitalTeal} />
                      <Text style={styles.medText}>
                        {m.name} ({m.dosage}) — {m.frequency} x {m.duration}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Dispense Action */}
                <View style={styles.dispenseRow}>
                  <Button
                    title={isDispensed ? 'Dispensed & Logged' : 'Verify & Dispense'}
                    variant={isDispensed ? 'outline' : 'primary'}
                    size="small"
                    icon={isDispensed ? 'checkmark-circle' : 'bag-check-outline'}
                    disabled={isDispensed}
                    onPress={() => handleDispense(rx)}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Medicine Inventory List */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 8 }}>
          <Text style={styles.sectionHeading}>STOCK FORMULARY & AUDIT ({localMeds.length})</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Bulk Scan', 'Ready to scan new carton barcode into Central Medical Depot.')}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.hospitalBlue }}>+ Scan Inward Carton</Text>
          </TouchableOpacity>
        </View>

        {localMeds.map((med) => (
          <View key={med.id} style={{ marginBottom: 8 }}>
            <MedicineCard
              medicine={med}
              onDispense={() => handleRestock(med)}
            />
          </View>
        ))}

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
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  rxCard: {
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  rxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  rxMeta: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  medsBox: {
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },
  dispenseRow: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
});
