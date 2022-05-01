import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { View } from 'react-native';
import { Button, TextInput, withTheme } from 'react-native-paper';
import styles from './VerifyMFA.style';
import Error from '../../../components/error';
import { BASE_URL } from '../../../services/common';
import { ApiEndpoint, StatusCode } from '../../../types/enum';
import { universalPostRequestWithData } from '../../../services/RequestHandler';
import { LoginData } from '../../../types/interface';

const VerifyMFAScreen = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const verifyMFA = async () => {
    if (progress === true) {
      return;
    }
    setProgress(true);

    const url = `${BASE_URL}/${ApiEndpoint.VERIFY_MFA_OTP}`;
    const data = {
      otp,
    };

    // const response = await universalPostRequestWithData(url, data)
    // if (response && response.status === StatusCode.OKAY) {
    //     const data: LoginData = response.data.data

    //     data['expiry_time'] = Date.now() + data.expires_in * 1000
    //     data['login_time'] = Date.now()

    //     const newData = { ...data, access_token: data.access_token, ...getLoginDataFromToken(data.id_token) }
    //     localStorage.setItem('loginData', JSON.stringify(newData))
    //     setLoginData(newData)
    //     // if (!loginData.is_first_login) {
    //     //     popupNotification(`Welcome ${loginData.username}`, true)
    //     // }
    //     history.push('/')
    // } else {
    // }

    setProgress(false);
  };

  return (
    <View style={styles.container}>
      <View style={{width: '100%'}}>
        <TextInput
          autoCapitalize="none"
          outlineColor={theme.colors.background}
          style={styles.input}
          label="Enter code from authenticator"
          value={otp}
          onChangeText={text => setOtp(text)}
        />
      </View>
      <Error error={error} />
      <View style={{width: '100%'}}>
        <Button style={styles.button} mode="contained" onPress={verifyMFA} color={theme.colors.primary} >
          verify mfa
        </Button>
      </View>
    </View>
  )
};

export default withTheme(VerifyMFAScreen);
