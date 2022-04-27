import React, {useState} from 'react';
import {View, Image, StyleSheet, StatusBar} from 'react-native';
import {TextInput, Button, Text, withTheme} from 'react-native-paper';
import {signIn} from '@okta/okta-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Error from '../../../components/error';
import { useDispatch } from 'react-redux';
import {Login} from '../../../redux/slices/userSlice';
import styles from './Login.style';

const LoginScreen = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState('');

  const login = () => {
    if (progress === true) {
      return;
    }
    setProgress(true);
    signIn({username, password})
      .then(_token => {
        setProgress(false);
        setUserName('');
        setPassword('');
        setError('');
        dispatch(Login(_token));
      })
      .then(() => navigation.navigate('Home'))
      .catch(error => {
        setProgress(false);
        setUserName('');
        setPassword('');
        setError(error.message);
      });
  };

  const reset = () => {
    setProgress(false);
    setUserName('');
    setPassword('');
    setError('');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Spinner
        visible={progress}
        textContent={'Loading...'}
        textStyle={{
          color: '#FFF',
        }}
      />
      <Image
        style={styles.image}
        source={require('../assets/images/logo.png')}
      />
      <TextInput
        autoCapitalize="none"
        outlineColor={theme.colors.background}
        style={styles.input}
        label="User Name"
        value={username}
        onChangeText={text => setUserName(text)}
      />
      <TextInput
        outlineColor={theme.colors.background}
        style={styles.input}
        secureTextEntry
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Error error={error} />
      <View style={{flexDirection: 'row'}}>
        <Button style={styles.button} mode="contained" onPress={login}>
          Login
        </Button>
        <Button style={styles.button} mode="contained" onPress={reset}>
          Reset
        </Button>
      </View>
      <Text>v 1.0</Text>
      <Text>{'\u00A9'} CfsWallet</Text>
    </View>
  );
};

export default withTheme(LoginScreen);

