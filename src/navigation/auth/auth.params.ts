import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootParamList } from "../root.params";

export type AuthParamsList = {
    AuthenicateByScreen: undefined;
    RegisterScreen: undefined;
    LoginScreen: undefined;
    ForgotPasswordScreen: undefined;
    ResetPasswordScreen: undefined | { email: string; resetToken: string };
    OtpVerificationScreen: undefined | { email: string };
    VerifyEmailScreen: undefined | { email: string };
    EmailVerifiedScreen: undefined;
    MusicStylesScreen: undefined;
    GoogleAuthScreen: undefined | { authType: 'login' | 'register' };
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

export type OtpVerificationScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'OtpVerificationScreen'
>;

export type VerifyEmailScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'VerifyEmailScreen'
>;

export type EmailVerifiedScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'EmailVerifiedScreen'
>;

export type MusicStylesScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'MusicStylesScreen'
>;

export type GoogleAuthScreenProps = NativeStackScreenProps<
    AuthParamsList,
    'GoogleAuthScreen'
>;

