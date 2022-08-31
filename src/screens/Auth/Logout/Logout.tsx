import React, { useState } from 'react';
import { View, Image, SafeAreaView, ScrollView } from 'react-native'; 
import { TextInput, Button, Text, withTheme } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch } from 'react-redux';

import styles from './Logout.style';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { BASE_URL, getProxyUrl } from '../../../services/common';
import { ApiEndpoint, StatusCode } from '../../../types/enum';
import { universalPostRequestWithData } from '../../../services/RequestHandler';
import { Logout } from '../../../redux/slices/userSlice';

const LogoutScreen = (({theme, navigation}) => {
	const dispatch = useDispatch();

	const [progress, setProgress] = useState(false);

	const onClickCancel = () => {
		navigation.navigate('WalletList');
	}

	const onClickLogout = async () => {
		navigation.navigate('Login');
		if (progress === true) {
      return;
    }
    setProgress(true);

    const url = `${BASE_URL}/${ApiEndpoint.LOGOUT}`;
    const data = {
      'white-label': getProxyUrl(),
    };

    const response: any = await universalPostRequestWithData(url, data);
		dispatch(Logout());
		navigation.navigate('Login');

    setProgress(false);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.subTitleArea}>
				<Text style={[styles.fontBold, styles.subTitle]}>Confirm logout?</Text>
				<Text>Are you sure want to log out?</Text>
			</View>
			<View style={styles.buttonArea}>
        <CustomButton 
          theme={theme} 
          name="Cancel" 
          onClick={onClickCancel} 
        />
				<CustomButton 
          theme={theme} 
          name="Logout" 
          onClick={onClickLogout} 
        />
			</View>
		</SafeAreaView>
	)

})

export default withTheme(LogoutScreen);