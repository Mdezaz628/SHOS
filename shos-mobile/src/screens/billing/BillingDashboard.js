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
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const BillingDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { bills } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);
  const [localBills, setLocalBills] = useState(Array.isArray(bills) ? bills : []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const pendingCount = (Array.isArray(localBills) ? localBills : []).filter((b) => b.paymentStatus === 'unpaid').length;

  const handleSettle = (bill) => {
    Alert.alert(
      'Settle Invoice',
      `Confirm receipt of ₹${bill.amount?.toLocaleString('en-IN')} from ${bill.patientName} via Cash / POS Card Machine?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Settle',
          onPress: () => {
            setLocalBills((prev) =>
              prev.map((b) => (b.id === bill.id ? { ...b, paymentStatus: 'paid' } : b))
            );
            Alert.alert('Payment Settled', `Invoice #${bill.id} marked as PAID. Official receipt issued.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Revenue & TPA Desk"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Desk Header */}
        <View style={styles.deskHeader}>
          <Text style={styles.deskLabel}>CENTRAL REVENUE & INSURANCE COUNTER</Text>
          <Text style={styles.officerName}>{currentUser?.name || 'Kavita Verma'}</Text>
          <Text style={styles.deskMeta}>Cashier Counter 3 • TPA Pre-Authorization & GST Invoicing</Text>
        </View>

        {/* Phase 23 Stats */}
        <Text style={styles.sectionHeading}>FINANCIAL SUMMARY</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Today's Intake"
            value="₹3.45L"
            change="+12% Today"
            changeType="positive"
            icon="wallet"
            color={COLORS.triageGreen}
          />
          <StatCard
            label="Pending Invoices"
            value={pendingCount.toString()}
            change="Awaiting Pay"
            changeType="warning"
            icon="receipt"
            color={COLORS.warning}
          />
          <StatCard
            label="TPA Claims"
            value="8 Active"
            change="Star / HDFC"
            changeType="neutral"
            icon="shield-checkmark"
            color={COLORS.hospitalBlue}
          />
          <StatCard
            label="GST Invoices"
            value="42"
            change="Compliant"
            changeType="positive"
            icon="document-text"
            color={COLORS.hospitalTeal}
          />
        </View>

        {/* Invoices List */}
        <Text style={styles.sectionHeading}>INVOICE QUEUE ({localBills.length})</Text>

        {(Array.isArray(localBills) ? localBills : []).map((bill) => {
          const isPaid = bill.paymentStatus === 'paid';

          return (
            <Card key={bill.id} style={styles.billCard}>
              <View style={styles.billHeader}>
                <View>
                  <Text style={styles.patientName}>{bill.patientName}</Text>
                  <Text style={styles.billMeta}>
                    Invoice #{bill.id} • {bill.department || 'Cardiology OPD'}
                  </Text>
                </View>
                <StatusBadge status={isPaid ? 'paid' : 'pending'} type="badge" />
              </View>

              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Total Net Payable:</Text>
                <Text style={styles.amountVal}>₹{bill.amount?.toLocaleString('en-IN') || '4,250'}</Text>
              </View>

              <View style={styles.actionRow}>
                {!isPaid ? (
                  <Button
                    title="Accept Payment & Settle"
                    variant="primary"
                    size="small"
                    icon="cash-outline"
                    onPress={() => handleSettle(bill)}
                  />
                ) : (
                  <Button
                    title="Print GST Receipt"
                    variant="outline"
                    size="small"
                    icon="print-outline"
                    onPress={() => Alert.alert('Printing', 'GST Tax Invoice dispatched to Thermal POS printer.')}
                  />
                )}
              </View>
            </Card>
          );
        })}

        {/* Quick Billing Action Bar */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <Button
            title="TPA Insurance Desk"
            variant="outline"
            size="small"
            icon="shield-checkmark"
            onPress={() => navigation.navigate('InsuranceTpa')}
            style={{ flex: 1 }}
          />
          <Button
            title="Fast POS Invoice"
            variant="primary"
            size="small"
            icon="receipt"
            onPress={() =>
              Alert.alert(
                'Generate Instant Invoice',
                'OPD Consultation Fee: ₹800 + Pharmacy: ₹450 = ₹1,250 Total.\nReady for UPI / Card swipe.'
              )
            }
            style={{ flex: 1 }}
          />
        </View>

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
  deskHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  deskLabel: {
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
  deskMeta: {
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
  billCard: {
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  billHeader: {
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
  billMeta: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 2,
  },
  amountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 13,
    color: COLORS.navy,
    fontWeight: '600',
  },
  amountVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.hospitalBlue,
  },
  actionRow: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
});
