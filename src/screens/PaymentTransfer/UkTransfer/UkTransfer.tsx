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

import { useStyles } from './UkTransfer.style';
import Error from '../../../components/error';
import { ApiEndpoint, StatusCode } from '../../../types/enum';
import { BASE_URL, getProxyUrl, transferTypeList } from '../../../services/common';
import { universalPostRequestWithData } from '../../../services/RequestHandler';
import CustomButton from '../../../components/CustomButton/CustomButton';
import SelectDropdown from 'react-native-select-dropdown';
import { AccountDataInterface } from '../../../types/interface';

const paymentMethodList = [
  "FPS",
  "CHAPS",
  "BACS",
];

const UkTransferScreen = ({theme, navigation}) => {
  const styles = useStyles(theme);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(false);
  const [addressCollapsed, setAddressCollapsed] = useState(false);
  const [bankCollapsed, setBankCollapsed] = useState(false);

  const [accountList, setAccountList] = useState([] as AccountDataInterface[]);
  const [currency, setCurrency] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [type, setType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [recipientAddress1, setRecipientAddress1] = useState('');
  const [recipientAddress2, setRecipientAddress2] = useState('');
  const [recipientPostalCode, setRecipientPostalCode] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [bankAddress1, setBankAddress1] = useState('');
  const [bankAddress2, setBankAddress2] = useState('');
  const [bankPostalCode, setBankPostalCode] = useState('');
  const [bankCountry, setBankCountry] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');

  const listOfCountry = useMemo(() => countryList().getData(), [])

  useEffect(() => {
    setAccountList([
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
    if (currency.length > 0 && 
      accountHolderName.length > 0 && 
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
              data={accountList}
              onSelect={(selectedItem, index) => {
                setCurrency(selectedItem.currencyData.currencyName)
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
              value={currency}
              disabled={true}
            />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                outlineColor={theme.colors.background}
                style={styles.input}
                label="Bank name"
                value={bankName}
                onChangeText={text => setBankName(text)}
              />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                outlineColor={theme.colors.background}
                style={styles.input}
                label="Account holder's name"
                value={accountHolderName}
                onChangeText={text => setAccountHolderName(text)}
              />
          </View>
          <View>
            <TextInput
                autoCapitalize="none"
                outlineColor={theme.colors.background}
                style={styles.input}
                label="Sort Code"
                value={sortCode}
                onChangeText={text => setSortCode(text)}
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
                    <Text style={styles.dropdownBtnTxt}>{selectedItem ? selectedItem : 'Type'}</Text>
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
        </View>
        
        <Collapse style={{marginTop: 20}} onToggle={setAddressCollapsed}>
          <CollapseHeader>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Recipient's address</Text>
              <FontAwesomeIcons name={addressCollapsed ? "chevron-up" : "chevron-down"} color={theme.colors.text} size={18} />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View>
              <TextInput
                  autoCapitalize="none"
                  outlineColor={theme.colors.background}
                  style={styles.input}
                  label="Address 1"
                  value={recipientAddress1}
                  onChangeText={text => setRecipientAddress1(text)}
                />
            </View>
            <View>
              <TextInput
                  autoCapitalize="none"
                  outlineColor={theme.colors.background}
                  style={styles.input}
                  label="Address 2"
                  value={recipientAddress2}
                  onChangeText={text => setRecipientAddress2(text)}
                />
            </View>
            <View>
              <TextInput
                  autoCapitalize="none"
                  outlineColor={theme.colors.background}
                  style={styles.input}
                  label="Postal Code"
                  value={recipientPostalCode}
                  onChangeText={text => setRecipientPostalCode(text)}
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
                    <Text style={styles.countryDropdownBtnTxt}>{selectedItem ? selectedItem.label : 'Country'}</Text>
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
                    <Text style={styles.countryDropdownRowTxt}>{item.label}</Text>
                  </View>
                );
              }}
            />
          </CollapseBody>
        </Collapse>

        <Collapse style={{marginTop: 20}} onToggle={setBankCollapsed}>
          <CollapseHeader>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Recipient's bank address</Text>
              <FontAwesomeIcons name={bankCollapsed ? "chevron-up" : "chevron-down"} color={theme.colors.text} size={18} />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View>
              <TextInput
                  autoCapitalize="none"
                  outlineColor={theme.colors.background}
                  style={styles.input}
                  label="Address 1"
                  value={bankAddress1}
                  onChangeText={text => setBankAddress1(text)}
                />
            </View>
            <View>
              <TextInput
                  autoCapitalize="none"
                  outlineColor={theme.colors.background}
                  style={styles.input}
                  label="Address 2"
                  value={bankAddress2}
                  onChangeText={text => setBankAddress2(text)}
                />
            </View>
            <View>
              <TextInput
                  autoCapitalize="none"
                  outlineColor={theme.colors.background}
                  style={styles.input}
                  label="Postal Code"
                  value={bankPostalCode}
                  onChangeText={text => setBankPostalCode(text)}
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
                    <Text style={styles.countryDropdownBtnTxt}>{selectedItem ? selectedItem.label : 'Country'}</Text>
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
                    <Text style={styles.countryDropdownRowTxt}>{item.label}</Text>
                  </View>
                );
              }}
            />
          </CollapseBody>
        </Collapse>
        
        <View style={{marginTop: 20}}>
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

export default withTheme(UkTransferScreen);
