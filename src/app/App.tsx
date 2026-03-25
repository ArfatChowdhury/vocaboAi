/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '../features/auth/hooks/useAuth';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../shared/constants/Colors';
import { ThemeProvider } from '../config/ThemeContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { user, loading, logOut } = useAuth();
  const safeAreaInsets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Welcome, {user.email}</Text>
      </View>
      
      <View style={styles.body}>
        <Text style={styles.info}>You are successfully logged in!</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.error.text,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
