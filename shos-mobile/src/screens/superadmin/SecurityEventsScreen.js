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
import { PriorityBadge } from '../../components/common/PriorityBadge';

export const SecurityEventsScreen = ({ navigation }) => {
  const events = [
    { id: 'SEC-109', type: 'Abnormal Off-Hours Login Blocked', severity: 'critical', desc: '3 failed password attempts for account nurse@shos.hospital from unauthorized external IP 185.220.101.5', time: '06 Sep 2026, 01:12:00', status: 'Blocked by WAF' },
    { id: 'SEC-108', type: 'EHR Export Request Audited', severity: 'medium', desc: 'Bulk lab reports export requested by Doctor Terminal DOC-001. 2FA verification verified.', time: '05 Sep 2026, 22:45:12', status: 'Authorized' },
    { id: 'SEC-107', type: 'TLS Certificate Auto-Renewal', severity: 'low', desc: 'Zero-downtime renewal of mTLS wildcard cert *.shos.hospital via Let\'s Encrypt Enterprise.', time: '05 Sep 2026, 18:00:00', status: 'Success' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Security & SIEM Surveillance"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>SECURITY INCIDENTS & ACCESS TELEMETRY</Text>

        {events.map((ev) => (
          <Card key={ev.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <View style={styles.titleWrap}>
                <Text style={styles.eventTitle}>{ev.type}</Text>
                <Text style={styles.eventTime}>{ev.time}</Text>
              </View>
              <PriorityBadge priority={ev.severity} />
            </View>

            <Text style={styles.eventDesc}>{ev.desc}</Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Defense Action:</Text>
              <Text style={styles.statusVal}>{ev.status}</Text>
            </View>
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
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  eventCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.triageRed,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleWrap: {
    flex: 1,
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  eventTime: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  eventDesc: {
    fontSize: 12,
    color: COLORS.navyLight,
    lineHeight: 16,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  statusLabel: {
    fontSize: 11,
    color: COLORS.slate,
  },
  statusVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
});
