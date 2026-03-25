import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useTheme } from '../../../config/ThemeContext';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/**
 * GoogleIcon - renders the multi-colored Google "G" using colored Views.
 */
const GoogleIcon = () => (
  <View style={googleIconStyles.wrapper}>
    {/* Top-left red */}
    <View style={[googleIconStyles.slice, { borderTopColor: '#EA4335', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }]} />
    {/* Top-right blue */}
    <View style={[googleIconStyles.slice, { borderTopColor: '#4285F4', borderRightColor: '#4285F4', borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: [{ rotate: '90deg' }] }]} />
    {/* Inner white circle mask */}
    <View style={googleIconStyles.innerCircle}>
      <Text style={googleIconStyles.gLetter}>G</Text>
    </View>
  </View>
);

const googleIconStyles = StyleSheet.create({
  wrapper: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slice: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  innerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#4285F4',
    borderRightColor: '#34A853',
    borderBottomColor: '#FBBC05',
    borderLeftColor: '#EA4335',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  gLetter: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4285F4',
    lineHeight: 14,
    marginLeft: 1,
  },
});

export const LoginScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<LoginNavProp>();
  const { signIn: emailSignIn, loading: authLoading } = useAuth();
  const { signIn: googleSignIn, loading: googleLoading } = useGoogleSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    try {
      await emailSignIn({ email, password });
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  const isLoading = authLoading || googleLoading;
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
          {/* Brand Header */}
          <View style={s.brandSection}>
            <View style={s.logoCircle}>
              <Text style={s.logoText}>V</Text>
            </View>
            <Text style={s.appName}>VocaboAi</Text>
            <Text style={s.tagline}>Your daily reading companion</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Welcome back 👋</Text>
            <Text style={s.cardSubtitle}>Sign in to continue reading</Text>

            <View style={s.formArea}>
              <Input
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
              <Input
                label="Password"
                placeholder="Your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <Button
              label="Sign In"
              onPress={handleEmailSignIn}
              isLoading={authLoading}
            />

            {/* Divider */}
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>or continue with</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Google Button — always white + dark text + real G icon */}
            <TouchableOpacity
              style={s.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {googleLoading ? (
                <ActivityIndicator color="#3C4043" />
              ) : (
                <>
                  <GoogleIcon />
                  <Text style={s.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={s.footerLink}>Sign Up</Text>
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

  brandSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
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
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 28,
  },
  formArea: { marginBottom: 4 },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: colors.text.muted,
  },

  // Google button always has fixed colors regardless of theme
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DADCE0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3C4043',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: { fontSize: 14, color: colors.text.secondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
