import * as React from 'react';
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import AuthStackNavigator from './auth/AuthStackNavigator';
import { RootParamList } from './root.params';
import AppTabNavigator from './app/AppTabNavigator';
import { useAuth } from '../../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { getUserProfile, subscribeToUserProfile } from '../../lib/firebase/firestore';

const Stack = createNativeStackNavigator<RootParamList>();

export default function AppNavigator() {
    const { user, loading: authLoading } = useAuth();
    const [hasProfile, setHasProfile] = React.useState<boolean | null>(null);
    const [profileLoading, setProfileLoading] = React.useState(false);

    const screenOptions: NativeStackNavigationOptions = {
        gestureEnabled: false,
        headerShown: false,
    };

    React.useEffect(() => {
        let unsubscribe: () => void;

        const setupProfileListener = async () => {
            if (user && user.emailVerified) {
                setProfileLoading(true);
                unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
                    setHasProfile(!!(profile?.musicStyles && profile.musicStyles.length > 0));
                    setProfileLoading(false);
                });
            } else {
                setHasProfile(null);
                setProfileLoading(false);
            }
        };

        setupProfileListener();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const isLoading = authLoading || (user && user.emailVerified && profileLoading);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1B1C' }}>
                <ActivityIndicator size="large" color="#ED5D16" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={screenOptions}>
            {!user ? (
                <Stack.Screen
                    name="AuthNavigator"
                    component={AuthStackNavigator}
                    initialParams={{ initialRouteName: 'AuthenicateByScreen' } as any}
                />
            ) : !user.emailVerified ? (
                <Stack.Screen
                    name="AuthNavigator"
                    component={AuthStackNavigator}
                    initialParams={{ initialRouteName: 'VerifyEmailScreen' } as any}
                />
            ) : hasProfile === false ? (
                <Stack.Screen
                    name="AuthNavigator"
                    component={AuthStackNavigator}
                    initialParams={{ initialRouteName: 'MusicStylesScreen' } as any}
                />
            ) : (
                <Stack.Screen name="MainNavigator" component={AppTabNavigator} />
            )}
        </Stack.Navigator>
    );
}
