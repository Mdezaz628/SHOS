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

export const InsuranceTpaScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClaim, setNewClaim] = useState({
    patientName: '',
    policyNumber: '',
    provider: 'Star Health & Allied Insurance',
    estimatedAmount: '',
  });

  const [claims, setClaims] = useState([
    {
      id: 'TPA-2026-9041',
      patientName: 'Rahul Sharma',
      uhid: 'SHOS-2026-8942',
      provider: 'Star Health & Allied Insurance',
      policyNo: 'STAR-IND-9021448',
      requestedAmount: 3500,
      approvedAmount: 2500,
      status: 'approved',
      timestamp: 'Today, 09:30 AM',
      remarks: 'Pre-auth cashless approved for Inpatient Daycare & Cardiology Labs.',
    },
    {
      id: 'TPA-2026-9042',
      patientName: 'K. S. Verma',
      uhid: 'SHOS-2026-4421',
      provider: 'HDFC ERGO Health',
      policyNo: 'HDFC-MED-771890',
      requestedAmount: 18000,
      approvedAmount: 15000,
      status: 'approved',
      timestamp: 'Today, 10:15 AM',
      remarks: 'Cardiac ICU 48-hr observation pre-auth processed.',
    },
    {
      id: 'TPA-2026-9043',
      patientName: 'Farida Bano',
      uhid: 'SHOS-2026-1189',
      provider: 'ICICI Lombard Health',
      policyNo: 'ICICI-GRP-66291',
      requestedAmount: 8500,
      approvedAmount: 0,
      status: 'pending',
      timestamp: 'Today, 11:40 AM',
      remarks: 'Awaiting initial clinical history notes from attending consultant.',
    },
    {
      id: 'TPA-2026-9044',
      patientName: 'Gopal S.',
      uhid: 'SHOS-2026-8820',
      provider: 'Care Health Insurance',
      policyNo: 'CARE-IND-339011',
      requestedAmount: 12000,
      approvedAmount: 12000,
      status: 'settled',
      timestamp: 'Yesterday',
      remarks: 'Full cashless settlement completed with accounts department.',
    },
  ]);

  const filteredClaims = claims.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const handleCreateClaim = () => {
    if (!newClaim.patientName || !newClaim.policyNumber || !newClaim.estimatedAmount) {
      Alert.alert('Required Fields', 'Please complete all claim requisition fields.');
      return;
    }

    const created = {
      id: `TPA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newClaim.patientName,
      uhid: `SHOS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      provider: newClaim.provider,
      policyNo: newClaim.policyNumber,
      requestedAmount: parseFloat(newClaim.estimatedAmount),
      approvedAmount: Math.round(parseFloat(newClaim.estimatedAmount) * 0.85),
      status: 'approved',
      timestamp: 'Just now',
      remarks: 'Instant pre-authorization dispatched to insurer portal.',
    };

    setClaims((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewClaim({
      patientName: '',
      policyNumber: '',
      provider: 'Star Health & Allied Insurance',
      estimatedAmount: '',
    });
    Alert.alert('Pre-Auth Submitted', `Claim #${created.id} submitted for ${created.patientName}. Pre-authorized: ₹${created.approvedAmount}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Insurance TPA Desk"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Desk Header Banner */}
        <View style={styles.banner}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.hospitalTeal} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Cashless TPA Claim Settlement</Text>
            <Text style={styles.bannerSub}>
              Direct integration with Star Health, HDFC ERGO, ICICI Lombard & Care Health for instant cashless patient discharge.
            </Text>
          </View>
        </View>

        {/* Status Filters */}
        <View style={styles.filterRow}>
          {['all', 'approved', 'pending', 'settled'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeading}>ACTIVE TPA CLAIMS ({filteredClaims.length})</Text>

        {filteredClaims.map((claim) => (
          <Card key={claim.id} style={styles.claimCard}>
            <View style={styles.claimHeader}>
              <View>
                <Text style={styles.patientName}>{claim.patientName}</Text>
                <Text style={styles.claimMeta}>
                  {claim.provider} • Policy: {claim.policyNo}
                </Text>
              </View>
              <StatusBadge status={claim.status} type="badge" />
            </View>

            <View style={styles.amountGrid}>
              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Requested</Text>
                <Text style={styles.amountNum}>₹{claim.requestedAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.amountBox, { backgroundColor: '#F0FDF4' }]}>
                <Text style={[styles.amountLabel, { color: COLORS.hospitalTeal }]}>Pre-Auth Approved</Text>
                <Text style={[styles.amountNum, { color: COLORS.hospitalTeal }]}>
                  ₹{claim.approvedAmount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <Text style={styles.remarksText}>{claim.remarks}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.timestampText}>{claim.timestamp}</Text>
              {claim.status === 'approved' && (
                <Button
                  title="Settle Cashless"
                  variant="primary"
                  size="small"
                  icon="checkmark-done"
                  onPress={() => {
                    setClaims((prev) =>
                      prev.map((c) => (c.id === claim.id ? { ...c, status: 'settled' } : c))
                    );
                    Alert.alert('Cashless Settled', `Claim #${claim.id} settled with hospital revenue desk.`);
                  }}
                />
              )}
            </View>
          </Card>
        ))}

        {/* New Claim Button */}
        <Button
          title="Submit New TPA Pre-Auth"
          variant="primary"
          size="large"
          icon="add-circle-outline"
          onPress={() => setIsModalOpen(true)}
          style={{ width: '100%', marginTop: 12, marginBottom: 24 }}
        />
      </ScrollView>

      {/* New Claim Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New TPA Pre-Authorization</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={22} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            <Input
              label="Patient Full Name *"
              placeholder="e.g. Ramesh Chandra"
              value={newClaim.patientName}
              onChangeText={(t) => setNewClaim((p) => ({ ...p, patientName: t }))}
            />

            <Input
              label="Health Insurance Policy Number *"
              placeholder="e.g. STAR-IND-881920"
              value={newClaim.policyNumber}
              onChangeText={(t) => setNewClaim((p) => ({ ...p, policyNumber: t }))}
            />

            <Input
              label="Estimated Clinical Expense (₹) *"
              placeholder="e.g. 15000"
              value={newClaim.estimatedAmount}
              onChangeText={(t) => setNewClaim((p) => ({ ...p, estimatedAmount: t }))}
              keyboardType="numeric"
            />

            <Button
              title="Submit to Insurer Portal"
              variant="primary"
              size="large"
              icon="send"
              onPress={handleCreateClaim}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  bannerSub: {
    fontSize: 11,
    color: COLORS.navy,
    lineHeight: 15,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.navy,
  },
  filterTextActive: {
    color: COLORS.cardBg,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  claimCard: {
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalTeal,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.navy,
  },
  claimMeta: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  amountGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  amountBox: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
  },
  amountLabel: {
    fontSize: 10,
    color: COLORS.slate,
    fontWeight: '600',
  },
  amountNum: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
    marginTop: 2,
  },
  remarksText: {
    fontSize: 12,
    color: COLORS.navy,
    backgroundColor: COLORS.offWhite,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  timestampText: {
    fontSize: 11,
    color: COLORS.slate,
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
