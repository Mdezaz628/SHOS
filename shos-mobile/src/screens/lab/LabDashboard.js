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
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useHospitalData } from '../../context/HospitalDataContext';

export const LabDashboard = ({ navigation }) => {
  const { labOrders, completeLabOrder } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);

  // Result Entry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [param1, setParam1] = useState('14.2');
  const [param2, setParam2] = useState('2.4');
  const [param3, setParam3] = useState('7800');
  const [resultFindings, setResultFindings] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('Dr. R. K. Sen (NABL Pathologist)');
  const [workloadFilter, setWorkloadFilter] = useState('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const inProgress = (labOrders || []).filter((l) => l.status === 'in_progress').length;
  const completed = (labOrders || []).filter((l) => l.status === 'completed').length;
  const critical = (labOrders || []).filter((l) => l.priority === 'urgent' || l.priority === 'high' || l.priority === 'critical').length || 1;

  const handleOpenResultEntry = (order) => {
    setSelectedOrder(order);
    if (order.testName?.toLowerCase().includes('cardiac') || order.testName?.toLowerCase().includes('troponin')) {
      setParam1('0.02');
      setParam2('128');
      setParam3('92');
      setResultFindings('Troponin-I: 0.02 ng/mL (Normal < 0.04)\nCK-MB: 18 U/L (Normal < 25)\nNo acute myocardial infarction patterns observed.');
    } else if (order.testName?.toLowerCase().includes('glucose') || order.testName?.toLowerCase().includes('sugar')) {
      setParam1('94');
      setParam2('132');
      setParam3('5.6');
      setResultFindings('Fasting Plasma Glucose: 94 mg/dL (Normal 70-100)\nPost-Prandial: 132 mg/dL (Normal < 140)\nHbA1c: 5.6% (Non-Diabetic Range).');
    } else {
      setParam1('14.2');
      setParam2('2.4');
      setParam3('7400');
      setResultFindings(order.result || 'Hemoglobin: 14.2 g/dL (Normal 13.0-17.0)\nWBC Count: 7,400 /mcL (Normal 4,000-11,000)\nPlatelets: 2.4 Lakh /mcL (Normal 1.5-4.5)');
    }
    setIsModalOpen(true);
  };

  const applyPresetValues = (type) => {
    if (type === 'normal') {
      setResultFindings('All bio-markers within standard biological reference intervals. Quantitative values calibrated against Bio-Rad controls.');
    } else if (type === 'critical') {
      setResultFindings('CRITICAL VALUE ALERT: Elevated levels observed. Immediate telephone intimation conveyed to attending ICU / ER physician.');
    }
  };

  const handleSaveResult = () => {
    if (selectedOrder) {
      completeLabOrder(selectedOrder.id, resultFindings);
      setIsModalOpen(false);
      Alert.alert(
        'Diagnostic Result Published',
        `Validated results for ${selectedOrder.testName} signed by ${verifiedBy} and transmitted to Patient EHR & Attending Doctor.`
      );
    }
  };

  const filteredOrders = (labOrders || []).filter((order) => {
    if (workloadFilter === 'all') return true;
    if (workloadFilter === 'due') return order.status === 'in_progress';
    if (workloadFilter === 'completed') return order.status === 'completed';
    if (workloadFilter === 'critical') return order.priority === 'urgent' || order.priority === 'high' || order.priority === 'critical';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Pathology & Diagnostics Desk"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header Stats (Touch to filter) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.sectionHeading}>LAB DIAGNOSTIC WORKLOAD</Text>
          <Text style={{ fontSize: 11, color: COLORS.hospitalBlue, fontWeight: '600' }}>Tap card to filter</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Samples Due"
            value={inProgress.toString()}
            change={workloadFilter === 'due' ? '● Active Filter' : 'In Testing'}
            changeType="neutral"
            icon="flask"
            color={COLORS.warning}
            onPress={() => setWorkloadFilter(workloadFilter === 'due' ? 'all' : 'due')}
            style={workloadFilter === 'due' ? { borderColor: COLORS.warning, borderWidth: 2 } : null}
          />
          <StatCard
            label="Completed"
            value={completed.toString()}
            change={workloadFilter === 'completed' ? '● Active Filter' : 'Signed'}
            changeType="positive"
            icon="checkmark-done"
            color={COLORS.triageGreen}
            onPress={() => setWorkloadFilter(workloadFilter === 'completed' ? 'all' : 'completed')}
            style={workloadFilter === 'completed' ? { borderColor: COLORS.triageGreen, borderWidth: 2 } : null}
          />
          <StatCard
            label="STAT / Critical"
            value={critical.toString()}
            change={workloadFilter === 'critical' ? '● Active Filter' : 'Priority'}
            changeType="negative"
            icon="alert-circle"
            color={COLORS.triageRed}
            onPress={() => setWorkloadFilter(workloadFilter === 'critical' ? 'all' : 'critical')}
            style={workloadFilter === 'critical' ? { borderColor: COLORS.triageRed, borderWidth: 2 } : null}
          />
          <StatCard
            label="NABL Audit"
            value="100%"
            change="Compliant"
            changeType="positive"
            icon="shield-checkmark"
            color={COLORS.hospitalBlue}
            onPress={() => Alert.alert('NABL Accreditation', 'Laboratory operational under NABL ISO-15189 compliance standards.')}
          />
        </View>

        {/* STAT Critical Emergency Blood Alerts */}
        <View style={styles.statAlertBanner}>
          <View style={styles.statIconWrap}>
            <Ionicons name="flash" size={18} color={COLORS.triageRed} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statAlertTitle}>🚨 STAT EMERGENCY SAMPLES IN INCUBATOR</Text>
            <Text style={styles.statAlertDesc}>
              SMP-LB-104 (Troponin-I • ICU Bed 4) • Target TAT: &lt; 25 mins • High priority centrifuge
            </Text>
          </View>
        </View>

        {/* Lab Orders Queue with Touch to Open */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View>
            <Text style={styles.sectionHeading}>SAMPLE REQUISITIONS & PATIENTS ({filteredOrders.length})</Text>
            <Text style={{ fontSize: 11, color: COLORS.slate }}>Tap any card to enter findings and dispatch reports</Text>
          </View>
          {workloadFilter !== 'all' && (
            <TouchableOpacity onPress={() => setWorkloadFilter('all')}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.hospitalBlue }}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredOrders.map((order) => {
          const isDone = order.status === 'completed';

          return (
            <TouchableOpacity
              key={order.id}
              activeOpacity={0.8}
              onPress={() => handleOpenResultEntry(order)}
            >
              <Card style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.testTitle}>{order.testName}</Text>
                    <Text style={[styles.orderMeta, { fontWeight: '800', color: COLORS.navy }]}>
                      Patient: {order.patientName || 'Clinical Patient'}
                    </Text>
                    <Text style={styles.orderMeta}>
                      Ordered By: {order.orderedBy || 'Attending Physician'}
                    </Text>
                  </View>
                  <PriorityBadge priority={order.priority || 'medium'} />
                </View>

                {/* Status & Barcode */}
                <View style={styles.barcodeRow}>
                  <View style={styles.barcodeWrap}>
                    <Ionicons name="barcode-outline" size={18} color={COLORS.slate} />
                    <Text style={styles.barcodeText}>SMP-{order.id}</Text>
                  </View>
                  <StatusBadge status={order.status} type="badge" />
                </View>

                {/* Findings preview if completed */}
                {isDone && (
                  <View style={styles.resultBox}>
                    <Text style={styles.resultLabel}>RECORDED FINDINGS:</Text>
                    <Text style={styles.resultText} numberOfLines={2}>
                      {order.result || 'Normal ranges observed across primary bio-markers.'}
                    </Text>
                  </View>
                )}

                {/* Action */}
                <View style={styles.actionRow}>
                  <Button
                    title={isDone ? 'Edit Findings' : 'Enter Results & Validate'}
                    variant={isDone ? 'outline' : 'primary'}
                    size="small"
                    icon="create-outline"
                    onPress={() => handleOpenResultEntry(order)}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Result Entry Modal */}
      <Modal
        visible={isModalOpen}
        title={`Diagnostic Entry: ${selectedOrder?.testName}`}
        onClose={() => setIsModalOpen(false)}
      >
        <Text style={styles.modalSub}>
          Patient: {selectedOrder?.patientName} • Requisition #{selectedOrder?.id}
        </Text>

        {/* Quick Reference Range Presets */}
        <View style={styles.presetChipRow}>
          <TouchableOpacity
            style={[styles.modalPresetChip, { borderColor: COLORS.triageGreen }]}
            onPress={() => applyPresetValues('normal')}
          >
            <Ionicons name="checkmark-circle" size={13} color={COLORS.triageGreen} />
            <Text style={[styles.modalPresetText, { color: COLORS.triageGreen }]}>Set Normal Ref</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalPresetChip, { borderColor: COLORS.triageRed }]}
            onPress={() => applyPresetValues('critical')}
          >
            <Ionicons name="alert-circle" size={13} color={COLORS.triageRed} />
            <Text style={[styles.modalPresetText, { color: COLORS.triageRed }]}>Flag STAT Critical</Text>
          </TouchableOpacity>
        </View>

        {/* Parameter 1 */}
        <View style={styles.paramInputBox}>
          <View style={styles.paramHeader}>
            <Text style={styles.paramLabel}>Primary Bio-Marker (Hemoglobin / Analyte)</Text>
            <Text style={styles.refRange}>Ref: 13.0 - 17.0 g/dL</Text>
          </View>
          <Input
            value={param1}
            onChangeText={setParam1}
            placeholder="e.g. 14.2"
          />
        </View>

        {/* Parameter 2 */}
        <View style={styles.paramInputBox}>
          <View style={styles.paramHeader}>
            <Text style={styles.paramLabel}>Secondary Bio-Marker (Platelets / Enzyme)</Text>
            <Text style={styles.refRange}>Ref: 1.5 - 4.5 Lakh</Text>
          </View>
          <Input
            value={param2}
            onChangeText={setParam2}
            placeholder="e.g. 2.4"
          />
        </View>

        {/* Quantitative Findings Text */}
        <Input
          label="Clinical Findings & Bio-marker Reference Report"
          value={resultFindings}
          onChangeText={setResultFindings}
          numberOfLines={4}
          multiline
        />

        <Input
          label="Certifying Pathologist / Digital Signature"
          value={verifiedBy}
          onChangeText={setVerifiedBy}
        />

        <View style={styles.nablBadgeBox}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.hospitalBlue} />
          <Text style={styles.nablBadgeText}>NABL ISO-15189 Certified Laboratory Sign-off</Text>
        </View>

        <Button
          title="Sign & Transmit to Patient EHR & Doctor"
          variant="primary"
          size="medium"
          icon="checkmark-done"
          onPress={handleSaveResult}
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
    marginBottom: 14,
  },
  statAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.triageRed}12`,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.triageRed,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    gap: 10,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statAlertTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.triageRed,
    letterSpacing: 0.5,
  },
  statAlertDesc: {
    fontSize: 11,
    color: COLORS.navy,
    marginTop: 2,
    lineHeight: 15,
  },
  orderCard: {
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalTeal,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  testTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  orderMeta: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  barcodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  barcodeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barcodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
  },
  resultBox: {
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
  },
  resultText: {
    fontSize: 12,
    color: COLORS.navy,
    marginTop: 2,
  },
  actionRow: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.slate,
    marginBottom: 10,
  },
  presetChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modalPresetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  modalPresetText: {
    fontSize: 11,
    fontWeight: '700',
  },
  paramInputBox: {
    marginBottom: 4,
  },
  paramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paramLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate,
  },
  refRange: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  nablBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 8,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  nablBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.navy,
  },
});
