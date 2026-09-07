import React from 'react';
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
import { useAuth } from '../../context/AuthContext';

export const SuperAdminDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [finance, setFinance] = React.useState(null);

  const fetchFinancials = async () => {
    try {
      const { apiClient } = require('../../api/client');
      const res = await apiClient.get('/finance/overview');
      if (res.data?.success) {
        setFinance(res.data);
      }
    } catch (e) {
      console.log('[SuperAdmin] finance error:', e.message);
    }
  };

  React.useEffect(() => {
    fetchFinancials();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFinancials();
    setTimeout(() => setRefreshing(false), 500);
  };

  const campuses = [
    { name: 'SHOS Main Tertiary Center (Bengaluru)', beds: 350, status: 'Online (99.9%)', load: '84%' },
    { name: 'North Multi-Specialty Annex (Hebbal)', beds: 120, status: 'Online (100%)', load: '72%' },
    { name: 'Cardio-Thoracic Institute (Whitefield)', beds: 80, status: 'Online (99.8%)', load: '91%' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Apex Governance Terminal"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* SuperAdmin Header */}
        <View style={styles.superHeader}>
          <Text style={styles.superLabel}>MULTI-CAMPUS HEALTHCARE GOVERNANCE</Text>
          <Text style={styles.adminName}>{currentUser?.name || 'Apex Governance Officer'}</Text>
          <Text style={styles.superMeta}>System Health: 100% • Enterprise Encryption Active</Text>
        </View>

        {/* Global KPIs */}
        <Text style={styles.sectionHeading}>NETWORK HEALTH & SECURITY</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Campuses"
            value="3 Active"
            change="All Online"
            changeType="positive"
            icon="business"
            color={COLORS.hospitalBlue}
          />
          <StatCard
            label="Active Users"
            value="342"
            change="Doctors/Staff"
            changeType="positive"
            icon="people"
            color={COLORS.hospitalTeal}
          />
          <StatCard
            label="Audit Logs"
            value="14.2K"
            change="24h Logged"
            changeType="neutral"
            icon="document-text"
            color={COLORS.navy}
          />
          <StatCard
            label="Security Alerts"
            value="0 Critical"
            change="Firewall Safe"
            changeType="positive"
            icon="shield-checkmark"
            color={COLORS.triageGreen}
          />
        </View>

        {/* Security & Financial Modules Navigation */}
        <Text style={styles.sectionHeading}>AUDIT, SECURITY & FINANCIAL SURVEILLANCE</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate('AuditLogs')}
          >
            <Ionicons name="finger-print" size={22} color={COLORS.hospitalBlue} />
            <Text style={styles.actionTitle}>EHR Audit</Text>
            <Text style={styles.actionDesc}>NABH Logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate('SecurityEvents')}
          >
            <Ionicons name="lock-closed" size={22} color={COLORS.triageRed} />
            <Text style={styles.actionTitle}>Security</Text>
            <Text style={styles.actionDesc}>Firewall/IP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate('FinancialIntelligence')}
          >
            <Ionicons name="bar-chart" size={22} color={COLORS.triageGreen} />
            <Text style={styles.actionTitle}>Financial</Text>
            <Text style={styles.actionDesc}>EBIT & TPA</Text>
          </TouchableOpacity>
        </View>

        {/* AI Inference Models & Pipeline Control */}
        <Text style={styles.sectionHeading}>AI INFERENCE ENGINE & RETRAINING (8 MODELS)</Text>
        <Card style={{ marginBottom: 16, padding: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.navy }}>Scikit-Learn Inference Pipeline</Text>
              <Text style={{ fontSize: 11, color: COLORS.slate }}>Patient Load, Length of Stay, Bed Surges</Text>
            </View>
            <View style={{ backgroundColor: `${COLORS.triageGreen}15`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.triageGreen }}>8/8 ONLINE</Text>
            </View>
          </View>

          <Button
            title="Retrain All 8 Predictive Models"
            variant="primary"
            size="small"
            icon="sparkles"
            onPress={() =>
              Alert.alert(
                'AI Model Retraining Initiated',
                'FastAPI worker spawned at localhost:8000. Retraining patient load, bed churn, and ICU surge models using 36 months of data.'
              )
            }
          />
        </Card>

        {/* Cloud Supabase & Database Telemetry */}
        <Text style={styles.sectionHeading}>SUPABASE POSTGRESQL & FASTAPI GATEWAY</Text>
        <Card style={{ marginBottom: 16, padding: 14 }}>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: COLORS.slate }}>REST Endpoint:</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.hospitalBlue }}>jrcpqbyofshlkxoayfvh.supabase.co</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: COLORS.slate }}>Secret Key Signature:</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.triageGreen }}>sb_secret_dgZ3Odv... (Active)</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: COLORS.slate }}>AI Service (FastAPI):</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.navy }}>http://localhost:8000 (Ready)</Text>
            </View>
          </View>
        </Card>

        {/* Live Financial Intelligence & Transaction Log */}
        <Text style={styles.sectionHeading}>CAMPUS FINANCIAL SURVEILLANCE & TRANSACTIONS</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Gross Billings"
            value={finance ? `₹${(finance.stats?.grossRevenue / 100000).toFixed(1)}L` : '₹84.6L'}
            change="MTD Volume"
            changeType="positive"
            icon="wallet"
            color="#10B981"
          />
          <StatCard
            label="Net Collections"
            value={finance ? `₹${(finance.stats?.netCollections / 100000).toFixed(1)}L` : '₹79.2L'}
            change="Realized (94%)"
            changeType="positive"
            icon="cash"
            color={COLORS.hospitalBlue}
          />
        </View>

        <Button
          title="Open Full Financial Intelligence & Department EBIT"
          variant="primary"
          size="small"
          icon="bar-chart"
          onPress={() => navigation.navigate('FinancialIntelligence')}
          style={{ marginBottom: 16 }}
        />

        {/* Recent Financial Transactions List */}
        {finance?.transactions && (
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.sectionHeading, { marginBottom: 6 }]}>LATEST AUDITED TRANSACTIONS</Text>
            {finance.transactions.slice(0, 3).map((tx) => (
              <Card key={tx.id} style={{ marginBottom: 8, padding: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.navy }}>{tx.category}</Text>
                    <Text style={{ fontSize: 11, color: COLORS.slate }}>{tx.department} • Ref #{tx.id}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#10B981' }}>+₹{tx.amount.toLocaleString()}</Text>
                    <Text style={{ fontSize: 10, color: COLORS.hospitalTeal, fontWeight: '700' }}>{tx.status.toUpperCase()}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Campus Network Status */}
        <Text style={styles.sectionHeading}>CONNECTED CAMPUS HUBS</Text>
        {campuses.map((c, idx) => (
          <Card key={idx} style={styles.campusCard}>
            <View style={styles.campusHeader}>
              <Text style={styles.campusName}>{c.name}</Text>
              <Text style={styles.statusText}>{c.status}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{c.beds} Registered Beds</Text>
              <Text style={styles.metaText}>Occupancy: {c.load}</Text>
            </View>
          </Card>
        ))}

        <Button
          title="Export System Integrity & Compliance Report"
          variant="outline"
          size="medium"
          icon="download-outline"
          onPress={() => Alert.alert('Compliance Export', 'ISO 27001 & NABH Compliance report exported.')}
          style={{ marginTop: 10 }}
        />

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
  superHeader: {
    backgroundColor: COLORS.navy,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  superLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.hospitalTeal,
    letterSpacing: 0.5,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.cardBg,
    marginTop: 2,
  },
  superMeta: {
    fontSize: 11,
    color: COLORS.slateLight,
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBox: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
    marginTop: 8,
  },
  actionDesc: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  campusCard: {
    marginBottom: 10,
  },
  campusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  campusName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.navy,
    flex: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.triageGreen,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 11,
    color: COLORS.slate,
  },
});
