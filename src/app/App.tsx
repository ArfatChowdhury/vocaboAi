import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../config/ThemeContext';
import { AuthProvider } from '../features/auth/hooks/useAuth';
import RootNavigator from '../navigation/RootNavigator';
import ErrorBoundary from '../shared/components/ErrorBoundary';

/**
 * App
 * The root entry point of the React Native application.
 * Wraps the entire component tree in required Providers (Theme, Auth, SafeArea)
 * and a class-based ErrorBoundary to catch uncaught render errors.
 */
const App = () => (
  <ErrorBoundary>
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  </ErrorBoundary>
);

export default App;
