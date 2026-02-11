"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMusicStyles = exports.resetPassword = exports.verifyPasswordResetOTP = exports.sendPasswordResetOTP = exports.createUserProfile = exports.verifyOTP = exports.sendVerificationOTP = void 0;
// functions/src/index.ts
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const crypto = __importStar(require("crypto"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
// Initialize Admin SDK (only once)
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp();
}
const db = firebase_admin_1.default.firestore();
// Load SendGrid key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
    console.log(`Setting SendGrid API Key (starts with: ${apiKey.substring(0, 3)}...)`);
    mail_1.default.setApiKey(apiKey);
}
else {
    console.error("SENDGRID_API_KEY is missing from process.env!");
}
// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
// Helper: Hash OTP (SHA-256)
const hashOTP = (otp) => crypto.createHash("sha256").update(otp).digest("hex");
// ── Send Verification OTP
exports.sendVerificationOTP = (0, https_1.onCall)({ region: "asia-south1" }, // optional: match your functions region
async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Must be logged in.");
    }
    const userId = request.auth.uid;
    const user = await firebase_admin_1.default.auth().getUser(userId);
    const email = user.email;
    if (!email) {
        throw new https_1.HttpsError("invalid-argument", "No email for this user.");
    }
    // Rate limit: max 3 OTPs per hour
    const oneHourAgo = firestore_1.Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));
    const recentCount = await db
        .collection("otps")
        .where("userId", "==", userId)
        .where("createdAt", ">", oneHourAgo)
        .count()
        .get();
    if (recentCount.data().count >= 3) {
        throw new https_1.HttpsError("resource-exhausted", "Too many requests. Wait 1 hour.");
    }
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = firestore_1.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));
    const createdAt = firestore_1.Timestamp.now();
    await db.collection("otps").doc(`${userId}-verify`).set({
        otpHash,
        expiresAt,
        createdAt,
        userId,
        email,
    });
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: "Muzive Verification Code",
        text: `Your code is: ${otp}. Expires in 10 minutes.`,
        html: `<p>Your code is: <strong>${otp}</strong>. Expires in 10 minutes.</p>`,
    };
    try {
        console.log(`Attempting to send OTP to ${email}...`);
        await mail_1.default.send(msg);
        console.log("Email sent successfully via SendGrid.");
    }
    catch (error) {
        console.error("Error sending email via SendGrid:", error);
        if (error.response) {
            console.error("SendGrid Error Response:", error.response.body);
        }
    }
    return { success: true };
});
// ── Verify OTP
exports.verifyOTP = (0, https_1.onCall)({ region: "asia-south1" }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Must be logged in.");
    }
    const { otp } = request.data;
    if (typeof otp !== "string" || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid OTP.");
    }
    const userId = request.auth.uid;
    const docRef = db.collection("otps").doc(`${userId}-verify`);
    const doc = await docRef.get();
    if (!doc.exists) {
        throw new https_1.HttpsError("not-found", "No OTP found.");
    }
    const { otpHash, expiresAt } = doc.data();
    if (expiresAt.toDate() < new Date()) {
        await docRef.delete();
        throw new https_1.HttpsError("deadline-exceeded", "OTP expired.");
    }
    if (hashOTP(otp) !== otpHash) {
        throw new https_1.HttpsError("invalid-argument", "Incorrect OTP.");
    }
    await firebase_admin_1.default.auth().updateUser(userId, { emailVerified: true });
    await docRef.delete();
    return { success: true };
});
// ── Create User Profile (called after verification)
exports.createUserProfile = (0, https_1.onCall)({ region: "asia-south1" }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Must be logged in.");
    }
    const { displayName } = request.data;
    if (typeof displayName !== "string" || displayName.trim().length < 2) {
        throw new https_1.HttpsError("invalid-argument", "Valid display name required (min 2 characters).");
    }
    const userId = request.auth.uid;
    const user = await firebase_admin_1.default.auth().getUser(userId);
    // Prevent overwriting if profile already exists (optional – remove if you want merge)
    const profileRef = db.collection("users").doc(userId);
    const profileSnap = await profileRef.get();
    if (profileSnap.exists) {
        throw new https_1.HttpsError("already-exists", "Profile already created.");
    }
    await profileRef.set({
        displayName: displayName.trim(),
        email: user.email || null,
        role: "user", // default – upgrade later for BO/MP/Admin
        createdAt: firestore_1.Timestamp.now(),
        updatedAt: firestore_1.Timestamp.now(),
        // Add more fields later: musicStyles, location, etc.
    });
    return { success: true, message: "Profile created successfully." };
});
// ── Send Password Reset OTP (by email)
exports.sendPasswordResetOTP = (0, https_1.onCall)({ region: "asia-south1" }, async (request) => {
    const { email } = request.data;
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new https_1.HttpsError("invalid-argument", "Valid email required.");
    }
    let user;
    try {
        user = await firebase_admin_1.default.auth().getUserByEmail(email);
    }
    catch (err) {
        throw new https_1.HttpsError("not-found", "No account found with this email.");
    }
    // Rate limit: max 3 reset OTPs per hour per user
    const oneHourAgo = firestore_1.Timestamp.fromDate(new Date(Date.now() - 60 * 60 * 1000));
    const recentCount = await db
        .collection("otps")
        .where("userId", "==", user.uid)
        .where("type", "==", "reset")
        .where("createdAt", ">", oneHourAgo)
        .count()
        .get();
    if (recentCount.data().count >= 3) {
        throw new https_1.HttpsError("resource-exhausted", "Too many reset requests. Wait 1 hour.");
    }
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = firestore_1.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000)); // 10 min
    const createdAt = firestore_1.Timestamp.now();
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
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: "Muzive Password Reset Code",
        text: `Your reset code is: ${otp}. Expires in 10 minutes. If you didn't request this, ignore it.`,
        html: `<p>Your reset code is: <strong>${otp}</strong>. Expires in 10 minutes.</p><p>If you didn't request this, please ignore this email.</p>`,
    };
    try {
        console.log(`Attempting to send reset OTP to ${email}...`);
        await mail_1.default.send(msg);
        console.log("Reset email sent successfully via SendGrid.");
    }
    catch (error) {
        console.error("Error sending reset email via SendGrid:", error);
        if (error.response) {
            console.error("SendGrid Error Response:", error.response.body);
        }
    }
    return { success: true };
});
// ── Verify Reset OTP → Return a short-lived reset token
exports.verifyPasswordResetOTP = (0, https_1.onCall)({ region: "asia-south1" }, async (request) => {
    const { email, otp } = request.data;
    if (typeof email !== "string" ||
        typeof otp !== "string" ||
        otp.length !== 6 ||
        !/^\d{6}$/.test(otp)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid email or OTP.");
    }
    let user;
    try {
        user = await firebase_admin_1.default.auth().getUserByEmail(email);
    }
    catch (err) {
        throw new https_1.HttpsError("not-found", "No account found.");
    }
    const docRef = db.collection("otps").doc(`${user.uid}-reset`);
    const doc = await docRef.get();
    if (!doc.exists) {
        throw new https_1.HttpsError("not-found", "No reset request found.");
    }
    const { otpHash, expiresAt } = doc.data();
    if (expiresAt.toDate() < new Date()) {
        await docRef.delete();
        throw new https_1.HttpsError("deadline-exceeded", "Reset code expired.");
    }
    if (hashOTP(otp) !== otpHash) {
        throw new https_1.HttpsError("invalid-argument", "Incorrect reset code.");
    }
    // Success: Generate a short-lived reset token (valid 15 min)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiresAt = firestore_1.Timestamp.fromDate(new Date(Date.now() + 15 * 60 * 1000));
    // Store token hash temporarily (clean up old OTP doc)
    await db.collection("otps").doc(`${user.uid}-reset-token`).set({
        tokenHash: resetTokenHash,
        expiresAt: tokenExpiresAt,
        userId: user.uid,
        createdAt: firestore_1.Timestamp.now(),
    });
    await docRef.delete(); // Clean up OTP
    return { success: true, resetToken }; // Send token back to client
});
// ── Reset Password using valid reset token
exports.resetPassword = (0, https_1.onCall)({ region: "asia-south1" }, async (request) => {
    const { email, newPassword, resetToken } = request.data;
    if (typeof email !== "string" || typeof newPassword !== "string" || newPassword.length < 6) {
        throw new https_1.HttpsError("invalid-argument", "Invalid email or password.");
    }
    if (typeof resetToken !== "string" || resetToken.length < 10) {
        throw new https_1.HttpsError("invalid-argument", "Invalid reset token.");
    }
    let user;
    try {
        user = await firebase_admin_1.default.auth().getUserByEmail(email);
    }
    catch (err) {
        throw new https_1.HttpsError("not-found", "Account not found.");
    }
    const tokenDocRef = db.collection("otps").doc(`${user.uid}-reset-token`);
    const tokenDoc = await tokenDocRef.get();
    if (!tokenDoc.exists) {
        throw new https_1.HttpsError("not-found", "No valid reset token.");
    }
    const { tokenHash, expiresAt } = tokenDoc.data();
    if (expiresAt.toDate() < new Date()) {
        await tokenDocRef.delete();
        throw new https_1.HttpsError("deadline-exceeded", "Reset token expired.");
    }
    const providedTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    if (providedTokenHash !== tokenHash) {
        throw new https_1.HttpsError("invalid-argument", "Invalid reset token.");
    }
    // All valid → update password
    await firebase_admin_1.default.auth().updateUser(user.uid, { password: newPassword });
    // Clean up token doc
    await tokenDocRef.delete();
    return { success: true, message: "Password reset successfully." };
});
// ── Update user's music styles (called after selection)
exports.updateMusicStyles = (0, https_1.onCall)({ region: "asia-south1" }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be logged in.");
    }
    const { musicStyles } = request.data;
    // Basic validation
    if (!Array.isArray(musicStyles)) {
        throw new https_1.HttpsError("invalid-argument", "musicStyles must be an array.");
    }
    if (musicStyles.length > 10) {
        throw new https_1.HttpsError("invalid-argument", "You can select up to 10 styles.");
    }
    const userId = request.auth.uid;
    // Update existing profile (merge = true)
    await db.collection("users").doc(userId).update({
        musicStyles: musicStyles.length > 0 ? musicStyles : firebase_admin_1.default.firestore.FieldValue.delete(), // remove field if empty
        updatedAt: firestore_1.Timestamp.now(),
    });
    return { success: true, message: "Music styles updated successfully." };
});
//# sourceMappingURL=index.js.map