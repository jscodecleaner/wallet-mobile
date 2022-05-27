import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView, View, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text, TextInput, withTheme } from 'react-native-paper';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getSymbolFromCurrency from 'currency-symbol-map';
import SelectDropdown from 'react-native-select-dropdown';
import { Toast } from 'react-native-popup-confirm-toast'

import { useStyles } from './ToMyOtherAccount.style';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { AccountDataInterface } from '../../../types/interface';
import { handleFetchAccountList, getPaymentMethodList, getAvailableBalance, getTransactionFee, stringToFloat, floatToString } from '../../../services/utility';
import { validateName } from '../../../services/validators';


const ToMyOtherAccountScreen = ({theme, navigation}) => {
  const styles = useStyles(theme);

  const [accountList, setAccountList] = useState([] as AccountDataInterface[]);
  const [toAccountList, setToAccountList] = useState([] as AccountDataInterface[]);
  const [paymentMethodList, setPaymentMethodList] = useState([] as string[])
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');
  const [preApprovalAmount, setPreApprovalAmount] = useState(0)
  const [preApprovalTxnCount, setPreApprovalTxnCount] = useState(0)

  const [calculatingFee, setCalculatingFee] = useState(false);
  const [fundsavailable, setFundsAvailable] = useState(false);

  const {loginData} = useSelector((state: any) => state.user);

  useEffect(() => {
    setFundsAvailable(false)
    handleFetchAccountList(loginData.entity_id, loginData.access_token, setAccountList)
  }, []);

  const validateInput = () => {
    if (
      fromAccount.length > 0 &&
      toAccount.length > 0 &&
      paymentMethod.length > 0 &&
      paymentReference.length > 0 &&
      notes.length > 0 && validateName(notes) &&
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
    setCalculatingFee(true)
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

    if (!response) {
      setCalculatingFee(false)
      return
    }
    const { transactionFee, preApprovalAmount, preApprovalTxnCount } = response
    setFee(floatToString(transactionFee))
    const isFundsAvailable = stringToFloat(amount) + stringToFloat(transactionFee) <= getAvailableBalance(accountList, fromAccount)
    if (isFundsAvailable) {
      Toast.show({
        title: 'Available',
        text: 'Funds available. You may proceed.',
        color: theme.colors.notification,
        timeColor: theme.colors.primary,
        timing: 3000,
        icon: <MaterialCommunityIcons name='check' color={theme.colors.background} size={30}/>,
        position: 'top',
      })
      setFundsAvailable(true)
      setPreApprovalAmount(preApprovalAmount)
      setPreApprovalTxnCount(preApprovalTxnCount)
    } else {
      Toast.show({
        title: 'Not available',
        text: 'Not enough funds.',
        color: theme.colors.error,
        timeColor: theme.colors.primary,
        timing: 3000,
        icon: <MaterialCommunityIcons name='danger' color={theme.colors.background} size={30}/>,
        position: 'top',
      })
    }

    setCalculatingFee(false)
  }

  const toConfirm = () => {
    const fromAcc = getAccountFromAccountID(accountList, fromAccount);
    const toAcc = getAccountFromAccountID(accountList, fromAccount);

    const transactionDetails = {
      accountId: fromAccount,
      currentProfile: loginData.current_profile,
      fromAccountName: fromAcc.accountName,
      fromAccountNo: fromAcc.accountNumber,
      fromAccountHolderName: fromAcc.accountHolderName,
      fromCurrency: fromCurrency,
      fromAccountIban: fromAcc.iBan,
      providerName: fromAcc.providerName,
      amount: stringToFloat(amount),
      toAccountName: toAcc.accountName,
      toAccountNo: toAcc.accountNumber,
      toAccountHolderName: toAcc.accountHolderName,
      toCurrency: toCurrency,
      toAccountIban: toAcc.iBan,
      toSortCode: toAcc.sortCode,
      paymentReference,
      notes,
      paymentMethod,
      feeAmount: stringToFloat(fee),
      preApprovalAmount,
      preApprovalTxnCount,
      feeDepositAccountId: fromAcc.feeDepositeAccountId,
      feeDepositOwnerName: fromAcc.feeDepositOwnerName,
      feeDepositAccountIBan: fromAcc.feeDepositAccountIBan,
      details: "Transfer between own accounts",
      pAndTType: 'to-my-other-account',
    }
    navigation.navigate('ToMyOtherAccountConfirm', {transactionDetails: transactionDetails});
  }

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
          visible={calculatingFee}
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
                setFundsAvailable(false);
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
                value={paymentReference}
                onChangeText={text => setPaymentReference(text)}
              />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Payment details"
                value={notes}
                onChangeText={text => setNotes(text)}
                maxLength={35}
                error={notes && !validateName(notes)}
              />
          </View>
          <View>
            <TextInput
                style={styles.input}
                keyboardType='numeric'
                label={"You send " + `${fromCurrency && getSymbolFromCurrency(fromCurrency)}`}
                value={amount}
                onChangeText={text => {
                  setAmount(text)
                  setFundsAvailable(false)
                }}
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
          {fundsavailable && <CustomButton theme={theme} name="Continue" onClick={toConfirm} state={validateInput()} />}
          {!fundsavailable && <CustomButton theme={theme} name="Calculate Fee" onClick={handleFetchTransactionFee} state={validateInput()} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default withTheme(ToMyOtherAccountScreen);
