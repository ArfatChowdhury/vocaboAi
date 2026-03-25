import useFetch from '../../../shared/hooks/useFetch';
import { Post, FetchState } from '../../../shared/types';

// This hook gives any screen the full list of posts
// useFetch handles fetching, caching, and error state automatically
const usePosts = (): FetchState<Post[]> => {
  return useFetch<Post[]>('/posts');
};

export default usePosts;
