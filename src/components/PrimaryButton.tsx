import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  /** Optional custom background color */
  backgroundColor?: string;
}

/**
 * Consistent purple button used across onboarding screens.
 * Defaults to the theme color `#8B5CF6`.
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, disabled = false, backgroundColor }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: backgroundColor || '#8B5CF6' }, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default PrimaryButton;
