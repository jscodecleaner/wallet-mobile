import React, { useEffect, useState } from 'react';
import { Text, Button, withTheme } from 'react-native-paper';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import getSymbolFromCurrency from 'currency-symbol-map';
import CountryFlag from "react-native-country-flag";
import styles from './WalletList.style';
import { WalletAccountInterface } from '../../../types/interface';

const WalletListScreen = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const {loginData} = useSelector((state: any) => state.user);
  const [accounts, setAccounts] = useState([] as WalletAccountInterface[]);

  useEffect(() => {
    setAccounts([
      {
        accountId: '111',
        accountName: 'James',
        accountType: 'AAA',
        iBan: 'GB57CLRB04045220015144',
        currencyData: {
          isoCode: 'gb',
          currencyName: 'GBP',
          fundsAvailable: 0.00,
          reservedBalance: '0.00',
          accountBalance: 0.00,
        },
      },
      {
        accountId: '222',
        accountName: 'Second',
        accountType: 'BBB',
        iBan: 'GB93CFZZ00994300700716',
        currencyData: {
          isoCode: 'eu',
          currencyName: 'EUR',
          fundsAvailable: 0.00,
          reservedBalance: '0.00',
          accountBalance: 0.00,
        }
      },
      {
        accountId: '333',
        accountName: 'GBP test',
        accountType: 'CCC',
        iBan: 'GB29CLRB04045220015454',
        currencyData: {
          isoCode: 'gb',
          currencyName: 'GBP',
          fundsAvailable: 0.00,
          reservedBalance: '0.00',
          accountBalance: 0.00,
        }
      },
      {
        accountId: '444',
        accountName: 'EUR card',
        accountType: 'DDD',
        iBan: 'GB66CFZZ00994300700717',
        currencyData: {
          isoCode: 'eu',
          currencyName: 'EUR',
          fundsAvailable: 0.00,
          reservedBalance: '0.00',
          accountBalance: 0.00,
        }
      }
    ]);
  }, []);

  const showDetails = (index: number) => {
    navigation.navigate('WalletDetails', {walletDetails: accounts[index]})
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewStyle}>
        {accounts.map((walletAccount, index) => (
          <TouchableOpacity style={[styles.card, {borderLeftColor: theme.colors.primary,}]} onPress={()=>showDetails(index)} key={index}>
            <View style={{marginBottom: 30}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.fontBold}>Account name: </Text>
                <Text>{walletAccount.currencyData.currencyName} card</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.fontBold}>IBAN: </Text>
                <Text>{walletAccount.iBan}</Text>
              </View>
            </View>
            <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{alignItems: 'center', marginLeft: 10}}>
                <CountryFlag isoCode={walletAccount.currencyData.isoCode} size={25} />
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.fontBold}>Currency </Text>
                  <Text>{walletAccount.currencyData.currencyName}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.fontBold}>Funds available </Text>
                  <Text style={styles.fontBold}>Reserved available </Text>
                  <Text style={styles.fontBold}>Account available </Text>
                </View>
                <View>
                  <Text>{getSymbolFromCurrency(walletAccount.currencyData.currencyName)}{walletAccount.currencyData.fundsAvailable}</Text>
                  <Text>{getSymbolFromCurrency(walletAccount.currencyData.currencyName)}{walletAccount.currencyData.reservedBalance}</Text>
                  <Text>{getSymbolFromCurrency(walletAccount.currencyData.currencyName)}{walletAccount.currencyData.accountBalance}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default withTheme(WalletListScreen);
