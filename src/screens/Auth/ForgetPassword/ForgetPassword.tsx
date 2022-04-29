import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { View } from 'react-native';
import { Button, Text, TextInput, withTheme } from 'react-native-paper';
import styles from './ForgetPassword.style';
import Error from '../../../components/error';

const ForgotPasswordScreen = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const forgotPassword = async () => {
    
  };

  const backToLogin = () => {
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <Text>Recover Password</Text>
      <View style={{width: '100%'}}>
        <TextInput
            autoCapitalize="none"
            outlineColor={theme.colors.background}
            style={styles.input}
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
        />
      </View>
      <Error error={error} />
      <View style={{width: '100%'}}>
        <Button style={styles.button} mode="contained" onPress={forgotPassword} color={theme.colors.primary} >
          Forgot Password
        </Button>
      </View>
      <View style={{width: '100%', alignItems: "flex-end"}}>
        <Button mode="text" uppercase={false} onPress={backToLogin} color={theme.colors.primary} >
          Back To Login
        </Button>
      </View>
    </View>
  )
};

export default withTheme(ForgotPasswordScreen);
