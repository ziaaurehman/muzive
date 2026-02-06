import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthParamsList } from "./auth.params";
import AuthenicateByScreen from "@src/screens/auth/AuthenicateByScreen";
import RegisterScreen from "@src/screens/auth/RegisterScreen";
import LoginScreen from "@src/screens/auth/LoginScreen";
import ForgotPasswordScreen from "@src/screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "@src/screens/auth/ResetPasswordScreen";
const Stack = createNativeStackNavigator<AuthParamsList>();

const AuthStackNavigator = () => {
    const { Navigator, Screen } = Stack;
    return (
        <Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='AuthenicateByScreen'
        >
            <Screen name="AuthenicateByScreen" component={AuthenicateByScreen} />
            <Screen name="RegisterScreen" component={RegisterScreen} />
            <Screen name="LoginScreen" component={LoginScreen} />
            <Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />

        </Navigator>
    )
}

export default AuthStackNavigator
