import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet } from 'react-native';

import { STYLES } from '@/constants/Styles';

const BlurCard = ({ children, style }) => (
  <BlurView intensity={80} style={[styles.card, style]}>
    {children}
  </BlurView>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: STYLES.neonRed + '4D', // %30 opaklık
  },
});

export default BlurCard;