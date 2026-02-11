// functions/src/index.ts
import admin from 'firebase-admin';
import { Timestamp } from "firebase-admin/firestore";
import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as crypto from "crypto";
import sgMail from '@sendgrid/mail';

// Initialize Admin SDK (only once)
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// Load SendGrid key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
    console.log(`Setting SendGrid API Key (starts with: ${apiKey.substring(0, 3)}...)`);
    sgMail.setApiKey(apiKey);
} else {
    console.error("SENDGRID_API_KEY is missing from process.env!");
}

// Helper: Generate 6-digit OTP
const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Hash OTP (SHA-256)
const hashOTP = (otp: string): string => crypto.createHash("sha256").update(otp).digest("hex");

// ── Send Verification OTP
export const sendVerificationOTP = onCall(
    { region: "asia-south1" }, // optional: match your functions region
    async (request: CallableRequest<unknown>) => {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "Must be logged in.");
        }

        const userId = request.auth.uid;
        const user = await admin.auth().getUser(userId);
        const email = user.email;
        if (!email) {
            throw new HttpsError("invalid-argument", "No email for this user.");
        }

        // Rate limit: max 3 OTPs per hour
        const oneHourAgo = Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));
        const recentCount = await db
            .collection("otps")
            .where("userId", "==", userId)
            .where("createdAt", ">", oneHourAgo)
            .count()
            .get();

        if (recentCount.data().count >= 3) {
            throw new HttpsError("resource-exhausted", "Too many requests. Wait 1 hour.");
        }

        const otp = generateOTP();
        const otpHash = hashOTP(otp);
        const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));
        const createdAt = Timestamp.now();

        await db.collection("otps").doc(`${userId}-verify`).set({
            otpHash,
            expiresAt,
            createdAt,
            userId,
            email,
        });

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: "Muzive Verification Code",
            text: `Your code is: ${otp}. Expires in 10 minutes.`,
            html: `<p>Your code is: <strong>${otp}</strong>. Expires in 10 minutes.</p>`,
        };

        try {
            console.log(`Attempting to send OTP to ${email}...`);
            await sgMail.send(msg);
            console.log("Email sent successfully via SendGrid.");
        } catch (error: any) {
            console.error("Error sending email via SendGrid:", error);
            if (error.response) {
                console.error("SendGrid Error Response:", error.response.body);
            }
        }

        return { success: true };
    }
);

// ── Verify OTP
export const verifyOTP = onCall(
    { region: "asia-south1" },
    async (request: CallableRequest<{ otp: string }>) => {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "Must be logged in.");
        }

        const { otp } = request.data;

        if (typeof otp !== "string" || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            throw new HttpsError("invalid-argument", "Invalid OTP.");
        }

        const userId = request.auth.uid;
        const docRef = db.collection("otps").doc(`${userId}-verify`);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new HttpsError("not-found", "No OTP found.");
        }

        const { otpHash, expiresAt } = doc.data() as { otpHash: string; expiresAt: Timestamp };

        if (expiresAt.toDate() < new Date()) {
            await docRef.delete();
            throw new HttpsError("deadline-exceeded", "OTP expired.");
        }

        if (hashOTP(otp) !== otpHash) {
            throw new HttpsError("invalid-argument", "Incorrect OTP.");
        }

        await admin.auth().updateUser(userId, { emailVerified: true });
        await docRef.delete();

        return { success: true };
    }
);

// ── Create User Profile (called after verification)
export const createUserProfile = onCall(
    { region: "asia-south1" },
    async (request: CallableRequest<{ displayName: string }>) => {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "Must be logged in.");
        }

        const { displayName } = request.data;
        if (typeof displayName !== "string" || displayName.trim().length < 2) {
            throw new HttpsError("invalid-argument", "Valid display name required (min 2 characters).");
        }

        const userId = request.auth.uid;
        const user = await admin.auth().getUser(userId);

        // Prevent overwriting if profile already exists (optional – remove if you want merge)
        const profileRef = db.collection("users").doc(userId);
        const profileSnap = await profileRef.get();
        if (profileSnap.exists) {
            throw new HttpsError("already-exists", "Profile already created.");
        }

        await profileRef.set({
            displayName: displayName.trim(),
            email: user.email || null,
            role: "user",                    // default – upgrade later for BO/MP/Admin
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            // Add more fields later: musicStyles, location, etc.
        });

        return { success: true, message: "Profile created successfully." };
    }
);

// ── Send Password Reset OTP (by email)
export const sendPasswordResetOTP = onCall(
    { region: "asia-south1" },
    async (request: CallableRequest<{ email: string }>) => {
        const { email } = request.data;
        if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new HttpsError("invalid-argument", "Valid email required.");
        }

        let user;
        try {
            user = await admin.auth().getUserByEmail(email);
        } catch (err) {
            throw new HttpsError("not-found", "No account found with this email.");
        }

        // Rate limit: max 3 reset OTPs per hour per user
        const oneHourAgo = Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));
        const recentCount = await db
            .collection("otps")
            .where("userId", "==", user.uid)
            .where("type", "==", "reset")
            .where("createdAt", ">", oneHourAgo)
            .count()
            .get();

        if (recentCount.data().count >= 3) {
            throw new HttpsError("resource-exhausted", "Too many reset requests. Wait 1 hour.");
        }

        const otp = generateOTP();
        const otpHash = hashOTP(otp);
        const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000)); // 10 min
        const createdAt = Timestamp.now();

        // Store with type to distinguish from signup OTP
        await db.collection("otps").doc(`${user.uid}-reset`).set({
            otpHash,
            expiresAt,
            createdAt,
            userId: user.uid,
            email,
            type: "reset",
        });

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: "Muzive Password Reset Code",
            text: `Your reset code is: ${otp}. Expires in 10 minutes. If you didn't request this, ignore it.`,
            html: `<p>Your reset code is: <strong>${otp}</strong>. Expires in 10 minutes.</p><p>If you didn't request this, please ignore this email.</p>`,
        };

        try {
            console.log(`Attempting to send reset OTP to ${email}...`);
            await sgMail.send(msg);
            console.log("Reset email sent successfully via SendGrid.");
        } catch (error: any) {
            console.error("Error sending reset email via SendGrid:", error);
            if (error.response) {
                console.error("SendGrid Error Response:", error.response.body);
            }
        }

        return { success: true };
    }
);

// ── Verify Reset OTP → Return a short-lived reset token
export const verifyPasswordResetOTP = onCall(
    { region: "asia-south1" },
    async (request: CallableRequest<{ email: string; otp: string }>) => {
        const { email, otp } = request.data;
        if (
            typeof email !== "string" ||
            typeof otp !== "string" ||
            otp.length !== 6 ||
            !/^\d{6}$/.test(otp)
        ) {
            throw new HttpsError("invalid-argument", "Invalid email or OTP.");
        }

        let user;
        try {
            user = await admin.auth().getUserByEmail(email);
        } catch (err) {
            throw new HttpsError("not-found", "No account found.");
        }

        const docRef = db.collection("otps").doc(`${user.uid}-reset`);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new HttpsError("not-found", "No reset request found.");
        }

        const { otpHash, expiresAt } = doc.data() as { otpHash: string; expiresAt: Timestamp };

        if (expiresAt.toDate() < new Date()) {
            await docRef.delete();
            throw new HttpsError("deadline-exceeded", "Reset code expired.");
        }

        if (hashOTP(otp) !== otpHash) {
            throw new HttpsError("invalid-argument", "Incorrect reset code.");
        }

        // Success: Generate a short-lived reset token (valid 15 min)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
        const tokenExpiresAt = Timestamp.fromDate(new Date(Date.now() + 15 * 60 * 1000));

        // Store token hash temporarily (clean up old OTP doc)
        await db.collection("otps").doc(`${user.uid}-reset-token`).set({
            tokenHash: resetTokenHash,
            expiresAt: tokenExpiresAt,
            userId: user.uid,
            createdAt: Timestamp.now(),
        });

        await docRef.delete(); // Clean up OTP

        return { success: true, resetToken }; // Send token back to client
    }
);

// ── Reset Password using valid reset token
export const resetPassword = onCall(
    { region: "asia-south1" },
    async (request: CallableRequest<{ email: string; newPassword: string; resetToken: string }>) => {
        const { email, newPassword, resetToken } = request.data;

        if (typeof email !== "string" || typeof newPassword !== "string" || newPassword.length < 6) {
            throw new HttpsError("invalid-argument", "Invalid email or password.");
        }
        if (typeof resetToken !== "string" || resetToken.length < 10) {
            throw new HttpsError("invalid-argument", "Invalid reset token.");
        }

        let user;
        try {
            user = await admin.auth().getUserByEmail(email);
        } catch (err) {
            throw new HttpsError("not-found", "Account not found.");
        }

        const tokenDocRef = db.collection("otps").doc(`${user.uid}-reset-token`);
        const tokenDoc = await tokenDocRef.get();

        if (!tokenDoc.exists) {
            throw new HttpsError("not-found", "No valid reset token.");
        }

        const { tokenHash, expiresAt } = tokenDoc.data() as { tokenHash: string; expiresAt: Timestamp };

        if (expiresAt.toDate() < new Date()) {
            await tokenDocRef.delete();
            throw new HttpsError("deadline-exceeded", "Reset token expired.");
        }

        const providedTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
        if (providedTokenHash !== tokenHash) {
            throw new HttpsError("invalid-argument", "Invalid reset token.");
        }

        // All valid → update password
        await admin.auth().updateUser(user.uid, { password: newPassword });

        // Clean up token doc
        await tokenDocRef.delete();

        return { success: true, message: "Password reset successfully." };
    }
);

// ── Update user's music styles (called after selection)
export const updateMusicStyles = onCall(
    { region: "asia-south1" },
    async (request: CallableRequest<{ musicStyles: string[] }>) => {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "You must be logged in.");
        }

        const { musicStyles } = request.data;

        // Basic validation
        if (!Array.isArray(musicStyles)) {
            throw new HttpsError("invalid-argument", "musicStyles must be an array.");
        }
        if (musicStyles.length > 10) {
            throw new HttpsError("invalid-argument", "You can select up to 10 styles.");
        }

        const userId = request.auth.uid;

        // Update existing profile (merge = true)
        await db.collection("users").doc(userId).update({
            musicStyles: musicStyles.length > 0 ? musicStyles : admin.firestore.FieldValue.delete(), // remove field if empty
            updatedAt: Timestamp.now(),
        });

        return { success: true, message: "Music styles updated successfully." };
    }
);