import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../config/ThemeContext';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onPress, isLoading }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles(colors).button, isLoading && styles(colors).buttonDisabled]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles(colors).buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = (colors: any) => StyleSheet.create({
  button: {
    backgroundColor: colors.primary, // Primary blue
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
