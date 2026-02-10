// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase/config";
import { User } from "../lib/firebase/auth";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

import { onAuthStateChanged } from "@react-native-firebase/auth";

export const useAuth = (): AuthState => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Listen to auth state changes (real-time)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            setError(null);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { user, loading, error };
};