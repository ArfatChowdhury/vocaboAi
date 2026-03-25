import { useState, useEffect, useCallback } from 'react';
import { likesService } from '../services/likesService';

interface UseLikesReturn {
  isLiked: boolean;
  likeCount: number;
  toggleLike: () => Promise<void>;
  loading: boolean;
}

/**
 * useLikes
 * Manages the like state for a single post, persisted via AsyncStorage.
 * Uses likesService for all storage operations.
 */
const useLikes = (postId: number): UseLikesReturn => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load persisted like state on mount
  useEffect(() => {
    let isMounted = true;

    likesService.isPostLiked(postId).then(liked => {
      if (isMounted) {
        setIsLiked(liked);
        setLikeCount(liked ? 1 : 0);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [postId]);

  const toggleLike = useCallback(async () => {
    try {
      const nowLiked = await likesService.toggleLike(postId);
      setIsLiked(nowLiked);
      setLikeCount(nowLiked ? 1 : 0);
    } catch {
      // no-op if storage fails — UI stays in last known state
    }
  }, [postId]);

  return { isLiked, likeCount, toggleLike, loading };
};

export default useLikes;
