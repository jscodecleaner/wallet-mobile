import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import type {ReactNode} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {useSelector} from 'react-redux';
import { Root } from 'react-native-popup-confirm-toast'

import Login from './src/screens/Auth/Login/Login';
import Home from './src/screens/Home/Home';
import themeType from './src/types/theme';
import ForgotPassword from './src/screens/Auth/ForgotPassword/ForgotPassword';
import VerifyMFA from './src/screens/Auth/VerifyMFA/VerifyMFA';
import ForgotUsername from './src/screens/Auth/ForgotUsername/ForgotUsername';
import Dashboard from './src/screens/Dashboard/Dashoard';
import WalletDetails from './src/screens/Dashboard/WalletDetails/WalletDetails';
import EuroTransfer from './src/screens/PaymentTransfer/EuroTransfer/EuroTransfer';
import UkTransfer from './src/screens/PaymentTransfer/UkTransfer/UkTransfer';
import InternationalTransfer from './src/screens/PaymentTransfer/InternationalTransfer/InternationalTransfer';
import ToMyOtherAccount from './src/screens/PaymentTransfer/ToMyOtherAccount/ToMyOtherAccount';
import { default as ToMyOtherAccountConfirm } from './src/screens/PaymentTransfer/ToMyOtherAccount/ConfirmPayment';

LogBox.ignoreAllLogs(true);

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      error: string;
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
    error: 'red'
  },
};

const App: () => ReactNode = () => {
  const {authenticated, loginData} = useSelector((state: any) => state.user);

  const getNavigationScreen = () => {
    if (authenticated) {
      if (loginData.is_mfa_active) {
        return 'Dashboard';
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
    <Root>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Stack.Navigator initialRouteName={getNavigationScreen()}>
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
              component={ForgotPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForgotUsername"
              component={ForgotUsername}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="VerifyMFA"
              component={VerifyMFA}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="WalletDetails"
              component={WalletDetails}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="EuroTransfer"
              component={EuroTransfer}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="UkTransfer"
              component={UkTransfer}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="InternationalTransfer"
              component={InternationalTransfer}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="ToMyOtherAccount"
              component={ToMyOtherAccount}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="ToMyOtherAccountConfirm"
              component={ToMyOtherAccountConfirm}
              options={{headerShown: true}}
            />
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </Root>
  );
};

export default App;
