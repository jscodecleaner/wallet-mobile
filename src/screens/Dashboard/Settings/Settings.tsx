import React from 'react';
import { Text, withTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Settings.style';

const SettingsScreen = ({theme, navigation}) => {

  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome</Text>
    </SafeAreaView>
  );
};

export default withTheme(SettingsScreen);
