import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../config/ThemeContext';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles(colors).safeArea}>
      <KeyboardAvoidingView
        style={styles(colors).container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles(colors).scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles(colors).header}>
            <Text style={styles(colors).title}>{title}</Text>
            {subtitle && <Text style={styles(colors).subtitle}>{subtitle}</Text>}
          </View>

          <View style={styles(colors).body}>{children}</View>

          {footer && <View style={styles(colors).footer}>{footer}</View>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  body: {
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
});
