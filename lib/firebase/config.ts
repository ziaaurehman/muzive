import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { getFunctions } from "@react-native-firebase/functions";
import { Platform } from "react-native";

console.log("🔥 Initializing Firebase Modules...");

// Initialize services using the modern Modular API
const authInstance = getAuth();
const dbInstance = getFirestore();
const functionsInstance = getFunctions(); // Default region

/**
 * EMULATOR SETUP
 * 
 * If you want to use Firebase Emulators, set this to 'true'.
 * Make sure you have started them with 'firebase emulators:start'
 */
const USE_EMULATORS = false;

// if (__DEV__ && USE_EMULATORS) {
//     // For React Native:
//     // - iOS simulator uses 'localhost' or '127.0.0.1'
//     // - Android emulator uses '10.0.2.2'
//     const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

//     console.log(`🔥 Connecting to Firebase EMULATORS (${host})`);

//     authInstance.useEmulator(`http://${host}:9099`);
//     dbInstance.useEmulator(host, 8080);
//     functionsInstance.useEmulator(host, 5001);
// }

export {
    authInstance as auth,
    dbInstance as db,
    functionsInstance as functions
};