import { doc, getDoc, onSnapshot } from "@react-native-firebase/firestore";
import { db } from "./config";

export interface UserProfile {
    displayName: string;
    email: string | null;
    role: string;
    musicStyles?: string[];
    createdAt: any;
    updatedAt: any;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};
export const subscribeToUserProfile = (userId: string, callback: (profile: UserProfile | null) => void) => {
    const docRef = doc(db, "users", userId);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as UserProfile);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error("Profile subscription error:", error);
    });
};
