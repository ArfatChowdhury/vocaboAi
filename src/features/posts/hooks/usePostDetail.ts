import useFetch from '../../../shared/hooks/useFetch';
import { Post, Comment, PostDetailState } from '../../../shared/types';

const usePostDetail = (postId: number): PostDetailState => {
  // Fetch the post by its id
  const { data: post, isLoading: postLoading, error: postError } = useFetch<Post>(`/posts/${postId}`);

  // Fetch all comments that belong to this post
  const { data: comments, isLoading: commentsLoading } = useFetch<Comment[]>(`/posts/${postId}/comments`);

  return {
    post,
    comments,
    isLoading: postLoading || commentsLoading,
    error: postError,
  };
};

export default usePostDetail;
