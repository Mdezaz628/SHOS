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
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/HospitalDataContext';

export const DepartmentDashboard = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { doctors } = useHospitalData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Department HOD Terminal"
        showRole={true}
        showNotification={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Department HOD Header */}
        <View style={styles.deptHeader}>
          <Text style={styles.deptLabel}>DEPARTMENT OF CARDIOLOGY & CCU</Text>
          <Text style={styles.officerName}>{currentUser?.name || 'Dr. Meenakshi Sundaram'}</Text>
          <Text style={styles.deptMeta}>HOD & Chief of Interventional Cardiology</Text>
        </View>

        {/* Department KPIs (Touch to interact) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.sectionHeading}>DEPARTMENT CLINICAL THROUGHPUT</Text>
          <Text style={{ fontSize: 11, color: COLORS.hospitalBlue, fontWeight: '600' }}>Tap card for telemetry</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="OPD Footfall"
            value="48"
            change="Today"
            changeType="positive"
            icon="people"
            color={COLORS.hospitalBlue}
            onPress={() => Alert.alert('Department OPD Footfall', '48 cardiology patients registered today across Rooms 201-205.')}
          />
          <StatCard
            label="Cath Lab Cases"
            value="6"
            change="4 Done"
            changeType="positive"
            icon="heart"
            color={COLORS.triageRed}
            onPress={() => Alert.alert('Interventional Cath Lab', '6 scheduled angioplasty / stenting cases. 4 successfully completed.')}
          />
          <StatCard
            label="Bed Occupancy"
            value="88%"
            change="CCU + Ward"
            changeType="warning"
            icon="bed"
            color={COLORS.warning}
            onPress={() => Alert.alert('Cardiac Bed Census', '88% CCU bed occupancy. 2 emergency stepdown beds on standby.')}
          />
          <StatCard
            label="Active Faculty"
            value="4 / 5"
            change="On Duty"
            changeType="neutral"
            icon="medkit"
            color={COLORS.hospitalTeal}
            onPress={() => Alert.alert('Faculty Deployment', '4 Senior Consultants currently attending OPD & Cath Lab.')}
          />
        </View>

        {/* Department Faculty List */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.sectionHeading}>ATTENDING CONSULTANTS & OPD ROOMS</Text>
          <Text style={{ fontSize: 11, color: COLORS.slate }}>Tap doctor to view station</Text>
        </View>

        {doctors.slice(0, 3).map((doc) => (
          <TouchableOpacity
            key={doc.id}
            activeOpacity={0.8}
            onPress={() => Alert.alert(`Consultant Station: ${doc.name}`, `Assigned Room: ${doc.roomNumber || 'OPD-204'}\nSpecialty: ${doc.specialty}\nActive Queue: 8 Patients\nShift: Morning 09:00 - 17:00`)}
          >
            <Card style={styles.docCard}>
              <View style={styles.docRow}>
                <Avatar name={doc.name} size="medium" role="doctor" />
                <View style={styles.docMeta}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                  <Text style={styles.docRoom}>Assigned Room: {doc.roomNumber || 'OPD-204'}</Text>
                </View>
                <View style={styles.activeTag}>
                  <Text style={styles.activeTagText}>ACTIVE</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <Button
          title="Download Department Audit Report"
          variant="outline"
          size="medium"
          icon="document-text-outline"
          onPress={() => Alert.alert('Audit Generated', 'Cardiology Monthly Quality & Mortality audit exported.')}
          style={{ marginTop: 6 }}
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
  deptHeader: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  deptLabel: {
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
  deptMeta: {
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
  docCard: {
    marginBottom: 12,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docMeta: {
    marginLeft: 12,
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  docSpecialty: {
    fontSize: 12,
    color: COLORS.hospitalTeal,
    marginTop: 2,
  },
  docRoom: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
  },
});
