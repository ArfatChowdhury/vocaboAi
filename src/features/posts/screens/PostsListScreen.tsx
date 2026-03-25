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
import { colors as Colors } from '../../../shared/constants/Colors';
import ThemeContext from '../../../config/ThemeContext';

/**
 * PostsListScreen
 * Displays a scrollable list of blog posts from JSONPlaceholder.
 * Uses usePosts hook for data, caching, and state management.
 */
const PostsListScreen = () => {
  const navigation = useNavigation<any>();
  const { data: posts, isLoading, error } = usePosts();
  const themeContext = React.useContext(ThemeContext);

  // Center indicator while loading initial data
  if (isLoading && !posts) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Display error message if fetch fails and no cache exists
  if (error && !posts) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.error.text,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PostsListScreen;
