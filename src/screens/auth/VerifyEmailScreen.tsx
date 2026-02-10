import Gap from "@src/components/layout/Gap";
import Page from "@src/components/page/Page"
import Subtitle from "@src/components/typography/SubTitle";
import Title from "@src/components/typography/Title";
import { ThemeColor } from "@src/theme/interfaces/theme.color";
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from "@src/utils/constants";
import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "@src/theme/ThemeProvider";
import Caption from "@src/components/typography/Caption";
import AppButton from "@src/components/buttons/AppButton";
import { adaptiveSize } from "@src/utils/scaleUtils";
import Row from "@src/components/layout/Row";
import { OtpVerificationScreenProps, VerifyEmailScreenProps } from "@src/navigation/auth/auth.params";
import { useEffect, useRef, useState } from "react";
import { calculateRemainingSelection, formatTime } from "@src/utils/code.expires.utils";

let otpExpiryTime: number | null = null;
const OTP_DURATION = 15 * 60 * 1000;
let dummyCode = '123456';


const VerifyEmailScreen = ({ navigation, route }: VerifyEmailScreenProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const codeInputs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];
    const [timeLeft, setTimeLeft] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const codeExpired = timeLeft === 0;
    const { email } = route?.params || {};
    const borderColor = codeExpired || errorMessage ? colors.critical : colors.borderColor;

    useEffect(() => {
        if (!otpExpiryTime) {
            otpExpiryTime = Date.now() + OTP_DURATION;
        }

        const syncTimer = () => {
            const remaining = calculateRemainingSelection(otpExpiryTime!);
            setTimeLeft(remaining);
        };

        syncTimer(); // Initial sync

        const interval = setInterval(syncTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (codeExpired) {
            const otpString = otp.join('');
            if (otpString.length === 0) {
                setErrorMessage('OTP expired. Please request for new one.')
            }
        } else {
            setErrorMessage('')
        }
    }, [codeExpired]);


    const handleResend = () => {
        if (attempt >= 5) {
            setErrorMessage('You have send 5 maximum attempts in 24 hours, please try again after 24 hours')
            setIsResendDisabled(true)
        } else {
            setErrorMessage('')
            otpExpiryTime = Date.now() + OTP_DURATION;
            setTimeLeft(OTP_DURATION / 1000);
            setAttempt(attempt + 1);
            setOtp(['', '', '', '', '', '']);
        }
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;

        setOtp(newOtp);
        setErrorMessage('');

        if (text.length === 1 && index < 5) {
            codeInputs[index + 1].current?.focus();
        }

    }

    useEffect(() => {
        if (otp.join('').length === 6) {
            validateOtp()
        }
    }, [otp.join('').length]);

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            codeInputs[index - 1].current?.focus();
        }
    };

    const validateOtp = () => {
        const otpString = otp.join('');

        if (dummyCode === otpString) {
            navigation.navigate('EmailVerifiedScreen')
            setErrorMessage('')
        } else {
            setErrorMessage('Incorrect code. Please try again.')
        }
    }

    return (
        <Page>
            <Title style={styles.title}  >Muzive</Title>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Subtitle style={styles.subtitle} >Verify your Email</Subtitle>
            <Gap height={SPACING.TINY} />
            <Caption style={styles.subtitle} >{`We've sent a 6-digit code to your email:\n${email}`}</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />

            <Row style={styles.rowStyle}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                        key={index}
                        ref={codeInputs[index]}
                        placeholder=""
                        maxLength={1}
                        value={otp[index]}
                        style={[styles.inputStyle, { borderColor }]}
                        keyboardType="number-pad"
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                ))}
            </Row>
            {errorMessage ? (
                <Caption style={styles.caption} tone="critical" >{errorMessage}</Caption>
            ) : null}

            <Gap height={SPACING.MEDIUM_PLUS} />
            <AppButton
                title="Verify"
                onPress={validateOtp}
                style={styles.buttonStyle}
                fullWidth
                disabled={isResendDisabled}
            />
            <Gap height={SPACING.SMALL} />
            <Row style={styles.rowStyle} >
                {codeExpired ?
                    <Caption>Code expired</Caption>
                    :
                    <Caption>Code expires in : {formatTime(timeLeft)}{" "}</Caption>
                }
                <AppButton
                    title="Resend Again"
                    onPress={handleResend}
                    buttonType="plain"
                    disabled={isResendDisabled}
                />
            </Row>
        </Page>
    )
}

export default VerifyEmailScreen;

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
            marginTop: SPACING.EXTRA_SMALL,
            fontWeight: FONT_WEIGHTS.REGULAR
        },
        inputStyle: {
            width: '11.5%',
            borderBottomWidth: 1,
            color: colors.white,
            textAlign: 'center',
            fontSize: FONT_SIZES.SUBTITLE,
            padding: SPACING.EXTRA_SMALL
        },
        rowStyle: {
            justifyContent: 'space-between'
        }
    })