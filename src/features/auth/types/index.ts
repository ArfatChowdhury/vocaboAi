export interface AuthCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials extends AuthCredentials {
    displayName?: string;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}
