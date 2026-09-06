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
import { ROLES, DEMO_PRESETS } from '../../constants/roles';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('patient@shos.hospital');
  const [password, setPassword] = useState('HospitalPass@2026');
  const [selectedRole, setSelectedRole] = useState(ROLES.PATIENT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter your registered email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await login(email, password, selectedRole);
      if (!res?.success) {
        Alert.alert('Sign In Failed', res?.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to complete sign-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillPreset = (preset) => {
    setEmail(preset.email);
    setPassword('HospitalPass@2026');
    setSelectedRole(preset.role);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to access your SHOS clinical or patient terminal
          </Text>
        </View>

        {/* Quick Autofill Chips */}
        <View style={styles.quickFillSection}>
          <Text style={styles.quickFillLabel}>QUICK DEMO AUTO-FILL:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {DEMO_PRESETS.slice(0, 5).map((p) => (
              <TouchableOpacity
                key={p.role}
                style={[
                  styles.chip,
                  selectedRole === p.role && styles.chipActive,
                ]}
                onPress={() => autofillPreset(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedRole === p.role && styles.chipTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          <Input
            label="Registered Email / Hospital ID"
            placeholder="e.g. patient@shos.hospital"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Password"
            placeholder="Enter your security password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <Button
            title={isSubmitting ? 'Verifying Credentials...' : 'Sign In'}
            variant="primary"
            size="large"
            icon="log-in-outline"
            onPress={handleLogin}
            loading={isSubmitting}
            style={styles.submitBtn}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Smart Hospital Operations? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register Patient</Text>
          </TouchableOpacity>
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
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.navy,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.slate,
    marginTop: 4,
    lineHeight: 18,
  },
  quickFillSection: {
    marginBottom: 18,
    backgroundColor: COLORS.offWhite,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  quickFillLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.hospitalBlue,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.hospitalBlue,
    borderColor: COLORS.hospitalBlue,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
  },
  chipTextActive: {
    color: COLORS.cardBg,
  },
  form: {
    marginBottom: 24,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.hospitalBlue,
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.slate,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
});
