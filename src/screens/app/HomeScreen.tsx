import AppButton from "@src/components/buttons/AppButton"
import Page from "@src/components/page/Page"
import { logout } from "../../../lib/firebase/auth";
import { Alert } from "react-native";
import { useState } from "react";
import { HomeScreenProp } from "@src/navigation/app/app.params";

const HomeScreen = ({ navigation }: { navigation: HomeScreenProp }) => {
    const [isLoading, setIsLoading] = useState(false)


    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await logout();
            navigation.replace('AuthNavigator', { screen: 'AuthenicateByScreen' })
        } catch (error: any) {
            Alert.alert("Logout Failed", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Page title="Home"
            fixedBottomSeparator
            fixedBottomComponent={
                <AppButton
                    title="Logout"
                    onPress={handleLogout}
                    fullWidth
                    loading={isLoading}
                />
            }
        >

        </Page>
    )
}

export default HomeScreen