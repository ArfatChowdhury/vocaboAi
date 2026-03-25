import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../../../shared/components/AuthLayout';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/colors';

// Note: If you have a navigation prop, you can type it here.
export const SignUpScreen = () => {
  const { signUp, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    try {
      await signUp({ email, password });
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    }
  };

  const footer = (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>Already have an account? </Text>
      <TouchableOpacity onPress={() => console.log('Navigate to Login')}>
        <Text style={styles.footerLink}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started with VocaboAi"
      footer={footer}
    >
      {error ? <Text style={styles.mainErrorText}>{error}</Text> : null}

      <Input
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!authLoading}
      />
      
      <Input
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!authLoading}
      />

      <Input
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!authLoading}
      />

      <View style={styles.spacing} />

      <Button
        label="Sign Up"
        onPress={handleSignUp}
        isLoading={authLoading}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  spacing: {
    height: 10,
  },
  mainErrorText: {
    color: colors.error.text,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
