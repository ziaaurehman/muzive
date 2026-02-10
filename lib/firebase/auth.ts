import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithCredential,
    signInAnonymously,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FirebaseAuthTypes,
    getAuth
} from "@react-native-firebase/auth";
import { auth } from "./config";

if (!auth) {
    console.error("🚨 Firebase Auth instance is undefined! Native module might be missing.");
}

// Types for convenience
export type User = FirebaseAuthTypes.User;
export type UserCredential = FirebaseAuthTypes.UserCredential;

// ── Email/Password Sign Up
export const signUpWithEmail = async (
    email: string,
    password: string
) => {
    return createUserWithEmailAndPassword(getAuth(), email, password)
        .then((user) => {
            console.log('User account created & signed in!');
            return user.user;
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.error(error);
            throw new Error(error.message || "Failed to create account");
        });
    // try {
    //     console.log('🔐 Attempting sign up with:', { email });
    //     console.log('📡 Auth instance:', auth ? 'Available' : 'Undefined');
    //     const userCredential = await createUserWithEmailAndPassword(
    //         auth,
    //         email,
    //         password
    //     );
    //     if (!userCredential.user) throw new Error("User not found after sign up");
    //     return userCredential.user;
    // } catch (error: any) {
    //     console.error("Sign up error:");
    //     console.log({ error });

    //     throw new Error(error.message || "Failed to create account");
    // }
};

// ── Email/Password Sign In
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        if (!userCredential.user) throw new Error("User not found after sign in");
        return userCredential.user;
    } catch (error: any) {
        console.error("Sign in error:", error);
        throw new Error(error.message || "Invalid email or password");
    }
};

// ── Google Sign In
export const signInWithGoogle = async (idToken: string): Promise<User> => {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        if (!userCredential.user) throw new Error("User not found after Google sign in");
        return userCredential.user;
    } catch (error: any) {
        console.error("Google sign in error:", error);
        throw new Error(error.message || "Google sign in failed");
    }
};

// ── Anonymous / Guest Sign In
export const signInAsGuest = async (): Promise<User> => {
    try {
        const userCredential = await signInAnonymously(auth);
        if (!userCredential.user) throw new Error("User not found after guest sign in");
        return userCredential.user;
    } catch (error: any) {
        console.error("Guest sign in error:", error);
        throw new Error(error.message || "Guest mode failed");
    }
};

// ── Sign Out
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        console.error("Sign out error:", error);
        throw new Error("Failed to sign out");
    }
};

// ── Send Password Reset Email
export const sendResetEmailLink = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw new Error(error.message || "Failed to send reset email");
    }
};