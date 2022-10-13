import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { SafeAreaView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Spinner from 'react-native-loading-spinner-overlay'
import { Button, Text, TextInput, withTheme } from 'react-native-paper'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'
import { Popup , Toast } from 'react-native-popup-confirm-toast'
import countryList from 'react-select-country-list'
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native'
import CountryFlag from "react-native-country-flag"
import getSymbolFromCurrency from 'currency-symbol-map'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStyles } from './EuroTransfer.style'
import { transferTypeList } from '../../../services/common'
import CustomButton from '../../../components/CustomButton/CustomButton'
import SelectDropdown from 'react-native-select-dropdown'
import { getPaymentMethodList, getAccountFromAccountID, getAvailableBalance, getTransactionFee, floatToString, stringToFloat } from '../../../services/utility'
import { validateBICCode, validateSpecialCharacters, getSpecialCharacterErrorMessage } from '../../../services/validators'

const pAndTType = 'euro-transfer'

const EuroTransferScreen = ({ theme, navigation, route }) => {
  const { fromAccount } = route.params

  const styles = useStyles(theme)

  const [fundsavailable, setFundsAvailable] = useState(false)
  const [progress, setProgress] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const [fromAccountName, setFromAccountName] = useState('')
  const [paymentMethodList, setPaymentMethodList] = useState([] as string[])
  const [currency, setCurrency] = useState('')
  const [accountHolderName, setAccountHolderName] = useState('')
  const [iBanNumber, setIBanNumber] = useState('')
  const [bicCode, setBicCode] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [type, setType] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [notes, setNotes] = useState('')
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState('')
  const [preApprovalAmount, setPreApprovalAmount] = useState(0)
  const [preApprovalTxnCount, setPreApprovalTxnCount] = useState(0)

  const listOfCountry = useMemo(() => countryList().getData(), [])

  const { accountList } = useSelector((state: any) => state.accounts)
  const { loginData } = useSelector((state: any) => state.user)

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (accountList.length > 0) {
      const selectedItem = getAccountFromAccountID(accountList, fromAccount)
  
      setFromAccountName(selectedItem.accountName)
      setCurrency(selectedItem.currencyData.currencyName)
      const methodList = getPaymentMethodList(accountList, selectedItem.accountId)
      setPaymentMethodList(methodList)
      methodList.length > 0 && setPaymentMethod(methodList[0])
      setType(transferTypeList[0])
    }

    setFundsAvailable(false)
    setProgress(false)
  }, [accountList])

  const validateInput = () => {
    if (currency.length > 0 && 
      accountHolderName.length > 0 && 
      iBanNumber.length > 0 &&
      bicCode.length > 0 &&
      paymentReference.length > 0 &&
      amount.length > 0 && 
      amountCheck() &&
      validateBICCode(bicCode) &&
      validateSpecialCharacters(paymentReference) &&
      (notes ? validateSpecialCharacters(notes) : true) &&
      (address ? validateSpecialCharacters(address) : true) &&
      (city ? validateSpecialCharacters(city) : true) &&
      (state ? validateSpecialCharacters(state) : true) &&
      (postalCode ? validateSpecialCharacters(postalCode) : true) 
    )
      return "normal"
    else
      return "disabled"
  }

  const amountCheck = () => {
    return Number(parseFloat(amount==''?'0':amount).toFixed(2)) <= getAvailableBalance(accountList, fromAccount)
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
        amount: Number(parseFloat(amount==''?'0':amount).toFixed(2)), 
        paymentMethod, 
        currencyName: currency, 
        pAndTType, 
        bicCode,
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
  
    const transactionDetails = {
      accountId: fromAccount,
      currentProfile: loginData.current_profile,
      fromAccountName: fromAcc.accountName,
      fromAccountNo: fromAcc.accountNumber,
      fromAccountHolderName: fromAcc.accountHolderName,
      fromCurrency: currency,
      fromAccountIban: fromAcc.iBan,
      providerName: fromAcc.providerName,
      amount: stringToFloat(amount),
      toAccountHolderName: accountHolderName,
      toAccountIban: iBanNumber,
      toCurrency: currency,
      bicCode,
      paymentReference,
      notes,
      paymentMethod,
      feeAmount: stringToFloat(fee),
      feeDepositAccountId: fromAcc.feeDepositeAccountId,
      feeDepositOwnerName: fromAcc.feeDepositOwnerName,
      feeDepositAccountIBan: fromAcc.feeDepositAccountIBan,
      preApprovalAmount,
      preApprovalTxnCount,
      pAndTType,
    }
    navigation.navigate('EuroTransferConfirm', { transactionDetails })
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
              value={currency}
              disabled={true}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              label="Recipient's account name *"
              placeholder="Recipient's account name"
              value={accountHolderName}
              onChangeText={text => setAccountHolderName(text)}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              label="Recipient's IBAN *"
              placeholder="Recipient's IBAN"
              value={iBanNumber}
              onChangeText={text => setIBanNumber(text)}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              label="Recipient's account BIC Code *"
              placeholder="Recipient's account BIC Code"
              value={bicCode}
              maxLength={11}
              onChangeText={text => setBicCode(text)}
              underlineColor={theme.colors.lightGrey}
            />
            <Text style={styles.referenceWarning}>{ bicCode && !validateBICCode(bicCode) && ("Length should be 8 or 11 characters. Allowed A-Z and 0-9") }</Text>
          </View>
        </View>
        
        <Collapse style={{ marginTop: 20 }} onToggle={setCollapsed}>
          <CollapseHeader>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recipient address</Text>
              <FontAwesomeIcons name={collapsed ? "chevron-up" : "chevron-down"} color={theme.colors.text} size={18} />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Address"
                value={address}
                onChangeText={text => setAddress(text)}
                underlineColor={theme.colors.lightGrey}
              />
              <Text style={styles.referenceWarning}>{ address && !validateSpecialCharacters(address) && (getSpecialCharacterErrorMessage()) }</Text>
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="City"
                value={city}
                onChangeText={text => setCity(text)}
                underlineColor={theme.colors.lightGrey}
              />
              <Text style={styles.referenceWarning}>{ city && !validateSpecialCharacters(city) && (getSpecialCharacterErrorMessage()) }</Text>
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="State"
                value={state}
                onChangeText={text => setState(text)}
                underlineColor={theme.colors.lightGrey}
              />
              <Text style={styles.referenceWarning}>{ state && !validateSpecialCharacters(state) && (getSpecialCharacterErrorMessage()) }</Text>
            </View>
            <SelectDropdown
              data={listOfCountry}
              onSelect={(selectedItem, index) => {
                setCountry(selectedItem.value)
              }}
              buttonStyle={styles.countryDropdownBtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.countryDropdownBtnChildStyle}>
                    <Text style={styles.countryDropdownBtnTxt}>{ selectedItem ? selectedItem.label : 'Country' }</Text>
                    <FontAwesomeIcons name="chevron-down" color={theme.colors.text} size={14} />
                  </View>
                )
              }}
              dropdownOverlayColor="transparent"
              dropdownStyle={styles.countryDropdownDropdownStyle}
              rowStyle={styles.countryDropdownRowStyle}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View style={styles.countryDropdownRowChildStyle}>
                    <CountryFlag isoCode={item.value} size={25} />
                    <Text style={styles.countryDropdownRowTxt}>{ item.label }</Text>
                  </View>
                )
              }}
            />
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Postal Code"
                value={postalCode}
                onChangeText={text => setPostalCode(text)}
                underlineColor={theme.colors.lightGrey}
              />
              <Text style={styles.referenceWarning}>{ postalCode && !validateSpecialCharacters(postalCode) && (getSpecialCharacterErrorMessage()) }</Text>
            </View>
          </CollapseBody>
        </Collapse>
        
        <View style={{ marginTop: 20 }}>
          <View>
            <SelectDropdown
              data={transferTypeList}
              onSelect={(selectedItem, index) => {
                setType(selectedItem)
              }}
              buttonStyle={styles.dropdownBtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdownBtnChildStyle}>
                    <Text style={styles.dropdownBtnTxt}>{ selectedItem || 'Type *' }</Text>
                    <FontAwesomeIcons name="chevron-down" color={theme.colors.text} size={14} />
                  </View>
                )
              }}
              defaultValue={type}
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
              placeholder="Short payment reference"
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
              label={"You send " + `${currency && getSymbolFromCurrency(currency)}` + " *"}
              placeholder="Amount to transfer"
              value={amount}
              onChangeText={text => {
                setAmount(text)
                setFundsAvailable(false)
              }}
              error={!amountCheck()}
              underlineColor={theme.colors.lightGrey}
            />
            <Text>{ currency && `Available balance: ${getSymbolFromCurrency(currency)} ${getAvailableBalance(accountList, fromAccount)}` }</Text>
          </View>
          <View>
            <TextInput
              style={[styles.input, styles.inputBorder]}
              label={"Fee " + `${currency && getSymbolFromCurrency(currency)}` + " *"}
              value={fee ? fee : "Yet to calculate"}
              disabled={true}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
        </View>

        <View style={{ width: '100%', marginTop: 20, marginBottom: 15 }}>
          { fundsavailable && <CustomButton theme={theme} name="Continue" onClick={toConfirm} state={validateInput()} /> }
          { !fundsavailable && <CustomButton theme={theme} name="Calculate Fee" onClick={handleFetchTransactionFee} state={validateInput()} /> }
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default withTheme(EuroTransferScreen)
