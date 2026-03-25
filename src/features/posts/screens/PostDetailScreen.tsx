import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import usePostDetail from '../hooks/usePostDetail';
import useLikes from '../hooks/useLikes';
import { useTheme } from '../../../config/ThemeContext';

type PostDetailRouteProp = RouteProp<{ PostDetail: { postId: number } }, 'PostDetail'>;

/**
 * PostDetailScreen
 * Premium redesign: hero header with post # and read time, beautiful body text,
 * floating like button, comment cards with email avatar initials.
 */
const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { post, comments, isLoading, error } = usePostDetail(postId);
  const { isLiked, likeCount, toggleLike } = useLikes(postId);
  const { colors } = useTheme();
  const s = styles(colors);
  const insets = useSafeAreaInsets();

  if (isLoading && !post) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={s.loadingText}>Loading article…</Text>
      </View>
    );
  }

  if (error && !post) {
    return (
      <View style={s.center}>
        <Text style={s.errorEmoji}>📡</Text>
        <Text style={s.errorTitle}>Failed to load</Text>
        <Text style={s.errorSub}>{error}</Text>
        <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()}>
          <Text style={s.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!post) return null;

  const wordCount = post.body.split(' ').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split(/[._-]/);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '?').join('');
  };

  const getCommentColor = (index: number) => {
    const hues = [216, 152, 39, 280, 8, 170, 52, 320];
    return `hsl(${hues[index % hues.length]}, 70%, 55%)`;
  };


  return (
    <SafeAreaView edges={['bottom']} style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ── Hero Section ── */}
        <View style={s.hero}>
          {/* Top meta row */}
          <View style={s.heroMetaRow}>
            <View style={s.postBadge}>
              <Text style={s.postBadgeText}>Post #{postId}</Text>
            </View>
            <View style={s.readTimePill}>
              <Text style={s.readTimeIcon}>⏱</Text>
              <Text style={s.readTimeText}>{readTime} min read</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={s.heroTitle}>{post.title}</Text>

          {/* Divider accent */}
          <View style={s.accentBar} />
        </View>

        {/* ── Article Body ── */}
        <View style={s.bodySection}>
          <Text style={s.bodyText}>{post.body}</Text>
        </View>

        {/* ── Like Section ── */}
        <View style={s.likeSection}>
          <TouchableOpacity
            style={[s.likeButton, isLiked && s.likeButtonActive]}
            onPress={toggleLike}
            activeOpacity={0.8}
          >
            <Text style={s.likeIcon}>{isLiked ? '♥' : '♡'}</Text>
            <Text style={[s.likeLabel, isLiked && s.likeLabelActive]}>
              {isLiked ? 'Liked' : 'Like this article'}
            </Text>
            {likeCount > 0 && (
              <View style={s.likeCountBubble}>
                <Text style={s.likeCountText}>{likeCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Comments Section ── */}
        <View style={s.commentsSection}>
          <View style={s.commentsSectionHeader}>
            <Text style={s.commentsTitle}>Comments</Text>
            {comments && (
              <View style={s.commentCountPill}>
                <Text style={s.commentCountText}>{comments.length}</Text>
              </View>
            )}
          </View>

          {!comments ? (
            <View style={s.commentsLoader}>
              <ActivityIndicator color={colors.primary} />
              <Text style={s.loadingComments}>Loading comments…</Text>
            </View>
          ) : (
            comments.map((comment, index) => {
              const initials = getInitials(comment.email);
              const avatarColor = getCommentColor(index);

              return (
                <View key={comment.id} style={s.commentCard}>
                  {/* Avatar + author row */}
                  <View style={s.commentHeader}>
                    <View style={[s.commentAvatar, { backgroundColor: avatarColor }]}>
                      <Text style={s.commentAvatarText}>{initials}</Text>
                    </View>
                    <View style={s.commentAuthorInfo}>
                      <Text style={s.commentName} numberOfLines={1}>
                        {comment.name}
                      </Text>
                      <Text style={s.commentEmail} numberOfLines={1}>
                        {comment.email}
                      </Text>
                    </View>
                  </View>
                  {/* Comment body */}
                  <Text style={s.commentBody}>{comment.body}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 56 },

  // ── Hero ──
  hero: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    marginBottom: 4,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  postBadge: {
    backgroundColor: colors.badge.bg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  postBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.badge.text,
    letterSpacing: 0.3,
  },
  readTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  readTimeIcon: { fontSize: 11 },
  readTimeText: { fontSize: 12, color: colors.text.secondary, fontWeight: '500' },

  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    lineHeight: 34,
    letterSpacing: -0.3,
    textTransform: 'capitalize',
  },

  accentBar: {
    marginTop: 20,
    height: 3,
    width: 48,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  // ── Body ──
  bodySection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.surface,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 28,
    letterSpacing: 0.1,
  },

  // ── Like ──
  likeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.surface,
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.input.background,
    gap: 8,
  },
  likeButtonActive: {
    backgroundColor: '#FFF1F1',
    borderColor: colors.like,
  },
  likeIcon: { fontSize: 22, color: colors.like },
  likeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  likeLabelActive: { color: colors.like },
  likeCountBubble: {
    backgroundColor: colors.like,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  likeCountText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // ── Comments ──
  commentsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: colors.surface,
    paddingBottom: 20,
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  commentCountPill: {
    backgroundColor: colors.badge.bg,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.badge.text,
  },

  commentsLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingComments: { fontSize: 14, color: colors.text.secondary },

  commentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.card,
    backgroundColor: colors.background,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  commentAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  commentAuthorInfo: { flex: 1 },
  commentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  commentEmail: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 1,
  },
  commentBody: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 21,
  },

  // ── States ──
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 32,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: colors.text.secondary },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 6,
  },
  errorSub: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  backButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});

export default PostDetailScreen;
