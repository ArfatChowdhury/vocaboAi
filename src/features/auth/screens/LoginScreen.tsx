import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { AuthLayout } from '../../../shared/components/AuthLayout';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useTheme } from '../../../config/ThemeContext';

export const LoginScreen = () => {
    const { colors } = useTheme();
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

    const footer = (
        <View style={styles(colors).footerRow}>
            <Text style={styles(colors).footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => console.log('Navigate to SignUp')}>
                <Text style={styles(colors).footerLink}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your VocaboAi account"
            footer={footer}
        >
            <Input
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
            />

            <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
            />

            <View style={styles(colors).spacing} />

            <Button
                label="Sign In"
                onPress={handleEmailSignIn}
                isLoading={authLoading}
            />

            <View style={styles(colors).divider}>
                <View style={styles(colors).line} />
                <Text style={styles(colors).dividerText}>OR</Text>
                <View style={styles(colors).line} />
            </View>

            <TouchableOpacity
                style={styles(colors).googleButton}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
            >
                {googleLoading ? (
                    <ActivityIndicator color={colors.black} />
                ) : (
                    <View style={styles(colors).googleButtonContent}>
                        <View style={styles(colors).googleIconPlaceholder} />
                        <Text style={styles(colors).googleButtonText}>Sign in with Google</Text>
                    </View>
                )}
            </TouchableOpacity>
        </AuthLayout>
    );
};

const styles = (colors: any) => StyleSheet.create({
    spacing: {
        height: 10,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border.default,
    },
    dividerText: {
        marginHorizontal: 15,
        color: colors.text.placeholder,
        fontSize: 14,
    },
    googleButton: {
        backgroundColor: colors.white,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border.google,
    },
    googleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    googleIconPlaceholder: {
        width: 24,
        height: 24,
        backgroundColor: colors.social.google,
        marginRight: 10,
        borderRadius: 4,
    },
    googleButtonText: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        color: colors.text.secondary,
        fontSize: 14,
    },
    footerLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
