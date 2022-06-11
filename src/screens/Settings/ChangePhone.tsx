import React, { useState , useRef, useEffect} from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Text, HelperText, withTheme } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector, useDispatch } from 'react-redux';
import PhoneInput from "react-native-phone-number-input";
import { AsYouType } from 'libphonenumber-js';
import { Popup } from 'react-native-popup-confirm-toast';
import AsyncStorage from '@react-native-community/async-storage';

import Error from '../../components/error';
import { Logout } from '../../redux/slices/userSlice';
import { useStyles } from './Settings.style';
import { universalPutRequestWithData } from '../../services/RequestHandler';
import { BASE_URL, getProxyUrl } from '../../services/common';
import { ApiEndpoint, StatusCode } from '../../types/enum';
import CustomButton from '../../components/CustomButton/CustomButton';

const ChangePhoneScreen = ({ theme, navigation }) => {
    const styles = useStyles(theme);

    const {loginData} = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    const [isValidMobilePhone, setIsValidMobilePhone] = useState(true)
    const [progress, setProgress] = useState(false);
    const [error, setError] = useState('');

    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const newPhoneInput = useRef<PhoneInput>(null);

    const handleChangePhone = async () => {
        if (progress === true) {
            return;
        }
        setProgress(true);

        const url = `${BASE_URL}/${ApiEndpoint.UPDATE_USER_ATTRIBUTE}`;
        const data = {
            userAttributeName: 'phone_number',
            userAttributeValue: newPhoneNumber,
            'white-label': getProxyUrl(),
        };

        const response: any = await universalPutRequestWithData(url, data);

        if (response && response.status === StatusCode.OKAY) {
            await AsyncStorage.clear();
            Popup.show({
                type: 'success',
                title: 'Change phone',
                textBody: response.data.message,
                buttonText: 'Login',
                callback: () => {
                    Popup.hide();
                    dispatch(Logout());
                    navigation.navigate('Login');
                },
            })
        } else {
            setError(response.data.message);
        }

        setProgress(false);
    }

    const validateInput = () => {
        if (newPhoneInput.current?.isValidNumber(getNationalNumberFromPhoneNumber(newPhoneNumber)))
            return "normal";
        else
            return "disabled";
    }

    const getCountryFromPhoneNumber = (phoneNumber) => {
        const asYouType = new AsYouType()
        asYouType.input(phoneNumber)
        const result = asYouType.getNumber()
        if (result)
            return result.country
        else
            return 'US'
    }

    const getNationalNumberFromPhoneNumber = (phoneNumber) => {
        const asYouType = new AsYouType()
        asYouType.input(phoneNumber)
        const result = asYouType.getNumber()
        if (result)
            return result.nationalNumber
        else
            return ''
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
                <View style={{ width: '100%', marginTop: 20 }}>
                    <Text>Current Phone Number</Text>
                    <PhoneInput
                        defaultCode={getCountryFromPhoneNumber(loginData.phone_number)}
                        defaultValue={getNationalNumberFromPhoneNumber(loginData.phone_number)}
                        containerStyle={{ width: '100%', backgroundColor: 'transaprent' }}
                        textContainerStyle={{ backgroundColor: 'transaprent' }}
                        withDarkTheme
                        withShadow
                        disabled
                    />
                </View>
                <View style={{ width: '100%', marginTop: 20 }}>
                    <Text>New Phone Number</Text>
                    <PhoneInput
                        ref={newPhoneInput}
                        defaultCode='US'
                        onChangeFormattedText={(value) => {
                            setNewPhoneNumber(value)
                            if (newPhoneInput.current?.isValidNumber(getNationalNumberFromPhoneNumber(value))) {
                                setIsValidMobilePhone(true)
                            } else {
                                setIsValidMobilePhone(false)
                            }
                        }}
                        containerStyle={{ width: '100%', backgroundColor: 'transaprent' }}
                        textContainerStyle={{ backgroundColor: 'transaprent' }}
                        withDarkTheme
                        withShadow
                    />
                    {!isValidMobilePhone && <Text style={{ color: 'red' }}>Invalid phone number</Text>}
                </View>

                <Error error={error} />
                <View style={{ width: '100%', marginTop: 30 }}>
                    <CustomButton theme={theme} name="Change phone" onClick={handleChangePhone} state={validateInput()} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default withTheme(ChangePhoneScreen);