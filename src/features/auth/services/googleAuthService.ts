import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { 
    GoogleAuthProvider, 
    signInWithCredential, 
    User 
} from 'firebase/auth';
import { auth } from '../../../config/firebase';

export const googleAuthService = {
    /**
     * Configure Google Sign-In with the Web Client ID from Firebase
     */
    configure(): void {
        const webClientId = process.env.GOOGLE_WEB_CLIENT_ID || '1053891785607-qni3iq7bb9u33p2um31hddpkmp9b8ajr.apps.googleusercontent.com';
        if (!webClientId) {
            console.warn('Google Sign-In: webClientId is missing in .env');
        }
        
        GoogleSignin.configure({
            webClientId: webClientId,
            offlineAccess: true,
        });
    },

    /**
     * Sign in with Google
     */
    async signIn(): Promise<User> {
        try {
            // Check if play services are available
            await GoogleSignin.hasPlayServices();
            
            // Get user info from Google
            const userInfo = await GoogleSignin.signIn();
            
            // Get tokens
            const { idToken } = userInfo.data || {};
            if (!idToken) {
                throw new Error('Google Sign-In: No ID token received');
            }
            
            // Create Firebase credential
            const credential = GoogleAuthProvider.credential(idToken);
            
            // Sign in to Firebase
            const userCredential = await signInWithCredential(auth, credential);
            return userCredential.user;
        } catch (error: any) {
            throw new Error(error.message || 'Error signing in with Google');
        }
    },

    /**
     * Sign out from Google and Firebase
     */
    async logOut(): Promise<void> {
        try {
            await GoogleSignin.signOut();
        } catch (error: any) {
            console.error('Error signing out from Google', error);
        }
    }
};
