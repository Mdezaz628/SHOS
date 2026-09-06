// Reusable Content Loading Skeleton Shimmer Block

import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const Skeleton = ({ width = '100%', height = 20, borderRadius = 6, style }) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
});

export default Skeleton;
