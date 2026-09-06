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
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const EmergencySOSScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [location, setLocation] = useState('Metro Pillar 412, Outer Ring Road, Bengaluru');
  const [problem, setProblem] = useState('Acute chest tightness & shortness of breath');
  const [severity, setSeverity] = useState('CRITICAL');
  const [isDispatching, setIsDispatching] = useState(false);

  const handleAmbulanceDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      Alert.alert(
        '🚨 Ambulance Dispatched!',
        'Cardiac Advanced Life Support Ambulance #08 (Driver Rajesh Yadav, EMT Dr. Sen) has been assigned.\n\nEstimated Arrival: 08 mins.',
        [
          {
            text: 'Track Live GPS',
            onPress: () => navigation.navigate('AmbulanceTracking'),
          },
        ]
      );
    }, 700);
  };

  const handleCallHospitalER = () => {
    Alert.alert(
      'Connecting to ER Hotline',
      'Dialing SHOS Trauma Center & Emergency Triage: +91 80 2345 6789 (24x7 Direct Hotline).',
      [{ text: 'OK' }]
    );
  };

  const handleCallKin = () => {
    Alert.alert(
      'Calling Emergency Contact',
      'Dialing Sunita Sharma (Spouse): +91 98765 43211.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Emergency Triage SOS"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showRole={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Call to Action Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertPulse}>
            <Ionicons name="warning" size={32} color={COLORS.cardBg} />
          </View>
          <Text style={styles.alertTitle}>HOSPITAL TRAUMA & EMERGENCY</Text>
          <Text style={styles.alertSubtitle}>
            If patient is unresponsive, having acute cardiac arrest, or severe trauma, call immediately
          </Text>

          <View style={styles.quickCallRow}>
            <TouchableOpacity
              style={styles.quickCallBtn}
              activeOpacity={0.8}
              onPress={handleCallHospitalER}
            >
              <Ionicons name="call" size={18} color={COLORS.cardBg} />
              <Text style={styles.quickCallText}>Call Hospital ER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickCallBtn, styles.quickCallKin]}
              activeOpacity={0.8}
              onPress={handleCallKin}
            >
              <Ionicons name="people" size={18} color={COLORS.cardBg} />
              <Text style={styles.quickCallText}>Call Kin / Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dispatch Ambulance Form */}
        <Text style={styles.sectionHeading}>DISPATCH ADVANCED CARDIAC AMBULANCE</Text>
        <Card style={styles.formCard}>
          <Input
            label="Pickup Location (GPS Detected)"
            value={location}
            onChangeText={setLocation}
            leftIcon="location"
          />

          <Input
            label="Patient Problem / Symptoms"
            value={problem}
            onChangeText={setProblem}
            leftIcon="medkit-outline"
            multiline
            numberOfLines={2}
          />

          <View style={styles.patientInfoBox}>
            <Text style={styles.infoRowText}>
              Patient: <Text style={{ fontWeight: '700' }}>{currentUser?.name || 'Rahul Sharma'}</Text> (UHID: {currentUser?.uhid || 'SHOS-2026-8942'})
            </Text>
            <Text style={styles.infoRowText}>
              Blood Group: <Text style={{ fontWeight: '700', color: COLORS.triageRed }}>O+ Positive</Text> • Allergies: Penicillin
            </Text>
          </View>

          {/* Severity Chooser */}
          <Text style={styles.severityLabel}>TRIAGE SEVERITY LEVEL</Text>
          <View style={styles.severityRow}>
            {[
              { level: 'CRITICAL', color: COLORS.triageRed, desc: 'Immediate resuscitation' },
              { level: 'URGENT', color: COLORS.triageYellow, desc: '< 15 min attention' },
              { level: 'STABLE', color: COLORS.triageGreen, desc: 'Sub-acute transfer' },
            ].map((s) => (
              <TouchableOpacity
                key={s.level}
                style={[
                  styles.severityBtn,
                  severity === s.level && { borderColor: s.color, backgroundColor: `${s.color}15`, borderWidth: 2 },
                ]}
                onPress={() => setSeverity(s.level)}
              >
                <View style={[styles.severityDot, { backgroundColor: s.color }]} />
                <Text style={[styles.severityText, severity === s.level && { color: s.color, fontWeight: '800' }]}>
                  {s.level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title={isDispatching ? 'Transmitting to Emergency Fleet...' : 'Dispatch Nearest Ambulance'}
            variant="danger"
            size="large"
            icon="car-sport"
            onPress={handleAmbulanceDispatch}
            loading={isDispatching}
            style={styles.dispatchBtn}
          />
        </Card>

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
  alertBanner: {
    backgroundColor: COLORS.triageRed,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  alertPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.cardBg,
    letterSpacing: 0.5,
  },
  alertSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    marginBottom: 16,
  },
  quickCallRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  quickCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  quickCallKin: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quickCallText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cardBg,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  formCard: {
    marginBottom: 16,
  },
  patientInfoBox: {
    backgroundColor: COLORS.offWhite,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    gap: 4,
  },
  infoRowText: {
    fontSize: 12,
    color: COLORS.navy,
  },
  severityLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  severityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.navy,
  },
  dispatchBtn: {
    width: '100%',
  },
});
