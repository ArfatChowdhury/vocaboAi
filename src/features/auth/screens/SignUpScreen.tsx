import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
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
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await signUp({ email, password });
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    }
  };

  const s = styles(colors);

  const insets = useSafeAreaInsets();

  return (
    <View style={[s.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back link */}
          <TouchableOpacity style={s.backRow} onPress={() => navigation.navigate('Login')}>
            <Text style={s.backArrow}>←</Text>
            <Text style={s.backText}>Back to Sign In</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.headline}>Create your account</Text>
            <Text style={s.subheadline}>Join VocaboAi and start reading</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {error ? (
              <View style={s.errorBanner}>
                <Text style={s.errorBannerText}>⚠ {error}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!authLoading}
            />
            <Input
              label="Password"
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!authLoading}
            />
            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!authLoading}
            />

            <View style={{ height: 8 }} />
            <Button label="Create Account" onPress={handleSignUp} isLoading={authLoading} />

            {/* Terms note */}
            <Text style={s.terms}>
              By creating an account you agree to our{' '}
              <Text style={s.termsLink}>Terms of Service</Text>
            </Text>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={s.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 24,
  },
  backArrow: { fontSize: 20, color: colors.primary, marginRight: 6 },
  backText: { fontSize: 14, color: colors.primary, fontWeight: '600' },

  header: { marginBottom: 28 },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: 6,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border.card,
  },

  errorBanner: {
    backgroundColor: colors.error.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.error.text,
  },
  errorBannerText: {
    color: colors.error.text,
    fontSize: 13,
    fontWeight: '500',
  },

  terms: {
    marginTop: 16,
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: { color: colors.primary, fontWeight: '600' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: { fontSize: 14, color: colors.text.secondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
