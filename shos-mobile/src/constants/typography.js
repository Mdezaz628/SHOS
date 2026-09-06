// SHOS Mobile Typography & Sizing Standards

import { Platform } from 'react-native';

export const TYPOGRAPHY = {
  // Font Sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 28,

  // Font Weights
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',

  // Line Heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,

  // Accessible Touch Target Minimums
  minTouchSize: 48,
  minInputFontSize: Platform.OS === 'ios' ? 16 : 15,
};

export default TYPOGRAPHY;
