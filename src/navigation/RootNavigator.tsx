import React from 'react';
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
  const { user, loading } = useAuth();

  // If Firebase auth is still initializing, we can show a splash/loading state here
  // (Note: Already handled in App.tsx typically, but good for internal navigation safety)
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // AppStack: Accessible only to logged-in users
          <Stack.Group screenOptions={{ headerShown: true }}>
            <Stack.Screen 
              name="PostsList" 
              component={PostsListScreen} 
              options={{ title: 'VocaboAi Feed' }}
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
