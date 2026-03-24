// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    initializeAuth,
    browserLocalPersistence,
    // @ts-ignore - getReactNativePersistence is not properly exported in types
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Dynamically get React Native persistence to avoid TypeScript errors
let getReactNativePersistence: any;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authModule = require('firebase/auth');
    getReactNativePersistence = authModule.getReactNativePersistence;
} catch (e) {
    // Fallback if module structure is different
    getReactNativePersistence = () => browserLocalPersistence;
}

export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = (() => {
    try {
        // Prefer AsyncStorage-based persistence on React Native if available
        let persistence = browserLocalPersistence;
        try {
            // dynamic require so the app still runs if the package isn't installed
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const RNAsyncStorage = require("@react-native-async-storage/async-storage").default;
            if (RNAsyncStorage && getReactNativePersistence) {
                persistence = getReactNativePersistence(RNAsyncStorage as any);
            }
        } catch (err) {
            // package not installed or require failed — fall back to browserLocalPersistence
        }

        return initializeAuth(app, {
            persistence,
        });
    } catch (e) {
        // Fallback to regular getAuth if initializeAuth is not available or already initialized
        return getAuth(app);
    }
})();

export default app;