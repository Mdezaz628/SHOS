import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { ROLES } from '../../constants/roles';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    emergencyContact: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Required Fields', 'Please complete all mandatory fields.');
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        ...formData,
        name: formData.fullName,
        role: ROLES.PATIENT,
      });
      if (res?.success) {
        // Direct navigation to ensure the OTP verification screen opens immediately
        navigation.navigate('OtpVerification', {
          email: formData.email,
          fromRegister: true,
        });
      } else {
        Alert.alert('Registration Failed', 'Could not create account. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Patient Registration</Text>
          <Text style={styles.subtitle}>
            Create your digital patient profile to generate an instant UHID and book appointments
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name *"
            placeholder="e.g. Ramesh Chandra"
            value={formData.fullName}
            onChangeText={(t) => updateField('fullName', t)}
            leftIcon="person-outline"
          />

          <Input
            label="Email Address *"
            placeholder="e.g. ramesh@gmail.com"
            value={formData.email}
            onChangeText={(t) => updateField('email', t)}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <View style={styles.row}>
            <View style={styles.flexHalf}>
              <Input
                label="Mobile Phone *"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChangeText={(t) => updateField('phone', t)}
                keyboardType="phone-pad"
                leftIcon="call-outline"
              />
            </View>
            <View style={styles.flexHalf}>
              <Input
                label="Age"
                placeholder="e.g. 42"
                value={formData.age}
                onChangeText={(t) => updateField('age', t)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Input
            label="Emergency Contact & Phone *"
            placeholder="e.g. Sunita (Wife) - 9876543211"
            value={formData.emergencyContact}
            onChangeText={(t) => updateField('emergencyContact', t)}
            leftIcon="alert-circle-outline"
          />

          <Input
            label="Create Password *"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChangeText={(t) => updateField('password', t)}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Confirm Password *"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChangeText={(t) => updateField('confirmPassword', t)}
            secureTextEntry
            leftIcon="shield-checkmark-outline"
          />

          <View style={styles.noticeBox}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.hospitalTeal} />
            <Text style={styles.noticeText}>
              Your health data is encrypted according to NABH and Indian Digital Personal Data Protection standards.
            </Text>
          </View>

          <Button
            title={isSubmitting ? 'Creating Patient Profile...' : 'Complete Registration'}
            variant="primary"
            size="large"
            icon="arrow-forward"
            onPress={handleRegister}
            loading={isSubmitting}
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.navy,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.slate,
    marginTop: 4,
    lineHeight: 18,
  },
  form: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.hospitalBlue,
    lineHeight: 15,
  },
  submitBtn: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.slate,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.hospitalBlue,
  },
});
