import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from "react-redux";
import { SafeAreaView, View, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, Text, TextInput, withTheme } from 'react-native-paper';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import { Popup } from 'react-native-popup-confirm-toast';
import countryList from 'react-select-country-list'
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import CountryFlag from "react-native-country-flag";
import getSymbolFromCurrency from 'currency-symbol-map';

import { useStyles } from './ToMyOtherAccount.style';
import Error from '../../../components/error';
import { ApiEndpoint, StatusCode } from '../../../types/enum';
import { BASE_URL, getProxyUrl } from '../../../services/common';
import { universalPostRequestWithData } from '../../../services/RequestHandler';
import CustomButton from '../../../components/CustomButton/CustomButton';
import SelectDropdown from 'react-native-select-dropdown';
import { AccountDataInterface } from '../../../types/interface';

const transferTypeList = [
  "Personal",
  "Business"
];
const paymentMethodList = [
  "SEPA-SCT",
];

const ToMyOtherAccountScreen = ({theme, navigation}) => {
  const styles = useStyles(theme);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [fromAccountList, setFromAccountList] = useState([] as AccountDataInterface[]);
  const [toAccountList, setToAccountList] = useState([] as AccountDataInterface[]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');

  const listOfCountry = useMemo(() => countryList().getData(), [])

  useEffect(() => {
    setFromAccountList([
      {
        accountName: 'James',
        accountId: '111',
        accountHolderName: 'holder1',
        iBan: 'GB57CLRB04045220015144',
        currencyData: {
          currencyName: 'GBP',
          fundsAvailable: 100.00,
          reservedBalance: 0.00,
          accountBalance: 100.00
        },
        accountNumber: 123456,
        accountType: 'AAA',
        paymentMethod: 'paymentMethod1',
        sortCode: 123,
        feeDepositeAccountId: 234,
        feeDepositOwnerName: 'depositOwner',
        feeDepositAccountIBan: 'depositiban',
        pAndTType: 'pandt',
        providerName: 'provider1'
      },
      {
        accountName: 'name2',
        accountId: '222',
        accountHolderName: 'holder2',
        iBan: 'GB57CLRB04045220015144',
        currencyData: {
          currencyName: 'GBP',
          fundsAvailable: 200.00,
          reservedBalance: 0.00,
          accountBalance: 200.00
        },
        accountNumber: 123456,
        accountType: 'BBB',
        paymentMethod: 'paymentMethod2',
        sortCode: 123,
        feeDepositeAccountId: 234,
        feeDepositOwnerName: 'depositOwner2',
        feeDepositAccountIBan: 'depositiban2',
        pAndTType: 'pandt2',
        providerName: 'provider2'
      },
      {
        accountName: 'name3',
        accountId: '333',
        accountHolderName: 'holder3',
        iBan: 'GB57CLRB04045220015144',
        currencyData: {
          currencyName: 'GBP',
          fundsAvailable: 300.00,
          reservedBalance: 0.00,
          accountBalance: 300.00
        },
        accountNumber: 123456,
        accountType: 'CCC',
        paymentMethod: 'paymentMethod3',
        sortCode: 123,
        feeDepositeAccountId: 234,
        feeDepositOwnerName: 'depositOwner3',
        feeDepositAccountIBan: 'depositiban3',
        pAndTType: 'pandt3',
        providerName: 'provider3'
      }
    ]);

    setToAccountList([
      {
        accountName: 'James',
        accountId: '111',
        accountHolderName: 'holder1',
        iBan: 'GB57CLRB04045220015144',
        currencyData: {
          currencyName: 'GBP',
          fundsAvailable: 100.00,
          reservedBalance: 0.00,
          accountBalance: 100.00
        },
        accountNumber: 123456,
        accountType: 'AAA',
        paymentMethod: 'paymentMethod1',
        sortCode: 123,
        feeDepositeAccountId: 234,
        feeDepositOwnerName: 'depositOwner',
        feeDepositAccountIBan: 'depositiban',
        pAndTType: 'pandt',
        providerName: 'provider1'
      },
      {
        accountName: 'name2',
        accountId: '222',
        accountHolderName: 'holder2',
        iBan: 'GB57CLRB04045220015144',
        currencyData: {
          currencyName: 'GBP',
          fundsAvailable: 200.00,
          reservedBalance: 0.00,
          accountBalance: 200.00
        },
        accountNumber: 123456,
        accountType: 'BBB',
        paymentMethod: 'paymentMethod2',
        sortCode: 123,
        feeDepositeAccountId: 234,
        feeDepositOwnerName: 'depositOwner2',
        feeDepositAccountIBan: 'depositiban2',
        pAndTType: 'pandt2',
        providerName: 'provider2'
      },
      {
        accountName: 'name3',
        accountId: '333',
        accountHolderName: 'holder3',
        iBan: 'GB57CLRB04045220015144',
        currencyData: {
          currencyName: 'GBP',
          fundsAvailable: 300.00,
          reservedBalance: 0.00,
          accountBalance: 300.00
        },
        accountNumber: 123456,
        accountType: 'CCC',
        paymentMethod: 'paymentMethod3',
        sortCode: 123,
        feeDepositeAccountId: 234,
        feeDepositOwnerName: 'depositOwner3',
        feeDepositAccountIBan: 'depositiban3',
        pAndTType: 'pandt3',
        providerName: 'provider3'
      }
    ])
  }, []);
  // const backToLogin = () => {
  //   navigation.navigate('Login')
  // }

  const validateInput = () => {
    if (
      description.length > 0 &&
      paymentDetails.length > 0 &&
      amount.length > 0
    )
      return "normal";
    else
      return "disabled";
  }

  const calculateFee = () => {

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
      <ScrollView style={styles.scrollViewStyle}>
        <View style={{marginTop: 10}}>
          <View>
            <SelectDropdown
              data={fromAccountList}
              onSelect={(selectedItem, index) => {
                setFromCurrency(selectedItem.currencyData.currencyName)
              }}
              buttonStyle={styles.dropdownBtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdownBtnChildStyle}>
                    <Text style={styles.dropdownBtnTxt}>{selectedItem ? selectedItem.accountName : 'From Account'}</Text>
                    <FontAwesomeIcons name="chevron-down" color={theme.colors.text} size={14} />
                  </View>
                )
              }}
              dropdownOverlayColor="transparent"
              dropdownStyle={styles.dropdownDropdownStyle}
              rowStyle={styles.dropdownRowStyle}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View style={styles.dropdownRowChildStyle}>
                    <Text style={styles.dropdownRowTxt}>{item.accountName}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              outlineColor={theme.colors.background}
              style={styles.input}
              label="Currency"
              value={fromCurrency}
              disabled={true}
            />
          </View>
          <View>
            <SelectDropdown
              data={toAccountList}
              onSelect={(selectedItem, index) => {
                setToCurrency(selectedItem.currencyData.currencyName)
              }}
              buttonStyle={styles.dropdownBtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdownBtnChildStyle}>
                    <Text style={styles.dropdownBtnTxt}>{selectedItem ? selectedItem.accountName : 'From Account'}</Text>
                    <FontAwesomeIcons name="chevron-down" color={theme.colors.text} size={14} />
                  </View>
                )
              }}
              dropdownOverlayColor="transparent"
              dropdownStyle={styles.dropdownDropdownStyle}
              rowStyle={styles.dropdownRowStyle}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View style={styles.dropdownRowChildStyle}>
                    <Text style={styles.dropdownRowTxt}>{item.accountName}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              outlineColor={theme.colors.background}
              style={styles.input}
              label="Currency"
              value={toCurrency}
              disabled={true}
            />
          </View>
          <View>
            <SelectDropdown
              data={paymentMethodList}
              onSelect={(selectedItem, index) => {
                setPaymentMethod(selectedItem)
              }}
              buttonStyle={styles.dropdownBtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdownBtnChildStyle}>
                    <Text style={styles.dropdownBtnTxt}>{selectedItem ? selectedItem : 'Payment Method'}</Text>
                    <FontAwesomeIcons name="chevron-down" color={theme.colors.text} size={14} />
                  </View>
                )
              }}
              dropdownOverlayColor="transparent"
              dropdownStyle={styles.dropdownDropdownStyle}
              rowStyle={styles.dropdownRowStyle}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View style={styles.dropdownRowChildStyle}>
                    <Text style={styles.dropdownRowTxt}>{item}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                outlineColor={theme.colors.background}
                style={styles.input}
                label="Add description"
                value={description}
                onChangeText={text => setDescription(text)}
              />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                outlineColor={theme.colors.background}
                style={styles.input}
                label="Payment details"
                value={paymentDetails}
                onChangeText={text => setPaymentDetails(text)}
              />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                outlineColor={theme.colors.background}
                style={styles.input}
                label={"You send " + getSymbolFromCurrency("EUR")}
                value={amount}
                onChangeText={text => setAmount(text)}
              />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                outlineColor={theme.colors.background}
                style={styles.input}
                label="Yet to calculate"
                value={fee}
                disabled={true}
              />
          </View>
        </View>
        
        <View style={{width: '100%', marginTop: 20, marginBottom: 15}}>
          <CustomButton theme={theme} name="Calculate Fee" onClick={calculateFee} state={validateInput()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default withTheme(ToMyOtherAccountScreen);
