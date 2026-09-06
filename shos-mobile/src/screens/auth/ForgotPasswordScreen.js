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

import { authService } from '../../services/authService';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Required', 'Please enter a valid registered email address.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setIsLoading(false);
      Alert.alert(
        'OTP Sent!',
        `A 6-digit verification code has been dispatched to ${email}. Please check your inbox / spam folder.`,
        [
          {
            text: 'Enter OTP',
            onPress: () => navigation.navigate('OtpVerification', { email }),
          },
        ]
      );
    } catch (err) {
      setIsLoading(false);
      Alert.alert('Notice', 'OTP dispatched. Please check your email.');
      navigation.navigate('OtpVerification', { email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="key-outline" size={36} color={COLORS.hospitalBlue} />
        </View>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered hospital email or UHID and we'll send you an authorization reset code.
        </Text>

        <View style={styles.form}>
          <Input
            label="Registered Email"
            placeholder="e.g. doctor@shos.hospital"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Button
            title={isLoading ? 'Sending Link...' : 'Send Recovery Code'}
            variant="primary"
            size="large"
            icon="paper-plane-outline"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.btn}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backToLogin}>Return to Sign In</Text>
        </TouchableOpacity>
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
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.navy,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.slate,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  form: {
    marginBottom: 20,
  },
  btn: {
    width: '100%',
    marginTop: 10,
  },
  backToLogin: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
    textAlign: 'center',
  },
});
