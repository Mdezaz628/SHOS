// Reusable Clinical User Avatar Component

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const Avatar = ({ name = 'User', image, size = 44, roleColor, style }) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.replace(/^Dr\.\s+/i, '').split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const bg = roleColor || COLORS.primary;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }, style]}>
      {image ? (
        <Image source={{ uri: image }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.38 }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  initials: {
    color: COLORS.textWhite,
    fontWeight: TYPOGRAPHY.bold,
  },
});

export default Avatar;
