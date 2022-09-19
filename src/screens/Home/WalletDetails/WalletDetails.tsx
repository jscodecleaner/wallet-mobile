import React, { useState } from 'react'
import { Modal, Text, withTheme } from 'react-native-paper'
import { View, SafeAreaView } from 'react-native'
import CountryFlag from "react-native-country-flag"
import getSymbolFromCurrency from 'currency-symbol-map'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

import styles from './WalletDetails.style'
import { getIsoCodeFromCurrencyName } from '../../../services/common'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { floatToString } from '../../../services/utility'
import TransactionHistory from '../TransactionHistory/TransactionHistory'

const WalletDetailsScreen = ({ theme, navigation, route }) => {
  const { walletDetails } = route.params
  const [modalVisible, setModalVisible] = useState(false)
  const [modalData, setModalData] = useState([])

  const validateButton = (acceptable: string) => {
    if (acceptable === 'INTERNATIONAL') {
      if (walletDetails.currencyData.currencyName !== 'GBP' && walletDetails.providerName === 'ClearBank (CB)')
        return "normal"
      else
        return "disabled"
    } else if (acceptable === 'ALL')
      return "normal"
    else if (acceptable === walletDetails.currencyData.currencyName)
      return "normal"
    else
      return "disabled"
  }

  const onEuroTransfer = () => {
    navigation.navigate('EuroTransfer', { fromAccount: walletDetails.accountId })
  }

  const onInternational = () => {
    navigation.navigate('InternationalTransfer', { fromAccount: walletDetails.accountId })
  }

  const onUkTransfer = () => {
    navigation.navigate('UkTransfer', { fromAccount: walletDetails.accountId })
  }

  const onToMyOtherAccount = () => {
    navigation.navigate('ToMyOtherAccount', { fromAccount: walletDetails.accountId })
  }

  const hideModal = () => {
    setModalVisible(false)
  }

  const showModal = (transferData) => {
    setModalData(transferData)
    setModalVisible(true)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.card, { borderLeftColor: theme.colors.primary, }]}>
        <View style={{ marginBottom: 30 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.fontBold}>Account name: </Text>
            <Text>{ walletDetails.accountName }</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.fontBold}>IBAN: </Text>
            <Text>{ walletDetails.iBan }</Text>
          </View>
        </View>
        <View style ={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', marginLeft: 10 }}>
            <CountryFlag isoCode={getIsoCodeFromCurrencyName(walletDetails.currencyData.currencyName)} size={25} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.fontBold}>Currency </Text>
              <Text>{ walletDetails.currencyData.currencyName }</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.fontBold}>Funds available </Text>
              <Text style={styles.fontBold}>Reserved available </Text>
              <Text style={styles.fontBold}>Account available </Text>
            </View>
            <View>
              <Text>{ getSymbolFromCurrency(walletDetails.currencyData.currencyName) }{ floatToString(walletDetails.currencyData.fundsAvailable) }</Text>
              <Text>{ getSymbolFromCurrency(walletDetails.currencyData.currencyName) }{ floatToString(walletDetails.currencyData.reservedBalance) }</Text>
              <Text>{ getSymbolFromCurrency(walletDetails.currencyData.currencyName) }{ floatToString(walletDetails.currencyData.accountBalance) }</Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <CustomButton 
          theme={theme} 
          name="Transfer between my accounts" 
          state={validateButton("ALL")} 
          onClick={onToMyOtherAccount} 
        />
        <CustomButton 
          theme={theme} 
          name="Euro Transfer" 
          state={validateButton("EUR")} 
          onClick={onEuroTransfer} 
        />
        <CustomButton 
          theme={theme} 
          name="International" 
          state={validateButton("INTERNATIONAL")} 
          onClick={onInternational} 
        />
        <CustomButton 
          theme={theme} 
          name="UK Transfer" 
          state={validateButton("GBP")} 
          onClick={onUkTransfer}
        />
      </View>
      <Text style={styles.TransactionTitle}>Recent Transactions for <Text style={styles.TransactionTitleBold}>{ walletDetails.accountName }</Text></Text>
      <TransactionHistory iBan={walletDetails.iBan} showModal={showModal}/>
      <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Transaction information</Text>
        <KeyboardAwareScrollView style={styles.modalScroll}>
          <View style={styles.modalGroup}>
            <Text style={styles.modalGroupName}>Sender details</Text>
            <Text style={styles.modalText}>From account holder name: <Text style={styles.modalValue}>{ modalData.benOwnerName ? modalData.benOwnerName : '' }</Text></Text>
            <Text style={styles.modalText}>From account IBAN: <Text style={styles.modalValue}>{ modalData.iBan ? modalData.iBan : '' }</Text></Text>
            <Text style={styles.modalText}>Amount: <Text style={styles.modalValue}>{ modalData.moneyOut ? parseFloat(modalData.moneyOut).toFixed(2) : '' }</Text></Text>
            <Text style={styles.modalText}>From Currency: <Text style={styles.modalValue}>{ modalData.fromCurrency ? modalData.fromCurrency : '' }</Text></Text>
            <Text style={styles.modalText}>Created ts: <Text style={styles.modalValue}>{ modalData.timeStampCreated ? modalData.timeStampCreated : '' }</Text></Text>
          </View>
          <View style={styles.modalGroup}>
            <Text style={styles.modalGroupName}>Additional details</Text>
            <Text style={styles.modalText}>Credit or debit: <Text style={styles.modalValue}>{ modalData.CreditOrDebit ? modalData.CreditOrDebit : '' }</Text></Text>
            <Text style={styles.modalText}>End to end txn ID: <Text style={styles.modalValue}>{ modalData.endToEndTxnId ? modalData.endToEndTxnId : '' }</Text></Text>
            <Text style={styles.modalText}>Payment reference: <Text style={styles.modalValue}>{ modalData.reference ? modalData.reference : '' }</Text></Text>
            <Text style={styles.modalText}>Transaction status: <Text style={styles.modalValue}>{ modalData.status ? modalData.status : '' }</Text></Text>
            <Text style={styles.modalText}>User txn ID: <Text style={styles.modalValue}>{ modalData.transactionId ? modalData.transactionId : '' }</Text></Text>
            
          </View>
          <View style={styles.modalGroup}>
            
            <Text style={styles.modalGroupName}>Receiver details</Text>
            <Text style={styles.modalText}>To account holder name: <Text style={styles.modalValue}>{ modalData.transactionOwnerName ? modalData.transactionOwnerName : '' }</Text></Text>
            <Text style={styles.modalText}>To Currency: <Text style={styles.modalValue}>{ modalData.toCurrency ? modalData.toCurrency : '' }</Text></Text>
            <Text style={styles.modalText}>To account IBAN: <Text style={styles.modalValue}>{ modalData.benIban ? modalData.benIban : '' }</Text></Text>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.modalButtonContainer}>
          <CustomButton 
            theme={theme} 
            name="Close" 
            state={"normal"} 
            onClick={hideModal} 
          />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default withTheme(WalletDetailsScreen)
