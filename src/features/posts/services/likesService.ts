import AsyncStorage from '@react-native-async-storage/async-storage';
import { LikedPost } from '../../../shared/types';

const LIKES_STORAGE_KEY = 'liked_posts';

/**
 * likesService
 * Handles persistence of liked posts via AsyncStorage.
 * All liked posts are stored as a JSON array of LikedPost objects.
 */
export const likesService = {
  /**
   * Retrieve all liked posts from storage.
   */
  async getLikedPosts(): Promise<LikedPost[]> {
    try {
      const raw = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LikedPost[]) : [];
    } catch {
      return [];
    }
  },

  /**
   * Check if a specific post is liked.
   */
  async isPostLiked(postId: number): Promise<boolean> {
    const posts = await likesService.getLikedPosts();
    return posts.some(p => p.postId === postId);
  },

  /**
   * Toggle the like status of a post.
   * Returns the new liked state (true = now liked, false = now unliked).
   */
  async toggleLike(postId: number): Promise<boolean> {
    try {
      const posts = await likesService.getLikedPosts();
      const index = posts.findIndex(p => p.postId === postId);

      if (index !== -1) {
        // Already liked — remove it
        posts.splice(index, 1);
        await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(posts));
        return false;
      } else {
        // Not yet liked — add it
        const newEntry: LikedPost = { postId, likedAt: new Date().toISOString() };
        posts.push(newEntry);
        await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(posts));
        return true;
      }
    } catch {
      return false;
    }
  },
};
