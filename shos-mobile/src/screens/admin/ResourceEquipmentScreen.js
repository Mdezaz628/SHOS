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
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useHospitalData } from '../../context/HospitalDataContext';

export const ResourceEquipmentScreen = ({ navigation }) => {
  const {
    equipment,
    addEquipment,
    removeEquipment,
    updateEquipmentStatus,
    oxygenTelemetry,
    refillOxygen,
  } = useHospitalData();

  // Add Equipment Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('ICU / Critical Care');
  const [detail, setDetail] = useState('');
  const [reserve, setReserve] = useState('Standby Unit Available');

  const handleCreateEquipment = () => {
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Please enter asset equipment name.');
      return;
    }
    const created = addEquipment({
      name: name.trim(),
      department: department.trim(),
      detail: detail.trim() || 'Standard Medical Grade Equipment',
      reserve: reserve.trim(),
      status: 'optimal',
      icon: 'hardware-chip',
    });
    setIsAddModalOpen(false);
    setName('');
    setDetail('');
    Alert.alert('Asset Registered', `${created.name} registered into Central Biomedical Registry.`);
  };

  const handleDeleteEquipment = (item) => {
    Alert.alert(
      'Decommission Biomedical Asset',
      `Permanently remove ${item.name} from hospital asset inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decommission',
          style: 'destructive',
          onPress: () => {
            removeEquipment(item.id || item.name);
            Alert.alert('Asset Decommissioned', `${item.name} removed from active clinical fleet.`);
          },
        },
      ]
    );
  };

  const handleToggleStatus = (item) => {
    const nextStatusMap = {
      optimal: 'active',
      active: 'maintenance',
      maintenance: 'optimal',
    };
    const next = nextStatusMap[item.status] || 'active';
    updateEquipmentStatus(item.id || item.name, next);
    Alert.alert('Asset Status Changed', `${item.name} status updated to ${next.toUpperCase()}.`);
  };

  const handleRefillO2 = () => {
    refillOxygen(100);
    Alert.alert(
      'Cryogenic Tank Pressurized',
      'Central LMO Plant refilled to 100.0% (14.8 Bar). Continuous reserve restored to 77.0 hours.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Biomedical Assets & O2 Plant"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin Action Header */}
        <View style={styles.adminBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>CLINICAL ASSETS & O2 GOVERNANCE</Text>
            <Text style={styles.adminSub}>Add life-support machines, track calibrations & manage cryogenic plant.</Text>
          </View>
          <Button
            title="+ Add Asset"
            variant="primary"
            size="small"
            icon="add-circle"
            onPress={() => setIsAddModalOpen(true)}
          />
        </View>

        {/* Oxygen Plant Highlight & Refill Control */}
        <Card style={styles.oxygenCard}>
          <View style={styles.o2Header}>
            <View style={styles.o2IconWrap}>
              <Ionicons name="flask" size={24} color={COLORS.hospitalTeal} />
            </View>
            <View style={styles.o2Meta}>
              <Text style={styles.o2Title}>CENTRAL O2 CRYOGENIC TELEMETRY</Text>
              <Text style={styles.o2Val}>Tank Capacity: {oxygenTelemetry?.capacity || 94.2}%</Text>
              <Text style={styles.o2Sub}>
                {oxygenTelemetry?.autonomyHours || 72.4} Hours Continuous Autonomy at Current Hospital Flow
              </Text>
            </View>
          </View>

          <View style={styles.o2ControlRow}>
            <Button
              title="Refill Cryo Tank to 100%"
              variant="primary"
              size="small"
              icon="color-fill-outline"
              onPress={handleRefillO2}
            />
            <Button
              title="Calibrate Sensors"
              variant="outline"
              size="small"
              icon="speedometer-outline"
              onPress={() => Alert.alert('Sensor Diagnostics', 'Pressure transducers & purity analyzers verified: 99.4% medical grade O2.')}
            />
          </View>
        </Card>

        {/* Assets Directory */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>HIGH-CRITICALITY CLINICAL ASSETS ({equipment.length})</Text>
          <Text style={styles.hintText}>Tap buttons to toggle status or remove</Text>
        </View>

        {equipment.map((item) => (
          <Card key={item.id || item.name} style={styles.equipCard}>
            <View style={styles.equipRow}>
              <View style={styles.equipIcon}>
                <Ionicons name={item.icon || 'hardware-chip'} size={22} color={COLORS.hospitalBlue} />
              </View>
              <View style={styles.equipMeta}>
                <Text style={styles.equipTitle}>{item.name}</Text>
                <Text style={styles.equipDept}>{item.department || 'Biomedical Fleet'}</Text>
                <Text style={styles.equipDetail}>{item.detail}</Text>
                <Text style={styles.reserveText}>{item.reserve}</Text>
              </View>
              <StatusBadge status={item.status} type="badge" />
            </View>

            {/* Asset Actions */}
            <View style={styles.assetActionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: `${COLORS.hospitalBlue}15` }]}
                onPress={() => handleToggleStatus(item)}
              >
                <Ionicons name="sync-outline" size={14} color={COLORS.hospitalBlue} />
                <Text style={[styles.actionBtnText, { color: COLORS.hospitalBlue }]}>Change Status</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: `${COLORS.warning}15` }]}
                onPress={() => Alert.alert('Calibration Logged', `Calibration audit logged for ${item.name}. Technician assigned.`)}
              >
                <Ionicons name="build-outline" size={14} color={COLORS.warning} />
                <Text style={[styles.actionBtnText, { color: COLORS.warning }]}>Service Log</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: `${COLORS.triageRed}15` }]}
                onPress={() => handleDeleteEquipment(item)}
              >
                <Ionicons name="trash-outline" size={14} color={COLORS.triageRed} />
                <Text style={[styles.actionBtnText, { color: COLORS.triageRed }]}>Decommission</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add Equipment Modal */}
      <Modal
        visible={isAddModalOpen}
        title="Register Biomedical / Clinical Asset"
        onClose={() => setIsAddModalOpen(false)}
      >
        <Input
          label="Equipment Name / Model *"
          placeholder="e.g. Philips ECMO Machine or Portable X-Ray"
          value={name}
          onChangeText={setName}
          leftIcon="hardware-chip-outline"
        />

        <Input
          label="Department / Ward"
          placeholder="e.g. Critical Care ICU"
          value={department}
          onChangeText={setDepartment}
          leftIcon="business-outline"
        />

        <Input
          label="Technical Specifications & Serial"
          placeholder="e.g. 230V • 50Hz • Serial #PH-ECMO-902"
          value={detail}
          onChangeText={setDetail}
        />

        <Input
          label="Operational Reserve Status"
          placeholder="e.g. 1 Active • 1 Standby"
          value={reserve}
          onChangeText={setReserve}
        />

        <Button
          title="Register Asset in System"
          variant="primary"
          size="medium"
          icon="add-circle"
          onPress={handleCreateEquipment}
          style={{ marginTop: 10 }}
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
  adminBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.offWhite,
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  adminTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 0.5,
  },
  adminSub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  oxygenCard: {
    backgroundColor: COLORS.tealLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalTeal,
    marginBottom: 16,
  },
  o2Header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  o2IconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  o2Meta: {
    flex: 1,
  },
  o2Title: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  o2Val: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
    marginTop: 2,
  },
  o2Sub: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  o2ControlRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(13,148,136,0.2)',
    paddingTop: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 10,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
  },
  equipCard: {
    marginBottom: 12,
    padding: 14,
  },
  equipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipMeta: {
    flex: 1,
  },
  equipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  equipDept: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    marginTop: 1,
  },
  equipDetail: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  reserveText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalTeal,
    marginTop: 2,
  },
  assetActionRow: {
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
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ResourceEquipmentScreen;
