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

export const ResetPasswordScreen = ({ route, navigation }) => {
  const email = route?.params?.email || 'user@shos.hospital';
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    if (!resetCode || !newPassword || !confirmPassword) {
      Alert.alert('Required Fields', 'Please complete all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Password Updated',
        'Your security credentials have been successfully updated. Please sign in.',
        [{ text: 'Sign In Now', onPress: () => navigation.navigate('Login') }]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>
            Enter the recovery code sent to {email} and define your new credential.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Recovery Code"
            placeholder="6-digit verification code"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="number-pad"
            leftIcon="keypad-outline"
          />

          <Input
            label="New Password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon="shield-checkmark-outline"
          />

          <Button
            title={isSubmitting ? 'Updating Password...' : 'Save New Password'}
            variant="primary"
            size="large"
            icon="checkmark-circle"
            onPress={handleReset}
            loading={isSubmitting}
            style={styles.btn}
          />
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
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
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
    gap: 6,
  },
  btn: {
    width: '100%',
    marginTop: 16,
  },
});
