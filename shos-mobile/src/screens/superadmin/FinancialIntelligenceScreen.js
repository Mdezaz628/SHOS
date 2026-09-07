// Super Admin Financial Intelligence & Enterprise Oversight Screen
// Ported from shos-web/src/pages/superadmin/FinancialIntelligenceView.jsx

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

export const FinancialIntelligenceScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Month to Date');
  const [txFilter, setTxFilter] = useState('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const periods = ['Today (Live)', 'This Week', 'Month to Date', 'Fiscal Q3'];

  const metrics = {
    grossRevenue: '₹ 1,70,400',
    insurancePayout: '₹ 1,48,250',
    netSettled: '₹ 1,53,400',
    outOfPocket: '₹ 22,150',
    averageTicket: '₹ 42,600',
    totalReceipts: '142 Audited',
  };

  const departments = [
    { name: 'Emergency & Trauma ICU', revenue: '₹ 1,45,000', percentage: 85, color: COLORS.triageRed },
    { name: 'Cardiology & Cath Lab', revenue: '₹ 20,750', percentage: 12, color: COLORS.hospitalBlue },
    { name: 'Central Pharmacy Depot', revenue: '₹ 12,400', percentage: 7, color: COLORS.hospitalTeal },
    { name: 'Radiology & Imaging', revenue: '₹ 8,900', percentage: 5, color: '#8B5CF6' },
    { name: 'General Medicine OPD', revenue: '₹ 2,800', percentage: 2, color: COLORS.triageGreen },
    { name: 'Pulmonology Clinic', revenue: '₹ 1,850', percentage: 1, color: COLORS.warning },
  ];

  const paymentModes = [
    { name: 'Cashless TPA / Insurance', amount: '₹ 1,48,250', share: '87.0%', icon: 'shield-checkmark', color: COLORS.hospitalBlue },
    { name: 'UPI & Instant QR', amount: '₹ 18,000', share: '10.6%', icon: 'qr-code', color: COLORS.triageGreen },
    { name: 'Credit / Debit POS Terminal', amount: '₹ 2,800', share: '1.6%', icon: 'card', color: '#8B5CF6' },
    { name: 'Cash Counter OPD', amount: '₹ 1,350', share: '0.8%', icon: 'cash', color: COLORS.warning },
  ];

  const transactions = [
    {
      id: 'TXN-2026-9901',
      patient: 'Vikramaditya Sengupta',
      dept: 'Emergency & ICU',
      mode: 'Cashless TPA',
      insurer: 'Star Health (Pre-Auth)',
      amount: '₹ 1,25,000',
      status: 'SETTLED',
      time: 'Today, 09:15 AM',
    },
    {
      id: 'TXN-2026-9902',
      patient: 'Pooja Verma',
      dept: 'Cardiology',
      mode: 'UPI (GPay)',
      insurer: 'Self Pay (OPD)',
      amount: '₹ 1,200',
      status: 'SETTLED',
      time: 'Today, 10:20 AM',
    },
    {
      id: 'TXN-2026-9903',
      patient: 'Rahul Nair',
      dept: 'Central Pharmacy',
      mode: 'Cashless TPA',
      insurer: 'HDFC ERGO',
      amount: '₹ 23,250',
      status: 'CLEARED',
      time: 'Today, 11:05 AM',
    },
    {
      id: 'TXN-2026-9904',
      patient: 'Meenakshi Sundaram',
      dept: 'Radiology MRI',
      mode: 'Credit Card POS',
      insurer: 'Self Pay',
      amount: '₹ 8,500',
      status: 'SETTLED',
      time: 'Today, 11:45 AM',
    },
    {
      id: 'TXN-2026-9905',
      patient: 'Amitav Ghosh',
      dept: 'Pulmonology',
      mode: 'Cash Counter',
      insurer: 'Direct OPD',
      amount: '₹ 850',
      status: 'SETTLED',
      time: 'Today, 12:10 PM',
    },
  ];

  const filteredTx = transactions.filter((tx) => {
    if (txFilter === 'all') return true;
    if (txFilter === 'tpa') return tx.mode.includes('TPA');
    if (txFilter === 'upi') return tx.mode.includes('UPI');
    if (txFilter === 'cash') return tx.mode.includes('Cash') || tx.mode.includes('Card');
    return true;
  });

  const handleExportAudit = () => {
    Alert.alert(
      'Enterprise Audit Pack Generated',
      'Financial Intelligence Ledger (NABH & GST Audit Compliant) compiled for MTD.\n\n• Gross Revenue: ₹1,70,400\n• TPA Settled: ₹1,48,250\n• 0% Healthcare GST Exemption Logged\n\nPDF & CSV dispatched to Chief Financial Officer.',
      [{ text: 'Dismiss' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Apex Financial Intelligence"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Subtitle Banner */}
        <View style={styles.overviewBanner}>
          <View style={styles.bannerIconWrap}>
            <Ionicons name="bar-chart" size={24} color={COLORS.hospitalBlue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>ENTERPRISE REVENUE & EBIT AUDIT</Text>
            <Text style={styles.bannerSubtitle}>
              Multi-department EBIT, cashless insurance recovery, and GST reconciliation
            </Text>
          </View>
        </View>

        {/* Period Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
          {periods.map((p) => {
            const isSelected = selectedPeriod === p;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.periodChip, isSelected && styles.periodChipActive]}
                onPress={() => setSelectedPeriod(p)}
              >
                <Text style={[styles.periodChipText, isSelected && styles.periodChipTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Executive 4 Metrics Grid */}
        <Text style={styles.sectionHeading}>EXECUTIVE REVENUE OVERVIEW</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Gross Revenue"
            value={metrics.grossRevenue}
            change="↑ 14.8% vs last cycle"
            changeType="positive"
            icon="cash"
            color={COLORS.triageGreen}
          />
          <StatCard
            label="Insurance / TPA"
            value={metrics.insurancePayout}
            change="87% Cashless Share"
            changeType="positive"
            icon="shield-checkmark"
            color={COLORS.hospitalBlue}
          />
          <StatCard
            label="Net Settled"
            value={metrics.netSettled}
            change="90.1% Realized"
            changeType="positive"
            icon="wallet"
            color={COLORS.navy}
          />
          <StatCard
            label="Avg Ticket Size"
            value={metrics.averageTicket}
            change="Per Patient Stay"
            changeType="neutral"
            icon="analytics"
            color="#8B5CF6"
          />
        </View>

        {/* Department Revenue & EBIT Contribution */}
        <Text style={styles.sectionHeading}>DEPARTMENT REVENUE DISTRIBUTION (EBIT)</Text>
        <Card style={styles.deptCard}>
          {departments.map((dept, idx) => (
            <View key={dept.name} style={[styles.deptRow, idx !== departments.length - 1 && styles.deptBorder]}>
              <View style={styles.deptHeader}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptRevenue}>{dept.revenue}</Text>
              </View>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${dept.percentage}%`,
                      backgroundColor: dept.color,
                    },
                  ]}
                />
              </View>
              <View style={styles.deptFooter}>
                <Text style={styles.deptShareText}>{dept.percentage}% of total revenue</Text>
                <Text style={[styles.deptMarginText, { color: dept.color }]}>Operating Margin: Optimal</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Payment Modes Breakdown */}
        <Text style={styles.sectionHeading}>PAYMENT MODES & TPA CHANNEL BREAKDOWN</Text>
        <Card style={styles.modesCard}>
          {paymentModes.map((mode, idx) => (
            <View key={mode.name} style={[styles.modeRow, idx !== paymentModes.length - 1 && styles.modeBorder]}>
              <View style={[styles.modeIconWrap, { backgroundColor: `${mode.color}15` }]}>
                <Ionicons name={mode.icon} size={20} color={mode.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeSub}>Settlement SLA: T+1 Banking Day</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.modeAmount}>{mode.amount}</Text>
                <Text style={[styles.modeShare, { color: mode.color }]}>{mode.share}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Healthcare GST & Statutory Audit Banner */}
        <Text style={styles.sectionHeading}>STATUTORY & GST TAX RECONCILIATION</Text>
        <Card style={styles.taxCard}>
          <View style={styles.taxHeader}>
            <Ionicons name="receipt-outline" size={20} color={COLORS.hospitalBlue} />
            <Text style={styles.taxTitle}>Notification No. 12/2017-Central Tax (Rate)</Text>
          </View>
          <Text style={styles.taxBody}>
            Clinical healthcare diagnostics and inpatient treatment services are strictly exempt from GST.
            Pharmacy OTC medications billed under 5% healthcare GST slab. All e-invoices reconciled with GSTIN portal.
          </Text>
          <View style={styles.taxBadgeRow}>
            <View style={styles.taxBadge}>
              <Text style={styles.taxBadgeText}>GSTIN: 29AAACH8920K1ZX</Text>
            </View>
            <View style={[styles.taxBadge, { backgroundColor: `${COLORS.triageGreen}15` }]}>
              <Text style={[styles.taxBadgeText, { color: COLORS.triageGreen }]}>100% COMPLIANT</Text>
            </View>
          </View>
        </Card>

        {/* Audited Transactions Ledger */}
        <View style={styles.ledgerHeader}>
          <Text style={styles.sectionHeading}>AUDITED TRANSACTIONS LEDGER</Text>
          <View style={styles.filterPillsRow}>
            {[
              { label: 'All', key: 'all' },
              { label: 'TPA', key: 'tpa' },
              { label: 'UPI', key: 'upi' },
              { label: 'Cash/POS', key: 'cash' },
            ].map((f) => {
              const active = txFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.miniPill, active && styles.miniPillActive]}
                  onPress={() => setTxFilter(f.key)}
                >
                  <Text style={[styles.miniPillText, active && styles.miniPillTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {filteredTx.map((tx) => (
          <Card key={tx.id} style={styles.txCard}>
            <View style={styles.txTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.txPatient}>{tx.patient}</Text>
                <Text style={styles.txDept}>{tx.dept} • {tx.insurer}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.txAmount}>{tx.amount}</Text>
                <View style={styles.settledBadge}>
                  <Text style={styles.settledText}>{tx.status}</Text>
                </View>
              </View>
            </View>
            <View style={styles.txBottomRow}>
              <Text style={styles.txId}>{tx.id}</Text>
              <Text style={styles.txTime}>{tx.time}</Text>
            </View>
          </Card>
        ))}

        {/* Action Button */}
        <Button
          title="Export Statutory & Financial Audit Pack"
          variant="primary"
          size="large"
          icon="download-outline"
          onPress={handleExportAudit}
          style={{ marginTop: 16 }}
        />

        <View style={{ height: 40 }} />
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
  overviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    gap: 12,
  },
  bannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  bannerSubtitle: {
    fontSize: 11,
    color: COLORS.navy,
    marginTop: 2,
    lineHeight: 15,
  },
  periodScroll: {
    marginBottom: 14,
  },
  periodChip: {
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  periodChipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  periodChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
  },
  periodChipTextActive: {
    color: COLORS.cardBg,
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
  deptCard: {
    padding: 14,
    marginBottom: 16,
  },
  deptRow: {
    paddingVertical: 10,
  },
  deptBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  deptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  deptName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  deptRevenue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  barBg: {
    height: 8,
    backgroundColor: COLORS.offWhite,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  deptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  deptShareText: {
    fontSize: 10,
    color: COLORS.slate,
  },
  deptMarginText: {
    fontSize: 10,
    fontWeight: '700',
  },
  modesCard: {
    padding: 14,
    marginBottom: 16,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  modeBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  modeSub: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 1,
  },
  modeAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  modeShare: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  taxCard: {
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hospitalBlue,
  },
  taxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  taxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  taxBody: {
    fontSize: 11,
    color: COLORS.slate,
    lineHeight: 16,
    marginBottom: 10,
  },
  taxBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  taxBadge: {
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taxBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate,
    fontFamily: 'monospace',
  },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.offWhite,
  },
  miniPillActive: {
    backgroundColor: COLORS.hospitalBlue,
  },
  miniPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate,
  },
  miniPillTextActive: {
    color: COLORS.cardBg,
  },
  txCard: {
    padding: 12,
    marginBottom: 8,
  },
  txTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  txPatient: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
  },
  txDept: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.triageGreen,
  },
  settledBadge: {
    backgroundColor: `${COLORS.triageGreen}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  settledText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.triageGreen,
  },
  txBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 6,
  },
  txId: {
    fontSize: 10,
    color: COLORS.slate,
    fontFamily: 'monospace',
  },
  txTime: {
    fontSize: 10,
    color: COLORS.slate,
  },
});
