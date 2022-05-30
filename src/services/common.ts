import AsyncStorage from '@react-native-community/async-storage';
import { PROXY_URL } from '@env';
import { LoginData } from '../types/interface';

let baseUrl = 'https://aws-wallet.cfsemoney.com';

export const BASE_URL = baseUrl;

export const getProxyUrl = () => PROXY_URL;

export const CORP_WALLET_USER_PROFILE_LIST = ['wallet_user', 'corporate_admin', 'corporate_staff']

export const getLoginData = async () => {
    const loginDataString = await AsyncStorage.getItem('loginData')
    if (!loginDataString) {
        return {} as LoginData
    }
    return JSON.parse(loginDataString) as LoginData
}

export const transferTypeList = [
    "Personal",
    "Business"
]

const isoList = {
    USD: 'us',
    GBP: 'gb',
    EUR: 'eu',
    SEK: 'se',
    HUF: 'hu',
    CZK: 'cz',
    DKK: 'dk',
    NOK: 'no',
    PLN: 'pl',
    RON: 'ro',
}

export const getIsoCodeFromCurrencyName = (currencyName: string) => {
    return currencyName.substring(0, 2).toLowerCase()
}