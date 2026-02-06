/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { ThemeProvider } from '@src/theme/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@src/navigation/RootNavigator';
function App() {

  return (
    <SafeAreaProvider>
      <ThemeProvider >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>

  );
}

export default App;
