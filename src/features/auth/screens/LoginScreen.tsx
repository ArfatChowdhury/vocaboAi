import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

export const LoginScreen = () => {
    const { signIn: emailSignIn, loading: authLoading } = useAuth();
    const { signIn: googleSignIn, loading: googleLoading } = useGoogleSignIn();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }
        try {
            await emailSignIn({ email, password });
        } catch (err: any) {
            Alert.alert('Login Failed', err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const user = await googleSignIn();
        if (user) {
            console.log('Signed in with Google:', user.email);
        }
    };

    const isLoading = authLoading || googleLoading;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome to VocaboAi</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                <View style={styles.form}>
                    {/* Simplified Form for UI demonstration */}
                    <View style={styles.placeholderInput}>
                       <Text style={styles.placeholderText}>Email and Password fields would go here</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleEmailSignIn}
                        disabled={isLoading}
                    >
                        {authLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        {googleLoading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <View style={styles.googleButtonContent}>
                                <View style={styles.googleIconPlaceholder} />
                                <Text style={styles.googleButtonText}>Sign in with Google</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    form: {
        width: '100%',
    },
    placeholderInput: {
        height: 100,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#007AFF',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#999',
        fontSize: 14,
    },
    googleButton: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
    },
    googleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    googleIconPlaceholder: {
        width: 24,
        height: 24,
        backgroundColor: '#4285F4', // Google Blue
        marginRight: 10,
        borderRadius: 4,
    },
    googleButtonText: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: '600',
    },
});
