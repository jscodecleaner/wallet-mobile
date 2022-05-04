import React from 'react';
import { Text, Button, withTheme } from 'react-native-paper';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../redux/slices/userSlice';
import styles from './Home.style';

const Home = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const {loginData} = useSelector((state: any) => state.user);

  const logout = async () => {
    await AsyncStorage.clear();
    dispatch(Logout());
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome</Text>
      <Button mode="contained" onPress={logout} color={theme.colors.primary} >
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default withTheme(Home);
