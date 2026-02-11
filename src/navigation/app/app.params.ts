import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../root.params";

export type AppParamsList = {
    HomeScreen: undefined;
}

export type HomeScreenProp = NativeStackNavigationProp<
    AppParamsList & Pick<RootParamList, 'AuthNavigator'>,
    'HomeScreen'
>
