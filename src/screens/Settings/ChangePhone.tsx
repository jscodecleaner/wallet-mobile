import React, { useState , useRef, useEffect} from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Text, HelperText, withTheme } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector, useDispatch } from 'react-redux';
import PhoneInput from 'react-native-phone-input';

import { Popup } from 'react-native-popup-confirm-toast';
import AsyncStorage from '@react-native-community/async-storage';

import Error from '../../components/error';
import { Logout, PhoneChanged } from '../../redux/slices/userSlice';
import { useStyles } from './Settings.style';
import { universalPutRequestWithData } from '../../services/RequestHandler';
import { BASE_URL, getProxyUrl } from '../../services/common';
import { ApiEndpoint, StatusCode } from '../../types/enum';
import CustomButton from '../../components/CustomButton/CustomButton';


const ChangePhoneScreen = ({ theme, navigation }) => {
    const styles = useStyles(theme);
    
    const newPhoneRef = useRef(undefined);
    
    const {loginData} = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    
    const [isValidMobilePhone, setIsValidMobilePhone] = useState(true)
    const [progress, setProgress] = useState(false);
    const [error, setError] = useState('');

    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    
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
            Popup.show({
                type: 'success',
                title: 'Change phone',
                textBody: response.data.message,
                buttonText: 'Back to settings',
                callback: () => {
                    Popup.hide();
                    dispatch(PhoneChanged(newPhoneNumber));
                    navigation.navigate('Settings');
                },
            })
        } else {
            setError(response.data.message);
        }

        setProgress(false);
    }

    const validateInput = () => {
        if (newPhoneRef.current?.isValidNumber((newPhoneNumber)))
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
                <View style={{ width: '100%', marginTop: 20 }}>
                    <Text style={{ marginBottom: 10}}>
                        Current Phone Number
                    </Text>
                    <PhoneInput
                        initialCountry={'uk'}
                        initialValue={loginData.phone_number}
                        textProps={{
                            placeholder: 'Enter a phone number...'
                        }}
                        disabled
                    />
                </View>
                <View style={{ width: '100%', marginTop: 20 }}>
                    <Text style={{ marginBottom: 10}}>
                        New Phone Number
                    </Text>
                    <PhoneInput
                        ref={newPhoneRef}
                        initialCountry={'uk'}
                        initialValue={'+44'}
                        onChangePhoneNumber={value => setNewPhoneNumber(value)}
                        textProps={{
                            placeholder: 'Enter a phone number...'
                        }}
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