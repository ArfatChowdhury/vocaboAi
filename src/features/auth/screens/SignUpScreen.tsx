import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../../../shared/components/AuthLayout';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useTheme } from '../../../config/ThemeContext';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type SignUpNavProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<SignUpNavProp>();
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
    <View style={styles(colors).footerRow}>
      <Text style={styles(colors).footerText}>Already have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles(colors).footerLink}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started with VocaboAi"
      footer={footer}
    >
      {error ? <Text style={styles(colors).mainErrorText}>{error}</Text> : null}

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

      <View style={styles(colors).spacing} />

      <Button
        label="Sign Up"
        onPress={handleSignUp}
        isLoading={authLoading}
      />
    </AuthLayout>
  );
};

const styles = (colors: any) => StyleSheet.create({
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
