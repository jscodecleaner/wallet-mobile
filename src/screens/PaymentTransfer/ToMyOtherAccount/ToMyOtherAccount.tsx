import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView, View, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, Text, TextInput, withTheme } from 'react-native-paper';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import { Popup } from 'react-native-popup-confirm-toast';
import countryList from 'react-select-country-list'
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import CountryFlag from "react-native-country-flag";
import getSymbolFromCurrency from 'currency-symbol-map';
import SelectDropdown from 'react-native-select-dropdown';

import { useStyles } from './ToMyOtherAccount.style';
import Error from '../../../components/error';
import { ApiEndpoint, StatusCode } from '../../../types/enum';
import { BASE_URL, getProxyUrl } from '../../../services/common';
import { universalPostRequestWithData } from '../../../services/RequestHandler';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { AccountDataInterface } from '../../../types/interface';
import { handleFetchAccountList, getPaymentMethodList, getAvailableBalance, getTransactionFee, stringToFloat } from '../../../services/utility';

const transferTypeList = [
  "Personal",
  "Business"
];

const ToMyOtherAccountScreen = ({theme, navigation}) => {
  const styles = useStyles(theme);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(false);

  const [accountList, setAccountList] = useState([] as AccountDataInterface[]);
  const [toAccountList, setToAccountList] = useState([] as AccountDataInterface[]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');

  const [paymentMethodList, setPaymentMethodList] = useState([] as string[])

  const {loginData} = useSelector((state: any) => state.user);

  useEffect(() => {
    handleFetchAccountList(loginData.entity_id, loginData.access_token, setAccountList)
  }, []);

  const validateInput = () => {
    if (
      fromAccount.length > 0 &&
      toAccount.length > 0 &&
      paymentMethod.length > 0 &&
      description.length > 0 &&
      paymentDetails.length > 0 &&
      amount.length > 0 && amountCheck() == true
    )
      return "normal";
    else
      return "disabled";
  };

  const amountCheck = () => {
    return Number(parseFloat(amount==''?'0':amount).toFixed(2)) <= getAvailableBalance(accountList, fromAccount)
  }

  const getAccountFromAccountID = (accountList: AccountDataInterface[], accountId: string) => {
    return accountList.find((account) => account.accountId === accountId) || ({} as AccountDataInterface)
  }

  const handleFetchTransactionFee = async () => {
    setProgress(true)
    const response = await getTransactionFee(
      loginData.accessToken, 
      getAccountFromAccountID(accountList, fromAccount).providerName, 
      {
        currentProfile: loginData.current_profile, 
        amount: Number(parseFloat(amount==''?'0':amount).toFixed(2)), 
        paymentMethod, 
        currencyName: fromCurrency, 
        pAndTType: 'to-my-other-account', 
      }
    )

    // if (!response) {
    //     setProgress(false)
    //     return
    // }
    // const { transactionFee, preApprovalAmount, preApprovalTxnCount } = response
    // setFee(parseFloat(transactionFee))
    // const isFundsAvailable = amount + transactionFee <= getAvailableBalance(accountList, fromAccount)
    // if (isFundsAvailable) {
    //     popupNotification('Funds available. You may proceed.', true)
    //     setFundsAvailable(true)
    //     setPreApprovalAmount(preApprovalAmount)
    //     setPreApprovalTxnCount(preApprovalTxnCount)
    // } else {
    //     popupNotification('Not enough funds.', false)
    // }

    setProgress(false)
  }

  const numberInput = (value: string) => {
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
              data={accountList}
              onSelect={(selectedItem, index) => {
                setFromAccount(selectedItem.accountId);
                setFromCurrency(selectedItem.currencyData.currencyName);
                const methodList = getPaymentMethodList(accountList, selectedItem.accountId);
                setPaymentMethodList(methodList);
                methodList.length > 0 && setPaymentMethod(methodList[0]);

                const toAccountList = accountList
                  .filter((account) => account.accountId !== selectedItem.accountId)
                  .filter((account) => account.currencyData.currencyName === selectedItem.currencyData.currencyName);
                setToAccountList(toAccountList);
                setToAccount('');
                setToCurrency('');
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
                setToAccount(selectedItem.accountId)
              }}
              buttonStyle={styles.dropdownBtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdownBtnChildStyle}>
                    <Text style={styles.dropdownBtnTxt}>{selectedItem && selectedItem.accountId === toAccount ? selectedItem.accountName : 'To Account'}</Text>
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
              defaultValue={paymentMethod}
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
                style={styles.input}
                label="Payment details"
                value={paymentDetails}
                onChangeText={text => setPaymentDetails(text)}
              />
          </View>
          <View>
            <TextInput
                style={styles.input}
                keyboardType='numeric'
                label={"You send " + `${fromCurrency && getSymbolFromCurrency(fromCurrency)}`}
                value={amount}
                onChangeText={text => setAmount(text)}
                error={!amountCheck()}
              />
            <Text>{fromCurrency && `Available balance: ${getSymbolFromCurrency(fromCurrency)} ${getAvailableBalance(accountList, fromAccount)}`}</Text>
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
          <CustomButton theme={theme} name="Calculate Fee" onClick={handleFetchTransactionFee} state={validateInput()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default withTheme(ToMyOtherAccountScreen);
