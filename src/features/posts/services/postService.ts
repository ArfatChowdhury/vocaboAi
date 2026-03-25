import { Post, Comment } from '../../../shared/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetches all posts from the API
 */
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch posts');
  }
};

/**
 * Fetches a single post by its ID
 */
export const getPostById = async (id: number): Promise<Post> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch post with ID ${id}`);
  }
};

/**
 * Fetches all comments for a specific post
 */
export const getComments = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch comments for post ${postId}`);
  }
};
