// Reusable Card Container Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const Card = ({
  title,
  subtitle,
  rightAction,
  children,
  footer,
  style,
  bodyStyle,
  noPadding = false,
}) => {
  return (
    <View style={[styles.card, style]}>
      {(title || rightAction) && (
        <View style={styles.header}>
          <View style={styles.titleColumn}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {rightAction && <View style={styles.actionWrap}>{rightAction}</View>}
        </View>
      )}

      <View style={[!noPadding && styles.body, bodyStyle]}>{children}</View>

      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceSubtle,
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textDim,
    marginTop: 2,
  },
  actionWrap: {
    marginLeft: 10,
  },
  body: {
    padding: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceSubtle,
  },
});

export default Card;
