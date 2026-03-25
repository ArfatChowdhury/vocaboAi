import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../config/ThemeContext';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles(colors).container}>
      {label ? <Text style={styles(colors).label}>{label}</Text> : null}

      <TextInput
        style={[styles(colors).input, error ? styles(colors).inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        secureTextEntry={secureTextEntry}
        {...props}
      />

      {error ? <Text style={styles(colors).errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: colors.input.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  inputError: {
    borderColor: colors.error.text,
    backgroundColor: colors.error.background,
  },
  errorText: {
    color: colors.error.text,
    fontSize: 12,
    marginTop: 6,
  },
});
