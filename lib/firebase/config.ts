import { getApp } from "@react-native-firebase/app";
import { getAuth, connectAuthEmulator } from "@react-native-firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "@react-native-firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "@react-native-firebase/functions";
import { Platform } from "react-native";

console.log("🔥 Initializing Firebase Modules...");

// Initialize services using the modern Modular API
const authInstance = getAuth();
const dbInstance = getFirestore();
const functionsInstance = getFunctions(getApp(), "asia-south1");

/**
 * EMULATOR SETUP
 * 
 * If you want to use Firebase Emulators, set this to 'true'.
 * Make sure you have started them with 'firebase emulators:start'
 */
// const USE_EMULATORS = false;

if (__DEV__) {
    const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

    connectAuthEmulator(authInstance, `http://${localhost}:9099`);
    connectFirestoreEmulator(dbInstance, localhost, 8080);
    connectFunctionsEmulator(functionsInstance, localhost, 5001);
}

export {
    authInstance as auth,
    dbInstance as db,
    functionsInstance as functions
};