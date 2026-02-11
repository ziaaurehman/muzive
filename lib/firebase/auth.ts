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
): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        if (!userCredential.user) throw new Error("User not found after sign up");
        return userCredential.user;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('❌ That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
            console.log('❌ That email address is invalid!');
        }
        console.error("Sign up error:", error);
        throw new Error(error.message || "Failed to create account");
    }
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
        // Import dynamically to avoid requirement if not used elsewhere, 
        // but since we use it in LoginScreen it's already a dependency.
        const { GoogleSignin } = require('@react-native-google-signin/google-signin');

        // Comprehensive sign out:
        // 1. Google Sign Out (if applicable)
        try {
            if (await GoogleSignin.isSignedIn()) {
                await GoogleSignin.signOut();
            }
        } catch (e) {
            console.log("Google Sign out error (ignored):", e);
        }

        // 2. Firebase Sign Out
        await signOut(auth);
    } catch (error: any) {
        // If the error is that no user is signed in, we can consider this a successful logout
        if (error.code === 'auth/no-current-user') {
            return;
        }
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