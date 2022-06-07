import React, {useState} from 'react';
import {View, Image, StatusBar, SafeAreaView} from 'react-native';
import {TextInput, Button, Text, HelperText, withTheme} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSelector, useDispatch} from 'react-redux';

import Error from '../../components/error';
import { useStyles } from './Settings.style';
import { universalPostRequestWithData } from '../../services/RequestHandler';
import { BASE_URL, getProxyUrl } from '../../services/common';
import { ApiEndpoint, StatusCode } from '../../types/enum';
import { LoginData } from '../../types/interface';
import CustomButton from '../../components/CustomButton/CustomButton';
import { Logout } from '../../redux/slices/userSlice';
import { validateEmail, validatePassword } from '../../services/validators';
import { PasswordValidationWarning } from '../../components/PasswordValidationWarning/PasswordValidationWarning';

const ChangeEmailScreen = ({theme, navigation}) => {
  const styles = useStyles(theme);
  
  const dispatch = useDispatch();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState('');

  const {loginData} = useSelector((state: any) => state.user);

  const handleChangeEmail = async () => {
    if (progress === true) {
      return;
    }
    setProgress(true);

    const url = `${BASE_URL}/${ApiEndpoint.CHANGE_EMAIL}`;
    const data = {
      currentEmail: loginData.email,
      newEmail,
      password,
      'white-label': getProxyUrl(),
    };

    const response: any = await universalPostRequestWithData(url, data);

    if (response && response.status === StatusCode.OKAY) {
      dispatch(Logout());
      navigation.navigate('Login');
    } else {
      setError(response.data.message);
    }

    setProgress(false);
  }

  const validateInput = () => {
    if (newEmail && validateEmail(newEmail) && password && validatePassword(password).length === 0)
      return "normal";
    else
      return "disabled";
  }

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
          visible={progress}
          textContent={'Loading...'}
          textStyle={{
            color: '#FFF',
        }}
      />
      <View style={{width: '100%', paddingHorizontal: 15}}>
        <View style={{marginTop: 30, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Change email</Text>
        </View>
        <View style={{width: '100%'}}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Current Email"
            value={loginData.email}
            disabled={true}
          />
        </View>
        <View style={{width: '100%'}}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="New email"
            value={newEmail}
            onChangeText={text => setNewEmail(text)}
          />
          {newEmail != '' && <HelperText type="error">
            Invalid email address
          </HelperText>}
        </View>
        <View style={{width: '100%'}}>
          <TextInput
            style={styles.input}
            secureTextEntry
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
          />
          {password != '' && <PasswordValidationWarning password={password} />}
        </View>
        <Error error={error} />
        <View style={{width: '100%', marginTop: 30}}>
          <CustomButton theme={theme} name="Change email" onClick={handleChangeEmail} state={validateInput()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(ChangeEmailScreen);
