import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../features/auth/hooks/useAuth';

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

  // If Firebase auth is still initializing, render nothing (splash-safe)
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // AppStack: Accessible only to logged-in users
          <Stack.Group
            screenOptions={{
              headerShown: true,
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen
              name="PostsList"
              component={PostsListScreen}
              options={{
                title: 'VocaboAi Feed',
                headerRight: () => (
                  <TouchableOpacity onPress={logOut} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>
                      Logout
                    </Text>
                  </TouchableOpacity>
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
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
