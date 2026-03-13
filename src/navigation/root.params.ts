import { AuthParamsList } from './auth/auth.params';
import { AppParamsList } from './app/app.params';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootParamList = {
    AuthNavigator: NavigatorScreenParams<AuthParamsList>;
    MainNavigator: NavigatorScreenParams<AppParamsList>;
    VerifyEmailScreen: undefined;
    MusicStylesScreen: undefined;
};

