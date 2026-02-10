import Page from "@src/components/page/Page"
import { GoogleAuthScreenProps } from "@src/navigation/auth/auth.params"
import { useEffect, useState, useCallback } from "react"
import Row from "@src/components/layout/Row"
import { GoogleIcon } from "@src/assets/svg/auth/assets"
import Body from "@src/components/typography/Body"
import { useTheme } from "@src/theme/ThemeProvider"
import { StyleSheet, View } from "react-native"
import Title from "@src/components/typography/Title"
import Gap from "@src/components/layout/Gap"
import Subtitle from "@src/components/typography/SubTitle"
import Caption from "@src/components/typography/Caption"
import { SPACING } from "@src/utils/constants"
import Card from "@src/components/layout/Card"
import AppButton from "@src/components/buttons/AppButton"
import { useFocusEffect } from "@react-navigation/native"
import Divider from "@src/components/layout/Divider"
import { ThemeColor } from "@src/theme/interfaces/theme.color"

type AuthState = 'CHOOSE_ACCOUNT' | 'ACCOUNT_SELECTED' | 'CONNECTING' | 'REDIRECTING' | 'FAILED';

const GoogleAuthScreen = ({ navigation, route }: GoogleAuthScreenProps) => {
    const { authType } = route?.params || {};
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const [state, setState] = useState<AuthState>('CHOOSE_ACCOUNT');

    useFocusEffect(
        useCallback(() => {
            setState('CHOOSE_ACCOUNT');
        }, [])
    );

    useEffect(() => {
        let timer: any;

        if (state === 'ACCOUNT_SELECTED') {
            timer = setTimeout(() => setState('CONNECTING'), 2000);
        } else if (state === 'CONNECTING') {
            timer = setTimeout(() => setState('REDIRECTING'), 2000);
        } else if (state === 'REDIRECTING') {
            timer = setTimeout(() => setState('FAILED'), 2000); // Transitions to failed to show all states
        }

        return () => clearTimeout(timer);
    }, [state]);

    const handleAccountPress = () => {
        setState('ACCOUNT_SELECTED');
    };

    const handleTryAgain = () => {
        setState('CHOOSE_ACCOUNT');
    };

    const renderHeader = () => (
        <Row style={styles.header}>
            <GoogleIcon />
            <Gap width={SPACING.SMALL} />
            <Body fontWeight="medium">
                {authType === 'login' ? 'Login with Google' : 'Sign Up with Google'}
            </Body>
        </Row>
    );

    const renderChooseAccount = (isSelected: boolean) => (
        <View style={styles.container}>
            {renderHeader()}
            <Gap height={SPACING.SMALL} />
            <View style={styles.divider} />
            <Gap height={SPACING.SEMI_MEDIUM} />
            <Title style={styles.muziveTitle}>Muzive</Title>
            <Gap height={SPACING.SEMI_MEDIUM} />
            <Subtitle>Choose an account</Subtitle>
            <Gap height={SPACING.TINY} />
            <Caption>to continue to the app</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />

            <Card
                onPress={handleAccountPress}
                style={[styles.accountCard,
                isSelected && styles.selectedAccount]}
            >
                <Row style={styles.accountRow}>
                    <View style={styles.avatarPlaceholder}>
                        <Body style={{ color: colors.white }}>JD</Body>
                    </View>
                    <Gap width={SPACING.EXTRA_SMALL} />
                    <View>
                        <Body fontWeight="bold">John Doe</Body>
                        <Caption>johndoe@gmail.com</Caption>
                    </View>
                </Row>
            </Card>

            <Gap height={SPACING.TINY} />
            <AppButton
                title="Use another account"
                onPress={() => { }}
                buttonType="plain"
                buttonAlignment="left"
            />
            <View style={styles.divider} />
        </View>
    );

    const renderConnecting = () => (
        <View style={[styles.container, styles.centerContent]}>
            <Subtitle fontWeight="bold" >Connecting with google....</Subtitle>
        </View>
    );

    const renderRedirecting = () => (
        <View style={[styles.container, styles.centerContent]}>
            <Caption fontWeight="regular">
                {authType === 'login' ? "You're now logged in with Google." : "You're now signed up with Google."}
            </Caption>
            <Gap height={SPACING.EXTRA_SMALL} />
            <Subtitle fontWeight="bold">Redirecting...</Subtitle>
        </View>
    );

    const renderFailed = () => (
        <View style={[styles.container, styles.centerContent]}>
            <Subtitle fontWeight="bold">
                {authType === 'login' ? 'Google sign-in failed.' : 'Google Sign Up failed.'}
            </Subtitle>
            <Gap height={SPACING.EXTRA_SMALL} />
            <Caption fontWeight="regular">Please try again.</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Row style={styles.buttonRow}>
                <AppButton
                    title="Back"
                    onPress={() => navigation.goBack()}
                    buttonType="outline"
                    buttonSize="small"
                    style={styles.failButton}
                />
                <AppButton
                    title="Try Again"
                    onPress={handleTryAgain}
                    buttonSize="small"
                    style={styles.failButton}
                />
            </Row>
        </View>
    );

    return (
        <Page>
            {state === 'CHOOSE_ACCOUNT' && renderChooseAccount(false)}
            {state === 'ACCOUNT_SELECTED' && renderChooseAccount(true)}
            {state === 'CONNECTING' && renderConnecting()}
            {state === 'REDIRECTING' && renderRedirecting()}
            {state === 'FAILED' && renderFailed()}
        </Page>
    )
}

export default GoogleAuthScreen

const createStyles = (colors: ThemeColor) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SPACING.MEDIUM,
    },
    header: {
        alignItems: 'center',
    },
    muziveTitle: {
        color: '#ED5D16',
    },
    accountCard: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    selectedAccount: {
        borderColor: colors.primaryColor,
        borderWidth: 1,
        borderRadius: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.primaryColor,
        backgroundColor: colors.containerBackgroundColor
    },
    accountRow: {
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 46,
        height: 46,
        borderRadius: 100,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginTop: SPACING.TINY,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerText: {
        textAlign: 'center',
    },
    buttonRow: {
        gap: SPACING.SMALL,
    },
    failButton: {
        width: 100,
    }
});