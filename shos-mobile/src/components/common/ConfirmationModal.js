// Reusable Action Confirmation Dialog

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from './Modal';
import { Button } from './Button';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to authorize this clinical/operational operation?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // primary | critical
  loading = false,
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            title={cancelText}
            onPress={onClose}
            variant="outline"
            size="sm"
            disabled={loading}
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            variant={variant === 'critical' ? 'critical' : 'primary'}
            size="sm"
            loading={loading}
          />
        </>
      }
    >
      <View style={styles.bodyRow}>
        <View
          style={[
            styles.iconWrap,
            variant === 'critical' ? styles.iconWrapCritical : styles.iconWrapPrimary,
          ]}
        >
          <Ionicons
            name={variant === 'critical' ? 'alert-triangle' : 'help-circle'}
            size={26}
            color={variant === 'critical' ? COLORS.critical : COLORS.primary}
          />
        </View>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapPrimary: {
    backgroundColor: COLORS.primarySubtle,
  },
  iconWrapCritical: {
    backgroundColor: COLORS.criticalSubtle,
  },
  messageText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
});

export default ConfirmationModal;
