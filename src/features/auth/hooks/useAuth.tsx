import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { authService } from '../services/authService';
import { googleAuthService } from '../services/googleAuthService';
import { AuthCredentials, SignUpCredentials } from '../../../shared/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (credentials: AuthCredentials) => Promise<void>;
    signUp: (credentials: SignUpCredentials) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Configure Google Sign-In
        googleAuthService.configure();

        // Listen for internal auth state changes
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (credentials: AuthCredentials) => {
        setLoading(true);
        try {
            await authService.signIn(credentials);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (credentials: SignUpCredentials) => {
        setLoading(true);
        try {
            await authService.signUp(credentials);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            await googleAuthService.signIn();
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await googleAuthService.logOut(); // Sign out from Google if needed
            await authService.logOut();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
