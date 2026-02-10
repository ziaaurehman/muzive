import Gap from "@src/components/layout/Gap";
import Page from "@src/components/page/Page"
import Subtitle from "@src/components/typography/SubTitle";
import Title from "@src/components/typography/Title";
import { ThemeColor } from "@src/theme/interfaces/theme.color";
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from "@src/utils/constants";
import { StyleSheet } from "react-native";
import { useTheme } from "@src/theme/ThemeProvider";
import Caption from "@src/components/typography/Caption";
import { adaptiveSize } from "@src/utils/scaleUtils";
import { EmailVerifiedScreenProps } from "@src/navigation/auth/auth.params";
import { useEffect } from "react";

const EmailVerifiedScreen = ({ navigation }: EmailVerifiedScreenProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('MusicStylesScreen')
        }, 2000)
    }, [])

    return (
        <Page>
            <Title style={styles.title}  >Muzive</Title>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Subtitle style={styles.subtitle} >Email Verified</Subtitle>
            <Gap height={SPACING.MEDIUM_PLUS} />
            <Caption style={styles.subtitle} >Your account has been created successfully.</Caption>
            <Gap height={SPACING.MEDIUM_PLUS} />
        </Page>
    )
}

export default EmailVerifiedScreen;

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