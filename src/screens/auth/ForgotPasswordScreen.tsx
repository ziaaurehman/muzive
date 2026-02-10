import Gap from "@src/components/layout/Gap";
import Page from "@src/components/page/Page"
import Subtitle from "@src/components/typography/SubTitle";
import Title from "@src/components/typography/Title";
import { ThemeColor } from "@src/theme/interfaces/theme.color";
import { FONT_WEIGHTS, SPACING } from "@src/utils/constants";
import { StyleSheet } from "react-native";
import { useTheme } from "@src/theme/ThemeProvider";
import Caption from "@src/components/typography/Caption";
import Input from "@src/components/input/Input";
import { useForm } from "react-hook-form";
import AppButton from "@src/components/buttons/AppButton";
import { adaptiveSize } from "@src/utils/scaleUtils";
import Row from "@src/components/layout/Row";
import { ForgotPasswordScreenProps } from "@src/navigation/auth/auth.params";
import { useState } from "react";

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
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
            <Subtitle style={styles.subtitle} >Forgot your Password?</Subtitle>
            <Gap height={SPACING.TINY} />
            <Caption style={styles.subtitle} >No worries! Enter your email address and we'll{"\n"}send you a secure code to reset your password.</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />

            <Input
                label="Email"
                placeholder="Enter your Email"
                control={control}
                name="email"
            />
            <Row>
                <Caption>Remember your password?{" "}</Caption>
                <AppButton
                    title="Return to Login"
                    onPress={navigation.goBack}
                    buttonType="plain"
                />
            </Row>
            <Gap height={SPACING.SEMI_MEDIUM} />
            <AppButton
                title="Send Reset Code"
                onPress={() => { navigation.navigate('OtpVerificationScreen') }}
                style={styles.buttonStyle}
                fullWidth
            />

        </Page>
    )
}

export default ForgotPasswordScreen;

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
        caption: {
            fontWeight: FONT_WEIGHTS.BOLD
        }
    })