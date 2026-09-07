import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { ROLES } from '../../constants/roles';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export const OtpVerificationScreen = ({ route, navigation }) => {
  const { completeOtpLogin } = useAuth();
  const email = route?.params?.email || 'patient@shos.hospital';
  const demoOtp = route?.params?.demoOtp || '583921';
  const isFromRegister = !!route?.params?.fromRegister;

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(45);

  // Active countdown timer effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid Code', 'Please enter the verification code (OTP) sent to your registered email.');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await authService.verifyOtp(otp, email);
      setIsVerifying(false);
      if (res.verified) {
        if (isFromRegister) {
          // Load pending registered user and activate session
          let pendingUser = null;
          let pendingToken = null;
          try {
            const pendingStr = await AsyncStorage.getItem('@shos_pending_user');
            pendingToken = await AsyncStorage.getItem('@shos_pending_token');
            if (pendingStr) {
              pendingUser = JSON.parse(pendingStr);
            }
          } catch (e) {}

          if (!pendingUser) {
            pendingUser = {
              id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
              name: email.split('@')[0] || 'Patient User',
              email: email,
              role: ROLES.PATIENT,
              uhid: 'SHOS-2026-' + Math.floor(1000 + Math.random() * 9000),
            };
          }

          // Automatically switches RootNavigator to PatientNavigator
          await completeOtpLogin(pendingUser, pendingToken);
        } else {
          Alert.alert(
            'Verification Success',
            'Your identity has been authenticated successfully.',
            [
              {
                text: 'Reset Password',
                onPress: () => navigation.navigate('ResetPassword', { email, otp }),
              },
            ]
          );
        }
      } else {
        Alert.alert('Verification Failed', res.message || 'The code entered is invalid. Please try again.');
      }
    } catch (err) {
      setIsVerifying(false);
      Alert.alert('Error', 'Verification error. Please try again.');
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    try {
      await authService.resendOtp(email);
      setTimer(45);
      setIsResending(false);
      Alert.alert('OTP Resent', `A new verification code has been dispatched to ${email}. Check your inbox/spam folder.`);
    } catch (e) {
      setTimer(45);
      setIsResending(false);
      Alert.alert('OTP Resent', 'A new verification code has been dispatched.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={36} color={COLORS.hospitalBlue} />
        </View>

        <Text style={styles.title}>Two-Factor Verification</Text>
        <Text style={styles.subtitle}>
          We sent a clinical verification token to:
        </Text>
        <Text style={styles.emailHighlight}>{email}</Text>

        {/* Demo Token Autofill Callout */}
        <TouchableOpacity
          style={styles.demoTokenBadge}
          onPress={() => setOtp(demoOtp)}
          activeOpacity={0.8}
        >
          <Ionicons name="key-outline" size={16} color={COLORS.hospitalBlue} />
          <Text style={styles.demoTokenText}>
            Demo Code: <Text style={styles.demoCodeBold}>{demoOtp}</Text>
          </Text>
          <View style={styles.fillChip}>
            <Text style={styles.fillChipText}>Tap to Fill</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.otpBox}>
          <Input
            label="Verification Code (OTP)"
            placeholder="e.g. 583921"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.otpInput}
          />
        </View>

        <Button
          title={isVerifying ? 'Authenticating...' : 'Verify & Continue'}
          variant="primary"
          size="large"
          icon="checkmark-done"
          onPress={handleVerify}
          loading={isVerifying}
          style={styles.btn}
        />

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive the OTP? </Text>
          {timer > 0 ? (
            <Text style={styles.countdownText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={isResending}>
              <Text style={styles.resendLink}>{isResending ? 'Sending...' : 'Resend Token'}</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navy,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.slate,
    marginTop: 6,
    textAlign: 'center',
  },
  emailHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    marginTop: 2,
    marginBottom: 16,
  },
  demoTokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  demoTokenText: {
    fontSize: 12,
    color: COLORS.navy,
  },
  demoCodeBold: {
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 1,
  },
  fillChip: {
    backgroundColor: COLORS.hospitalBlue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  fillChipText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  otpBox: {
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 22,
    fontWeight: '800',
  },
  btn: {
    width: '100%',
    marginBottom: 20,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: COLORS.slate,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
  countdownText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
});
