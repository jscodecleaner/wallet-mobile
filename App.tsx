import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import type {ReactNode} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {useSelector} from 'react-redux';

import Login from './src/screens/Auth/Login/Login';
import Home from './src/screens/Home/Home';
import themeType from './src/types/theme';
import ForgetPassword from './src/screens/Auth/ForgetPassword/ForgetPassword';
import VerifyMFA from './src/screens/Auth/VerifyMFA/VerifyMFA';

LogBox.ignoreAllLogs(true);

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      background: string;
    }
  }
}

const Stack = createNativeStackNavigator();

const theme: themeType = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5',
    accent: 'yellow',
    background: '#DFEAED',
  },
};

const App: () => ReactNode = () => {
  const {authenticated, mfaActived} = useSelector((state: any) => state.user);

  const getNavigationScreen = () => {
    if (authenticated) {
      if (mfaActived) {
        return 'Home';
      } else {
        return 'VerifyMFA'
      }
    } else {
      return 'Login';
    }
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator initialRouteName={authenticated ? 'Home' : 'Login'}>
          <Stack.Screen
            name="Login"
            options={{headerShown: false}}
            component={Login}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgetPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VerifyMFA"
            component={VerifyMFA}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
