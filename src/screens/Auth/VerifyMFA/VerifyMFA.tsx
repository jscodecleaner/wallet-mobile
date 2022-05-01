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
import CustomButton from '../../../components/CustomButton/CustomButton';
import AsyncStorage from '@react-native-community/async-storage';

// const getLoginDataFromToken = (token: string) => {
//   if (!token) return {}
//   const data: any = jwt.decode(token)
//   const newData = {}
//   Object.entries(data).forEach(([key, value]) => {
//       if (key.includes('custom')) {
//           key = key.split('custom:')[1]
//       }
//       if (value === 'False') {
//           value = false
//       }
//       if (value === 'True') {
//           value = true
//       }
//       newData[key] = value
//   })

//   return newData
// }

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

    const response = await universalPostRequestWithData(url, data)
    if (response && response.status === StatusCode.OKAY) {
      const data: LoginData = response.data.data

      data['expiry_time'] = Date.now() + data.expires_in * 1000
      data['login_time'] = Date.now()

      const newData = { ...data, access_token: data.access_token}
      // const newData = { ...data, access_token: data.access_token, ...getLoginDataFromToken(data.id_token) }
      AsyncStorage.setItem('loginData', JSON.stringify(newData))

      navigation.navigate('Home')
    } else {
      setError(response.data.message)
    }

    setProgress(false);
  };

  const backToLogin = () => {
    navigation.navigate('Login')
  }

  const validateInput = () => {
    if (otp)
      return "normal";
    else
      return "disabled";
  }

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
      <View style={{width: '100%', marginTop: 10}}>
        <CustomButton theme={theme} name="Verify MFA" onClick={verifyMFA} state={validateInput()} />
      </View>
      <View style={{width: '100%', alignItems: "flex-end"}}>
        <Button mode="text" uppercase={false} onPress={backToLogin} color={theme.colors.primary} >
          Back To Login
        </Button>
      </View>
    </View> 
  )
};

export default withTheme(VerifyMFAScreen);
