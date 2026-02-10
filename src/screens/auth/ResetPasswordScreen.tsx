import Gap from "@src/components/layout/Gap";
import Page from "@src/components/page/Page"
import Subtitle from "@src/components/typography/SubTitle";
import Title from "@src/components/typography/Title";
import { ThemeColor } from "@src/theme/interfaces/theme.color";
import { FONT_WEIGHTS, RADIUS, SPACING } from "@src/utils/constants";
import { StyleSheet } from "react-native";
import { useTheme } from "@src/theme/ThemeProvider";
import Caption from "@src/components/typography/Caption";
import Input from "@src/components/input/Input";
import { useForm } from "react-hook-form";
import AppButton from "@src/components/buttons/AppButton";
import { adaptiveSize } from "@src/utils/scaleUtils";
import PasswordStrengthBar from "@src/components/input/PasswordStrengthBar";
import Card from "@src/components/layout/Card";
import { ResetPasswordScreenProps } from "@src/navigation/auth/auth.params";

import { callResetPassword } from "../../../lib/firebase/functions";
import { Alert } from "react-native";
import { useState } from "react";

const ResetPasswordScreen = ({ navigation, route }: ResetPasswordScreenProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const [isLoading, setIsLoading] = useState(false)
    const { control, watch, handleSubmit } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const { email, resetToken } = route.params || {};

    const password = watch('password')

    const onUpdatePassword = async (data: any) => {
        if (!email || !resetToken) {
            Alert.alert("Error", "Missing reset information. Please try starting over.")
            return
        }
        if (data.password !== data.confirmPassword) {
            Alert.alert("Error", "Passwords do not match")
            return
        }

        setIsLoading(true)
        try {
            await callResetPassword(email, data.password, resetToken)
            Alert.alert("Success", "Password updated successfully. Please login with your new password.", [
                { text: "OK", onPress: () => navigation.navigate('LoginScreen') }
            ])
        } catch (error: any) {
            Alert.alert("Error", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Page>
            <Title style={styles.title}  >Muzive</Title>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Subtitle style={styles.subtitle} >Reset Password</Subtitle>
            <Gap height={SPACING.TINY} />
            <Caption style={styles.subtitle} >Set a new password to keep your account secure</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />

            <Input
                label="Password"
                placeholder="Enter Password"
                control={control}
                secureTextEntry
                name="password"
            />
            {password?.length > 2 &&
                <>
                    <Gap height={6} />
                    <PasswordStrengthBar
                        password={password ?? ''}
                        radius={5}
                    />
                    <Gap height={6} />
                    <Card
                        paddingVertical={SPACING.SMALL}
                        paddingHorizontal={SPACING.SMALL}
                        borderRadius={RADIUS.MEDIUM_SMALL}
                        style={styles.cardStyle}
                    >
                        <Caption style={styles.caption} >Password must contain:</Caption>
                        <Gap />
                        <Caption>Atleast 8 characters</Caption>
                    </Card>
                </>
            }
            <Gap height={SPACING.SEMI_MEDIUM} />
            <Input
                label="Confirm Password"
                placeholder="Enter Password"
                secureTextEntry
                control={control}
                name="confirmPassword"
            />
            <Gap height={SPACING.SEMI_MEDIUM} />
            <AppButton
                title="Update Password"
                loading={isLoading}
                onPress={handleSubmit(onUpdatePassword)}
                style={styles.buttonStyle}
                fullWidth
            />
        </Page>
    )
}

export default ResetPasswordScreen;

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
        }
    })