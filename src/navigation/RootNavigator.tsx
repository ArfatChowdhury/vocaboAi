import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../config/ThemeContext';

// Auth Screen imports
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { SignUpScreen } from '../features/auth/screens/SignUpScreen';

// App Screen imports
import PostsListScreen from '../features/posts/screens/PostsListScreen';
import PostDetailScreen from '../features/posts/screens/PostDetailScreen';

// Type definitions for the navigation stacks
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  PostsList: undefined;
  PostDetail: { postId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator
 * Controls the top-level navigation flow of the application.
 * Switches between AuthStack and AppStack dynamically based on Firebase auth state.
 */
const RootNavigator = () => {
  const { user, loading, logOut } = useAuth();
  const { colors, isDark } = useTheme();

  // Select the appropriate base theme
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  // Create a custom theme to ensure the background fills the entire screen
  const appTheme = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.border.default,
      primary: colors.primary,
    },
  };

  // If Firebase auth is still initializing, render nothing (splash-safe)
  if (loading) return null;

  return (
    <NavigationContainer theme={appTheme}>
      <Stack.Navigator
        screenOptions={{ 
          contentStyle: { backgroundColor: colors.background } 
        }}
      >
        {user ? (
          // AppStack: Accessible only to logged-in users
          <Stack.Group
            screenOptions={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: 'bold' },
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="PostsList"
              component={PostsListScreen}
              options={{
                title: 'VocaboAi Feed',
                headerRight: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <TouchableOpacity onPress={useTheme().toggleTheme} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text style={{ fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logOut} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="PostDetail"
              component={PostDetailScreen}
              options={{ title: 'Post Details' }}
            />
          </Stack.Group>
        ) : (
          // AuthStack: Accessible only to unauthenticated users
          <Stack.Group screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
