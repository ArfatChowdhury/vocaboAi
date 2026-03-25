import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import usePosts from '../hooks/usePosts';
import { useTheme } from '../../../config/ThemeContext';
import { Post } from '../../../shared/types';

/**
 * PostsListScreen
 * Premium redesign: numbered badges, reading-time estimate,
 * author avatar generated from userId, offline-first via usePosts.
 */
const PostsListScreen = () => {
  const navigation = useNavigation<any>();
  const { data: posts, isLoading, error } = usePosts();
  const { colors } = useTheme();
  const s = styles(colors);

  if (isLoading && !posts) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={s.loadingText}>Loading articles…</Text>
      </View>
    );
  }

  if (error && !posts) {
    return (
      <View style={s.center}>
        <Text style={s.errorEmoji}>📡</Text>
        <Text style={s.errorTitle}>No connection</Text>
        <Text style={s.errorSub}>{error}</Text>
      </View>
    );
  }

  const getReadTime = (body: string) =>
    Math.max(1, Math.ceil(body.split(' ').length / 200));

  const getAvatarColors = (userId: number) => {
    const palettes = [
      { bg: '#FDE68A', fg: '#92400E' }, // amber
      { bg: '#A7F3D0', fg: '#065F46' }, // emerald
      { bg: '#BFDBFE', fg: '#1E40AF' }, // blue
      { bg: '#DDD6FE', fg: '#5B21B6' }, // violet
      { bg: '#FCA5A5', fg: '#7F1D1D' }, // red
      { bg: '#FED7AA', fg: '#7C2D12' }, // orange
      { bg: '#BAE6FD', fg: '#0C4A6E' }, // sky
      { bg: '#D9F99D', fg: '#365314' }, // lime
      { bg: '#FBCFE8', fg: '#831843' }, // pink
      { bg: '#E9D5FF', fg: '#581C87' }, // purple
    ];
    return palettes[(userId - 1) % palettes.length];
  };

  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    const avatar = getAvatarColors(item.userId);
    const readTime = getReadTime(item.body);

    return (
      <TouchableOpacity
        style={s.card}
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        activeOpacity={0.75}
      >
        {/* Number badge + avatar row */}
        <View style={s.cardTop}>
          <View style={[s.avatar, { backgroundColor: avatar.bg }]}>
            <Text style={[s.avatarText, { color: avatar.fg }]}>
              U{item.userId}
            </Text>
          </View>
          <View style={s.metaRight}>
            <View style={s.badge}>
              <Text style={s.badgeText}>#{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <Text style={s.readTime}>{readTime} min read</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={s.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Preview */}
        <Text style={s.cardBody} numberOfLines={2}>
          {item.body}
        </Text>

        {/* Footer row */}
        <View style={s.cardFooter}>
          <Text style={s.readMore}>Read article</Text>
          <Text style={s.arrow}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={s.listHeader}>
      <Text style={s.listTitle}>Latest Articles</Text>
      <Text style={s.listCount}>{posts?.length ?? 0} stories</Text>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
    paddingBottom: 40,
  },

  // List header
  listHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  listTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  listCount: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.badge.bg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.badge.text,
    letterSpacing: 0.5,
  },
  readTime: {
    fontSize: 12,
    color: colors.text.muted,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 8,
    letterSpacing: -0.2,
    textTransform: 'capitalize',
  },
  cardBody: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 14,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    paddingTop: 12,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  arrow: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },

  // States
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
  },
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
  },
});

export default PostsListScreen;
