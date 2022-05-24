import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { SafeAreaView, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, Text, TextInput, withTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import CustomButton from '../../../components/CustomButton/CustomButton';
import { useStyles } from '../PaymentTransfer.style';
import { BASE_URL, getProxyUrl } from '../../../services/common';
import { ApiEndpoint, StatusCode } from '../../../types/enum';\
import { universalPostRequestWithData } from '../../../services/RequestHandler';

const ConfirmPayment = ({theme, navigation, route}) => {
  const {loginData} = useSelector((state: any) => state.user);
  
  const [progress, setProgress] = useState(true);

  const styles = useStyles(theme);
  const {transactionDetails} = route.params;

  useEffect(() => {

  }, [])

  const onConfirm = () => {
    setProgress(true)
    const url = `${BASE_URL}/${ApiEndpoint.CREATE_TRANSACTION_TO_SELF}`
    const headers = {
        Authorization: `Bearer ${loginData.access_token}`,
    }
    const data = { ...transactionDetails }

    const response = await universalPostRequestWithData(url, data, headers)
    if (response && response.status === StatusCode.OKAY) {
        // popupNotification(response.data.message, true)
        // setActiveStep(activeStep + 1)
    } else {
        // popupNotification(response.data.message, false)
    }

    setProgress(false)
  }

  const onEdit = () => {
    navigation.navigate("ToMyOtherAccount")
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
      <View style={styles.transactionContainer}>
        <View style={styles.row}>
          <Text style={styles.leftText}>From</Text>
          <Text style={styles.rightText}>{transactionDetails.fromAccountName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>To</Text>
          <Text style={styles.rightText}>{transactionDetails.toAccountName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>Details</Text>
          <Text style={styles.rightText}>{transactionDetails.details}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>Amount</Text>
          <Text style={styles.rightText}>{transactionDetails.amount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>Transfer fee</Text>
          <Text style={styles.rightText}>{transactionDetails.feeAmount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>To be credited</Text>
          <Text style={styles.rightText}>{transactionDetails.amount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftText}>To be debited</Text>
          <Text style={styles.rightText}>{transactionDetails.amount}</Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <View style={{width: '50%', paddingHorizontal: 20}}>
          <CustomButton theme={theme} name="Edit" onClick={onEdit} />
        </View>
        <View style={{width: '50%', paddingHorizontal: 20}}>
          <CustomButton theme={theme} name="Confirm" onClick={onConfirm} />
        </View>
      </View>
    </SafeAreaView>
  )
};

export default withTheme(ConfirmPayment);
