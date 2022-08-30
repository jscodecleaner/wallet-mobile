import React, { useState } from 'react';
import { View, Image, SafeAreaView, ScrollView } from 'react-native'; 
import { TextInput, Button, Text, withTheme } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './Logout.style';
import { useDispatch } from 'react-redux';
import CustomButton from '../../../components/CustomButton/CustomButton';

const LogoutScreen = (({theme, navigation}) => {

	const onClickCancel = () => {
		navigation.navigate('WalletList');
	}

	const onClickLogout = () => {
		navigation.navigate('Login');
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