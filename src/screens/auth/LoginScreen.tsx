import Gap from "@src/components/layout/Gap";
import Page from "@src/components/page/Page"
import Subtitle from "@src/components/typography/SubTitle";
import Title from "@src/components/typography/Title";
import { ThemeColor } from "@src/theme/interfaces/theme.color";
import { BORDERS, FONT_WEIGHTS, SPACING } from "@src/utils/constants";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "@src/theme/ThemeProvider";
import Caption from "@src/components/typography/Caption";
import Input from "@src/components/input/Input";
import { useForm } from "react-hook-form";
import AppButton from "@src/components/buttons/AppButton";
import { adaptiveSize } from "@src/utils/scaleUtils";
import Row from "@src/components/layout/Row";
import { GoogleIcon } from "@src/assets/svg/auth/assets";
import { LoginScreenProps } from "@src/navigation/auth/auth.params";
import AppIcon from "@src/components/icons/AppIcon";
import ICONS from "@src/utils/icons";
import { useState } from "react";
import { LoginFormSchema, loginSchema } from "@src/schemas/auth/login.schema";
import { yupResolver } from "@hookform/resolvers/yup";

import { signInWithEmail, signInWithGoogle } from "../../../lib/firebase/auth";
import { Alert } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from "react";
import Config from "react-native-config";
import { callSendVerificationOTP, callCreateUserProfile } from "../../../lib/firebase/functions";
import { getUserProfile } from "../../../lib/firebase/firestore";

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const [isLoading, setIsLoading] = useState(false)
    const { control, watch, handleSubmit, formState: { errors } } = useForm<LoginFormSchema>({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    })
    const [remember, setRemember] = useState(false)

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '294527245090-ukhtfja3ppuh7gbl7b1vuj4l4jc5kskp.apps.googleusercontent.com',
            offlineAccess: true,
        });
    }, []);

    const password = watch('password')
    const email = watch('email')

    const onLogin = async (data: LoginFormSchema) => {
        setIsLoading(true)
        try {
            const user = await signInWithEmail(data.email, data.password)
            if (user?.emailVerified) {
                const profile = await getUserProfile(user.uid);
                if (profile && profile.musicStyles && profile.musicStyles.length > 0) {
                    navigation.replace('MainNavigator', { screen: 'HomeScreen' })
                } else {
                    navigation.replace('MusicStylesScreen')
                }
            } else {
                await callSendVerificationOTP()
                navigation.replace('VerifyEmailScreen')
            }
        } catch (error: any) {
            Alert.alert("Login Failed", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const onGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;

            if (idToken) {
                const user = await signInWithGoogle(idToken);
                const profile = await getUserProfile(user.uid);

                if (!profile) {
                    await callCreateUserProfile(user.displayName ?? 'User');
                    navigation.replace('MusicStylesScreen');
                    return;
                }

                if (profile.musicStyles && profile.musicStyles.length > 0) {
                    navigation.replace('MainNavigator', { screen: 'HomeScreen' })
                } else {
                    navigation.replace('MusicStylesScreen')
                }
            } else {
                throw new Error("Google Sign-In failed: No ID Token found");
            }
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Page>
            <Title style={styles.title}  >Muzive</Title>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Subtitle style={styles.subtitle} >Login into your account</Subtitle>
            <Gap height={SPACING.TINY} />
            <Caption style={styles.subtitle} >Welcome back! Please enter your details</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />

            <Input
                label="Email"
                placeholder="Enter your Email"
                control={control}
                name="email"
                errorMessage={errors.email?.message}
                hasError={!!errors.email}
            />
            {email?.includes('@gmail.com') &&
                <>
                    <Gap height={SPACING.EXTRA_SMALL} />
                    <Caption tone='input-critical'>Looks like you're using a Gmail -- login with Google to continue</Caption>
                    <Gap height={SPACING.SEMI_MEDIUM} />
                    <AppButton
                        title="Login with Google"
                        onPress={onGoogleLogin}
                        buttonType="secondary"
                        fullWidth
                        icon={<GoogleIcon />}
                    />
                </>
            }
            <Gap height={SPACING.SEMI_MEDIUM} />
            <Input
                label="Password"
                placeholder="Enter Password"
                control={control}
                secureTextEntry
                name="password"
                errorMessage={errors.password?.message}
                hasError={!!errors.password}
            />
            <Row style={styles.rememberRow}>
                <Row>
                    <Pressable onPress={() => setRemember(!remember)} style={[styles.remember, { backgroundColor: remember ? colors.primaryColor : 'transparent' }]}>
                        {remember && <AppIcon icon={ICONS.TICK} size={18} />}
                    </Pressable>
                    <Gap width={SPACING.EXTRA_SMALL} />
                    <Caption>Remember me</Caption>
                </Row>
                <AppButton
                    title="Forgot Password?"
                    onPress={() => { navigation.navigate('ForgotPasswordScreen') }}
                    buttonType="plain"
                />
            </Row>
            <Gap height={SPACING.SEMI_MEDIUM} />
            <AppButton
                title="Login"
                loading={isLoading}
                onPress={handleSubmit(onLogin)}
                style={styles.buttonStyle}
                fullWidth
            />
            <Row style={styles.loginRow}>
                <Caption>Create an account?{" "}</Caption>
                <AppButton
                    title="Sign Up"
                    onPress={() => { navigation.navigate('RegisterScreen') }}
                    buttonType="plain"
                />
            </Row>
        </Page>
    )
}

export default LoginScreen;

const createStyles = (colors: ThemeColor) =>
    StyleSheet.create({
        title: {
            color: colors.primaryColor,
            textAlign: 'center'
        },
        subtitle: {
            textAlign: 'center'
        },
        buttonStyle: {
            height: adaptiveSize(52)
        },
        loginRow: {
            justifyContent: 'center'
        },
        caption: {
            fontWeight: FONT_WEIGHTS.BOLD
        },
        cardStyle: {
            width: '100%',
            backgroundColor: '#ED5D1610'
        },
        remember: {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: BORDERS.DEFAULT_BORDER,
            borderColor: colors.borderColor
        },
        rememberRow: {
            justifyContent: 'space-between'
        }
    })