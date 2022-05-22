import React, { useEffect, useState } from 'react';
import { Text, Button, withTheme } from 'react-native-paper';
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import CountryFlag from "react-native-country-flag";
import styles from './WalletDetails.style';
import { WalletAccountInterface } from '../../../types/interface';
import CustomButton from '../../../components/CustomButton/CustomButton';

const WalletDetailsScreen = ({theme, navigation, route}) => {
  const dispatch = useDispatch();
  const {loginData} = useSelector((state: any) => state.user);
  const {walletDetails} = route.params;

  const validateButton = (acceptable: string, currencyName: string) => {
    if (acceptable == 'ALL')
      return "normal";
    else if (acceptable == currencyName)
      return "normal";
    else
      return "disabled";
  }

  const onEuroTransfer = () => {
    navigation.navigate('EuroTransfer')
  }

  const onInternational = () => {
    navigation.navigate('InternationalTransfer')
  }

  const onUkTransfer = () => {
    navigation.navigate('UkTransfer')
  }

  const onToMyOtherAccount = () => {
    navigation.navigate('ToMyOtherAccount')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom: 20}}>
        <Text>IBAN: {walletDetails.iBan}</Text>
        <Text>Currency: {walletDetails.currencyData.currencyName}</Text>
      </View>
      <View>
        <CustomButton 
          theme={theme} 
          name="Transfer to Other Account" 
          state={validateButton("ALL", walletDetails.currencyData.currencyName)} 
          onClick={onToMyOtherAccount} 
        />
        <CustomButton 
          theme={theme} 
          name="Euro Transfer" 
          state={validateButton("EUR", walletDetails.currencyData.currencyName)} 
          onClick={onEuroTransfer} 
        />
        <CustomButton 
          theme={theme} 
          name="International" 
          state={validateButton("ALL", walletDetails.currencyData.currencyName)} 
          onClick={onInternational} 
        />
        <CustomButton 
          theme={theme} 
          name="UK Transfer" 
          state={validateButton("GBP", walletDetails.currencyData.currencyName)} 
          onClick={onUkTransfer}
        />
      </View>
    </SafeAreaView>
  );
};

export default withTheme(WalletDetailsScreen);
