import React from 'react';
import { Text, Button, withTheme } from 'react-native-paper';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import { Logout } from '../../redux/slices/userSlice';

const Home = ({theme, navigation}) => {
  const dispatch = useDispatch();

  const logout = async () => {
    await AsyncStorage.clear();
    dispatch(Logout());
    navigation.navigate('Login');
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
