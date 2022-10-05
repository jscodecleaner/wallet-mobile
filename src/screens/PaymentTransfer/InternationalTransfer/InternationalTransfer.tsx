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
import SelectDropdown from 'react-native-select-dropdown'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStyles } from './InternationalTransfer.style'
import { transferTypeList } from '../../../services/common'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { getAccountFromAccountID, getPaymentMethodList, getTransactionFee, getAvailableBalance, stringToFloat, floatToString } from '../../../services/utility'
import { validateSpecialCharacters, getSpecialCharacterErrorMessage } from '../../../services/validators'
import useProviderBankCodeTypeList from '../../../services/hooks'

const pAndTType = 'international-transfer'

const InternationalTransferScreen = ({ theme, navigation, route }) => {
  const { fromAccount } = route.params

  const styles = useStyles(theme)
  const dispatch = useDispatch()
  const providerBankCodeTypeList = useProviderBankCodeTypeList()

  const [fundsavailable, setFundsAvailable] = useState(false)
  const [progress, setProgress] = useState(false)
  const [addressCollapsed, setAddressCollapsed] = useState(false)
  const [bankCollapsed, setBankCollapsed] = useState(false)
  const [intermediaryCollapsed, setIntermediaryCollapsed] = useState(false)

  const [fromAccountName, setFromAccountName] = useState('')
  const [paymentMethodList, setPaymentMethodList] = useState([] as string[])
  const [currency, setCurrency] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  // const [sortCode, setSortCode] = useState('');
  const [type, setType] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [notes, setNotes] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress1, setRecipientAddress1] = useState('')
  const [recipientAddress2, setRecipientAddress2] = useState('')
  const [recipientCity, setRecipientCity] = useState('')
  const [recipientState, setRecipientState] = useState('')
  const [recipientCountry, setRecipientCountry] = useState('')
  const [recipientPostcode, setRecipientPostcode] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAddress1, setBankAddress1] = useState('')
  const [bankAddress2, setBankAddress2] = useState('')
  const [bankCodeType, setBankCodeType] = useState('')
  const [bankPostcode, setBankPostcode] = useState('')
  const [bankCountry, setBankCountry] = useState('')
  const [intermediaryName, setIntermediaryName] = useState('')
  const [intermediaryAddress1, setIntermediaryAddress1] = useState('')
  const [intermediaryAddress2, setIntermediaryAddress2] = useState('')
  const [intermediaryCodeType, setIntermediaryCodeType] = useState('')
  const [intermediaryPostcode, setIntermediaryPostcode] = useState('')
  const [intermediaryCountry, setIntermediaryCountry] = useState('')
  
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
        fromAccountIban: fromAcc.iBan
        // sortCode: parseInt(sortCode)
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

  const amountCheck = () => {
    return Number(parseFloat(amount==''?'0':amount).toFixed(2)) <= getAvailableBalance(accountList, fromAccount)
  }

  const validateInput = () => {
    if (currency.length > 0 && 
      fromAccountName.length > 0 && 
      accountNumber.length > 0 &&
      paymentReference.length > 0 &&
      amount.length > 0 && amountCheck()
    )
      return "normal"
    else
      return "disabled"
  }

  const toConfirm = () => {
    const fromAcc = getAccountFromAccountID(accountList, fromAccount)

    const transactionDetails = {
      accountId: fromAccount,
      fromAccountIban: fromAcc.iBan,
      providerName: fromAcc.providerName,
      fromAccountName: fromAcc.accountName,
      fromAccountNo: fromAcc.accountNumber,
      feeDepositOwnerName: fromAcc.feeDepositOwnerName,
      feeDepositAccountId: fromAcc.feeDepositeAccountId,
      feeDepositAccountIBan: fromAcc.feeDepositAccountIBan,
      fromAccountHolderName: fromAcc.accountHolderName,

      notes,
      transType: type,
      paymentMethod,
      paymentReference,
      preApprovalAmount,
      preApprovalTxnCount,
      toIBAN: accountNumber,
      toCurrency: currency,
      fromCurrency: currency,
      currentProfile: loginData.current_profile,
      // toSortCode: sortCode,
      pAndTType,
      amount: stringToFloat(amount),
      feeAmount: stringToFloat(fee),

      toAccountHolderName: recipientName,
      beneficiaryAddr1: recipientAddress1,
      beneficiaryAddr2: recipientAddress2,
      beneficiaryPostCode: recipientPostcode,
      beneficiaryCity: recipientCity,
      beneficiaryState: recipientState,
      beneficiaryCountry: recipientCountry,
      
      beneficiaryBankAddr1: bankAddress1,
      beneficiaryBankAddr2: bankAddress2,
      beneficiaryBankCountry: bankCountry,
      // beneficiaryBankCity: bankDetails.city,
      // beneficiaryBankState: bankDetails.state,
      beneficiaryBankPostCode: bankPostcode,
      beneficiaryBankBankName: bankName,
      // beneficiaryBankBankCode: bankDetails.bankCode,
      // beneficiaryBankSwiftBic: bankDetails.swiftBic,

      interBankDetailsAddr1: intermediaryAddress1,
      interBankDetailsAddr2: intermediaryAddress2,
      interBankDetailsCountry: intermediaryCountry,
      // interBankDetailsCity: interBankDetails.city,
      // interBankDetailsState: interBankDetails.state,
      interBankDetailsPostCode: intermediaryCountry,
      interBankDetailsBankName: intermediaryName,
      // interBankDetailsBankCode: interBankDetails.bankCode,
      // interBankDetailsSwiftBic: interBankDetails.swiftBic,
    }
    navigation.navigate('InternationalTransferConfirm', { transactionDetails })
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
              label="Account number/IBAN *"
              placeholder="Recipient account number"
              value={accountNumber}
              onChangeText={text => setAccountNumber(text)}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
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
              maxLength={35}
              onChangeText={text => setNotes(text)}
              underlineColor={theme.colors.lightGrey}
            />
            <Text style={styles.referenceWarning}>{ notes && !validateSpecialCharacters(notes) && (getSpecialCharacterErrorMessage()) }</Text>
          </View>
        </View>
        
        <Collapse style={{ marginTop: 20 }} onToggle={setAddressCollapsed}>
          <CollapseHeader>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recipient's details</Text>
              <FontAwesomeIcons name={addressCollapsed ? "chevron-up" : "chevron-down"} color={theme.colors.text} size={18} />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Name"
                value={recipientName}
                onChangeText={text => setRecipientName(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Address 1"
                value={recipientAddress1}
                onChangeText={text => setRecipientAddress1(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Address 2"
                value={recipientAddress2}
                onChangeText={text => setRecipientAddress2(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="City"
                value={recipientCity}
                onChangeText={text => setRecipientCity(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="State"
                value={recipientState}
                onChangeText={text => setRecipientState(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <SelectDropdown
              data={listOfCountry}
              onSelect={(selectedItem, index) => {
                setRecipientCountry(selectedItem.value)
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
                label="Postcode"
                value={recipientPostcode}
                onChangeText={text => setRecipientPostcode(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
          </CollapseBody>
        </Collapse>

        <Collapse style={{ marginTop: 20 }} onToggle={setBankCollapsed}>
          <CollapseHeader>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recipient's bank address</Text>
              <FontAwesomeIcons name={bankCollapsed ? "chevron-up" : "chevron-down"} color={theme.colors.text} size={18} />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Name"
                value={bankName}
                onChangeText={text => setBankName(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Address 1"
                value={bankAddress1}
                onChangeText={text => setBankAddress1(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Address 2"
                value={bankAddress2}
                onChangeText={text => setBankAddress2(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
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
                      <Text style={styles.dropdownBtnTxt}>{ selectedItem || 'Bank Code Type' }</Text>
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
                label="Bank Postcode"
                value={bankPostcode}
                onChangeText={text => setBankPostcode(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <SelectDropdown
              data={listOfCountry}
              onSelect={(selectedItem, index) => {
                setBankCountry(selectedItem.value)
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
          </CollapseBody>
        </Collapse>
        
        <Collapse style={{ marginTop: 20 }} onToggle={setIntermediaryCollapsed}>
          <CollapseHeader>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Intermediary bank address</Text>
              <FontAwesomeIcons name={intermediaryCollapsed ? "chevron-up" : "chevron-down"} color={theme.colors.text} size={18} />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Name"
                value={intermediaryName}
                onChangeText={text => setIntermediaryName(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Address 1"
                value={intermediaryAddress1}
                onChangeText={text => setIntermediaryAddress1(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <View>
              <TextInput
                autoCapitalize="none"
                style={styles.input}
                label="Address 2"
                value={intermediaryAddress2}
                onChangeText={text => setIntermediaryAddress2(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
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
                      <Text style={styles.dropdownBtnTxt}>{ selectedItem || 'Bank Code Type' }</Text>
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
                label="Bank Postcode"
                value={intermediaryPostcode}
                onChangeText={text => setIntermediaryPostcode(text)}
                underlineColor={theme.colors.lightGrey}
              />
            </View>
            <SelectDropdown
              data={listOfCountry}
              onSelect={(selectedItem, index) => {
                setIntermediaryCountry(selectedItem.value)
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
          </CollapseBody>
        </Collapse>
        
        <View style={{ marginTop: 20 }}>
          <View>
            <TextInput
              autoCapitalize="none"
              keyboardType="numeric"
              style={styles.input}
              label={"You send " + `${currency && getSymbolFromCurrency(currency)}` + " *"}
              placeholder="Amount to transfer"
              value={amount}
              onChangeText={text => setAmount(text)}
              underlineColor={theme.colors.lightGrey}
            />
          </View>
          <View>
            <TextInput
              autoCapitalize="none"
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

export default withTheme(InternationalTransferScreen)
