import { AccountDataInterface } from "../types/interface"
import { BASE_URL, getProxyUrl } from "./common"
import { ApiEndpoint, StatusCode } from "../types/enum"
import { universalGetRequestWithParams, universalPostRequestWithData } from "./RequestHandler"

export const handleFetchAccountList = async (
  entityId: number,
  token: string,
) => {
  const url = `${BASE_URL}/${ApiEndpoint.GET_BALANCES_BYACCT_BYCURRENCY}`
  const params = {
    entityId,
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const response = await universalGetRequestWithParams(url, params, headers)
  if (response && response.status === StatusCode.OKAY) {
    const data: AccountDataInterface[] = response.data.data
    return data
  } else {
    return []
  }
}

export const refreshTheToken = async (username: string, refresh_token: string) => {
  const url = `${BASE_URL}/${ApiEndpoint.REFRESH_TOKEN}`
  const data = {
    username,
    refresh_token,
    'white-label': getProxyUrl(),
  }

  try {
    const response: any = await universalPostRequestWithData(url, data)
    if (response.status === StatusCode.OKAY) {
      const data = response.data.message
      data.expiry_time = Date.now() + data.expires_in * 1000
      data.login_time = Date.now()
      return data
    } else {
      console.log(response)
    }
    return null
  } catch {
    return null
  }
}

export const getPaymentMethodList = (accountList: AccountDataInterface[], fromAccountId: string) => {
  const paymentMethod = accountList.find((acc) => acc.accountId === fromAccountId)?.paymentMethod
  const paymentMethodList = paymentMethod ? paymentMethod.split(',') : []
  return paymentMethodList
}

export const getAvailableBalance = (accountList: AccountDataInterface[], targetAccountId: string) => {
  return (
    (accountList.find((account) => account.accountId === targetAccountId) || ({} as AccountDataInterface)).currencyData?.fundsAvailable || 0
  )
}

interface TxnParams {
  currentProfile: string
  amount: number
  paymentMethod: string
  currencyName: string
  pAndTType: string
  sortCode?: number
  bicCode?: string
}

export const getTransactionFee = async (token: string, providerName: string, params: TxnParams) => {
  const url = `${BASE_URL}/${ApiEndpoint.GET_TRANSACTION_FEE}?providerName=${providerName}`
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const response = await universalGetRequestWithParams(url, params, headers)
  if (response && response.status === StatusCode.OKAY) {
    return response.data.data
  }
  // popupNotification(response.data.message, false)
}

export const stringToFloat = (string: string) => {
  if (string == '') return Number(0.00)
  return Number(parseFloat(string).toFixed(2))
}

export const floatToString = (float: Number) => {
  return float.toFixed(2).toString()
}

export const getAccountFromAccountID = (accountList: AccountDataInterface[], accountId: string) => {
  return accountList.find((account) => account.accountId === accountId) || ({} as AccountDataInterface)
}

export const amountToBeDebited = (sendAmount: number, transFee: number) => {
  if (!transFee) return sendAmount
  return sendAmount + transFee
}
