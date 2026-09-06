// Reusable SearchBar Component

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search by name, UHID, doctor or dept...',
  onClear,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={18} color={COLORS.textDim} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textDim}
        clearButtonMode="never"
        returnKeyType="search"
      />
      {value ? (
        <TouchableOpacity onPress={onClear || (() => onChangeText(''))} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={18} color={COLORS.textDim} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    width: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    paddingVertical: 6,
  },
});

export default SearchBar;
