import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import usePostDetail from '../hooks/usePostDetail';
import useLikes from '../hooks/useLikes';
import { useTheme } from '../../../config/ThemeContext';

// Define the navigation params expected for this screen
type PostDetailRouteProp = RouteProp<{ PostDetail: { postId: number } }, 'PostDetail'>;

/**
 * PostDetailScreen
 * Shows full post content, like interaction, and a list of comments.
 * Uses usePostDetail for concurrent post+comments fetch with AsyncStorage caching.
 * Uses useLikes for persisted like state that survives navigation and app restarts.
 */
const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params;
  const { post, comments, isLoading, error } = usePostDetail(postId);
  const { isLiked, likeCount, toggleLike } = useLikes(postId);
  const { colors } = useTheme();

  // Center indicator while fetching data
  if (isLoading && !post) {
    return (
      <View style={styles(colors).centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show error if initial fetch fails
  if (error && !post) {
    return (
      <View style={styles(colors).centerContainer}>
        <Text style={styles(colors).errorText}>{error}</Text>
      </View>
    );
  }

  if (!post) return null;

  return (
    <SafeAreaView style={styles(colors).container}>
      <ScrollView
        style={styles(colors).scrollView}
        contentContainerStyle={styles(colors).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Post Header */}
        <Text style={styles(colors).title}>{post.title}</Text>
        <Text style={styles(colors).bodyText}>{post.body}</Text>

        {/* Interaction Row */}
        <View style={styles(colors).interactionRow}>
          <TouchableOpacity
            style={styles(colors).likeButton}
            onPress={toggleLike}
            activeOpacity={0.7}
          >
            <Text style={[
              styles(colors).heartIcon,
              isLiked && styles(colors).heartIconActive
            ]}>
              {isLiked ? '♥' : '♡'}
            </Text>
            <Text style={styles(colors).likeCountText}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles(colors).divider} />

        {/* Comments Section */}
        <Text style={styles(colors).commentsHeading}>Comments</Text>
        {comments ? (
          comments.map((comment) => (
            <View key={comment.id} style={styles(colors).commentCard}>
              <Text style={styles(colors).commentName}>{comment.name}</Text>
              <Text style={styles(colors).commentBody}>{comment.body}</Text>
            </View>
          ))
        ) : (
          <ActivityIndicator color={colors.primary} style={styles(colors).commentsLoader} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    lineHeight: 32,
  },
  bodyText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heartIcon: {
    fontSize: 24,
    color: colors.text.secondary,
    marginRight: 6,
  },
  heartIconActive: {
    color: colors.error.text,
  },
  likeCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginBottom: 24,
  },
  commentsHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  commentCard: {
    backgroundColor: colors.input.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  commentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  commentBody: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  commentsLoader: {
    marginTop: 20,
  },
  errorText: {
    color: colors.error.text,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PostDetailScreen;
