import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthParamsList } from "./auth.params";
import AuthenicateByScreen from "@src/screens/auth/AuthenicateByScreen";

const Stack = createNativeStackNavigator<AuthParamsList>();

const AuthStackNavigator = () => {
    const { Navigator, Screen } = Stack;
    return (
        <Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='AuthenicateByScreen'
        >
            <Screen name="AuthenicateByScreen" component={AuthenicateByScreen} />
        </Navigator>
    )
}

export default AuthStackNavigator
