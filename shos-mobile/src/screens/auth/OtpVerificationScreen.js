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
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export const OtpVerificationScreen = ({ route, navigation }) => {
  const { completeOtpLogin } = useAuth();
  const email = route?.params?.email || 'patient@shos.hospital';
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(45);

  // Active countdown timer effect
  React.useEffect(() => {
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
        if (route?.params?.fromRegister) {
          // Load pending registered user and activate session
          try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const pendingStr = await AsyncStorage.getItem('@shos_pending_user');
            if (pendingStr) {
              const pendingUser = JSON.parse(pendingStr);
              await completeOtpLogin(pendingUser);
            }
          } catch (e) {}

          // Navigate directly to PatientTabs so session immediately opens
          navigation.navigate('PatientTabs');
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
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={36} color={COLORS.hospitalBlue} />
        </View>

        <Text style={styles.title}>Two-Factor Verification</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit clinical verification token to:
        </Text>
        <Text style={styles.emailHighlight}>{email}</Text>

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
    marginBottom: 24,
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
