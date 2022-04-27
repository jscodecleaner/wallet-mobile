import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import type {ReactNode} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './app/screens/login';
import {isAuthenticated} from '@okta/okta-react-native';
import Home from './app/screens/home';
import {createConfig} from '@okta/okta-react-native';
import configFile from './auth.config';

import {useSelector} from 'react-redux';

import themeType from './app/types/theme';

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
    primary: '#216484',
    accent: 'yellow',
    background: '#DFEAED',
  },
};

const App: () => ReactNode = () => {
  const {authenticated} = useSelector(state => state.user);

  const checkAuthentication = async () => {
    const result = await isAuthenticated();
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    (async () => {
      await createConfig({
        clientId: configFile.oidc.clientId,
        redirectUri: configFile.oidc.redirectUri,
        endSessionRedirectUri: configFile.oidc.endSessionRedirectUri,
        discoveryUri: configFile.oidc.discoveryUri,
        scopes: configFile.oidc.scopes,
        requireHardwareBackedKeyStore: configFile.oidc.requireHardwareBackedKeyStore,
      });

      await checkAuthentication();
    })();
  }, []);

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator initialRouteName={authenticated ? 'Home' : 'Login'}>
          <Stack.Screen
            name="Login"
            options={{headerShown: false}}
            component={LoginScreen}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
