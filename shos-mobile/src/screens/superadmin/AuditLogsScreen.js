import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

export const AuditLogsScreen = ({ navigation }) => {
  const auditLogs = [
    { id: 'LOG-8941', user: 'Dr. Vikram Malhotra', action: 'Accessed Patient Clinical EHR (UHID: SHOS-2026-8942)', timestamp: '06 Sep 2026, 01:24:10', ip: '10.0.4.22 (OPD-204)' },
    { id: 'LOG-8940', user: 'Sister Priya Nair', action: 'Recorded Bedside Vitals (Ward A - Bed 04)', timestamp: '06 Sep 2026, 01:18:45', ip: '10.0.12.8 (Ward Tablet)' },
    { id: 'LOG-8939', user: 'Dr. Rajiv Grover', action: 'Approved AI Resource Allocation Recommendation #REC-001', timestamp: '06 Sep 2026, 01:05:12', ip: '10.0.1.1 (Admin Suite)' },
    { id: 'LOG-8938', user: 'Sunil Mehta (Pharmacy)', action: 'Dispensed Prescription #RX-102 (Atorvastatin 20mg)', timestamp: '06 Sep 2026, 00:54:33', ip: '10.0.6.14 (Dispensary)' },
    { id: 'LOG-8937', user: 'Kavita Verma (Billing)', action: 'Generated Tax Invoice #INV-2026-084', timestamp: '06 Sep 2026, 00:41:20', ip: '10.0.8.5 (Billing POS)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Electronic Audit Trail"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.complianceBox}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.hospitalTeal} />
          <Text style={styles.complianceText}>
            Immutable audit logging enabled under NABH 5th Edition & ISO 27799 EHR Standards.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>SYSTEM AUDIT TRAIL ({auditLogs.length})</Text>

        {auditLogs.map((log) => (
          <Card key={log.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <Text style={styles.logId}>{log.id}</Text>
              <Text style={styles.logTime}>{log.timestamp}</Text>
            </View>
            <Text style={styles.logUser}>{log.user}</Text>
            <Text style={styles.logAction}>{log.action}</Text>
            <Text style={styles.logIp}>IP / Device: {log.ip}</Text>
          </Card>
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
  complianceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  complianceText: {
    fontSize: 11,
    color: COLORS.hospitalBlue,
    flex: 1,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  logCard: {
    marginBottom: 10,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logId: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
  logTime: {
    fontSize: 11,
    color: COLORS.slate,
  },
  logUser: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navy,
  },
  logAction: {
    fontSize: 12,
    color: COLORS.navyLight,
    marginTop: 2,
    lineHeight: 16,
  },
  logIp: {
    fontSize: 10,
    color: COLORS.slate,
    marginTop: 6,
    fontFamily: 'monospace',
  },
});
