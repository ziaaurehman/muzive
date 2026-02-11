import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@src/screens/app/HomeScreen";
import { AppParamsList } from "./app.params";

const Stack = createNativeStackNavigator<AppParamsList>();

const AppTabNavigator = () => {
    const { Navigator, Screen } = Stack;
    return (
        <Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='HomeScreen'
        >
            <Screen name="HomeScreen" component={HomeScreen} />

        </Navigator>
    )
}

export default AppTabNavigator
