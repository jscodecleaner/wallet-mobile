import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, Text, TextInput, withTheme } from 'react-native-paper';
import styles from './ForgotUsername.style';
import Error from '../../../components/error';
import { ApiEndpoint, StatusCode } from '../../../types/enum';
import { BASE_URL } from '../../../services/common';
import { universalPostRequestWithData } from '../../../services/RequestHandler';
import CustomButton from '../../../components/CustomButton/CustomButton';

const ForgotUsernameScreen = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const getUsername = async () => {
    if (progress === true) {
      return;
    }
    setProgress(true);

    const url = `${BASE_URL}/${ApiEndpoint.FORGOT_PASSWORD}`;
    const data = {
      email: email,
    };

    const response: any = await universalPostRequestWithData(url, data);
    console.log(response);

    if (response.status === StatusCode.OKAY) {
      setError('OTP has been sent to your email.');
    } else {
      setError(response.data.message);
    }

    setProgress(false);
  };

  const backToLogin = () => {
    navigation.navigate('Login')
  }

  const validateInput = () => {
    if (email)
      return "normal";
    else
      return "disabled";
  }

  return (
    <View style={styles.container}>
      <Spinner
          visible={progress}
          textContent={'Loading...'}
          textStyle={{
            color: '#FFF',
        }}
      />
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
      <View style={{width: '100%', marginTop: 10}}>
        <CustomButton theme={theme} name="Get Email" onClick={getUsername} state={validateInput()} />
      </View>
      <View style={{width: '100%', alignItems: "flex-end"}}>
        <Button mode="text" uppercase={false} onPress={backToLogin} color={theme.colors.primary} >
          Back To Login
        </Button>
      </View>
    </View>
  )
};

export default withTheme(ForgotUsernameScreen);
