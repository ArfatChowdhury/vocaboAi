import { useState } from 'react';
import { googleAuthService } from '../services/googleAuthService';
import { User } from 'firebase/auth';

export const useGoogleSignIn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signIn = async (): Promise<User | null> => {
        setLoading(true);
        setError(null);
        try {
            const user = await googleAuthService.signIn();
            return user;
        } catch (err: any) {
            const message = err.message || 'An error occurred during Google Sign-In';
            setError(message);
            console.error('Google Sign-In Error:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        signIn,
        loading,
        error
    };
};
