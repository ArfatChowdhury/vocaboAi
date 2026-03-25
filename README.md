# VocaboAI

A high-performance React Native blog application with centralized theme management, auth-gated navigation, and optimized data fetching with AsyncStorage caching.

## 🛠️ Setup Instructions

1. **Clone the Repo**
   ```bash
   git clone <repository-url>
   cd vocaboAi
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase & Env**
   Create a `.env` file in the root with your Firebase and Google credentials:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `GOOGLE_WEB_CLIENT_ID`
   - `GOOGLE_ANDROID_CLIENT_ID`

4. **Run on Android**
   ```bash
   npx react-native run-android
   ```

## 🏗️ Architecture

The app follows a strict **3-Layer Architecture** for maximum reusability and separation of concerns:

- **Screens**: Pure UI and interaction logic. Screens **only** call custom hooks for data and state; they never touch services or API endpoints directly.
- **Hooks**: Contain the business and state logic. They call services or the generic `useFetch` hook and expose a standard `{ data, isLoading, error }` interface to the screens.
- **Services**: Pure logic and API methods as plain functions. They have no React imports and are used for making direct external calls or handling complex transformations.

## 📂 Folder Structure

```
src/
├── app/                # App entry point & root providers
├── config/             # Global configurations (Firebase, Theme)
├── features/           # Feature-based architecture
│   ├── auth/           # Login, Sign Up, and Auth hooks
│   └── posts/          # Blog list and Detail views
├── navigation/         # Auth-gated routing system
├── shared/             # Global reusable resources
│   ├── components/     # UI Kit (Button, Input, Card)
│   ├── constants/      # Global Constants (Theme Colors)
│   ├── hooks/          # Generic hooks (useFetch, etc.)
│   └── types/          # Centralized domain model types
```

## 💡 Key Technical Decisions

### ⚡ useFetch with AsyncStorage Caching
Implemented a generic `useFetch` hook that provides an "Offline-First" feel. It checks `AsyncStorage` for cached results to show the user data immediately, then fetches fresh data in the background to update the UI silently.

### 🎨 useTheme Hook vs. Manual Context
To ensure consistent styling and easy dark-mode implementation, every component consumes colors via a custom `useTheme()` hook. This replaces direct `Colors` imports, allowing the entire app to respond to theme changes in real-time.

### 🧩 Feature-Based Folders
Structured the project around **features** (e.g., Auth, Posts) rather than file types. This ensures better scalability by keeping all related logic (hooks, services, screens) together for each functional area.
