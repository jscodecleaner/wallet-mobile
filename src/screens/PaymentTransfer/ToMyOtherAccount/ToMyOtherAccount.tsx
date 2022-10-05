import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from "react-redux"
import { SafeAreaView, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Text, TextInput, withTheme } from 'react-native-paper'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import getSymbolFromCurrency from 'currency-symbol-map'
import SelectDropdown from 'react-native-select-dropdown'
import { Toast } from 'react-native-popup-confirm-toast'

import { useStyles } from './ToMyOtherAccount.style'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { AccountDataInterface } from '../../../types/interface'
import { getPaymentMethodList, getAvailableBalance, getTransactionFee, stringToFloat, floatToString, getAccountFromAccountID } from '../../../services/utility'
import { validateSpecialCharacters, getSpecialCharacterErrorMessage } from '../../../services/validators'


const pAndTType = 'to-my-other-account'

const ToMyOtherAccountScreen = ({ theme, navigation, route }) => {
  const { fromAccount } = route.params

  const styles = useStyles(theme)

  const [toAccountList, setToAccountList] = useState([] as AccountDataInterface[])
  const [paymentMethodList, setPaymentMethodList] = useState([] as string[])
  const [fromAccountName, setFromAccountName] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('')
  const [toCurrency, setToCurrency] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [notes, setNotes] = useState('')
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState('')
  const [preApprovalAmount, setPreApprovalAmount] = useState(0)
  const [preApprovalTxnCount, setPreApprovalTxnCount] = useState(0)

  const [progress, setProgress] = useState(true)
  const [fundsavailable, setFundsAvailable] = useState(false)

  const { loginData } = useSelector((state: any) => state.user)
  const { accountList } = useSelector((state: any) => state.accounts)

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (accountList.length > 0) {
      const selectedItem = getAccountFromAccountID(accountList, fromAccount)
  
      setFromAccountName(selectedItem.accountName)
      setFromCurrency(selectedItem.currencyData.currencyName)
      const methodList = getPaymentMethodList(accountList, selectedItem.accountId)
      setPaymentMethodList(methodList)
      methodList.length > 0 && setPaymentMethod(methodList[0])
  
      const toAccountList = accountList
        .filter((account) => account.accountId !== selectedItem.accountId)
        .filter((account) => account.currencyData.currencyName === selectedItem.currencyData.currencyName && account.providerName === selectedItem.providerName )
      setToAccountList(toAccountList)
    }

    setFundsAvailable(false)
    setProgress(false)
  }, [accountList])

  const validateInput = () => {
    if (
      fromAccount.length > 0 &&
      toAccount.length > 0 &&
      paymentMethod.length > 0 &&
      paymentReference.length > 0 &&
      amount.length > 0 && amountCheck()
    )
      return "normal"
    else
      return "disabled"
  }

  const amountCheck = () => {
    return Number(parseFloat(amount === '' ? '0' : amount).toFixed(2)) <= getAvailableBalance(accountList, fromAccount)
  }

  const handleFetchTransactionFee = async () => {
    const fromAcc = getAccountFromAccountID(accountList, fromAccount)
    const providerName = getAccountFromAccountID(accountList, fromAccount).providerName
    setProgress(true) 
    const response = await getTransactionFee(
      loginData.access_token, 
      encodeURIComponent(providerName),
      {
        currentProfile: loginData.current_profile, 
        amount: Number(parseFloat(amount === '' ? '0' : amount).toFixed(2)), 
        paymentMethod, 
        currencyName: fromCurrency, 
        pAndTType, 
        fromAccountIban: fromAcc.iBan
      }
    )

    if (!response) {
      setProgress(false)
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

    setProgress(false)
  }

  const toConfirm = () => {
    const fromAcc = getAccountFromAccountID(accountList, fromAccount)
    const toAcc = getAccountFromAccountID(accountList, toAccount)

    const transactionDetails = {
      accountId: fromAccount,
      currentProfile: loginData.current_profile,
      fromAccountName: fromAcc.accountName,
      fromAccountNo: fromAcc.accountNumber,
      fromAccountHolderName: fromAcc.accountHolderName,
      fromCurrency,
      fromAccountIban: fromAcc.iBan,
      providerName: fromAcc.providerName,
      amount: stringToFloat(amount),
      toAccountName: toAcc.accountName,
      toAccountNo: toAcc.accountNumber,
      toAccountHolderName: toAcc.accountHolderName,
      toCurrency,
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
      pAndTType,
    }
    navigation.navigate('ToMyOtherAccountConfirm', { transactionDetails })
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
      <KeyboardAwareScrollView style={styles.scrollViewStyle}>
        <View style={{ marginTop: 10 }}>
          <View>
            <TextInput
              autoCapitalize="none"
              style={[styles.input, styles.inputBorder]}
              label="From Account *"
              value={fromAccountName}
              disabled={true}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={[styles.input, styles.inputBorder]}
              label="Currency *"
              value={fromCurrency}
              disabled={true}
              underlineColor={theme.colors.lightGrey}
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
                    <Text style={styles.dropdownBtnTxt}>{ selectedItem && selectedItem.accountId === toAccount ? selectedItem.accountName : 'To Account' }</Text>
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
                    <Text style={styles.dropdownRowTxt}>{ item.accountName }</Text>
                  </View>
                )
              }}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={[styles.input, styles.inputBorder]}
              label="Currency *"
              value={toCurrency}
              disabled={true}
              underlineColor={theme.colors.lightGrey}
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
                    <Text style={styles.dropdownBtnTxt}>{ selectedItem || 'Payment Method *' }</Text>
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
                    <Text style={styles.dropdownRowTxt}>{ item }</Text>
                  </View>
                )
              }}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              label="Payment reference *"
              value={paymentReference}
              onChangeText={text => setPaymentReference(text)}
              underlineColor={theme.colors.lightGrey}
            />
            <Text style={styles.referenceWarning}>{ paymentReference && !validateSpecialCharacters(paymentReference) && (getSpecialCharacterErrorMessage()) }</Text>
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              label="Internal notes"
              value={notes}
              onChangeText={text => setNotes(text)}
              maxLength={35}
              underlineColor={theme.colors.lightGrey}
            />
            <Text style={styles.referenceWarning}>{ notes && !validateSpecialCharacters(notes) && (getSpecialCharacterErrorMessage()) }</Text>
          </View>
          <View>
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              label={"You send " + `${fromCurrency && getSymbolFromCurrency(fromCurrency)}` + " *"}
              placeholder="Amount to transfer"
              value={amount}
              onChangeText={text => {
                setAmount(text)
                setFundsAvailable(false)
              }}
              error={!amountCheck()}
              underlineColor={theme.colors.lightGrey}
            />
            <Text>{ fromCurrency && `Available balance: ${getSymbolFromCurrency(fromCurrency)} ${getAvailableBalance(accountList, fromAccount)}` }</Text>
          </View>
          <View>
            <TextInput
              style={[styles.input, styles.inputBorder]}
              label={"Fee " + `${fromCurrency && getSymbolFromCurrency(fromCurrency)}` + " *"}
              value={fee ? fee : "Yet to calculate"}
              disabled={true}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
        </View>
        
        <View style={{ width: '100%', marginTop: 20, marginBottom: 35 }}>
          { fundsavailable && <CustomButton theme={theme} name="Continue" onClick={toConfirm} state={validateInput()} /> }
          { !fundsavailable && <CustomButton theme={theme} name="Calculate Fee" onClick={handleFetchTransactionFee} state={validateInput()} /> }
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default withTheme(ToMyOtherAccountScreen)
