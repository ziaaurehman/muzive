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
import Row from "@src/components/layout/Row";
import PasswordStrengthBar from "@src/components/input/PasswordStrengthBar";
import Card from "@src/components/layout/Card";
import { GoogleIcon } from "@src/assets/svg/auth/assets";
import { RegisterScreenProps } from "@src/navigation/auth/auth.params";
import { RegisterFormSchema, registerSchema } from "@src/schemas/auth/register.form.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useValidationRules } from "@src/utils/password.utils";
import { useState } from "react";

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<RegisterFormSchema>({
        resolver: yupResolver(registerSchema),
        mode: 'onChange',
    });

    const password = watch('password')
    const email = watch('email')

    return (
        <Page>
            <Title style={styles.title}  >Muzive</Title>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Subtitle style={styles.subtitle} >Create an Account</Subtitle>
            <Gap height={SPACING.TINY} />
            <Caption style={styles.subtitle} >Welcome to the Muzive</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Input
                label="Name"
                placeholder="Enter your Name"
                control={control}
                name="name"
                errorMessage={errors.name?.message}
                hasError={!!errors.name}
            />
            <Gap height={SPACING.SEMI_MEDIUM} />
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
                    <Gap height={SPACING.SEMI_MEDIUM} />
                    <AppButton
                        title="Sign Up with Google"
                        onPress={() => { navigation.navigate('GoogleAuthScreen', { authType: 'register' }) }}
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
                hasError={!!errors.password}
                errorMessage={errors.password?.message}
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
                hasError={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
            />
            <Gap height={SPACING.SEMI_MEDIUM} />
            <AppButton
                title="Sign Up"
                onPress={() => { navigation.navigate('VerifyEmailScreen', { email: 'avc@gmail.com' }) }}
                style={styles.buttonStyle}
                fullWidth
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

export default RegisterScreen;

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