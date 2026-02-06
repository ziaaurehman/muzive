import Gap from "@src/components/layout/Gap";
import Page from "@src/components/page/Page"
import Subtitle from "@src/components/typography/SubTitle";
import Title from "@src/components/typography/Title";
import { ThemeColor } from "@src/theme/interfaces/theme.color";
import { BORDERS, FONT_WEIGHTS, SPACING } from "@src/utils/constants";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@src/theme/ThemeProvider";
import Caption from "@src/components/typography/Caption";
import Input from "@src/components/input/Input";
import { useForm } from "react-hook-form";
import AppButton from "@src/components/buttons/AppButton";
import { adaptiveSize } from "@src/utils/scaleUtils";
import Row from "@src/components/layout/Row";
import { GoogleIcon } from "@src/assets/svg/auth/assets";
import { LoginScreenProps, RegisterScreenProps } from "@src/navigation/auth/auth.params";
import Column from "@src/components/layout/Column";
import AppIcon from "@src/components/icons/AppIcon";
import ICONS from "@src/utils/icons";
import { useState } from "react";

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const { control, watch } = useForm()
    const [remember, setRemember] = useState(false)

    const password = watch('password')
    const email = watch('email')

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
            />
            {email?.includes('@gmail.com') &&
                <>
                    <Gap height={SPACING.SEMI_MEDIUM} />
                    <AppButton
                        title="Sign Up with Google"
                        onPress={() => { }}
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
                onPress={() => { }}
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