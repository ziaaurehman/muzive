import * as React from 'react';
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import AuthStackNavigator from './auth/AuthStackNavigator';
// import AppTabNavigator from './app/AppTabNavigator';
import { RootParamList } from './root.params';

const Stack = createNativeStackNavigator<RootParamList>();

export default function AppNavigator() {
    const screenOptions: NativeStackNavigationOptions = {
        gestureEnabled: false,
        headerShown: false,
    };
    return (
        <Stack.Navigator
            initialRouteName={'AuthNavigator'}
            screenOptions={screenOptions}
        >
            <Stack.Screen name='AuthNavigator' component={AuthStackNavigator} />
            {/* <Stack.Screen name='MainNavigator' component={AppTabNavigator} /> */}
        </Stack.Navigator>
    );
}
