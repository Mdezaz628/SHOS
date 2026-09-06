// Hospital Pharmacy Medicine Inventory Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const MedicineCard = ({ medicine, onDispense, style }) => {
  if (!medicine) return null;

  const isLowStock = medicine.stockQuantity < 30;

  return (
    <View style={[styles.card, isLowStock && styles.cardLowStock, style]}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="medical-outline" size={18} color={isLowStock ? COLORS.critical : COLORS.primary} />
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.name}>{medicine.name}</Text>
          <Text style={styles.generic}>{medicine.genericName}</Text>
        </View>

        <View style={[styles.stockBadge, isLowStock && styles.stockBadgeLow]}>
          <Text style={[styles.stockNum, isLowStock && styles.stockNumLow]}>
            {medicine.stockQuantity}
          </Text>
          <Text style={styles.stockUnit}>in stock</Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Batch No.</Text>
          <Text style={styles.metaVal}>{medicine.batchNo}</Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Expiry Date</Text>
          <Text style={[styles.metaVal, isLowStock && { color: COLORS.criticalDark }]}>
            {medicine.expiryDate}
          </Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Unit Price</Text>
          <Text style={styles.metaVal}>{medicine.unitPrice}</Text>
        </View>
      </View>

      {onDispense && (
        <TouchableOpacity
          style={styles.dispenseBtn}
          onPress={onDispense}
          activeOpacity={0.8}
        >
          <Ionicons name="checkbox-outline" size={14} color={COLORS.textWhite} />
          <Text style={styles.dispenseText}>Verify & Dispense Unit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLowStock: {
    borderColor: '#fca5a5',
    backgroundColor: '#fffdfd',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  generic: {
    fontSize: 11,
    color: COLORS.textDim,
    marginTop: 1,
  },
  stockBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeLow: {
    backgroundColor: COLORS.criticalSubtle,
  },
  stockNum: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.heavy,
    color: COLORS.primaryDark,
  },
  stockNumLow: {
    color: COLORS.criticalDark,
  },
  stockUnit: {
    fontSize: 9,
    color: COLORS.textDim,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: COLORS.textDim,
    textTransform: 'uppercase',
    fontWeight: TYPOGRAPHY.bold,
  },
  metaVal: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  dispenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  dispenseText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textWhite,
  },
});

export default MedicineCard;
