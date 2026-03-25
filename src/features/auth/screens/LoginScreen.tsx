import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { AuthLayout } from '../../../shared/components/AuthLayout';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

export const LoginScreen = () => {
  const { signIn: emailSignIn, loading: authLoading } = useAuth();
  const { signIn: googleSignIn, loading: googleLoading } = useGoogleSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    try {
      await emailSignIn({ email, password });
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const user = await googleSignIn();
    if (user) {
      console.log('Signed in with Google:', user.email);
    }
  };

  const isLoading = authLoading || googleLoading;

  const footer = (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>Don't have an account? </Text>
      <TouchableOpacity onPress={() => console.log('Navigate to SignUp')}>
        <Text style={styles.footerLink}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your VocaboAi account"
      footer={footer}
    >
      <Input
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />
      
      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <View style={styles.spacing} />

      <Button
        label="Sign In"
        onPress={handleEmailSignIn}
        isLoading={authLoading}
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <View style={styles.googleButtonContent}>
            <View style={styles.googleIconPlaceholder} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </View>
        )}
      </TouchableOpacity>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  spacing: {
    height: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#4285F4',
    marginRight: 10,
    borderRadius: 4,
  },
  googleButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
