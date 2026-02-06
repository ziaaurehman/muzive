import Page from "@src/components/page/Page"
import Title from "@src/components/typography/Title"
import { StyleSheet, Text } from "react-native"
import { useTheme } from "@src/theme/ThemeProvider"
import { ThemeColor } from "@src/theme/interfaces/theme.color"

const AuthenicateByScreen = () => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    return (
        <Page>
            <Title style={styles.title}  >Muzive</Title>
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
    })
