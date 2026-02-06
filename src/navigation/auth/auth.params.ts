import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootParamList } from "../root.params";

export type AuthParamsList = {
    AuthenicateByScreen: undefined;
    RegisterScreen: undefined;
    LoginScreen: undefined;
    ForgotPasswordScreen: undefined;
    ResetPasswordScreen: undefined;
}

export type LoginScreenProps = NativeStackScreenProps<
    AuthParamsList & Pick<RootParamList, 'AuthNavigator'>,
    'LoginScreen'
>;

export type RegisterScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'RegisterScreen'
>;

export type ForgotPasswordScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'ForgotPasswordScreen'
>;

export type ResetPasswordScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'ResetPasswordScreen'
>;

export type AuthenicateByProps = NativeStackScreenProps<
    AuthParamsList,
    'AuthenicateByScreen'
>;
