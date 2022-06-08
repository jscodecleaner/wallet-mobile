import React, { useState } from 'react';
import { View, Image, StatusBar, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, HelperText, withTheme } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector, useDispatch } from 'react-redux';

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

const ChangePasswordScreen = ({ theme, navigation }) => {
    const styles = useStyles(theme);

    const dispatch = useDispatch();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [progress, setProgress] = useState(false);
    const [error, setError] = useState('');

    const { loginData } = useSelector((state: any) => state.user);

    const handleChangePassword = async () => {
        if (progress === true) {
            return;
        }
        setProgress(true);

        const url = `${BASE_URL}/${ApiEndpoint.CHANGE_PASSWORD}`;
        const data = {
            previousPassword: currentPassword,
            proposedPassword: newPassword1,
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
        if (currentPassword && newPassword1 && newPassword1 === newPassword2 && validatePassword(newPassword1).length === 0)
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
            <View style={{ width: '100%', paddingHorizontal: 15 }}>
                <View style={{ marginTop: 30, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Change password</Text>
                </View>
                <View style={{ width: '100%' }}>
                    <TextInput
                        autoCapitalize="none"
                        style={styles.input}
                        label="Current Password"
                        value={currentPassword}
                        onChangeText={text => setCurrentPassword(text)}
                    />
                </View>
                <View style={{ width: '100%' }}>
                    <TextInput
                        autoCapitalize="none"
                        secureTextEntry
                        style={styles.input}
                        label="New Password"
                        value={newPassword1}
                        onChangeText={text => setNewPassword1(text)}
                    />
                    {newPassword1 != '' && <PasswordValidationWarning password={newPassword1} />}
                </View>
                <View style={{ width: '100%' }}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        label="Confirm Password"
                        value={newPassword2}
                        onChangeText={text => setNewPassword2(text)}
                    />
                    {newPassword2 != '' && newPassword1 !== newPassword2 && <Text style={{ color: 'red' }}>Confirm password is not same as new password</Text>}
                </View>
                <Error error={error} />
                <View style={{ width: '100%', marginTop: 30 }}>
                    <CustomButton theme={theme} name="Change password" onClick={handleChangePassword} state={validateInput()} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default withTheme(ChangePasswordScreen);
