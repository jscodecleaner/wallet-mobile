import React, { useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { View, TouchableOpacity } from 'react-native'
import { useSelector } from "react-redux"
import Spinner from 'react-native-loading-spinner-overlay'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import styles from './TransactionHistory.style'
import { TransactionInterface } from '../../../types/Interface'
import { ApiEndpoint, StatusCode } from '../../../types/enum'
import { BASE_URL } from '../../../services/common'
import { universalGetRequestWithParams } from '../../../services/RequestHandler'

interface Props {
    iBan: string
    showModal: (subData: any) => void
}

const TransactionHistory: React.FC<Props> = ({ iBan, showModal }) => {
  const [data, setData] = useState([] as TransactionInterface[])
  const { access_token } = useSelector((state: any) => state.user)
  const [progress, setProgress] = useState(false)

  useEffect(() => {
    const getRecentTenTransactionsByIBan = async () => {
      setProgress(true)
      const url = `${BASE_URL}/${ApiEndpoint.GET_RECENT_TRANSACTION_BY_IBAN}`
      const headers = {
        Authorization: `Bearer ${access_token}`,
      }

      const data = {
        iBan: iBan,
      }

      const response: any = await universalGetRequestWithParams(url, data, headers)

      if (response.status === StatusCode.OKAY) {
        const data = response.data.data.sort(
          (a, b) => new Date(b.timeStampSettled).valueOf() - new Date(a.timeStampSettled).valueOf()
        )
        setData(data)
      }
      setProgress(false)
    }
    getRecentTenTransactionsByIBan()
  }, [iBan])

  const showDetails = (subData) => {
    showModal(subData)
  }
  
  return(
    <KeyboardAwareScrollView style={styles.listContainer}>
      <Spinner
        visible={progress}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
      { data.map((subData, index) => (
        <TouchableOpacity key={index} style={styles.list} onPress={() => showModal(subData)}>
          <View style={styles.listContent}>
            <Text style={styles.fontBold}>Time: { subData.timeStampSettled }</Text>
            <Text style={styles.fontBold}>Credit or debit: { subData.CreditOrDebit }</Text>
            <Text style={styles.fontBold}>Money in: { subData.moneyIn ? parseFloat(subData.moneyIn).toFixed(2) : '' }</Text>
            <Text style={styles.fontBold}>Money out: { subData.moneyOut ? parseFloat(subData.moneyOut).toFixed(2) : '' }</Text>
            <Text style={styles.fontBold}>Balance: { subData.balance ? parseFloat(subData.balance).toFixed(2) : '' }</Text>
          </View>
          <View styl={styles.iconContent}>
            <MaterialCommunityIcons style={styles.listIcon} name="magnify-plus" color={'#327ef6'} size={40} />
          </View>
        </TouchableOpacity>
      )) }
    </KeyboardAwareScrollView>
  )
}

export default TransactionHistory