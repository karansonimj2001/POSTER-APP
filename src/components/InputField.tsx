// src/components/InputField.tsx
import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  secureTextEntry?: boolean;
  maxLength?: number;
  style?: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder = '',
  error = false,
  secureTextEntry = false,
  maxLength,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#1E2034',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#2D304E',
  },
  errorInput: {
    borderColor: '#EF4444',
    color: '#EF4444',
  },
});
