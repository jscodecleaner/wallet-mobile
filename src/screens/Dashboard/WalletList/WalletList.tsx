import React, { useEffect, useState } from 'react';
import { Text, Button, withTheme } from 'react-native-paper';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
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
        accountName: 'aaa',
        accountType: 'AAA',
        iBan: 'XXXXX1234567890',
        currencyData: {
          currencyName: 'EUR',
          fundsAvailable: 100.00,
          reservedBalance: '10.00',
          accountBalance: 100.00,
        },
      },
      {
        accountId: '222',
        accountName: 'bbb',
        accountType: 'BBB',
        iBan: 'XXXXX1234567890',
        currencyData: {
          currencyName: 'EUR',
          fundsAvailable: 100.00,
          reservedBalance: '10.00',
          accountBalance: 100.00,
        }
      },
      {
        accountId: '333',
        accountName: 'ccc',
        accountType: 'CCC',
        iBan: 'XXXXX1234567890',
        currencyData: {
          currencyName: 'GBP',
          fundsAvailable: 100.00,
          reservedBalance: '10.00',
          accountBalance: 100.00,
        }
      }
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          borderLeftColor: theme.colors.primary,
          borderLeftWidth: 8,
          borderWidth: 1,
          width: '100%',
          borderRadius: 8,
          padding: 5,
        }}
      >
        <View>
          <Text>Account name EUR card</Text>
          <Text>IBAN 123456789QWERTYUIIOOASDFHJJK</Text>
        </View>
        <View>
          <CountryFlag isoCode="de" size={25} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(WalletListScreen);
