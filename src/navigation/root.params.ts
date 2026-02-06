import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthParamsList } from './auth/auth.params';

export type RootParamList = {
    AuthNavigator: NavigatorScreenParams<AuthParamsList>;
    //   MainNavigator: NavigatorScreenParams<AppParamsList>;
};
