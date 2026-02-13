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

import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator<RootParamList>();

export default function AppNavigator() {
    const { user, loading: authLoading } = useAuth();
    const [hasProfile, setHasProfile] = React.useState<boolean | null>(null);
    const [profileLoading, setProfileLoading] = React.useState(false);
    const [isVerified, setIsVerified] = React.useState(false);

    const screenOptions: NativeStackNavigationOptions = {
        gestureEnabled: false,
        headerShown: false,
    };

    React.useEffect(() => {
        let unsubscribe: () => void;

        const setupProfileListener = async () => {
            if (user) {
                try {
                    await user.reload();
                    const freshUser = auth().currentUser;
                    const verified = freshUser?.emailVerified ?? false;
                    setIsVerified(verified);

                    // console.log('RootNavigator User State:', {
                    //     email: freshUser?.email,
                    //     verified: verified,
                    //     uid: freshUser?.uid
                    // });

                    if (verified) {
                        setProfileLoading(true);
                        unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
                            // console.log('Profile update:', profile);
                            setHasProfile(!!(profile?.musicStyles && profile.musicStyles.length > 0));
                            setProfileLoading(false);
                        });
                    } else {
                        setHasProfile(null);
                        setProfileLoading(false);
                    }
                } catch (error) {
                    console.error("User reload failed", error);
                }
            } else {
                setIsVerified(false);
            }
        };

        setupProfileListener();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const isLoading = authLoading || (isVerified && profileLoading);

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
            ) : user.isAnonymous ? (
                <Stack.Screen name="MainNavigator" component={AppTabNavigator} />
            ) : !isVerified ? (
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
