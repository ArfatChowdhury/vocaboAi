// All app types live here — import from this file everywhere
// Example: import { Post } from '../../shared/types'

// A single post from the JSONPlaceholder API
export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

// A comment belonging to a post
export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

// Generic shape that every data-fetching hook returns
export interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

// A liked post saved locally in AsyncStorage
export interface LikedPost {
  postId: number
  likedAt: string
}

// State for a single post with its comments
export interface PostDetailState {
  post: Post | null
  comments: Comment[] | null
  isLoading: boolean
  error: string | null
}
// Credentials for signing in
export interface AuthCredentials {
  email: string
  password: string
}

// Credentials for signing up (includes optional display name)
export interface SignUpCredentials extends AuthCredentials {
  displayName?: string
}
