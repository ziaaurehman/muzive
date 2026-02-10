import { httpsCallable } from "@react-native-firebase/functions";
import { functions } from './config';

export const callSendVerificationOTP = async () => {
    const callable = httpsCallable(functions, 'sendVerificationOTP');
    try {
        await callable();
    } catch (error: any) {
        // Map errors for UI
        if (error.code === 'functions/too-many-requests') {
            throw new Error('Too many requests. Please wait 1 hour.');
        }
        if (error.code === 'functions/internal') {
            throw new Error('Failed to send code. Try again :(  .');
        }
        throw error;
    }
};

export const callVerifyOTP = async (otp: string) => {
    const callable = httpsCallable(functions, 'verifyOTP');
    try {
        await callable({ otp });
    } catch (error: any) {
        if (error.code === 'functions/deadline-exceeded') {
            throw new Error('Code expired. Resend a new one.');
        }
        if (error.code === 'functions/invalid-argument') {
            throw new Error('Incorrect code.');
        }
        if (error.code === 'functions/not-found') {
            throw new Error('No code found. Resend one.');
        }
        throw error;
    }
};

export const callCreateUserProfile = async (displayName: string) => {
    const callable = httpsCallable(functions, "createUserProfile");
    try {
        const result = await callable({ displayName });
        return result.data;
    } catch (error: any) {
        if (error.code === "functions/already-exists") {
            throw new Error("Profile already exists.");
        }
        if (error.code === "functions/invalid-argument") {
            throw new Error(error.message || "Invalid name.");
        }
        throw new Error("Failed to create profile. Please try again.");
    }
};

export const callSendPasswordResetOTP = async (email: string) => {
    const callable = httpsCallable(functions, "sendPasswordResetOTP");
    try {
        await callable({ email });
    } catch (error: any) {
        if (error.code === "functions/not-found") {
            throw new Error("No account found with this email.");
        }
        if (error.code === "functions/too-many-requests") {
            throw new Error("Too many requests. Please wait 1 hour.");
        }
        if (error.code === "functions/invalid-argument") {
            throw new Error("Invalid email format.");
        }
        throw new Error("Failed to send reset code. Try again.");
    }
};

export const callVerifyPasswordResetOTP = async (email: string, otp: string): Promise<string> => {
    const callable = httpsCallable<{ email: string; otp: string }, { resetToken: string }>(
        functions,
        "verifyPasswordResetOTP"
    );
    try {
        const result = await callable({ email, otp });
        return result.data.resetToken;
    } catch (error: any) {
        if (error.code === "functions/deadline-exceeded") {
            throw new Error("Code expired. Request a new one.");
        }
        if (error.code === "functions/invalid-argument") {
            throw new Error("Incorrect code.");
        }
        if (error.code === "functions/not-found") {
            throw new Error("No reset request found.");
        }
        throw new Error("Verification failed.");
    }
};

export const callResetPassword = async (email: string, newPassword: string, resetToken: string) => {
    const callable = httpsCallable(functions, "resetPassword");
    try {
        await callable({ email, newPassword, resetToken });
    } catch (error: any) {
        if (error.code === "functions/deadline-exceeded") {
            throw new Error("Reset session expired. Start over.");
        }
        if (error.code === "functions/invalid-argument") {
            throw new Error("Invalid password or token.");
        }
        throw new Error("Failed to reset password.");
    }
};