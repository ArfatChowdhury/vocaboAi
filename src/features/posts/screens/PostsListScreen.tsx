import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import usePosts from '../hooks/usePosts';
import { Card } from '../../../shared/components/Card';
import { useTheme } from '../../../config/ThemeContext';

/**
 * PostsListScreen
 * Displays a scrollable list of blog posts from JSONPlaceholder.
 * Uses usePosts hook for data, caching, and state management.
 * Uses useTheme hook for dynamic dark/light mode switching.
 */
const PostsListScreen = () => {
  const navigation = useNavigation<any>();
  const { data: posts, isLoading, error } = usePosts();
  const { colors } = useTheme();

  // Center indicator while loading initial data
  if (isLoading && !posts) {
    return (
      <View style={styles(colors).centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Display error message if fetch fails and no cache exists
  if (error && !posts) {
    return (
      <View style={styles(colors).centerContainer}>
        <Text style={styles(colors).errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles(colors).container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            body={item.body}
            // Navigate to detail screen on press
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
          />
        )}
        contentContainerStyle={styles(colors).listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error.text,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PostsListScreen;
