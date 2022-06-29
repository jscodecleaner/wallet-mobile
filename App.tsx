import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import type { ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { useSelector, useDispatch } from 'react-redux';
import { Root } from 'react-native-popup-confirm-toast'
import { Popup } from 'react-native-popup-confirm-toast';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import themeType from './src/types/theme';
import { refreshTheToken } from './src/services/utility';
import { Login, Logout } from './src/redux/slices/userSlice';
import LoginScreen from './src/screens/Auth/Login/Login';
import ForgotPasswordScreen from './src/screens/Auth/ForgotPassword/ForgotPassword';
import VerifyMFAScreen from './src/screens/Auth/VerifyMFA/VerifyMFA';
import ForgotUsernameScreen from './src/screens/Auth/ForgotUsername/ForgotUsername';
import HomeScreen from './src/screens/Home/Home';
import WalletDetailsScreen from './src/screens/Home/WalletDetails/WalletDetails';
import EuroTransferScreen from './src/screens/PaymentTransfer/EuroTransfer/EuroTransfer';
import UkTransferScreen from './src/screens/PaymentTransfer/UkTransfer/UkTransfer';
import InternationalTransferScreen from './src/screens/PaymentTransfer/InternationalTransfer/InternationalTransfer';
import ToMyOtherAccountScreen from './src/screens/PaymentTransfer/ToMyOtherAccount/ToMyOtherAccount';
import { default as ToMyOtherAccountConfirmScreen } from './src/screens/PaymentTransfer/ToMyOtherAccount/ConfirmPayment';
import { default as EuroTransferConfirmScreen } from './src/screens/PaymentTransfer/EuroTransfer/ConfirmPayment';
import { default as UkTransferConfirmScreen } from './src/screens/PaymentTransfer/UkTransfer/ConfirmPayment';
import { default as InternationalTransferConfirmScreen } from './src/screens/PaymentTransfer/InternationalTransfer/ConfirmPayment';
import SettingsScreen from './src/screens/Home/Settings/Settings';
import ChangeEmailScreen from './src/screens/Settings/ChangeEmail';
import ChangePasswordScreen from './src/screens/Settings/ChangePassword';
import ChangePhoneScreen from './src/screens/Settings/ChangePhone';
import ChangePersonalInfoScreen from './src/screens/Settings/ChangePersonalInfo';

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
  const { loginData, authenticated, mfaVerified } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const TIME_TICK = 15 * 60 * 1000;

  const getNavigationScreen = () => {
    if (authenticated) {
      if (mfaVerified) {
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

    // const interval = setInterval(async () => {
    //   if (authenticated && mfaVerified) {
    //     const response: any = await refreshTheToken(loginData.username, loginData.refresh_token)
    //     if (response) {
    //       dispatch(Login({ ...loginData, ...response }));
    //     }
    //   }
    // }, TIME_TICK);
  
    // return () => clearInterval(interval);

    const sessionTimeout = setTimeout(async () => {
      console.log("app timeout")
      if (authenticated && mfaVerified) {
        await AsyncStorage.clear();

        Popup.show({
          type: 'confirm',
          title: 'Session Timeout',
          textBody: "Your current session has been expired. Please login again to continue.",
          buttonText: 'Login',
          confirmButtonStyle: {display: "none"},
          callback: () => {
            Popup.hide();
            dispatch(Logout());
            RNRestart.Restart();
          },
        })
      }
    }, TIME_TICK)

    return () => clearTimeout(sessionTimeout)
  }, []);

  return (
    <Root>
      <NavigationContainer>
        <PaperProvider theme={theme}>
            <Stack.Navigator initialRouteName={getNavigationScreen()}>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={LoginScreen}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotUsername"
              component={ForgotUsernameScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VerifyMFA"
              component={VerifyMFAScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WalletDetails"
              component={WalletDetailsScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="EuroTransfer"
              component={EuroTransferScreen}
              options={{
                headerShown: true,
                title: "Euro Transfer"
              }}
            />
            <Stack.Screen
              name="EuroTransferConfirm"
              component={EuroTransferConfirmScreen}
              options={{
                headerShown: true,
                title: "Confirm Euro Transfer"
              }}
            />
            <Stack.Screen
              name="UkTransfer"
              component={UkTransferScreen}
              options={{
                headerShown: true,
                title: 'UK Transfer'
              }}
            />
            <Stack.Screen
              name="UkTransferConfirm"
              component={UkTransferConfirmScreen}
              options={{
                headerShown: true,
                title: "Confirm UK Transfer"
              }}
            />
            <Stack.Screen
              name="InternationalTransfer"
              component={InternationalTransferScreen}
              options={{
                headerShown: true,
                title: "International Transfer"
              }}
            />
            <Stack.Screen
              name="InternationalTransferConfirm"
              component={InternationalTransferConfirmScreen}
              options={{
                headerShown: true,
                title: "Confirm International Transfer"
              }}
            />
            <Stack.Screen
              name="ToMyOtherAccount"
              component={ToMyOtherAccountScreen}
              options={{
                headerShown: true,
                title: "Transfer between my accounts"
              }}
            />
            <Stack.Screen
              name="ToMyOtherAccountConfirm"
              component={ToMyOtherAccountConfirmScreen}
              options={{
                headerShown: true,
                title: "Confirm to my other accounts"
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
            />
            <Stack.Screen
              name="ChangeEmail"
              component={ChangeEmailScreen}
              options={{
                headerShown: true,
                title: "Change Email"
              }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{
                headerShown: true,
                title: "Change Password"
              }}
            />
            <Stack.Screen
              name="ChangePhone"
              component={ChangePhoneScreen}
              options={{
                headerShown: true,
                title: "Change Phone"
              }}
            />
            <Stack.Screen
              name="ChangePersonalInfo"
              component={ChangePersonalInfoScreen}
              options={{
                headerShown: true,
                title: "Change personal Info"
              }}
            />
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </Root>
  );
};

export default App;
