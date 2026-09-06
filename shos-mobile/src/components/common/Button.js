// Reusable Button Component for Mobile

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | critical | outline | ghost
  size = 'md',          // sm | md | lg
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    let base = [styles.base, styles[size]];
    if (fullWidth) base.push(styles.fullWidth);

    switch (variant) {
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'critical':
        base.push(styles.critical);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'ghost':
        base.push(styles.ghost);
        break;
      default:
        base.push(styles.primary);
        break;
    }

    if (disabled || loading) base.push(styles.disabled);
    return base;
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textDim;
    if (variant === 'outline') return COLORS.primary;
    if (variant === 'ghost') return COLORS.textMuted;
    return COLORS.textWhite;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={size === 'sm' ? 14 : 18} color={getTextColor()} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, styles[`text_${size}`], { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={size === 'sm' ? 14 : 18} color={getTextColor()} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  // Sizes
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 34,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    minHeight: 46,
  },
  lg: {
    paddingVertical: 15,
    paddingHorizontal: 22,
    minHeight: 52,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  critical: {
    backgroundColor: COLORS.critical,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  // Typography
  text: {
    fontWeight: TYPOGRAPHY.bold,
  },
  text_sm: {
    fontSize: TYPOGRAPHY.xs,
  },
  text_md: {
    fontSize: TYPOGRAPHY.sm,
  },
  text_lg: {
    fontSize: TYPOGRAPHY.md,
  },
});

export default Button;
