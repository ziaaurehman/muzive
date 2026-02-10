import Page from "@src/components/page/Page"
import Title from "@src/components/typography/Title"
import { StyleSheet } from "react-native"
import { useTheme } from "@src/theme/ThemeProvider"
import { ThemeColor } from "@src/theme/interfaces/theme.color"
import Gap from "@src/components/layout/Gap"
import { SPACING } from "@src/utils/constants"
import Subtitle from "@src/components/typography/SubTitle"
import AppButton from "@src/components/buttons/AppButton"
import { GoogleIcon } from "@src/assets/svg/auth/assets"
import Row from "@src/components/layout/Row"
import Divider from "@src/components/layout/Divider"
import Caption from "@src/components/typography/Caption"
import { AuthenicateByProps } from "@src/navigation/auth/auth.params"
import Column from "@src/components/layout/Column"

import { signInAsGuest } from "../../../lib/firebase/auth";
import { Alert } from "react-native";
import { useState } from "react";

const AuthenicateByScreen = ({ navigation }: AuthenicateByProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const [isLoading, setIsLoading] = useState(false)

    const handleGuestLogin = async () => {
        setIsLoading(true)
        try {
            await signInAsGuest()
            console.log("Logged in as guest")
        } catch (error: any) {
            Alert.alert("Guest Mode Failed", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Page >
            <Title style={styles.title}  >Muzive</Title>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Subtitle style={styles.subtitle} >New user? Create an account</Subtitle>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <AppButton
                title="Sign Up with Google"
                onPress={() => { navigation.navigate('GoogleAuthScreen', { authType: 'register' }) }}
                buttonType="secondary"
                fullWidth
                icon={<GoogleIcon />}
            />
            <Gap height={SPACING.EXTRA_SMALL} />
            <AppButton
                title="Continue with Email"
                onPress={() => { navigation.navigate('RegisterScreen') }}
                fullWidth
            />
            <Gap height={SPACING.EXTRA_SMALL} />
            <Row style={styles.dividerRow} >
                <Divider style={styles.divider} />
                <Caption fontWeight="regular" >OR</Caption>
                <Divider style={styles.divider} />
            </Row>
            <Gap height={SPACING.EXTRA_SMALL} />
            <AppButton
                title="Continue as Guest User"
                loading={isLoading}
                onPress={handleGuestLogin}
                fullWidth
                buttonType="outline"
            />
            <Row style={styles.loginRow}>
                <Caption>Do you have an account?{" "}</Caption>
                <AppButton
                    title="Login"
                    onPress={() => { navigation.navigate('LoginScreen') }}
                    buttonType="plain"
                />
            </Row>
        </Page>
    )
}

export default AuthenicateByScreen

const createStyles = (colors: ThemeColor) =>
    StyleSheet.create({
        title: {
            color: colors.primaryColor,
            textAlign: 'center'
        },
        subtitle: {
            textAlign: 'center'
        },
        dividerRow: {
            justifyContent: 'space-between'
        },
        divider: {
            width: '45%'
        },
        loginRow: {
            justifyContent: 'center'
        },
        columnStyle: {
            justifyContent: 'center',
            flex: 1
        }
    })
