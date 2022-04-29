import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { View } from 'react-native';
import { Button, TextInput, withTheme } from 'react-native-paper';
import styles from './VerifyMFA.style';
import Error from '../../../components/error';

const VerifyMFAScreen = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const verifyMFA = async () => {
    
  };

  return (
    <View style={styles.container}>
      <View style={{width: '100%'}}>
        <TextInput
          autoCapitalize="none"
          outlineColor={theme.colors.background}
          style={styles.input}
          label="Enter code from authenticator"
          value={code}
          onChangeText={text => setCode(text)}
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
