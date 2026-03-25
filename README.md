# VocaboAi

A production-ready React Native blog application built with Firebase, featuring clean feature-based architecture, reusable components, custom hooks, and offline-first data caching.

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
git clone <repository-url>
cd vocaboAi
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_WEB_CLIENT_ID=your_web_client_id
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
```

> **Google Sign-In**: Add your Android SHA-1 fingerprint to your Firebase project under Project Settings → Your Apps → Android app.
>
> To get your debug SHA-1: `cd android && ./gradlew signingReport`

### 3. Run on Android

```bash
npx react-native run-android
```

### 4. Build Debug APK

```bash
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. Build Release APK

```bash
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🏗️ Architecture

The app follows a **3-Layer Feature Architecture**:

| Layer | Responsibility |
|-------|---------------|
| **Screens** | UI rendering + user interaction only. Never calls APIs directly. |
| **Hooks** | Business logic, state management, and service orchestration. |
| **Services** | Pure functions with no React imports — direct API/storage calls. |

### Why Feature-Based Folders?

Rather than grouping by file type (`screens/`, `hooks/`, `services/` at the root), all related logic lives together per feature. This means `auth/` and `posts/` each own their entire vertical slice — easier to navigate, scale, and hand off to teammates.

---

## 📂 Folder Structure

```
src/
├── app/                    # App entry point & root providers
│   ├── App.tsx             # Provider tree (ErrorBoundary → SafeArea → Theme → Auth)
│   └── index.tsx           # AppRegistry entry point
│
├── config/                 # Global configuration
│   ├── firebase.ts         # Firebase app + auth initialization
│   └── ThemeContext.tsx    # Light/dark theme provider + useTheme hook
│
├── features/               # Feature-based modules
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx         # AuthContext + Provider + useAuth hook
│   │   │   └── useGoogleSignIn.ts  # Google Sign-In with loading/error state
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   └── services/
│   │       ├── authService.ts        # Email/password auth (Firebase)
│   │       └── googleAuthService.ts  # Google Sign-In (native SDK → Firebase)
│   │
│   └── posts/
│       ├── hooks/
│       │   ├── usePosts.ts       # Wraps useFetch for /posts
│       │   ├── usePostDetail.ts  # Concurrent post + comments fetch
│       │   └── useLikes.ts       # Persisted like state via AsyncStorage
│       ├── screens/
│       │   ├── PostsListScreen.tsx
│       │   └── PostDetailScreen.tsx
│       └── services/
│           └── likesService.ts   # AsyncStorage CRUD for liked posts
│
├── navigation/
│   └── RootNavigator.tsx   # Auth-gated stack (AuthStack ↔ AppStack)
│
└── shared/                 # App-wide reusable resources
    ├── components/
    │   ├── AuthLayout.tsx    # Full-screen auth page wrapper
    │   ├── Button.tsx        # Primary CTA button with loading state
    │   ├── Card.tsx          # Post list card
    │   ├── ErrorBoundary.tsx # Class-based crash boundary with reset
    │   └── Input.tsx         # Labelled text input with error display
    ├── constants/
    │   └── Colors.ts         # Light + dark color palettes
    ├── hooks/
    │   └── useFetch.ts       # Generic fetch hook with AsyncStorage caching
    └── types/
        └── index.ts          # Centralized domain types (Post, Comment, etc.)
```

---

## 💡 Key Technical Decisions

### ⚡ `useFetch` with Offline-First Caching
`useFetch<T>(endpoint)` checks AsyncStorage first to show cached data immediately, then fetches fresh data in the background. If the network fails but a cache exists, the error is suppressed — users always see something useful.

### 🎨 `useTheme` — Dynamic Light/Dark Mode
Every component that renders colors calls `useTheme()` instead of importing from `Colors.ts` directly. When the device switches between light and dark mode, the entire UI responds instantly. The theme context serves either `lightColors` or `darkColors` from a single switch.

### 💾 `useLikes` + `likesService` — Persisted Like State
The Like button on PostDetailScreen uses `useLikes(postId)`, which reads/writes to AsyncStorage via `likesService`. Likes survive navigation, screen unmounts, and app restarts.

### 🧩 Feature-Based Modules
`auth/` and `posts/` are self-contained slices. Adding a new feature (e.g., `profile/`) means creating a new folder with its own hooks, screens, and services without touching anything else.

### 🛡️ `ErrorBoundary`
A class-based error boundary wraps the entire app. It catches uncaught render errors and shows a user-friendly "Try Again" screen instead of crashing silently.

---

## 🔐 Authentication Flow

1. User opens app → Firebase auth listener fires (`onAuthStateChanged`)
2. If `user === null` → **AuthStack** (Login / SignUp)
3. Login with email+password → `authService.signIn()` → Firebase SDK
4. Login with Google → `googleAuthService.signIn()` → Google SDK → Firebase credential
5. On success → Firebase sets `user` → React state updates → **AppStack** shown
6. Logout → `logOut()` in header → both Google and Firebase signed out → **AuthStack** shown
