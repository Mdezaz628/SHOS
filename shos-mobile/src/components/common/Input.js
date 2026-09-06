// Reusable Accessible Input Field Component

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  icon,
  leftIcon,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const resolvedIcon = leftIcon || icon;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          !editable && styles.inputDisabled,
          multiline && { height: 24 * numberOfLines + 20, alignItems: 'flex-start' },
        ]}
      >
        {resolvedIcon && (
          <Ionicons
            name={resolvedIcon}
            size={18}
            color={error ? COLORS.critical : isFocused ? COLORS.hospitalBlue || COLORS.primary : COLORS.textDim}
            style={styles.leadingIcon}
          />
        )}

        <TextInput
          style={[styles.input, multiline && styles.multilineInput, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDim}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          cursorColor={COLORS.hospitalBlue}
          selectionColor={COLORS.hospitalBlue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsSecure(!isSecure)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={COLORS.textDim}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: TYPOGRAPHY.minTouchSize,
  },
  inputFocused: {
    borderColor: COLORS.hospitalBlue || COLORS.primary,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: COLORS.critical,
    backgroundColor: COLORS.criticalSubtle,
  },
  inputDisabled: {
    backgroundColor: COLORS.surfaceSubtle,
    opacity: 0.7,
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.minInputFontSize,
    color: COLORS.text,
    paddingVertical: 10,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  eyeIcon: {
    padding: 6,
  },
  errorText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.critical,
    fontWeight: TYPOGRAPHY.medium,
    marginTop: 4,
  },
  helperText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textDim,
    marginTop: 4,
  },
});

export default Input;
