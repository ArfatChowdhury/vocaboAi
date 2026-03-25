import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { AuthCredentials, SignUpCredentials } from '../../../shared/types';

export const authService = {
    /**
     * Sign up a new user with email and password
     */
    async signUp({ email, password, displayName }: SignUpCredentials): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (displayName) {
                await updateProfile(user, { displayName });
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message || 'Error signing up');
        }
    },

    /**
     * Sign in an existing user with email and password
     */
    async signIn({ email, password }: AuthCredentials): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error: any) {
            throw new Error(error.message || 'Error signing in');
        }
    },

    /**
     * Sign out the current user
     */
    async logOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw new Error(error.message || 'Error signing out');
        }
    }
};
