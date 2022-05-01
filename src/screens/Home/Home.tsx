import React from 'react';
import { Text, Button, withTheme } from 'react-native-paper';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Home = ({theme}) => {
  const logout = async () => {
    await AsyncStorage.clear();
  };

  return (
    <View>
      <Text>Welcome</Text>
      <Button mode="contained" onPress={logout} color={theme.colors.primary} >
        Logout
      </Button>
    </View>
  );
};

export default withTheme(Home);
